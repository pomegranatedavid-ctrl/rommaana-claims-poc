import { NextRequest, NextResponse } from 'next/server';
import ragService from '@/services/ai/rag-service';

/**
 * API Route: /api/ai/rag/query
 * Query the RAG system for regulatory information
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { question, maxResults = 5, language = 'both' } = body;

        if (!question) {
            return NextResponse.json(
                { error: 'Missing required field: question' },
                { status: 400 }
            );
        }

        const response = await ragService.query({
            question,
            maxResults,
            language,
        });

        return NextResponse.json({
            success: true,
            ...response,
        });
    } catch (error) {
        console.error('RAG query error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process RAG query',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
