
import axios from 'axios';
import { performance } from 'perf_hooks';

const BASE_URL = 'http://localhost:5001';

async function measureEndpoint(name: string, url: string) {
    try {
        const start = performance.now();
        const response = await axios.get(url);
        const end = performance.now();
        const duration = end - start;

        console.log(`✅ ${name}: ${duration.toFixed(2)}ms`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Data Size: ${JSON.stringify(response.data).length} bytes`);

        if (response.headers['x-cache']) {
            console.log(`   Cache: ${response.headers['x-cache']}`);
        }

        return duration;
    } catch (error: any) {
        console.log(`❌ ${name}: Failed - ${error.message}`);
        return null;
    }
}

async function runTests() {
    console.log('🚀 Starting API Performance Tests...\n');

    // Warm up cache first
    console.log('--- Warming Up Cache ---');
    await measureEndpoint('Warmup Models', `${BASE_URL}/api/models?fields=minimal`);
    await measureEndpoint('Warmup Variants', `${BASE_URL}/api/variants?fields=minimal`);
    console.log('------------------------\n');

    console.log('--- Measured Performance ---');

    // 1. Models List (Optimized with field projection)
    await measureEndpoint('Models List (Minimal)', `${BASE_URL}/api/models?fields=id,name,brandId,price,heroImage`);

    // 2. Variants List (Optimized with field projection)
    // Need a model ID first
    const modelsRes = await axios.get(`${BASE_URL}/api/models?limit=1`);
    const modelId = modelsRes.data[0]?.id;
    if (modelId) {
        await measureEndpoint('Variants List (Minimal)', `${BASE_URL}/api/variants?modelId=${modelId}&fields=id,name,price,fuel,transmission`);
    }

    // 3. Compare API
    // Need a slug
    const compareSlug = 'tata-nexon-vs-maruti-brezza'; // Example
    await measureEndpoint('Compare API', `${BASE_URL}/api/compare/${compareSlug}`);

    // 4. Budget API
    await measureEndpoint('Budget API (10-15L)', `${BASE_URL}/api/cars-by-budget/10-15-lakh`);

    // 5. Brands List
    await measureEndpoint('Brands List', `${BASE_URL}/api/brands`);

    console.log('\n✨ Tests Completed');
}

runTests();
