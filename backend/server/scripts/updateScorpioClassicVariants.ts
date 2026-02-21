/**
 * Update Mahindra Scorpio Classic Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Image
 * Total Variants: 4
 * Highlights: 2.2L mHawk Diesel (132 Bhp), 7/9 Seater, Micro Hybrid
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Image
// mHawk: 2184cc, 97 kW @ 3750 rpm (132 Bhp), 300 Nm @ 1600-2800 rpm
const ENGINES = {
    'Diesel MT': {
        engineName: '2.2l mHawk Diesel',
        engineType: '4 Cylinder, Common Rail Direct Injection, Variable Geometry Turbo',
        displacement: '2184',
        engineCapacity: '2184 cc',
        power: '132 Bhp',
        maxPower: '132 Bhp',
        enginePower: '132 PS',
        torque: '300 Nm',
        engineTorque: '300 Nm @ 1600-2800 rpm',
        engineTransmission: '6-Speed Manual (Cable Shift)',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        isHybrid: true,
        hybridType: 'Micro Hybrid'
    }
};

const MILEAGE_DATA = {
    'Diesel MT': {
        mileageEngineName: '2.2l mHawk Diesel MT',
        mileageCompanyClaimed: '15.4 kmpl',
        mileageCityRealWorld: '11 kmpl',
        mileageHighwayRealWorld: '14 kmpl',
        mileageCity: '11',
        mileageHighway: '14',
        engineSummary: 'Legendary mHawk diesel with Micro Hybrid technology for efficiency.'
    }
};

// Common Specs from Image
const COMMON_SPECS = {
    length: '4456',
    width: '1820',
    height: '1995',
    wheelbase: '2680',
    groundClearance: '200',
    bootSpace: 'Third Row (Configurable)',
    fuelTankCapacity: '60 Litres',
    doors: '5',

    // Tyres
    tyreSize: '235/65 R17 Radial Tubeless',

    // Suspension
    frontSuspension: 'Double Wish-bone Type, Independent Front Coil Spring',
    rearSuspension: 'Multi Link Coil Spring with Anti-roll Bar',
    suspensionType: 'Hydraulic Double Acting, Telescopic Shock Absorber',
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Safety Standard
    airbags: '2',
    airbagsLocation: 'Driver, Passenger',
    abs: 'Yes',
    ebd: 'Yes',
    panicBrakeIndication: 'Yes',
    collapsibleSteering: 'Yes',
    engineImmobilizer: 'Yes',
    antiTheftWarning: 'Yes',
    seatbeltWarning: 'Yes (Driver & Co-driver)',
    speedAlert: 'Yes',
    autoDoorLock: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isS = variantName.includes('S Diesel') && !variantName.includes('S 11');
    const isS9 = variantName.includes('9 Seater');
    const isS11 = variantName.includes('S 11');
    const is7CC = variantName.includes('7CC');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';

    let keyFeaturesArr: string[] = [];
    let summary = `The Scorpio Classic ${variantName} `;

    // Seating Configuration
    if (isS9) {
        features.seatingCapacity = '9';
        features.seatingConfig = '9-Side Facing';
    } else if (is7CC) {
        features.seatingCapacity = '7';
        features.seatingConfig = '7-Captain Chair';
    } else {
        features.seatingCapacity = '7';
        features.seatingConfig = '7-Side Facing';
    }

    // ======= Classic S BASE FEATURES =======
    features.headLights = 'Projector with LED Eyebrows';
    features.ledDRL = 'Yes';
    features.ledTailLamps = 'Yes';
    features.alloyWheels = 'No (Steel)';
    features.wheelCover = 'No';
    features.frontGrille = 'Black Inserts';
    features.sideCladding = 'Unpainted';
    features.fenderBezel = 'Black';
    features.skiRack = 'Yes';
    features.spoiler = 'Yes';
    features.silverSkidPlate = 'Yes';
    features.bonnetScoop = 'Yes';
    features.centreHighMountStopLamp = 'Yes';

    // Comfort
    features.seatUpholstery = 'Vinyl';
    features.fauxLeatherSteering = 'Yes';
    features.rearACVents = 'Yes (2nd Row)';
    features.powerWindowSwitches = 'Console';
    features.antiPinchWindow = 'Yes (Smart Driver)';
    features.extendedPowerWindow = 'Yes';
    features.tiltSteering = 'Yes';
    features.rearWashWipe = 'Yes (Aeroblade)';
    features.rearDemister = 'Yes';
    features.centralLocking = 'Manual';
    features.followMeHomeHeadlamps = 'Yes';
    features.leadMeToVehicle = 'Yes';
    features.hydraulicAssistedBonnet = 'Yes';
    features.headlampLevelling = 'Yes';

    // Tech
    features.touchScreenInfotainment = '9 inch';
    features.infotainmentScreen = '22.86 cm Touchscreen with Bluetooth/USB/Aux';
    features.intellipark = 'Yes';
    features.microHybrid = 'Yes';
    features.gearShiftIndicator = 'Yes';
    features.climateControl = 'Automatic (FATC)';
    features.orvm = 'Manual';

    keyFeaturesArr.push('Dual Airbags', 'ABS', '9" Touchscreen', 'Micro Hybrid', 'FATC');

    // ======= Classic S11 ADDS =======
    if (isS11) {
        features.alloyWheels = 'Diamond Cut Alloy';
        features.frontGrille = 'Chrome Inserts';
        features.sideCladding = 'Painted';
        features.fenderBezel = 'Silver Finish';
        features.frontFogLamps = 'Yes';
        features.chromeFinishACVents = 'Yes';
        features.seatUpholstery = 'Fabric';
        features.armRestFrontSeats = 'Yes';
        features.heightAdjusterDriverSeat = 'Yes';
        features.steeringMountedControls = 'Audio + Cruise';
        features.cruiseControl = 'Yes';
        features.powerWindowSwitches = 'On Door Trim';
        features.roofMountedSunglassHolder = 'Yes';
        features.oneTouchLaneChange = 'Yes';
        features.roofLamp = 'Yes';
        features.mobilePocket = 'Yes (Centre Console)';
        features.orvm = 'Electric';
        features.speakers = 'Yes (with Tweeters)';
        features.staticBendingHeadlamps = 'Yes';

        keyFeaturesArr.push('Diamond Cut Alloys', 'Cruise Control', 'Static Bending Headlamps');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isS || isS9) {
        summary += 'delivers rugged capability with essential comfort features.';
    } else if (isS11) {
        summary += 'brings premium styling with alloy wheels and cruise control.';
    }

    features.headerSummary = summary;
    features.description = summary + ' The timeless Scorpio design lives on.';

    return features;
}

const SCORPIO_CLASSIC_VARIANTS = [
    { name: 'Scorpio Classic S Diesel', price: 1298000 },
    { name: 'Scorpio Classic S 9 Seater Diesel', price: 1319000 },
    { name: 'Scorpio Classic S 11 7CC Diesel', price: 1670000 },
    { name: 'Scorpio Classic S 11 Diesel', price: 1670000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Try exact ID first
    let model = await Model.findOne({ id: 'model-brand-mahindra-scorpio-classic' }).lean();
    if (!model) {
        model = await Model.findOne({ id: 'model-brand-mahindra-scorpio' }).lean();
    }
    if (!model) {
        model = await Model.findOne({ name: { $regex: /Scorpio Classic/i } }).lean();
    }
    if (!model) {
        console.error('❌ Mahindra Scorpio Classic model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MAHINDRA SCORPIO CLASSIC VARIANTS UPDATE ===\n');
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
    for (const v of SCORPIO_CLASSIC_VARIANTS) {
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | Diesel MT`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${SCORPIO_CLASSIC_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = SCORPIO_CLASSIC_VARIANTS[3]; // S 11
        const engineSpecs = ENGINES['Diesel MT'];
        const mileageData = MILEAGE_DATA['Diesel MT'];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of SCORPIO_CLASSIC_VARIANTS) {
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
        console.log(`\n🎉 Mahindra Scorpio Classic now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
