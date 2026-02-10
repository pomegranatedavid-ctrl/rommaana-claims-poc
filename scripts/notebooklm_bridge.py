import sys
import os
import json
import asyncio

# Add the notebooklm-mcp src directory to path
mcp_path = os.path.join(os.getcwd(), 'notebooklm-mcp', 'src')
sys.path.append(mcp_path)

try:
    from notebooklm_mcp.api_client import NotebookLMClient
    from notebooklm_mcp.auth import load_cached_tokens
except ImportError as e:
    print(json.dumps({"status": "error", "error": f"Failed to import NotebookLM modules: {str(e)}"}))
    sys.exit(1)

async def main():
    if len(sys.argv) < 3:
        print(json.dumps({"status": "error", "error": "Usage: python bridge.py <notebook_id> <query>"}))
        return

    notebook_id = sys.argv[1]
    query = sys.argv[2]
    
    try:
        cached = load_cached_tokens()
        if not cached:
            print(json.dumps({"status": "error", "error": "No cached tokens found. Run 'notebooklm-mcp-auth' first."}))
            return

        client = NotebookLMClient(
            cookies=cached.cookies,
            csrf_token=cached.csrf_token,
            session_id=cached.session_id,
        )

        result = client.query(
            notebook_id=notebook_id,
            query_text=query
        )

        if result:
            print(json.dumps({
                "status": "success",
                "answer": result.get("answer", ""),
                "conversation_id": result.get("conversation_id"),
                "sources": [] # NotebookLM doesn't expose raw source names easily in query result yet
            }))
        else:
            print(json.dumps({"status": "error", "error": "Query returned no result."}))

    except Exception as e:
        print(json.dumps({"status": "error", "error": str(e)}))

if __name__ == "__main__":
    asyncio.run(main())
