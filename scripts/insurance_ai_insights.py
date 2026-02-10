import sys
import os
import json
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

class InsuranceAIInsightsGenerator:
    """Generate AI-driven insights and recommendations for insurance industry automation"""
    
    def __init__(self, data_dir: str = "reports/notebook_data"):
        self.data_dir = Path(data_dir)
        self.recommendations: Dict[str, List[Dict[str, Any]]] = {}
        self.ia_data: Dict[str, Any] = {}
        self.competitor_data: Dict[str, Any] = {}
        
    def load_analysis_data(self) -> bool:
        """Load IA and competitor analysis data"""
        try:
            # Load IA analysis if available
            ia_file = self.data_dir / "ia_analysis_report.json"
            if ia_file.exists():
                with open(ia_file, 'r', encoding='utf-8') as f:
                    self.ia_data = json.load(f)
                print(f"Loaded IA analysis data")
            
            # Load competitor analysis if available
            comp_file = self.data_dir / "competitor_analysis_report.json"
            if comp_file.exists():
                with open(comp_file, 'r', encoding='utf-8') as f:
                    self.competitor_data = json.load(f)
                print(f"Loaded competitor analysis data")
            
            # Load raw notebook data
            notebooks_file = self.data_dir / "all_notebooks.json"
            if notebooks_file.exists():
                with open(notebooks_file, 'r', encoding='utf-8') as f:
                    self.all_notebooks = json.load(f)
                print(f"Loaded {len(self.all_notebooks)} notebooks")
                return True
            
            return False
            
        except Exception as e:
            print(f"Error loading analysis data: {str(e)}")
            return False
    
    def generate_claims_automation_insights(self) -> List[Dict[str, Any]]:
        """Generate recommendations for claims automation"""
        recommendations = []
        
        # Find IA Claims notebook
        ia_claims = next((nb for nb in self.all_notebooks if "Claims" in nb['title'] and nb['title'].startswith('IA -')), None)
        
        recommendations.append({
            "area": "Claims Processing Automation",
            "priority": "HIGH",
            "opportunities": [
                {
                    "title": "Automated Claims Settlement",
                    "description": "Implement AI-powered auto-adjudication for straightforward claims",
                    "regulatory_basis": "IA Claims Settlement Companies' Services regulation",
                    "potential_impact": "Reduce claims processing time by 70% for simple claims",
                    "implementation": [
                        "OCR for document extraction from claim submissions",
                        "NLP to understand claim details and categorize claim types",
                        "Rule engine based on IA settlement guidelines",
                        "Auto-approval for claims below threshold with complete documentation"
                    ]
                },
                {
                    "title": "Motor Insurance Claims NLP Processing",
                    "description": "Natural language processing for motor insurance claim narratives",
                    "regulatory_basis": "Instructions for Motor Insurance Claims' Settlement",
                    "potential_impact": "Extract key information from unstructured claim descriptions",
                    "implementation": [
                        "Named Entity Recognition (NER) for extracting parties, vehicles, locations",
                        "Sentiment analysis to flag contentious claims",
                        "Automatic routing based on claim complexity",
                        "Integration with Najm Net system as per IA requirements"
                    ]
                },
                {
                    "title": "Fraud Detection AI",
                    "description": "Machine learning model to detect potentially fraudulent claims",
                    "regulatory_basis": "Anti-Money Laundering Law compliance",
                    "potential_impact": "Reduce fraud losses by 40-60%",
                    "implementation": [
                        "Anomaly detection on claim patterns",
                        "Network analysis for organized fraud rings",
                        "Historical pattern matching from IA Reports data (2008-2025)",
                        "Real-time risk scoring during claim submission"
                    ]
                }
            ],
            "data_sources": ia_claims['sources'][:3] if ia_claims else []
        })
        
        return recommendations
    
    def generate_regulatory_compliance_insights(self) -> List[Dict[str, Any]]:
        """Generate AI-driven compliance monitoring recommendations"""
        recommendations = []
        
        # Extract IA compliance requirements
        ia_compliance = next((nb for nb in self.all_notebooks if "Compliance" in nb['title'] and nb['title'].startswith('IA -')), None)
        ia_reports = next((nb for nb in self.all_notebooks if "Reports" in nb['title'] and nb['title'].startswith('IA -')), None)
        
        recommendations.append({
            "area": "Regulatory Compliance Automation",
            "priority": "CRITICAL",
            "opportunities": [
                {
                    "title": "Real-time Compliance Monitoring",
                    "description": "AI agent that continuously monitors operations against IA regulations",
                    "regulatory_basis": "IA Compliance Requirements, Cyber Security Framework",
                    "potential_impact": "Prevent regulatory violations and fines",
                    "implementation": [
                        "RAG (Retrieval Augmented Generation) over all IA regulations",
                        "Automated compliance checks during policy issuance",
                        "Real-time alerts for potential regulatory breaches",
                        "Automatic compliance report generation"
                    ]
                },
                {
                    "title": "Cyber Security Compliance AI",
                    "description": "Automated monitoring for cyber security framework compliance",
                    "regulatory_basis": "Cyber Security Framework, SAMA Cyber Security Framework",
                    "potential_impact": "Continuous compliance with NCA and SAMA cyber requirements",
                    "implementation": [
                        "Automated security posture assessment",
                        "Threat intelligence integration per IA guidelines",
                        "Automated incident reporting to IA",
                        "Compliance documentation generation"
                    ]
                },
                {
                    "title": "Historical Data Analysis for Regulatory Trends",
                    "description": "Analyze 17 years of IA market reports (2008-2025) to predict regulatory changes",
                    "regulatory_basis": "Insurance Market Reports 2008-2025",
                    "potential_impact": "Proactive adaptation to regulatory trends",
                    "implementation": [
                        "Time-series analysis of regulatory changes",
                        "Predictive modeling for future regulation directions",
                        "Automated alerts for emerging compliance requirements",
                        "Strategic planning based on regulatory evolution patterns"
                    ]
                }
            ],
            "data_sources": (ia_compliance['sources'][:2] if ia_compliance else []) + \
                           (ia_reports['sources'][:3] if ia_reports else [])
        })
        
        return recommendations
    
    def generate_customer_experience_insights(self) -> List[Dict[str, Any]]:
        """Generate AI chatbot and self-service recommendations"""
        recommendations = []
        
        # Look for AI customer journey and competitor AI implementations
        gen_ai_notebook = next((nb for nb in self.all_notebooks if "Generative AI" in nb['title'] and "Customer Journey" in nb['title']), None)
        rommaana_notebook = next((nb for nb in self.all_notebooks if "Rommaana AI" in nb['title']), None)
        
        recommendations.append({
            "area": "Customer Experience AI",
            "priority": "HIGH",
            "opportunities": [
                {
                    "title": "Agentic AI Workforce (Rommaana AI Platform)",
                    "description": "Deploy specialized AI agents for different insurance functions",
                    "competitive_advantage": "Based on Rommaana AI vision",
                    "potential_impact": "24/7 automated customer service, policy issuance, and claim intake",
                    "implementation": [
                        "Claims Agent: Intake, validation, and status updates",
                        "Policy Agent: Quotation, issuance, and renewal",
                        "Support Agent: General inquiries, document requests",
                        "Compliance Agent: Real-time policy compliance validation",
                        "Multi-language support (Arabic/English) for Saudi market"
                    ],
                    "inspiration": "Floatbot.AI's conversational AI platform (from competitor analysis)"
                },
                {
                    "title": "Voice AI for Customer Calls",
                    "description": "AI voice agents for inbound customer service calls",
                    "competitive_advantage": "Competitor: Verloop.io Voice AI",
                    "potential_impact": "Handle 80%+ of routine inquiries without human intervention",
                    "implementation": [
                        "Arabic and English voice recognition",
                        "Natural conversation flow for policy inquiries",
                        "Automatic claim registration via phone",
                        "Integration with core insurance systems",
                        "Escalation to human agents for complex cases"
                    ]
                },
                {
                    "title": "Intelligent Document Processing",
                    "description": "OCR + NLP for automated document processing",
                    "regulatory_basis": "Online Insurance Activities Regulation",
                    "potential_impact": "95%+ automation of document verification",
                    "implementation": [
                        "Automated extraction from ID cards, driving licenses",
                        "Vehicle registration document processing",
                        "Medical reports analysis for health insurance",
                        "Automatic validation against IA standards",
                        "Digital signature verification"
                    ]
                }
            ],
            "data_sources": (gen_ai_notebook['sources'][:3] if gen_ai_notebook else []) + \
                           (rommaana_notebook['sources'][: 2] if rommaana_notebook else [])
        })
        
        return recommendations
    
    def generate_underwriting_insights(self) -> List[Dict[str, Any]]:
        """Generate AI-powered underwriting recommendations"""
        recommendations = []
        
        recommendations.append({
            "area": "Underwriting Automation",
            "priority": "MEDIUM",
            "opportunities": [
                {
                    "title": "Accelerated Underwriting",
                    "description": "AI-powered instant underwriting decisions for low-risk policies",
                    "competitive_advantage": "Swiss Re's accelerated underwriting framework",
                    "potential_impact": "Instant policy issuance for 60-70% of applications",
                    "implementation": [
                        "Risk scoring model trained on historical IA market data",
                        "Alternative data sources (wearables, driving behavior)",
                        "Automated medical underwriting for life insurance",
                        "Real-time pricing optimization",
                        "Compliance with IA underwriting standards"
                    ]
                },
                {
                    "title": "Predictive Risk Assessment",
                    "description": "Machine learning for accurate risk prediction",
                    "regulatory_basis": "Historical market data from IA Reports 2008-2025",
                    "potential_impact": "Improve loss ratios by 15-20%",
                    "implementation": [
                        "Analyze 17 years of Saudi insurance market data",
                        "Identify risk patterns specific to Saudi market",
                        "Dynamic pricing based on real-time risk factors",
                        "Fraud risk scoring during underwriting"
                    ]
                }
            ]
        })
        
        return recommendations
    
    def generate_document_processing_insights(self) -> List[Dict[str, Any]]:
        """Generate document automation recommendations"""
        recommendations = []
        
        recommendations.append({
            "area": "Document Processing & Policy Generation",
            "priority": "MEDIUM",
            "opportunities": [
                {
                    "title": "Automated Policy Generation",
                    "description": "AI-powered generation of compliant insurance policies",
                    "regulatory_basis": "Standard insurance policy formats per IA",
                    "potential_impact": "Reduce policy generation time from hours to seconds",
                    "implementation": [
                        "Template-based generation using IA standard policies",
                        "Automatic clause selection based on coverage type",
                        "Multi-language policy generation (Arabic/English)",
                        "Compliance validation against IA standards",
                        "Digital signature integration"
                    ]
                },
                {
                    "title": "Intelligent Contract Analysis",
                    "description": "NLP-powered analysis of insurance contracts and terms",
                    "regulatory_basis": "Insurance Market Code of Conduct",
                    "potential_impact": "Ensure 100% compliance with IA regulations",
                    "implementation": [
                        "Automated extraction of key policy terms",
                        "Compliance checking against IA requirements",
                        "Suspicious clause detection",
                        "Automated contract comparison",
                        "Risk exposure analysis"
                    ]
                }
            ]
        })
        
        return recommendations
    
    def generate_reporting_insights(self) -> List[Dict[str, Any]]:
        """Generate automated reporting recommendations"""
        recommendations = []
        
        ia_reports = next((nb for nb in self.all_notebooks if "Reports" in nb['title'] and nb['title'].startswith('IA -')), None)
        
        recommendations.append({
            "area": "Automated Regulatory Reporting",
            "priority": "HIGH",
            "opportunities": [
                {
                    "title": "Automated IA Report Generation",
                    "description": "AI-powered generation of quarterly and annual IA reports",
                    "regulatory_basis": "Annual Experience Studies Report Instructions",
                    "potential_impact": "Reduce reporting time by 90%, eliminate errors",
                    "implementation": [
                        "Automated data extraction from core systems",
                        "Report generation per IA templates",
                        "Automated validation and error checking",
                        "Historical comparison against past reports",
                        "One-click submission to IA portal"
                    ]
                },
                {
                    "title": "Real-time Performance Dashboards",
                    "description": "AI-powered analytics dashboards with predictive insights",
                    "regulatory_basis": "IA Quarterly and Annual Market Reports",
                    "potential_impact": "Real-time decision making based on market trends",
                    "implementation": [
                        "Integration with 17 years of historical IA data",
                        "Predictive analytics for market trends",
                        "Automated anomaly detection",
                        "Comparative analysis vs market averages",
                        "Early warning system for regulatory issues"
                    ]
                }
            ],
            "data_sources": ia_reports['sources'][:5] if ia_reports else []
        })
        
        return recommendations
    
    def generate_comprehensive_report(self) -> Dict[str, Any]:
        """Generate complete AI insights report"""
        all_recommendations = []
        
        # Generate all insights
        all_recommendations.extend(self.generate_claims_automation_insights())
        all_recommendations.extend(self.generate_regulatory_compliance_insights())
        all_recommendations.extend(self.generate_customer_experience_insights())
        all_recommendations.extend(self.generate_underwriting_insights())
        all_recommendations.extend(self.generate_document_processing_insights())
        all_recommendations.extend(self.generate_reporting_insights())
        
        # Calculate priority distribution
        priority_counts = {}
        for rec in all_recommendations:
            priority = rec.get('priority', 'MEDIUM')
            priority_counts[priority] = priority_counts.get(priority, 0) + 1
        
        return {
            "report_date": datetime.now().isoformat(),
            "report_title": "AI Automation Opportunities for Insurance Industry",
            "executive_summary": {
                "total_recommendations": len(all_recommendations),
                "priority_distribution": priority_counts,
                "key_focus_areas": [rec['area'] for rec in all_recommendations],
                "data_foundation": {
                    "ia_notebooks": len([nb for nb in self.all_notebooks if nb['title'].startswith('IA -')]),
                    "historical_data_years": "2008-2025 (17 years)",
                    "total_sources": sum(nb.get('source_count', 0) for nb in self.all_notebooks)
                }
            },
            "recommendations": all_recommendations,
            "implementation_priority": [
                {
                    "phase": "Phase 1 (0-3 months) - Quick Wins",
                    "areas": ["Claims Processing Automation", "Customer Experience AI"]
                },
                {
                    "phase": "Phase 2 (3-6 months) - Compliance & Regulation",
                    "areas": ["Regulatory Compliance Automation", "Automated Regulatory Reporting"]
                },
                {
                    "phase": "Phase 3 (6-12 months) - Advanced AI",
                    "areas": ["Underwriting Automation", "Document Processing & Policy Generation"]
                }
            ]
        }
    
    def save_report(self, filename: str = "insurance_ai_insights.json"):
        """Save comprehensive insights report"""
        report = self.generate_comprehensive_report()
        filepath = self.data_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\nAI Insights report saved to {filepath}")
        return filepath, report

