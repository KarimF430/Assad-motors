/**
 * Update Mahindra Bolero Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 4
 * Highlights: 1.5L mHawk75 Diesel (76 Bhp), 7-Seater (5+2), RideFlo Tech
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Image 3
// mHawk75: 1493cc, 55.9 kW @ 3600 rpm (76 Bhp), 210 Nm @ 1600-2200 rpm
const ENGINES = {
    'Diesel MT': {
        engineName: '1.5l mHawk75 Diesel BSVI',
        engineType: '3 Cylinder, Common Rail Direct Injection',
        displacement: '1493',
        engineCapacity: '1493 cc',
        power: '76 Bhp',
        maxPower: '76 Bhp',
        enginePower: '76 PS',
        torque: '210 Nm',
        engineTorque: '210 Nm @ 1600-2200 rpm',
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
        mileageEngineName: '1.5l mHawk75 Diesel MT',
        mileageCompanyClaimed: '16.9 kmpl',
        mileageCityRealWorld: '13 kmpl',
        mileageHighwayRealWorld: '16 kmpl',
        mileageCity: '13',
        mileageHighway: '16',
        engineSummary: 'Rugged mHawk75 diesel with RideFlo Tech for challenging terrains.'
    }
};

// Common Specs from Image 3
const COMMON_SPECS = {
    length: '3995',
    width: '1745',
    height: '1880',
    wheelbase: '2680',
    groundClearance: '180',
    bootSpace: 'Third Row Foldable',
    fuelTankCapacity: '60 Litres',
    seatingCapacity: '7',
    seatingConfig: '5+2 Configuration',
    doors: '5',

    tyreSize: '215/75 R15',

    // Suspension
    frontSuspension: 'IFS Coil Spring',
    rearSuspension: 'Rigid Leaf Spring',
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Standard Safety
    airbags: '2',
    airbagsLocation: 'Driver, Passenger',
    abs: 'Yes',
    engineImmobilizer: 'Yes',
    reverseParkingSensors: 'Yes',
    seatbeltWarning: 'Yes (Front Facing Seats)',
};

function getVariantFeatures(variantName: string) {
    const isB4 = variantName.includes('B4');
    const isB6 = variantName.includes('B6') && !variantName.includes('B6 Opt');
    const isB6Opt = variantName.includes('B6 Opt');
    const isB8 = variantName.includes('B8');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';

    let keyFeaturesArr: string[] = [];
    let summary = `The Bolero ${variantName} `;

    // ======= B4 BASE FEATURES (from Images 1 & 2) =======
    // Design
    features.frontGrille = 'Black';
    features.fogLamps = 'No';
    features.alloyWheels = 'No (R15 Steel)';
    features.wheelCaps = 'No';
    features.spareWheelCover = 'Yes';
    features.centreBezelCubic = 'No';
    features.sideCladding = 'Yes';

    // Comfort
    features.ac = 'Yes';
    features.heater = 'Yes';
    features.demister = 'Yes';
    features.seatingCapacity = '7';
    features.seatUpholstery = 'Vinyl';
    features.rideFloTech = 'Yes';
    features.powerSteering = 'Yes';
    features.powerWindows = 'No';
    features.centralLocking = 'No';
    features.steeringMountedControls = 'No';
    features.powerOutlet12V = 'No';
    features.usbCCharging = 'No';
    features.mapPockets = 'No';
    features.bottleHolderDoor = 'No';
    features.mobileHolderPouch = 'Yes';
    features.keyWithRemote = 'No';
    features.remoteFuelLidOpener = 'Yes';
    features.rearWiper = 'No';
    features.flipKey = 'Yes';

    // Tech
    features.touchScreenInfotainment = 'No';
    features.digitalCluster = 'Yes';
    features.staticBendingHeadlamps = 'No';
    features.engineStartStop = 'Yes (Micro Hybrid)';
    features.driverInfoSystem = 'No';

    keyFeaturesArr.push('Dual Airbags', 'ABS', '7-Seater', 'RideFlo Tech', 'Micro Hybrid');

    // ======= B6 ADDS =======
    if (isB6 || isB6Opt || isB8) {
        features.frontGrille = 'Chrome Bezel';
        features.wheelCaps = 'Yes';
        features.centreBezelCubic = 'Yes';
        features.seatUpholstery = 'Fabric';
        features.demister = 'Yes';
        features.powerWindows = 'Yes';
        features.centralLocking = 'Yes';
        features.steeringMountedControls = 'Yes';
        features.powerOutlet12V = 'Yes';
        features.mapPockets = 'Yes';
        features.bottleHolderDoor = 'Yes';
        features.keyWithRemote = 'Yes';
        features.flipKey = 'Yes';
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.8 cm Touchscreen';
        features.staticBendingHeadlamps = 'Yes';

        keyFeaturesArr.push('7" Touchscreen', 'Chrome Grille', 'Power Windows');
    }

    // ======= B6 Opt ADDS =======
    if (isB6Opt || isB8) {
        features.fogLamps = 'Yes';
        features.usbCCharging = 'Yes';
        features.rearWiper = 'Yes';
        features.driverInfoSystem = 'Yes';

        keyFeaturesArr.push('Fog Lamps', 'Rear Wiper', 'Driver Info System');
    }

    // ======= B8 (Top) ADDS =======
    if (isB8) {
        features.alloyWheels = 'R15 Diamond Cut Alloy';
        features.wheelCaps = 'No'; // Alloys don't need caps
        features.seatUpholstery = 'Leatherette';

        keyFeaturesArr.push('Diamond Cut Alloys', 'Leatherette Seats');
    }

    features.keyFeatures = keyFeaturesArr.slice(0, 6).join(', ');

    if (isB4) {
        summary += 'offers bare-bones ruggedness with essential safety.';
    } else if (isB6) {
        summary += 'adds touchscreen and chrome styling for better comfort.';
    } else if (isB6Opt) {
        summary += 'brings fog lamps and rear wiper for all-weather capability.';
    } else if (isB8) {
        summary += 'is the flagship with alloys and leatherette interiors.';
    }

    features.headerSummary = summary;
    features.description = summary + ' The legendary workhorse.';

    return features;
}

const BOLERO_VARIANTS = [
    { name: 'Bolero B4 Diesel MT', price: 878000 },
    { name: 'Bolero B6 Diesel MT', price: 896000 },
    { name: 'Bolero B8 Diesel MT', price: 969000 },
    { name: 'Bolero B6 Opt Diesel MT', price: 977000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    let model = await Model.findOne({ id: 'model-brand-mahindra-bolero' }).lean();
    if (!model) {
        model = await Model.findOne({ name: { $regex: /^Bolero$/i } }).lean();
    }
    if (!model) {
        console.error('❌ Mahindra Bolero model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MAHINDRA BOLERO VARIANTS UPDATE ===\n');
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
    console.log('-'.repeat(60));
    for (const v of BOLERO_VARIANTS) {
        console.log(`${v.name.padEnd(35)} | ₹${(v.price / 100000).toFixed(2)}L | Diesel MT`);
    }
    console.log('-'.repeat(60));
    console.log(`Total: ${BOLERO_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = BOLERO_VARIANTS[2]; // B8
        const engineSpecs = ENGINES['Diesel MT'];
        const mileageData = MILEAGE_DATA['Diesel MT'];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of BOLERO_VARIANTS) {
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
        console.log(`\n🎉 Mahindra Bolero now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
