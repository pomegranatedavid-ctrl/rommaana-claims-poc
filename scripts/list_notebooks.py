import sys
import os
import json

# Add the notebooklm-mcp src directory to path
mcp_path = os.path.join(os.getcwd(), 'notebooklm-mcp', 'src')
sys.path.append(mcp_path)

try:
    from notebooklm_mcp.api_client import NotebookLMClient
    from notebooklm_mcp.auth import load_cached_tokens
except ImportError as e:
    print(json.dumps({"status": "error", "error": f"Failed to import NotebookLM modules: {str(e)}"}))
    sys.exit(1)

def main():
    try:
        cached = load_cached_tokens()
        if not cached:
            print(json.dumps({
                "status": "error", 
                "error": "No cached tokens found. Run 'notebooklm-mcp-auth' first.",
                "authenticated": False
            }))
            return

        print(json.dumps({"status": "info", "message": "Authentication tokens found", "authenticated": True}))

        client = NotebookLMClient(
            cookies=cached.cookies,
            csrf_token=cached.csrf_token,
            session_id=cached.session_id,
        )

        notebooks = client.list_notebooks()
        
        # Convert notebook objects to dictionaries
        notebook_list = []
        for nb in notebooks:
            if hasattr(nb, '__dict__'):
                # It's an object, convert to dict
                nb_dict = {
                    "title": getattr(nb, 'title', 'Untitled'),
                    "notebook_id": getattr(nb, 'id', None),
                    "source_count": len(getattr(nb, 'sources', []))
                }
            else:
                # It's already a dict
                nb_dict = {
                    "title": nb.get("title", "Untitled"),
                    "notebook_id": nb.get("notebook_id"),
                    "source_count": len(nb.get("sources", []))
                }
            notebook_list.append(nb_dict)
        
        print(json.dumps({
            "status": "success",
            "authenticated": True,
            "notebook_count": len(notebooks),
            "notebooks": notebook_list
        }, indent=2))

    except Exception as e:
        print(json.dumps({"status": "error", "error": str(e), "authenticated": False}))

if __name__ == "__main__":
    main()
