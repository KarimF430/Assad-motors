/**
 * Update Mahindra Bolero Neo Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 5
 * Highlights: 1.5L mHAWK100 Diesel (100 Bhp), RideFlo Tech, Multi-Terrain
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Image 3
// mHAWK100: 1493cc, 73.5 kW (100 Bhp), 260 Nm
const ENGINES = {
    'Diesel MT': {
        engineName: '1.5l mHAWK100 Diesel BSVI',
        engineType: '3 Cylinder, Common Rail Direct Injection',
        displacement: '1493',
        engineCapacity: '1493 cc',
        power: '100 Bhp',
        maxPower: '100 Bhp',
        enginePower: '100 PS',
        torque: '260 Nm',
        engineTorque: '260 Nm @ 1750-2250 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: true,
        hybridType: 'Micro Hybrid (Engine Start-Stop)'
    }
};

const MILEAGE_DATA = {
    'Diesel MT': {
        mileageEngineName: '1.5l mHAWK100 Diesel MT',
        mileageCompanyClaimed: '17.0 kmpl',
        mileageCityRealWorld: '13 kmpl',
        mileageHighwayRealWorld: '16 kmpl',
        mileageCity: '13',
        mileageHighway: '16',
        engineSummary: 'Efficient mHAWK100 diesel with Micro Hybrid and Eco mode.'
    }
};

// Common Specs from Image 3
const COMMON_SPECS = {
    length: '3995',
    width: '1795',
    height: '1817',
    wheelbase: '2680',
    groundClearance: '200',
    bootSpace: 'Third Row Foldable',
    fuelTankCapacity: '50 Litres',
    seatingCapacity: '7',
    seatingConfig: '5+2 Configuration',
    doors: '5',

    // Tyres (default)
    tyreSize: '215/75 R15',

    // Suspension (with MTV-CL and FDD)
    frontSuspension: 'Double Wishbone with Coil Spring, MTV-CL with FDD',
    rearSuspension: 'Multi-Link with Coil Spring, MTV-CL',
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Standard Safety
    airbags: '2',
    airbagsLocation: 'Driver, Passenger',
    abs: 'Yes',
    ebd: 'Yes',
    cornerBrakingControl: 'Yes',
    engineImmobilizer: 'Yes',
    seatbeltWarning: 'Yes (Driver, Co-Driver, 2nd Row)',
    speedAlert: 'Yes (Audio)',
};

function getVariantFeatures(variantName: string) {
    const isN4 = variantName.includes('N4');
    const isN8 = variantName.includes('N8');
    const isN10 = variantName.includes('N10') && !variantName.includes('N11');
    const isN10Opt = variantName.includes('N10 Opt');
    const isN10R = variantName.includes('N10 R');
    const isN11 = variantName.includes('N11');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';

    let keyFeaturesArr: string[] = [];
    let summary = `The Bolero Neo ${variantName} `;

    // ======= N4 BASE FEATURES (from Images 1 & 2) =======
    // Design
    features.xShapedBumpers = 'Yes';
    features.signatureGrillChrome = 'No';
    features.staticBendingHeadlamps = 'No';
    features.ledDRL = 'No';
    features.frontFogLamps = 'No';
    features.signatureSideCladding = 'Yes';
    features.wheelArchCladding = 'No';
    features.dualToneORVM = 'No';
    features.alloyWheels = 'No (R15 Steel)';
    features.spoiler = 'No';
    features.xTypeSpareWheelCover = 'Yes';
    features.muscularSideFootstep = 'No';

    // Comfort
    features.heightAdjustableDriverSeat = 'No';
    features.frontArmrests = 'No';
    features.armrest2ndRow = 'No';
    features.antiGlareIRVM = 'No';
    features.roofLampFront = 'Yes';
    features.roofLampMiddle = 'No';
    features.steeringWheelGarnish = 'No';
    features.seatUpholstery = 'Vinyl (Mocha Brown)';
    features.rideFloTech = 'Yes';
    features.foldable3rdRow = 'Yes';
    features.foldable2ndRow = 'No';
    features.powerSteering = 'Yes';
    features.tiltSteering = 'No';
    features.powerWindows = 'No';
    features.delayedPowerWindows = 'No';
    features.usbCCharging = 'No';
    features.powerOutlet12V = 'Yes';
    features.centralLocking = 'Yes';
    features.keylessEntry = 'No';

    // Tech
    features.touchScreenInfotainment = 'No';
    features.musicPlayer = 'No';
    features.speakers = 'No';
    features.tweeters = 'No';
    features.steeringMountedControls = 'No';
    features.cruiseControl = 'No';
    features.twinPodCluster = 'Yes';
    features.ecoMode = 'Yes';
    features.engineStartStop = 'Yes (Micro Hybrid)';
    features.acWithEcoMode = 'Yes';
    features.electricORVM = 'No';
    features.multiTerrainTechnology = 'No';
    features.magicLamp = 'No';
    features.followMeHome = 'No';
    features.rearWiperDefogger = 'No';

    // Safety
    features.reverseCamera = 'No';
    features.reverseParkingSensors = 'Yes';
    features.isofix = 'No';

    keyFeaturesArr.push('Dual Airbags', 'ABS+EBD', 'Micro Hybrid', 'RideFlo Tech');

    // ======= N8 ADDS =======
    if (isN8 || isN10 || isN10Opt || isN10R || isN11) {
        features.wheelArchCladding = 'Yes';
        features.dualToneORVM = 'Yes';
        features.alloyWheels = 'R15 Versa';
        features.muscularSideFootstep = 'Yes';
        features.steeringWheelGarnish = 'Yes';
        features.seatUpholstery = 'Fabric (Mocha Brown)';
        features.foldable2ndRow = 'Yes';
        features.tiltSteering = 'Yes';
        features.powerWindows = 'Front & Rear';
        features.touchScreenInfotainment = '9 inch';
        features.infotainmentScreen = '22.8 cm Touchscreen';
        features.musicPlayer = 'Yes (Bluetooth, USB)';
        features.speakers = '4 Speakers';
        features.tweeters = '2 Tweeters';
        features.followMeHome = 'Yes';
        features.rearWiperDefogger = 'Yes';
        features.reverseParkingSensors = 'Yes';

        keyFeaturesArr.push('9" Touchscreen', '4 Speakers');
    }

    // ======= N10 / N10 R ADDS =======
    if (isN10 || isN10Opt || isN10R || isN11) {
        features.signatureGrillChrome = 'Yes';
        features.staticBendingHeadlamps = 'Yes';
        features.ledDRL = 'Yes';
        features.frontFogLamps = 'Yes';
        features.alloyWheels = 'R15 Silver Alloy';
        features.spoiler = 'Yes';
        features.heightAdjustableDriverSeat = 'Yes';
        features.frontArmrests = 'Yes';
        features.seatUpholstery = 'Leatherette (Mocha Brown)';
        features.delayedPowerWindows = 'Yes (All Four)';
        features.usbCCharging = 'Yes';
        features.keylessEntry = 'Yes';
        features.steeringMountedControls = 'Yes';
        features.cruiseControl = 'Yes';
        features.electricORVM = 'Yes';
        features.multiTerrainTechnology = 'Yes';
        features.magicLamp = 'Yes';
        features.isofix = 'Yes';

        keyFeaturesArr.push('LED DRL', 'Cruise Control', 'Multi-Terrain');
    }

    // ======= N10 (O) / N10 Opt ADDS =======
    if (isN10Opt || isN11) {
        features.armrest2ndRow = 'Yes';
        features.antiGlareIRVM = 'Yes';
        features.roofLampMiddle = 'Yes';
        features.reverseCamera = 'Yes';

        keyFeaturesArr.push('Rear Camera');
    }

    // ======= N11 (Top) ADDS =======
    if (isN11) {
        features.alloyWheels = 'R16 Dark Metallic Grey Alloy';
        features.tyreSize = '215/70 R16';
        features.seatUpholstery = 'Leatherette (Lunar Grey)';

        keyFeaturesArr.push('R16 Alloys', 'Lunar Grey Interior');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isN4) {
        summary += 'offers rugged SUV capability with essential features.';
    } else if (isN8) {
        summary += 'adds touchscreen and comfort features for better convenience.';
    } else if (isN10R) {
        summary += 'brings chrome styling, LED lighting, and cruise control.';
    } else if (isN10Opt) {
        summary += 'adds rear camera and enhanced comfort for practicality.';
    } else if (isN11) {
        summary += 'is the flagship with R16 alloys and premium Lunar Grey interior.';
    }

    features.headerSummary = summary;
    features.description = summary + ' Built tough for Indian roads.';

    return features;
}

const BOLERO_NEO_VARIANTS = [
    { name: 'Bolero Neo N4 Diesel MT', price: 892000 },
    { name: 'Bolero Neo N8 Diesel MT', price: 953000 },
    { name: 'Bolero Neo N11 Diesel MT', price: 999000 },
    { name: 'Bolero Neo N10 R Diesel MT', price: 1029000 },
    { name: 'Bolero Neo N10 Opt Diesel MT', price: 1049000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Try multiple patterns
    let model = await Model.findOne({ id: 'model-brand-mahindra-bolero-neo' }).lean();
    if (!model) {
        model = await Model.findOne({ name: { $regex: /Bolero Neo/i } }).lean();
    }
    if (!model) {
        console.error('❌ Mahindra Bolero Neo model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MAHINDRA BOLERO NEO VARIANTS UPDATE ===\n');
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
    console.log('-'.repeat(70));
    for (const v of BOLERO_NEO_VARIANTS) {
        console.log(`${v.name.padEnd(40)} | ₹${(v.price / 100000).toFixed(2)}L | Diesel MT`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${BOLERO_NEO_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = BOLERO_NEO_VARIANTS[2]; // N11
        const engineSpecs = ENGINES['Diesel MT'];
        const mileageData = MILEAGE_DATA['Diesel MT'];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of BOLERO_NEO_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            const variantId = `variant-${model.brandId}-${model.id}-${sanitizedName}`;
            const engineSpecs = ENGINES['Diesel MT'];
            const mileageData = MILEAGE_DATA['Diesel MT'];
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
        console.log(`\n🎉 Mahindra Bolero Neo now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
