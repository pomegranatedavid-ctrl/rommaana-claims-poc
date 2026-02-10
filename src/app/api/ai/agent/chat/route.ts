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
    try {
        const body = await request.json();
        console.log('Chat API Request:', JSON.stringify(body, null, 2));
        const { agentType, message, conversationId, language = 'both' } = body;

        // Validate required fields
        if (!agentType || !message || !conversationId) {
            return NextResponse.json(
                { error: 'Missing required fields: agentType, message, conversationId' },
                { status: 400 }
            );
        }

        // Get the appropriate agent
        const agent = agents[agentType as AgentType];
        if (!agent) {
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
            },
        };

        // Chat with agent
        const response = await agent.chat(message, context);
        console.log('Agent Chat Response:', JSON.stringify(response, null, 2));

        return NextResponse.json({
            success: true,
            agent: agentType,
            response,
        });
    } catch (error) {
        console.error('Agent chat error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process message',
                details: error instanceof Error ? error.message : 'Unknown error',
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
