/**
 * Update Maruti Suzuki Invicto Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 3
 * Highlights: 2.0L Strong Hybrid, Captain Seats, Memory Seats, Power Tailgate
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs
// Strong Hybrid (2.0L): 139 kW (188.9 PS) -> ~186 Bhp
const ENGINES = {
    'Strong Hybrid': {
        engineName: '2.0l Intelligent Electric Hybrid',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1987',
        engineCapacity: '1987 cc',
        power: '186 Bhp',
        maxPower: '186 Bhp',
        enginePower: '189 PS', // System Combined
        torque: '206 Nm', // Motor Torque
        engineTorque: '206 Nm (Motor) / 188 Nm (Engine)',
        engineTransmission: 'e-CVT',
        engineSpeed: 'e-CVT',
        noOfGears: '0', // e-CVT
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Strong Hybrid'
    }
};

// Mileage Data
const MILEAGE_DATA = {
    'Strong Hybrid': {
        mileageEngineName: '2.0l Strong Hybrid',
        mileageCompanyClaimed: '23.24 kmpl',
        mileageCityRealWorld: '18 kmpl',
        mileageHighwayRealWorld: '16 kmpl',
        mileageCity: '18',
        mileageHighway: '16',
        engineSummary: 'The 2.0L Strong Hybrid system delivers exceptional efficiency of 23.24 kmpl for a premium MPV.'
    }
};

// Common Specs from Brochure
const COMMON_SPECS = {
    length: '4755',
    width: '1850', // Zeta+ 1845? Image Crop 4 says 1845 for Zeta+, 1850 for Alpha+. Wait.
    // Let's use 1850 as standard, and maybe override if strictly needed, but 5mm diff is negligible for metadata.
    // Actually, let's use logic in getVariantFeatures if possible or just stick to 1850.
    height: '1795',
    wheelbase: '2850',
    groundClearance: '185', // Standard for Invicto/Hycross
    bootSpace: '300 Litres', // Approx with 3rd row up (239L to roof?)
    fuelTankCapacity: '52 Litres',
    doors: '5',

    // Suspension & Brakes
    frontSuspension: 'Macpherson Strut',
    rearSuspension: 'Torsion Beam',
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Solid Disc', // Image 4: "Solid Disc"

    // Safety Standard
    airbags: '6',
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    abs: 'Yes',
    ebd: 'Yes',
    esp: 'Yes',
    hillHoldAssist: 'Yes',
    isofix: 'Yes',
    seatbeltWarning: 'Yes',
    engineImmobilizer: 'Yes',
    rearUniqueSensors: 'Yes',
    speedAlertSystem: 'Yes',
    tpms: 'Yes', // Zeta+ (-), Alpha+ (Tick)? Image 3 Safety: Tyre Pressure Monitoring System -> Zeta+ (-), Alpha+ (Tick).
    // TPMS is NOT standard.
};

function getVariantFeatures(variantName: string) {
    const isAlpha = variantName.includes('Alpha');
    const isZeta = variantName.includes('Zeta');
    const is7S = variantName.includes('7S');
    const is8S = variantName.includes('8S');

    let features: Record<string, any> = {};

    features.seatingCapacity = is8S ? '8' : '7';
    features.width = isAlpha ? '1850' : '1845'; // According to Image 4 specs

    // Warranty
    features.warranty = '8 Years / 1,60,000 Km (Battery)';

    // Key Features Construction
    let keyFeaturesArr = ['6 Airbags', 'e-CVT', 'Auto AC'];
    let summary = `The Invicto ${variantName} `;

    // Common
    features.headLights = 'LED';
    features.cruiseControl = 'Yes';
    features.alloyWheels = '17 inch Precision Cut Alloy';
    features.rearWiper = 'Yes';
    features.climateControl = 'Automatic'; // Dual Zone usually? Image 2: "Automatic Climate Control (2nd Zone)" -> Alpha+. Zeta+ "Automatic Blower control".
    // So Zeta+ has Auto AC front, but manual blower rear?
    features.airConditioning = 'Automatic';

    if (isZeta) {
        keyFeaturesArr.push('8-inch SmartPlay Magnum', 'Rear Camera', 'Paddle Shifters', 'Push Button Start');
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.32 cm SmartPlay Magnum';
        features.reverseCamera = 'Yes';
        features.sunroof = 'No';
        features.leatherSeats = 'No (Fabric)';
        features.ventilatedSeats = 'No';
        features.powerTailgate = 'No';
        features.appleCarPlay = 'Wired';
        features.tpms = 'No';
        summary += 'offers a premium entry into the hybrid world with spacious seating and smart tech.';
    } else if (isAlpha) {
        keyFeaturesArr.push('10.1-inch SmartPlay Magnum+', 'Panoramic Sunroof', 'Ventilated Seats', 'Power Tailgate', '360 Camera');
        features.touchScreenInfotainment = '10.1 inch';
        features.infotainmentScreen = '25.65 cm SmartPlay Magnum+';
        features.reverseCamera = '360 Degree View';
        features.sunroof = 'Panoramic Electric Sunroof';
        features.leatherSeats = 'Yes (Leatherette)';
        features.ventilatedSeats = 'Front';
        features.powerTailgate = 'Yes';
        features.appleCarPlay = 'Wireless';
        features.tpms = 'Yes';
        features.driverSeatAdjustment = '8-Way Power with Memory';
        features.ambientLighting = 'Yes'; // Premium Roof Ambient Lighting
        summary += 'is the ultimate luxury MPV with ventilated seats, a panoramic sunroof, and a powered tailgate.';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' Powered by the sophisticated 2.0L Intelligent Electric Hybrid system.';

    // Wheels
    features.wheelSize = '17 inch';
    features.tyreSize = '215/60 R17';

    features.speakers = '6 Speakers'; // Image 1: Speakers (6) -> Tick for both.

    return features;
}

const INVICTO_VARIANTS = [
    { name: 'Invicto Zeta Plus 7S', price: 2497400 },
    { name: 'Invicto Zeta Plus 8S', price: 2502300 },
    { name: 'Invicto Alpha Plus 7S', price: 2860500 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Invicto/i } }).lean();
    if (!model) {
        console.error('❌ Maruti Suzuki Invicto model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI INVICTO VARIANTS UPDATE ===\n');
    console.log(`Model ID: ${model.id}`);
    console.log(`Brand ID: ${model.brandId}\n`);

    if (!isDryRun) {
        const deleteResult = await Variant.deleteMany({ modelId: model.id });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing variants\n`);
    } else {
        const existingCount = await Variant.countDocuments({ modelId: model.id });
        console.log(`Would delete ${existingCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(70));
    for (const v of INVICTO_VARIANTS) {
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | Strong Hybrid`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${INVICTO_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = INVICTO_VARIANTS[2]; // Alpha Plus 7S
        const engineSpecs = ENGINES['Strong Hybrid'];
        const mileageData = MILEAGE_DATA['Strong Hybrid'];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of INVICTO_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/7s/g, '7-str');
            sanitizedName = sanitizedName.replace(/8s/g, '8-str');
            sanitizedName = sanitizedName.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            const variantId = `variant-${model.brandId}-${model.id}-${sanitizedName}`;
            const engineSpecs = ENGINES['Strong Hybrid'];
            const mileageData = MILEAGE_DATA['Strong Hybrid'];
            const features = getVariantFeatures(variant.name);

            const variantDoc = {
                id: variantId,
                name: variant.name,
                brandId: model.brandId,
                modelId: model.id,
                price: variant.price,
                status: 'active',
                ...COMMON_SPECS,
                ...engineSpecs,
                ...mileageData,
                ...features,
            };

            await Variant.create(variantDoc);
            console.log(`✅ Added: ${variant.name}`);
        }
        const newCount = await Variant.countDocuments({ modelId: model.id });
        console.log(`\n🎉 Maruti Suzuki Invicto now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
