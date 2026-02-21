/**
 * Update Maruti Suzuki Ignis Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 7
 * Highlights: 1.2L VVT Petrol Engine (82 Bhp), Urban Compact SUV design.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs
// 1.2L VVT: 61 kW (81.8 Bhp) -> ~83 PS -> ~82 Bhp
const ENGINES = {
    'Petrol MT': {
        engineName: '1.2l VVT Petrol',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '82 Bhp',
        maxPower: '82 Bhp',
        enginePower: '83 PS',
        torque: '113 Nm',
        engineTorque: '113 Nm @ 4200 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    },
    'Petrol AGS': {
        engineName: '1.2l VVT Petrol',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '82 Bhp',
        maxPower: '82 Bhp',
        enginePower: '83 PS',
        torque: '113 Nm',
        engineTorque: '113 Nm @ 4200 rpm',
        engineTransmission: '5-Speed AGS',
        engineSpeed: '5-Speed AMT',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    }
};

const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.2l Petrol MT',
        mileageCompanyClaimed: '20.89 kmpl',
        mileageCityRealWorld: '16 kmpl',
        mileageHighwayRealWorld: '19 kmpl',
        mileageCity: '16',
        mileageHighway: '19',
        engineSummary: 'Peppy 1.2L VVT engine offering a balance of performance and 20.89 kmpl efficiency.'
    },
    'Petrol AGS': {
        mileageEngineName: '1.2l Petrol AGS',
        mileageCompanyClaimed: '20.89 kmpl',
        mileageCityRealWorld: '16 kmpl',
        mileageHighwayRealWorld: '19 kmpl',
        mileageCity: '16',
        mileageHighway: '19',
        engineSummary: 'Convenient AGS transmission maintaining the same great 20.89 kmpl mileage.'
    }
};

const COMMON_SPECS = {
    length: '3700',
    width: '1690',
    height: '1595',
    wheelbase: '2435',
    groundClearance: '180', // High ground clearance for "Urban SUV"
    bootSpace: '260 Litres',
    fuelTankCapacity: '32 Litres',
    seatingCapacity: '5',
    doors: '5',

    // Suspension & Brakes
    frontSuspension: 'MacPherson Strut',
    rearSuspension: 'Torsion Beam',
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Safety
    airbags: '2', // Standard Dual Front Airbags
    airbagsLocation: 'Driver, Passenger',
    abs: 'Yes',
    ebd: 'Yes',
    esp: 'Yes', // Standard across range per brochure
    hillHoldAssist: 'No', // Only on AGS? Brochure: "Hill Hold Assist (AMT only) - Tick for Delta, Zeta, Alpha"
    isofix: 'Yes', // Standard
    seatbeltWarning: 'Yes',
    engineImmobilizer: 'Yes',
    rearUniqueSensors: 'Yes',
    speedAlertSystem: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isSigma = variantName.includes('Sigma');
    const isDelta = variantName.includes('Delta');
    const isZeta = variantName.includes('Zeta');
    const isAlpha = variantName.includes('Alpha');
    const isAGS = variantName.includes('AGS');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Key Features
    let keyFeaturesArr = ['Dual Airbags', 'ABS with EBD', 'High Ground Clearance'];
    let summary = `The Ignis ${variantName} `;

    // Common
    features.headLights = 'Halogen'; // Sigma/Delta
    features.alloyWheels = 'No (Steel)';
    features.climateControl = 'Manual';
    features.airConditioning = 'Manual';
    features.frontPowerWindows = 'Yes';
    features.rearPowerWindows = 'No'; // Sigma No

    if (isSigma) {
        keyFeaturesArr.push('Front Power Windows', 'Tilt Steering', 'AC with Heater');
        features.rearPowerWindows = 'No';
        features.centralLocking = 'No';
        features.speakers = 'No';
        summary += 'is the funky entry-level urban SUV with essential comfort features.';
    } else if (isDelta) {
        keyFeaturesArr.push('Audio System', 'Keyless Entry', 'Electric ORVMs', 'Steering Controls');
        features.touchScreenInfotainment = 'No';
        features.musicSystem = '2 DIN Audio with Bluetooth';
        features.speakers = '2 Speakers';
        features.rearPowerWindows = 'Yes';
        features.centralLocking = 'Yes';
        features.keylessEntry = 'Yes';
        features.steeringMountedControls = 'Yes';
        features.orvm = 'Electrically Adjustable';
        features.wheelCover = 'Yes';
        summary += 'adds convenience with keyless entry, audio system, and rear power windows.';
    } else if (isZeta) {
        keyFeaturesArr.push('Alloy Wheels', 'Push Button Start', '7-inch Touchscreen', 'Fog Lamps');
        features.alloyWheels = '15 inch Alloy (Black)';
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm Touchscreen SmartPlay Studio';
        features.speakers = '4 Speakers + 2 Tweeters';
        features.pushButtonStart = 'Yes';
        features.rearWiper = 'Yes';
        features.rearDefogger = 'Yes';
        features.fogLamps = 'Front';
        features.orvm = 'Electrically Adjustable & Folding';
        features.autoFoldingORVM = 'Yes'; // Electrically Folding
        summary += 'brings style and tech with alloy wheels, touchscreen infotainment, and push-button start.';
    } else if (isAlpha) {
        keyFeaturesArr.push('LED Projector Headlamps', 'Auto AC', 'Reverse Camera', 'Puddle Lamps');
        features.headLights = 'LED Projector with DRL';
        features.climateControl = 'Automatic';
        features.airConditioning = 'Automatic';
        features.reverseCamera = 'Yes';
        features.driverSeatAdjustment = 'Height Adjustable';
        features.puddleLamps = 'Yes';
        features.meterAccentLighting = 'Yes';
        summary += 'is the top-spec urban warrior with premium LED lighting, automatic climate control, and height-adjustable seat.';
    }

    if (isAGS) {
        features.hillHoldAssist = 'Yes';
        features.features = features.features ? features.features + ', Hill Hold Assist' : 'Hill Hold Assist';
    } else {
        features.hillHoldAssist = 'No';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' Compact, tough, and fun to drive.';

    // Wheels
    features.wheelSize = '15 inch';
    features.tyreSize = '175/65 R15';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('AGS')) return 'Petrol AGS';
    return 'Petrol MT';
}

const IGNIS_VARIANTS = [
    { name: 'Ignis Sigma MT', price: 535100 },
    { name: 'Ignis Delta MT', price: 584500 },
    { name: 'Ignis Delta AGS', price: 629500 },
    { name: 'Ignis Zeta MT', price: 650200 },
    { name: 'Ignis Zeta AGS', price: 695200 },
    { name: 'Ignis Alpha MT', price: 709700 },
    { name: 'Ignis Alpha AGS', price: 754700 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Ignis/i } }).lean();
    if (!model) {
        console.error('❌ Maruti Suzuki Ignis model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI IGNIS VARIANTS UPDATE ===\n');
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
    for (const v of IGNIS_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${IGNIS_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = IGNIS_VARIANTS[6]; // Alpha AGS
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
        for (const variant of IGNIS_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
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
        console.log(`\n🎉 Maruti Suzuki Ignis now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
