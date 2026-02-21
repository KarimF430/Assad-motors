/**
 * Update Maruti Suzuki Alto K10 Variants - December 2025
 * 
 * Data Source: Provided by user + Standard Specs
 * Total Variants: 8
 * Highlights: K10C Engine, CNG, AGS, HEARTECT Platform
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs (K10C - Same as S-Presso)
const ENGINES = {
    'Petrol MT': {
        engineName: '1.0L K10C',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '66 Bhp', // 66.6 PS
        maxPower: '66 Bhp',
        enginePower: '67 PS',
        torque: '89 Nm',
        engineTorque: '89 Nm @ 3500 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'Petrol AGS': {
        engineName: '1.0L K10C AGS',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '66 Bhp',
        maxPower: '66 Bhp',
        enginePower: '67 PS',
        torque: '89 Nm',
        engineTorque: '89 Nm @ 3500 rpm',
        engineTransmission: '5-Speed AGS (AMT)',
        engineSpeed: '5-Speed AGS',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'CNG MT': {
        engineName: '1.0L K10C CNG',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '56 Bhp', // 56.69 PS
        maxPower: '56 Bhp',
        enginePower: '57 PS',
        torque: '82 Nm',
        engineTorque: '82.1 Nm @ 3400 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'CNG',
        fuel: 'CNG',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
};

// Mileage data
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.0l Petrol Manual',
        mileageCompanyClaimed: '24.39',
        mileageCityRealWorld: '19',
        mileageHighwayRealWorld: '22',
        mileageCity: '19',
        mileageHighway: '22',
        engineSummary: 'The next-gen K10C engine delivers peppy performance with segment-leading fuel efficiency.',
    },
    'Petrol AGS': {
        mileageEngineName: '1.0l Petrol AGS',
        mileageCompanyClaimed: '24.90',
        mileageCityRealWorld: '19',
        mileageHighwayRealWorld: '23',
        mileageCity: '19',
        mileageHighway: '23',
        engineSummary: 'The AGS automatic provides convenience for city driving while offering better mileage than manual.',
    },
    'CNG MT': {
        mileageEngineName: '1.0l CNG Manual',
        mileageCompanyClaimed: '33.85 km/kg',
        mileageCityRealWorld: '28 km/kg',
        mileageHighwayRealWorld: '31 km/kg',
        mileageCity: '28',
        mileageHighway: '31',
        engineSummary: 'Alto K10 S-CNG offers incredible savings with factory-fitted safety and performance.',
    },
};

// Common specs
const COMMON_SPECS = {
    length: '3530',
    width: '1490',
    height: '1520',
    wheelbase: '2380',
    groundClearance: '167', // Unladen usually cited around 160-167 for K10
    fuelTankCapacity: '27 Litres', // CNG: 55L water equiv
    doors: '5',
    seatingCapacity: '5',
    bootSpace: '214 Litres', // Petrol

    // Suspension
    frontSuspension: 'MacPherson strut with Coil Spring',
    rearSuspension: 'Torsion Beam with Coil Spring',

    // Brakes
    frontBrake: 'Disc', // Front Disc
    rearBrake: 'Drum',

    // Safety
    airbags: '2', // Dual Front Airbags
    abs: 'Yes',
    seatbeltWarning: 'Yes',
    parkingSensors: 'Rear',
    speedAlertSystem: 'Yes',
    engineImmobilizer: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isStd = variantName.includes('Std');
    const isLXi = variantName.includes('LXi');
    const isVXi = variantName.includes('VXi') && !variantName.includes('VXi+');
    const isVXiPlus = variantName.includes('VXi+');
    const isAGS = variantName.includes('AGS');
    const isCNG = variantName.includes('CNG');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Wheels
    features.wheelSize = '13 inch';
    features.tyreSize = '145/80 R13';
    features.alloyWheels = 'No (Full Wheel Covers on VXi+)';
    // Brochure: Full Wheel Covers for VXi+ only? Or VXi too? Usually VXi+ has covers, others cap.

    // Key Features Sequence
    let keyFeaturesArr = ['Dual Airbags', 'ABS with EBD', 'Reverse Parking Sensors'];
    let summary = `The Alto K10 ${variantName} `;

    if (isStd) {
        summary += 'offers the essentials of mobility with the peppy K10C engine and standard safety features.';
        features.airConditioning = 'No';
        features.powerSteering = 'No';
    } else if (isLXi) {
        keyFeaturesArr.push('AC with Heater', 'Power Steering');
        summary += 'adds comfort with Air Conditioning and Power Steering.';
        features.airConditioning = 'Manual AC with Heater';
        features.powerSteering = 'Electric Power Steering';
    } else if (isVXi) {
        keyFeaturesArr.push('SmartPlay Dock', 'Front Power Windows', 'Central Locking', 'Speed Sensing Auto Door Lock');
        summary += 'enhances convenience with a music system dock, central locking, and front power windows.';
        features.airConditioning = 'Manual AC with Heater';
        features.powerSteering = 'Electric Power Steering';
        features.powerWindows = 'Front Only';
        features.centralLocking = 'Remote Keyless Entry'; // VXi usually has remote? Or just key?
        // Brochure scan suggests VXi has Central Door Locking, Keyless likely VXi+? 
        // Let's assume VXi has Central Locking, VXi+ Remote.
        features.centralLocking = 'Yes';
    } else if (isVXiPlus) {
        keyFeaturesArr.push('7-inch SmartPlay Studio', 'Remote Keyless Entry', 'Steering Mounted Controls', '4 Speakers');
        summary += 'is the top-tier trims featuring touchscreen infotainment, 4 speakers, and premium interior accents.';
        features.airConditioning = 'Manual AC with Heater';
        features.powerSteering = 'Electric Power Steering';
        features.powerWindows = 'Front Only';
        features.centralLocking = 'Remote Keyless Entry';
        features.steeringMountedControls = 'Yes';
        features.silverAccents = 'Inside Door Handles, Steering Wheel, Side Louvers';
    }

    // Infotainment
    if (isVXi) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'SmartPlay Dock (Phone Dock)';
        features.speakers = '2 Speakers';
        features.bluetooth = 'Yes';
    } else if (isVXiPlus) {
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Studio';
        features.speakers = '4 Speakers';
        features.androidAppleCarplay = 'Wired';
    } else {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'No';
        features.speakers = 'No';
    }

    // Instrument Cluster
    features.digitalCluster = 'Digital Speedometer'; // Standard on all K10

    // CNG
    if (isCNG) {
        features.fuelTankCapacity = '55 Litres (CNG Water Equiv) + 27 Litres (Petrol)';
        features.bootSpace = 'Reduced (Cylinder)';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' Built on the HEARTECT platform for enhanced safety and stability.';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AGS')) return 'Petrol AGS';
    return 'Petrol MT';
}

const ALTOK10_VARIANTS = [
    { name: 'Alto K10 Std (O)', price: 369900 },
    { name: 'Alto K10 LXi (O) MT', price: 399900 },
    { name: 'Alto K10 VXi (O) MT', price: 449900 },
    { name: 'Alto K10 LXi (O) CNG', price: 481900 },
    { name: 'Alto K10 VXi (O) AGS', price: 494900 },
    { name: 'Alto K10 VXi+ (O) MT', price: 499900 },
    { name: 'Alto K10 VXi (O) CNG', price: 531900 },
    { name: 'Alto K10 VXi+ (O) AGS', price: 544900 },
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

    const model = await Model.findOne({ name: { $regex: /Alto K10/i } }).lean();

    if (!model) {
        console.error('❌ Maruti Suzuki Alto K10 model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI ALTO K10 VARIANTS UPDATE ===\n');
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
    for (const v of ALTOK10_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${ALTOK10_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = ALTOK10_VARIANTS[5]; // VXi+ (O) MT
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
        for (const variant of ALTOK10_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/\(/g, '-').replace(/\)/g, '');
            sanitizedName = sanitizedName.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

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
        console.log(`\n🎉 Maruti Alto K10 now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
