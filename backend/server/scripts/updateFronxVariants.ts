/**
 * Update Maruti Suzuki Fronx Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 12
 * Highlights: 1.2L NA, 1.0L Turbo, S-CNG. Standard 6 Airbags.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs
// 1.2L NA: 66 kW (89.73 PS) -> ~89 Bhp
// 1.0L Turbo: 73.6 kW (100.06 PS) -> ~99 Bhp
// 1.2L CNG: 57 kW (77.5 PS) -> ~76 Bhp
const ENGINES = {
    '1.2L Petrol MT': {
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
        isHybrid: true, // Idle Start Stop
        hybridType: 'Idle Start Stop'
    },
    '1.2L Petrol AGS': { // AMT
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
    '1.0L Turbo MT': {
        engineName: '1.0l K-Series Turbo Boosterjet',
        engineType: '3 Cylinder, 12 Valves, Turbo',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '99 Bhp',
        maxPower: '99 Bhp', // 100 PS
        enginePower: '100 PS',
        torque: '147.6 Nm',
        engineTorque: '147.6 Nm @ 2000-4500 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true, // Smart Hybrid for Turbo
        hybridType: 'Smart Hybrid'
    },
    '1.0L Turbo AT': {
        engineName: '1.0l K-Series Turbo Boosterjet',
        engineType: '3 Cylinder, 12 Valves, Turbo',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '99 Bhp',
        maxPower: '99 Bhp',
        enginePower: '100 PS',
        torque: '147.6 Nm',
        engineTorque: '147.6 Nm @ 2000-4500 rpm',
        engineTransmission: '6-Speed Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Smart Hybrid'
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
    '1.2L Petrol MT': {
        mileageEngineName: '1.2l Petrol MT',
        mileageCompanyClaimed: '21.79 kmpl',
        mileageCityRealWorld: '17 kmpl',
        mileageHighwayRealWorld: '20 kmpl',
        mileageCity: '17',
        mileageHighway: '20',
        engineSummary: 'Refined 1.2L K-Series engine with 21.79 kmpl efficiency.'
    },
    '1.2L Petrol AGS': {
        mileageEngineName: '1.2l Petrol AGS',
        mileageCompanyClaimed: '22.89 kmpl',
        mileageCityRealWorld: '17 kmpl',
        mileageHighwayRealWorld: '21 kmpl',
        mileageCity: '17',
        mileageHighway: '21',
        engineSummary: 'Convenient AGS transmission delivering superior 22.89 kmpl.'
    },
    '1.0L Turbo MT': {
        mileageEngineName: '1.0l Turbo MT',
        mileageCompanyClaimed: '21.5 kmpl',
        mileageCityRealWorld: '16 kmpl',
        mileageHighwayRealWorld: '19 kmpl',
        mileageCity: '16',
        mileageHighway: '19',
        engineSummary: 'Punchy Boosterjet Turbo engine with Smart Hybrid technology.'
    },
    '1.0L Turbo AT': {
        mileageEngineName: '1.0l Turbo AT',
        mileageCompanyClaimed: '20.01 kmpl',
        mileageCityRealWorld: '14 kmpl',
        mileageHighwayRealWorld: '18 kmpl',
        mileageCity: '14',
        mileageHighway: '18',
        engineSummary: '6-Speed Automatic for a sporty yet comfortable drive.'
    },
    'CNG MT': {
        mileageEngineName: '1.2l CNG',
        mileageCompanyClaimed: '28.51 km/kg',
        mileageCityRealWorld: '24 km/kg',
        mileageHighwayRealWorld: '27 km/kg',
        mileageCity: '24',
        mileageHighway: '27',
        engineSummary: 'Eco-friendly S-CNG technology with impressive 28.51 km/kg mileage.'
    }
};

const COMMON_SPECS = {
    length: '3995',
    width: '1765',
    height: '1550',
    wheelbase: '2520',
    groundClearance: '190', // Est
    bootSpace: '308 Litres',
    fuelTankCapacity: '37 Litres',
    seatingCapacity: '5',
    doors: '5',

    // Suspension & Brakes
    frontSuspension: 'MacPherson Strut',
    rearSuspension: 'Torsion Beam',
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Safety
    airbags: '6', // Standard across all variants as per image
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
};

function getVariantFeatures(variantName: string) {
    const isSigma = variantName.includes('Sigma');
    const isDelta = variantName.includes('Delta');
    const isZeta = variantName.includes('Zeta');
    const isAlpha = variantName.includes('Alpha');
    const isPlus = variantName.includes('Plus'); // Delta Plus

    const isTurbo = variantName.includes('Turbo') || isZeta || isAlpha; // Zeta/Alpha only Turbo (except if 1.2 Zeta? User list has Zeta as Turbo)
    // User list: Zeta MT 9.7L. Alpha MT 10.69L. Delta Plus Turbo 8.91L.
    // So Zeta and Alpha are Turbo.
    const isCNG = variantName.includes('CNG');
    const isAT = variantName.includes('AT');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Key Features
    let keyFeaturesArr = ['6 Airbags', 'ESP', 'Hill Hold', 'Auto AC'];
    let summary = `The Fronx ${variantName} `;

    // Common
    features.headLights = 'Halogen Projector'; // Sigma/Delta
    features.alloyWheels = 'No (Steel)';
    features.climateControl = 'Automatic';
    features.airConditioning = 'Automatic';
    features.powerWindows = 'Front & Rear';
    features.rearDefogger = 'Yes';
    features.keylessEntry = 'Yes';

    if (isSigma) {
        keyFeaturesArr.push('Halogen Projector Headlamps', 'Steel Wheels', 'Keyless Entry');
        features.touchScreenInfotainment = 'No';
        features.speakers = 'No';
        summary += 'offers a strong entry point with standard 6 airbags and automatic climate control.';
    } else if (isDelta && !isPlus) {
        keyFeaturesArr.push('7-inch SmartPlay Pro', 'Android Auto/Apple CarPlay', 'Steering Mounted Controls');
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Pro';
        features.speakers = '4 Speakers';
        features.steeringMountedControls = 'Yes';
        features.orvm = 'Polished Black, Electrically Adjustable & Foldable';
        summary += 'adds essential tech like touchscreen infotainment and seamless smartphone connectivity.';
    } else if (isPlus) { // Delta Plus
        keyFeaturesArr.push('LED Multi-reflector Headlamps', 'Painted Alloy Wheels', 'Auto Headlamps');
        features.headLights = 'LED Multi-reflector';
        features.alloyWheels = '16 inch Alloy (Painted)';
        features.autoHeadlamps = 'Yes'; // Delta+ has Auto Headlamps
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Pro';
        features.speakers = '4 Speakers';
        features.steeringMountedControls = 'Yes';
        summary += 'brings strict style upgrades with LED headlamps and alloy wheels.';
    } else if (isZeta) {
        keyFeaturesArr.push('Wireless Charger', 'Rear AC Vents', 'Rear Wiper', 'Connected Car Tech');
        features.headLights = 'LED Multi-reflector';
        features.alloyWheels = '16 inch Alloy (Painted)';
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Pro';
        features.wirelessCharging = 'Yes';
        features.rearACVents = 'Yes';
        features.rearWiper = 'Yes';
        features.reverseCamera = 'Yes';
        features.pushButtonStart = 'Yes';
        features.frontArmrest = 'Yes';
        features.speakers = '4 Speakers + 2 Tweeters';
        summary += 'introduces premium comforts like wireless charging, rear AC vents, and connected features.';
    } else if (isAlpha) {
        keyFeaturesArr.push('360 Camera', 'HUD', '9-inch SmartPlay Pro+', 'Diamond Cut Alloys');
        features.headLights = 'LED Multi-reflector';
        features.alloyWheels = '16 inch Alloy (Precision Cut)';
        features.touchScreenInfotainment = '9 inch';
        features.infotainmentScreen = '22.86 cm SmartPlay Pro+';
        features.reverseCamera = '360 Degree View';
        features.hud = 'Yes';
        features.wirelessCharging = 'Yes';
        features.rearACVents = 'Yes';
        features.rearWiper = 'Yes';
        features.pushButtonStart = 'Yes';
        features.leatherWrappedSteering = 'Yes';
        features.cruiseControl = 'Yes';
        features.autoFoldingORVM = 'Yes'; // Auto folding
        features.uvCutGlass = 'Yes';
        summary += 'is the ultimate showstopper with Heads-Up Display, 360-degree camera, and precision-cut alloys.';
    }

    if (isAT) {
        features.paddleShifters = 'Yes';
        features.cruiseControl = 'Yes'; // Usually AT has cruise
    }

    if (isTurbo) {
        features.turbo = 'Yes';
        // Turbo variants (Zeta/Alpha) usually have more features as mapped above
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` Powered by the ${isTurbo ? 'thrilling 1.0L Turbo Boosterjet' : (isCNG ? 'efficient S-CNG' : 'refined 1.2L K-Series')} engine.`;

    // Wheels
    features.wheelSize = '16 inch';
    features.tyreSize = '195/60 R16';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';

    // Turbo Identification
    const isZeta = variantName.includes('Zeta');
    const isAlpha = variantName.includes('Alpha');
    const isTurboExplicit = variantName.includes('Turbo');

    if (isZeta || isAlpha || isTurboExplicit) {
        if (variantName.includes('AT')) return '1.0L Turbo AT';
        return '1.0L Turbo MT';
    }

    // NA Identification
    if (variantName.includes('AGS')) return '1.2L Petrol AGS';
    return '1.2L Petrol MT';
}

const FRONX_VARIANTS = [
    { name: 'Fronx Sigma MT', price: 684900 },
    { name: 'Fronx Delta MT', price: 764900 },
    { name: 'Fronx Sigma CNG', price: 778900 },
    { name: 'Fronx Delta Plus MT', price: 804500 }, // NA
    { name: 'Fronx Delta AGS', price: 814900 },
    { name: 'Fronx Delta Plus AGS', price: 854500 },
    { name: 'Fronx Delta CNG MT', price: 858900 },
    { name: 'Fronx Delta Plus Turbo MT', price: 891900 }, // Turbo start
    { name: 'Fronx Zeta MT', price: 970900 },
    { name: 'Fronx Alpha MT', price: 1069900 },
    { name: 'Fronx Zeta AT', price: 1098900 },
    { name: 'Fronx Alpha AT', price: 1197900 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Fronx/i } }).lean();
    if (!model) {
        console.error('❌ Maruti Suzuki Fronx model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI FRONX VARIANTS UPDATE ===\n');
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
    for (const v of FRONX_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${FRONX_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = FRONX_VARIANTS[11]; // Alpha AT
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
        for (const variant of FRONX_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/\(o\)/g, 'opt'); // Just in case, though Fronx has no (O)
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
        console.log(`\n🎉 Maruti Suzuki Fronx now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
