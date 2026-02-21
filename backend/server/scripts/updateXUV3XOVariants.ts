/**
 * Update Mahindra XUV 3XO Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 29
 * Highlights: 1.2L Petrol NA, 1.2L Turbo GDI, 1.5L Diesel, ADAS Level 2
 * Note: Features cascade from lower to higher variants
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Image 3
// Petrol TCMPFi (1.2L NA): 82 kW @ 5000 rpm -> ~111 Bhp
// Petrol TGDi (1.2L Turbo): 96 kW @ 5000 rpm -> ~130 Bhp
// Diesel CRDe (1.5L): 85.8 kW @ 3750 rpm -> ~117 Bhp
const ENGINES = {
    'Petrol NA MT': {
        engineName: '1.2l mStallion TCMPFi',
        engineType: '3 Cylinder, Turbo Charged MPFI',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '111 Bhp',
        maxPower: '111 Bhp',
        enginePower: '112 PS',
        torque: '200 Nm',
        engineTorque: '200 Nm @ 1500-3500 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    },
    'Petrol NA AT': {
        engineName: '1.2l mStallion TCMPFi',
        engineType: '3 Cylinder, Turbo Charged MPFI',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '111 Bhp',
        maxPower: '111 Bhp',
        enginePower: '112 PS',
        torque: '200 Nm',
        engineTorque: '200 Nm @ 1500-3500 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    },
    'Petrol Turbo MT': {
        engineName: '1.2l mStallion TGDi Turbo',
        engineType: '3 Cylinder, Turbo GDI',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '130 Bhp',
        maxPower: '130 Bhp',
        enginePower: '131 PS',
        torque: '230 Nm',
        engineTorque: '230 Nm @ 1500-3750 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    },
    'Petrol Turbo AT': {
        engineName: '1.2l mStallion TGDi Turbo',
        engineType: '3 Cylinder, Turbo GDI',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '130 Bhp',
        maxPower: '130 Bhp',
        enginePower: '131 PS',
        torque: '230 Nm',
        engineTorque: '230 Nm @ 1500-3750 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    },
    'Diesel MT': {
        engineName: '1.5l CRDe Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '1497',
        engineCapacity: '1497 cc',
        power: '117 Bhp',
        maxPower: '117 Bhp',
        enginePower: '117 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1500-2500 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    },
    'Diesel AMT': {
        engineName: '1.5l CRDe Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '1497',
        engineCapacity: '1497 cc',
        power: '117 Bhp',
        maxPower: '117 Bhp',
        enginePower: '117 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1500-2500 rpm',
        engineTransmission: '6-Speed AutoSHIFT+ AMT',
        engineSpeed: '6-Speed AMT',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    }
};

const MILEAGE_DATA = {
    'Petrol NA MT': {
        mileageEngineName: '1.2l TCMPFi MT',
        mileageCompanyClaimed: '18.89 kmpl',
        mileageCityRealWorld: '14 kmpl',
        mileageHighwayRealWorld: '17 kmpl',
        mileageCity: '14',
        mileageHighway: '17',
        engineSummary: 'Efficient 1.2L turbo-petrol delivering 111 Bhp with good fuel economy.'
    },
    'Petrol NA AT': {
        mileageEngineName: '1.2l TCMPFi AT',
        mileageCompanyClaimed: '17.96 kmpl',
        mileageCityRealWorld: '13 kmpl',
        mileageHighwayRealWorld: '16 kmpl',
        mileageCity: '13',
        mileageHighway: '16',
        engineSummary: 'Smooth 6-speed torque converter automatic for effortless city driving.'
    },
    'Petrol Turbo MT': {
        mileageEngineName: '1.2l TGDi Turbo MT',
        mileageCompanyClaimed: '17.5 kmpl',
        mileageCityRealWorld: '13 kmpl',
        mileageHighwayRealWorld: '16 kmpl',
        mileageCity: '13',
        mileageHighway: '16',
        engineSummary: 'Punchy 130 Bhp TGDi turbo for enthusiastic driving.'
    },
    'Petrol Turbo AT': {
        mileageEngineName: '1.2l TGDi Turbo AT',
        mileageCompanyClaimed: '17.0 kmpl',
        mileageCityRealWorld: '12 kmpl',
        mileageHighwayRealWorld: '15 kmpl',
        mileageCity: '12',
        mileageHighway: '15',
        engineSummary: 'Top-spec turbo with automatic for performance and convenience.'
    },
    'Diesel MT': {
        mileageEngineName: '1.5l CRDe MT',
        mileageCompanyClaimed: '21.13 kmpl',
        mileageCityRealWorld: '16 kmpl',
        mileageHighwayRealWorld: '20 kmpl',
        mileageCity: '16',
        mileageHighway: '20',
        engineSummary: 'Torquey 1.5L diesel with excellent highway efficiency.'
    },
    'Diesel AMT': {
        mileageEngineName: '1.5l CRDe AMT',
        mileageCompanyClaimed: '20.5 kmpl',
        mileageCityRealWorld: '15 kmpl',
        mileageHighwayRealWorld: '19 kmpl',
        mileageCity: '15',
        mileageHighway: '19',
        engineSummary: 'Diesel convenience with AutoSHIFT+ AMT technology.'
    }
};

// Common Specs from Image 3
const COMMON_SPECS = {
    length: '3990',
    width: '1821',
    height: '1647',
    wheelbase: '2600',
    groundClearance: '201',
    bootSpace: '364 Litres',
    fuelTankCapacity: '42 Litres',
    seatingCapacity: '5',
    doors: '5',
    turningRadius: '5.3 m',

    // Suspension & Brakes
    frontSuspension: 'McPherson Strut with Anti-roll Bar',
    rearSuspension: 'Twist Beam with Coil Spring',
    frontBrake: 'Disc',
    rearBrake: 'Disc',

    // Safety Standard (MX1 baseline)
    airbags: '6',
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    esp: 'Yes',
    isofix: 'Yes',
    seatbeltWarning: 'Yes',
    abs: 'Yes',
    ebd: 'Yes',
};

function getVariantFeatures(variantName: string) {
    // Determine trim level (cumulative features)
    const isMX1 = variantName.includes('MX1');
    const isMX2 = variantName.includes('MX2');
    const isMX2Pro = variantName.includes('MX2 Pro');
    const isMX3 = variantName.includes('MX3') && !variantName.includes('MX3 Pro');
    const isMX3Pro = variantName.includes('MX3 Pro');
    const isAX5 = variantName.includes('AX5') && !variantName.includes('AX5 L');
    const isAX5L = variantName.includes('AX5 L');
    const isAX7 = variantName.includes('AX7') && !variantName.includes('AX7 L');
    const isAX7L = variantName.includes('AX7 L');
    const isREVX = variantName.includes('REVX');

    const isAT = variantName.includes('AT') || variantName.includes('AMT');
    const isTurbo = variantName.includes('Turbo') || variantName.includes('TGDi');
    const isDiesel = variantName.includes('Diesel');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';

    // Build features cumulatively
    let keyFeaturesArr: string[] = [];
    let summary = `The XUV 3XO ${variantName} `;

    // ======= MX1 BASE FEATURES =======
    features.headLights = 'Bi-Halogen Projector';
    features.ledTailLamps = 'Yes';
    features.ledDRL = 'Yes (Signature Lamp)';
    features.alloyWheels = 'No (R16 Steel)';
    features.tyreSize = '205/65 R16';
    features.orvm = 'Electrically Adjustable';
    features.engineStartStop = 'Yes';
    features.smartSteeringModes = 'Yes';
    features.powerWindows = 'Front & Rear';
    features.frontArmrest = 'Yes (with Storage)';
    features.rearSeatSplit = '60:40';
    features.rearACVents = 'Yes';
    features.usbPorts = 'Front & Rear USB-C';
    features.rearParkingSensors = 'Yes';
    features.touchScreenInfotainment = 'No';

    keyFeaturesArr.push('6 Airbags', 'ESP', 'LED Signature Lamp');

    // ======= MX2 ADDS (on MX1) =======
    if (!isMX1) {
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm Touchscreen';
        features.speakers = '4 Speakers';
        features.steeringMountedControls = 'Yes (Audio)';
        features.keylessEntry = 'Yes (Remote)';
        features.followMeHomeHeadlamps = 'Yes';
        keyFeaturesArr.push('10.25" Touchscreen', '4 Speakers');
    }

    // ======= MX2 PRO ADDS (on MX2) =======
    if (isMX2Pro || isMX3 || isMX3Pro || isAX5 || isAX5L || isAX7 || isAX7L) {
        features.sunroof = 'Single Pane';
        features.wheelCover = 'Yes';
        keyFeaturesArr.push('Sunroof');
    }

    // ======= MX3 ADDS (on MX2) =======
    if (isMX3 || isMX3Pro || isAX5 || isAX5L || isAX7 || isAX7L) {
        features.infotainmentScreen = '26.03 cm HD Touchscreen';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wired';
        features.cruiseControl = 'Yes';
        features.wirelessCharging = 'Yes';
        keyFeaturesArr.push('Wireless Android Auto', 'Cruise Control');
    }

    // ======= MX3 PRO ADDS (on MX3) =======
    if (isMX3Pro || isAX5 || isAX5L || isAX7 || isAX7L) {
        features.headLights = 'Bi-LED Projector';
        features.ledDRL = 'Yes (with Turn Indicator)';
        features.ledTailLamps = 'Infinity LED';
        features.alloyWheels = 'Stylized Vector Wheel Cover';
        keyFeaturesArr.push('Bi-LED Projector Headlamps');
    }

    // ======= AX5 ADDS (on MX3 Pro) =======
    if (isAX5 || isAX5L || isAX7 || isAX7L) {
        features.digitalCluster = 'Yes (26.03 cm)';
        features.adrenoxConnect = 'Yes (with Alexa)';
        features.onlineNavigation = 'Yes';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wireless';
        features.alloyWheels = '16 inch Diamond Cut Alloy';
        features.dualZoneClimate = 'Yes';
        features.reverseCamera = 'Yes';
        features.passiveKeylessEntry = 'Yes';
        features.pushButtonStart = 'Yes';
        features.leatherSteeringGearKnob = 'Yes';
        features.tpms = 'Yes';
        features.autoFoldingORVM = 'Yes';
        features.driverSeatAdjustment = 'Height Adjustable';
        features.rearArmrest = 'Yes (with Cup Holder)';
        features.autoHeadlamps = 'Yes';
        features.autoWiper = 'Yes';
        features.rearWiper = 'Yes';
        features.roofRails = 'Yes';
        features.rearSpoiler = 'Yes';
        features.rearDefogger = 'Yes';
        features.speakers = '6 Speakers';
        keyFeaturesArr.push('Twin Digital Screens', 'Dual Zone AC', 'Alexa Built-in');
    }

    // ======= AX5 L (Luxury) ADDS (on AX5) =======
    if (isAX5L || isAX7L) {
        features.adas = 'Level 2';
        features.surround360Camera = 'Yes';
        features.blindSpotMonitor = 'Yes';
        features.autoDimmingIRVM = 'Yes';
        features.electronicParkingBrake = 'Yes (with Auto Hold)';
        features.cooledGlovebox = 'Yes';
        features.dolbyAtmos = 'Yes';
        features.usbFastCharging = '65W USB-C';
        keyFeaturesArr.push('ADAS Level 2', '360 Camera', 'Dolby Atmos');
    }

    // ======= AX7 ADDS (on AX5) =======
    if (isAX7 || isAX7L) {
        features.sunroof = 'Panoramic Skyroof';
        features.harmanKardon = 'Yes (with Subwoofer)';
        features.leatherSeats = 'Yes (Leatherette)';
        features.softTouchDashboard = 'Yes';
        features.alloyWheels = '17 inch Diamond Cut Alloy';
        features.tyreSize = '215/55 R17';
        features.autoDimmingIRVM = 'Yes';
        features.ledFogLamps = 'Yes';
        features.frontParkingSensors = 'Yes';
        keyFeaturesArr.push('Panoramic Skyroof', 'Harman Kardon Audio', 'Leatherette Seats');
    }

    // ======= AX7 L (Luxury) ADDS (on AX7) =======
    if (isAX7L) {
        features.adas = 'Level 2';
        features.surround360Camera = 'Yes';
        features.blindSpotMonitor = 'Yes';
        features.electronicParkingBrake = 'Yes (with Auto Hold)';
        // Already has most AX5L features via hierarchy
    }

    // ======= REVX Special Variants =======
    if (isREVX) {
        // REVX are sport-focused variants, positioned between MX series
        features.headLights = 'Bi-LED Projector';
        features.sportStyling = 'Yes';
        if (variantName.includes('(O)')) {
            features.sunroof = 'Single Pane';
        }
        keyFeaturesArr.push('Sport Styling', 'Bi-LED Headlamps');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isMX1) {
        summary += 'offers essential features with 6 airbags and LED signature styling.';
    } else if (isMX2 || isMX2Pro) {
        summary += 'adds connectivity with a large touchscreen and sunroof.';
    } else if (isMX3 || isMX3Pro) {
        summary += 'brings premium lighting and wireless connectivity.';
    } else if (isAX5) {
        summary += 'delivers a twin-screen experience with Adrenox connected features.';
    } else if (isAX5L) {
        summary += 'adds ADAS Level 2 and 360-degree camera for enhanced safety.';
    } else if (isAX7) {
        summary += 'offers luxury with Harman Kardon audio and panoramic skyroof.';
    } else if (isAX7L) {
        summary += 'is the flagship with full ADAS suite and premium audio.';
    } else if (isREVX) {
        summary += 'brings sporty styling with capable performance.';
    }

    features.headerSummary = summary;
    features.description = summary + ' Built on Mahindra\'s modern platform.';

    return features;
}

function getEngineKey(variantName: string): string {
    const isDiesel = variantName.includes('Diesel');
    const isTurbo = variantName.includes('Turbo');
    const isAT = variantName.includes('AT');
    const isAMT = variantName.includes('AMT');

    if (isDiesel) {
        return isAMT ? 'Diesel AMT' : 'Diesel MT';
    }

    if (isTurbo) {
        return isAT ? 'Petrol Turbo AT' : 'Petrol Turbo MT';
    }

    // Regular Petrol (TCMPFi)
    return isAT ? 'Petrol NA AT' : 'Petrol NA MT';
}

const XUV_3XO_VARIANTS = [
    // Petrol NA
    { name: 'XUV 3XO MX1 Petrol MT', price: 728000 },
    { name: 'XUV 3XO REVX M Petrol MT', price: 815000 },
    { name: 'XUV 3XO REVX M (O) Petrol MT', price: 861000 },
    { name: 'XUV 3XO MX2 Pro Petrol MT', price: 869000 },
    { name: 'XUV 3XO MX3 Petrol MT', price: 888000 },
    { name: 'XUV 3XO MX3 Pro Petrol MT', price: 911000 },
    { name: 'XUV 3XO MX2 Pro Petrol AT', price: 961000 },
    { name: 'XUV 3XO AX5 Petrol MT', price: 1000000 },
    { name: 'XUV 3XO MX3 Petrol AT', price: 1039000 },
    { name: 'XUV 3XO MX3 Pro Petrol AT', price: 1066000 },
    // Petrol Turbo
    { name: 'XUV 3XO REVX A Turbo Petrol MT', price: 1075000 },
    { name: 'XUV 3XO AX5 Petrol AT', price: 1139000 },
    { name: 'XUV 3XO AX5 L Turbo Petrol MT', price: 1150000 },
    { name: 'XUV 3XO AX7 Turbo Petrol MT', price: 1166000 },
    { name: 'XUV 3XO REVX A Turbo Petrol AT', price: 1184000 },
    { name: 'XUV 3XO AX5 L Turbo Petrol AT', price: 1271000 },
    { name: 'XUV 3XO AX7 L Turbo Petrol MT', price: 1275000 },
    { name: 'XUV 3XO AX7 Turbo Petrol AT', price: 1275000 },
    { name: 'XUV 3XO AX7 L Turbo Petrol AT', price: 1440000 },
    // Diesel
    { name: 'XUV 3XO MX2 Diesel MT', price: 894000 },
    { name: 'XUV 3XO MX2 Pro Diesel MT', price: 952000 },
    { name: 'XUV 3XO MX3 Diesel MT', price: 985000 },
    { name: 'XUV 3XO MX3 Pro Diesel MT', price: 1036000 },
    { name: 'XUV 3XO MX3 Diesel AMT', price: 1071000 },
    { name: 'XUV 3XO AX5 Diesel MT', price: 1092000 },
    { name: 'XUV 3XO AX5 Diesel AMT', price: 1164000 },
    { name: 'XUV 3XO AX7 Diesel MT', price: 1244000 },
    { name: 'XUV 3XO AX7 Diesel AMT', price: 1317000 },
    { name: 'XUV 3XO AX7 L Diesel MT', price: 1343000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Try multiple name patterns
    let model = await Model.findOne({ name: { $regex: /3XO/i } }).lean();
    if (!model) {
        model = await Model.findOne({ name: { $regex: /XUV3XO/i } }).lean();
    }
    if (!model) {
        model = await Model.findOne({ name: { $regex: /XUV 3XO/i } }).lean();
    }
    if (!model) {
        console.error('❌ Mahindra XUV 3XO model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MAHINDRA XUV 3XO VARIANTS UPDATE ===\n');
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
    console.log('-'.repeat(80));
    for (const v of XUV_3XO_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(80));
    console.log(`Total: ${XUV_3XO_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = XUV_3XO_VARIANTS[18]; // AX7 L Turbo AT
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
        for (const variant of XUV_3XO_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/\(o\)/g, 'opt');
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
        console.log(`\n🎉 Mahindra XUV 3XO now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
