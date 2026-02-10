import sys
import os
import json
from pathlib import Path
from typing import List, Dict, Any
from collections import defaultdict
import re
from datetime import datetime

# Add the notebooklm-mcp src directory to path
mcp_path = os.path.join(os.getcwd(), 'notebooklm-mcp', 'src')
sys.path.append(mcp_path)

class InsuranceAuthorityAnalyzer:
    """Analyze Insurance Authority (IA -) notebooks for regulatory insights"""
    
    def __init__(self, data_dir: str = "reports/notebook_data"):
        self.data_dir = Path(data_dir)
        self.ia_notebooks: List[Dict[str, Any]] = []
        self.regulatory_insights: Dict[str, Any] = {
            "regulations": [],
            "compliance_requirements": [],
            "historical_changes": [],
            "key_deadlines": [],
            "metrics_and_kpis": []
        }
        
    def load_ia_notebooks(self) -> bool:
        """Load Insurance Authority notebooks from extracted data"""
        try:
            # Look for filtered IA notebooks
            ia_file = self.data_dir / "filtered_IA_notebooks.json"
            
            if ia_file.exists():
                with open(ia_file, 'r', encoding='utf-8') as f:
                    self.ia_notebooks = json.load(f)
                print(f"Loaded {len(self.ia_notebooks)} IA notebooks from {ia_file}")
                return True
            else:
                # Fallback: filter from all notebooks
                all_file = self.data_dir / "all_notebooks.json"
                if all_file.exists():
                    with open(all_file, 'r', encoding='utf-8') as f:
                        all_notebooks = json.load(f)
                    
                    self.ia_notebooks = [nb for nb in all_notebooks if nb['title'].startswith('IA -')]
                    print(f"Filtered {len(self.ia_notebooks)} IA notebooks from all notebooks")
                    return True
                else:
                    print("No notebook data found. Run extract_notebook_data.py first.")
                    return False
                    
        except Exception as e:
            print(f"Error loading IA notebooks: {str(e)}")
            return False
    
    def load_detailed_data(self) -> List[Dict[str, Any]]:
        """Load detailed notebook data"""
        try:
            detailed_file = self.data_dir / "detailed_IA_notebooks.json"
            
            if detailed_file.exists():
                with open(detailed_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                print("No detailed IA notebook data found.")
                return []
                
        except Exception as e:
            print(f"Error loading detailed data: {str(e)}")
            return []
    
    def extract_date_patterns(self, text: str) -> List[str]:
        """Extract dates from text"""
        # Common date patterns
        date_patterns = [
            r'\d{4}-\d{2}-\d{2}',  # YYYY-MM-DD
            r'\d{2}/\d{2}/\d{4}',  # DD/MM/YYYY or MM/DD/YYYY
            r'\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}',  # D Month YYYY
            r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}'  # Month D, YYYY
        ]
        
        dates = []
        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            dates.extend(matches)
        
        return dates
    
    def analyze_regulatory_content(self):
        """Analyze regulatory content from IA notebooks"""
        detailed_data = self.load_detailed_data()
        
        for notebook in detailed_data:
            title = notebook.get('title', '')
            
            # Categorize by title keywords
            if any(keyword in title.lower() for keyword in ['regulation', 'law', 'rule', 'policy']):
                self.regulatory_insights['regulations'].append({
                    "title": title,
                    "notebook_id": notebook.get('notebook_id'),
                    "source_count": len(notebook.get('sources', []))
                })
            
            if any(keyword in title.lower() for keyword in ['compliance', 'requirement', 'mandatory']):
                self.regulatory_insights['compliance_requirements'].append({
                    "title": title,
                    "notebook_id": notebook.get('notebook_id'),
                    "source_count": len(notebook.get('sources', []))
                })
            
            if any(keyword in title.lower() for keyword in ['change', 'amendment', 'update', 'revision']):
                self.regulatory_insights['historical_changes'].append({
                    "title": title,
                    "notebook_id": notebook.get('notebook_id'),
                    "source_count": len(notebook.get('sources', []))
                })
            
            if any(keyword in title.lower() for keyword in ['deadline', 'due', 'timeline']):
                self.regulatory_insights['key_deadlines'].append({
                    "title": title,
                    "notebook_id": notebook.get('notebook_id'),
                    "source_count": len(notebook.get('sources', []))
                })
            
            if any(keyword in title.lower() for keyword in ['metric', 'kpi', 'performance', 'indicator']):
                self.regulatory_insights['metrics_and_kpis'].append({
                    "title": title,
                    "notebook_id": notebook.get('notebook_id'),
                    "source_count": len(notebook.get('sources', []))
                })
            
            # Extract query results if available
            if 'query_result' in notebook and notebook['query_result'].get('response'):
                response = notebook['query_result']['response']
                
                # Extract dates from response
                dates = self.extract_date_patterns(str(response))
                if dates:
                    for date in dates:
                        self.regulatory_insights['historical_changes'].append({
                            "date": date,
                            "context": title,
                            "notebook_id": notebook.get('notebook_id')
                        })
    
    def generate_timeline(self) -> List[Dict[str, Any]]:
        """Generate timeline of regulatory changes"""
        timeline = []
        
        for change in self.regulatory_insights['historical_changes']:
            if 'date' in change:
                timeline.append(change)
        
        # Sort by date (simplified - would need proper date parsing)
        timeline.sort(key=lambda x: x.get('date', ''), reverse=True)
        
        return timeline
    
    def generate_summary_report(self) -> Dict[str, Any]:
        """Generate comprehensive summary report"""
        return {
            "analysis_date": datetime.now().isoformat(),
            "total_ia_notebooks": len(self.ia_notebooks),
            "regulatory_insights": {
                "regulations_count": len(self.regulatory_insights['regulations']),
                "compliance_requirements_count": len(self.regulatory_insights['compliance_requirements']),
                "historical_changes_count": len(self.regulatory_insights['historical_changes']),
                "key_deadlines_count": len(self.regulatory_insights['key_deadlines']),
                "metrics_kpis_count": len(self.regulatory_insights['metrics_and_kpis'])
            },
            "detailed_insights": self.regulatory_insights,
            "timeline": self.generate_timeline()
        }
    
    def save_report(self, filename: str = "ia_analysis_report.json"):
        """Save analysis report"""
        report = self.generate_summary_report()
        filepath = self.data_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"Analysis report saved to {filepath}")
        return filepath

def main():
    analyzer = InsuranceAuthorityAnalyzer()
    
    # Load IA notebooks
    if not analyzer.load_ia_notebooks():
        print("Failed to load IA notebooks. Exiting.")
        sys.exit(1)
    
    print(f"\nAnalyzing {len(analyzer.ia_notebooks)} Insurance Authority notebooks...")
    
    # Analyze content
    analyzer.analyze_regulatory_content()
    
    # Generate and save report
    report_path = analyzer.save_report()
    
    # Print summary
    report = analyzer.generate_summary_report()
    print("\n=== Insurance Authority Analysis Summary ===")
    print(f"Total IA Notebooks: {report['total_ia_notebooks']}")
    print(f"Regulations: {report['regulatory_insights']['regulations_count']}")
    print(f"Compliance Requirements: {report['regulatory_insights']['compliance_requirements_count']}")
    print(f"Historical Changes: {report['regulatory_insights']['historical_changes_count']}")
    print(f"Key Deadlines: {report['regulatory_insights']['key_deadlines_count']}")
    print(f"Metrics & KPIs: {report['regulatory_insights']['metrics_kpis_count']}")
    print(f"\nFull report saved to: {report_path}")

if __name__ == "__main__":
    main()
