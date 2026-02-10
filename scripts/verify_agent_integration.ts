import { claimsAgent } from '../src/services/agents/claims-agent';
import { AgentContext } from '../src/services/agents/base-agent';

async function verify() {
    console.log('--- Verifying Claims Agent + NotebookLM Integration ---');

    const context: AgentContext = {
        conversationId: 'verify-test-' + Date.now(),
        language: 'en'
    };

    const userMessage = "What are the motor insurance requirements according to IA?";
    console.log(`User: ${userMessage}`);

    try {
        const response = await claimsAgent.chat(userMessage, context);
        console.log('\n--- Agent Response ---');
        console.log(response.message);

        if (response.message.toLowerCase().includes('requirement') || response.message.length > 50) {
            console.log('\n✅ Integration Test Passed: Received a substantial response.');
        } else {
            console.log('\n❌ Integration Test Failed: Response seems empty or irrelevant.');
        }
    } catch (error) {
        console.error('\n❌ Integration Test Error:', error);
    }
}

verify();
