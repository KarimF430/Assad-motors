/**
 * Update Maruti Suzuki Celerio Variants - December 2025
 * 
 * Data Source: Official Brochure + User Price List
 * Total Variants: 8
 * Highlights: India's Most Fuel Efficient Petrol Car, K10C Engine, Hill Hold Assist, 15" Alloys
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs (K10C - Same as S-Presso/Alto K10 but tuned/geared slightly differently for mileage)
// Brochure: Max Output 49kW@5500rpm (67 PS), Torque 89Nm@3500rpm. CNG: 41.7kW (57 PS), 82.1Nm.
const ENGINES = {
    'Petrol MT': {
        engineName: '1.0L K10C Next-Gen',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '66 Bhp', // 67 PS
        maxPower: '66 Bhp',
        enginePower: '67 PS',
        torque: '89 Nm',
        engineTorque: '89 Nm @ 3500 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'Petrol AGS': {
        engineName: '1.0L K10C Next-Gen AGS',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '66 Bhp',
        maxPower: '66 Bhp',
        enginePower: '67 PS',
        torque: '89 Nm',
        engineTorque: '89 Nm @ 3500 rpm',
        engineTransmission: '5-Speed AGS (Auto Gear Shift)',
        engineSpeed: '5-Speed AGS',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'CNG MT': {
        engineName: '1.0L K10C S-CNG',
        engineType: 'K-Series Dual Jet, Dual VVT',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '56 Bhp', // 56.6 PS
        maxPower: '56 Bhp',
        enginePower: '57 PS',
        torque: '82 Nm',
        engineTorque: '82.1 Nm @ 3400 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'CNG',
        fuel: 'CNG',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
};

// Mileage data (Celerio is marketed as India's Most Fuel Efficient Petrol Car)
// VXi AGS: 26.68 kmpl! ZXi+ AGS: 26.00. MT: 25.24 (V/Z/Z+), 24.97 (L). CNG: 35.60 km/kg.
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.0l Petrol Manual',
        mileageCompanyClaimed: '25.24',
        mileageCityRealWorld: '20',
        mileageHighwayRealWorld: '23',
        mileageCity: '20',
        mileageHighway: '23',
        engineSummary: 'The most fuel-efficient petrol car in its segment, ensuring maximum savings on every drive.',
    },
    'Petrol AGS': {
        mileageEngineName: '1.0l Petrol AGS',
        mileageCompanyClaimed: '26.68', // Highest
        mileageCityRealWorld: '21',
        mileageHighwayRealWorld: '24',
        mileageCity: '21',
        mileageHighway: '24',
        engineSummary: 'The AGS variant delivers record-breaking efficiency of 26.68 kmpl along with automatic convenience.',
    },
    'CNG MT': {
        mileageEngineName: '1.0l S-CNG',
        mileageCompanyClaimed: '35.60 km/kg',
        mileageCityRealWorld: '30 km/kg',
        mileageHighwayRealWorld: '33 km/kg',
        mileageCity: '30',
        mileageHighway: '33',
        engineSummary: 'With factory-fitted S-CNG tech, the Celerio delivers incredible mileage of 35.60 km/kg.',
    },
};

// Common specs
const COMMON_SPECS = {
    length: '3695',
    width: '1655',
    height: '1555',
    wheelbase: '2435',
    groundClearance: '170', // Standard for Celerio
    fuelTankCapacity: '32 Litres', // CNG: 60L water equiv
    doors: '5',
    seatingCapacity: '5',
    bootSpace: '313 Litres', // Class leading

    // Suspension
    frontSuspension: 'MacPherson strut with Coil Spring',
    rearSuspension: 'Torsion Beam with Coil Spring',

    // Brakes
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Drum',

    // Safety
    airbags: '2', // Dual Front
    abs: 'Yes',
    seatbeltWarning: 'Yes',
    parkingSensors: 'Rear',
    speedAlertSystem: 'Yes',
    engineImmobilizer: 'Yes',
    pedestrianProtection: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isLXi = variantName.includes('LXi');
    const isVXi = variantName.includes('VXi');
    const isZXi = variantName.includes('ZXi') && !variantName.includes('ZXi+');
    const isZXiPlus = variantName.includes('ZXi+');
    const isAGS = variantName.includes('AGS');
    const isCNG = variantName.includes('CNG');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Wheels
    if (isZXiPlus) {
        features.wheelSize = '15 inch';
        features.tyreSize = '175/60 R15';
        features.alloyWheels = 'Yes (Black Painted)';
    } else {
        features.wheelSize = '14 inch';
        features.tyreSize = '165/70 R14';
        features.alloyWheels = isZXi ? 'No (Full Wheel Covers)' : 'No (Center Cap)';
        if (isVXi) features.alloyWheels = 'No (Full Wheel Covers)';
    }

    // Key Features Sequence
    let keyFeaturesArr = ['Idle Start Stop', 'Dual Airbags', 'Rear Parking Sensors'];
    let summary = `The Celerio ${variantName} `;

    features.powerSteering = 'Electric Power Steering'; // Standard across all? LXi Brochure says yes.

    if (isLXi) {
        summary += 'offers the essentials with best-in-class mileage and standard safety features.';
        features.airConditioning = 'Manual AC'; // LXi has basic AC
        features.powerWindows = 'No';
        features.centralLocking = 'No';
    } else if (isVXi) {
        keyFeaturesArr.push('All 4 Power Windows', 'Electrically Adjustable ORVMs', '14" Full Wheel Covers');
        summary += 'adds convenience with power windows, electric mirrors, and body-colored accents.';
        features.airConditioning = 'Manual AC';
        features.powerWindows = 'Front & Rear';
        features.centralLocking = 'Yes';
        features.adjustableORVM = 'Electrically Adjustable';
        features.bodyColouredBumpers = 'Yes';
        features.bodyColouredDoorHandles = 'Yes';
    } else if (isZXi) {
        keyFeaturesArr.push('SmartPlay Dock', 'Steering Mounted Controls', 'Tilt Steering', 'Rear Wiper');
        summary += 'enhances the experience with steering controls, tilt steering, and a superior audio system.';
        features.airConditioning = 'Manual AC';
        features.powerWindows = 'Front & Rear';
        features.centralLocking = 'Remote Keyless Entry'; // ZXi has remote
        features.adjustableORVM = 'Electrically Adjustable';
        features.rearWiper = 'Yes';
        features.display = 'Tachometer';
    } else if (isZXiPlus) {
        keyFeaturesArr.push('Push Button Start', 'SmartPlay Studio 7"', '15" Alloys', 'Height Adjustable Driver Seat');
        summary += 'is the fully loaded variant with push-button start, touchscreen infotainment, and stylish 15-inch alloy wheels.';
        features.airConditioning = 'Manual AC'; // ZXi+ also Manual AC? Brochure check: Dial-Type Climate Control (Manual). Celerio doesn't have Auto AC.
        features.powerWindows = 'Front & Rear';
        features.centralLocking = 'Remote Keyless Entry'; // Smart Key
        features.pushButtonStart = 'Yes';
        features.heightAdjustableDriverSeat = 'Yes';
        features.fogLamps = 'Front';
        features.electricallyFoldableORVM = 'Yes';
    }

    // Hill Hold
    if (isAGS) {
        keyFeaturesArr.push('Hill Hold Assist');
        features.hillHoldAssist = 'Yes';
    } else {
        features.hillHoldAssist = 'No';
    }

    // Infotainment
    if (isLXi) {
        features.touchScreenInfotainment = 'No';
        features.speakers = 'No';
    } else if (isVXi) {
        features.touchScreenInfotainment = 'No';
        features.speakers = 'No'; // VXi Brochure: No SmartPlay Dock, No Speakers? Wait.
        // Row: SmartPlay Dock -> ZXi (Tick), VXi (X).
        // Row: Speakers -> ZXi (4), VXi (X).
        // Wow, VXi has no audio?
    } else if (isZXi) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'SmartPlay Dock (Phone Connection)';
        features.speakers = '4 Speakers';
        features.bluetooth = 'Yes';
    } else if (isZXiPlus) {
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Studio';
        features.speakers = '4 Speakers';
        features.androidAppleCarplay = 'Wired';
    }

    // CNG
    if (isCNG) {
        features.fuelTankCapacity = '60 Litres (Water Equiv) + 32 Litres (Petrol)';
        features.bootSpace = 'Reduced (Cylinder)';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' Experience the 3D Organic Sculpted Design.';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AGS')) return 'Petrol AGS';
    return 'Petrol MT';
}

const CELERIO_VARIANTS = [
    { name: 'Celerio LXi MT', price: 469900 },
    { name: 'Celerio VXi MT', price: 515900 },
    { name: 'Celerio VXi AGS', price: 560900 },
    { name: 'Celerio ZXi MT', price: 570900 },
    { name: 'Celerio VXi CNG', price: 597900 },
    { name: 'Celerio ZXi AGS', price: 615900 },
    { name: 'Celerio ZXi+ MT', price: 627900 },
    { name: 'Celerio ZXi+ AGS', price: 672900 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    console.log('Script started...');
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found in environment!');
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Celerio/i } }).lean();

    if (!model) {
        console.error('❌ Maruti Suzuki Celerio model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI CELERIO VARIANTS UPDATE ===\n');
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
    for (const v of CELERIO_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${CELERIO_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = CELERIO_VARIANTS[6]; // ZXi+ MT
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
        for (const variant of CELERIO_VARIANTS) {
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
        console.log(`\n🎉 Maruti Suzuki Celerio now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
