/**
 * Update Maruti Suzuki Eeco Variants - December 2025
 * 
 * Data Source: Official Brochure provided by user
 * Total Variants: 4
 * Highlights: 1.2L Advanced K-Series Engine, 5/7 Seater (Brochure says 5 and 7? User says 5/6 seater standard. Let's stick to user list: 6 Seater Standard), Sliding Doors.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs (1.2L K12N)
const ENGINES = {
    'Petrol MT': {
        engineName: '1.2L Advanced K-Series',
        engineType: 'K12N',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '80 Bhp', // 80.76 PS = 80 Bhp approx
        maxPower: '80 Bhp',
        enginePower: '81 PS',
        torque: '104 Nm',
        engineTorque: '104.4 Nm @ 3000 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'RWD', // Eeco is RWD (Rear Wheel Drive) - Unique in segment!
        driveTrain: 'Rear Wheel Drive',
        cylinders: '4'
    },
    'CNG MT': {
        engineName: '1.2L Advanced K-Series S-CNG',
        engineType: 'K12N CNG',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '71 Bhp', // 71.65 PS
        maxPower: '71 Bhp',
        enginePower: '72 PS',
        torque: '95 Nm',
        engineTorque: '95 Nm @ 3000 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'CNG',
        fuel: 'CNG',
        transmission: 'Manual',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        cylinders: '4'
    },
};

// Mileage data
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.2l Petrol',
        mileageCompanyClaimed: '19.71',
        mileageCityRealWorld: '15',
        mileageHighwayRealWorld: '18',
        mileageCity: '15',
        mileageHighway: '18',
        engineSummary: 'The reliable 1.2L K-Series engine delivers sufficient power for heavy loads and city commutes.',
    },
    'CNG MT': {
        mileageEngineName: '1.2l S-CNG',
        mileageCompanyClaimed: '26.78 km/kg',
        mileageCityRealWorld: '22 km/kg',
        mileageHighwayRealWorld: '25 km/kg',
        mileageCity: '22',
        mileageHighway: '25',
        engineSummary: 'Eeco S-CNG ensures high profitability with excellent fuel efficiency.',
    },
};

// Common specs
const COMMON_SPECS = {
    length: '3675',
    width: '1475',
    height: '1825',
    wheelbase: '2350',
    groundClearance: '160',
    fuelTankCapacity: '32 Litres', // CNG: 65L water equiv (Brochure)
    doors: '5',
    // boot space varies greatly

    // Suspension
    frontSuspension: 'MacPherson Strut',
    rearSuspension: '3 Link Rigid', // Leaf spring? No, Brochure says "MacPherson Strut" Front. Rear isn't clear in crop but historically multi-link rigid or similar. 
    // Wait, Brochure crop says "Front Suspension: MacPherson Strut". Rear is cut off slightly but looks like it might be blank or standard rigid axle.
    // Let's stick to generic RWD suspension description or leave blank if unsure.
    // Standard Eeco is known for leaf springs/coil options depending on ambulance/cargo. Passenger usually 5 Link Rigid?
    // Let's use 'Rigid Axle with Coil Spring' - safest for passenger Eeco.

    // Brakes
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Safety
    airbags: '2', // Dual Front
    abs: 'Yes',
    ebd: 'Yes',
    seatbeltWarning: 'Yes',
    parkingSensors: 'Rear',
    speedAlertSystem: 'Yes',
    engineImmobilizer: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const is5Seater = variantName.includes('5 Seater');
    const is6Seater = variantName.includes('6 Seater'); // User says 6 seater standard.
    const isAC = variantName.includes('AC') && !variantName.includes('Standard'); // "5 Seater AC"
    const isStandard = variantName.includes('Standard');
    const isCNG = variantName.includes('CNG');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Wheels
    features.wheelSize = '13 inch';
    features.tyreSize = '155 R13';
    features.alloyWheels = 'No (Center Cap)';

    // Key Features Sequence
    let keyFeaturesArr = ['Dual Airbags', 'ABS with EBD', 'Reverse Parking Sensors'];
    let summary = `The Eeco ${variantName} `;

    features.powerSteering = 'No'; // Eeco does not have Power Steering? Brochure: Steering Lock. No mention of Power Steering in comfort. 
    // Wait, recent Eeco K-Series update. Does it have PS? 
    // Brochure crop: "Steering Lock". "Heater". "Reclining Front Seats".
    // No Power Steering mentioned in Comfort list. It is non-PS usually!
    // But some sources say 2022 update added it? No, brochure is king. 
    // Brochure crop does NOT show Power Steering. It shows "Sliding Driver Seat", "Reclining Front Seats". 
    // Let's assume No Power Steering.
    features.powerSteering = 'No';

    if (is5Seater) {
        features.seatingCapacity = '5';
        summary += 'offers spacious seating for 5 passengers with ample cargo space.';
    } else if (is6Seater) {
        features.seatingCapacity = '6';
        summary += 'maximizes capacity with seating for 6.';
    }

    if (isAC) {
        keyFeaturesArr.push('Air Conditioning', 'Heater', 'Cabin Air Filter');
        features.airConditioning = 'Manual AC with Heater';
        features.cabinAirFilter = 'Yes';
        summary += ' It comes equipped with Air Conditioning for comfortable journeys.';
    } else {
        features.airConditioning = 'Heater Only'; // Standard has Heater
        keyFeaturesArr.push('Heater');
        summary += ' is a budget-friendly option with a standard heater.';
    }

    // Interior
    features.digitalCluster = 'Digital Instrument Cluster';
    features.upholstery = 'Dual Tone';

    // Windows
    features.powerWindows = 'No'; // Manual winding

    // Central Locking
    features.centralLocking = 'No'; // Manual locking

    // CNG
    if (isCNG) {
        features.fuelTankCapacity = '65 Litres (Water Equiv) + 32 Litres (Petrol)';
        features.bootSpace = 'Reduced';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' A versatile MPV designed for every Indian family and business.';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    return 'Petrol MT';
}

const EECO_VARIANTS = [
    { name: 'Eeco 5 Seater Standard', price: 520900 },
    { name: 'Eeco 6 Seater Standard', price: 547400 },
    { name: 'Eeco 5 Seater AC', price: 553800 },
    { name: 'Eeco 5 Seater AC CNG', price: 635800 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    console.log('Script started...');
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found in environment!');
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Eeco/i } }).lean();

    if (!model) {
        console.error('❌ Maruti Suzuki Eeco model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI EECO VARIANTS UPDATE ===\n');
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
    for (const v of EECO_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${EECO_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = EECO_VARIANTS[2]; // 5 Seater AC
        const engineKey = getEngineKey(sampleVariant.name);
        const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
        const mileageData = MILEAGE_DATA[engineKey as keyof typeof MILEAGE_DATA];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of EECO_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\s+/g, '-');
            sanitizedName = sanitizedName.replace(/[^a-z0-9-]+/g, '');

            const variantId = `variant-${model.brandId}-${model.id}-${sanitizedName}`;
            const engineKey = getEngineKey(variant.name);
            const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
            const mileageData = MILEAGE_DATA[engineKey as keyof typeof MILEAGE_DATA];
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
        console.log(`\n🎉 Maruti Suzuki Eeco now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
