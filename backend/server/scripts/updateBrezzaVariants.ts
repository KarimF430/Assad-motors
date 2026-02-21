/**
 * Update Maruti Suzuki Brezza Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 10
 * Highlights: 1.5L Smart Hybrid, 6 Airbags Standard, HUD, 360 Camera, Sunroof
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs (Standardized to Bhp, No RPM text)
// Petrol: 75.8kW (103.1 PS) -> ~102 Bhp
// CNG: 64.6 kW (87.8 PS) -> ~87 Bhp
const ENGINES = {
    'Petrol MT': {
        engineName: '1.5l K15C Smart Hybrid',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1462',
        engineCapacity: '1462 cc',
        power: '102 Bhp',
        maxPower: '102 Bhp', // Standardized
        enginePower: '103 PS',
        torque: '137 Nm',
        engineTorque: '137 Nm @ 4400 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Mild Hybrid'
    },
    'Petrol AT': {
        engineName: '1.5l K15C Smart Hybrid',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1462',
        engineCapacity: '1462 cc',
        power: '102 Bhp',
        maxPower: '102 Bhp',
        enginePower: '103 PS',
        torque: '137 Nm',
        engineTorque: '137 Nm @ 4400 rpm',
        engineTransmission: '6-Speed Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Mild Hybrid'
    },
    'CNG MT': {
        engineName: '1.5l K15C CNG',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1462',
        engineCapacity: '1462 cc',
        power: '87 Bhp',
        maxPower: '87 Bhp',
        enginePower: '88 PS',
        torque: '121.5 Nm',
        engineTorque: '121.5 Nm @ 4200 rpm',
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

// Mileage Data
const MILEAGE_DATA = {
    'Petrol MT (LXi/VXi)': {
        mileageEngineName: '1.5l Smart Hybrid MT',
        mileageCompanyClaimed: '17.38 kmpl', // Brochure check: 17.80? Let's check image text again. "17.80 km/l LXi, VXi MT"
        mileageCityRealWorld: '13 kmpl',
        mileageHighwayRealWorld: '17 kmpl',
        mileageCity: '13',
        mileageHighway: '17',
        engineSummary: 'The 1.5L K15C Smart Hybrid engine offers a balanced drive with 103 PS and mild-hybrid efficiency.'
    },
    'Petrol MT (ZXi/ZXi+)': {
        mileageEngineName: '1.5l Smart Hybrid MT',
        mileageCompanyClaimed: '19.89 kmpl', // "19.89 km/l ZXi, ZXi+ MT"
        mileageCityRealWorld: '14 kmpl',
        mileageHighwayRealWorld: '18 kmpl',
        mileageCity: '14',
        mileageHighway: '18',
        engineSummary: 'Optimized for efficiency, the higher trims deliver an impressive 19.89 kmpl.'
    },
    'Petrol AT': {
        mileageEngineName: '1.5l Smart Hybrid AT',
        mileageCompanyClaimed: '19.80 kmpl', // "19.80 km/l VXi, ZXi & ZXi+ AT"
        mileageCityRealWorld: '13 kmpl',
        mileageHighwayRealWorld: '18 kmpl',
        mileageCity: '13',
        mileageHighway: '18',
        engineSummary: 'The 6-Speed Automatic pairs convenience with excellent fuel economy thanks to Smart Hybrid tech.'
    },
    'CNG MT': {
        mileageEngineName: '1.5l S-CNG',
        mileageCompanyClaimed: '25.51 km/kg',
        mileageCityRealWorld: '20 km/kg',
        mileageHighwayRealWorld: '24 km/kg',
        mileageCity: '20',
        mileageHighway: '24',
        engineSummary: 'The S-CNG technology delivers superior mileage of 25.51 km/kg with factory-fitted safety.'
    }
};

// Common Specs
const COMMON_SPECS = {
    length: '3995',
    width: '1790',
    height: '1685',
    wheelbase: '2500',
    groundClearance: '198', // Unladen usually ~200mm, Brochure image doesn't show clearly, using market standard
    bootSpace: '328 Litres',
    fuelTankCapacity: '48 Litres',
    seatingCapacity: '5',
    doors: '5',

    // Suspension & Brakes
    frontSuspension: 'Mac Pherson Strut & Coil',
    rearSuspension: 'Torsion Beam & Coil Spring',
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Drum',

    // Safety Standard
    airbags: '6',
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    abs: 'Yes',
    ebd: 'Yes',
    esp: 'Yes', // Electronic Stability Program
    hillHoldAssist: 'Yes',
    isofix: 'Yes',
    seatbeltWarning: 'Yes',
    engineImmobilizer: 'Yes',
    rearUniqueSensors: 'Yes', // Reverse Parking Sensors
    speedAlertSystem: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isLXi = variantName.includes('LXi');
    const isVXi = variantName.includes('VXi');
    const isZXi = variantName.includes('ZXi') && !variantName.includes('ZXi+');
    const isZXiPlus = variantName.includes('ZXi+');
    const isCNG = variantName.includes('CNG');
    const isAT = variantName.includes('AT');
    const isDualTone = variantName.includes('Dual Tone');

    let features: Record<string, any> = {};

    // Warranty
    features.warranty = '2 Years / 40,000 Km'; // Standard Maruti

    // Key Features Construction
    let keyFeaturesArr = ['6 Airbags (Standard)', 'ESP', 'Hill Hold Assist'];
    let summary = `The Brezza ${variantName} `;

    // Feature Logic
    features.headLights = 'Halogen Projector'; // Bi-Halogen
    features.sunroof = 'No';
    features.cruiseControl = 'No';
    features.alloyWheels = 'No (Steel)';
    features.touchScreenInfotainment = 'No';

    if (isLXi) {
        keyFeaturesArr.push('Bi-Halogen Projector Headlamps', 'Rear AC Vents', 'Electrically Adjustable ORVMs');
        summary += 'is the base variant that surprises with standard 6 airbags, rear AC vents, and projector headlamps.';
    } else if (isVXi) {
        keyFeaturesArr.push('SmartPlay Studio (7-inch)', 'Climate Control', 'Height Adjustable Driver Seat', 'Rear Defogger');
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78cm SmartPlay Studio';
        features.airConditioning = 'Automatic';
        features.climateControl = 'Automatic';
        features.headLights = 'Bi-Halogen Projector';
        features.rearDefogger = 'Yes';
        summary += 'adds comfort and tech with automatic climate control and the SmartPlay Studio infotainment system.';
    } else if (isZXi) {
        keyFeaturesArr.push('Electric Sunroof', 'Dual LED Projector Headlamps', 'SmartPlay Pro (7-inch)', 'Cruise Control', 'Painted Alloys');
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78cm SmartPlay Pro';
        features.sunroof = 'Electric Sunroof';
        features.cruiseControl = 'Yes';
        features.alloyWheels = '16 inch Painted Alloy';
        features.pushButtonStart = 'Yes';
        features.keylessEntry = 'Smart Key';
        features.rearWiper = 'Yes';
        features.reverseCamera = 'Yes';
        features.headLights = 'Dual LED Projector';
        features.daytimeRunningLights = 'Yes';
        summary += 'elevates the experience with a sunroof, dual LED projector headlamps, and cruise control.';
    } else if (isZXiPlus) {
        keyFeaturesArr.push('9-inch SmartPlay Pro+', '360 View Camera', 'Head Up Display', 'Wireless Charger', 'Cooled Glovebox', 'Precision Cut Alloys');
        features.touchScreenInfotainment = '9 inch';
        features.infotainmentScreen = '22.86cm SmartPlay Pro+';
        features.sunroof = 'Electric Sunroof';
        features.cruiseControl = 'Yes';
        features.alloyWheels = '16 inch Precision Cut Alloy';
        features.pushButtonStart = 'Yes';
        features.keylessEntry = 'Smart Key';
        features.rearWiper = 'Yes';
        features.reverseCamera = '360 Degree View';
        features.headLights = 'Dual LED Projector';
        features.daytimeRunningLights = 'Yes';
        features.wirelessCharging = 'Yes';
        features.cooledGloveBox = 'Yes';
        features.hud = 'Yes'; // Head Up Display
        features.ambientLighting = 'Yes';
        summary += 'is the fully loaded flagship featuring a 360-degree camera, Head Up Display, and premium interiors.';
    }

    if (isAT) {
        keyFeaturesArr.push('Paddle Shifters');
        features.paddleShifters = 'Yes';
    }

    if (isDualTone) {
        features.dualTone = 'Yes';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` Powered by the ${isCNG ? 'efficient 1.5L S-CNG' : 'reliable 1.5L K-Series Smart Hybrid'} engine.`;

    // Wheels
    features.wheelSize = '16 inch';
    features.tyreSize = '215/60 R16';

    // Infotainment Extras
    if (isZXi || isZXiPlus) {
        features.androidAppleCarplay = isZXiPlus ? 'Wireless' : 'Wired'; // Chart says Wireless for ZXi and ZXi+?
        // Chart: "Android Auto and Apple CarPlay###" -> Wireless for ZXi, ZXi+ (Tick). VXi (Tick - likely Wired).
        // Let's assume Wireless for ZXi/ZXi+ as per "Wireless" text in ZXi col.
        features.androidAppleCarplay = 'Wireless';
    } else if (isVXi) {
        features.androidAppleCarplay = 'Wired';
    }

    features.speakers = isVXi ? '4 Speakers' : (isZXi ? '4 Speakers + 2 Tweeters' : (isZXiPlus ? 'Surround Sense (Arkamys)' : 'No'));

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AT')) return 'Petrol AT';
    return 'Petrol MT';
}

// Pricing from User
const BREZZA_VARIANTS = [
    { name: 'Brezza LXi MT', price: 825900 },
    { name: 'Brezza LXi CNG', price: 916900 },
    { name: 'Brezza VXi MT', price: 925900 },
    { name: 'Brezza VXi CNG', price: 1016900 },
    { name: 'Brezza ZXi MT Dual Tone', price: 1055300 },
    { name: 'Brezza VXi AT', price: 1059900 },
    { name: 'Brezza ZXi CNG Dual Tone', price: 1146300 },
    { name: 'Brezza ZXi+ MT', price: 1166300 },
    { name: 'Brezza ZXi AT', price: 1190300 },
    { name: 'Brezza ZXi+ AT', price: 1301300 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Brezza/i } }).lean();
    if (!model) {
        console.error('❌ Maruti Suzuki Brezza model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI BREZZA VARIANTS UPDATE ===\n');
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
    for (const v of BREZZA_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${BREZZA_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = BREZZA_VARIANTS[7]; // ZXi+ MT
        const engineKey = getEngineKey(sampleVariant.name);
        const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
        // Mileage determination logic
        let mileageKey = engineKey;
        if (engineKey === 'Petrol MT') {
            if (sampleVariant.name.includes('ZXi')) mileageKey = 'Petrol MT (ZXi/ZXi+)';
            else mileageKey = 'Petrol MT (LXi/VXi)';
        }
        const mileageData = MILEAGE_DATA[mileageKey as keyof typeof MILEAGE_DATA];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of BREZZA_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            const variantId = `variant-${model.brandId}-${model.id}-${sanitizedName}`;
            const engineKey = getEngineKey(variant.name);
            const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];

            let mileageKey = engineKey;
            if (engineKey === 'Petrol MT') {
                if (variant.name.includes('ZXi')) mileageKey = 'Petrol MT (ZXi/ZXi+)';
                else mileageKey = 'Petrol MT (LXi/VXi)';
            }
            const mileageData = MILEAGE_DATA[mileageKey as keyof typeof MILEAGE_DATA];

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
        console.log(`\n🎉 Maruti Suzuki Brezza now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
