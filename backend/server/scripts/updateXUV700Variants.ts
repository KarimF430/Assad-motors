/**
 * Update Mahindra XUV700 Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 45
 * Highlights: 2.0L Petrol (200 PS), 2.2L Diesel (155/185 PS), ADAS, AWD
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Image 3
const ENGINES = {
    'Petrol MT': {
        engineName: '2.0l mStallion TGDi Turbo Petrol',
        engineType: 'Turbo Petrol with Direct Injection (TGDi)',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '197 Bhp',
        maxPower: '197 Bhp',
        enginePower: '147 kW @ 5000 rpm',
        torque: '380 Nm',
        engineTorque: '380 Nm @ 1750-3000 rpm',
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
    'Petrol AT': {
        engineName: '2.0l mStallion TGDi Turbo Petrol',
        engineType: 'Turbo Petrol with Direct Injection (TGDi)',
        displacement: '1997',
        engineCapacity: '1997 cc',
        power: '197 Bhp',
        maxPower: '197 Bhp',
        enginePower: '147 kW @ 5000 rpm',
        torque: '380 Nm',
        engineTorque: '380 Nm @ 1750-3000 rpm',
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
        engineName: '2.2l mHawk Turbo Diesel',
        engineType: 'Turbo Diesel with CRDe',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '153 Bhp',
        maxPower: '153 Bhp',
        enginePower: '114 kW @ 3750 rpm',
        torque: '360 Nm',
        engineTorque: '360 Nm @ 1500-2800 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Micro Hybrid'
    },
    'Diesel AT': {
        engineName: '2.2l mHawk Turbo Diesel',
        engineType: 'Turbo Diesel with CRDe',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '182 Bhp',
        maxPower: '182 Bhp',
        enginePower: '136 kW @ 3500 rpm',
        torque: '420 Nm',
        engineTorque: '420 Nm @ 1600-2800 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Micro Hybrid'
    },
    'Diesel AWD AT': {
        engineName: '2.2l mHawk Turbo Diesel AWD',
        engineType: 'Turbo Diesel with CRDe',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '182 Bhp',
        maxPower: '182 Bhp',
        enginePower: '136 kW @ 3500 rpm',
        torque: '450 Nm',
        engineTorque: '450 Nm @ 1750-2800 rpm',
        engineTransmission: '6-Speed Torque Converter Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Automatic',
        driveType: 'AWD',
        driveTrain: 'All Wheel Drive',
        isHybrid: true,
        hybridType: 'Micro Hybrid'
    }
};

const MILEAGE_DATA = {
    'Petrol MT': { mileageEngineName: '2.0l Petrol MT', mileageCompanyClaimed: '13.0 kmpl', mileageCity: '9', mileageHighway: '12', engineSummary: 'Powerful 200 PS turbo petrol for spirited driving.' },
    'Petrol AT': { mileageEngineName: '2.0l Petrol AT', mileageCompanyClaimed: '12.5 kmpl', mileageCity: '8', mileageHighway: '11', engineSummary: 'Smooth automatic with 200 PS for effortless cruising.' },
    'Diesel MT': { mileageEngineName: '2.2l Diesel MT', mileageCompanyClaimed: '16.0 kmpl', mileageCity: '12', mileageHighway: '15', engineSummary: 'Efficient 155 PS diesel with excellent torque.' },
    'Diesel AT': { mileageEngineName: '2.2l Diesel AT', mileageCompanyClaimed: '14.5 kmpl', mileageCity: '10', mileageHighway: '13', engineSummary: 'Refined 185 PS diesel auto with commanding torque.' },
    'Diesel AWD AT': { mileageEngineName: '2.2l Diesel AWD AT', mileageCompanyClaimed: '13.5 kmpl', mileageCity: '9', mileageHighway: '12', engineSummary: 'Ultimate 185 PS AWD for all-terrain capability.' }
};

const COMMON_SPECS = {
    length: '4695', width: '1890', height: '1755', wheelbase: '2750', groundClearance: '200',
    bootSpace: 'Flexible (3rd Row 50:50)', fuelTankCapacity: '60 Litres', doors: '5',
    frontSuspension: 'McPherson Strut Independent with FSD and Stabilizer Bar',
    rearSuspension: 'Multi-link Independent with FSD and Stabilizer Bar',
    frontBrake: 'Ventilated Disc', rearBrake: 'Solid Disc',
    tyreSize: '235/65 R17', // Default, upgraded on higher trims
};

function getVariantFeatures(variantName: string) {
    const isMX = variantName.includes('MX') && !variantName.includes('AX');
    const isMXE = variantName.includes('MX E');
    const isAX5S = variantName.includes('AX5 S');
    const isAX5 = variantName.includes('AX5') && !variantName.includes('AX5 S');
    const isAX7 = variantName.includes('AX7') && !variantName.includes('AX7L');
    const isAX7L = variantName.includes('AX7L');
    const isEbony = variantName.includes('Ebony');
    const is6Str = variantName.includes('6 Str') || variantName.includes('6Str');
    const isAWD = variantName.includes('AWD');

    let features: Record<string, any> = {};
    features.warranty = '3 Years / Unlimited Km';
    features.seatingCapacity = is6Str ? '6' : '7';
    features.seatingConfig = is6Str ? 'Captain Seats (2+2+2)' : 'Bench (2+3+2)';

    if (isEbony) { features.ebonyEdition = 'Yes'; features.specialEdition = 'Ebony Edition'; }
    if (isAWD) { features.driveType = 'AWD'; features.driveTrain = 'All Wheel Drive'; }

    let keyFeaturesArr: string[] = [];
    let summary = `The XUV700 ${variantName} `;

    // ======= MX BASE =======
    features.touchScreenInfotainment = '8 inch';
    features.cluster = '7 inch (17.78 cm)';
    features.androidAuto = 'Wired';
    features.smartDoorHandles = 'Yes';
    features.usbCharging = 'Yes (1st + C-Type 2nd Row)';
    features.airDam = 'Yes'; features.tiltSteering = 'Yes';
    features.speedSensingDoorLock = 'Yes';
    features.centreArmrest = 'Yes (with Storage)';
    features.bottleHolder = 'All Doors';
    features.adjustableHeadrest = 'Yes (All 4 Window Seats)';
    features.followMeHome = 'Yes'; features.speakers = '4 Speakers';
    features.roofLamp = 'Yes (1st + 2nd Row)';
    features.microHybrid = 'Yes'; features.isofix = 'Yes';
    features.electricORVM = 'Yes'; features.ledTailLamps = 'Arrow-Head';
    features.wheelCovers = 'Full-sized';
    features.rearACVents = 'Yes (3rd Row)';
    features.armrest2ndRow = 'Yes (with Cup Holder)';
    features.splitRear2ndRow = '60:40 One-Touch Tumble';
    features.bootSpace = 'Flexible (3rd Row 50:50 Split with Recline)';
    keyFeaturesArr.push('8" Infotainment', 'Smart Door Handles', 'Micro Hybrid');

    // ======= AX5 S ADDS =======
    if (isAX5S || isAX5 || isAX7 || isAX7L) {
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm HD Dual Screens';
        features.cluster = '10.25 inch (26.03 cm) Digital';
        features.skyroof = 'Yes';
        features.pushButtonStart = 'Yes';
        features.navigation = 'Yes';
        features.alexa = 'Yes (Built-in)';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wireless';
        features.adrenoxConnect = 'Yes (1 Year Free)';
        features.speakers = '6 Speakers with Sound Staging';
        features.personalizedSafetyAlerts = 'Yes';
        features.ledDRL = 'Yes';
        features.mapLamps2ndRow = 'Yes';
        keyFeaturesArr.push('Skyroof', '10.25" Dual Screens', 'Adrenox Connect');
    }

    // ======= AX5 ADDS =======
    if (isAX5 || isAX7 || isAX7L) {
        features.alloyWheels = 'R17 Diamond Cut';
        features.tyreSize = '235/65 R17 Diamond Cut';
        features.ledClearViewHeadlamps = 'Yes';
        features.esp = 'Yes (Latest Gen)';
        features.driveModes = 'Yes';
        features.curtainAirbags = 'Yes (All Rows)';
        features.sequentialTurnIndicatorsFront = 'Yes';
        features.corneringLamp = 'Yes';
        features.reverseCamera = 'Yes';
        features.cruiseControl = 'Yes';
        features.fogLamps = 'Yes';
        keyFeaturesArr.push('R17 Alloys', 'LED Headlamps', 'Curtain Airbags');
    }

    // ======= AX7 ADDS =======
    if (isAX7 || isAX7L) {
        features.adas = 'Level 2';
        features.sideAirbags = 'Yes';
        features.tpms = 'Yes';
        features.alloyWheels = 'R18 Diamond Cut';
        features.tyreSize = '235/60 R18 Diamond Cut';
        features.leatheretteSeats = 'Yes (with IP)';
        features.leatherSteeringGear = 'Yes';
        features.poweredDriverSeat = '6-Way (with Memory + Welcome Retract)';
        features.intelliControl = 'Yes';
        features.autoHeadlamps = 'Yes (with Auto Booster)';
        features.rainSensingWipers = 'Yes';
        features.smartCleanZone = 'Yes';
        features.driverDrowsinessDetection = 'Yes';
        features.steeringMountedClusterControl = 'Yes';
        features.powerfoldORVM = 'Yes';
        features.oneTouchDriverWindow = 'Yes (Smart Close)';
        features.dualZoneAC = 'Yes';
        features.coDriverErgoLever = 'Yes';
        keyFeaturesArr.push('ADAS Level 2', 'R18 Alloys', '6-Way Power Seat');
    }

    // ======= AX7L (Luxury Pack) ADDS =======
    if (isAX7L) {
        features.blindViewMonitor = 'Yes';
        features.dvr = 'Yes (Continuous Digital Recording)';
        features.sonyAudio = 'Yes (3D Audio with 12 Speakers)';
        features.camera360 = 'Yes (Surround View)';
        features.kneeAirbag = 'Yes';
        features.passiveKeylessEntry = 'Yes';
        features.electronicParkingBrake = 'Yes';
        features.adaptiveCruiseControl = 'Yes (Stop & Go - AT)';
        features.telescopicSteering = 'Yes';
        features.vanityMirrorIllumination = 'Yes';
        features.electricSmartDoorHandles = 'Yes';
        features.wirelessCharger = 'Yes';
        features.sequentialTurnIndicatorsRear = 'Yes';
        features.ventilatedSeats = 'Yes';
        features.memoryORVM = 'Yes';
        keyFeaturesArr.push('12 Speaker Sony Audio', '360 Camera', 'Ventilated Seats', 'EPB');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isMX) summary += 'offers essential features with smart tech at accessible pricing.';
    else if (isAX5S) summary += 'brings Skyroof and dual screens for immersive experience.';
    else if (isAX5) summary += 'adds LED lighting and alloys for premium styling.';
    else if (isAX7 && !isAX7L) summary += 'delivers ADAS Level 2 and premium interiors.';
    else if (isAX7L) summary += 'is the flagship with 12-speaker Sony audio and luxury features.';

    features.headerSummary = summary;
    features.description = summary + ' The segment-defining SUV.';
    return features;
}

function getEngineKey(variantName: string): string {
    const isPetrol = variantName.includes('Petrol');
    const isAT = variantName.includes('AT');
    const isAWD = variantName.includes('AWD');

    if (isPetrol) return isAT ? 'Petrol AT' : 'Petrol MT';
    if (isAWD) return 'Diesel AWD AT';
    return isAT ? 'Diesel AT' : 'Diesel MT';
}

const XUV700_VARIANTS = [
    // Diesel
    { name: 'XUV700 MX 7Str Diesel MT', price: 1413000 },
    { name: 'XUV700 MX E 7Str Diesel MT', price: 1460000 },
    { name: 'XUV700 AX5 S 7 Str Diesel MT', price: 1672000 },
    { name: 'XUV700 AX5 7 Str Diesel MT', price: 1795000 },
    { name: 'XUV700 AX5 S 7 Str Diesel AT', price: 1814000 },
    { name: 'XUV700 AX7 7Str Diesel MT', price: 1884000 },
    { name: 'XUV700 AX7 Ebony Edition 7Str Diesel MT', price: 1898000 },
    { name: 'XUV700 AX7 6 Str Diesel MT', price: 1903000 },
    { name: 'XUV700 AX7 Ebony Edition 6Str Diesel MT', price: 1917000 },
    { name: 'XUV700 AX5 7 Str Diesel AT', price: 1946000 },
    { name: 'XUV700 AX7 7Str Diesel AT', price: 2045000 },
    { name: 'XUV700 AX7 6 Str Diesel AT', price: 2064000 },
    { name: 'XUV700 AX7 Ebony Edition 6Str Diesel AT', price: 2078000 },
    { name: 'XUV700 AX7L 7Str Diesel MT', price: 2097000 },
    { name: 'XUV700 AX7L Ebony Edition 7Str Diesel MT', price: 2111000 },
    { name: 'XUV700 AX7L 6Str Diesel MT', price: 2120000 },
    { name: 'XUV700 AX7L Ebony Edition 6Str Diesel MT', price: 2134000 },
    { name: 'XUV700 AX7 7Str AWD Diesel AT', price: 2158000 },
    { name: 'XUV700 AX7 Ebony Edition 7Str AWD Diesel AT', price: 2172000 },
    { name: 'XUV700 AX7L 7Str Diesel AT', price: 2262000 },
    { name: 'XUV700 AX7L Ebony Edition 7Str Diesel AT', price: 2276000 },
    { name: 'XUV700 AX7L 6Str Diesel AT', price: 2280000 },
    { name: 'XUV700 AX7L Ebony Edition 6Str Diesel AT', price: 2295000 },
    { name: 'XUV700 AX7L 7Str AWD Diesel AT', price: 2357000 },
    { name: 'XUV700 AX7L Ebony Edition 7Str AWD Diesel AT', price: 2371000 },
    // Petrol
    { name: 'XUV700 MX 7Str Petrol MT', price: 1366000 },
    { name: 'XUV700 MX E 7Str Petrol MT', price: 1366000 },
    { name: 'XUV700 AX5 S 7 Str Petrol MT', price: 1592000 },
    { name: 'XUV700 AX5 S E 7Str Petrol MT', price: 1639000 },
    { name: 'XUV700 AX5 7 Str Petrol MT', price: 1729000 },
    { name: 'XUV700 AX5 S 7 Str Petrol AT', price: 1757000 },
    { name: 'XUV700 AX5 E 7 Str Petrol MT', price: 1776000 },
    { name: 'XUV700 AX7 7Str Petrol MT', price: 1837000 },
    { name: 'XUV700 AX7 Ebony Edition 7Str Petrol MT', price: 1851000 },
    { name: 'XUV700 AX7 6 Str Petrol MT', price: 1855000 },
    { name: 'XUV700 AX7 Ebony Edition 6Str Petrol MT', price: 1870000 },
    { name: 'XUV700 AX5 7 Str Petrol AT', price: 1880000 },
    { name: 'XUV700 AX7 7Str Petrol AT', price: 1979000 },
    { name: 'XUV700 AX7 Ebony Edition 7Str Petrol AT', price: 1993000 },
    { name: 'XUV700 AX7 6Str Petrol AT', price: 1998000 },
    { name: 'XUV700 AX7 Ebony Edition 6Str Petrol AT', price: 2012000 },
    { name: 'XUV700 AX7L 7Str Petrol AT', price: 2186000 },
    { name: 'XUV700 AX7L Ebony Edition 7Str Petrol AT', price: 2200000 },
    { name: 'XUV700 AX7L 6Str Petrol AT', price: 2205000 },
    { name: 'XUV700 AX7L Ebony Edition 6Str Petrol AT', price: 2219000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    let model = await Model.findOne({ id: 'model-brand-mahindra-xuv700' }).lean();
    if (!model) { model = await Model.findOne({ name: { $regex: /XUV700/i } }).lean(); }
    if (!model) { console.error('❌ Mahindra XUV700 model not found!'); await mongoose.disconnect(); process.exit(1); }

    console.log('=== MAHINDRA XUV700 VARIANTS UPDATE ===\n');
    console.log(`Model ID: ${model.id}\nBrand ID: ${model.brandId}\n`);

    if (!isDryRun) {
        const del = await Variant.deleteMany({ modelId: model.id });
        console.log(`🗑️  Deleted ${del.deletedCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(85));
    for (const v of XUV700_VARIANTS) {
        console.log(`${v.name.padEnd(50)} | ₹${(v.price / 100000).toFixed(2)}L | ${getEngineKey(v.name)}`);
    }
    console.log('-'.repeat(85));
    console.log(`Total: ${XUV700_VARIANTS.length} variants\n`);

    if (!isDryRun) {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of XUV700_VARIANTS) {
            const sanitized = variant.name.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            const variantId = `variant-${model.brandId}-${model.id}-${sanitized}`;
            const ek = getEngineKey(variant.name);
            const doc = {
                id: variantId, name: variant.name, brandId: model.brandId, modelId: model.id, price: variant.price, status: 'active',
                ...COMMON_SPECS, ...ENGINES[ek as keyof typeof ENGINES], ...MILEAGE_DATA[ek as keyof typeof MILEAGE_DATA], ...getVariantFeatures(variant.name),
            };
            await Variant.create(doc);
            console.log(`✅ Added: ${variant.name}`);
        }
        console.log(`\n🎉 Mahindra XUV700 now has ${await Variant.countDocuments({ modelId: model.id })} variants`);
    } else { console.log('🔍 DRY RUN - No data inserted'); }
    await mongoose.disconnect();
}
run().catch(console.error);
