import llmService from '../ai/llm-service';

/**
 * Policy Generator Service
 * Generates insurance policy documents based on templates and data
 */

export interface PolicyData {
    quoteId: string;
    policyNumber: string;
    customerName: string;
    vehicleDetails: string;
    coverageType: string;
    premium: number;
    validFrom: string;
    validTo: string;
}

class PolicyGenerator {

    /**
     * Generate a policy document (Mock PDF generation)
     */
    async generatePolicy(data: PolicyData, language: 'en' | 'ar' = 'en'): Promise<{ url: string; content: string }> {
        console.log(`Generating policy ${data.policyNumber}...`);

        // In a real app, this would use a PDF library like pdfkit or playwrite
        // For POC, we generate a markdown/HTML representation

        const template = language === 'ar' ? this.getArabicTemplate() : this.getEnglishTemplate();

        // Fill template (Simple robust string replacement)
        let content = template
            .replace('{{POLICY_NUMBER}}', data.policyNumber)
            .replace('{{CUSTOMER_NAME}}', data.customerName)
            .replace('{{VEHICLE}}', data.vehicleDetails)
            .replace('{{COVERAGE}}', data.coverageType)
            .replace('{{PREMIUM}}', data.premium.toString())
            .replace('{{VALID_FROM}}', data.validFrom)
            .replace('{{VALID_TO}}', data.validTo)
            .replace('{{DATE}}', new Date().toISOString().split('T')[0]);

        // Use LLM to add specific clauses if needed (e.g. for high risk)
        // content = await this.enrichPolicy(content, data);

        return {
            url: `/documents/policies/${data.policyNumber}.pdf`, // Mock URL
            content,
        };
    }

    private getEnglishTemplate(): string {
        return `
# INSURANCE POLICY SCHEDULE
Policy Number: {{POLICY_NUMBER}}
Date: {{DATE}}

## INSURED DETAILS
Name: {{CUSTOMER_NAME}}

## VEHICLE DETAILS
Vehicle: {{VEHICLE}}

## COVERAGE DETAILS
Type: {{COVERAGE}}
Period of Insurance: From {{VALID_FROM}} to {{VALID_TO}}
Total Premium: {{PREMIUM}} SAR

## TERMS AND CONDITIONS
This policy is issued subject to the Standard Unified Motor Insurance Policy wording approved by the Insurance Authority (IA).

1. The Company agrees to indemnify the Insured against loss or damage to the Insured Vehicle.
2. The Insured must declare all material facts.
3. In case of accident, notify the Company immediately.

Authorized Signatory
Rommaana Insurance Co.
    `;
    }

    private getArabicTemplate(): string {
        return `
# جدول وثيقة التأمين
رقم الوثيقة: {{POLICY_NUMBER}}
التاريخ: {{DATE}}

## بيانات المؤمن له
الاسم: {{CUSTOMER_NAME}}

## بيانات المركبة
المركبة: {{VEHICLE}}

## تفاصيل التغطية
النوع: {{COVERAGE}}
مدة التأمين: من {{VALID_FROM}} إلى {{VALID_TO}}
إجمالي القسط: {{PREMIUM}} ريال سعودي

## الشروط والأحكام
صدرت هذه الوثيقة وفقاً للوثيقة الموحدة للتأمين الإلزامي على المركبات المعتمدة من هيئة التأمين.

1. تلتزم الشركة بتعويض المؤمن له عن الخسارة أو الضرر الذي يلحق بالمركبة المؤمن عليها.
2. يجب على المؤمن له الإفصاح عن كافة الحقائق الجوهرية.
3. في حال وقوع حادث، يجب إبلاغ الشركة فوراً.

المفوض بالتوقيع
شركة رمانة للتأمين
    `;
    }
}

export const policyGenerator = new PolicyGenerator();
export default policyGenerator;
