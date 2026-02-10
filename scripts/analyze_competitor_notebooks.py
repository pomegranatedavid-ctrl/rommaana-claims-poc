import sys
import os
import json
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

class CompetitorAnalyzer:
    """Analyze competitor notebooks for market insights and AI opportunities"""
    
    def __init__(self, data_dir: str = "reports/notebook_data"):
        self.data_dir = Path(data_dir)
        self.competitor_notebooks: List[Dict[str, Any]] = []
        self.insights: Dict[str, List[Dict[str, Any]]] = {
            "ai_technologies": [],
            "product_features": [],
            "market_strategies": [],
            "best_practices": [],
            "technology_stack": []
        }
        
    def load_competitor_notebooks(self) -> bool:
        """Load competitor and market analysis notebooks"""
        try:
            all_file = self.data_dir / "all_notebooks.json"
            if not all_file.exists():
                print("No notebook data found. Run extract_notebook_data.py first.")
                return False
            
            with open(all_file, 'r', encoding='utf-8') as f:
                all_notebooks = json.load(f)
            
            # Filter for relevant competitor notebooks (excluding IA - notebooks)
            competitor_keywords = [
                'AI', 'GenAI', 'Generative', 'Floatbot', 'Swiss Re', 
                'InsurTech', 'Rommaana', 'Technology', 'Innovation'
            ]
            
            for notebook in all_notebooks:
                title = notebook['title']
                # Skip IA notebooks
                if title.startswith('IA -'):
                    continue
                
                # Include if title contains competitor keywords
                if any(keyword.lower() in title.lower() for keyword in competitor_keywords):
                    self.competitor_notebooks.append(notebook)
            
            print(f"Loaded {len(self.competitor_notebooks)} competitor/market notebooks")
            return True
            
        except Exception as e:
            print(f"Error loading competitor notebooks: {str(e)}")
            return False
    
    def analyze_ai_technologies(self):
        """Extract AI technology insights from notebooks"""
        for notebook in self.competitor_notebooks:
            title = notebook['title']
            sources = notebook.get('sources', [])
            
            # AI-related notebooks
            ai_keywords = ['AI', 'GenAI', 'Generative', 'Agent', 'Chatbot', 'Voice', 'Conversational']
            if any(keyword.lower() in title.lower() for keyword in ai_keywords):
                self.insights['ai_technologies'].append({
                    "notebook": title,
                    "source_count": len(sources),
                    "technology_hints": [s['title'] for s in sources[:5]],  # First 5 sources
                    "category": self._categorize_ai_tech(title)
                })
    
    def _categorize_ai_tech(self, title: str) -> str:
        """Categorize AI technology type"""
        title_lower = title.lower()
        if 'voice' in title_lower or 'call' in title_lower:
            return "Voice AI"
        elif 'chatbot' in title_lower or 'conversational' in title_lower:
            return "Conversational AI"
        elif 'underwriting' in title_lower:
            return "Underwriting AI"
        elif 'claims' in title_lower:
            return "Claims AI"
        else:
            return "General AI"
    
    def analyze_competitors(self):
        """Identify and analyze specific competitors"""
        competitors = {
            'Floatbot': [],
            'Swiss Re': [],
            'Cognigy': [],
            'Kore.AI': [],
            'Verloop': []
        }
        
        for notebook in self.competitor_notebooks:
            title = notebook['title']
            sources = notebook.get('sources', [])
            
            for competitor in competitors.keys():
                if competitor.lower() in title.lower():
                    competitors[competitor].append({
                        "notebook": title,
                        "sources": len(sources)
                    })
                    break
                    
                # Also check sources
                for source in sources:
                    if competitor.lower() in source['title'].lower():
                        competitors[competitor].append({
                            "notebook": title,
                            "source": source['title']
                        })
                        break
        
        # Filter out empty competitors
        self.insights['competitors'] = {k: v for k, v in competitors.items() if v}
    
    def extract_best_practices(self):
        """Extract best practices and successful approaches"""
        for notebook in self.competitor_notebooks:
            title = notebook['title']
            sources = notebook.get('sources', [])
            
            # Look for case studies, success stories, frameworks
            best_practice_keywords = ['case study', 'framework', 'strategy', 'roadmap', 'best practice']
            
            if any(keyword in title.lower() for keyword in best_practice_keywords):
                self.insights['best_practices'].append({
                    "notebook": title,
                    "source_count": len(sources),
                    "type": self._categorize_best_practice(title)
                })
    
    def _categorize_best_practice(self, title: str) -> str:
        """Categorize best practice type"""
        title_lower = title.lower()
        if 'roadmap' in title_lower:
            return "Strategic Roadmap"
        elif 'framework' in title_lower:
            return "Framework"
        elif 'case study' in title_lower:
            return "Case Study"
        else:
            return "Strategy"
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive competitor analysis report"""
        return {
            "analysis_date": datetime.now().isoformat(),
            "total_competitor_notebooks": len(self.competitor_notebooks),
            "insights": {
                "ai_technologies_count": len(self.insights['ai_technologies']),
                "competitors_identified": len(self.insights.get('competitors', {})),
                "best_practices_count": len(self.insights['best_practices'])
            },
            "detailed_insights": self.insights,
            "competitor_notebooks": [nb['title'] for nb in self.competitor_notebooks]
        }
    
    def save_report(self, filename: str = "competitor_analysis_report.json"):
        """Save analysis report"""
        report = self.generate_report()
        filepath = self.data_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"Competitor analysis report saved to {filepath}")
        return filepath

def main():
    analyzer = CompetitorAnalyzer()
    
    if not analyzer.load_competitor_notebooks():
        sys.exit(1)
    
    print(f"\nAnalyzing {len(analyzer.competitor_notebooks)} competitor/market notebooks...")
    
    # Run analyses
    analyzer.analyze_ai_technologies()
    analyzer.analyze_competitors()
    analyzer.extract_best_practices()
    
    # Generate and save report
    report_path = analyzer.save_report()
    
    # Print summary
    report = analyzer.generate_report()
    print("\n=== Competitor Analysis Summary ===")
    print(f"Total Notebooks Analyzed: {report['total_competitor_notebooks']}")
    print(f"AI Technologies Found: {report['insights']['ai_technologies_count']}")
    print(f"Competitors Identified: {report['insights']['competitors_identified']}")
    print(f"Best Practices Documented: {report['insights']['best_practices_count']}")
    print(f"\nCompetitors: {', '.join(report['detailed_insights'].get('competitors', {}).keys())}")
    print(f"\nFull report saved to: {report_path}")

if __name__ == "__main__":
    main()
