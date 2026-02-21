/**
 * Update Maruti Suzuki Baleno Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 9
 * Highlights: 1.2L K-Series, S-CNG, Standard 6 Airbags, HUD, 360 Camera
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs (From Image 4)
// Petrol: 66 kW (89.7 PS) -> ~89 Bhp
// CNG: 57 kW (77.5 PS) -> ~76 Bhp
const ENGINES = {
    'Petrol MT': {
        engineName: '1.2l K-Series Dual Jet, Dual VVT',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '89 Bhp',
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
        isHybrid: true, // Idle Start Stop mentioned in Image 4
        hybridType: 'Idle Start Stop'
    },
    'Petrol AGS': { // AMT
        engineName: '1.2l K-Series Dual Jet, Dual VVT',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '89 Bhp',
        maxPower: '89 Bhp',
        enginePower: '90 PS',
        torque: '113 Nm',
        engineTorque: '113 Nm @ 4400 rpm',
        engineTransmission: '5-Speed AGS',
        engineSpeed: '5-Speed AMT',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Idle Start Stop'
    },
    'CNG MT': {
        engineName: '1.2l K-Series CNG',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '76 Bhp',
        maxPower: '76 Bhp',
        enginePower: '77.5 PS',
        torque: '98.5 Nm',
        engineTorque: '98.5 Nm @ 4300 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'CNG',
        fuel: 'CNG',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    }
};

const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.2l Petrol MT',
        mileageCompanyClaimed: '22.35 kmpl',
        mileageCityRealWorld: '17 kmpl',
        mileageHighwayRealWorld: '20 kmpl',
        mileageCity: '17',
        mileageHighway: '20',
        engineSummary: 'Ultra-efficient 1.2L Dual Jet engine delivering 22.35 kmpl.'
    },
    'Petrol AGS': {
        mileageEngineName: '1.2l Petrol AGS',
        mileageCompanyClaimed: '22.94 kmpl',
        mileageCityRealWorld: '17 kmpl',
        mileageHighwayRealWorld: '21 kmpl',
        mileageCity: '17',
        mileageHighway: '21',
        engineSummary: 'Convenient AGS transmission with segment-leading 22.94 kmpl efficiency.'
    },
    'CNG MT': {
        mileageEngineName: '1.2l CNG',
        mileageCompanyClaimed: '30.61 km/kg',
        mileageCityRealWorld: '26 km/kg',
        mileageHighwayRealWorld: '29 km/kg',
        mileageCity: '26',
        mileageHighway: '29',
        engineSummary: 'S-CNG technology ensuring incredible 30.61 km/kg efficiency.'
    }
};

const COMMON_SPECS = {
    length: '3990',
    width: '1745',
    height: '1500',
    wheelbase: '2520',
    groundClearance: '170', // Est, typical for hatchback
    bootSpace: '318 Litres',
    fuelTankCapacity: '37 Litres',
    seatingCapacity: '5',
    doors: '5',

    // Suspension & Brakes
    frontSuspension: 'MacPherson Strut',
    rearSuspension: 'Torsion Beam',
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Safety
    airbags: '6', // Standard as per Image 2
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    abs: 'Yes',
    ebd: 'Yes',
    ba: 'Yes', // Brake Assist
    esp: 'Yes',
    hillHoldAssist: 'Yes',
    isofix: 'Yes',
    seatbeltWarning: 'Yes', // Lamp & Buzzer all seats
    engineImmobilizer: 'Yes',
    rearUniqueSensors: 'Yes',
    speedAlertSystem: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isSigma = variantName.includes('Sigma');
    const isDelta = variantName.includes('Delta');
    const isZeta = variantName.includes('Zeta');
    const isAlpha = variantName.includes('Alpha');
    const isCNG = variantName.includes('CNG');
    const isAGS = variantName.includes('AGS');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Key Features
    let keyFeaturesArr = ['6 Airbags', 'ESP', 'Hill Hold', 'Auto AC'];
    let summary = `The Baleno ${variantName} `;

    // Common
    features.headLights = 'Halogen Projector'; // Sigma/Delta
    features.alloyWheels = 'No (Steel)';
    features.climateControl = 'Automatic';
    features.airConditioning = 'Automatic';
    features.powerWindows = 'Front & Rear';
    features.rearDefogger = 'Yes';
    features.centralLocking = 'Yes';
    features.keylessEntry = 'Yes';
    features.spoiler = 'Yes';

    if (isSigma) {
        keyFeaturesArr.push('Halogen Projector Headlamps', 'Steel Wheels', 'Auto Climate Control');
        features.touchScreenInfotainment = 'No';
        features.speakers = 'No';
        summary += 'sets the standard with 6 airbags and automatic climate control as base features.';
    } else if (isDelta) {
        keyFeaturesArr.push('7-inch SmartPlay Studio', 'Android Auto/Apple CarPlay', 'Steering Controls', 'ESP');
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Studio';
        features.speakers = '4 Speakers';
        features.steeringMountedControls = 'Yes';
        features.orvm = 'Body Coloured, Electrically Adjustable & Foldable';
        features.wheelCover = 'Yes'; // Full wheel cover
        summary += 'adds entertainment with SmartPlay Studio and essential convenience features.';
    } else if (isZeta) {
        keyFeaturesArr.push('LED Projector Headlamps', 'SmartPlay Pro', 'Rear AC Vents', '6 Airbags'); // Actually 6 is standard now
        keyFeaturesArr.push('Connected Car Tech', 'Start/Stop Button');
        features.headLights = 'LED Projector';
        features.alloyWheels = '16 inch Alloy (Painted)';
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Pro'; // Pro on Zeta
        features.startStopButton = 'Yes';
        features.pushButtonStart = 'Yes';
        features.rearACVents = 'Yes';
        features.rearWiper = 'Yes';
        features.reverseCamera = 'Yes';
        features.frontArmrest = 'Yes';
        features.driverSeatAdjustment = 'Height Adjustable';
        features.steeringAdjustment = 'Tilt & Telescopic';
        features.speakers = '4 Speakers + 2 Tweeters';
        summary += 'premiumizes the drive with LED projectors, alloy wheels, and connected technology.';
    } else if (isAlpha) {
        keyFeaturesArr.push('Heads Up Display', '360 Camera', '9-inch SmartPlay Pro+', 'UV Cut Glass');
        features.headLights = 'LED Projector (with DRLs)'; // NEXTre' LED DRL
        features.alloyWheels = '16 inch Alloy (Precision Cut)';
        features.touchScreenInfotainment = '9 inch';
        features.infotainmentScreen = '22.86 cm SmartPlay Pro+';
        features.reverseCamera = '360 Degree View';
        features.hud = 'Yes';
        features.cruiseControl = 'Yes';
        features.uvCutGlass = 'Yes';
        features.autoFoldingORVM = 'Yes';
        features.leatherWrappedSteering = 'Yes';
        features.rearACVents = 'Yes';
        features.rearWiper = 'Yes';
        features.pushButtonStart = 'Yes';
        features.driverSeatAdjustment = 'Height Adjustable';
        features.steeringAdjustment = 'Tilt & Telescopic';
        features.speakers = '4 Speakers + 2 Tweeters';
        summary += 'redefines the segment with a Heads-Up Display, 360-degree camera, and top-tier luxury.';
    }

    if (isAGS) {
        features.esp = 'Yes'; // Standard anyway
        features.hillHoldAssist = 'Yes';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` Powered by the ${isCNG ? 'efficient S-CNG' : 'refined 1.2L Dual Jet'} engine.`;

    // Wheels
    features.wheelSize = (isZeta || isAlpha) ? '16 inch' : '15 inch';
    features.tyreSize = (isZeta || isAlpha) ? '195/55 R16' : '185/65 R15';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AGS')) return 'Petrol AGS';
    return 'Petrol MT';
}

const BALENO_VARIANTS = [
    { name: 'Baleno Sigma MT', price: 598900 },
    { name: 'Baleno Delta MT', price: 679900 },
    { name: 'Baleno Delta AGS', price: 729900 },
    { name: 'Baleno Delta CNG', price: 769900 },
    { name: 'Baleno Zeta MT', price: 769900 },
    { name: 'Baleno Zeta AGS', price: 819900 },
    { name: 'Baleno Zeta CNG MT', price: 859900 },
    { name: 'Baleno Alpha MT', price: 859900 },
    { name: 'Baleno Alpha AGS', price: 909900 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Baleno/i } }).lean();
    if (!model) {
        console.error('❌ Maruti Suzuki Baleno model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI BALENO VARIANTS UPDATE ===\n');
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
    for (const v of BALENO_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${BALENO_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = BALENO_VARIANTS[8]; // Alpha AGS
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
        for (const variant of BALENO_VARIANTS) {
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
        console.log(`\n🎉 Maruti Suzuki Baleno now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
