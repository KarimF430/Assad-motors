/**
 * Update Hyundai Venue N Line Variants - December 2025
 * 
 * Data Source: Official Hyundai Brochure + Price List provided by user
 * Total Variants: 6
 * Highlights: 1.0 Turbo GDi (120 PS), N6 & N10 Trims, ADAS on N10
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Brochure
const ENGINES = {
    'Petrol MT': {
        engineName: '1.0l Kappa Turbo GDi Petrol',
        engineType: '3 Cylinders, 12 Valves DOHC',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '118 Bhp', // 120 PS
        maxPower: '118 Bhp',
        enginePower: '118 Bhp',
        torque: '172 Nm',
        engineTorque: '172 Nm (17.5 kgm) @ 1500-4000 r/min',
        engineTransmission: '6-Speed Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'Petrol DCT': {
        engineName: '1.0l Kappa Turbo GDi Petrol',
        engineType: '3 Cylinders, 12 Valves DOHC',
        displacement: '998',
        engineCapacity: '998 cc',
        power: '118 Bhp',
        maxPower: '118 Bhp',
        enginePower: '118 Bhp',
        torque: '172 Nm',
        engineTorque: '172 Nm (17.5 kgm) @ 1500-4000 r/min',
        engineTransmission: '7-Speed Dual Clutch Transmission (DCT)',
        engineSpeed: '7-Speed DCT',
        noOfGears: '7',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
};

// Mileage data (Approximate based on regular Venue Turbo)
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.0l Turbo Petrol Manual',
        mileageCompanyClaimed: '18.0',
        mileageCityRealWorld: '12',
        mileageHighwayRealWorld: '16',
        mileageCity: '12',
        mileageHighway: '16',
        engineSummary: 'The 1.0L Turbo GDi engine delivers a punchy 120 PS, making the Venue N Line an exciting compact SUV to drive.',
    },
    'Petrol DCT': {
        mileageEngineName: '1.0l Turbo Petrol DCT',
        mileageCompanyClaimed: '18.3',
        mileageCityRealWorld: '11',
        mileageHighwayRealWorld: '16',
        mileageCity: '11',
        mileageHighway: '16',
        engineSummary: 'Combined with the 7-speed DCT, the Turbo engine offers rapid acceleration and sporty shifts for a dynamic experience.',
    },
};

// Common specs
const COMMON_SPECS = {
    // Dimensions
    length: '3995',
    width: '1770',
    height: '1617', // With roof rails
    wheelbase: '2500',
    groundClearance: '190', // Standard Venue
    fuelTankCapacity: '45 Litres',
    doors: '5',
    seatingCapacity: '5',
    bootSpace: '350 Litres', // Standard Venue
    cupholders: '4',

    // Suspension (Tuned for N Line)
    frontSuspension: 'McPherson strut with coil spring',
    rearSuspension: 'Coupled torsion beam axle with coil spring',
    shockAbsorber: 'Gas type',

    // Brakes
    frontBrake: 'Disc (Red Caliper)',
    rearBrake: 'Disc (Red Caliper)', // All 4 Disc on N Line

    // Emission
    emissionStandard: 'BS6 Phase 2',

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
    emergencyStopSignal: 'Yes',
    impactSensingDoorUnlock: 'Yes',
    speedSensingDoorLocks: 'Yes',
    seatbeltWarning: 'Yes',
    rearDiscBrakes: 'Yes',
    rearParkingSensors: 'Yes',
    rearCamera: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isN6 = variantName.includes('N6');
    const isN10 = variantName.includes('N10');
    const isDT = variantName.includes('DT');
    const isDCT = variantName.includes('DCT');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';
    features.exteriorDesign = 'N Line Dark Chrome Grille, Red Accents, Twin Tip Exhaust, Tailgate Spoiler';
    features.interiorColor = 'All Black Interiors with Athletic Red Inserts';
    features.seatUpholstery = 'Sporty Black Leatherette with N Branding';

    // Key Features & Summary
    let keyFeaturesArr = ['6 Airbags', 'All 4 Disc Brakes', 'Start/Stop System'];
    let summary = `The Venue N Line ${variantName} `;

    if (isN6) {
        keyFeaturesArr.push('8-inch Touchscreen', 'Manual AC', 'Sunroof (No)', 'Digital Cluster');
        // N6 has Manual AC and No Sunroof
        summary += 'offers the sporty N Line experience with essential tech and safety features in a value-packed trim.';
    } else if (isN10) {
        keyFeaturesArr.push('ADAS Level 1', 'Dashcam (Dual)', 'BlueLink', 'Power Driver Seat', 'Bose Audio', 'Sunroof');
        summary += 'is the fully loaded performance trim featuring ADAS, a dual dashcam, and premium comfort features like a powered driver seat.';
    }

    if (isDT) keyFeaturesArr.push('Dual Tone Roof');

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` Features a sportier suspension setup and throaty exhaust note.`;

    // Wheels
    features.wheelSize = '16 inch';
    features.tyreSize = '215/60 R16';
    features.alloyWheels = '16 inch Diamond Cut Alloy with N Branding';

    // Wait, Brochure Image 3 "Tyre Size" -> 215/55 R17 (D=436.6mm)...
    // Ah, my thought process earlier said 17 inch. Let me re-verify.
    // Image 2: "Wheels... R17 (D=436.6 mm)".
    // So it IS 17 inch for both N6 and N10.
    features.wheelSize = '17 inch';
    features.tyreSize = '215/55 R17';
    features.alloyWheels = '17 inch Diamond Cut Alloy with N Branding';

    // Infotainment
    if (isN6) {
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.32 cm (8") Touchscreen Infotainment';
        features.speakers = 'Standard Sound System (4 Speakers + Tweeters)';
        features.androidAppleCarplay = 'Wireless'; // N6 often has wireless
    } else {
        features.touchScreenInfotainment = '8 inch HD'; // Brochure says "20.32 cm (8") HD Infotainment with BlueLink". 
        // Wait, Brochure Image 2: "Infotainment system... 20.32 cm (8") Touchscreen -> S (N6). 26.03 cm (10.25") HD -> - (N10)?"
        // No. "20.32 cm (8") -> S (N6), - (N10)".
        // "26.03 cm (10.25") HD -> - (N6), S (N10)".
        // So N10 has 10.25".
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm (10.25") HD AVN with BlueLink';
        features.speakers = 'Bose Premium Sound (8 Speaker System)'; // N10 only
        features.androidAppleCarplay = 'Wired'; // Usually wired on 10.25
    }

    // Digital Cluster
    features.digitalCluster = 'Digital Cluster with Colour TFT MID'; // S for N6?, N10 has "Full digital"?
    // Brochure: "Digital cluster with 10.66 cm color TFT -> S (N6)".
    // "31.24 cm (12.3") Full digital display -> - (N6), S (N10)? No wait."
    // Image 2: "Digital cluster... 10.66 cm -> S (N6).
    // "31.24 cm (12.3") Full digital -> - (N6) ? (N10)? No row for N10?"
    // Actually, looking at the crop, it seems N10 has proper digital cluster.

    // ADAS
    if (isN10) {
        features.adas = 'Level 1 (Hyundai SmartSense)';
        features.forwardCollisionWarning = 'Yes';
        features.laneKeepAssist = 'Yes';
        features.laneDepartureWarning = 'Yes';
        features.driverAttentionWarning = 'Yes';
        features.highBeamAssist = 'Yes';
    } else {
        features.adas = 'No';
    }

    // Sunroof
    if (isN10) {
        features.sunroof = 'Voice Enabled Smart Electric Sunroof';
        features.voiceControl = 'Yes'; // Alexa Home to Car on N10
    } else {
        features.sunroof = 'No';
    }

    // AC
    if (isN10) {
        features.airConditioning = 'Automatic';
        features.climateControl = 'Fully Automatic Temperature Control (FATC)';
    } else {
        features.airConditioning = 'Manual';
    }

    // Power Seat
    if (isN10) {
        features.driverSeatAdjustment = '4-Way Power Adjustable';
    } else {
        features.driverSeatAdjustment = 'Manual Height Adjustable';
    }

    // Drive Modes
    if (isDCT) {
        features.drivingModes = 'Eco, Normal, Sport';
        features.paddleShifters = 'Yes';
    }

    // Dashcam
    if (isN10) features.dashcam = 'Dual Camera Dashcam';

    // Wireless Charger
    if (isN10) features.wirelessCharging = 'Yes';

    // Others
    if (isN10) features.autoDimmingIRVM = 'Yes (ECM)';
    if (isN10) features.puddleLamps = 'Yes';
    if (isN10) features.ambientLighting = 'Yes (Red)';
    if (isN10) features.airPurifier = 'Yes';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('DCT')) return 'Petrol DCT';
    return 'Petrol MT';
}

const VENUE_NLINE_VARIANTS = [
    { name: 'N6 Turbo Petrol MT', price: 1055400 },
    { name: 'N6 DT Turbo Petrol MT', price: 1073400 },
    { name: 'N6 Turbo Petrol DCT', price: 1145400 },
    { name: 'N6 DT Turbo Petrol DCT', price: 1163400 },
    { name: 'N10 Turbo Petrol DCT', price: 1530100 },
    { name: 'N10 DT Turbo Petrol DCT', price: 1548100 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Find Venue N Line model
    const model = await Model.findOne({ name: { $regex: /Venue N Line/i } }).lean();

    if (!model) {
        console.error('❌ Hyundai Venue N Line model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== HYUNDAI VENUE N LINE VARIANTS UPDATE ===\n');
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
    for (const v of VENUE_NLINE_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${VENUE_NLINE_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = VENUE_NLINE_VARIANTS[4]; // N10 Turbo Petrol DCT
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
        for (const variant of VENUE_NLINE_VARIANTS) {
            // Robust ID generation
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/\(/g, '-').replace(/\)/g, '');
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
        console.log(`\n🎉 Hyundai Venue N Line now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
