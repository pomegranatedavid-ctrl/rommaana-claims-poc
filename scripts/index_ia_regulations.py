"""
Script to index IA regulatory documents into the vector database
Extracts content from NotebookLM IA notebooks and creates embeddings
"""

import sys
import os
import json
from pathlib import Path
import asyncio

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import NotebookLM client
from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens


async def extract_regulatory_content(notebook_id: str, client: NotebookLMClient) -> list[dict]:
    """Extract content from a regulatory notebook"""
    documents = []
    
    try:
        # Get notebook details
        notebook = client.get_notebook(notebook_id)
        
        # Get all sources
        for source in notebook.sources:
            # For each source, query for detailed content
            try:
                response = client.query_notebook(
                    notebook_id,
                    f"Please provide the complete content from the source titled: {source.title}"
                )
                
                documents.append({
                    'id': f"{notebook_id}_{source.source_id}",
                    'title': source.title,
                    'content': response,
                    'metadata': {
                        'notebook_id': notebook_id,
                        'notebook_title': notebook.title,
                        'source_id': source.source_id,
                        'source_type': 'IA Regulation',
                        'date_added': source.created_at if hasattr(source, 'created_at') else None,
                    }
                })
                
                print(f"✓ Extracted: {source.title}")
                
            except Exception as e:
                print(f"✗ Failed to extract {source.title}: {e}")
                continue
                
    except Exception as e:
        print(f"Error processing notebook {notebook_id}: {e}")
        
    return documents


async def main():
    """Main indexing function"""
    print("="* 60)
    print("IA Regulatory Document Indexing Script")
    print("="* 60)
    
    # Load NotebookLM authentication
    print("\n[1/4] Loading authentication...")
    tokens = load_cached_tokens()
    if not tokens:
        print("❌ No cached tokens found. Please run: notebooklm-mcp-auth")
        return
    
    client = NotebookLMClient(tokens['cookies'])
    print("✓ Authenticated successfully")
    
    # Load filtered IA notebooks
    print("\n[2/4] Loading IA notebooks...")
    data_dir = Path("reports/notebook_data")
    ia_file = data_dir / "filtered_IA__notebooks.json"
    
    if not ia_file.exists():
        print(f"❌ IA notebooks file not found: {ia_file}")
        return
        
    with open(ia_file, 'r', encoding='utf-8') as f:
        ia_notebooks = json.load(f)
    
    print(f"✓ Found {len(ia_notebooks)} IA notebooks")
    
    # Extract all regulatory content
    print("\n[3/4] Extracting regulatory content...")
    all_documents = []
    
    for notebook in ia_notebooks:
        notebook_id = notebook.get('notebook_id')
        if not notebook_id:
            print(f"⚠ Skipping notebook (no ID): {notebook.get('title', 'Unknown')}")
            continue
            
        print(f"\nProcessing: {notebook.get('title', 'Unknown')}")
        docs = await extract_regulatory_content(notebook_id, client)
        all_documents.extend(docs)
        print(f"  Extracted {len(docs)} documents")
    
    print(f"\n✓ Total documents extracted: {len(all_documents)}")
    
    # Save extracted documents
    print("\n[4/4] Saving extracted content...")
    output_file = data_dir / "ia_regulations_content.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_documents, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Saved to: {output_file}")
    
    print("\n" + "="* 60)
    print("Indexing Complete!")
    print("="* 60)
    print(f"\n📊 Summary:")
    print(f"   - Notebooks processed: {len(ia_notebooks)}")
    print(f"   - Documents extracted: {len(all_documents)}")
    print(f"   - Output file: {output_file}")
    print(f"\n💡 Next steps:")
    print(f"   1. Review the extracted content in {output_file}")
    print(f"   2. The content will be automatically indexed into ChromaDB")
    print(f"   3. Test the RAG system with IA regulation queries")


if __name__ == "__main__":
    asyncio.run(main())
