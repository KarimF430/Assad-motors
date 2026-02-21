/**
 * Update Mahindra Scorpio N Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 43
 * Highlights: 2.0L Turbo Petrol, 2.2L Diesel (132/175 Bhp), 4WD, Carbon Edition, ADAS
 * Note: Z2/Z4 Diesel get 132 Bhp, Z6+ get 175 Bhp
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Image 3
// Petrol: 2.0L TGDi, 149.14 kW (203 Bhp), 370 Nm MT / 380 Nm AT
// Diesel Low (Z2, Z4): 97 kW (132 Bhp), 300 Nm
// Diesel High (Z6+): 128.6 kW (175 Bhp), 370 Nm MT / 400 Nm AT
const ENGINES = {
    'Petrol MT': {
        engineName: '2.0l mStallion TGDi Turbo Petrol',
        engineType: '4 Cylinder, Turbo GDI',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '203 Bhp',
        maxPower: '203 Bhp',
        enginePower: '203 PS',
        torque: '370 Nm',
        engineTorque: '370 Nm @ 1750-3000 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: false
    },
    'Petrol AT': {
        engineName: '2.0l mStallion TGDi Turbo Petrol',
        engineType: '4 Cylinder, Turbo GDI',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '203 Bhp',
        maxPower: '203 Bhp',
        enginePower: '203 PS',
        torque: '380 Nm',
        engineTorque: '380 Nm @ 1750-3000 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: false
    },
    'Diesel Low MT': { // Z2, Z4
        engineName: '2.2l mHawk Diesel',
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
        isHybrid: false
    },
    'Diesel High MT': { // Z6+
        engineName: '2.2l mHawk Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '175 Bhp',
        maxPower: '175 Bhp',
        enginePower: '175 PS',
        torque: '370 Nm',
        engineTorque: '370 Nm @ 1500-3000 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: false
    },
    'Diesel High AT': { // Z6+ AT
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
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: false
    },
    'Diesel 4WD MT': {
        engineName: '2.2l mHawk Diesel 4x4',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '175 Bhp',
        maxPower: '175 Bhp',
        enginePower: '175 PS',
        torque: '370 Nm',
        engineTorque: '370 Nm @ 1500-3000 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: '4WD',
        driveTrain: 'Shift-on-Fly 4WD',
        isHybrid: false
    },
    'Diesel 4WD AT': {
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
        driveType: '4WD',
        driveTrain: 'Shift-on-Fly 4WD',
        isHybrid: false
    }
};

const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '2.0l Turbo Petrol MT',
        mileageCompanyClaimed: '13.2 kmpl',
        mileageCityRealWorld: '9 kmpl',
        mileageHighwayRealWorld: '12 kmpl',
        mileageCity: '9',
        mileageHighway: '12',
        engineSummary: 'Powerful 203 Bhp turbo petrol for thrilling performance.'
    },
    'Petrol AT': {
        mileageEngineName: '2.0l Turbo Petrol AT',
        mileageCompanyClaimed: '12.5 kmpl',
        mileageCityRealWorld: '8 kmpl',
        mileageHighwayRealWorld: '11 kmpl',
        mileageCity: '8',
        mileageHighway: '11',
        engineSummary: 'Smooth automatic with 380 Nm for effortless driving.'
    },
    'Diesel Low MT': {
        mileageEngineName: '2.2l Diesel MT (132 Bhp)',
        mileageCompanyClaimed: '16.1 kmpl',
        mileageCityRealWorld: '12 kmpl',
        mileageHighwayRealWorld: '15 kmpl',
        mileageCity: '12',
        mileageHighway: '15',
        engineSummary: 'Efficient 132 Bhp diesel for everyday practicality.'
    },
    'Diesel High MT': {
        mileageEngineName: '2.2l Diesel MT (175 Bhp)',
        mileageCompanyClaimed: '15.0 kmpl',
        mileageCityRealWorld: '11 kmpl',
        mileageHighwayRealWorld: '14 kmpl',
        mileageCity: '11',
        mileageHighway: '14',
        engineSummary: 'Powerful 175 Bhp mHawk diesel with excellent torque.'
    },
    'Diesel High AT': {
        mileageEngineName: '2.2l Diesel AT (175 Bhp)',
        mileageCompanyClaimed: '14.5 kmpl',
        mileageCityRealWorld: '10 kmpl',
        mileageHighwayRealWorld: '13 kmpl',
        mileageCity: '10',
        mileageHighway: '13',
        engineSummary: 'Refined automatic with 400 Nm for commanding presence.'
    },
    'Diesel 4WD MT': {
        mileageEngineName: '2.2l Diesel 4WD MT',
        mileageCompanyClaimed: '14.0 kmpl',
        mileageCityRealWorld: '10 kmpl',
        mileageHighwayRealWorld: '13 kmpl',
        mileageCity: '10',
        mileageHighway: '13',
        engineSummary: 'Adventure-ready 4x4 with shift-on-fly capability.'
    },
    'Diesel 4WD AT': {
        mileageEngineName: '2.2l Diesel 4WD AT',
        mileageCompanyClaimed: '13.5 kmpl',
        mileageCityRealWorld: '9 kmpl',
        mileageHighwayRealWorld: '12 kmpl',
        mileageCity: '9',
        mileageHighway: '12',
        engineSummary: 'Ultimate off-road capability with automatic convenience.'
    }
};

// Common Specs from Image 3
const COMMON_SPECS = {
    length: '4662',
    width: '1917',
    height: '1857',
    wheelbase: '2750',
    groundClearance: '210',
    bootSpace: '460 Litres', // 3rd row folded
    fuelTankCapacity: '57 Litres',
    seatingCapacity: '7', // Default 7, some have 6
    doors: '5',

    // Suspension & Brakes
    frontSuspension: 'Double Wishbone with Coil over Shocks, FDD & MTV-CL',
    rearSuspension: 'Pentalink with WATT\'s Linkage, FDD & MTV-CL',
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Ventilated Disc',

    // Standard Safety
    abs: 'Yes',
    ebd: 'Yes',
    esp: 'Yes',
    hillHoldAssist: 'Yes',
    hillDescentControl: 'Yes',
    seatbeltWarning: 'Yes (All Seats)',
    isofix: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isZ2 = variantName.includes('Z2');
    const isZ4 = variantName.includes('Z4');
    const isZ6 = variantName.includes('Z6');
    const isZ8 = variantName.includes('Z8') && !variantName.includes('Z8S') && !variantName.includes('Z8T') && !variantName.includes('Z8L');
    const isZ8S = variantName.includes('Z8 Select') || variantName.includes('Z8S');
    const isZ8T = variantName.includes('Z8T');
    const isZ8L = variantName.includes('Z8L');

    const is4WD = variantName.includes('4x4') || variantName.includes('4WD');
    const isAT = variantName.includes('AT');
    const isCarbonEdition = variantName.includes('Carbon');
    const is6Str = variantName.includes('6 Str');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';

    let keyFeaturesArr: string[] = [];
    let summary = `The Scorpio N ${variantName} `;

    // Seating
    features.seatingCapacity = is6Str ? '6' : '7';

    // Carbon Edition Styling
    if (isCarbonEdition) {
        features.carbonEdition = 'Yes';
        features.specialEdition = 'Carbon Edition';
        keyFeaturesArr.push('Carbon Edition Styling');
    }

    // Drive Type
    features.driveType = is4WD ? '4WD' : 'RWD';
    features.driveTrain = is4WD ? 'Shift-on-Fly 4WD' : 'Rear Wheel Drive';

    // ======= Z2 BASE FEATURES =======
    features.airbags = '2'; // Front only
    features.airbagsLocation = 'Driver, Passenger';
    features.headLights = 'Dual Barrel MFR';
    features.ledTailLamps = 'Yes (Tall Stacked)';
    features.ledTurnIndicator = 'Yes (ORVM)';
    features.alloyWheels = 'No (R17 Steel)';
    features.tyreSize = '245/65 R17';
    features.cluster = '10.66 cm Monochrome';
    features.powerWindows = 'Yes';
    features.touchScreenInfotainment = 'No';
    features.rearParkingSensors = 'Yes';
    features.rearACVents = 'Yes (Vent)';
    features.frontGrille = 'MIC Black';
    features.skidPlates = 'Yes';
    features.steeringType = 'Electric (Petrol) / Hydraulic (Diesel)';

    keyFeaturesArr.push('Dual Front Airbags', 'ESP', 'Hill Hold');

    // ======= Z4 ADDS =======
    if (!isZ2) {
        features.touchScreenInfotainment = '10.66 cm Monochrome';
        features.androidAuto = 'Wired';
        features.appleCarPlay = 'Wired';
        features.steeringMountedControls = 'Audio + Cruise';
        features.cruiseControl = 'Yes';
        features.usbCharging = 'Yes (65W 2nd row)';
        features.rearACVents = 'Vent & Module';
        features.frontGrille = 'Silver';
        features.skiRack = 'Yes (Black Finish)';
        features.wheelCover = 'Yes';
        keyFeaturesArr.push('Touchscreen', 'Android Auto');
    }

    // ======= Z6 ADDS =======
    if (isZ6 || isZ8S || isZ8 || isZ8T || isZ8L) {
        features.skiRack = 'Yes (Silver Finish)';
        features.steeringType = 'Electric';
        keyFeaturesArr.push('Electric Power Steering');
    }

    // ======= Z8 Select (Z8S) ADDS =======
    if (isZ8S || isZ8 || isZ8T || isZ8L) {
        features.airbags = '6';
        features.airbagsLocation = 'Front, Side & Curtain';
        features.cluster = '17.78 cm Colour TFT';
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.32 cm Touchscreen';
        features.androidAuto = 'Wired + Wireless';
        features.appleCarPlay = 'Wired + Wireless';
        features.adrenoxConnect = 'Yes (1 Year Subscription)';
        features.headLights = 'Dual Barrel LED Projector';
        features.ledDRL = 'Yes (Sting Like)';
        features.alloyWheels = '17 inch Diamond Cut Alloy';
        features.frontGrille = 'Chrome';
        features.reverseCamera = 'Yes';
        keyFeaturesArr.push('6 Airbags', 'LED Projector Headlamps', 'Diamond Cut Alloys');
    }

    // ======= Z8 ADDS =======
    if (isZ8 || isZ8T || isZ8L) {
        features.adrenoxConnect = 'Yes (2 Years Subscription)';
        features.leatherSeats = 'Yes (Rich Coffee Black Leatherette)';
        features.leatherSteeringGearKnob = 'Yes';
        features.pushButtonStart = 'Yes';
        features.frequencyDependentDamping = 'Yes (FDD + MTV-CL)';
        keyFeaturesArr.push('Leatherette Interiors', 'Push Button Start');
    }

    // ======= Z8T ADDS =======
    if (isZ8T || isZ8L) {
        features.sunroof = 'No'; // Z8T still no sunroof
        features.frontParkingSensors = 'Yes';
        features.ventilatedSeats = 'Driver & Co-Driver';
        features.seatHeightAdjust = 'Yes (with Lumbar)';
        features.poweredDriverSeat = '6-Way';
        features.autoHeadlamps = 'Yes';
        features.autoWiper = 'Yes';
        features.rearWiper = 'Yes';
        features.orvm = 'Electric with Power Fold';
        features.roofLamp = 'Front + Rear';
        // ADAS (AT variants)
        if (isAT) {
            features.adas = 'Level 2';
            features.fcw = 'Yes';
            features.aeb = 'Yes';
            features.acc = 'Yes (Stop & Go)';
            features.spa = 'Yes (Smart Pilot)';
            features.ldw = 'Yes';
            features.lka = 'Yes';
            features.tsr = 'Yes';
            features.hba = 'Yes';
            keyFeaturesArr.push('ADAS Level 2');
        }
        keyFeaturesArr.push('Ventilated Seats', 'Powered Driver Seat');
    }

    // ======= Z8L ADDS (Flagship) =======
    if (isZ8L) {
        features.sunroof = 'No'; // Still no sunroof, but top features
        features.sonyAudio = 'Yes (12 Speakers + Dual Subwoofer)';
        features.dolbyAtmos = 'Yes';
        features.alloyWheels = '18 inch Diamond Cut Alloy';
        features.tyreSize = '255/60 R18';
        features.autoDimmingIRVM = 'Yes';
        features.driverDrowsinessDetection = 'Yes';
        features.ecallSOS = 'Yes';
        features.electronicParkingBrake = 'Yes';
        features.tpms = 'Yes';
        keyFeaturesArr.push('Sony 3D Audio', 'R18 Alloys', 'EPB');
    }

    // 4WD Features
    if (is4WD) {
        features.terrainModes = '4XPLOR (Normal, Snow, Mud, Ruts, Sand)';
        features.brakeLockingDifferential = 'Yes (Electronic)';
        keyFeaturesArr.push('4XPLOR Terrain Modes', '4x4 System');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isZ2) {
        summary += 'offers rugged SUV capability with essential safety features.';
    } else if (isZ4) {
        summary += 'adds connectivity and cruise control for comfortable journeys.';
    } else if (isZ6) {
        summary += 'brings refined electric steering and enhanced comfort.';
    } else if (isZ8S) {
        summary += 'delivers premium LED lighting and 6 airbags for enhanced safety.';
    } else if (isZ8) {
        summary += 'offers luxurious leatherette interiors and connected features.';
    } else if (isZ8T) {
        summary += 'brings ventilated seats and ADAS for a premium experience.';
    } else if (isZ8L) {
        summary += 'is the flagship with Sony 3D audio and comprehensive safety suite.';
    }

    features.headerSummary = summary;
    features.description = summary + ' Built on body-on-frame architecture for true SUV capability.';

    return features;
}

function getEngineKey(variantName: string): string {
    const isPetrol = variantName.includes('Petrol');
    const is4WD = variantName.includes('4x4') || variantName.includes('4WD');
    const isAT = variantName.includes('AT');
    const isZ2 = variantName.includes('Z2');
    const isZ4 = variantName.includes('Z4');

    if (isPetrol) {
        return isAT ? 'Petrol AT' : 'Petrol MT';
    }

    // Diesel
    if (is4WD) {
        return isAT ? 'Diesel 4WD AT' : 'Diesel 4WD MT';
    }

    // Z2 and Z4 get lower power diesel
    if (isZ2 || isZ4) {
        return 'Diesel Low MT'; // Z2/Z4 only available in MT
    }

    return isAT ? 'Diesel High AT' : 'Diesel High MT';
}

const SCORPIO_N_VARIANTS = [
    // Diesel 2WD
    { name: 'Scorpio N Z2 Diesel MT', price: 1367000 },
    { name: 'Scorpio N Z4 Diesel MT', price: 1530000 },
    { name: 'Scorpio N Z6 Diesel MT', price: 1628000 },
    { name: 'Scorpio N Z4 Diesel AT', price: 1685000 },
    { name: 'Scorpio N Z8 Select Diesel MT', price: 1751000 },
    { name: 'Scorpio N Z6 Diesel AT', price: 1784000 },
    { name: 'Scorpio N Z8 Select Diesel AT', price: 1846000 },
    { name: 'Scorpio N Z8 Diesel MT', price: 1855000 },
    { name: 'Scorpio N Z8T Diesel MT', price: 1952000 },
    { name: 'Scorpio N Z8 Carbon Edition Diesel MT', price: 1971000 },
    { name: 'Scorpio N Z8 Diesel AT', price: 2000000 },
    { name: 'Scorpio N Z8L Diesel MT', price: 2052000 },
    { name: 'Scorpio N Z8L Carbon Edition Diesel MT', price: 2071000 },
    { name: 'Scorpio N Z8L 6 Str Diesel MT', price: 2087000 },
    { name: 'Scorpio N Z8T Diesel AT', price: 2093000 },
    { name: 'Scorpio N Z8 Carbon Edition Diesel AT', price: 2112000 },
    { name: 'Scorpio N Z8L Diesel AT', price: 2193000 },
    { name: 'Scorpio N Z8L Carbon Edition Diesel AT', price: 2212000 },
    { name: 'Scorpio N Z8L 6 Str Diesel AT', price: 2215000 },
    // Diesel 4WD
    { name: 'Scorpio N Z4 Diesel 4x4 MT', price: 1730000 },
    { name: 'Scorpio N Z8T Diesel 4x4 MT', price: 2151000 },
    { name: 'Scorpio N Z8 Carbon Edition Diesel 4x4 MT', price: 2170000 },
    { name: 'Scorpio N Z8L Diesel 4x4 MT', price: 2251000 },
    { name: 'Scorpio N Z8L Carbon Edition Diesel 4x4 MT', price: 2270000 },
    { name: 'Scorpio N Z8T Diesel 4x4 AT', price: 2299000 },
    { name: 'Scorpio N Z8 Carbon Edition Diesel 4x4 AT', price: 2317000 },
    { name: 'Scorpio N Z8L Diesel 4x4 AT', price: 2399000 },
    { name: 'Scorpio N Z8L Carbon Edition Diesel 4x4 AT', price: 2417000 },
    // Petrol
    { name: 'Scorpio N Z2 Petrol MT', price: 1320000 },
    { name: 'Scorpio N Z4 Petrol MT', price: 1488000 },
    { name: 'Scorpio N Z4 Petrol AT', price: 1641000 },
    { name: 'Scorpio N Z8 Select Petrol MT', price: 1659000 },
    { name: 'Scorpio N Z8 Select Petrol AT', price: 1798000 },
    { name: 'Scorpio N Z8T Petrol MT', price: 1914000 },
    { name: 'Scorpio N Z8 Carbon Edition Petrol MT', price: 1932000 },
    { name: 'Scorpio N Z8L Petrol MT', price: 2000000 },
    { name: 'Scorpio N Z8L Carbon Edition Petrol MT', price: 2032000 },
    { name: 'Scorpio N Z8L 6 Str Petrol MT', price: 2038000 },
    { name: 'Scorpio N Z8T Petrol AT', price: 2049000 },
    { name: 'Scorpio N Z8 Carbon Edition Petrol AT', price: 2067000 },
    { name: 'Scorpio N Z8L Petrol AT', price: 2149000 },
    { name: 'Scorpio N Z8L 6 Str Petrol AT', price: 2166000 },
    { name: 'Scorpio N Z8L Carbon Edition Petrol AT', price: 2167000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ id: 'model-brand-mahindra-scorpio-n' }).lean();
    if (!model) {
        console.error('❌ Mahindra Scorpio N model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MAHINDRA SCORPIO N VARIANTS UPDATE ===\n');
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
    console.log('-'.repeat(85));
    for (const v of SCORPIO_N_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(50)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(85));
    console.log(`Total: ${SCORPIO_N_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = SCORPIO_N_VARIANTS[27]; // Z8L Carbon 4x4 AT
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
        for (const variant of SCORPIO_N_VARIANTS) {
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
        console.log(`\n🎉 Mahindra Scorpio N now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
