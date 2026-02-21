import axios from 'axios';

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5001';

async function verifyCretaPrice() {
    console.log('\n🚀 Starting Hyundai Creta Price Page Verification...\n');

    try {
        // 1. Test Frontend Page Status and Content
        const url = `${FRONTEND_URL}/hyundai-cars/creta/price-in/mumbai`;
        console.log(`🌐 Fetching: ${url}`);
        const startTime = Date.now();
        const res = await axios.get(url);
        const duration = Date.now() - startTime;

        console.log(`📡 Status: ${res.status}`);
        console.log(`⏱️ Response Time: ${duration}ms`);

        const checks = [
            { name: 'Model Name', pattern: /Hyundai Creta/i },
            { name: 'City Name', pattern: /Mumbai/i },
            { name: 'Price Table', pattern: /On-Road Price Breakdown/i },
            { name: 'Ex-Showroom', pattern: /Ex-Showroom Price/i },
            { name: 'Insurance', pattern: /Insurance/i },
            { name: 'RTO', pattern: /RTO Registration/i },
            { name: 'Similar Cars', pattern: /Compare Hyundai Creta with Similar Cars/i }
        ];

        let allPassed = true;
        for (const check of checks) {
            if (check.pattern.test(res.data)) {
                console.log(`✅ ${check.name} found`);
            } else {
                console.warn(`❌ ${check.name} NOT found in HTML`);
                allPassed = false;
            }
        }

        // 2. Test Backend API for Creta (Model & Variants)
        console.log('\n🔍 Verifying Backend APIs...');

        // Find Brand
        const brandsRes = await axios.get(`${BACKEND_URL}/api/brands`);
        const hyundai = brandsRes.data.find((b: any) => b.name.toLowerCase() === 'hyundai');
        if (!hyundai) {
            console.error('❌ Hyundai brand not found');
            allPassed = false;
        } else {
            console.log(`✅ Brand API: Found Hyundai (${hyundai.id})`);
        }

        // Find Model
        const modelsRes = await axios.get(`${BACKEND_URL}/api/models`);
        const creta = modelsRes.data.find((m: any) => m.brandId === (hyundai?.id || '') && m.name.toLowerCase() === 'creta');
        if (!creta) {
            console.error('❌ Creta model not found');
            allPassed = false;
        } else {
            console.log(`✅ Model API: Found Creta (${creta.id})`);
        }

        // Check Variants
        if (creta) {
            const variantsRes = await axios.get(`${BACKEND_URL}/api/variants?modelId=${creta.id}`);
            console.log(`✅ Variants API: Found ${variantsRes.data.length} variants for Creta`);
            if (variantsRes.data.length === 0) allPassed = false;
        }

        if (allPassed) {
            console.log('\n🏆 ALL TESTS PASSED! Hyundai Creta Price Page is fully optimized and functional.\n');
        } else {
            console.error('\n⚠️ Some checks failed. Please review the output above.\n');
            process.exit(1);
        }

    } catch (error: any) {
        console.error(`\n💥 Fatal Error: ${error.message}`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data Snippet: ${String(error.response.data).substring(0, 200)}`);
        }
        process.exit(1);
    }
}

verifyCretaPrice();
