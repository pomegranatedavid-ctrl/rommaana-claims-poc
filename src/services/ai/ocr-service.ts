import { createWorker } from 'tesseract.js';
import llmService from './llm-service';

/**
 * OCR Service
 * Extracts text and structured data from documents (ID cards, invoices, reports)
 */

export interface ExtractedDocument {
    text: string;
    confidence: number;
    type: string;
    data: Record<string, any>;
}

class OCRService {
    private workerPromise: Promise<Tesseract.Worker> | null = null;

    constructor() {
        // Lazy load worker
    }

    private async getWorker() {
        if (!this.workerPromise) {
            this.workerPromise = (async () => {
                const worker = await createWorker('eng+ara'); // Support English and Arabic
                return worker;
            })();
        }
        return this.workerPromise;
    }

    /**
     * Extract text from an image
     */
    async extractText(
        imageUrl: string,
        languages: string = 'eng+ara'
    ): Promise<{ text: string; confidence: number }> {
        try {
            const worker = await this.getWorker();
            const ret = await worker.recognize(imageUrl);

            return {
                text: ret.data.text,
                confidence: ret.data.confidence,
            };
        } catch (error) {
            console.error('OCR Error:', error);
            throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Process a document and extract structured data
     */
    async processDocument(
        imageUrl: string,
        documentType?: string
    ): Promise<ExtractedDocument> {
        try {
            // 1. Perform OCR
            const { text, confidence } = await this.extractText(imageUrl);

            // 2. Identify document type if not provided
            let type = documentType;
            if (!type) {
                const classification = await llmService.classify(
                    text.substring(0, 500), // Classify based on first 500 chars
                    ['saudi_id', 'vehicle_registration', 'medical_report', 'repair_invoice', 'police_report', 'other']
                );
                type = classification.category;
            }

            // 3. Extract structured data based on type
            let data: Record<string, any> = {};

            if (type === 'saudi_id') {
                data = await llmService.extractJSON(
                    `Extract Saudi ID details from this text:
          ${text}
          
          Required fields: id_number, full_name_arabic, full_name_english, date_of_birth, expiry_date`
                );
            } else if (type === 'vehicle_registration') {
                data = await llmService.extractJSON(
                    `Extract Vehicle Registration (Istimara) details:
          ${text}
          
          Required fields: plate_number, owner_name, vehicle_make, vehicle_model, year, vin, expiry_date`
                );
            } else {
                // Generic extraction
                data = await llmService.extractJSON(
                    `Extract key information from this ${type}:
          ${text}`
                );
            }

            return {
                text,
                confidence,
                type: type || 'unknown',
                data,
            };

        } catch (error) {
            console.error('Document Processing Error:', error);
            throw new Error(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const ocrService = new OCRService();
export default ocrService;
