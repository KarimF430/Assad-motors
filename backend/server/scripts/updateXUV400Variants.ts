/**
 * Update Mahindra XUV400 EV Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 5
 * Highlights: 150 PS Electric Motor, 34.5/39.4 kWh Battery, 375-456 km Range
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Powertrain Specs from Image 1
// PMSM Motor: 110 kW (150 PS), 310 Nm, 0-100 in 8.3s
const POWERTRAINS = {
    '34.5 kWh': {
        engineName: 'Permanent Magnet Synchronous Motor (PMSM)',
        engineType: 'Electric Motor',
        displacement: 'N/A',
        engineCapacity: 'N/A',
        power: '148 Bhp',
        maxPower: '148 Bhp',
        enginePower: '110 kW',
        torque: '310 Nm',
        engineTorque: '310 Nm (Instant)',
        engineTransmission: 'Shift-by-Wire Automatic',
        engineSpeed: 'Single Speed',
        noOfGears: '1',
        fuelType: 'Electric',
        fuel: 'Electric',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false,
        isElectric: true,
        batteryCapacity: '34.5 kWh',
        batteryType: 'High Energy Density Lithium-Ion',
        range: '375 km (MIDC Part 1)',
        acceleration: '0-100 km/h in 8.3 seconds',
        driveModes: 'Fun & Fast',
        thermalManagement: 'Liquid Cooled and Heated',
        ipRating: 'IP67',
        chargerType: '3.3 kW AC Wallbox',
        chargerConnection: 'CCS2',
        portableChargingCable: 'Yes'
    },
    '39.4 kWh': {
        engineName: 'Permanent Magnet Synchronous Motor (PMSM)',
        engineType: 'Electric Motor',
        displacement: 'N/A',
        engineCapacity: 'N/A',
        power: '148 Bhp',
        maxPower: '148 Bhp',
        enginePower: '110 kW',
        torque: '310 Nm',
        engineTorque: '310 Nm (Instant)',
        engineTransmission: 'Shift-by-Wire Automatic',
        engineSpeed: 'Single Speed',
        noOfGears: '1',
        fuelType: 'Electric',
        fuel: 'Electric',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false,
        isElectric: true,
        batteryCapacity: '39.4 kWh',
        batteryType: 'High Energy Density Lithium-Ion',
        range: '456 km (MIDC Part 1)',
        acceleration: '0-100 km/h in 8.3 seconds',
        driveModes: 'Fun, Fast & Fearless',
        thermalManagement: 'Liquid Cooled and Heated',
        ipRating: 'IP67',
        chargerType: '7.2 kW AC Wallbox',
        chargerConnection: 'CCS2',
        portableChargingCable: 'Yes'
    }
};

const RANGE_DATA = {
    '34.5 kWh': {
        mileageEngineName: '34.5 kWh Battery',
        mileageCompanyClaimed: '375 km',
        mileageCityRealWorld: '320 km',
        mileageHighwayRealWorld: '280 km',
        mileageCity: 'N/A',
        mileageHighway: 'N/A',
        engineSummary: 'Entry-level EV with 375 km range for urban commutes.'
    },
    '39.4 kWh': {
        mileageEngineName: '39.4 kWh Battery',
        mileageCompanyClaimed: '456 km',
        mileageCityRealWorld: '400 km',
        mileageHighwayRealWorld: '340 km',
        mileageCity: 'N/A',
        mileageHighway: 'N/A',
        engineSummary: 'Extended range EV with 456 km for worry-free journeys.'
    }
};

// Common Specs from Image 1
const COMMON_SPECS = {
    length: '4200',
    width: '1821',
    height: '1634',
    wheelbase: '2600',
    groundClearance: '180',
    bootSpace: '378 Litres',
    fuelTankCapacity: 'N/A',
    seatingCapacity: '5',
    doors: '5',

    tyreSize: '205/65 R16',
    spareWheelSize: '135/90 R16',

    // Suspension (with FDD and MTV-CL)
    frontSuspension: 'MacPherson Strut with Anti-Roll Bar',
    rearSuspension: 'Twist Beam with Coil Spring',
    suspensionEnhancements: 'FDD and MTV-CL',
    frontBrake: 'Disc',
    rearBrake: 'Disc',
    steeringType: 'Electric Power Steering',

    emission: 'Zero Tailpipe Emission',

    // Warranty
    vehicleWarranty: '3 Years or Unlimited km',
    batteryWarranty: '8 Years or 1,60,000 km',
};

function getVariantFeatures(variantName: string) {
    const isECPro = variantName.includes('EC Pro');
    const isELPro = variantName.includes('EL Pro');
    const isDT = variantName.includes('DT');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km + 8 Years Battery';

    let keyFeaturesArr: string[] = [];
    let summary = `The XUV400 ${variantName} `;

    // ======= EC Pro BASE FEATURES (from Image 2) =======
    features.alloyWheels = 'No (R16 Steel with Cover)';
    features.ledTailLamps = 'Yes';
    features.ledTurnIndicatorORVM = 'Yes';
    features.dualToneInteriors = 'Yes';
    features.bodyColouredDoorHandles = 'Yes';
    features.blackORVM = 'Yes';
    features.wheelArchCladding = 'Yes';
    features.rearSpoiler = 'Yes';
    features.seatUpholstery = 'Premium Fabric';
    features.splitRear = '60:40';
    features.paddedFrontArmrest = 'Yes (with Storage)';
    features.rearACVents = 'Yes';
    features.rearUSBC = 'Yes (with Mobile Holder)';
    features.frontUSBCharging = 'Yes';
    features.powerOutlet12V = 'Yes';
    features.heightAdjustableFrontSeatbelts = 'Yes';
    features.adjustableHeadrest2ndRow = 'Yes';
    features.bottleHolder = 'Yes (All 4 Doors)';
    features.connectedCarTech = 'Yes';
    features.dualZoneAC = 'Yes';
    features.driveModes = 'Fun & Fast';
    features.smartSteering = 'Yes';
    features.cluster = '8.89 cm Supervision Cluster';
    features.centralLocking = 'Yes';
    features.passiveKeylessEntry = 'Yes';
    features.pushButtonStart = 'Yes';
    features.electricORVM = 'Yes';
    features.tyrePositionDisplay = 'Yes';
    features.powerWindows = 'Front & Rear';
    features.extendedPowerWindow = 'Yes';
    features.oneTouchLaneChange = 'Yes';

    // Safety EC Pro
    features.airbags = '2';
    features.airbagsLocation = 'Driver, Passenger';
    features.esp = 'Yes';
    features.abs = 'Yes';
    features.ebd = 'Yes';
    features.tpms = 'Yes';
    features.allDiscBrakes = 'Yes';
    features.isofix = 'Yes';
    features.seatbeltWarning = 'Yes (Co-Driver)';
    features.seatbeltPretensioner = 'Yes (Front)';
    features.speedSensingDoorLock = 'Yes';
    features.impactSensingDoorUnlock = 'Yes';
    features.engineImmobilizer = 'Yes';
    features.panicBrakingSignal = 'Yes';
    features.passengerAirbagDeactivation = 'Yes';
    features.bootLamp = 'Yes';
    features.reverseParkingSensors = 'Yes';

    keyFeaturesArr.push('150 PS Electric', 'Dual Zone AC', 'Connected Car', 'ESP', 'All Disc Brakes');

    // ======= EL Pro ADDS (from Image 2) =======
    if (isELPro) {
        features.alloyWheels = 'R16 Diamond Cut Alloy';
        features.projectorHeadlamps = 'Yes (with LED DRLs)';
        features.frontFogLamps = 'Yes';
        features.roofRails = 'Yes';
        features.sharkFinAntenna = 'Yes';
        features.seatUpholstery = 'Leatherette with Copper Stitch';
        features.leatherSteeringWheel = 'Yes';
        features.electricSunroof = 'Yes (with Anti-Pinch)';
        features.steeringMountedControls = 'Phone + Audio';
        features.heightAdjustableDriverSeat = 'Yes';
        features.illuminatedSunvisors = 'Yes (Vanity Mirror Co-Driver)';
        features.consoleRoofLamp = 'Yes';
        features.frontUSBCharging = 'Yes (2 Points)';
        features.adjustableHeadrest2ndRowMiddle = 'Yes';
        features.bungeeStrap = 'Yes';
        features.sunglassHolder = 'Yes';
        features.armrest2ndRow = 'Yes (with Cupholders)';
        features.connectedCarTech = '55+ Adrenox Features';
        features.wirelessCharger = 'Yes';
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.04 cm HD Touchscreen';
        features.cluster = '26.04 cm (10.25") Fully Digital';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wireless';
        features.alexa = 'Yes';
        features.bluetooth = 'Yes';
        features.speakers = '4 Speakers + 2 Tweeters';
        features.smartwatchConnectivity = 'Yes';
        features.reverseCamera = 'Yes (with Adaptive Guidelines)';
        features.electricORVM = 'Yes (Adjustable + Foldable)';
        features.followMeHome = 'Yes';
        features.leadMeToVehicle = 'Yes';
        features.intelligentLightSensingHeadlamps = 'Yes';
        features.rainSensingWipers = 'Yes';
        features.voiceCommands = 'Yes (+ SMS Read Out)';
        features.airbags = '6';
        features.airbagsLocation = 'Driver, Passenger, Side';
        features.rearDefogger = 'Yes';
        features.rearWiper = 'Yes';
        features.hillHoldAssist = 'Yes';

        keyFeaturesArr.push('10.25" Screen', 'Electric Sunroof', '6 Airbags', '456 km Range');
    }

    // Dual Tone adds styling
    if (isDT) {
        features.dualToneRoof = 'Yes';
        keyFeaturesArr.push('Dual Tone Roof');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isECPro) {
        summary += 'offers affordable EV entry with essential features and 375 km range.';
    } else if (isELPro && !isDT) {
        summary += 'brings premium features, sunroof, and extended range capability.';
    } else if (isDT) {
        summary += 'adds distinctive dual-tone styling to the premium package.';
    }

    features.headerSummary = summary;
    features.description = summary + ' Zero emissions, instant torque.';

    return features;
}

function getBatteryKey(variantName: string): string {
    return variantName.includes('39.4') ? '39.4 kWh' : '34.5 kWh';
}

const XUV400_VARIANTS = [
    { name: 'XUV400 EC Pro 34.5 kWh', price: 1549000 },
    { name: 'XUV400 EL Pro 34.5 kWh', price: 1673000 },
    { name: 'XUV400 EL Pro DT 34.5 kWh', price: 1694000 },
    { name: 'XUV400 EL Pro 39.4 kWh', price: 1748000 },
    { name: 'XUV400 EL Pro DT 39.4 kWh', price: 1769000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    let model = await Model.findOne({ id: 'model-brand-mahindra-xuv400' }).lean();
    if (!model) {
        model = await Model.findOne({ name: { $regex: /XUV400/i } }).lean();
    }
    if (!model) {
        console.error('❌ Mahindra XUV400 model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MAHINDRA XUV400 VARIANTS UPDATE ===\n');
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
    console.log('-'.repeat(75));
    for (const v of XUV400_VARIANTS) {
        const batteryKey = getBatteryKey(v.name);
        console.log(`${v.name.padEnd(35)} | ₹${(v.price / 100000).toFixed(2)}L | ${batteryKey}`);
    }
    console.log('-'.repeat(75));
    console.log(`Total: ${XUV400_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = XUV400_VARIANTS[4]; // EL Pro DT 39.4
        const batteryKey = getBatteryKey(sampleVariant.name);
        const powertrainSpecs = POWERTRAINS[batteryKey as keyof typeof POWERTRAINS];
        const rangeData = RANGE_DATA[batteryKey as keyof typeof RANGE_DATA];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...powertrainSpecs, ...rangeData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of XUV400_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            const variantId = `variant-${model.brandId}-${model.id}-${sanitizedName}`;
            const batteryKey = getBatteryKey(variant.name);
            const powertrainSpecs = POWERTRAINS[batteryKey as keyof typeof POWERTRAINS];
            const rangeData = RANGE_DATA[batteryKey as keyof typeof RANGE_DATA];
            const features = getVariantFeatures(variant.name);

            const variantDoc = {
                id: variantId,
                name: variant.name,
                brandId: model.brandId,
                modelId: model.id,
                price: variant.price,
                status: 'active',
                ...COMMON_SPECS,
                ...powertrainSpecs,
                ...rangeData,
                ...features,
            };

            await Variant.create(variantDoc);
            console.log(`✅ Added: ${variant.name}`);
        }
        const newCount = await Variant.countDocuments({ modelId: model.id });
        console.log(`\n🎉 Mahindra XUV400 now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
