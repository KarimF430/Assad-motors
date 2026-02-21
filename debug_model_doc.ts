const backendUrl2 = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

async function checkModelDocument() {
    console.log('=== Checking Hyundai Creta Model Document ===')

    const modelRes = await fetch(`${backendUrl2}/api/models/model-brand-hyundai-creta`)
    const modelData = await modelRes.json()

    console.log('\nModel ID:', modelData.id)
    console.log('Model Name:', modelData.name)
    console.log('Fuel Types in Model:', modelData.fuelTypes)
    console.log('Transmissions in Model:', modelData.transmissions)
    console.log('Status:', modelData.status)

    // Check if there's a difference between what's stored and what should be
    console.log('\n=== Comparing with Models-with-Pricing API ===')
    const pricingRes = await fetch(`${backendUrl2}/api/models-with-pricing?limit=1`)
    const pricingData = await pricingRes.json()
    const cretaFromPricing = (pricingData.data || pricingData).find((m: any) => m.id === 'model-brand-hyundai-creta')

    if (cretaFromPricing) {
        console.log('Fuel Types from Pricing API:', cretaFromPricing.fuelTypes)
        console.log('Transmissions from Pricing API:', cretaFromPricing.transmissions)
    }
}

checkModelDocument().catch(console.error)
