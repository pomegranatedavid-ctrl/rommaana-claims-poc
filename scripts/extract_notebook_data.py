import sys
import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
import time

# Add the notebooklm-mcp src directory to path
mcp_path = os.path.join(os.getcwd(), 'notebooklm-mcp', 'src')
sys.path.append(mcp_path)

try:
    from notebooklm_mcp.api_client import NotebookLMClient
    from notebooklm_mcp.auth import load_cached_tokens
except ImportError as e:
    print(json.dumps({"status": "error", "error": f"Failed to import NotebookLM modules: {str(e)}"}))
    sys.exit(1)

class NotebookExtractor:
    """Extract and process notebooks from NotebookLM"""
    
    def __init__(self, output_dir: str = "reports/notebook_data"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.client: Optional[NotebookLMClient] = None
        
    def authenticate(self) -> bool:
        """Authenticate with NotebookLM"""
        try:
            cached = load_cached_tokens()
            if not cached:
                print(json.dumps({
                    "status": "error", 
                    "error": "No cached tokens found. Please authenticate first.",
                    "authenticated": False
                }))
                return False
            
            self.client = NotebookLMClient(
                cookies=cached.cookies,
                csrf_token=cached.csrf_token,
                session_id=cached.session_id,
            )
            print(json.dumps({"status": "info", "message": "Authentication successful", "authenticated": True}))
            return True
            
        except Exception as e:
            print(json.dumps({"status": "error", "error": f"Authentication failed: {str(e)}", "authenticated": False}))
            return False
    
    def list_all_notebooks(self) -> List[Dict[str, Any]]:
        """List all notebooks with retry logic"""
        if not self.client:
            if not self.authenticate():
                return []
        
        try:
            print(json.dumps({"status": "info", "message": "Fetching notebooks..."}))
            notebooks = self.client.list_notebooks()
            
            # Convert to dictionaries
            notebook_list = []
            for nb in notebooks:
                if hasattr(nb, '__dict__'):
                    nb_dict = {
                        "title": getattr(nb, 'title', 'Untitled'),
                        "notebook_id": getattr(nb, 'notebook_id', None),
                        "sources": getattr(nb, 'sources', []),
                        "source_count": len(getattr(nb, 'sources', []))
                    }
                else:
                    nb_dict = {
                        "title": nb.get("title", "Untitled"),
                        "notebook_id": nb.get("notebook_id"),
                        "sources": nb.get("sources", []),
                        "source_count": len(nb.get("sources", []))
                    }
                notebook_list.append(nb_dict)
            
            print(json.dumps({
                "status": "success",
                "message": f"Found {len(notebook_list)} notebooks",
                "count": len(notebook_list)
            }))
            
            return notebook_list
            
        except Exception as e:
            print(json.dumps({"status": "error", "error": f"Failed to list notebooks: {str(e)}"}))
            return []
    
    def filter_notebooks(self, notebooks: List[Dict[str, Any]], prefix: Optional[str] = None) -> List[Dict[str, Any]]:
        """Filter notebooks by title prefix"""
        if not prefix:
            return notebooks
        
        filtered = [nb for nb in notebooks if nb['title'].startswith(prefix)]
        print(json.dumps({
            "status": "info",
            "message": f"Filtered to {len(filtered)} notebooks with prefix '{prefix}'",
            "count": len(filtered)
        }))
        return filtered
    
    def extract_notebook_sources(self, notebook_id: str) -> Dict[str, Any]:
        """Extract detailed information from a notebook"""
        if not self.client:
            return {}
        
        try:
            print(json.dumps({"status": "info", "message": f"Extracting notebook {notebook_id}..."}))
            
            # Get notebook details with sources
            notebook_data = self.client.get_notebook(notebook_id)
            
            result = {
                "notebook_id": notebook_id,
                "title": getattr(notebook_data, 'title', 'Unknown') if hasattr(notebook_data, 'title') else notebook_data.get('title', 'Unknown'),
                "sources": [],
                "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
            # Extract sources
            sources = getattr(notebook_data, 'sources', []) if hasattr(notebook_data, 'sources') else notebook_data.get('sources', [])
            
            for source in sources:
                source_info = {
                    "title": getattr(source, 'title', 'Unknown') if hasattr(source, 'title') else source.get('title', 'Unknown'),
                    "source_id": getattr(source, 'source_id', None) if hasattr(source, 'source_id') else source.get('source_id'),
                    "type": getattr(source, 'type', 'unknown') if hasattr(source, 'type') else source.get('type', 'unknown'),
                }
                result["sources"].append(source_info)
            
            return result
            
        except Exception as e:
            print(json.dumps({"status": "error", "error": f"Failed to extract notebook {notebook_id}: {str(e)}"}))
            return {}
    
    def query_notebook(self, notebook_id: str, query: str) -> Dict[str, Any]:
        """Query a notebook for specific information"""
        if not self.client:
            return {}
        
        try:
            print(json.dumps({"status": "info", "message": f"Querying notebook {notebook_id} with: {query}"}))
            
            response = self.client.query_notebook(notebook_id, query)
            
            return {
                "notebook_id": notebook_id,
                "query": query,
                "response": response,
                "queried_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
        except Exception as e:
            print(json.dumps({"status": "error", "error": f"Failed to query notebook {notebook_id}: {str(e)}"}))
            return {}
    
    def save_data(self, data: Any, filename: str):
        """Save data to JSON file"""
        filepath = self.output_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(json.dumps({
            "status": "success",
            "message": f"Saved data to {filepath}",
            "filepath": str(filepath)
        }))

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Extract data from NotebookLM notebooks')
    parser.add_argument('--filter', type=str, help='Filter notebooks by title prefix (e.g., "IA -")')
    parser.add_argument('--all', action='store_true', help='Extract all notebooks')
    parser.add_argument('--output-dir', type=str, default='reports/notebook_data', help='Output directory for extracted data')
    parser.add_argument('--query', type=str, help='Query all filtered notebooks with this question')
    
    args = parser.parse_args()
    
    extractor = NotebookExtractor(output_dir=args.output_dir)
    
    # Authenticate
    if not extractor.authenticate():
        sys.exit(1)
    
    # List all notebooks
    all_notebooks = extractor.list_all_notebooks()
    if not all_notebooks:
        sys.exit(1)
    
    # Save all notebooks list
    extractor.save_data(all_notebooks, "all_notebooks.json")
    
    # Filter if needed
    target_notebooks = extractor.filter_notebooks(all_notebooks, args.filter)
    
    if args.filter:
        extractor.save_data(target_notebooks, f"filtered_{args.filter.replace(' ', '_').replace('-', '')}_notebooks.json")
    
    # Extract detailed information from each target notebook
    detailed_data = []
    for notebook in target_notebooks:
        notebook_id = notebook['notebook_id']
        details = extractor.extract_notebook_sources(notebook_id)
        
        if details:
            detailed_data.append(details)
            
            # Query if requested
            if args.query:
                query_result = extractor.query_notebook(notebook_id, args.query)
                details['query_result'] = query_result
        
        time.sleep(0.5)  # Rate limiting
    
    # Save detailed data
    if detailed_data:
        filename = f"detailed_{args.filter.replace(' ', '_').replace('-', '') if args.filter else 'all'}_notebooks.json"
        extractor.save_data(detailed_data, filename)
    
    print(json.dumps({
        "status": "complete",
        "message": "Data extraction complete",
        "total_notebooks": len(all_notebooks),
        "extracted_notebooks": len(detailed_data)
    }))

if __name__ == "__main__":
    main()
