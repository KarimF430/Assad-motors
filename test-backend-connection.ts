
import fetch from 'node-fetch';

async function testBackend() {
    try {
        const backendUrl = 'http://localhost:5001';
        console.log(`Testing backend at ${backendUrl}...`);

        const payload = {
            name: "Test User",
            phone: "1234567890",
            email: "test@example.com",
            city: "Test City",
            status: "new"
        };

        console.log("Sending payload:", payload);

        const response = await fetch(`${backendUrl}/api/consultation-leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log(`Response status: ${response.status}`);
        const text = await response.text();
        console.log(`Response body: ${text}`);

    } catch (error) {
        console.error("Test failed:", error);
    }
}

testBackend();
