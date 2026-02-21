
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001';

async function listVariants(brand: string, model: string) {
    console.log(`\nListing Variants for: ${brand}/${model}`);
    try {
        // We can't easily list variants via the new API without a specific variant slug.
        // But we can use the model-details API which returns variants!
        const res = await fetch(`${BASE_URL}/api/model-details/${brand}/${model}`);
        if (res.status === 200) {
            const data = await res.json();
            console.log('Response Data:', JSON.stringify(data, null, 2));
            console.log(`✅ Model Found: ${data.name}`);
            console.log(`   Variants Count: ${data.variants.length}`);
            data.variants.forEach((v: any) => {
                console.log(`   - Name: "${v.name}" -> ID: ${v.id}`);
            });
        } else {
            console.log(`❌ Status ${res.status}`);
        }
    } catch (e) {
        console.log(`❌ Network Error: ${e.message}`);
    }
}

async function run() {
    await listVariants('tata-cars', 'tata-nexon');
}

run();
