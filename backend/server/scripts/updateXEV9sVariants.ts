/**
 * Update Mahindra XEV 9s Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 12
 * Highlights: Born Electric Platform, 59/70/79 kWh, 7-Seater SUV
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Powertrain from Image 3
const POWERTRAINS = {
    '59 kWh': {
        engineName: 'Permanent Magnet Synchronous Motor',
        engineType: 'Electric Motor',
        displacement: 'N/A', engineCapacity: 'N/A',
        power: '228 Bhp', maxPower: '228 Bhp', enginePower: '170 kW',
        torque: '380 Nm', engineTorque: '380 Nm (Instant)',
        engineTransmission: 'Single Speed Automatic',
        noOfGears: '1', fuelType: 'Electric', fuel: 'Electric',
        transmission: 'Automatic', driveType: 'RWD', driveTrain: 'Rear Wheel Drive',
        isElectric: true,
        batteryCapacity: '59 kWh',
        batteryType: 'Blade Battery (BYD)',
        range: '533 km (MIDC P1+P2)',
        regenLevels: 'L0, L1, L2, L3 & Auto',
        singlePedalDrive: 'Yes',
        driveModes: 'Default, Everyday, Race, Snow',
    },
    '70 kWh': {
        engineName: 'Permanent Magnet Synchronous Motor',
        engineType: 'Electric Motor',
        displacement: 'N/A', engineCapacity: 'N/A',
        power: '228 Bhp', maxPower: '228 Bhp', enginePower: '170 kW',
        torque: '380 Nm', engineTorque: '380 Nm (Instant)',
        engineTransmission: 'Single Speed Automatic',
        noOfGears: '1', fuelType: 'Electric', fuel: 'Electric',
        transmission: 'Automatic', driveType: 'RWD', driveTrain: 'Rear Wheel Drive',
        isElectric: true,
        batteryCapacity: '70 kWh',
        batteryType: 'Blade Battery (BYD)',
        range: '591 km (MIDC P1+P2)',
        regenLevels: 'L0, L1, L2, L3 & Auto',
        singlePedalDrive: 'Yes',
        driveModes: 'Default, Everyday, Race, Snow',
    },
    '79 kWh': {
        engineName: 'Permanent Magnet Synchronous Motor',
        engineType: 'Electric Motor',
        displacement: 'N/A', engineCapacity: 'N/A',
        power: '282 Bhp', maxPower: '282 Bhp', enginePower: '210 kW',
        torque: '380 Nm', engineTorque: '380 Nm (Instant)',
        engineTransmission: 'Single Speed Automatic',
        noOfGears: '1', fuelType: 'Electric', fuel: 'Electric',
        transmission: 'Automatic', driveType: 'RWD', driveTrain: 'Rear Wheel Drive',
        isElectric: true,
        batteryCapacity: '79 kWh',
        batteryType: 'Blade Battery (BYD)',
        range: '656 km (MIDC P1+P2)',
        regenLevels: 'L0, L1, L2, L3 & Auto',
        singlePedalDrive: 'Yes',
        driveModes: 'Default, Everyday, Race, Snow',
    }
};

const RANGE_DATA = {
    '59 kWh': { mileageEngineName: '59 kWh Battery', mileageCompanyClaimed: '533 km', engineSummary: '170 kW motor with 533 km range for 7-seater family.' },
    '70 kWh': { mileageEngineName: '70 kWh Battery', mileageCompanyClaimed: '591 km', engineSummary: '170 kW motor with 591 km extended range.' },
    '79 kWh': { mileageEngineName: '79 kWh Battery', mileageCompanyClaimed: '656 km', engineSummary: '210 kW motor with 656 km flagship range.' }
};

// Common Specs from Image 3
const COMMON_SPECS = {
    length: '5078', width: '1902', height: '1902', wheelbase: '3105',
    groundClearance: '218', groundClearanceNote: '182 at battery',
    turningCircle: '10',
    bootSpace: '591 Litres (VDA)', bootSpaceWithSeats: '194 Litres (with 3rd row)',
    frunkVolume: '100 Litres',
    seatingCapacity: '7', doors: '5',
    steeringType: 'Electric Power Steering with Variable Gear Ratio',
    frontSuspension: 'McPherson Strut, H-link Independent with Stabilizer Bar',
    rearSuspension: 'Multi-link (5-link) Independent with Stabilizer Bar',
    frontBrake: 'Disc', rearBrake: 'Disc',
    chargerConnection: 'CCS2',
    acPortableCharger: '13A (up to 3.0 kW)',
    acWallChargerOptions: '7.2 kW & 11.2 kW',
    hvBatteryWarranty: 'Lifetime Warranty',
    vehicleWarranty: '3 Years / Unlimited km',
    spareWheel: 'T165/90 R18',
};

function getVariantFeatures(variantName: string) {
    const isPackOneAbove = variantName.includes('Pack One Above');
    const isPackTwoAbove = variantName.includes('Pack Two Above');
    const isPackThree = variantName.includes('Pack Three') && !variantName.includes('Above');
    const isPackThreeAbove = variantName.includes('Pack Three Above');
    const is112kw = variantName.includes('11.2kw');

    let features: Record<string, any> = {};
    features.warranty = '3 Years / Unlimited Km + Lifetime Battery';

    // Charger
    if (is112kw) { features.acWallCharger = '11.2 kW'; }
    else { features.acWallCharger = '7.2 kW (Optional 11.2 kW)'; }

    // Tyres
    if (isPackOneAbove) { features.tyreSize = '235/60 R18 (Styled Wheel)'; features.alloyWheels = 'R18 Styled'; }
    else { features.tyreSize = '235/55 R18 Alloy'; features.alloyWheels = 'R18 Alloy'; }

    // Suspension
    if (isPackOneAbove || isPackTwoAbove) features.suspensionDamper = 'Passive with FDD & MTV-CL tech';
    else features.suspensionDamper = 'Intelligent Adaptive (Skyhook & MTV-CL)';

    let keyFeaturesArr: string[] = [];
    let summary = `The XEV 9s ${variantName} `;

    // ======= Pack One Above BASE =======
    features.biLedProjectorHeadlamps = 'Yes';
    features.ledDRL = 'L as Position Lamp';
    features.illuminatedLogo = 'Yes (Front & Rear)';
    features.centreSignatureLamp = 'Yes';
    features.ledTailLamp = 'Yes';
    features.sequentialTurnIndicators = 'Yes';
    features.startupAnimation = 'Yes';
    features.nightTrail = 'Yes';
    features.infinityRoof = 'Yes (Opaque Panoramic Sunroof, 61.2 cm x 39)';
    features.lightMelody = 'Yes (Ambient Lights)';
    features.capTouchSwitches = 'Dashboard & Door';
    features.softWrappedDashboard = 'Yes';
    features.seatUpholstery = 'Leatherette (e-Shifter)';
    features.rearSpoiler = 'Yes';
    features.electricallyRetractableDoorHandles = 'Yes';
    features.orvmTurnIndicators = 'Yes';
    features.frunkWithDrainHole = 'Yes';
    features.panoramicFlushRoofCladding = 'Yes';
    features.cruiseControl = 'Standard';
    features.driveModes = 'Default, Everyday, Race, Snow';
    features.performanceDashboard = 'Yes';
    features.audioSystem = 'Standard with 8 Speakers & Sound Staging';
    features.sonicSuite = 'Yes';
    features.connectedCar = 'Yes (MeHUB App)';
    features.wirelessAndroidAutoCarPlay = 'Yes';
    features.alexa = 'Yes';
    features.chatGPT = 'Yes';
    features.superfast5G = 'Yes';
    features.funWork = 'Yes (OTT, Social Media, News, Shopping)';
    features.otaUpdates = 'Yes (Infotainment, Maps, Vehicle, Powertrain)';
    features.chargingLimiter = 'Yes';
    features.scheduledCharging = 'Yes';
    features.ecoScore = 'Yes';
    features.heightAdjustableDriverSeat = '6-Way Powered + AC Lumbar';
    features.splitRear2ndRow = 'M-Slide';
    features.splitRear3rdRow = '50:50';
    features.recliner2ndRow = 'Yes (Recline + Slide + Tumble)';
    features.autoAC = 'Single Zone (FATC)';
    features.iLikeYourMood = 'Club, Calm & Cozy';
    features.consoleStorageCooling = 'Yes';
    features.autoDimmingIRVM = 'Yes';
    features.frontArmrest = 'Yes (with Storage)';
    features.armrest2ndRow = 'Yes (with Cup Holder)';
    features.headrest2ndRow = 'Yes';
    features.softDoorArmrest = 'Yes';
    features.power12V = 'Yes';
    features.tiltTelescopicSteering = 'Yes';
    features.oneTouch = 'Yes (with Anti-Pinch)';
    features.tpms = 'Alert';
    features.airbags = '6 (Front, Side, Curtain)';
    features.isofix = 'Yes';
    features.esp = 'Yes';
    features.forwardCollisionWarning = 'Yes';
    features.aeb = 'Yes';
    features.laneKeepAssist = 'Yes';
    features.laneCenteringFunction = 'Yes';
    features.trafficSignRecognition = 'Yes';
    features.fvsa = 'Yes';
    features.acc = 'Yes';
    features.iacc = 'Yes';
    features.smartPilotAssist = 'Yes';
    features.highBeamAssist = 'Yes';
    features.rearParkingSensors = 'Yes';
    features.reverseCamera = 'Yes';
    features.rearDefogger = 'Yes';
    features.rearWiper = 'Yes';
    features.windshieldAutoDefog = 'Yes';
    features.airPurifier = 'Yes (PM 2.5 + AQI)';
    features.usbCFront = '15W x 1';
    features.usbCFastFront = '65W x 1';
    features.usbCFast2ndRow = '65W x 2';
    features.adas = 'Level 2';
    features.adasCamera = '3 Radar + 1 Vision Camera & Radars';
    keyFeaturesArr.push('7 Seater', 'Infinity Roof', 'ADAS L2', '6 Airbags');

    // ======= Pack Two Above ADDS =======
    if (isPackTwoAbove || isPackThree || isPackThreeAbove) {
        features.cruiseControl = 'Adaptive';
        features.audioSystem = 'Harman Kardon 15 Speaker Immersive';
        features.dolbyAtmos = 'Yes';
        features.venueScape = 'Yes';
        features.vireoXiAugmentedReality = 'Yes';
        features.fullAutoParking = 'Yes (Key Fob + Mobile)';
        features.eyeSecurityMonitoring = 'Yes';
        features.videoCallingInCarCamera = 'Yes';
        features.byodApp = 'Yes';
        features.nfcKeyCard = 'Yes';
        features.phoneAsKey = 'Yes';
        features.gestureControlWelcome = 'Yes';
        features.epb = 'Yes';
        features.corneringLamps = 'Yes';
        features.autoHeadlamps = 'Yes';
        features.boosterLamps = 'Yes';
        features.autoWipers = 'Yes';
        features.driverDrowsiness = 'Yes';
        features.electricORVM = 'Yes';
        features.powerfoldORVM = 'Yes';
        features.orvmAutoDipReverse = 'Yes';
        features.pushButtonStart = 'Yes';
        features.ventilatedFrontSeats = 'Yes';
        features.coDriverErgoLever = 'Yes';
        features.driverSeatMemory = 'Yes (with Welcome Retract)';
        features.wirelessCharger = 'Front';
        features.autoAC = 'Dual Zone (DATC)';
        features.tpms = 'Individual';
        features.pke = 'Yes';
        features.ldw = 'Yes';
        features.lsa = 'Yes';
        features.sas = 'Yes';
        features.ddd = 'Yes';
        features.hba = 'Yes';
        features.fcta = 'Yes';
        features.rcta = 'Yes';
        features.adasCamera = '1 Vision Camera & Radars + 1 Vision Camera';
        keyFeaturesArr.push('Harman Kardon 15', 'Ventilated Seats', 'EPB');
    }

    // ======= Pack Three ADDS =======
    if (isPackThree || isPackThreeAbove) {
        features.airbags = '7 (Front, Side, Curtain, Driver Knee)';
        features.bsd = 'Yes';
        features.frontParkingSensors = 'Yes';
        features.camera360 = 'Yes';
        features.blindViewMonitor = 'Yes';
        features.secure360 = 'Yes';
        features.frontFogLamps = 'Yes';
        features.powerTailgate = 'Yes (with Gesture)';
        features.wirelessCharger = 'Front & Rear';
        keyFeaturesArr.push('7 Airbags', '360 Camera');
    }

    // ======= Pack Three Above ADDS =======
    if (isPackThreeAbove) {
        features.doa = 'Yes'; features.aes = 'Yes'; features.esa = 'Yes';
        features.elka = 'Yes'; features.highwayAssist = 'Yes'; features.rcw = 'Yes';
        features.scp = 'Yes';
        keyFeaturesArr.push('Highway Assist', 'Full ADAS');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isPackOneAbove) summary += 'offers 7-seater luxury with Infinity Roof and ADAS.';
    else if (isPackTwoAbove) summary += 'adds Harman Kardon 15 speakers and ventilated seats.';
    else if (isPackThree) summary += 'brings 7 airbags and 360 camera for safety.';
    else if (isPackThreeAbove) summary += 'is the flagship with Highway Assist and full ADAS.';

    features.headerSummary = summary;
    features.description = summary + ' The 7-seater electric flagship.';
    return features;
}

function getBatteryKey(variantName: string): string {
    if (variantName.includes('79')) return '79 kWh';
    if (variantName.includes('70')) return '70 kWh';
    return '59 kWh';
}

const XEV9S_VARIANTS = [
    { name: 'XEV 9s Pack One Above 59 kWh', price: 1995000 },
    { name: 'XEV 9s Pack One Above 59 kWh 11.2kw Charger', price: 2070000 },
    { name: 'XEV 9s Pack One Above 79 kWh', price: 2195000 },
    { name: 'XEV 9s Pack One Above 79 kWh 11.2kw Charger', price: 2270000 },
    { name: 'XEV 9s Pack Two Above 70 kWh', price: 2445000 },
    { name: 'XEV 9s Pack Two Above 70 kWh 11.2kw Charger', price: 2520000 },
    { name: 'XEV 9s Pack Two Above 79 kWh', price: 2545000 },
    { name: 'XEV 9s Pack Two Above 79 kWh 11.2kw Charger', price: 2620000 },
    { name: 'XEV 9s Pack Three 79 kWh', price: 2735000 },
    { name: 'XEV 9s Pack Three 79 kWh 11.2kw Charger', price: 2810000 },
    { name: 'XEV 9s Pack Three Above 79 kWh', price: 2945000 },
    { name: 'XEV 9s Pack Three Above 79 kWh 11.2kw Charger', price: 3020000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    let model = await Model.findOne({ id: 'model-brand-mahindra-xev-9s' }).lean();
    if (!model) { model = await Model.findOne({ name: { $regex: /XEV.?9s/i } }).lean(); }
    if (!model) { console.error('❌ Mahindra XEV 9s model not found!'); await mongoose.disconnect(); process.exit(1); }

    console.log('=== MAHINDRA XEV 9s VARIANTS UPDATE ===\n');
    console.log(`Model ID: ${model.id}\nBrand ID: ${model.brandId}\n`);

    if (!isDryRun) {
        const del = await Variant.deleteMany({ modelId: model.id });
        console.log(`🗑️  Deleted ${del.deletedCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(80));
    for (const v of XEV9S_VARIANTS) {
        console.log(`${v.name.padEnd(50)} | ₹${(v.price / 100000).toFixed(2)}L | ${getBatteryKey(v.name)}`);
    }
    console.log('-'.repeat(80));
    console.log(`Total: ${XEV9S_VARIANTS.length} variants\n`);

    if (!isDryRun) {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of XEV9S_VARIANTS) {
            const sanitized = variant.name.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            const variantId = `variant-${model.brandId}-${model.id}-${sanitized}`;
            const bk = getBatteryKey(variant.name);
            const doc = {
                id: variantId, name: variant.name, brandId: model.brandId, modelId: model.id, price: variant.price, status: 'active',
                ...COMMON_SPECS, ...POWERTRAINS[bk as keyof typeof POWERTRAINS], ...RANGE_DATA[bk as keyof typeof RANGE_DATA], ...getVariantFeatures(variant.name),
            };
            await Variant.create(doc);
            console.log(`✅ Added: ${variant.name}`);
        }
        console.log(`\n🎉 Mahindra XEV 9s now has ${await Variant.countDocuments({ modelId: model.id })} variants`);
    } else { console.log('🔍 DRY RUN - No data inserted'); }
    await mongoose.disconnect();
}
run().catch(console.error);
