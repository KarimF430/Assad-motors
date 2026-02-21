const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

async function testAPIs() {
    console.log('=== Testing Popular Cars API ===')
    const popularRes = await fetch(`${backendUrl}/api/cars/popular`)
    const popularData = await popularRes.json()
    console.log('Popular Cars Sample:', JSON.stringify(popularData[0], null, 2))

    console.log('\n=== Testing Models with Pricing API ===')
    const modelsRes = await fetch(`${backendUrl}/api/models-with-pricing?limit=10`)
    const modelsData = await modelsRes.json()
    const models = modelsData.data || modelsData
    console.log('Models Sample:', JSON.stringify(models[0], null, 2))

    console.log('\n=== Testing Brands API ===')
    const brandsRes = await fetch(`${backendUrl}/api/brands`)
    const brandsData = await brandsRes.json()
    console.log('Brands Count:', brandsData.length)
}

testAPIs().catch(console.error)
