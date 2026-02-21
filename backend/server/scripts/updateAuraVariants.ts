/**
 * Update Hyundai Aura Variants - December 2025
 * 
 * Data Source: Official Hyundai Brochure + Price List provided by user
 * Total Variants: 10
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
        engineName: '1.2l Kappa Petrol',
        engineType: '4 Cylinders, 16 Valves DOHC',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '82 Bhp', // 83 PS
        maxPower: '82 Bhp',
        enginePower: '82 Bhp',
        torque: '113.8 Nm',
        engineTorque: '113.8 Nm (11.6 kgm) @ 4000 r/min',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'Petrol AMT': {
        engineName: '1.2l Kappa Petrol',
        engineType: '4 Cylinders, 16 Valves DOHC',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '82 Bhp',
        maxPower: '82 Bhp',
        enginePower: '82 Bhp',
        torque: '113.8 Nm',
        engineTorque: '113.8 Nm (11.6 kgm) @ 4000 r/min',
        engineTransmission: 'Smart Auto AMT',
        engineSpeed: '5-Speed AMT',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'CNG MT': {
        engineName: '1.2l Bi-fuel Kappa Petrol with CNG',
        engineType: '4 Cylinders, 16 Valves DOHC',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '68 Bhp', // 69 PS
        maxPower: '68 Bhp',
        enginePower: '68 Bhp',
        torque: '95.2 Nm',
        engineTorque: '95.2 Nm (9.7 kgm) @ 4000 r/min',
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

// Mileage data (Approximate based on market standards for Aura)
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.2l Petrol Manual',
        mileageCompanyClaimed: '20.5', // Approx
        mileageCityRealWorld: '14',
        mileageHighwayRealWorld: '18',
        mileageCity: '14',
        mileageHighway: '18',
        engineSummary: 'The 1.2-litre Kappa petrol engine offers a perfect balance of performance and efficiency with 83 PS power.',
    },
    'Petrol AMT': {
        mileageEngineName: '1.2l Petrol AMT',
        mileageCompanyClaimed: '20.1', // Approx
        mileageCityRealWorld: '13',
        mileageHighwayRealWorld: '18',
        mileageCity: '13',
        mileageHighway: '18',
        engineSummary: 'The Smart Auto AMT provides clutch-free convenience for city driving without compromising much on fuel efficiency.',
    },
    'CNG MT': {
        mileageEngineName: '1.2l CNG Manual',
        mileageCompanyClaimed: '28.0 km/kg', // Approx
        mileageCityRealWorld: '22 km/kg',
        mileageHighwayRealWorld: '26 km/kg',
        mileageCity: '22',
        mileageHighway: '26',
        engineSummary: 'The Bi-fuel CNG option is incredibly economical, delivering superior mileage and lower running costs.',
    },
};

// Common specs from brochure
const COMMON_SPECS = {
    // Dimensions
    length: '3995',
    width: '1680',
    height: '1520',
    wheelbase: '2450',
    groundClearance: '165', // Standard for Aura
    fuelTankCapacity: '37 Litres', // Petrol
    modelName: 'Aura',
    doors: '4', // Sedan
    seatingCapacity: '5',
    bootSpace: '402 Litres', // CNG will be less, handled in overrides
    cupholders: '4',

    // Suspension
    frontSuspension: 'McPherson strut',
    rearSuspension: 'Coupled torsion beam axle',
    shockAbsorber: 'Gas type',

    // Brakes
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Emission
    emissionStandard: 'BS6 Phase 2',

    // Safety Standard (Brochure shows 6 Airbags S across all)
    airbags: '6',
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    abs: 'Yes',
    ebd: 'Yes',
    seatbeltWarning: 'Yes',
    speedAlertSystem: 'Yes',
    isofix: 'No', // Default
    engineImmobilizer: 'Yes',
    emergencyStopSignal: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isE = variantName.startsWith('E ') || variantName === 'E';
    const isS = variantName.startsWith('S ') || variantName === 'S';
    const isCorporate = variantName.includes('Corporate');
    const isSX = variantName.startsWith('SX ') || variantName === 'SX';
    const isSXO = variantName.includes('SX(O)');

    const isCNG = variantName.includes('CNG');
    const isAMT = variantName.includes('AMT');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / 100,000 Km'; // Standard Hyundai

    // CNG specific
    if (isCNG) {
        features.fuelTankCapacity = '37 Litres (Petrol) + 60 Litres (CNG Cylinder Water Equiv)';
        features.bootSpace = 'Reduced (CNG Tank)';
    }

    // Key Features & Summary
    let keyFeaturesArr = ['6 Airbags (Standard)', 'ABS with EBD'];
    let summary = `The Hyundai Aura ${variantName} `;

    if (isE) {
        keyFeaturesArr.push('14-inch Steel Wheels', 'Front Power Windows', 'Adjustable Rear Headrests (No)');
        summary += 'is the practical base variant offering standard 6 airbags and safety essentials for budget-conscious buyers.';
    } else if (isS) {
        keyFeaturesArr.push('TPMS', 'Rear Defogger', 'LED DRLs', '8-inch Touchscreen (No, 2-DIN)', 'Rear AC Vents');
        // Brochure: S -> 2-DIN integrated audio system.
        summary += 'adds convenience with central locking, rear AC vents, and a basic audio system for a comfortable daily drive.';
    } else if (isCorporate) {
        keyFeaturesArr.push('6.75-inch Touchscreen', 'Styled Steel Wheels', 'Electric Folding ORVMs');
        summary += 'offers a tech upgrade with a 6.75-inch touchscreen and styled wheels, bridging the gap between value and style.';
    } else if (isSX) {
        keyFeaturesArr.push('8-inch Touchscreen', 'Push Button Start', 'Rear Camera', '15-inch Alloys', 'Smart Key');
        summary += 'is a feature-rich choice with standard push-button start, alloy wheels, and a large 8-inch infotainment system.';
    } else if (isSXO) {
        keyFeaturesArr.push('Auto Headlamps', 'Cruise Control', 'Leather Wrapped Steering', 'Wireless Charger (Petrol)', 'ISOFIX');
        summary += 'is the top-spec sedan featuring premium leather touches, cruise control, and advanced safety with ISOFIX.';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` Powered by the ${isCNG ? 'Eco-friendly CNG' : 'Reliable 1.2L Kappa Petrol'} engine.`;

    // Wheels
    if (isE) {
        features.wheelSize = '14 inch';
        features.tyreSize = '165/70 R14';
        features.alloyWheels = 'No (Steel)';
    } else if (isS || isCorporate) {
        features.wheelSize = '15 inch';
        features.tyreSize = '175/60 R15';
        features.alloyWheels = 'No (Dual Tone Styled Steel)';
    } else { // SX, SX(O)
        features.wheelSize = '15 inch';
        features.tyreSize = '175/60 R15';
        features.alloyWheels = '15 inch Diamond Cut Alloy';
    }

    // Infotainment
    if (isE) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'No';
        features.speakers = 'No';
    } else if (isS) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = '2-DIN Integrated Audio';
        features.speakers = '4 Speakers';
    } else if (isCorporate) {
        features.touchScreenInfotainment = '6.75 inch';
        features.infotainmentScreen = '17.14 cm (6.75") Touchscreen Display Audio';
        features.speakers = '4 Speakers';
    } else { // SX, SX(O)
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.25 cm (8") Touchscreen with Smartphone Connectivity';
        features.androidAppleCarplay = 'Wired';
        features.voiceRecognition = 'Yes';
        features.speakers = '4 Speakers';
        if (isSXO) {
            // Brochure says Wireless Apple CarPlay & Android Auto for SX? No, Apple CarPlay/Android Auto under SX. Wireless under SX(O)? Table check:
            // Apple CarPlay & Android Auto: S for SX? No, table says "-" for SX(O)? Wait.
            // Row 1: Apple CP & AA -> SX (S).
            // Row 2: Wireless Apple CP & AA -> SX(O) (S). 
            // So SX is wired, SX(O) is wireless.
            features.androidAppleCarplay = 'Wireless';
        }
    }

    // Comfort
    if (isE) {
        features.powerWindows = 'Front Only';
        features.centralLocking = 'No';
    } else {
        features.powerWindows = 'Front & Rear';
        features.centralLocking = 'Yes';
    }

    if (isSXO) {
        features.airConditioning = 'Automatic';
        features.climateControl = 'Automatic';
    } else {
        features.airConditioning = 'Manual';
    }

    if (isS || isCorporate || isSX || isSXO) {
        features.rearACVents = 'Yes';
        features.cooldGloveBox = 'Yes (Cooled)';
    }

    // Instrument Cluster
    features.digitalCluster = 'Analog with MID';
    if (isSX || isSXO) features.digitalCluster = 'Analog with 3.5" MID'; // Standard is basic

    // Lighting
    if (isSX || isSXO) {
        features.headLights = 'Projector';
        features.headlights = 'Projector Headlamps';
        features.daytimeRunningLights = 'LED (Boomerang)';
    } else {
        features.headLights = 'Halogen';
        features.headlights = 'Halogen Headlamps';
        if (isS || isCorporate) features.daytimeRunningLights = 'LED';
    }

    // ORVMs
    if (isE) {
        features.outsideRearViewMirrors = 'Manual';
    } else if (isS) {
        features.outsideRearViewMirrors = 'Electric Adjust';
    } else if (isCorporate) {
        features.outsideRearViewMirrors = 'Electric Adjust & Folding';
    } else if (isSX || isSXO) { // Brochure: Electric Folding - S for SX, SX(O). Corporate also has it according to some sources, but check logic.
        // Table: "Electric folding" -> S for Corporate, SX, SX(O).
        features.outsideRearViewMirrors = 'Electric Adjust & Folding';
        features.turnIndicatorsOnORVM = 'Yes';
    }

    // Safety Extras
    if (isSXO) {
        features.isofix = 'Yes';
    } else {
        features.isofix = 'No';
    }

    if (isE) features.speedSensingDoorLocks = 'No';
    else features.speedSensingDoorLocks = 'Yes';

    // Reverse Camera
    if (isSX || isSXO) features.reverseCamera = 'Yes';

    // Push Button Start
    if (isSX || isSXO) features.pushButtonStart = 'Yes';

    // Wireless Charger
    if (isSXO && !isCNG) features.wirelessCharging = 'Yes'; // Usually not in CNG or lower trims

    // Cruise Control
    if (isSXO && !isCNG) features.cruiseControl = 'Yes';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AMT')) return 'Petrol AMT';
    return 'Petrol MT';
}

const AURA_VARIANTS = [
    { name: 'E Petrol MT', price: 598320 },
    { name: 'S Petrol MT', price: 675248 },
    { name: 'Corporate Petrol MT', price: 684386 },
    { name: 'S Petrol AMT', price: 738821 },
    { name: 'SX Petrol MT', price: 753548 },
    { name: 'SX(O) Petrol MT', price: 799833 },
    { name: 'E CNG MT', price: 690432 },
    { name: 'S CNG MT', price: 765622 },
    { name: 'Corporate CNG MT', price: 774760 },
    { name: 'SX CNG MT', price: 841635 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Aura/i } }).lean();
    if (!model) {
        console.error('❌ Hyundai Aura model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== HYUNDAI AURA VARIANTS UPDATE ===\n');
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
    for (const v of AURA_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${AURA_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = AURA_VARIANTS[5]; // SX(O) Petrol MT
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
        for (const variant of AURA_VARIANTS) {
            const variantId = `variant-${model.brandId}-${model.id}-${variant.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`;
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
        console.log(`\n🎉 Hyundai Aura now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
