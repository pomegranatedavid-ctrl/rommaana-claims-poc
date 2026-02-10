import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { image, prompt } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Use Gemini 1.5 Flash for multimodal analysis
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imageData = image.split(",")[1];

        const result = await model.generateContent([
            {
                inlineData: {
                    data: imageData,
                    mimeType: "image/jpeg",
                },
            },
            { text: prompt || "Analyze this insurance claim image for damage." },
        ]);

        const response = await result.response;
        let text = response.text();

        // Ensure we only return the JSON part if the model included markdown
        if (text.includes("```json")) {
            text = text.split("```json")[1].split("```")[0].trim();
        } else if (text.includes("```")) {
            text = text.split("```")[1].split("```")[0].trim();
        }

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Gemini Vision Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