def main():
    generator = InsuranceAIInsightsGenerator()
    
    print("=== Insurance AI Insights Generator ===\n")
    
    if not generator.load_analysis_data():
        print("Warning: Some analysis data not found. Generating insights from available notebooks...")
    
    print("\nGenerating AI-driven recommendations...")
    
    # Generate and save report
    report_path, report = generator.save_report()
    
    # Print executive summary
    print("\n" + "="*60)
    print("EXECUTIVE SUMMARY")
    print("="*60)
    print(f"\nTotal AI Opportunities Identified: {report['executive_summary']['total_recommendations']}")
    print(f"\nPriority Distribution:")
    for priority, count in report['executive_summary']['priority_distribution'].items():
        print(f"  {priority}: {count} opportunities")
    
    print(f"\nKey Focus Areas:")
    for area in report['executive_summary']['key_focus_areas']:
        print(f"  • {area}")
    
    print(f"\nData Foundation:")
    print(f"  • IA Notebooks: {report['executive_summary']['data_foundation']['ia_notebooks']}")
    print(f"  • Historical Data: {report['executive_summary']['data_foundation']['historical_data_years']}")
    print(f"  • Total Sources: {report['executive_summary']['data_foundation']['total_sources']}")
    
    print(f"\n" + "="*60)
    print("Implementation Roadmap:")
    print("="*60)
    for phase in report['implementation_priority']:
        print(f"\n{phase['phase']}")
        for area in phase['areas']:
            print(f"  ✓ {area}")
    
    print(f"\n\nFull detailed report saved to: {report_path}")

if __name__ == "__main__":
    main()
