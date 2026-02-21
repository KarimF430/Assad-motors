import fetch from 'node-fetch';

async function testWithLogging() {
    console.log('Testing API with detailed logging\n');

    const url = 'http://localhost:5001/api/upcoming-cars?limit=all';
    console.log('Fetching:', url);

    const response = await fetch(url);
    const data = await response.json();

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    console.log('Is array:', Array.isArray(data));
    console.log('Length:', Array.isArray(data) ? data.length : 'N/A');
}

testWithLogging();
