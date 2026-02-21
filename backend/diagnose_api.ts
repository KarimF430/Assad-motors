import fetch from 'node-fetch';

async function diagnoseAPI() {
    try {
        console.log('🔍 Detailed API Diagnosis\n');

        // Test 1: Without limit parameter
        console.log('--- Test 1: /api/upcoming-cars ---');
        const res1 = await fetch('http://localhost:5001/api/upcoming-cars');
        const text1 = await res1.text();
        console.log('Raw response:', text1);
        const data1 = JSON.parse(text1);
        console.log('Parsed type:', Array.isArray(data1) ? 'Array' : typeof data1);
        console.log('Length/keys:', Array.isArray(data1) ? data1.length : Object.keys(data1));
        console.log('');

        // Test 2: With limit=all
        console.log('--- Test 2: /api/upcoming-cars?limit=all ---');
        const res2 = await fetch('http://localhost:5001/api/upcoming-cars?limit=all');
        const text2 = await res2.text();
        console.log('Raw response:', text2);
        const data2 = JSON.parse(text2);
        console.log('Parsed type:', Array.isArray(data2) ? 'Array' : typeof data2);
        console.log('Length/keys:', Array.isArray(data2) ? data2.length : Object.keys(data2));

        // Check if it's a paginated response
        if (!Array.isArray(data2) && data2.data) {
            console.log('Detected paginated response!');
            console.log('data.data length:', data2.data.length);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

diagnoseAPI();
