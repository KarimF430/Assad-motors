/**
 * Update Maruti Suzuki Swift Variants - December 2025
 * 
 * Data Source: Fourth Generation Epic New Swift Brochure
 * Total Variants: 11
 * Highlights: New Z-Series Engine (Z12E), 6 Airbags Standard, Hill Hold Standard, 14" to 15" Wheels
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs (New Z12E Engine - 3 Cylinder)
const ENGINES = {
    'Petrol MT': {
        engineName: '1.2L Z-Series',
        engineType: 'Z12E',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '80 Bhp', // 81.58 PS
        maxPower: '80 Bhp',
        enginePower: '82 PS',
        torque: '112 Nm',
        engineTorque: '111.7 Nm @ 4300 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        cylinders: '3'
    },
    'Petrol AGS': {
        engineName: '1.2L Z-Series AGS',
        engineType: 'Z12E',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '80 Bhp',
        maxPower: '80 Bhp',
        enginePower: '82 PS',
        torque: '112 Nm',
        engineTorque: '111.7 Nm @ 4300 rpm',
        engineTransmission: '5-Speed AGS (Automated Manual)',
        engineSpeed: '5-Speed AGS',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        cylinders: '3'
    },
    'CNG MT': {
        engineName: '1.2L Z-Series S-CNG',
        engineType: 'Z12E',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '69 Bhp', // 69.75 PS
        maxPower: '69 Bhp',
        enginePower: '70 PS',
        torque: '102 Nm',
        engineTorque: '101.8 Nm @ 2900 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'CNG',
        fuel: 'CNG',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        cylinders: '3'
    },
};

// Mileage data (Epic New Swift Efficiency)
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.2l Petrol Manual',
        mileageCompanyClaimed: '24.80',
        mileageCityRealWorld: '19',
        mileageHighwayRealWorld: '22',
        mileageCity: '19',
        mileageHighway: '22',
        engineSummary: 'The all-new Z-Series engine combines spirited performance with segment-leading fuel efficiency.',
    },
    'Petrol AGS': {
        mileageEngineName: '1.2l Petrol AGS',
        mileageCompanyClaimed: '25.75',
        mileageCityRealWorld: '20',
        mileageHighwayRealWorld: '24',
        mileageCity: '20',
        mileageHighway: '24',
        engineSummary: 'Zip through the city with the convenience of AGS and exceptional mileage of 25.75 kmpl.',
    },
    'CNG MT': {
        mileageEngineName: '1.2l S-CNG',
        mileageCompanyClaimed: '32.85 km/kg',
        mileageCityRealWorld: '26 km/kg',
        mileageHighwayRealWorld: '30 km/kg',
        mileageCity: '26',
        mileageHighway: '30',
        engineSummary: 'Experience the green mobility of Swift S-CNG with practically no compromise on performance.',
    },
};

// Common specs
const COMMON_SPECS = {
    length: '3860',
    width: '1735',
    height: '1520',
    wheelbase: '2450',
    groundClearance: '163', // Unladen
    fuelTankCapacity: '37 Litres', // CNG: 55L Water Filling Cap
    doors: '5',
    seatingCapacity: '5',
    bootSpace: '265 Litres',

    // Suspension
    frontSuspension: 'MacPherson Strut',
    rearSuspension: 'Torsion Beam',

    // Brakes
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Drum',

    // Safety (Standard across all)
    airbags: '6', // Dual Front + Side + Curtain Standard!
    abs: 'Yes',
    ebd: 'Yes',
    esp: 'Yes', // Electronic Stability Program Standard
    hillHoldAssist: 'Yes', // Standard
    isofix: 'Yes', // Standard
    seatbeltWarning: 'Yes', // All Seats (Reminder)
    parkingSensors: 'Rear',
    speedAlertSystem: 'Yes',
    engineImmobilizer: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isLXi = variantName.includes('LXI');
    const isVXi = variantName.includes('VXI') && !variantName.includes('VXI (O)');
    const isVXiO = variantName.includes('VXI (O)');
    const isZXi = variantName.includes('ZXI') && !variantName.includes('ZXI Plus');
    const isZXiPlus = variantName.includes('ZXI Plus') || variantName.includes('ZXi+');
    const isAGS = variantName.includes('AGS');
    const isCNG = variantName.includes('CNG');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Wheels
    if (isZXi || isZXiPlus) {
        features.wheelSize = '15 inch';
        features.tyreSize = '185/65 R15';
        features.alloyWheels = isZXiPlus ? 'Yes (Precision Cut Two-Tone)' : 'Yes (Painted)';
    } else { // LXi, VXi, VXi(O)
        features.wheelSize = '14 inch';
        features.tyreSize = '165/80 R14';
        features.alloyWheels = 'No (Steel)';
        if (isVXi || isVXiO) features.alloyWheels = 'No (Full Wheel Covers)';
    }

    // Key Features Sequence
    let keyFeaturesArr = ['6 Airbags', 'ESP', 'Hill Hold Assist', 'Power Windows']; // Standard
    let summary = `The Swift ${variantName} `;

    features.powerSteering = 'Electric Power Steering';
    features.powerWindows = 'Front & Rear'; // Standard Feature see Brochure
    features.centralLocking = 'Remote Keyless Entry'; // LXi has manual? Brochure says "Keyless Entry System" -> LXi (Tick).
    // Brochure Row "Keyless Entry System": LXi (Tick).

    features.airConditioning = 'Manual AC';

    if (isLXi) {
        summary += 'redefines the entry segment with standard 6 airbags, ESP, and all power windows.';
        features.projectorHeadlamps = 'Yes (Halogen)';
        features.rearTaillamps = 'LED';
    } else if (isVXi) {
        keyFeaturesArr.push('7-inch SmartPlay Pro', 'Wireless Android Auto/CarPlay', 'Steering Controls', 'Turn Indicators on ORVMs');
        summary += 'adds modern connectivity with a 7-inch touchscreen, wireless smartphone integration, and steering controls.';
        features.infotainmentScreen = '17.78 cm Touch Screen (SmartPlay Pro)';
        features.touchScreenInfotainment = '7 inch';
        features.speakers = '4';
        features.androidAppleCarplay = 'Wireless';
        features.steeringMountedControls = 'Yes';
        features.adjustableORVM = 'Electrically Adjustable';
        features.bodyColouredORVMs = 'Yes';
        features.bodyColouredDoorHandles = 'Yes';
        features.fullWheelCovers = 'Yes';
    } else if (isVXiO) {
        keyFeaturesArr.push('Suzuki Connect', 'Push Button Start', 'Electric Folding ORVMs');
        // VXi(O) adds Connected Car features mainly?
        // Brochure: "Suzuki Connect" -> VXi(O) Tick.
        // "Engine Push Start-Stop Button with Smart Key" -> VXi(O) Tick.
        // "Electrically Foldable ORVMs" -> VXi(O) Tick.
        summary += 'brings tech-savvy features including Suzuki Connect, Push Button Start, and auto-folding mirrors.';
        features.infotainmentScreen = '17.78 cm Touch Screen (SmartPlay Pro)';
        features.touchScreenInfotainment = '7 inch';
        features.speakers = '4';
        features.androidAppleCarplay = 'Wireless';
        features.centralLocking = 'Smart Key (keyless push start)';
        features.pushButtonStart = 'Yes';
        features.suzukiConnect = 'Yes (Telematics)';
        features.adjustableORVM = 'Electric Retractable';
    } else if (isZXi) {
        keyFeaturesArr.push('LED Projector Headlamps', 'LED DRLs', 'Wireless Charger', 'Rear AC Vents', 'Auto Headlamps');
        summary += 'elevates the style with LED projector headlamps, DRLs, and adds comfort with Rear AC vents.';
        features.projectorHeadlamps = 'Yes (LED)';
        features.drls = 'Yes (LED)';
        features.wirelessCharger = 'Yes'; // Wireless Charger -> ZXi Tick
        features.rearACVents = 'Yes';
        features.automaticHeadlamps = 'Yes (Follow Me Home)';
        features.airConditioning = 'Automatic Climate Control'; // Digital Air Conditioner standard? No.
        // Row "Digital Air Conditioner with Panel Illumination": LXi(Manual), VXi(Manual), VXi(O)(Manual), ZXi(Auto), ZXi+(Auto).
        features.airConditioning = 'Auto Climate Control';
        features.rearWiper = 'Yes';
        features.washWipe = 'Yes';
        features.tweeters = '2';
    } else if (isZXiPlus) {
        keyFeaturesArr.push('9-inch SmartPlay Pro+', 'Cruise Control', 'Precision Cut Alloys', 'LED Fog Lamps', 'Footwell Illumination');
        summary += 'is the ultimate expression of Swift with a large 9-inch screen, cruise control, and precision-cut alloys.';
        features.infotainmentScreen = '22.86 cm Touch Screen (SmartPlay Pro+)';
        features.touchScreenInfotainment = '9 inch';
        features.speakers = '4 + 2 Tweeters';
        features.cruiseControl = 'Yes';
        features.fogLamps = 'Front (LED)';
        features.leatherSteeringWheel = 'Yes';
        features.footwellLighting = 'Yes';
        features.rearCamera = 'Yes (Wide Angle)';
    }

    // CNG
    if (isCNG) {
        features.fuelTankCapacity = '55 Litres (Water Equiv) + 37 Litres (Petrol)';
        features.bootSpace = 'Reduced (Cylinder)';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' Powered by the Z-Series engine for a thrilling yet efficient drive.';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AGS')) return 'Petrol AGS';
    return 'Petrol MT';
}

const SWIFT_VARIANTS = [
    { name: 'Swift LXI Petrol MT', price: 578900 },
    { name: 'Swift VXI Petrol MT', price: 658900 },
    { name: 'Swift VXI (O) Petrol MT', price: 684900 },
    { name: 'Swift VXI Petrol AGS', price: 703900 },
    { name: 'Swift VXI (O) Petrol AGS', price: 729900 },
    { name: 'Swift VXI CNG MT', price: 744900 },
    { name: 'Swift ZXI Petrol MT', price: 752900 },
    { name: 'Swift ZXI Petrol AGS', price: 797900 },
    { name: 'Swift ZXI Plus Petrol MT', price: 819900 }, // ZXI Plus -> ZXi+ in brochure, match user request name
    { name: 'Swift ZXI CNG MT', price: 838900 },
    { name: 'Swift ZXI Plus Petrol AGS', price: 864900 },
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

    const model = await Model.findOne({ name: { $regex: /Swift/i } }).lean();

    if (!model) {
        console.error('❌ Maruti Suzuki Swift model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI SWIFT VARIANTS UPDATE ===\n');
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
    for (const v of SWIFT_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${SWIFT_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = SWIFT_VARIANTS[8]; // ZXI Plus Petrol MT
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
        for (const variant of SWIFT_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/\(o\)/g, 'o'); // Handle (O) -> o
            sanitizedName = sanitizedName.replace(/\s+/g, '-');
            sanitizedName = sanitizedName.replace(/[^a-z0-9-]+/g, '');
            sanitizedName = sanitizedName.replace(/^-+|-+$/g, '');

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
        console.log(`\n🎉 Maruti Suzuki Swift now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
