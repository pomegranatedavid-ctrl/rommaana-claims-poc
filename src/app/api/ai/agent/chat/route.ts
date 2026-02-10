import { NextRequest, NextResponse } from 'next/server';
import claimsAgent from '@/services/agents/claims-agent';
import policyAgent from '@/services/agents/policy-agent';
import supportAgent from '@/services/agents/support-agent';
import complianceAgent from '@/services/agents/compliance-agent';
import type { AgentContext } from '@/services/agents/base-agent';

/**
 * API Route: /api/ai/agent/chat
 * Handle multi-agent chat conversations
 */

const agents = {
    claims: claimsAgent,
    policy: policyAgent,
    support: supportAgent,
    compliance: complianceAgent,
};

export type AgentType = keyof typeof agents;

export async function POST(request: NextRequest) {
    const requestId = crypto.randomUUID();
    try {
        const body = await request.json();
        console.log(`[${requestId}] Chat API Request:`, JSON.stringify({
            agentType: body.agentType,
            conversationId: body.conversationId,
            messageLength: body.message?.length,
            language: body.language
        }, null, 2));

        const { agentType, message, conversationId, language = 'both' } = body;

        // Validate required fields
        if (!agentType || !message || !conversationId) {
            console.warn(`[${requestId}] Missing required fields`);
            return NextResponse.json(
                { error: 'Missing required fields: agentType, message, conversationId' },
                { status: 400 }
            );
        }

        // Get the appropriate agent
        const agent = agents[agentType as AgentType];
        if (!agent) {
            console.warn(`[${requestId}] Invalid agent type: ${agentType}`);
            return NextResponse.json(
                { error: `Invalid agent type: ${agentType}. Valid types: ${Object.keys(agents).join(', ')}` },
                { status: 400 }
            );
        }

        // Build context
        const context: AgentContext = {
            conversationId,
            language,
            metadata: {
                userAgent: request.headers.get('user-agent'),
                timestamp: new Date().toISOString(),
                requestId,
            },
        };

        // Chat with agent
        const response = await agent.chat(message, context);
        console.log(`[${requestId}] Agent Chat Response:`, JSON.stringify({
            success: true,
            tokens: response.metadata?.usage?.totalTokens
        }, null, 2));

        return NextResponse.json({
            success: true,
            agent: agentType,
            response,
            requestId,
        });
    } catch (error) {
        console.error(`[${requestId}] Agent chat error:`, error);

        // Log deep details for Vercel debugging
        if (error instanceof Error) {
            console.error(`[${requestId}] Stack:`, error.stack);
            console.error(`[${requestId}] Cause:`, error.cause);
        }

        return NextResponse.json(
            {
                error: 'Failed to process message',
                details: error instanceof Error ? error.message : 'Unknown error',
                requestId,
                // Only expose stack in development
                stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    // Get list of available agents
    const agentList = Object.entries(agents).map(([key, agent]) => ({
        type: key,
        ...agent.getMetadata(),
    }));

    return NextResponse.json({
        agents: agentList,
    });
}
