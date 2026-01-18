import { AgentService } from "@/lib/agent/service";

export class VoiceChannel {
    static async handleIncomingCall(from: string, callSid: string): Promise<string> {
        // Initial greeting
        return `
        <Response>
            <Say voice="alice" language="en-US">Welcome to Rommaana Insurance. connecting you to our AI agent.</Say>
            <Gather input="speech" action="/api/agent?flow=voice_gather" language="en-US" timeout="5">
                <Say voice="alice" language="en-US">How can I help you today?</Say>
            </Gather>
        </Response>
        `;
    }

    static async handleSpeechInput(speechResult: string, callSid: string): Promise<string> {
        const responseText = await AgentService.handleMessage({
            sessionId: callSid,
            channel: "voice",
            locale: "en-US" // Dynamically detect later
        }, speechResult);

        return `
        <Response>
            <Say voice="alice" language="en-US">${responseText}</Say>
            <Gather input="speech" action="/api/agent?flow=voice_gather" language="en-US" timeout="5">
                 <!-- Wait for next input -->
            </Gather>
        </Response>
        `;
    }
}
