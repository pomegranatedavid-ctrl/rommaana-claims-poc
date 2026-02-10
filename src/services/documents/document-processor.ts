import ocrService from '../ai/ocr-service';
import llmService from '../ai/llm-service';

/**
 * Intelligent Document Processing (IDP) Service
 * Specialized extraction logic for insurance documents
 */

export interface ProcessedDocument {
    type: string;
    confidence: number;
    data: any;
    rawText: string;
    summary: string;
}

class DocumentProcessor {

    /**
     * Process a document with specialized logic based on type
     */
    async process(imageUrl: string, suggestedType?: string): Promise<ProcessedDocument> {
        // 1. Get raw text from OCR
        const { text, confidence } = await ocrService.extractText(imageUrl);

        // 2. Classify if type not provided
        let type = suggestedType;
        if (!type) {
            const classification = await llmService.classify(
                text.substring(0, 1000),
                [
                    'saudi_id',
                    'vehicle_registration',
                    'medical_report',
                    'repair_invoice',
                    'accident_report', // Najm/Taqdeer
                    'policy_document',
                    'other'
                ]
            );
            type = classification.category;
        }

        // 3. Extract structured data based on type
        let data: any = {};
        let summary = '';

        switch (type) {
            case 'medical_report':
                data = await this.extractMedicalReport(text);
                summary = `Medical report from ${data.hospital_name} for ${data.patient_name}. Diagnosis: ${data.diagnosis}.`;
                break;

            case 'repair_invoice':
                data = await this.extractRepairInvoice(text);
                summary = `Repair invoice from ${data.workshop_name}. Total Amount: ${data.total_amount}.`;
                break;

            case 'accident_report':
                data = await this.extractAccidentReport(text);
                summary = `Accident report. Location: ${data.location}. Fault: ${data.fault_percentage}%.`;
                break;

            case 'saudi_id':
                data = await this.extractSaudiID(text);
                summary = `Saudi ID for ${data.full_name_english} (${data.id_number}).`;
                break;

            case 'vehicle_registration':
                data = await this.extractVehicleRegistration(text);
                summary = `Registration for ${data.vehicle_make} ${data.vehicle_model} (${data.plate_number}).`;
                break;

            default:
                data = await llmService.extractJSON(`Extract key value pairs from this document:\n${text}`);
                summary = 'Document processed.';
        }

        return {
            type: type || 'unknown',
            confidence,
            data,
            rawText: text,
            summary,
        };
    }

    // --- Specialized Extractors ---

    private async extractMedicalReport(text: string) {
        return await llmService.extractJSON(
            `Extract medical report details:
      ${text}
      
      Required fields:
      - hospital_name
      - patient_name
      - date_of_visit
      - diagnosis (summary)
      - treatments (list)
      - doctor_name
      - insurance_policy_number (if present)`
        );
    }

    private async extractRepairInvoice(text: string) {
        return await llmService.extractJSON(
            `Extract repair invoice details:
      ${text}
      
      Required fields:
      - workshop_name
      - workshop_cr (registration number)
      - invoice_number
      - date
      - vehicle_details (make, model, plate)
      - parts_cost
      - labor_cost
      - vat_amount
      - total_amount
      - line_items (array of {description, amount})`
        );
    }

    private async extractAccidentReport(text: string) {
        return await llmService.extractJSON(
            `Extract accident report (Najm/Muroor) details:
      ${text}
      
      Required fields:
      - report_number
      - date_time
      - location
      - weather_conditions
      - fault_percentage (for the policy holder)
      - other_parties (array of {name, plate_number, insurance_company})
      - damage_description`
        );
    }

    private async extractSaudiID(text: string) {
        // Re-using logic from OCR service but refined here
        return await llmService.extractJSON(
            `Extract Saudi ID details:
      ${text}
      
      Required fields: 
      - id_number (10 digits)
      - full_name_arabic
      - full_name_english
      - date_of_birth (Hijri/Gregorian)
      - expiry_date
      - place_of_birth`
        );
    }

    private async extractVehicleRegistration(text: string) {
        return await llmService.extractJSON(
            `Extract Vehicle Registration (Istimara) details:
      ${text}
      
      Required fields: 
      - plate_number
      - owner_name
      - vehicle_make
      - vehicle_model
      - year
      - color
      - vin (chassis number)
      - expiry_date`
        );
    }
}

export const documentProcessor = new DocumentProcessor();
export default documentProcessor;
