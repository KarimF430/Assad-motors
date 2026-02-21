/**
 * Update Mahindra Bolero Neo Plus Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 2
 * Highlights: 2.2L mHawk Diesel (120 Bhp), 9-Seater (2+3+4), Micro Hybrid
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Image 3
// mHawk: 2184cc, 88.26 kW @ 4000 rpm (120 Bhp), 280 Nm @ 1800-2800 rpm
const ENGINES = {
    'Diesel MT': {
        engineName: '2.2l mHawk Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '120 Bhp',
        maxPower: '120 Bhp',
        enginePower: '120 PS',
        torque: '280 Nm',
        engineTorque: '280 Nm @ 1800-2800 rpm',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: true,
        hybridType: 'Micro Hybrid (Start-Stop)'
    }
};

const MILEAGE_DATA = {
    'Diesel MT': {
        mileageEngineName: '2.2l mHawk Diesel MT',
        mileageCompanyClaimed: '14.0 kmpl',
        mileageCityRealWorld: '10 kmpl',
        mileageHighwayRealWorld: '13 kmpl',
        mileageCity: '10',
        mileageHighway: '13',
        engineSummary: 'Torquey 2.2L mHawk diesel with Micro Hybrid for 9-seater practicality.'
    }
};

// Common Specs from Image 3
const COMMON_SPECS = {
    length: '4400',
    width: '1795',
    height: '1812',
    wheelbase: '2680',
    groundClearance: '200',
    bootSpace: 'Third Row Foldable',
    fuelTankCapacity: '60 Litres',
    seatingCapacity: '9',
    seatingConfig: '2+3+4 Configuration',
    doors: '5',

    tyreSize: '215/70 R16 Tubeless Radials',

    // Suspension
    frontSuspension: 'Double Wish-Bone with Coil Spring and Stabilizer Bar',
    rearSuspension: 'Multi-Link with Coil Spring and Stabilizer Bar',
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Standard Safety
    airbags: '2',
    airbagsLocation: 'Driver, Passenger',
    abs: 'Yes',
    ebd: 'Yes',
    engineImmobilizer: 'Yes',
    childLocks: 'Yes',
    doorAjarWarning: 'Yes',
    seatbeltWarning: 'Yes (Driver, Co-Driver, 2nd Row)',
    speedAlert: 'Yes (Audio)',
    autoDoorLock: 'Yes',
    flipKey: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isP4 = variantName.includes('P4');
    const isP10 = variantName.includes('P10');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';

    let keyFeaturesArr: string[] = [];
    let summary = `The Bolero Neo Plus ${variantName} `;

    // ======= P4 BASE FEATURES (from Images 1 & 2) =======
    // Exteriors
    features.xShapedBumpers = 'Yes';
    features.signatureGrilleChrome = 'No';
    features.alloyWheels = 'No';
    features.signatureWheelHubCaps = 'Yes';
    features.muscularSideFootstep = 'No';
    features.rearFootstep = 'Yes';
    features.xTypeSpareWheelCover = 'Body Coloured';
    features.boltableTowHooks = 'Yes (Front & Rear)';
    features.signatureSideCladding = 'Yes';

    // Interiors
    features.antiGlareIRVM = 'No';
    features.roofLamp = 'Yes (Front & Middle)';
    features.stylishCenterFacia = 'MIC Black';
    features.silverAccentACVent = 'No';
    features.touchScreenInfotainment = 'No';
    features.speakers = 'No';
    features.tweeters = 'No';
    features.steeringWheelGarnish = 'No';
    features.twinPodClusterChrome = 'No';
    features.slidingRecliningFrontSeats = 'Yes';
    features.heightAdjustableDriverSeat = 'No';
    features.armrestsFront = 'No';
    features.seatUpholstery = 'Vinyl';
    features.foldable2ndRow = 'No';
    features.armrest2ndRow = 'No';
    features.isofix = 'No';
    features.mobilePocket = 'Yes';
    features.lapBeltMiddle = 'Yes';
    features.thirdRowSideFacing = 'Yes';
    features.butterflyQuarterGlass = 'Yes';

    // Comfort & Tech
    features.headlampLevelling = 'Yes';
    features.leadMeHomeHeadlamps = 'No';
    features.followMeHomeHeadlamps = 'No';
    features.delayedPowerWindows = 'No';
    features.headlampReminder = 'Yes';
    features.illuminatedIgnitionRing = 'Yes';
    features.powerSteering = 'Yes (Hydraulic)';
    features.tiltSteering = 'Yes';
    features.powerWindows = 'Front & Rear';
    features.centralLocking = 'Yes';
    features.engineStartStop = 'Yes (Micro Hybrid)';
    features.acWithEcoMode = 'Yes';
    features.electricORVM = 'No';
    features.keylessEntry = 'No';
    features.powerOutlet12V = 'Yes';
    features.steeringMountedControls = 'No';
    features.reverseParkingSensors = 'Yes';

    // Safety
    features.rearDefogger = 'No';
    features.rearWiper = 'No';
    features.frontFogLamps = 'No';

    keyFeaturesArr.push('Dual Airbags', 'ABS+EBD', '9-Seater', 'Micro Hybrid', 'Power Steering');

    // ======= P10 ADDS (from Images 1 & 2) =======
    if (isP10) {
        // Exteriors
        features.signatureGrilleChrome = 'Yes';
        features.alloyWheels = 'Yes';
        features.muscularSideFootstep = 'Yes';
        features.xTypeSpareWheelCover = 'Deep Silver';

        // Interiors
        features.antiGlareIRVM = 'Yes';
        features.stylishCenterFacia = 'Piano Black';
        features.silverAccentACVent = 'Yes';
        features.touchScreenInfotainment = '9 inch';
        features.infotainmentScreen = '22.8 cm Touchscreen with USB, Bluetooth, Aux';
        features.speakers = '4 Speakers';
        features.tweeters = '2 Tweeters';
        features.steeringWheelGarnish = 'Yes';
        features.twinPodClusterChrome = 'Yes';
        features.heightAdjustableDriverSeat = 'Yes';
        features.armrestsFront = 'Yes';
        features.seatUpholstery = 'Fabric';
        features.foldable2ndRow = 'Yes';
        features.armrest2ndRow = 'Yes';
        features.isofix = 'Yes (with Top Tether)';

        // Comfort & Tech
        features.leadMeHomeHeadlamps = 'Yes';
        features.followMeHomeHeadlamps = 'Yes';
        features.delayedPowerWindows = 'Yes (All Four)';
        features.electricORVM = 'Yes';
        features.keylessEntry = 'Yes';
        features.steeringMountedControls = 'Yes';

        // Safety
        features.rearDefogger = 'Yes';
        features.rearWiper = 'Yes';
        features.frontFogLamps = 'Yes';

        keyFeaturesArr.push('9" Touchscreen', 'Alloy Wheels', 'ISOFIX', 'Fog Lamps');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isP4) {
        summary += 'offers 9-seater practicality with essential safety features.';
    } else if (isP10) {
        summary += 'brings touchscreen, alloys, and premium comfort for the family.';
    }

    features.headerSummary = summary;
    features.description = summary + ' The bigger Bolero for larger families.';

    return features;
}

const BOLERO_NEO_PLUS_VARIANTS = [
    { name: 'Bolero Neo Plus P4 Diesel MT', price: 1077000 },
    { name: 'Bolero Neo Plus P10 Diesel MT', price: 1180000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    let model = await Model.findOne({ id: 'model-brand-mahindra-bolero-neo-plus' }).lean();
    if (!model) {
        model = await Model.findOne({ name: { $regex: /Bolero Neo Plus/i } }).lean();
    }
    if (!model) {
        console.error('❌ Mahindra Bolero Neo Plus model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MAHINDRA BOLERO NEO PLUS VARIANTS UPDATE ===\n');
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
    for (const v of BOLERO_NEO_PLUS_VARIANTS) {
        console.log(`${v.name.padEnd(40)} | ₹${(v.price / 100000).toFixed(2)}L | Diesel MT`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${BOLERO_NEO_PLUS_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = BOLERO_NEO_PLUS_VARIANTS[1]; // P10
        const engineSpecs = ENGINES['Diesel MT'];
        const mileageData = MILEAGE_DATA['Diesel MT'];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of BOLERO_NEO_PLUS_VARIANTS) {
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
        console.log(`\n🎉 Mahindra Bolero Neo Plus now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
