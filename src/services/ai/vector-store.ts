import { ChromaClient, Collection } from 'chromadb';
import llmService from './llm-service';

/**
 * Vector Store Service using ChromaDB
 * Handles document embedding, storage, and semantic search
 */

export interface Document {
    id: string;
    content: string;
    metadata: Record<string, any>;
    embedding?: number[];
}

export interface SearchResult {
    id: string;
    content: string;
    metadata: Record<string, any>;
    similarity: number;
}

export interface VectorStoreConfig {
    collectionName: string;
    path?: string;
}

class VectorStore {
    private client: ChromaClient;
    private collections: Map<string, Collection>;

    constructor() {
        // Initialize ChromaDB client
        this.client = new ChromaClient({
            path: process.env.CHROMADB_PATH || 'http://localhost:8000',
        });
        this.collections = new Map();
    }

    /**
     * Get or create a collection
     */
    async getCollection(name: string): Promise<Collection | null> {
        if (this.collections.has(name)) {
            return this.collections.get(name)!;
        }

        try {
            const chromadbPath = process.env.CHROMADB_PATH || 'http://localhost:8000';
            console.log(`Getting ChromaDB collection: ${name} at ${chromadbPath}`);

            // Check connectivity first with a HEAD/GET request to avoid hanging
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

                await fetch(`${chromadbPath}/api/v1/heartbeat`, {
                    method: 'GET',
                    signal: controller.signal
                }).catch(() => {
                    // Ignore fetch errors, just checking if valid URL
                }).finally(() => clearTimeout(timeoutId));
            } catch (e) {
                console.warn(`ChromaDB heartbeat failed at ${chromadbPath}, vector store may be unreachable.`);
                return null;
            }

            // Try to get existing collection with timeout race
            const getCollectionPromise = this.client.getCollection({ name });

            const collection = await Promise.race([
                getCollectionPromise,
                new Promise<null>((_, reject) => setTimeout(() => reject(new Error('ChromaDB connection timed out')), 3000))
            ]).catch(err => {
                console.warn(`ChromaDB getCollection timed out or failed: ${err.message}`);
                return null;
            });

            if (collection) {
                this.collections.set(name, collection as Collection);
                return collection as Collection;
            }

            console.warn(`Collection ${name} not found, attempting to create...`);

            // Collection doesn't exist, create it
            const newCollection = await this.client.createCollection({
                name,
                metadata: {
                    'hnsw:space': 'cosine',
                    description: `Vector collection for ${name}`,
                },
            });
            this.collections.set(name, newCollection);
            return newCollection;

        } catch (error) {
            console.error(`Failed to get or create collection ${name}. Vector Search will be disabled. Error:`, error);
            return null;
        }
    }

    /**
     * Add documents to a collection
     */
    async addDocuments(
        collectionName: string,
        documents: Document[]
    ): Promise<void> {
        try {
            const collection = await this.getCollection(collectionName);

            if (!collection) {
                console.warn(`Cannot add documents to ${collectionName}: Vector Store unreachable.`);
                return;
            }

            // Generate embeddings for all documents
            const contents = documents.map(doc => doc.content);
            const embeddings = await llmService.embedBatch(contents);

            // Prepare data for ChromaDB
            const ids = documents.map(doc => doc.id);
            const metadatas = documents.map(doc => doc.metadata);

            // Add to collection
            await collection.add({
                ids,
                embeddings,
                documents: contents,
                metadatas,
            });

            console.log(`Added ${documents.length} documents to collection: ${collectionName}`);
        } catch (error) {
            console.error('Error adding documents:', error);
            // Don't throw, just log. We don't want to crash the app if vector store is down.
        }
    }

    /**
     * Search for similar documents
     */
    async search(
        collectionName: string,
        query: string,
        options: {
            limit?: number;
            filter?: Record<string, any>;
            threshold?: number;
        } = {}
    ): Promise<SearchResult[]> {
        try {
            const collection = await this.getCollection(collectionName);

            if (!collection) {
                console.warn(`Cannot search ${collectionName}: Vector Store unreachable.`);
                return [];
            }

            // Generate query embedding
            const queryEmbedding = await llmService.embed(query);

            // Perform search
            const results = await collection.query({
                queryEmbeddings: [queryEmbedding],
                nResults: options.limit || 10,
                where: options.filter,
            });

            // Transform results
            const searchResults: SearchResult[] = [];

            if (results.ids && results.ids[0]) {
                for (let i = 0; i < results.ids[0].length; i++) {
                    const distance = results.distances?.[0]?.[i] ?? 0;
                    const similarity = 1 - distance; // Convert distance to similarity

                    // Apply threshold filter
                    if (options.threshold && similarity < options.threshold) {
                        continue;
                    }

                    searchResults.push({
                        id: results.ids[0][i],
                        content: results.documents?.[0]?.[i] as string || '',
                        metadata: results.metadatas?.[0]?.[i] as Record<string, any> || {},
                        similarity,
                    });
                }
            }

            return searchResults;
        } catch (error) {
            console.error('Error searching documents:', error);
            throw new Error(`Failed to search documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get document by ID
     */
    async getDocument(
        collectionName: string,
        id: string
    ): Promise<Document | null> {
        try {
            const collection = await this.getCollection(collectionName);

            if (!collection) {
                return null;
            }

            const results = await collection.get({
                ids: [id],
            });

            if (!results.ids || results.ids.length === 0) {
                return null;
            }

            return {
                id: results.ids[0],
                content: results.documents?.[0] as string || '',
                metadata: results.metadatas?.[0] as Record<string, any> || {},
            };
        } catch (error) {
            console.error('Error getting document:', error);
            return null;
        }
    }

    /**
     * Update document
     */
    async updateDocument(
        collectionName: string,
        document: Document
    ): Promise<void> {
        try {
            const collection = await this.getCollection(collectionName);

            if (!collection) {
                return;
            }

            // Generate new embedding
            const embedding = await llmService.embed(document.content);

            await collection.update({
                ids: [document.id],
                embeddings: [embedding],
                documents: [document.content],
                metadatas: [document.metadata],
            });

            console.log(`Updated document: ${document.id}`);
        } catch (error) {
            console.error('Error updating document:', error);
            throw new Error(`Failed to update document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete document
     */
    async deleteDocument(
        collectionName: string,
        id: string
    ): Promise<void> {
        try {
            const collection = await this.getCollection(collectionName);

            if (!collection) {
                return;
            }

            await collection.delete({
                ids: [id],
            });

            console.log(`Deleted document: ${id}`);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw new Error(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete collection
     */
    async deleteCollection(name: string): Promise<void> {
        try {
            await this.client.deleteCollection({ name });
            this.collections.delete(name);
            console.log(`Deleted collection: ${name}`);
        } catch (error) {
            console.error('Error deleting collection:', error);
            throw new Error(`Failed to delete collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * List all collections
     */
    async listCollections(): Promise<string[]> {
        try {
            const collections = await this.client.listCollections();
            return collections.map(c => c.name);
        } catch (error) {
            console.error('Error listing collections:', error);
            return [];
        }
    }

    /**
     * Get collection stats
     */
    async getCollectionStats(name: string): Promise<{
        name: string;
        count: number;
        metadata: Record<string, any>;
    }> {
        try {
            const collection = await this.getCollection(name);

            if (!collection) {
                return {
                    name,
                    count: 0,
                    metadata: { error: 'Vector Store unreachable' }
                };
            }

            const count = await collection.count();

            return {
                name,
                count,
                metadata: {}, // ChromaDB doesn't expose collection metadata easily
            };
        } catch (error) {
            console.error('Error getting collection stats:', error);
            throw new Error(`Failed to get collection stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

// Export singleton instance
export const vectorStore = new VectorStore();
export default vectorStore;
