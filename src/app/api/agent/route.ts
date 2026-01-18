import { NextRequest, NextResponse } from "next/server";
import { AgentService } from "@/lib/agent/service";
import { VoiceChannel } from "@/lib/agent/channels/voice";
import { WhatsappChannel } from "@/lib/agent/channels/whatsapp";

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get("content-type");
        const url = new URL(req.url);
        const flow = url.searchParams.get("flow"); // e.g. 'voice_gather'

        const body = await req.text();
        const params = new URLSearchParams(body);
        const from = params.get("From") || "unknown";
        const bodyText = params.get("Body");
        const callSid = params.get("CallSid");
        const speechResult = params.get("SpeechResult");

        // DETECT CHANNEL
        let channel: "voice" | "whatsapp" | "sms" = "sms";
        if (callSid) channel = "voice";
        if (from.startsWith("whatsapp:")) channel = "whatsapp";

        console.log(`[Agent] Incoming ${channel} event from ${from}. Flow: ${flow}`);

        // --- VOICE CHANNEL ---
        if (channel === "voice" && callSid) {
            let responseXml = "";

            if (flow === "voice_gather" && speechResult) {
                // Handle speech input from previous turn
                responseXml = await VoiceChannel.handleSpeechInput(speechResult, callSid);
            } else {
                // New Call or default
                responseXml = await VoiceChannel.handleIncomingCall(from, callSid);
            }

            return new NextResponse(responseXml, { headers: { "Content-Type": "text/xml" } });
        }

        // --- WHATSAPP / SMS ---
        if (bodyText) {
            // Retrieve media if any (Twilio sends MediaUrl0, MediaUrl1...)
            const mediaUrl = params.get("MediaUrl0") || undefined;

            const responseXml = await WhatsappChannel.handleMessage(from, bodyText, mediaUrl);
            return new NextResponse(responseXml, { headers: { "Content-Type": "text/xml" } });
        }

        return NextResponse.json({ status: "ok", message: "No action taken" });

    } catch (error) {
        console.error("[Agent API Error]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
