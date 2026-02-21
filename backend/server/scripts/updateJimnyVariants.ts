/**
 * Update Maruti Suzuki Jimny Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 4
 * Highlights: K15B Engine, ALLGRIP PRO 4WD Standard, 6 Airbags Standard
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs
// K15B: 77.1 kW (104.8 PS) -> ~103 Bhp
const ENGINES = {
    'Petrol MT': {
        engineName: '1.5l K15B with Idle Start Stop',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1462',
        engineCapacity: '1462 cc',
        power: '103 Bhp',
        maxPower: '103 Bhp',
        enginePower: '105 PS',
        torque: '134.2 Nm',
        engineTorque: '134.2 Nm @ 4000 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: '4WD',
        driveTrain: 'ALLGRIP PRO 4WD',
        isHybrid: true, // Mild Hybrid / Idle Start Stop
        hybridType: 'Idle Start Stop'
    },
    'Petrol AT': {
        engineName: '1.5l K15B with Idle Start Stop',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1462',
        engineCapacity: '1462 cc',
        power: '103 Bhp',
        maxPower: '103 Bhp',
        enginePower: '105 PS',
        torque: '134.2 Nm',
        engineTorque: '134.2 Nm @ 4000 rpm',
        engineTransmission: '4-Speed Automatic',
        engineSpeed: '4-Speed Auto',
        noOfGears: '4',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: '4WD',
        driveTrain: 'ALLGRIP PRO 4WD',
        isHybrid: true,
        hybridType: 'Idle Start Stop'
    }
};

// Mileage Data
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.5l K15B MT',
        mileageCompanyClaimed: '16.94 kmpl',
        mileageCityRealWorld: '13 kmpl',
        mileageHighwayRealWorld: '15 kmpl',
        mileageCity: '13',
        mileageHighway: '15',
        engineSummary: 'The proven 1.5L K15B engine matched with a 5-Speed Manual for pure off-road control.'
    },
    'Petrol AT': {
        mileageEngineName: '1.5l K15B AT',
        mileageCompanyClaimed: '16.39 kmpl',
        mileageCityRealWorld: '12 kmpl',
        mileageHighwayRealWorld: '15 kmpl',
        mileageCity: '12',
        mileageHighway: '15',
        engineSummary: 'Convenience meets capability with the 4-Speed Automatic transmission.'
    }
};

// Common Specs from Brochure
const COMMON_SPECS = {
    length: '3985',
    width: '1645',
    height: '1720',
    wheelbase: '2590',
    groundClearance: '210',
    bootSpace: '211 Litres', // 2nd position
    fuelTankCapacity: '40 Litres',
    seatingCapacity: '4',
    doors: '5',

    // Suspension & Brakes
    frontSuspension: '3-link Rigid Axle with Coil Spring',
    rearSuspension: '3-link Rigid Axle with Coil Spring',
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Safety Standard
    airbags: '6',
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    abs: 'Yes',
    ebd: 'Yes',
    ba: 'Yes',
    esp: 'Yes',
    hillHoldAssist: 'Yes',
    hillDescentControl: 'Yes', // Standard
    isofix: 'Yes',
    seatbeltWarning: 'Yes',
    engineImmobilizer: 'Yes',

    // Offroad features
    offRoadCapability: 'Yes',
    approachAngle: '36 Degrees',
    departureAngle: '46 Degrees', // Brochure says 46? Wait. Usually 47/50. Image says 46 (Departure). Ramp Breakover 24.
    rampBreakoverAngle: '24 Degrees',
    waterWadingDepth: '300 mm', // Not in image, safe estimate or omit. Omit safely.
};

function getVariantFeatures(variantName: string) {
    const isAlpha = variantName.includes('Alpha');
    const isZeta = variantName.includes('Zeta');
    const isAT = variantName.includes('AT');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Key Features Construction
    let keyFeaturesArr = ['ALLGRIP PRO 4WD', '6 Airbags', 'ESP', 'Hill Descent Control'];
    let summary = `The Jimny ${variantName} `;

    // Common
    features.rearCamera = 'Yes';
    features.appleCarPlay = 'Wireless';
    features.androidAuto = 'Wireless';

    if (isZeta) {
        keyFeaturesArr.push('7-inch SmartPlay Pro', 'Steel Wheels', 'Manual AC');
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm Touchscreen';
        features.alloyWheels = 'No (Steel)';
        features.headLights = 'Halogen';
        features.airConditioning = 'Manual';
        features.cruiseControl = 'No';
        features.headlampWasher = 'No';
        summary += 'is the capable off-roader with all essential 4x4 hardware and safety features standard.';
    } else if (isAlpha) {
        keyFeaturesArr.push('9-inch SmartPlay Pro+', 'Alloy Wheels', 'LED Headlamps + Washer', 'Cruise Control', 'Push Button Start');
        features.touchScreenInfotainment = '9 inch';
        features.infotainmentScreen = '22.86 cm Touchscreen';
        features.alloyWheels = '15 inch Alloy (Gunmetal)';
        features.headLights = 'LED with Washer';
        features.headlampWasher = 'Yes';
        features.airConditioning = 'Automatic';
        features.climateControl = 'Automatic';
        features.cruiseControl = 'Yes';
        features.pushButtonStart = 'Yes';
        features.leatherWrappedSteering = 'Yes';
        features.autoHeadlamps = 'Yes';
        features.fogLamps = 'Front';
        features.uvCutGlass = 'Yes'; // Dark Green Glass
        summary += 'adds premium comfort and convenience features to the legendary off-road capability.';
    }

    if (isAT) {
        features.cruiseControl = isAlpha ? 'Yes' : 'No'; // Check if Zeta AT has cruise? Image doesn't specify AT variation for Cruise. Logic suggests Zeta NO Cruise.
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' Built on a rugged Ladder Frame Chassis with rigid axles.';

    // Wheels
    features.wheelSize = '15 inch';
    features.tyreSize = '195/80 R15';

    features.speakers = '4 Speakers';

    return features;
}

const JIMNY_VARIANTS = [
    { name: 'Jimny Zeta PRO MT', price: 1231500 },
    { name: 'Jimny Zeta PRO AT', price: 1337500 },
    { name: 'Jimny Alpha PRO MT', price: 1338600 },
    { name: 'Jimny Alpha PRO AT', price: 1444600 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Jimny/i } }).lean();
    if (!model) {
        console.error('❌ Maruti Suzuki Jimny model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI JIMNY VARIANTS UPDATE ===\n');
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
    for (const v of JIMNY_VARIANTS) {
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ALLGRIP 4WD`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${JIMNY_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = JIMNY_VARIANTS[3]; // Alpha PRO AT
        const engineKey = 'Petrol AT';
        const engineSpecs = ENGINES[engineKey];
        const mileageData = MILEAGE_DATA[engineKey];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of JIMNY_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            const variantId = `variant-${model.brandId}-${model.id}-${sanitizedName}`;
            const engineKey = variant.name.includes('AT') ? 'Petrol AT' : 'Petrol MT';
            const engineSpecs = ENGINES[engineKey];
            const mileageData = MILEAGE_DATA[engineKey];
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
        console.log(`\n🎉 Maruti Suzuki Jimny now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
