# Rommaana AI Insurance Automation - Setup Guide

This guide will help you set up and run the AI-powered insurance automation features.

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (for NotebookLM integration)
- ChromaDB (for vector database)
- Google Gemini API key

## Installation

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies for NotebookLM
pip install notebooklm-mcp-server
```

### 2. Set Up ChromaDB

```bash
# Install ChromaDB
pip install chromadb

# Run ChromaDB server (in a separate terminal)
chroma run --path ./chromadb_data --port 8000
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Google Gemini API Key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# ChromaDB Configuration
CHROMADB_PATH=http://localhost:8000

# NotebookLM (if using MCP server)
# Authentication is handled via notebooklm-mcp-auth command
```

### 4. Authenticate with NotebookLM

```bash
# Run the authentication CLI
notebooklm-mcp-auth
```

This will open Chrome and save your authentication tokens.

## Indexing IA Regulations

Before using the AI agents, you need to index the Insurance Authority (IA) regulatory documents:

```bash
# Run the indexing script
python scripts/index_ia_regulations.py
```

This will:
1. Extract content from IA notebooks in NotebookLM
2. Create embeddings using Gemini
3. Store in ChromaDB for RAG queries

## Running the Application

```bash
# Start the Next.js development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Using the AI Agents

### Web Interface

1. Navigate to the home page
2. Scroll to the "AI Agents" section
3. Click on any agent to start a conversation:
   - **Claims Agent**: Submit and track claims
   - **Policy Agent**: Get quotes and manage policies
   - **Support Agent**: General inquiries
   - **Compliance Agent**: Regulatory guidance

### API Endpoints

#### Chat with an Agent

```bash
POST /api/ai/agent/chat
Content-Type: application/json

{
  "agentType": "claims",
  "message": "I want to submit a motor insurance claim",
  "conversationId": "unique-conversation-id",
  "language": "both"
}
```

#### Query RAG System

```bash
POST /api/ai/rag/query
Content-Type: application/json

{
  "question": "What are the IA requirements for claims settlement?",
  "maxResults": 5,
  "language": "both"
}
```

## AI Features

### 1. Claims Agent
- **Claim Submission**: Guided intake with validation
- **Fraud Detection**: AI-powered risk scoring
- **Compliance Checking**: Real-time IA regulation validation
- **Status Tracking**: Automated updates

### 2. Policy Agent
- **Quotation Generation**: Instant premium calculations
- **Policy Compliance**: IA standards validation
- **Coverage Explanation**: Clear policy terms in Arabic/English

### 3. Support Agent
- **General Inquiries**: 24/7 customer support
- **Regulation Search**: RAG-powered IA regulation lookup
- **Escalation**: Automatic routing to human agents

### 4. Compliance Agent
- **Compliance Checking**: Validate policies against IA regulations
- **Regulatory Guidance**: Expert answers from official sources
- **Requirements Lookup**: Get specific IA requirements

## Technology Stack

- **LLM**: Google Gemini 1.5 Pro (Arabic language support)
- **Embeddings**: text-embedding-004
- **Vector DB**: ChromaDB
- **Framework**: Next.js 14 + TypeScript
- **UI**: React + Tailwind CSS

## Multi-Language Support

All AI agents support:
- **English**: Full support
- **Arabic**: Native support via Gemini
- **Both**: Bilingual responses

Set the `language` parameter to:
- `"en"` for English only
- `"ar"` for Arabic only  
- `"both"` for bilingual responses

## Troubleshooting

### ChromaDB Connection Error

```bash
# Make sure ChromaDB is running
chroma run --path ./chromadb_data --port 8000
```

### Gemini API Error

- Check your API key in `.env.local`
- Verify you have Gemini API access enabled
- Check API quotas and limits

### NotebookLM Authentication

```bash
# Re-run authentication if expired
notebooklm-mcp-auth
```

### No Regulations Indexed

```bash
# Re-run the indexing script
python scripts/index_ia_regulations.py
```

## Development

### Project Structure

```
src/
├── app/
│   ├── api/ai/
│   │   ├── agent/chat/route.ts    # Multi-agent chat API
│   │   └── rag/query/route.ts     # RAG query API
│   └── page.tsx                    # Home page with AI panel
├── components/ai/
│   ├── agent-chat.tsx              # Chat interface
│   └── ai-agents-panel.tsx         # Agent selection panel
└── services/
    ├── ai/
    │   ├── llm-service.ts          # Gemini integration
    │   ├── vector-store.ts         # ChromaDB client
    │   └── rag-service.ts          # RAG implementation
    └── agents/
        ├── base-agent.ts           # Base agent class
        ├── claims-agent.ts         # Claims processing
        ├── policy-agent.ts         # Policy management
        ├── support-agent.ts        # Customer support
        └── compliance-agent.ts     # Regulatory compliance
```

### Running Tests

```bash
# Run all tests
npm test

# Test specific service
npm test -- llm-service
```

## Next Steps

1. **Index More Data**: Add more IA notebooks to NotebookLM
2. **Customize Agents**: Modify agent prompts and tools
3. **Add Features**: Implement voice AI, OCR, etc.
4. **Deploy**: Deploy to production with proper security

## Support

For questions or issues:
- Check the implementation plan: `brain/.../implementation_plan.md`
- Review the walkthrough: `brain/.../walkthrough.md`
- Contact the development team

---

**Built with ❤️ by Rommaana - Powered by Google Gemini AI**
