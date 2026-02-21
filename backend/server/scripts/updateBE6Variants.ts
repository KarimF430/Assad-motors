/**
 * Update Mahindra BE6 EV Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 15
 * Highlights: Born Electric Platform, 59/79 kWh, 170/210 kW, ADAS Level 2+
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Powertrain from Image 5
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
        range: '557 km (MIDC P1+P2)',
        regenLevels: 'L0, L1, L2, L3 (L0 = no regen, L3 = max regen) & Auto',
        singlePedalDrive: 'Yes',
        driveModes: 'Default, Range, Everyday, Race & Snow mode',
        boostMode: 'S+',
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
        range: '682 km (MIDC P1+P2)',
        regenLevels: 'L0, L1, L2, L3 & Auto',
        singlePedalDrive: 'Yes',
        driveModes: 'Default, Range, Everyday, Race & Snow mode',
        boostMode: 'S+',
    }
};

const RANGE_DATA = {
    '59 kWh': { mileageEngineName: '59 kWh Battery', mileageCompanyClaimed: '557 km', engineSummary: '170 kW motor with 557 km range for everyday driving.' },
    '79 kWh': { mileageEngineName: '79 kWh Battery', mileageCompanyClaimed: '682 km', engineSummary: '210 kW motor with 682 km range for extended journeys.' }
};

// Common Specs from Image 5
const COMMON_SPECS = {
    length: '4371', width: '1907', height: '1627', wheelbase: '2775',
    groundClearance: '207', groundClearanceNote: '222 at battery',
    turningCircle: '10', bootSpace: '455 Litres', frunkVolume: '45 Litres',
    seatingCapacity: '5', doors: '5',
    steeringType: 'Electric Power Steering with Variable Gear Ratio',
    frontSuspension: 'McPherson Strut, H-link Independent with Stabilizer Bar',
    rearSuspension: 'Multi-link (5-link) Independent with Stabilizer Bar',
    frontBrake: 'Disc', rearBrake: 'Disc',
    chargerConnection: 'CCS2',
    acPortableCharger: '13A (up to 3.0 kW)',
    dcChargingTime: '20 min (10-80% with 175kW DC)',
    hvBatteryWarranty: 'Lifetime Warranty',
    vehicleWarranty: '3 Years / Unlimited km',
};

function getVariantFeatures(variantName: string) {
    const isPackOne = variantName.includes('Pack One') && !variantName.includes('Above');
    const isPackOneAbove = variantName.includes('Pack One Above');
    const isPackTwo = variantName.includes('Pack Two');
    const isPackThreeSelect = variantName.includes('Pack Three Select');
    const isPackThree = variantName.includes('Pack Three') && !variantName.includes('Select');
    const is79kWh = variantName.includes('79 kWh');
    const is72kw = variantName.includes('7.2kw');
    const is112kw = variantName.includes('11.2kw');

    let features: Record<string, any> = {};
    features.warranty = '3 Years / Unlimited Km + Lifetime Battery';

    // Charger options
    if (is72kw) { features.acWallCharger = '7.2 kW'; features.acChargingTime = '8 / 8.7 / 11.2 kW / 7.2 kW'; }
    else if (is112kw) { features.acWallCharger = '11.2 kW'; features.acChargingTime = '8 / 8.7 / 11.2 kW / 11.2 kW'; }
    else { features.acWallCharger = 'Standard'; }

    // Tyres
    if (isPackOne || isPackOneAbove) {
        features.tyreSize = isPackOne ? '245/50 R18 (Steel with Cover)' : '245/55 R19 (Styled Alloy)';
        features.alloyWheels = isPackOne ? 'No (Steel with Cover)' : 'R19 Styled Alloy';
    } else if (isPackTwo) { features.tyreSize = '245/55 R19 (Styled Alloy)'; features.alloyWheels = 'R19 Styled Alloy'; }
    else { features.tyreSize = '245/55 R19 Alloy'; features.alloyWheels = 'R19 Alloy'; }

    // Suspension
    if (isPackOne || isPackOneAbove) features.suspensionDamper = 'Passive with FDD & MTV-CL tech';
    else if (isPackTwo) features.suspensionDamper = 'Passive with FDD & MTV-CL tech';
    else if (isPackThreeSelect) features.suspensionDamper = 'Intelligent Adaptive (Skyhook & MTV-CL)';
    else features.suspensionDamper = 'Intelligent Adaptive (Skyhook & MTV-CL)';

    let keyFeaturesArr: string[] = [];
    let summary = `The BE6 ${variantName} `;

    // ======= Pack One BASE =======
    features.biLedProjectorHeadlamps = 'Yes';
    features.ledDRL = 'Yes';
    features.illuminatedLogo = 'Yes (Front & Rear)';
    features.ledTailLamp = 'Yes';
    features.dualSuperScreens = 'Yes (12.3" x 2)';
    features.startUpAnimation = 'Yes';
    features.seatUpholstery = 'Premium Fabric';
    features.rearSpoiler = 'Yes';
    features.electricAdjustORVM = 'Yes';
    features.pushButtonStart = 'Yes';
    features.epb = 'Yes';
    features.autoHeadlamps = 'Yes';
    features.boosterLamps = 'Yes';
    features.autoWipers = 'Yes';
    features.usbCFront = '15W x 1';
    features.usbCFastFront = '65W x 1';
    features.usbCRear = '65W x 2';
    features.power12V = 'Yes';
    features.tiltTelescopicSteering = 'Yes';
    features.tpms = 'Alert';
    features.rearDefogger = 'Yes';
    features.audioSystem = 'Standard with 8 Speakers & Dolby Staging';
    features.zenoSuiteScenario = 'Yes';
    features.wirelessAndroidAutoCarPlay = 'Yes';
    features.alexa = 'Yes';
    features.chatGPT = 'Yes';
    features.funWork = 'Yes (OTT, Social Media, News, Shopping, Video Calling)';
    features.connectedCar = 'Yes (MeHUB App)';
    features.otaUpdates = 'Yes (Infotainment, Maps, Vehicle, Powertrain)';
    features.airbags = '6 (Front, Side, Curtain)';
    features.esp = 'Yes';
    features.isofix = 'Yes';
    features.rearParkingSensors = 'Yes';
    features.reverseCamera = 'Yes';
    keyFeaturesArr.push('Dual 12.3" Screens', '6 Airbags', 'ChatGPT', 'Alexa');

    // ======= Pack One Above ADDS =======
    if (isPackOneAbove || isPackTwo || isPackThreeSelect || isPackThree) {
        features.cruiseControl = 'Adaptive';
        features.driveModes = 'Default, Range, Everyday, Race & Snow + Custom mode';
        keyFeaturesArr.push('Adaptive Cruise');
    }

    // ======= Pack Two ADDS =======
    if (isPackTwo || isPackThreeSelect || isPackThree) {
        features.signatureCShapedDRL = 'Yes';
        features.coreTailLamp = 'Yes';
        features.centerTailLampAnimation = 'Yes';
        features.sequentialTurnIndicators = 'Yes';
        features.nightTrail = 'Yes (Carpet Lamp)';
        features.panoramicSunroof = 'Infinity Roof (Fixed Glass)';
        features.lightMelody = 'Yes (Welcome Lights)';
        features.capTouchSwitches = 'Yes';
        features.softWrappedDashboard = 'Yes';
        features.seatUpholstery = 'Leatherette';
        features.leatherSteeringWheel = 'Yes';
        features.steeringWheelECruiser = 'Yes';
        features.electricallyRetractableDoorHandles = 'Yes';
        features.orvmTurnIndicators = 'Yes';
        features.autoDimmingIRVM = 'Yes';
        features.powerfoldORVM = 'Yes';
        features.orvmAutoDip = 'Yes';
        features.pke = 'Yes';
        features.corneringLamps = 'Yes';
        features.oneTouchUpDown = 'Yes';
        features.powerTailgate = 'Yes (with Gesture Control)';
        features.parcelShelf = 'Yes';
        features.wirelessCharger = '15W with Cooling (Front x 1)';
        features.audioSystem = 'Harman Kardon 16 Speaker Immersive';
        features.dolbyAtmos = 'Yes';
        features.venueScape = 'Yes';
        features.vireoXiAugmentedReality = 'Yes';
        features.fullAutoParking = 'Yes (Key Fob + Mobile)';
        features.eyeSecurityMonitoring = 'Yes';
        features.videoCallingInCarCamera = 'Yes';
        features.byodApp = 'Yes (In-car Experience)';
        features.heightAdjustableDriverSeat = '6-Way Manual';
        features.armrest2ndRow = 'Yes (with AC Vents)';
        features.autoAC = 'Dual Zone (DATC)';
        features.iLikeYourMood = 'Club, Calm & Cozy';
        features.consoleStorageCooling = 'Yes';
        features.adas = 'Level 2';
        features.adasCamera = '1 Radar + 1 Vision Camera';
        features.fcw = 'Yes'; features.aeb = 'Yes'; features.ldw = 'Yes';
        features.lka = 'Yes'; features.lsa = 'Yes'; features.lcf = 'Yes';
        features.tsr = 'Yes'; features.fvsa = 'Yes'; features.acc = 'Yes';
        features.iacc = 'Yes'; features.sas = 'Yes'; features.ddd = 'Yes';
        features.hba = 'Yes';
        features.camera360 = 'Yes';
        features.blindViewMonitor = 'Yes';
        features.secure360 = 'Yes (Live View & Recording)';
        features.frontFogLamps = 'Yes';
        features.windshieldAutoDefog = 'Yes';
        keyFeaturesArr.push('Harman Kardon', 'Infinity Roof', 'ADAS L2', '360 Camera');
    }

    // ======= Pack Three Select ADDS =======
    if (isPackThreeSelect || isPackThree) {
        features.frontParkingSensors = 'Yes';
        features.airPurifier = 'Yes (PM 2.5 + AQI Indicator)';
        keyFeaturesArr.push('Air Purifier');
    }

    // ======= Pack Three (79 kWh) ADDS =======
    if (isPackThree) {
        features.airbags = '7 (Front, Side, Curtain & Knee)';
        features.performanceDashboard = 'Yes';
        features.heightAdjustableDriverSeat = '6-Way Powered + AC Lumbar (Manual)';
        features.wirelessCharger = 'Front x 2';
        features.adasCamera = '1 Radar + 1 Vision Camera + 4 Corner Radars';
        features.doa = 'Yes'; features.aes = 'Yes'; features.esa = 'Yes';
        features.elka = 'Yes'; features.bsd = 'Yes'; features.highwayAssist = 'Yes';
        features.rcw = 'Yes'; features.fcta = 'Yes'; features.rcta = 'Yes';
        keyFeaturesArr.push('7 Airbags', '682 km Range', 'Highway Assist');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isPackOne) summary += 'offers essential EV features with 557 km range at accessible pricing.';
    else if (isPackOneAbove) summary += 'adds adaptive cruise and enhanced features.';
    else if (isPackTwo) summary += 'brings Harman Kardon audio, ADAS Level 2, and Infinity Roof.';
    else if (isPackThreeSelect) summary += 'adds 360 camera and air purifier for premium comfort.';
    else if (isPackThree) summary += 'is the flagship with 682 km range, 7 airbags, and full ADAS suite.';

    features.headerSummary = summary;
    features.description = summary + ' Born Electric. Born Bold.';
    return features;
}

function getBatteryKey(variantName: string): string {
    return variantName.includes('79 kWh') ? '79 kWh' : '59 kWh';
}

const BE6_VARIANTS = [
    { name: 'BE6 Pack One 59 kWh', price: 1889000 },
    { name: 'BE6 Pack One 59 kWh 7.2kw Charger', price: 1939000 },
    { name: 'BE6 Pack One 59 kWh 11.2kw Charger', price: 1964000 },
    { name: 'BE6 Pack One Above 59 kWh', price: 2050000 },
    { name: 'BE6 Pack One Above 59 kWh 7.2kw Charger', price: 2100000 },
    { name: 'BE6 Pack One Above 59 kWh 11.2kw Charger', price: 2125000 },
    { name: 'BE6 Pack Two 59 kWh', price: 2190000 },
    { name: 'BE6 Pack Two 59 kWh 7.2kw Charger', price: 2240000 },
    { name: 'BE6 Pack Two 59 kWh 11.2kw Charger', price: 2265000 },
    { name: 'BE6 Pack Three Select 59 kWh', price: 2450000 },
    { name: 'BE6 Pack Three Select 59 kWh 7.2kw Charger', price: 2500000 },
    { name: 'BE6 Pack Three Select 59 kWh 11.2kw Charger', price: 2525000 },
    { name: 'BE6 Pack Three 79 kWh', price: 2690000 },
    { name: 'BE6 Pack Three 79 kWh 7.2kw Charger', price: 2740000 },
    { name: 'BE6 Pack Three 79 kWh 11.2kw Charger', price: 2765000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    let model = await Model.findOne({ id: 'model-brand-mahindra-be-6' }).lean();
    if (!model) { model = await Model.findOne({ name: { $regex: /BE.?6/i } }).lean(); }
    if (!model) { console.error('❌ Mahindra BE6 model not found!'); await mongoose.disconnect(); process.exit(1); }

    console.log('=== MAHINDRA BE6 VARIANTS UPDATE ===\n');
    console.log(`Model ID: ${model.id}\nBrand ID: ${model.brandId}\n`);

    if (!isDryRun) {
        const del = await Variant.deleteMany({ modelId: model.id });
        console.log(`🗑️  Deleted ${del.deletedCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(80));
    for (const v of BE6_VARIANTS) {
        console.log(`${v.name.padEnd(50)} | ₹${(v.price / 100000).toFixed(2)}L | ${getBatteryKey(v.name)}`);
    }
    console.log('-'.repeat(80));
    console.log(`Total: ${BE6_VARIANTS.length} variants\n`);

    if (!isDryRun) {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of BE6_VARIANTS) {
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
        console.log(`\n🎉 Mahindra BE6 now has ${await Variant.countDocuments({ modelId: model.id })} variants`);
    } else { console.log('🔍 DRY RUN - No data inserted'); }
    await mongoose.disconnect();
}
run().catch(console.error);
