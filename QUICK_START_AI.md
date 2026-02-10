# Quick Start: Testing the AI Agents

## 🚀 Immediate Testing (Without Full Setup)

Your dev server is running at `http://localhost:3000`. Here's what you can see **right now**:

### Step 1: View the AI Agents Panel

1. Open your browser
2. Go to: `http://localhost:3000`
3. Scroll down to see the **"Meet Your AI Assistants"** section
4. You'll see 4 beautiful agent cards

**What you'll see:**
- 🔵 Claims Agent - Submit and track insurance claims
- 🟢 Policy Agent - Get quotes and manage policies
- 🟣 Support Agent - General help and inquiries
- 🟠 Compliance Agent - Regulatory compliance guidance

### Step 2: Click on an Agent

When you click any agent card, you'll see the chat interface open. **However, it won't work yet** because you need to set up:
- Google Gemini API key
- ChromaDB vector database

---

## ⚙️ Full Setup (To Make Agents Work)

To actually **chat with the agents**, follow these steps:

### 1. Get Google Gemini API Key

```bash
# Go to: https://makersuite.google.com/app/apikey
# Create a new API key
# Copy it
```

### 2. Add API Key to Environment

Create `.env.local` file in the project root:

```bash
# In c:\NewRommaana\rommaana-claims-poc\
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Install and Run ChromaDB

```bash
# Install ChromaDB
pip install chromadb

# Run ChromaDB server (in a separate terminal)
chroma run --path ./chromadb_data --port 8000
```

### 4. Index IA Regulations (Optional but Recommended)

```bash
# This loads the Insurance Authority regulations into the AI
python scripts/index_ia_regulations.py
```

### 5. Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Testing the Agents

Once set up, try these test conversations:

### Claims Agent
```
You: "I want to submit a motor insurance claim"
Agent: [Guides you through the process]
```

### Policy Agent
```
You: "I need a quote for health insurance"
Agent: [Generates quotation]
```

### Support Agent
```
You: "What types of insurance do you offer?"
Agent: [Explains available insurance types]
```

### Compliance Agent
```
You: "What are the IA requirements for claims settlement?"
Agent: [Provides regulatory information]
```

---

## 📁 File Locations

All AI code is organized here:

### Services
- `src/services/ai/llm-service.ts` - Gemini integration
- `src/services/ai/vector-store.ts` - ChromaDB client
- `src/services/ai/rag-service.ts` - RAG over IA regulations

### Agents
- `src/services/agents/claims-agent.ts`
- `src/services/agents/policy-agent.ts`
- `src/services/agents/support-agent.ts`
- `src/services/agents/compliance-agent.ts`

### UI Components
- `src/components/ai/agent-chat.tsx` - Chat interface
- `src/components/ai/ai-agents-panel.tsx` - Agent cards

### API Routes
- `src/app/api/ai/agent/chat/route.ts` - Chat endpoint
- `src/app/api/ai/rag/query/route.ts` - RAG endpoint

---

## 🔍 Quick Visual Check

Open these files to see the implementation:

1. **UI Integration**: [src/app/page.tsx:238-258](file:///c:/NewRommaana/rommaana-claims-poc/src/app/page.tsx#L238-L258)
2. **Agent Panel**: [src/components/ai/ai-agents-panel.tsx](file:///c:/NewRommaana/rommaana-claims-poc/src/components/ai/ai-agents-panel.tsx)
3. **Claims Agent**: [src/services/agents/claims-agent.ts](file:///c:/NewRommaana/rommaana-claims-poc/src/services/agents/claims-agent.ts)

---

## ⏱️ Time Estimate

- **Just viewing the UI**: 0 minutes (it's there now!)
- **Full setup to test agents**: ~10 minutes
- **With IA regulation indexing**: ~15 minutes

---

## 💡 What Works Without Setup

Even without Gemini API and ChromaDB:
- ✅ You can see the AI Agents panel
- ✅ You can click on agents to open the chat
- ✅ You can view all the code
- ❌ Agents won't respond (need API key)

---

## 🆘 Troubleshooting

**"I see the agents but chat doesn't work"**
→ Add Gemini API key to `.env.local`

**"API error when sending message"**
→ Make sure ChromaDB is running on port 8000

**"No regulations found"**
→ Run the indexing script: `python scripts/index_ia_regulations.py`

---

For complete setup instructions, see: [AI_SETUP.md](file:///c:/NewRommaana/rommaana-claims-poc/AI_SETUP.md)
