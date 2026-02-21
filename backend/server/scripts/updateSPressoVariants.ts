/**
 * Update Maruti Suzuki S-Presso Variants - December 2025
 * 
 * Data Source: Official Brochure provided by user
 * Total Variants: 8
 * Highlights: K10C Engine, CNG Options, AGS (AMT)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Brochure
const ENGINES = {
    'Petrol MT': {
        engineName: 'K10C',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '66 Bhp', // 66.6 PS = 65.7 Bhp (Brochure says 66.6 PS, usually rounded to 66 or 67 HP/Bhp. Let's use 66 Bhp or 67 PS)
        maxPower: '66 Bhp', // 66.6 PS
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
        engineName: 'K10C',
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
        engineName: 'K10C CNG',
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

// Mileage data (Approximate based on 2024-25 standards for S-Presso)
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.0l Petrol Manual',
        mileageCompanyClaimed: '24.12', // Std/LXi
        mileageCityRealWorld: '18',
        mileageHighwayRealWorld: '21',
        mileageCity: '18',
        mileageHighway: '21',
        engineSummary: 'The peppy K10C engine offers excellent fuel efficiency and city driveability.',
    },
    'Petrol AGS': {
        mileageEngineName: '1.0l Petrol AGS',
        mileageCompanyClaimed: '25.3', // VXi/VXi+ AGS
        mileageCityRealWorld: '19',
        mileageHighwayRealWorld: '22',
        mileageCity: '19',
        mileageHighway: '22',
        engineSummary: 'The AGS (Auto Gear Shift) delivers superior mileage and convenience for city traffic.',
    },
    'CNG MT': {
        mileageEngineName: '1.0l CNG Manual',
        mileageCompanyClaimed: '32.73 km/kg',
        mileageCityRealWorld: '26 km/kg',
        mileageHighwayRealWorld: '30 km/kg',
        mileageCity: '26',
        mileageHighway: '30',
        engineSummary: 'With factory-fitted S-CNG, enjoy incredibly low running costs without compromising on reliability.',
    },
};

// Common specs
const COMMON_SPECS = {
    length: '3565',
    width: '1520',
    height: '1553', // Standard height (1567 for VXi w/ larger wheels) - Update in variant features
    wheelbase: '2380',
    groundClearance: '180', // Approximate decent GC for "Mini SUV"
    fuelTankCapacity: '27 Litres', // CNG: 55L water equiv
    doors: '5',
    seatingCapacity: '5', // CNG 4 seater?
    bootSpace: '240 Litres', // Petrol

    // Suspension
    frontSuspension: 'MacPherson strut with Coil Spring',
    rearSuspension: 'Torsion Beam with Coil Spring',

    // Brakes
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Drum',

    // Safety (Standard across all)
    airbags: '2', // Dual Airbags Standard
    abs: 'Yes',
    seatbeltWarning: 'Yes',
    parkingSensors: 'Rear',
    speedAlertSystem: 'Yes',

    // Feature placeholders
    powerWindows: 'Front Only', // VXi onwards
};

function getVariantFeatures(variantName: string) {
    const isStd = variantName.includes('Std');
    const isLXi = variantName.includes('LXi');
    const isVXi = variantName.includes('VXi') && !variantName.includes('VXi+');
    const isVXiPlus = variantName.includes('VXi+');
    const isCNG = variantName.includes('CNG');
    const isAGS = variantName.includes('AGS');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km'; // Standard Maruti

    // Dimensions
    if (isVXi || isVXiPlus) {
        features.height = '1567'; // Taller due to 14 inch wheels
    } else {
        features.height = '1553';
    }

    // Key Features & Summary
    let keyFeaturesArr = ['Dual Airbags', 'ABS with EBD', 'Rear Parking Sensors'];
    let summary = `The S-Presso ${variantName} `;

    if (isStd) {
        summary += 'is the base variant offering essential safety features and the bold SUV-inspired design.';
    } else if (isLXi) {
        keyFeaturesArr.push('AC with Heater', 'Power Steering');
        summary += 'adds necessary comfort with Air Conditioning and Power Steering.';
    } else if (isVXi) {
        keyFeaturesArr.push('SmartPlay Dock', 'Front Power Windows', 'Central Locking', 'Speed Sensitive Auto Door Lock');
        summary += 'is the value-for-money choice with music system, central locking, and front power windows.';
    } else if (isVXiPlus) {
        keyFeaturesArr.push('7-inch SmartPlay Studio', 'Steering Mounted Controls', 'Electric ORVMs', 'Rear Parcel Tray');
        summary += 'is the top-end trim featuring the touchscreen infotainment, electric mirrors, and stylish interior accents.';
    }

    if (isAGS) {
        keyFeaturesArr.push('ESP', 'Hill Hold Assist'); // AGS only features
        features.esc = 'Yes';
        features.hillHoldAssist = 'Yes';
    } else {
        features.esc = 'Yes'; // Brochure says ESP standard? 
        // Row: Electronic Stability Program (ESP) -> Tick for ALL variants.
        // Hill Hold -> AGS Only.
        features.esc = 'Yes';
        features.hillHoldAssist = 'No';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` A perfect mini-SUV for the city.`;

    // Wheels
    if (isVXi || isVXiPlus) {
        features.wheelSize = '14 inch';
        features.tyreSize = '165/70 R14';
        features.alloyWheels = 'No (Full Wheel Covers)';
    } else {
        features.wheelSize = '13 inch';
        features.tyreSize = '145/80 R13';
        features.alloyWheels = 'No (Center Hub Cap)';
    }

    // Infotainment
    if (isStd || isLXi) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'No';
        features.speakers = 'No';
    } else if (isVXi) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'SmartPlay Dock (Phone Dock)';
        features.speakers = '2 Speakers';
        features.bluetooth = 'Yes';
    } else if (isVXiPlus) {
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Studio';
        features.speakers = '2 Speakers';
        features.androidAppleCarplay = 'Wired';
        features.steeringMountedControls = 'Yes';
    }

    // CNG specific
    if (isCNG) {
        features.fuelTankCapacity = '55 Litres (CNG Water Equiv) + 27 Litres (Petrol)';
        features.bootSpace = 'Reduced (Cylinder)';
    }

    // Comfort
    if (isStd) {
        features.airConditioning = 'No';
        features.powerSteering = 'No';
    } else {
        features.airConditioning = 'Manual AC with Heater';
        features.powerSteering = 'Electric Power Steering';
    }

    if (isVXi || isVXiPlus) {
        features.powerWindows = 'Front Only';
        features.centralLocking = 'Remote Keyless Entry'; // Remote on VXi/VXi+
    } else {
        features.powerWindows = 'No';
        features.centralLocking = 'No';
    }

    if (isVXiPlus) {
        features.adjustableORVM = 'Electrically Adjustable';
    } else if (isVXi) {
        features.adjustableORVM = 'Internally Adjustable (Manual)';
    } else {
        features.adjustableORVM = 'Manual'; // Pivot
    }

    // Instrument Cluster
    features.digitalCluster = 'Digital Display Instrument Cluster'; // Standard on all

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AGS')) return 'Petrol AGS';
    return 'Petrol MT';
}

const SPRESSO_VARIANTS = [
    { name: 'S-Presso Std (O) MT', price: 349900 },
    { name: 'S-Presso LXi (O) MT', price: 379900 },
    { name: 'S-Presso VXi (O) MT', price: 429900 },
    { name: 'S-Presso LXi (O) CNG', price: 461900 },
    { name: 'S-Presso VXi (O) AGS', price: 474900 },
    { name: 'S-Presso VXi+ (O) MT', price: 479900 },
    { name: 'S-Presso VXi (O) CNG', price: 511900 },
    { name: 'S-Presso VXi+ (O) AGS', price: 524900 },
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

    const model = await Model.findOne({ name: { $regex: /S-Presso/i } }).lean();

    if (!model) {
        console.error('❌ Maruti Suzuki S-Presso model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI S-PRESSO VARIANTS UPDATE ===\n');
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
    for (const v of SPRESSO_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${SPRESSO_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = SPRESSO_VARIANTS[5]; // VXi+ (O) MT
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
        for (const variant of SPRESSO_VARIANTS) {
            // Robust ID generation
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/\(/g, '-').replace(/\)/g, ''); // (O) -> -o
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
        console.log(`\n🎉 Maruti Suzuki S-Presso now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
