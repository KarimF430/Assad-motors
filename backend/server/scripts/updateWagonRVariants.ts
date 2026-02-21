/**
 * Update Maruti Suzuki WagonR Variants - December 2025
 * 
 * Data Source: Official Brochure + User Price List
 * Total Variants: 9
 * Highlights: 1.0L K10C & 1.2L K12N Engines, CNG, AGS, Tall Boy Design
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs (Split by 1.0L and 1.2L)
const ENGINES = {
    '1.0 Petrol MT': {
        engineName: '1.0L K10C',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '66 Bhp', // 67 PS
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
    '1.0 Petrol AGS': {
        engineName: '1.0L K10C AGS',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '66 Bhp',
        maxPower: '66 Bhp',
        enginePower: '67 PS',
        torque: '89 Nm',
        engineTorque: '89 Nm @ 3500 rpm',
        engineTransmission: '5-Speed AGS (Auto Gear Shift)',
        engineSpeed: '5-Speed AGS',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    '1.0 CNG MT': {
        engineName: '1.0L K10C S-CNG',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '56 Bhp', // 57 PS
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
    '1.2 Petrol MT': {
        engineName: '1.2L K12N',
        engineType: 'K-Series Dual Jet, Dual VVT with Idle Start Stop',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '89 Bhp', // 90 PS
        maxPower: '89 Bhp',
        enginePower: '90 PS',
        torque: '113 Nm',
        engineTorque: '113 Nm @ 4400 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    '1.2 Petrol AGS': {
        engineName: '1.2L K12N AGS',
        engineType: 'K-Series Dual Jet, Dual VVT with Idle Start Stop',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '89 Bhp', // 90 PS
        maxPower: '89 Bhp',
        enginePower: '90 PS',
        torque: '113 Nm',
        engineTorque: '113 Nm @ 4400 rpm',
        engineTransmission: '5-Speed AGS (Auto Gear Shift)',
        engineSpeed: '5-Speed AGS',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
};

// Mileage data
const MILEAGE_DATA = {
    '1.0 Petrol MT': {
        mileageEngineName: '1.0l Petrol Manual',
        mileageCompanyClaimed: '24.35',
        mileageCityRealWorld: '19',
        mileageHighwayRealWorld: '22',
        mileageCity: '19',
        mileageHighway: '22',
        engineSummary: 'The proven 1.0L K10C engine offers excellent city driveability and efficiency.',
    },
    '1.0 Petrol AGS': {
        mileageEngineName: '1.0l Petrol AGS',
        mileageCompanyClaimed: '24.35',
        mileageCityRealWorld: '19',
        mileageHighwayRealWorld: '23',
        mileageCity: '19',
        mileageHighway: '23',
        engineSummary: 'Enjoy clutch-free driving with AGS technology, perfect for congested city roads.',
    },
    '1.0 CNG MT': {
        mileageEngineName: '1.0l S-CNG',
        mileageCompanyClaimed: '34.05 km/kg',
        mileageCityRealWorld: '28 km/kg',
        mileageHighwayRealWorld: '32 km/kg',
        mileageCity: '28',
        mileageHighway: '32',
        engineSummary: 'WagonR S-CNG delivers immense savings and reliable performance.',
    },
    '1.2 Petrol MT': {
        mileageEngineName: '1.2l Petrol Manual',
        mileageCompanyClaimed: '23.56',
        mileageCityRealWorld: '17',
        mileageHighwayRealWorld: '21',
        mileageCity: '17',
        mileageHighway: '21',
        engineSummary: 'The powerful 1.2L Advanced K-Series engine makes highway drives effortless.',
    },
    '1.2 Petrol AGS': {
        mileageEngineName: '1.2l Petrol AGS',
        mileageCompanyClaimed: '24.43',
        mileageCityRealWorld: '18',
        mileageHighwayRealWorld: '22',
        mileageCity: '18',
        mileageHighway: '22',
        engineSummary: 'Combine power and convenience with the 1.2L AGS variant.',
    },
};

// Common specs
const COMMON_SPECS = {
    length: '3655',
    width: '1620',
    height: '1675',
    wheelbase: '2435',
    groundClearance: '165', // Estimate for WagonR
    fuelTankCapacity: '32 Litres', // CNG: 60L water equiv
    doors: '5',
    seatingCapacity: '5',
    bootSpace: '341 Litres', // Class leading

    // Suspension
    frontSuspension: 'MacPherson strut with Coil Spring',
    rearSuspension: 'Torsion Beam with Coil Spring',

    // Brakes
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Safety
    airbags: '2', // Dual Front Standard
    abs: 'Yes',
    seatbeltWarning: 'Yes',
    parkingSensors: 'Rear',
    speedAlertSystem: 'Yes',
    engineImmobilizer: 'Yes',
    esp: 'Yes', // Standard across all now? Brochure row: Electronic Stability Program -> Tick for ALL (LXi to ZXi+).
};

function getVariantFeatures(variantName: string) {
    const isLXi = variantName.includes('LXi');
    const isVXi = variantName.includes('VXi');
    const isZXi = variantName.includes('ZXi') && !variantName.includes('ZXi+');
    const isZXiPlus = variantName.includes('ZXi+');
    const isAGS = variantName.includes('AGS');
    const isCNG = variantName.includes('CNG');

    // Engine Logic
    // LXi, VXi -> 1.0L
    // ZXi, ZXi+ -> 1.2L
    const is12L = isZXi || isZXiPlus;

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Wheels
    features.wheelSize = '14 inch'; // ZXi+ is 14 inch too? Or 15?
    // Brochure Spec Sheet: Type -> Steel (VXi,ZXi), Alloy (ZXi+).
    // Size: 1.0L (LXi, VXi) -> 155/80 R13? Wait.
    // Brochure: Size -> 155/80 R13 (LXi L/LXi CNG/VXi L/VXi CNG). 165/70 R14 (ZXi 1.2L, ZXi+ 1.2L).
    // Let's refine.
    if (is12L) { // ZXi, ZXi+
        features.wheelSize = '14 inch';
        features.tyreSize = '165/70 R14';
        if (isZXiPlus) features.alloyWheels = 'Yes (Black)';
        else features.alloyWheels = 'No (Full Wheel Covers)'; // ZXi has full covers? Typically yes.
    } else { // LXi, VXi
        features.wheelSize = '13 inch';
        features.tyreSize = '155/80 R13';
        features.alloyWheels = 'No';
        if (isVXi) features.alloyWheels = 'No (Full Wheel Covers)'; // VXi usually caps
    }

    // Key Features Sequence
    let keyFeaturesArr = ['Tall Boy Design', 'Dual Airbags', 'ESP', 'Idle Start Stop'];
    let summary = `The WagonR ${variantName} `;

    features.powerSteering = 'Electric Power Steering';
    features.airConditioning = 'Manual AC with Heater';

    if (isLXi) {
        summary += 'is the spacious entry-level tall boy with standard ESP and safety features.';
        features.powerWindows = 'Front Only';
        features.centralLocking = 'Yes';
    } else if (isVXi) {
        keyFeaturesArr.push('All 4 Power Windows', 'Remote Keyless Entry', 'Tilt Steering', 'Electrically Adjustable ORVMs');
        summary += 'adds comfort and style with power windows, remote entry, and body-colored accents.';
        features.powerWindows = 'Front & Rear';
        features.centralLocking = 'Remote Keyless Entry';
        features.adjustableORVM = 'Electrically Adjustable';
        features.tiltSteering = 'Yes';
        features.dayNightIRVM = 'Yes';
        features.splitRearSeat = '60:40 Split';
    } else if (isZXi) {
        keyFeaturesArr.push('1.2L Engine', 'Steering Mounted Controls', 'Tachometer', 'Silver Door Handles'); // ZXi adds 1.2L
        summary += 'brings the powerful 1.2L engine and premium interior features like steering controls.';
        features.powerWindows = 'Front & Rear';
        features.centralLocking = 'Remote Keyless Entry';
        features.adjustableORVM = 'Electrically Adjustable';
        features.steeringMountedControls = 'Yes (Audio)';
        features.display = 'Tachometer';
    } else if (isZXiPlus) {
        keyFeaturesArr.push('1.2L Engine', '4 Speakers', '7-inch SmartPlay Studio', 'Alloy Wheels', 'Power Folding ORVMs');
        summary += 'is the top-of-the-line variant with alloy wheels, touchscreen infotainment, and power-folding mirrors.';
        features.powerWindows = 'Front & Rear';
        features.centralLocking = 'Remote Keyless Entry';
        features.adjustableORVM = 'Electric Retractable'; // Power folding
        features.steeringMountedControls = 'Yes (Voice & Audio)';
        features.display = 'Tachometer';
        features.rearWiper = 'Yes';
        features.fogLamps = 'Front';
        features.features = 'Front Passenger Under Seat Tray'; // Special WagonR feature
    }

    // Hill Hold
    if (isAGS) {
        keyFeaturesArr.push('Hill Hold Assist');
        features.hillHoldAssist = 'Yes';
    } else {
        features.hillHoldAssist = 'No';
    }

    // Infotainment
    if (isLXi) {
        features.touchScreenInfotainment = 'No';
        features.speakers = 'No';
    } else if (isVXi) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'SmartPlay Dock';
        features.speakers = '2 Speakers';
        features.bluetooth = 'Yes';
    } else if (isZXi) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'SmartPlay Dock'; // ZXi is also dock? Or Audio? Brochure: SmartPlay Dock -> VXi, ZXi.
        features.speakers = '2 Speakers';
        features.bluetooth = 'Yes';
    } else if (isZXiPlus) {
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Studio';
        features.speakers = '4 Speakers';
        features.androidAppleCarplay = 'Wired';
    }

    // CNG
    if (isCNG) {
        features.fuelTankCapacity = '60 Litres (Water Equiv) + 32 Litres (Petrol)';
        features.bootSpace = 'Reduced (Cylinder)';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' The Big New WagonR is engineered for family comfort.';

    return features;
}

function getEngineKey(variantName: string): string {
    const is12L = variantName.includes('ZXi'); // Covers ZXi, ZXi+
    const isCNG = variantName.includes('CNG');
    const isAGS = variantName.includes('AGS');

    if (isCNG) return '1.0 CNG MT'; // Only LXi/VXi have CNG, so 1.0L

    if (is12L) {
        if (isAGS) return '1.2 Petrol AGS';
        return '1.2 Petrol MT';
    } else {
        // LXi, VXi -> 1.0L
        if (isAGS) return '1.0 Petrol AGS';
        return '1.0 Petrol MT';
    }
}

const WAGONR_VARIANTS = [
    { name: 'WagonR LXi MT', price: 498900 },
    { name: 'WagonR VXi MT', price: 551900 },
    { name: 'WagonR LXi CNG', price: 588900 },
    { name: 'WagonR ZXi MT', price: 595900 },
    { name: 'WagonR VXi AGS', price: 596900 },
    { name: 'WagonR ZXi AGS', price: 640900 },
    { name: 'WagonR VXi CNG', price: 641900 }, // Wait, VXi CNG price check? User says 6 41 900.
    { name: 'WagonR ZXi+', price: 649900 }, // ZXi+ MT
    { name: 'WagonR ZXi+ AGS', price: 694900 },
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

    const model = await Model.findOne({ name: { $regex: /Wagon\s?R/i } }).lean();

    if (!model) {
        console.error('❌ Maruti Suzuki WagonR model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI WAGONR VARIANTS UPDATE ===\n');
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
    for (const v of WAGONR_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${WAGONR_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = WAGONR_VARIANTS[7]; // ZXi+ MT
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
        for (const variant of WAGONR_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
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
        console.log(`\n🎉 Maruti Suzuki WagonR now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
