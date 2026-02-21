/**
 * Update Hyundai Ioniq 5 Variants - December 2025
 * 
 * Data Source: Official Hyundai Brochure + Price List provided by user
 * Total Variants: 1 (RWD)
 * Highlights: 72.6 kWh Battery, 217 PS, 800V Ultra-Fast Charging, V2L, Vision Roof
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// EV Specs
const ENGINES = {
    'RWD': {
        engineName: 'Permanent Magnet Synchronous Motor (PMSM)',
        engineType: 'Rear Wheel Drive Electric Motor',
        displacement: '0',
        engineCapacity: '0 cc',
        power: '215 Bhp', // 217 PS = 214.something Bhp
        maxPower: '214 Bhp',
        enginePower: '217 PS',
        torque: '350 Nm',
        engineTorque: '350 Nm (35.7 kgm)',
        engineTransmission: 'Single Speed Reduction Gear',
        engineSpeed: 'Single Speed',
        noOfGears: '1',
        fuelType: 'Electric',
        fuel: 'Electric',
        transmission: 'Automatic',
        driveType: 'RWD',
        driveTrain: 'Rear Wheel Drive',
        batteryCapacity: '72.6 kWh',
        range: '631 km (ARAI)',
        chargingTimeAC: '6 h 55 min (11 kW)',
        chargingTimeDC: '18 min (10-80% @ 350 kW)', // Ultra fast
    },
};

// Mileage equivalent (Range)
const MILEAGE_DATA = {
    'RWD': {
        mileageEngineName: 'Long Range RWD 72.6 kWh',
        mileageCompanyClaimed: '631 km',
        mileageCityRealWorld: '500 km', // Estimate
        mileageHighwayRealWorld: '450 km', // Estimate
        mileageCity: '500',
        mileageHighway: '450',
        engineSummary: 'The 72.6 kWh battery pack combined with the E-GMP platform delivers a certified range of 631 km and supports ultra-fast 800V charging.',
    },
};

// Common specs
const COMMON_SPECS = {
    // Dimensions
    length: '4635',
    width: '1890',
    height: '1625', // Without shark fin? Brochure says 1625*** (Without shark fin antenna).
    wheelbase: '3000',
    groundClearance: '160', // Unladen usually around 160-170 for Ioniq 5 in India
    doors: '5',
    seatingCapacity: '5',
    bootSpace: '527 Litres', // Standard Ioniq 5
    frunk: '57 Litres', // RWD has 57L frunk

    // Suspension
    frontSuspension: 'McPherson strut',
    rearSuspension: 'Multi-link',

    // Brakes
    frontBrake: 'Disc',
    rearBrake: 'Disc',

    // Safety
    airbags: '6', // Standard
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    abs: 'Yes',
    ebd: 'Yes',
    esc: 'Yes',
    hillHoldAssist: 'Yes',
    vehicleStabilityManagement: 'Yes',
    tpms: 'Yes (Highline)',
    isofix: 'Yes',
    parkingSensors: 'Front & Rear',
    rearCamera: 'Yes',
    surroundViewCamera: 'Yes (360)',
    blindSpotMonitor: 'Yes (BVM)',
    adas: 'Level 2 (Hyundai SmartSense)',
};

function getVariantFeatures(variantName: string) {
    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km (Vehicle), 8 Years / 160,000 Km (Battery)';

    // Key Features
    let keyFeaturesArr = ['ADAS Level 2', 'Vision Roof', 'V2L (Inside & Outside)', 'Relaxation Seats', 'Bose Premium Audio'];
    let summary = `The Hyundai IONIQ 5 ${variantName} is a futuristic EV built on the E-GMP platform, offering ultra-fast charging, a spacious lounge-like interior, and cutting-edge technology.`;

    features.extras = 'Vision Roof, Virtual Engine Sound System (VESS), Active Air Flap (AAF), Flush Door Handles';
    features.interior = 'Eco-processed Leather, Magnetic Dashboard, Sliding Center Console, Dual 12.3" Screens';

    // Wheels
    features.wheelSize = '20 inch';
    features.tyreSize = '255/45 R20';
    features.alloyWheels = '20 inch Parametric Pixel Alloy Wheels';

    // Infotainment
    features.touchScreenInfotainment = '12.3 inch';
    features.infotainmentScreen = '31.19 cm (12.3") Touchscreen with Navigation';
    features.digitalCluster = '31.22 cm (12.3") Digital Cluster';
    features.speakers = 'Bose Premium Sound (8 Speakers)';
    features.androidAppleCarplay = 'Yes';
    features.connectedCarTech = 'Hyundai BlueLink';

    // Comfort
    features.sunroof = 'Vision Roof (Fixed Glass)';
    features.ventilatedSeats = 'Front (Heated & Ventilated)';
    features.heatedSeats = 'Front & Rear';
    features.driverSeatAdjustment = 'Power Adjustable with Lumbar & Memory';
    features.passengerSeatAdjustment = 'Power Adjustable with Relaxation Function';
    features.rearSeatAdjustment = 'Power Sliding & Manual Reclining';
    features.dualZoneAC = 'Yes';
    features.wirelessCharging = 'Yes';
    features.rainSensingWipers = 'Yes';
    features.ambientLighting = 'Yes (64 Colors)';

    // ADAS Features List
    features.adaptiveCruiseControl = 'Yes (Smart Cruise Control with Stop & Go)';
    features.laneKeepAssist = 'Yes';
    features.forwardCollisionWarning = 'Yes';
    features.rearCrossTrafficAlert = 'Yes';
    features.safeExitAssist = 'Yes'; // SEA

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary;

    return features;
}

const IONIQ5_VARIANTS = [
    { name: 'RWD', price: 4630000 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Ioniq/i } }).lean();

    if (!model) {
        console.error('❌ Hyundai Ioniq 5 model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== HYUNDAI IONIQ 5 VARIANTS UPDATE ===\n');
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
    for (const v of IONIQ5_VARIANTS) {
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | Electric RWD`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${IONIQ5_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = IONIQ5_VARIANTS[0];
        const engineSpecs = ENGINES['RWD'];
        const mileageData = MILEAGE_DATA['RWD'];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${Object.keys(allSpecs).length} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');
        for (const variant of IONIQ5_VARIANTS) {
            const variantId = `variant-${model.brandId}-${model.id}-rwd`; // Simple ID for single variant
            const engineSpecs = ENGINES['RWD'];
            const mileageData = MILEAGE_DATA['RWD'];
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
        console.log(`\n🎉 Hyundai Ioniq 5 now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
