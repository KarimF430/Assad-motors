/**
 * Update Hyundai i20 N Line Variants - December 2025
 * 
 * Data Source: Official Hyundai Brochure + Price List
 * Total Variants: 8
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
    'Turbo MT': {
        engineName: '1.0l Turbo GDi Petrol',
        engineType: '3 Cylinder, 12 Valves DOHC',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '118 Bhp',
        maxPower: '118 Bhp',
        enginePower: '118 Bhp',
        torque: '172 Nm',
        engineTorque: '172 Nm (17.5 kgm) @ 1500-4000 r/min',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'Turbo DCT': {
        engineName: '1.0l Turbo GDi Petrol',
        engineType: '3 Cylinder, 12 Valves DOHC',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '118 Bhp',
        maxPower: '118 Bhp',
        enginePower: '118 Bhp',
        torque: '172 Nm',
        engineTorque: '172 Nm (17.5 kgm) @ 1500-4000 r/min',
        engineTransmission: '7-Speed Dual Clutch Transmission (7DCT)',
        engineSpeed: '7-Speed DCT',
        noOfGears: '7',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
};

// Mileage data
const MILEAGE_DATA = {
    'Turbo MT': {
        mileageEngineName: '1.0l Turbo GDi Petrol Manual',
        mileageCompanyClaimed: '20.0',
        mileageCityRealWorld: '13',
        mileageHighwayRealWorld: '17',
        mileageCity: '13',
        mileageHighway: '17',
        engineSummary: 'The 1.0-litre Turbo GDi engine delivers a punchy 118 Bhp and 172 Nm torque. The 6-speed manual gearbox offers precise shifts for an enthusiast-focused driving experience.',
    },
    'Turbo DCT': {
        mileageEngineName: '1.0l Turbo GDi Petrol DCT',
        mileageCompanyClaimed: '20.25',
        mileageCityRealWorld: '12',
        mileageHighwayRealWorld: '16',
        mileageCity: '12',
        mileageHighway: '16',
        engineSummary: 'The 1.0-litre Turbo GDi paired with the 7-speed Dual Clutch Transmission offers lightning-fast shifts and sporty performance with 118 Bhp on tap.',
    },
};

// Common specs from brochure
const COMMON_SPECS = {
    // Dimensions
    length: '3995',
    width: '1775',
    height: '1505',
    wheelbase: '2580',
    groundClearance: '170',
    turningRadius: '5.2',
    kerbWeight: '1080-1150',
    fuelTankCapacity: '37 Litres',
    seatingCapacity: '5',
    doors: '5',
    bootSpace: '311 Litres',
    cupholders: '4',

    // Suspension
    frontSuspension: 'McPherson strut',
    rearSuspension: 'Coupled torsion beam axle',
    shockAbsorber: 'Gas type',

    // Brakes (All 4 Disc on N Line)
    frontBrake: 'Disc (with Red Caliper)',
    rearBrake: 'Disc (with Red Caliper)',

    // Emission
    emissionStandard: 'BS6 Phase 2',

    // Global NCAP Rating
    globalNCAPRating: '3-Star',

    // Common Safety
    abs: 'Yes',
    ebd: 'Yes',
    esc: 'Yes',
    hillHoldAssist: 'Yes',
    vehicleStabilityManagement: 'Yes',
    tyrePressureMonitor: 'Yes (Highline)',
    seatbeltWarning: 'Yes (All seats)',
    speedAlertSystem: 'Yes',
    threePointSeatbelts: 'All seats',
    immobiliser: 'Yes',
    highMountedStopLamp: 'Yes',
    emergencyStopSignal: 'Yes',
    impactSensingDoorUnlock: 'Yes',
    speedSensingDoorLocks: 'Yes',
    airbags: '6',
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    isofix: 'Yes',
    isofixMounts: 'Yes',
};

// Variant-specific features
function getVariantFeatures(variantName: string) {
    const isN6 = variantName.includes('N 6');
    const isN8 = variantName.includes('N 8');
    const isDT = variantName.includes('DT');
    const isDCT = variantName.includes('DCT');
    const isMT = variantName.includes('MT');

    let features: Record<string, any> = {};

    // Warranty
    features.warranty = '3 Years / Unlimited Km';

    // Key Features
    let keyFeaturesArr: string[] = ['6 Airbags', 'All 4 Disc Brakes', 'Start/Stop System', 'Sporty Twin Tip Exhaust'];

    if (isN6) {
        keyFeaturesArr.push('Sunroof', '8-inch Touchscreen', 'LED Headlamps', 'Wireless CarPlay');
    } else if (isN8) {
        keyFeaturesArr.push('Voice Enabled Sunroof', '10.25-inch HD Display', 'Bose Premium Audio', 'BlueLink Connected Car', 'Paddle Shifters (DCT)');
    }

    if (isDT) keyFeaturesArr.push('Dual Tone Exterior');
    if (isDCT) keyFeaturesArr.push('7-Speed DCT');
    features.keyFeatures = keyFeaturesArr.join(', ');

    // Header Summary
    if (isN6) {
        features.headerSummary = `The i20 N Line ${variantName} offers sporty performance with all 4 disc brakes, sunroof, and N Line exclusive styling at an accessible price.`;
    } else if (isN8) {
        features.headerSummary = `The i20 N Line ${variantName} is the fully loaded performance hatch with Bose audio, 10.25-inch screen, and advanced connected features.`;
    }

    // Description
    if (isN6) {
        features.description = 'The N6 variant brings the N Line excitement with the 1.0L Turbo engine, sporty exhaust note, and stiffer suspension setup. It features an 8-inch touchscreen and electric sunroof.';
    } else if (isN8) {
        features.description = 'The N8 variant delivers the ultimate experience with a premium 10.25-inch infotainment system, Bose 7-speaker audio, BlueLink connectivity, and red ambient lighting.';
    }

    // Wheels
    features.wheelSize = '16 inch';
    features.tyreSize = '195/55 R16';
    features.alloyWheels = '16 inch Diamond Cut Alloy with N Logo';

    // Lights
    if (isN6) {
        features.headLights = 'Halogen';
        features.headlights = 'Halogen';
        features.tailLights = 'Z-Shaped LED';
        features.tailLight = 'Z-Shaped LED';
    } else {
        features.headLights = 'LED MFR';
        features.headlights = 'LED MFR (Multi-Focus Reflector)';
        features.tailLights = 'Z-Shaped LED';
        features.tailLight = 'Z-Shaped LED';
    }
    features.daytimeRunningLights = 'LED';
    features.drl = 'Yes';
    features.automaticHeadlamp = 'Yes';
    features.followMeHomeHeadlights = 'Yes';

    // Infotainment
    if (isN6) {
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.32 cm (8") Touchscreen Infotainment';
        features.speakers = '4 (Front & Rear)';
        features.androidAppleCarplay = 'Wireless';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wireless';
    } else {
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm (10.25") HD Infotainment & Navigation';
        features.speakers = '7 (Bose Premium)';
        features.tweeters = '2 (Front)';
        features.subwoofers = '1';
        features.androidAppleCarplay = 'Wired';
        features.androidAuto = 'Yes';
        features.appleCarPlay = 'Yes';
        features.voiceRecognition = 'Yes';
        features.connectedCarTech = 'Hyundai BlueLink';
        features.otaUpdates = 'Yes (Maps)';
    }

    // Interior
    features.interiorColor = 'Sporty Black with Athletic Red Inserts';
    features.seatUpholstery = 'Chequered Flag Design Leatherette with N Logo';
    features.steeringWheelType = '3-Spoke Leather Wrapped with N Logo';
    features.leatherGearKnob = 'Yes (N Logo)';
    features.sportyMetalPedals = 'Yes';
    features.insideDoorHandles = 'Dark Metal Finish';
    features.sunglassHolder = 'Yes';

    if (isN8) {
        features.ambientLighting = 'Red';
        features.crashpadSoftTouch = 'Yes';
        features.doorArmrestCovering = 'Leather';
    }

    // Comfort
    features.airConditioning = 'Automatic (FATC)';
    features.climateControl = 'Automatic';
    features.rearACVents = 'Yes';
    features.powerWindows = 'Front & Rear';
    features.powerSteering = 'Motor Driven Electric';
    features.steeringAdjustment = 'Tilt & Telescopic';
    features.cruiseControl = 'Yes';
    features.gloveBoxCooling = 'Yes';
    features.frontArmrest = 'Sliding with Storage';

    if (isN6) {
        features.sunroof = 'Smart Electric';
        features.wirelessCharging = 'No';
        features.keylessEntry = 'Foldable Key';
        features.ignition = 'Key Start';
    } else {
        features.sunroof = 'Voice Enabled Smart Electric';
        features.wirelessCharging = 'Yes';
        features.keylessEntry = 'Smart Key';
        features.ignition = 'Push Button Start';
        features.pushButtonStart = 'Yes';
        features.driverSeatAdjustment = 'Height Adjustable';
        features.rearWindshieldWiper = 'Yes';
        features.outsideRearViewMirrors = 'Electric Folding with Auto Fold';
        features.insideRearViewMirror = 'Electrochromic (ECM) with BlueLink Buttons';
    }

    if (isN6) {
        features.outsideRearViewMirrors = isN6 ? 'Electric Adjust' : 'Electric Folding'; // N6 mirrors are electric adjust/fold based on brochure logic
        // Brochure says: N6 Electric Adjust & Electric Folding. N8 has Auto Fold.
        features.outsideRearViewMirrors = 'Electric Folding';
    }

    // Paddle Shifters
    if (isDCT) {
        features.paddleShifters = 'Yes';
        features.drivingModes = 'Normal, Eco, Sport';
    }

    // Exterior Design
    features.exteriorDesign = 'N Line Front Grille, Sporty Bumpers with Red Accents, Twin Tip Exhaust, Side Sill Garnish, Tailgate Spoiler with Side Wings.';
    if (isDT) features.exteriorDesign += ' Dual Tone Black Roof.';

    // Comfort Summary
    if (isN6) {
        features.comfortConvenience = 'Auto AC, sunroof, 8-inch touchscreen, all 4 disc brakes, cruise control, leather seats.';
    } else {
        features.comfortConvenience = 'Auto AC, voice sunroof, 10.25-inch screen, Bose audio, wireless charger, BlueLink, auto-dimming IRVM.';
    }

    return features;
}

// Parse variant name to get engine type
function getEngineKey(variantName: string): string {
    if (variantName.includes('DCT')) return 'Turbo DCT';
    return 'Turbo MT';
}

// i20 N Line Variants
const I20_NLINE_VARIANTS = [
    { name: 'N 6 Turbo Petrol MT', price: 914265 },
    { name: 'N 6 DT Turbo Petrol MT', price: 932468 },
    { name: 'N 6 Turbo Petrol DCT', price: 1023391 },
    { name: 'N 6 DT Turbo Petrol DCT', price: 1037111 },
    { name: 'N 8 Turbo Petrol MT', price: 1045344 },
    { name: 'N 8 DT Turbo Petrol MT', price: 1059065 },
    { name: 'N 8 Turbo Petrol DCT', price: 1145963 },
    { name: 'N 8 DT Turbo Petrol DCT', price: 1159684 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Find i20 N Line model
    // Note: Checking if "i20 N Line" exists, if not it might be just "i20 N-Line" or "i20 N Line"
    const model = await Model.findOne({ name: { $regex: /i20.*n.*line/i } }).lean();
    if (!model) {
        console.error('❌ Hyundai i20 N Line model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== HYUNDAI i20 N LINE VARIANTS UPDATE ===\n');
    console.log(`Model ID: ${model.id}`);
    console.log(`Brand ID: ${model.brandId}\n`);

    // Delete existing variants
    if (!isDryRun) {
        const deleteResult = await Variant.deleteMany({ modelId: model.id });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing variants\n`);
    } else {
        const existingCount = await Variant.countDocuments({ modelId: model.id });
        console.log(`Would delete ${existingCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(70));

    for (const v of I20_NLINE_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }

    console.log('-'.repeat(70));
    console.log(`Total: ${I20_NLINE_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = I20_NLINE_VARIANTS[I20_NLINE_VARIANTS.length - 1]; // N8 DCT DT
        const engineKey = getEngineKey(sampleVariant.name);
        const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
        const mileageData = MILEAGE_DATA[engineKey as keyof typeof MILEAGE_DATA];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        const specCount = Object.keys(allSpecs).length;

        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${specCount} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
        console.log('Run with --execute to insert variants');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');

        for (const variant of I20_NLINE_VARIANTS) {
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
        console.log(`\n🎉 Hyundai i20 N Line now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
