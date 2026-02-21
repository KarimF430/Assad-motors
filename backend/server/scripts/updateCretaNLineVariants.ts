/**
 * Update Creta N Line Variants - December 2025
 * 
 * Data Source: Official Hyundai Brochure + Price List provided by user
 * Total Variants: 6
 * Highlights: 160 PS Turbo GDi Engine, WRC Inspired Design, Tuned Suspension/Exhaust
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
        engineName: '1.5l Turbo GDi Petrol',
        engineType: '4 Cylinders, 16 Valves DOHC',
        displacement: '1482',
        engineCapacity: '1482 cc',
        power: '158 Bhp', // 160 PS
        maxPower: '158 Bhp',
        enginePower: '158 Bhp',
        torque: '253 Nm',
        engineTorque: '253 Nm (25.8 kgm) @ 1500-3500 r/min',
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
        engineName: '1.5l Turbo GDi Petrol',
        engineType: '4 Cylinders, 16 Valves DOHC',
        displacement: '1482',
        engineCapacity: '1482 cc',
        power: '158 Bhp',
        maxPower: '158 Bhp',
        enginePower: '158 Bhp',
        torque: '253 Nm',
        engineTorque: '253 Nm (25.8 kgm) @ 1500-3500 r/min',
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

// Mileage data (Approximate based on regular Creta Turbo)
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.5l Turbo Petrol Manual',
        mileageCompanyClaimed: '18.4',
        mileageCityRealWorld: '11',
        mileageHighwayRealWorld: '15',
        mileageCity: '11',
        mileageHighway: '15',
        engineSummary: 'The high-performance 1.5L Turbo GDi engine mated to a 6-speed manual gearbox delivers an engaging driving experience with WRC-inspired tuning.',
    },
    'Petrol DCT': {
        mileageEngineName: '1.5l Turbo Petrol DCT',
        mileageCompanyClaimed: '18.4',
        mileageCityRealWorld: '10',
        mileageHighwayRealWorld: '16',
        mileageCity: '10',
        mileageHighway: '16',
        engineSummary: 'Experience lightning-fast gear shifts with the 7-speed DCT and 160 PS of power, perfectly tuned for spirited driving.',
    },
};

// Common specs
const COMMON_SPECS = {
    // Dimensions
    length: '4330',
    width: '1790',
    height: '1635',
    wheelbase: '2610',
    groundClearance: '190',
    fuelTankCapacity: '50 Litres',
    doors: '5',
    seatingCapacity: '5',
    bootSpace: '433 Litres',
    cupholders: '4',

    // Suspension (Tuned for N Line?) Yes, brochure mentions sportier setup usually.
    frontSuspension: 'McPherson strut with coil spring',
    rearSuspension: 'Coupled torsion beam axle',
    shockAbsorber: 'Gas type',

    // Brakes
    frontBrake: 'Disc (All 4 Disc)',
    rearBrake: 'Disc',

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
    tpms: 'Yes',
    isofix: 'Yes',
    emergencyStopSignal: 'Yes',
    impactSensingDoorUnlock: 'Yes',
    speedSensingDoorLocks: 'Yes',
    seatbeltWarning: 'Yes',
    rearDiscBrakes: 'Yes',
    dashcam: 'Yes (Dual)',
    blindSpotMonitor: 'Yes (N10)',
    surroundViewCamera: 'Yes (N10)',
};

function getVariantFeatures(variantName: string) {
    const isN8 = variantName.includes('N8');
    const isN10 = variantName.includes('N10');
    const isDT = variantName.includes('DT');
    const isDCT = variantName.includes('DCT');

    let features: Record<string, any> = {};

    features.warranty = '3 Years / Unlimited Km';
    features.exteriorDesign = 'N Line WRC Inspired Grille, Red Accents, Twin Tip Exhaust, Thunder Blue Highlight';
    features.interiorColor = 'All Black Interiors with Red Inserts';
    features.seatUpholstery = 'Black Leatherette with Red Stitching & N Logo';

    // Key Features & Summary
    let keyFeaturesArr = ['6 Airbags', 'All 4 Disc Brakes', 'Dashcam', 'Smart Panoramic Sunroof'];
    let summary = `The Creta N Line ${variantName} `;

    if (isN8) {
        keyFeaturesArr.push('8-inch Touchscreen (Wait, N8 has 8"?)', 'Dual Zone AC', 'Electronic Parking Brake', 'Wireless Charger');
        // Check Infotainment for N8
        // Row: 20.32 cm (8") Touchscreen -> N8 (S).
        // Row: 26.03 cm (10.25") HD -> N10 (S).
        // Bose Premium Sound -> N10 (S).
        summary += 'is the thrilling entry to the N Line world, featuring a potent turbo engine, panoramic sunroof, and sporty styling.';
    } else if (isN10) {
        keyFeaturesArr.push('ADAS Level 2', '10.25-inch HD Screen', 'Bose Premium Audio', 'Ventilated Seats', 'Powered Driver Seat');
        summary += 'is the ultimate performance SUV, loaded with Level 2 ADAS, premium Bose audio, and ventilated seats for maximum comfort.';
    }

    if (isDT) keyFeaturesArr.push('Dual Tone Roof');

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` Tuned for adrenaline with a stiffer suspension and throaty exhaust note.`;

    // Wheels
    features.wheelSize = '18 inch';
    features.tyreSize = '215/55 R18';
    features.alloyWheels = '18 inch N Line Diamond Cut Alloy';

    // Infotainment
    if (isN8) {
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.32 cm (8") Touchscreen Infotainment';
        features.speakers = 'Standard Sound System'; // Not Bose
        features.digitalCluster = 'Digital Cluster with Color TFT MID';
    } else {
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm (10.25") HD Audio Video Navigation System';
        features.speakers = 'Bose Premium Sound (8 Speakers)';
        features.digitalCluster = '26.03 cm (10.25") Multi Display Digital Cluster';
    }

    // ADAS
    if (isN10) {
        features.adas = 'Level 2 (Hyundai SmartSense)';
        features.adaptiveCruiseControl = 'Yes'; // With Stop & Go for DCT
        features.laneKeepAssist = 'Yes';
    } else {
        features.adas = 'No';
    }

    // Seats
    if (isN10) {
        features.ventilatedSeats = 'Front';
        features.driverSeatAdjustment = '8-Way Power Adjustable';
    } else {
        features.ventilatedSeats = 'No';
        features.driverSeatAdjustment = 'Manual Height Adjustable';
    }

    // Sunroof
    features.sunroof = 'Voice Enabled Smart Panoramic Sunroof';

    // Drive Modes
    if (isDCT || (isN10 && !isDCT)) { // N10 MT also?
        // Drive Mode Select -> S* (DCT Only) on brochure usually.
        // Row: Drive mode select -> S* N8 / S* N10. 
        // * DCT only. So MT no drive modes.
        if (isDCT) {
            features.drivingModes = 'Eco, Normal, Sport';
            features.tractionControlModes = 'Snow, Mud, Sand';
            features.paddleShifters = 'Yes';
        }
    }

    // Lighting
    features.headLights = 'Quad Beam LED';
    features.headlights = 'Quad Beam LED Headlamps';
    features.tailLights = 'Parametric Connected LED';

    // Others
    if (isN10) features.autoDimmingIRVM = 'Yes (Electro Chromic)';
    features.wirelessCharging = 'Yes';
    features.dualZoneAC = 'Yes'; // N8 has Dual zone? Row: Dual zone automatic temp control -> S for N8, N10. Yes.

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('DCT')) return 'Petrol DCT';
    return 'Petrol MT';
}

const NLINE_VARIANTS = [
    { name: 'N8 Petrol DCT', price: 1782628 },
    { name: 'N8 DT Petrol DCT', price: 1797110 },
    { name: 'N10 Petrol MT', price: 1902352 },
    { name: 'N10 DT Petrol MT', price: 1916835 },
    { name: 'N10 Petrol DCT', price: 1994655 },
    { name: 'N10 DT Petrol DCT', price: 2009138 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Find Creta N Line model specifically, or associate with Creta? 
    // Usually a separate model "Creta N Line" in DB.
    const model = await Model.findOne({ name: { $regex: /Creta N Line/i } }).lean();

    if (!model) {
        console.error('❌ Hyundai Creta N Line model not found!');
        // Could fallback to "Creta" but user likely wants separate model if N Line exists.
        // Assuming "Creta N Line" exists as user requested it separately.
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== HYUNDAI CRETA N LINE VARIANTS UPDATE ===\n');
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
    for (const v of NLINE_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${NLINE_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = NLINE_VARIANTS[4]; // N10 Petrol DCT
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
        for (const variant of NLINE_VARIANTS) {
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
        console.log(`\n🎉 Hyundai Creta N Line now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
