import { supabase } from "@/lib/supabase"; // Assuming existing supabase client or we need to add it
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface AgentContext {
    userId?: string;
    sessionId: string;
    channel: "voice" | "whatsapp" | "web" | "sms" | "email";
    locale: "en-US" | "ar-SA";
}

export class AgentService {
    static async handleMessage(context: AgentContext, updatedTextOrAudio: string): Promise<string> {
        // 1. Retrieve history
        // 2. Classify intent
        // 3. Call Tools (if needed)
        // 4. Generate Response

        const prompt = `
    You are Rommaana, an intelligent insurance assistant for the Saudi Arabian market.
    Language: ${context.locale === 'ar-SA' ? 'Arabic (Saudi Dialect/Khaleeji)' : 'English'}.
    User Input: ${updatedTextOrAudio}
    
    Provide a helpful, professional, and culturally appropriate response.
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            return response;
        } catch (error) {
            console.error("AI Generation Error:", error);
            return context.locale === 'ar-SA'
                ? "عذراً، أواجه مشكلة تقنية حالياً. يرجى المحاولة لاحقاً."
                : "I'm sorry, I'm experiencing technical difficulties. Please try again later.";
        }
    }
}
