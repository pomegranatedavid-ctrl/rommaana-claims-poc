---
description: how to execute the Rommaana Nexus and NotebookLM MCP Server
---

### 1. Prerequisites
Ensure you have the following installed:
- Node.js & npm
- Python 3.11+
- `uv` (Universal Python Package Manager)
- Google Chrome (for authentication)

### 2. Set up and Run the Next.js Frontend
From the root directory (`rommaana-nexus`):

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### 3. Set up the NotebookLM MCP Server
The frontend requires the NotebookLM MCP server to be authenticated to provide insights.

```bash
# Navigate to the MCP server directory
cd notebooklm-mcp

# Install dependencies and the tool using uv
uv sync
uv tool install .

# Authenticate with Google (Required for NotebookLM)
# This will open a Chrome window for you to log in
notebooklm-mcp-auth
```

### 4. Verification
- Open the web app.
- Submit a claim or use the "Knowledge Agent" to query information.
- The web app will call `scripts/notebooklm_bridge.py` which uses the authenticated MCP server tokens.

### 5. Troubleshooting
If the knowledge agents fail to respond:
1. Ensure `notebooklm-mcp-auth` was successful and tokens are cached.
2. Check `.env.local` for correct Supabase credentials.
3. Verify that `python` is in your PATH and can run the bridge script.
