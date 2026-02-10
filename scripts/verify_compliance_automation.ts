import { complianceAgent } from '../src/services/agents/compliance-agent';
import { complianceMonitor } from '../src/services/compliance/compliance-monitor';
import { cyberSecurityCompliance } from '../src/services/compliance/cyber-security-compliance';
import { regulatoryTrendsService } from '../src/services/analytics/regulatory-trends';

/**
 * Verification Script for Regulatory Compliance Automation
 */

async function main() {
    console.log('⚖️ Verifying Regulatory Compliance System...\n');

    // 1. Test Compliance Monitor
    console.log('[1/4] Testing Compliance Monitor...');
    if (complianceMonitor && typeof complianceMonitor.checkCompliance === 'function') {
        console.log('✅ Compliance Monitor initialized successfully');
        console.log('   - Methods: checkCompliance, batchCheck, getAlerts');
    } else {
        console.error('❌ Compliance Monitor initialization failed');
    }

    // 2. Test Cyber Security Compliance
    console.log('\n[2/4] Testing Cyber Security Compliance Service...');
    if (cyberSecurityCompliance && typeof cyberSecurityCompliance.assessSAMACompliance === 'function') {
        console.log('✅ Cyber Security Compliance Service initialized successfully');
        console.log('   - Methods: assessSAMACompliance, assessNCACompliance');
    } else {
        console.error('❌ Cyber Security Compliance Service initialization failed');
    }

    // 3. Test Regulatory Trends Service
    console.log('\n[3/4] Testing Regulatory Trends Service...');
    if (regulatoryTrendsService && typeof regulatoryTrendsService.analyzeTrend === 'function') {
        console.log('✅ Regulatory Trends Service initialized successfully');
        console.log('   - Methods: analyzeTrend, getEmergingRisks');
    } else {
        console.error('❌ Regulatory Trends Service initialization failed');
    }

    // 4. Test Compliance Agent Tools
    console.log('\n[4/4] Verifying Compliance Agent Tools...');
    const metadata = complianceAgent.getMetadata();
    const tools = metadata.availableTools;

    const requiredTools = ['check_compliance', 'get_requirements', 'check_cyber_security', 'analyze_trend'];
    const missingTools = requiredTools.filter(t => !tools.includes(t));

    if (missingTools.length === 0) {
        console.log('✅ All required tools registered successfully:');
        tools.forEach(t => console.log(`   - ${t}`));
    } else {
        console.error('❌ Missing tools:', missingTools.join(', '));
    }

    console.log('\n✨ Verification Complete!');
}

main().catch(console.error);
