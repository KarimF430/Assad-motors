
import axios from 'axios';

async function testHello() {
    console.log('🚀 Sending "hello" to /api/ai-chat...');
    const startTime = Date.now();

    try {
        const response = await axios.post('http://localhost:5001/api/ai-chat', {
            message: 'hello',
            sessionId: 'debug-session-' + Date.now(),
            history: [],
            conversationState: {}
        }, {
            timeout: 30000 // 30s timeout
        });

        const duration = Date.now() - startTime;
        console.log(`✅ Received response in ${duration}ms`);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`❌ Failed in ${duration}ms`);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testHello();
