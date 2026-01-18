import { AgentService } from "@/lib/agent/service";

export class WhatsappChannel {
    static async handleMessage(from: string, body: string, mediaUrl?: string): Promise<string> {

        let messageContent = body;
        if (mediaUrl) {
            messageContent += ` [User uploaded image: ${mediaUrl}]`;
        }

        const responseText = await AgentService.handleMessage({
            sessionId: from,
            channel: "whatsapp",
            locale: "en-US" // Determine from phone number or historic context
        }, messageContent);

        return `
        <Response>
            <Message>${responseText}</Message>
        </Response>
        `;
    }
}
