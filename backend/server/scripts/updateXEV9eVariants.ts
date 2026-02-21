/**
 * Update Mahindra XEV 9e Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 5
 * Highlights: Born Electric Platform, 59/79 kWh, 170/210 kW, ADAS Level 2+, SUV Coupe
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Powertrain from Image 4
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
        range: '542 km (MIDC P1+P2)',
        regenLevels: 'L0, L1, L2, L3 & Auto',
        singlePedalDrive: 'Yes',
        driveModes: 'Default, Range, Everyday, Race & Snow mode',
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
        driveModes: 'Default, Range, Everyday, Race & Snow mode',
    }
};

const RANGE_DATA = {
    '59 kWh': { mileageEngineName: '59 kWh Battery', mileageCompanyClaimed: '542 km', engineSummary: '170 kW motor with 542 km range for everyday driving.' },
    '79 kWh': { mileageEngineName: '79 kWh Battery', mileageCompanyClaimed: '656 km', engineSummary: '210 kW motor with 656 km range for extended journeys.' }
};

// Common Specs from Image 4
const COMMON_SPECS = {
    length: '4789', width: '1907', height: '1694', wheelbase: '2775',
    groundClearance: '207', groundClearanceNote: '218 at battery',
    turningCircle: '10', bootSpace: '663 Litres', frunkVolume: '150 Litres',
    seatingCapacity: '5', doors: '5',
    steeringType: 'Electric Power Steering with Variable Gear Ratio',
    frontSuspension: 'McPherson Strut, H-link Independent with Stabilizer Bar',
    rearSuspension: 'Multi-link (5-link) Independent with Stabilizer Bar',
    frontBrake: 'Disc', rearBrake: 'Disc',
    chargerConnection: 'CCS2',
    acPortableCharger: '13A (up to 3.0 kW)',
    dcChargingTime: '20 min (20-80% with 175kW DC)',
    hvBatteryWarranty: 'Lifetime Warranty',
    vehicleWarranty: '3 Years / Unlimited km',
    spareWheel: 'T135/80 R18',
};

function getVariantFeatures(variantName: string) {
    const isPackOne = variantName.includes('Pack One');
    const isPackTwo = variantName.includes('Pack Two');
    const isPackThreeSelect = variantName.includes('Pack Three Select');
    const isPackThree = variantName.includes('Pack Three') && !variantName.includes('Select');
    const is79kWh = variantName.includes('79');

    let features: Record<string, any> = {};
    features.warranty = '3 Years / Unlimited Km + Lifetime Battery';

    // Tyres
    if (isPackOne) { features.tyreSize = '245/55 R19 (Styled Wheel)'; features.alloyWheels = 'R19 Styled'; }
    else { features.tyreSize = '245/55 R19 Alloy'; features.alloyWheels = 'R19 Alloy'; }

    // Suspension
    if (isPackOne || isPackTwo) features.suspensionDamper = 'Passive with FDD & MTV-CL tech';
    else features.suspensionDamper = 'Intelligent Adaptive (Skyhook & MTV-CL)';

    let keyFeaturesArr: string[] = [];
    let summary = `The XEV 9e ${variantName} `;

    // ======= Pack One BASE =======
    features.biLedProjectorHeadlamps = 'Yes';
    features.ledDRL = 'Yes (L as Position Lamp)';
    features.illuminatedLogo = 'Yes (Front & Rear)';
    features.ledTailLamp = 'Yes';
    features.capTouchSwitches = 'Switch Bars on Dashboard';
    features.seatUpholstery = 'Premium Fabric';
    features.leatherSteeringWheel = 'Leatherette (e-Shifter)';
    features.rearSpoiler = 'Yes';
    features.orvmTurnIndicators = 'Yes';
    features.frunkWithDrainHole = 'Yes (with Intermediate Lid)';
    features.cruiseControl = 'Standard';
    features.driveModes = 'Default, Range, Everyday, Race & Snow';
    features.boostMode = 'S+';
    features.performanceDashboard = 'Yes';
    features.audioSystem = 'Standard with 8 Speakers & Sound Staging';
    features.connectedCar = 'Yes (MeHUB App)';
    features.otaUpdates = 'Yes (Infotainment, Maps, Vehicle, Powertrain)';
    features.chargingLimiter = 'Yes';
    features.scheduledCharging = 'Yes';
    features.ecoScore = 'Yes';
    features.appStore = 'Yes';
    features.heightAdjustableDriverSeat = '6-Way Manual';
    features.splitRear2ndRow = '60:40';
    features.frontArmrest = 'Yes (with Storage)';
    features.armrest2ndRow = 'Yes (with Cup Holder)';
    features.headrest2ndRow = 'Yes';
    features.power12V = 'Yes';
    features.tiltTelescopicSteering = 'Yes';
    features.rearWindowSunShade = 'Yes';
    features.oneTouchUpDown = 'Yes';
    features.tpms = 'Alert';
    features.airbags = '6 (Front, Side, Curtain)';
    features.isofix = 'Yes';
    features.esp = 'Yes';
    features.smartPilotAssist = 'Yes';
    features.driverDrowsiness = 'Yes';
    features.highBeamAssist = 'Yes';
    features.rearParkingSensors = 'Yes';
    features.reverseCamera = 'Yes';
    features.rearDefogger = 'Yes';
    features.usbCFront = '15W x 1';
    features.usbCFastFront = '65W x 1';
    features.usbCRear = '65W x 2';
    keyFeaturesArr.push('Dual Screens', '6 Airbags', '663L Boot', 'Smart Pilot Assist');

    // ======= Pack Two ADDS =======
    if (isPackTwo || isPackThreeSelect || isPackThree) {
        features.centreSignatureSpoolonLamp = 'Yes';
        features.sequentialTurnIndicators = 'Yes';
        features.startupAnimation = 'Yes';
        features.softWrappedDashboard = 'Yes';
        features.seatUpholstery = 'Leatherette';
        features.capTouchSwitches = 'Steering Wheel & Switch Bars on Dashboard';
        features.cruiseControl = 'Adaptive';
        features.audioSystem = 'Harman Kardon 16 Speaker Immersive';
        features.dolbyAtmos = 'Yes';
        features.sonicSuite = 'Yes (Signature Sounds)';
        features.vireoXiAugmentedReality = 'Yes';
        features.fullAutoParking = 'Yes (Key Fob + Mobile)';
        features.eyeSecurityMonitoring = 'Yes';
        features.heightAdjustableDriverSeat = '6-Way Powered + AC Lumbar (Manual)';
        features.ventilatedFrontSeats = 'Yes';
        features.coDriverErgoLever = 'Yes';
        features.driverSeatMemory = 'Yes (with Welcome Retract)';
        features.autoDimmingIRVM = 'Yes';
        features.electricORVM = 'Yes';
        features.powerfoldORVM = 'Yes';
        features.orvmAutoDipReverse = 'Yes';
        features.pushButtonStart = 'Yes';
        features.corneringLamps = 'Yes';
        features.autoHeadlamps = 'Yes';
        features.autoWipers = 'Yes';
        features.autoAC = 'Dual Zone (DATC)';
        features.iLikeYourMood = 'Club, Calm & Cozy';
        features.consoleStorageCooling = 'Yes';
        features.tpms = 'Individual';
        features.towbarCover = 'Yes';
        features.adas = 'Level 2';
        features.adasCamera = 'Radar + 1 Vision Camera';
        features.fcw = 'Yes'; features.aeb = 'Yes'; features.ldw = 'Yes';
        features.lka = 'Yes'; features.lcf = 'Yes'; features.tsr = 'Yes';
        features.fvsa = 'Yes'; features.acc = 'Yes'; features.iacc = 'Yes';
        features.wirelessCharger = 'Front';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wireless';
        features.alexa = 'Yes';
        features.chatGPT = 'Yes';
        features.superfast5G = 'Yes';
        features.funWork = 'Yes (OTT, Social Media, News, Shopping)';
        keyFeaturesArr.push('Harman Kardon', 'ADAS L2', 'Ventilated Seats', 'Wireless Charger');
    }

    // ======= Pack Three Select ADDS =======
    if (isPackThreeSelect || isPackThree) {
        features.nightTrail = 'Yes';
        features.videoCallingInCarCamera = 'Yes';
        features.byodApp = 'Yes';
        features.pke = 'Yes';
        features.epb = 'Yes';
        features.boosterLamps = 'Yes';
        features.powerTailgate = 'Yes (with Gesture Control)';
        features.airbags = '7 (Front, Side, Curtain, Driver Knee)';
        features.adasCamera = 'Radar + 1 Vision Camera + 4 Corner Radars';
        features.lsa = 'Yes (N/A for some)';
        features.sas = 'Yes'; features.ddd = 'Yes'; features.hba = 'Yes';
        features.fcta = 'Yes'; features.rcta = 'Yes';
        features.frontParkingSensors = 'Yes';
        features.camera360 = 'Yes';
        features.blindViewMonitor = 'Yes';
        features.secure360 = 'Yes';
        features.frontFogLamps = 'Yes';
        features.windshieldAutoDefog = 'Yes';
        features.airPurifier = 'Yes (PM 2.5 + AQI)';
        features.wirelessCharger = 'Front & Rear';
        keyFeaturesArr.push('7 Airbags', '360 Camera', 'Air Purifier');
    }

    // ======= Pack Three (79 kWh) ADDS =======
    if (isPackThree) {
        features.doa = 'Yes'; features.aes = 'Yes'; features.esa = 'Yes';
        features.elka = 'Yes'; features.bsd = 'Yes'; features.highwayAssist = 'Yes';
        features.rcw = 'Yes';
        keyFeaturesArr.push('656 km Range', 'Highway Assist');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isPackOne) summary += 'offers spacious SUV coupe design with 542 km range.';
    else if (isPackTwo) summary += 'brings Harman Kardon, ADAS L2, and ventilated seats.';
    else if (isPackThreeSelect) summary += 'adds 7 airbags, 360 camera, and air purifier.';
    else if (isPackThree) summary += 'is the flagship with 656 km range and full ADAS suite.';

    features.headerSummary = summary;
    features.description = summary + ' The SUV Coupe that defines electric luxury.';
    return features;
}

function getBatteryKey(variantName: string): string {
    return variantName.includes('79') ? '79 kWh' : '59 kWh';
}

const XEV9E_VARIANTS = [
    { name: 'XEV 9e Pack One 59 kWh', price: 2190000 },
    { name: 'XEV 9e Pack Two 59 kWh', price: 2490000 },
    { name: 'XEV 9e Pack Two 79kWh', price: 2490000 },
    { name: 'XEV 9e Pack Three Select 59 kWh', price: 2790000 },
    { name: 'XEV 9e Pack Three 79 kWh', price: 3050000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    let model = await Model.findOne({ id: 'model-brand-mahindra-xev-9e' }).lean();
    if (!model) { model = await Model.findOne({ name: { $regex: /XEV.?9e/i } }).lean(); }
    if (!model) { console.error('❌ Mahindra XEV 9e model not found!'); await mongoose.disconnect(); process.exit(1); }

    console.log('=== MAHINDRA XEV 9e VARIANTS UPDATE ===\n');
    console.log(`Model ID: ${model.id}\nBrand ID: ${model.brandId}\n`);

    if (!isDryRun) {
        const del = await Variant.deleteMany({ modelId: model.id });
        console.log(`🗑️  Deleted ${del.deletedCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(75));
    for (const v of XEV9E_VARIANTS) {
        console.log(`${v.name.padEnd(40)} | ₹${(v.price / 100000).toFixed(2)}L | ${getBatteryKey(v.name)}`);
    }
    console.log('-'.repeat(75));
    console.log(`Total: ${XEV9E_VARIANTS.length} variants\n`);

    if (!isDryRun) {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of XEV9E_VARIANTS) {
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
        console.log(`\n🎉 Mahindra XEV 9e now has ${await Variant.countDocuments({ modelId: model.id })} variants`);
    } else { console.log('🔍 DRY RUN - No data inserted'); }
    await mongoose.disconnect();
}
run().catch(console.error);
