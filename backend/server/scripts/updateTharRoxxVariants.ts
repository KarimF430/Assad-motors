/**
 * Update Mahindra Thar Roxx Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 18
 * Highlights: 2.0L Turbo Petrol, 2.2L mHawk Diesel, RWD & 4WD, Level 2 ADAS
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Image 5
// Petrol MT: 119 kW @ 5000 rpm -> ~161 Bhp
// Petrol AT: 130 kW @ 5000 rpm -> ~177 Bhp
// Diesel MT: 111.9 kW @ 3750 rpm -> ~152 Bhp
// Diesel AT: 128.6 kW @ 3500 rpm -> ~175 Bhp
const ENGINES = {
    'Petrol MT': {
        engineName: '2.0l Turbo Petrol mStallion',
        engineType: '4 Cylinder, Turbo GDI',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '161 Bhp',
        maxPower: '161 Bhp',
        enginePower: '162 PS',
        torque: '330 Nm',
        engineTorque: '330 Nm @ 1500-3000 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        isHybrid: false,
        turboCharger: 'eWGT - Electric Wastegate Turbo'
    },
    'Petrol AT': {
        engineName: '2.0l Turbo Petrol mStallion',
        engineType: '4 Cylinder, Turbo GDI',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '177 Bhp',
        maxPower: '177 Bhp',
        enginePower: '180 PS',
        torque: '380 Nm',
        engineTorque: '380 Nm @ 1750-3000 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        isHybrid: false,
        turboCharger: 'eWGT - Electric Wastegate Turbo'
    },
    'Diesel MT RWD': {
        engineName: '2.2l mHawk Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '152 Bhp',
        maxPower: '152 Bhp',
        enginePower: '152 PS',
        torque: '330 Nm',
        engineTorque: '330 Nm @ 1500-3000 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        isHybrid: false,
        turboCharger: 'eVGT - Electric Variable Geometry Turbo'
    },
    'Diesel AT RWD': {
        engineName: '2.2l mHawk Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '175 Bhp',
        maxPower: '175 Bhp',
        enginePower: '175 PS',
        torque: '400 Nm',
        engineTorque: '400 Nm @ 1750-2750 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Automatic',
        isHybrid: false,
        turboCharger: 'eVGT - Electric Variable Geometry Turbo'
    },
    'Diesel MT 4WD': {
        engineName: '2.2l mHawk Diesel 4x4',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '152 Bhp',
        maxPower: '152 Bhp',
        enginePower: '152 PS',
        torque: '330 Nm',
        engineTorque: '330 Nm @ 1500-3000 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        isHybrid: false,
        turboCharger: 'eVGT - Electric Variable Geometry Turbo'
    },
    'Diesel AT 4WD': {
        engineName: '2.2l mHawk Diesel 4x4',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '175 Bhp',
        maxPower: '175 Bhp',
        enginePower: '175 PS',
        torque: '400 Nm',
        engineTorque: '400 Nm @ 1750-2750 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Automatic',
        isHybrid: false,
        turboCharger: 'eVGT - Electric Variable Geometry Turbo'
    }
};

const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '2.0l Turbo Petrol MT',
        mileageCompanyClaimed: '15.0 kmpl',
        mileageCityRealWorld: '10 kmpl',
        mileageHighwayRealWorld: '14 kmpl',
        mileageCity: '10',
        mileageHighway: '14',
        engineSummary: 'Powerful 2.0L Turbo Petrol delivering 161 Bhp for thrilling off-road adventures.'
    },
    'Petrol AT': {
        mileageEngineName: '2.0l Turbo Petrol AT',
        mileageCompanyClaimed: '14.5 kmpl',
        mileageCityRealWorld: '9 kmpl',
        mileageHighwayRealWorld: '13 kmpl',
        mileageCity: '9',
        mileageHighway: '13',
        engineSummary: 'The 177 Bhp AT variant offers effortless power delivery with refined shifts.'
    },
    'Diesel MT RWD': {
        mileageEngineName: '2.2l mHawk Diesel MT RWD',
        mileageCompanyClaimed: '15.8 kmpl',
        mileageCityRealWorld: '12 kmpl',
        mileageHighwayRealWorld: '15 kmpl',
        mileageCity: '12',
        mileageHighway: '15',
        engineSummary: 'Legendary mHawk diesel delivering excellent torque for highway cruising.'
    },
    'Diesel AT RWD': {
        mileageEngineName: '2.2l mHawk Diesel AT RWD',
        mileageCompanyClaimed: '15.2 kmpl',
        mileageCityRealWorld: '11 kmpl',
        mileageHighwayRealWorld: '14 kmpl',
        mileageCity: '11',
        mileageHighway: '14',
        engineSummary: 'Top-spec 175 Bhp diesel AT for effortless performance and refinement.'
    },
    'Diesel MT 4WD': {
        mileageEngineName: '2.2l mHawk Diesel MT 4WD',
        mileageCompanyClaimed: '14.5 kmpl',
        mileageCityRealWorld: '10 kmpl',
        mileageHighwayRealWorld: '13 kmpl',
        mileageCity: '10',
        mileageHighway: '13',
        engineSummary: 'Adventure-ready 4x4 with manual control for serious off-roaders.'
    },
    'Diesel AT 4WD': {
        mileageEngineName: '2.2l mHawk Diesel AT 4WD',
        mileageCompanyClaimed: '14.0 kmpl',
        mileageCityRealWorld: '9 kmpl',
        mileageHighwayRealWorld: '12 kmpl',
        mileageCity: '9',
        mileageHighway: '12',
        engineSummary: 'Ultimate off-road capability with automatic convenience and full 4x4 system.'
    }
};

// Common Specs from Image 5
const COMMON_SPECS = {
    length: '4428',
    width: '1870',
    height: '1923',
    wheelbase: '2850',
    groundClearance: '226', // Typical for Roxx
    bootSpace: '600 Litres', // 5-door
    fuelTankCapacity: '57 Litres',
    seatingCapacity: '5',
    doors: '5',

    // Off-road specs
    approachAngle: '41.7 Degrees',
    departureAngle: '36.1 Degrees',
    rampBreakoverAngle: '23.9 Degrees',
    waterWadingDepth: '650 mm',

    // Suspension & Brakes
    frontSuspension: 'Double Wishbone with Coil Spring, FDD & MTV-CL',
    rearSuspension: 'Rigid Axle with WATT\'s Linkage, FDD, HRS & MTV-CL',
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Disc / Drum', // AT gets rear disc
    steeringType: 'Electric Power Steering with Tilt',

    // Safety Standard
    airbags: '6', // Standard across range
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    abs: 'Yes',
    ebd: 'Yes',
    esp: 'Yes',
    tpms: 'Yes', // AX3L onwards
    tcs: 'Yes',
    hillHoldAssist: 'Yes',
    hillDescentControl: 'Yes',
    rollOverMitigation: 'Yes',
    brakeLockingDifferential: 'Yes',
    isofix: 'Yes',
    seatbeltWarning: 'Yes',
    engineImmobilizer: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isMX1 = variantName.includes('MX1');
    const isMX3 = variantName.includes('MX3');
    const isAX3L = variantName.includes('AX3L');
    const isMX5 = variantName.includes('MX5');
    const isAX5L = variantName.includes('AX5L');
    const isAX7L = variantName.includes('AX7L');

    const is4WD = variantName.includes('4WD');
    const isAT = variantName.includes('AT');
    const isDiesel = variantName.includes('Diesel');
    const isPetrol = variantName.includes('Petrol');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';

    // Key Features
    let keyFeaturesArr = ['6 Airbags', 'ESP', 'LED Headlamps'];
    let summary = `The Thar Roxx ${variantName} `;

    // Drive Type
    features.driveType = is4WD ? '4WD' : 'RWD';
    features.driveTrain = is4WD ? 'Manual Part-Time 4x4 with ELD' : 'Rear Wheel Drive';

    // Common
    features.headLights = 'LED Projector';
    features.ledDRL = 'Yes';
    features.ledTailLamps = 'Yes';
    features.alloyWheels = 'No (Steel R18)';
    features.tyreSize = '255/65 R18';

    // M.GLYDE Platform is standard
    features.platform = 'M.GLYDE';

    if (isMX1) {
        keyFeaturesArr.push('Power Windows', 'Push Button Start', 'Halogen Fog Lamps');
        features.touchScreenInfotainment = 'No';
        features.rearCamera = 'No';
        features.climateControl = 'Manual AC';
        features.airConditioning = 'Manual';
        features.pushButtonStart = 'Yes';
        features.rearDefogger = 'Yes';
        features.alloyWheels = 'No (Steel R18)';
        summary += 'is the rugged entry-point with essential off-road capability.';
    } else if (isMX3) {
        keyFeaturesArr.push('10.25" Touchscreen', 'Rear Camera', 'Wireless Android Auto');
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm Touchscreen';
        features.rearCamera = 'Yes';
        features.climateControl = 'Manual AC';
        features.airConditioning = 'Manual';
        features.alloyWheels = 'No (Steel R18)';
        features.speakers = '4 Speakers';
        summary += 'adds connectivity with a large touchscreen and rear camera.';
    } else if (isAX3L) {
        keyFeaturesArr.push('Sunroof', 'Leatherette Upholstery', 'Auto Headlamps');
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm HD Touchscreen';
        features.rearCamera = 'Yes';
        features.sunroof = 'Single Pane';
        features.leatherSeats = 'Yes (Leatherette)';
        features.autoHeadlamps = 'Yes';
        features.climateControl = 'Manual AC';
        features.alloyWheels = 'No (Steel R18)';
        features.speakers = '4 Speakers';
        summary += 'brings premium comfort with a sunroof and leather upholstery.';
    } else if (isMX5) {
        keyFeaturesArr.push('Diamond Cut Alloys', 'Rear AC Vents', 'Front Parking Sensors');
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm HD Touchscreen';
        features.rearCamera = 'Yes';
        features.alloyWheels = '18 inch Diamond Cut Alloy';
        features.rearACVents = 'Yes';
        features.frontParkingSensors = 'Yes';
        features.rearParkingSensors = 'Yes';
        features.cruiseControl = 'Yes';
        features.climateControl = 'Manual AC'; // HVAC only on AX5L+
        summary += 'upgrades style with alloys and practical comfort features.';
    } else if (isAX5L) {
        keyFeaturesArr.push('ADAS Level 2', 'Panoramic Sunroof', 'Ventilated Seats', 'Auto AC');
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm HD Touchscreen';
        features.alloyWheels = '18 inch Diamond Cut Alloy';
        features.sunroof = 'Panoramic (Skyroof)';
        features.ventilatedSeats = 'Front';
        features.climateControl = 'Automatic';
        features.airConditioning = 'Automatic (HVAC)';
        features.rearACVents = 'Yes';
        features.frontParkingSensors = 'Yes';
        features.rearParkingSensors = 'Yes';
        features.cruiseControl = 'Adaptive (ACC)';
        features.adas = 'Level 2';
        features.aeb = 'Yes';
        features.ldw = 'Yes';
        features.lka = 'Yes';
        features.fcw = 'Yes';
        features.cooledGlovebox = 'Yes';
        summary += 'is feature-loaded with ADAS, panoramic sunroof, and ventilated seats.';
    } else if (isAX7L) {
        keyFeaturesArr.push('19" Alloys', 'Harman Kardon Audio', 'Powered Seats', 'Full ADAS');
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm HD Digital Cluster';
        features.digitalCluster = 'Yes (26.03 cm)';
        features.alloyWheels = '19 inch Diamond Cut Alloy';
        features.tyreSize = '255/60 R19';
        features.sunroof = 'Panoramic (Skyroof)';
        features.ventilatedSeats = 'Front';
        features.poweredDriverSeat = '6-Way';
        features.harmanKardon = 'Yes';
        features.speakers = '6 Speakers + 2 Tweeters + Subwoofer';
        features.climateControl = 'Automatic';
        features.airConditioning = 'Automatic (HVAC)';
        features.rearACVents = 'Yes';
        features.frontParkingSensors = 'Yes';
        features.rearParkingSensors = 'Yes';
        features.cruiseControl = 'Adaptive (ACC)';
        features.adas = 'Level 2 Full';
        features.aeb = 'Yes';
        features.ldw = 'Yes';
        features.lka = 'Yes';
        features.fcw = 'Yes';
        features.hba = 'Yes'; // High Beam Assist
        features.tsr = 'Yes'; // Traffic Sign Recognition
        features.spa = 'Yes'; // Smart Pilot Assist
        features.surround360Camera = 'Yes';
        features.blindSpotMonitor = 'Yes';
        features.cooledGlovebox = 'Yes';
        features.leatherWrappedSteering = 'Yes (Premium)';
        summary += 'is the ultimate flagship with Harman Kardon audio, 19" alloys, and comprehensive ADAS.';
    }

    if (is4WD) {
        keyFeaturesArr.push('4x4 with ELD', '4XPLOR Terrain Modes');
        features.drivingModes = 'Snow, Sand, Mud';
        features.crawlSmart = isAT ? 'Yes' : 'No';
        features.intelliTurn = isAT ? 'Yes' : 'No';
        features.electricLockingDifferential = 'Yes';
    }

    if (isAT) {
        features.rearBrake = 'Disc'; // AT gets rear disc
        features.paddleShifters = 'No'; // Thar doesn't have paddles
    } else {
        features.rearBrake = 'Drum';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` Built on the legendary M.GLYDE platform with ${is4WD ? 'full 4x4 capability' : 'efficient RWD'}.`;

    return features;
}

function getEngineKey(variantName: string): string {
    const is4WD = variantName.includes('4WD');
    const isAT = variantName.includes('AT');
    const isDiesel = variantName.includes('Diesel');

    if (isDiesel) {
        if (is4WD) return isAT ? 'Diesel AT 4WD' : 'Diesel MT 4WD';
        return isAT ? 'Diesel AT RWD' : 'Diesel MT RWD';
    }
    // Petrol
    return isAT ? 'Petrol AT' : 'Petrol MT';
}

const THAR_ROXX_VARIANTS = [
    // Petrol
    { name: 'Thar Roxx MX1 RWD Petrol MT', price: 1225000 },
    { name: 'Thar Roxx MX3 RWD Petrol AT', price: 1442000 },
    { name: 'Thar Roxx MX5 RWD Petrol MT', price: 1575000 },
    { name: 'Thar Roxx MX5 RWD Petrol AT', price: 1716000 },
    { name: 'Thar Roxx AX7L RWD Petrol AT', price: 1951000 },
    // Diesel RWD
    { name: 'Thar Roxx MX1 RWD Diesel MT', price: 1348000 },
    { name: 'Thar Roxx MX3 RWD Diesel MT', price: 1536000 },
    { name: 'Thar Roxx AX3L RWD Diesel MT', price: 1631000 },
    { name: 'Thar Roxx MX5 RWD Diesel MT', price: 1631000 },
    { name: 'Thar Roxx MX3 RWD Diesel AT', price: 1678000 },
    { name: 'Thar Roxx MX5 RWD Diesel AT', price: 1772000 },
    { name: 'Thar Roxx AX5L RWD Diesel AT', price: 1819000 },
    { name: 'Thar Roxx AX7L RWD Diesel MT', price: 1867000 },
    { name: 'Thar Roxx AX7L RWD Diesel AT', price: 2000000 },
    // Diesel 4WD
    { name: 'Thar Roxx MX5 4WD Diesel MT', price: 1829000 },
    { name: 'Thar Roxx AX5L 4WD Diesel AT', price: 2017000 },
    { name: 'Thar Roxx AX7L 4WD Diesel MT', price: 2065000 },
    { name: 'Thar Roxx AX7L 4WD Diesel AT', price: 2206000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Thar Roxx/i } }).lean();
    if (!model) {
        console.error('❌ Mahindra Thar Roxx model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MAHINDRA THAR ROXX VARIANTS UPDATE ===\n');
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
    for (const v of THAR_ROXX_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(80));
    console.log(`Total: ${THAR_ROXX_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = THAR_ROXX_VARIANTS[17]; // AX7L 4WD AT
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
        for (const variant of THAR_ROXX_VARIANTS) {
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
        console.log(`\n🎉 Mahindra Thar Roxx now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
