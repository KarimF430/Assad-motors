/**
 * Update Mahindra Thar (3-Door) Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 14
 * Highlights: D117 Diesel (119 Bhp), mHawk Diesel (132 Bhp), mStallion Petrol (152 Bhp)
 * Note: AXT = D117 Diesel only, LX/LXT = mHawk Diesel or mStallion Petrol
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Image 3
// D117 CRDe (AXT): 1497cc, 87.2 kW (119 Bhp), 300 Nm
// mHawk 130 CRDe (LXT): 2184cc, 97 kW (132 Bhp), 300 Nm
// mStallion 150 TGDi (LXT Petrol): 1997cc, 112 kW (152 Bhp), 300/320 Nm
const ENGINES = {
    'D117 Diesel MT RWD': {
        engineName: '1.5l D117 CRDe Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '1497',
        engineCapacity: '1497 cc',
        power: '119 Bhp',
        maxPower: '119 Bhp',
        enginePower: '119 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1750-2500 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: false,
        fuelTankCapacity: '45 Litres'
    },
    'mHawk Diesel MT RWD': {
        engineName: '2.2l mHawk 130 CRDe Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '132 Bhp',
        maxPower: '132 Bhp',
        enginePower: '132 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1600-2800 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: false,
        fuelTankCapacity: '57 Litres'
    },
    'mHawk Diesel AT RWD': {
        engineName: '2.2l mHawk 130 CRDe Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '132 Bhp',
        maxPower: '132 Bhp',
        enginePower: '132 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1600-2800 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Automatic',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: false,
        fuelTankCapacity: '57 Litres'
    },
    'mHawk Diesel MT 4WD': {
        engineName: '2.2l mHawk 130 CRDe Diesel 4x4',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '132 Bhp',
        maxPower: '132 Bhp',
        enginePower: '132 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1600-2800 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: '4WD',
        driveTrain: 'Part-Time 4WD with High & Low Reduction',
        isHybrid: false,
        fuelTankCapacity: '57 Litres'
    },
    'mHawk Diesel AT 4WD': {
        engineName: '2.2l mHawk 130 CRDe Diesel 4x4',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '132 Bhp',
        maxPower: '132 Bhp',
        enginePower: '132 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1600-2800 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Automatic',
        driveType: '4WD',
        driveTrain: 'Part-Time 4WD with High & Low Reduction',
        isHybrid: false,
        fuelTankCapacity: '57 Litres'
    },
    'Petrol MT RWD': {
        engineName: '2.0l mStallion 150 TGDi Petrol',
        engineType: '4 Cylinder, Turbo GDI',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '152 Bhp',
        maxPower: '152 Bhp',
        enginePower: '152 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1250-3000 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: false,
        fuelTankCapacity: '57 Litres'
    },
    'Petrol AT RWD': {
        engineName: '2.0l mStallion 150 TGDi Petrol',
        engineType: '4 Cylinder, Turbo GDI',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '152 Bhp',
        maxPower: '152 Bhp',
        enginePower: '152 PS',
        torque: '320 Nm',
        engineTorque: '320 Nm @ 1500-3000 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: false,
        fuelTankCapacity: '57 Litres'
    },
    'Petrol MT 4WD': {
        engineName: '2.0l mStallion 150 TGDi Petrol 4x4',
        engineType: '4 Cylinder, Turbo GDI',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '152 Bhp',
        maxPower: '152 Bhp',
        enginePower: '152 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1250-3000 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: '4WD',
        driveTrain: 'Part-Time 4WD with High & Low Reduction',
        isHybrid: false,
        fuelTankCapacity: '57 Litres'
    },
    'Petrol AT 4WD': {
        engineName: '2.0l mStallion 150 TGDi Petrol 4x4',
        engineType: '4 Cylinder, Turbo GDI',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '152 Bhp',
        maxPower: '152 Bhp',
        enginePower: '152 PS',
        torque: '320 Nm',
        engineTorque: '320 Nm @ 1500-3000 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: '4WD',
        driveTrain: 'Part-Time 4WD with High & Low Reduction',
        isHybrid: false,
        fuelTankCapacity: '57 Litres'
    }
};

const MILEAGE_DATA = {
    'D117 Diesel MT RWD': {
        mileageEngineName: '1.5l D117 Diesel MT',
        mileageCompanyClaimed: '15.2 kmpl',
        mileageCityRealWorld: '12 kmpl',
        mileageHighwayRealWorld: '14 kmpl',
        mileageCity: '12',
        mileageHighway: '14',
        engineSummary: 'Efficient 1.5L diesel for accessible off-road adventure.'
    },
    'mHawk Diesel MT RWD': {
        mileageEngineName: '2.2l mHawk Diesel MT RWD',
        mileageCompanyClaimed: '15.0 kmpl',
        mileageCityRealWorld: '11 kmpl',
        mileageHighwayRealWorld: '14 kmpl',
        mileageCity: '11',
        mileageHighway: '14',
        engineSummary: 'Powerful mHawk diesel with strong low-end torque.'
    },
    'mHawk Diesel AT RWD': {
        mileageEngineName: '2.2l mHawk Diesel AT RWD',
        mileageCompanyClaimed: '14.5 kmpl',
        mileageCityRealWorld: '10 kmpl',
        mileageHighwayRealWorld: '13 kmpl',
        mileageCity: '10',
        mileageHighway: '13',
        engineSummary: 'Automatic convenience with legendary mHawk performance.'
    },
    'mHawk Diesel MT 4WD': {
        mileageEngineName: '2.2l mHawk Diesel MT 4WD',
        mileageCompanyClaimed: '14.0 kmpl',
        mileageCityRealWorld: '10 kmpl',
        mileageHighwayRealWorld: '13 kmpl',
        mileageCity: '10',
        mileageHighway: '13',
        engineSummary: 'True 4x4 capability with manual shift-on-fly.'
    },
    'mHawk Diesel AT 4WD': {
        mileageEngineName: '2.2l mHawk Diesel AT 4WD',
        mileageCompanyClaimed: '13.5 kmpl',
        mileageCityRealWorld: '9 kmpl',
        mileageHighwayRealWorld: '12 kmpl',
        mileageCity: '9',
        mileageHighway: '12',
        engineSummary: 'Ultimate off-road with automatic convenience.'
    },
    'Petrol MT RWD': {
        mileageEngineName: '2.0l Petrol MT RWD',
        mileageCompanyClaimed: '13.0 kmpl',
        mileageCityRealWorld: '9 kmpl',
        mileageHighwayRealWorld: '12 kmpl',
        mileageCity: '9',
        mileageHighway: '12',
        engineSummary: 'Revvy 152 Bhp petrol for spirited driving.'
    },
    'Petrol AT RWD': {
        mileageEngineName: '2.0l Petrol AT RWD',
        mileageCompanyClaimed: '12.5 kmpl',
        mileageCityRealWorld: '8 kmpl',
        mileageHighwayRealWorld: '11 kmpl',
        mileageCity: '8',
        mileageHighway: '11',
        engineSummary: 'Smooth automatic with peppy turbo performance.'
    },
    'Petrol MT 4WD': {
        mileageEngineName: '2.0l Petrol MT 4WD',
        mileageCompanyClaimed: '12.0 kmpl',
        mileageCityRealWorld: '8 kmpl',
        mileageHighwayRealWorld: '11 kmpl',
        mileageCity: '8',
        mileageHighway: '11',
        engineSummary: 'Full 4x4 with petrol power and manual control.'
    },
    'Petrol AT 4WD': {
        mileageEngineName: '2.0l Petrol AT 4WD',
        mileageCompanyClaimed: '11.5 kmpl',
        mileageCityRealWorld: '7 kmpl',
        mileageHighwayRealWorld: '10 kmpl',
        mileageCity: '7',
        mileageHighway: '10',
        engineSummary: 'Top-spec petrol 4x4 automatic for adventure seekers.'
    }
};

// Common Specs from Image 4
const COMMON_SPECS = {
    length: '3985',
    width: '1820',
    height: '1855',
    wheelbase: '2450',
    groundClearance: '226',
    bootSpace: 'N/A', // Open/convertible
    seatingCapacity: '4',
    doors: '3',

    // Off-road specs
    approachAngle: '41.2 Degrees',
    departureAngle: '36 Degrees',
    rampBreakoverAngle: '26.2 Degrees',
    waterWadingDepth: '650 mm',

    // Suspension & Brakes
    frontSuspension: 'Independent Double Wishbone with Coil Over Damper & Stabiliser Bar',
    rearSuspension: 'Multilink Solid Rear Axle with Coil Over Damper & Stabiliser Bar',
    frontBrake: '303 mm Disc',
    rearBrake: '282 mm Drum',
    steeringType: 'Rack & Pinion Hydraulic Power Steering',

    // Standard Safety
    airbags: '2',
    airbagsLocation: 'Driver, Passenger',
    abs: 'Yes',
    ebd: 'Yes',
    esp: 'Yes (with Roll-over Mitigation)',
    hillHoldAssist: 'Yes',
    hillDescentControl: 'Yes',
    seatbeltWarning: 'Yes',
    isofix: 'Yes',
    rollCage: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isAXT = variantName.includes('AXT');
    const isAXOpt = variantName.includes('AX Opt');
    const isLX = variantName.includes('LX') && !variantName.includes('LXT');
    const isLXT = variantName.includes('LXT');

    const is4WD = variantName.includes('4WD');
    const isAT = variantName.includes('AT');
    const isHardTop = variantName.includes('Hard Top');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';

    let keyFeaturesArr: string[] = [];
    let summary = `The Thar ${variantName} `;

    // Drive Type
    features.driveType = is4WD ? '4WD' : 'RWD';
    features.driveTrain = is4WD ? 'Part-Time 4WD with High & Low Reduction' : 'Rear Wheel Drive';

    // Roof Type
    features.roofType = isHardTop ? 'Hard Top' : 'Soft Top Convertible';

    // ======= AXT BASE FEATURES =======
    features.headLights = 'Round (Classic)';
    features.ledTailLamps = 'Yes';
    features.alloyWheels = 'No (R16 Steel)';
    features.tyreSize = '245/75 R16';
    features.cluster = 'Monochrome MID';
    features.seatUpholstery = 'Vinyl';
    features.touchScreenInfotainment = 'No';
    features.orvm = 'Manual';
    features.sideFootSteps = 'Tubular Steel';
    features.washableFloor = 'Yes (with Drain Plugs)';
    features.towHooks = 'Welded Front & Rear';
    features.brakeLockingDifferential = 'Yes (Electronic)';

    keyFeaturesArr.push('Dual Airbags', 'ESP', 'Hill Descent Control', 'Washable Floor');

    if (isAXT || isAXOpt) {
        features.tiltSteering = 'Yes';
        features.hvac = 'Yes';
        features.centralLocking = 'Yes';
        features.keylessEntry = 'Yes';
        features.rearACVents = 'Yes';
        keyFeaturesArr.push('HVAC', 'Keyless Entry');
    }

    // ======= LX Hard Top Adds =======
    if (isLX || isLXT) {
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm HD Touchscreen';
        features.androidAuto = 'Wired + Wireless';
        features.appleCarPlay = 'Wired';
        features.speakers = '4 Speakers + 2 Tweeters';
        features.adventureStatistics = 'Yes (Gen II)';
        features.tpms = 'Yes';
        features.tyreDirectionMonitoring = 'Yes';
        features.followMeHomeHeadlamps = 'Yes';
        features.oneTouchLaneChange = 'Yes';
        features.rearParkingSensors = 'Yes';
        features.orvm = 'Electric';
        features.reverseCamera = 'Yes';
        keyFeaturesArr.push('10.25" Touchscreen', 'Android Auto', 'Rear Camera');
    }

    // ======= LXT Adds =======
    if (isLXT) {
        features.alloyWheels = '18 inch Deep Silver Alloy (Thar Branding)';
        features.tyreSize = '255/65 R18';
        features.seatUpholstery = 'Fabric';
        features.cluster = 'Coloured MID';
        features.dualToneBumpers = 'Yes';
        features.frontFogLamps = 'Yes';
        features.radioAntenna = 'Fender-mounted';
        features.tailgateMountedSpareWheel = 'Yes';
        features.sideFootSteps = 'Moulded';
        features.cruiseControl = 'Yes';
        features.steeringMountedControls = 'Audio + Phone';
        features.rearWiper = 'Yes';
        keyFeaturesArr.push('R18 Alloys', 'Cruise Control', 'Fog Lamps');
    }

    // 4WD Features
    if (is4WD) {
        features.electricDrivelineDisconnect = 'Yes';
        features.advancedBrakeLockingDifferential = 'Yes (Electronic)';
        features.mechanicalLockingDifferential = 'Yes';
        features.hubLock = 'Automatic';
        keyFeaturesArr.push('4x4 with Low Range', 'Mechanical Locking Diff');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isAXT) {
        summary += 'offers essential off-road capability at an accessible price.';
    } else if (isAXOpt) {
        summary += 'adds hard top protection with basic features.';
    } else if (isLX) {
        summary += 'brings connected features and adventure statistics.';
    } else if (isLXT) {
        summary += 'is the fully-loaded variant with alloy wheels and premium features.';
    }

    features.headerSummary = summary;
    features.description = summary + ' The iconic Thar - built for adventure.';

    return features;
}

function getEngineKey(variantName: string): string {
    const isPetrol = variantName.includes('Petrol');
    const is4WD = variantName.includes('4WD');
    const isAT = variantName.includes('AT');
    const isAXT = variantName.includes('AXT') || variantName.includes('AX Opt');

    // AXT variants use D117 diesel only
    if (isAXT) {
        return 'D117 Diesel MT RWD';
    }

    if (isPetrol) {
        if (is4WD) return isAT ? 'Petrol AT 4WD' : 'Petrol MT 4WD';
        return isAT ? 'Petrol AT RWD' : 'Petrol MT RWD';
    }

    // mHawk Diesel (LX/LXT)
    if (is4WD) return isAT ? 'mHawk Diesel AT 4WD' : 'mHawk Diesel MT 4WD';
    return isAT ? 'mHawk Diesel AT RWD' : 'mHawk Diesel MT RWD';
}

const THAR_VARIANTS = [
    // Diesel
    { name: 'Thar AXT RWD Diesel MT', price: 999000 },
    { name: 'Thar AX Opt Hard Top RWD Diesel MT', price: 1032000 },
    { name: 'Thar LX Hard Top RWD Diesel MT', price: 1181000 },
    { name: 'Thar LXT RWD Diesel MT', price: 1219000 },
    { name: 'Thar LX Hard Top 4WD Diesel MT', price: 1520000 },
    { name: 'Thar LX Hard Top 4WD Diesel AT', price: 1661000 },
    { name: 'Thar LXT 4WD Diesel AT', price: 1691000 },
    { name: 'Thar LXT 4WD Diesel MT', price: 1698000 },
    // Petrol
    { name: 'Thar LX Hard Top RWD Petrol AT', price: 1361000 },
    { name: 'Thar LXT RWD Petrol AT', price: 1399000 },
    { name: 'Thar LX Hard Top 4WD Petrol MT', price: 1433000 },
    { name: 'Thar LXT 4WD Petrol MT', price: 1469000 },
    { name: 'Thar LX Hard Top 4WD Petrol AT', price: 1584000 },
    { name: 'Thar LXT 4WD Petrol AT', price: 1625000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Use exact ID
    const model = await Model.findOne({ id: 'model-brand-mahindra-thar' }).lean();
    if (!model) {
        console.error('❌ Mahindra Thar model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MAHINDRA THAR VARIANTS UPDATE ===\n');
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
    for (const v of THAR_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(80));
    console.log(`Total: ${THAR_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = THAR_VARIANTS[13]; // LXT 4WD Petrol AT
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
        for (const variant of THAR_VARIANTS) {
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
        console.log(`\n🎉 Mahindra Thar now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
