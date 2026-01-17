import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { image, prompt } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Convert base64 to parts for Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // The image should be sent as base64 from the frontend
        const imageData = image.split(",")[1]; // Remove metadata prefix if present

        const result = await model.generateContent([
            prompt || "Analyze this insurance claim image for damage.",
            {
                inlineData: {
                    data: imageData,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Gemini Vision Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
