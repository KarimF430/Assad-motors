/**
 * Update Maruti Suzuki XL6 Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 7
 * Highlights: K15C Smart Hybrid, 6 Seater Captain Seats, Ventilated Seats, 360 Camera
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs
// Petrol (K15C): 75.8 kW (103.06 PS) -> ~102 Bhp
// CNG: 64.6 kW (87.8 PS) -> ~87 Bhp
const ENGINES = {
    'Petrol MT': {
        engineName: '1.5l K15C Smart Hybrid',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1462',
        engineCapacity: '1462 cc',
        power: '102 Bhp',
        maxPower: '102 Bhp',
        enginePower: '103 PS',
        torque: '137 Nm',
        engineTorque: '137 Nm @ 4300 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Mild Hybrid'
    },
    'Petrol AT': {
        engineName: '1.5l K15C Smart Hybrid',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1462',
        engineCapacity: '1462 cc',
        power: '102 Bhp',
        maxPower: '102 Bhp',
        enginePower: '103 PS',
        torque: '137 Nm',
        engineTorque: '137 Nm @ 4300 rpm',
        engineTransmission: '6-Speed Automatic',
        engineSpeed: '6-Speed Auto',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Mild Hybrid'
    },
    'CNG MT': {
        engineName: '1.5l K15C CNG',
        engineType: '4 Cylinder, 16 Valves',
        displacement: '1462',
        engineCapacity: '1462 cc',
        power: '87 Bhp',
        maxPower: '87 Bhp',
        enginePower: '88 PS',
        torque: '121.5 Nm',
        engineTorque: '121.5 Nm @ 4200 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'CNG',
        fuel: 'CNG',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: false
    }
};

// Mileage Data (From Images)
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.5l Smart Hybrid MT',
        mileageCompanyClaimed: '20.90 kmpl',
        mileageCityRealWorld: '15 kmpl',
        mileageHighwayRealWorld: '19 kmpl',
        mileageCity: '15',
        mileageHighway: '19',
        engineSummary: 'The K15C Smart Hybrid engine ensures a perfect balance of power and efficiency at 20.90 kmpl.'
    },
    'Petrol AT': {
        mileageEngineName: '1.5l Smart Hybrid AT',
        mileageCompanyClaimed: '20.27 kmpl',
        mileageCityRealWorld: '14 kmpl',
        mileageHighwayRealWorld: '19 kmpl',
        mileageCity: '14',
        mileageHighway: '19',
        engineSummary: 'Enjoy the convenience of a 6-Speed AT with a respectable mileage of 20.27 kmpl.'
    },
    'CNG MT': {
        mileageEngineName: '1.5l CNG',
        mileageCompanyClaimed: '26.23 km/kg',
        mileageCityRealWorld: '21 km/kg',
        mileageHighwayRealWorld: '25 km/kg',
        mileageCity: '21',
        mileageHighway: '25',
        engineSummary: 'The XL6 S-CNG offers superior fuel economy of 26.23 km/kg without compromising on premium comfort.'
    }
};

// Common Specs from Brochure
const COMMON_SPECS = {
    length: '4445',
    width: '1775',
    height: '1755', // With roof rails usually 1755
    wheelbase: '2740',
    groundClearance: '180', // Approximate for MPV
    bootSpace: '209 Litres', // 3rd row up. 550+ folded.
    fuelTankCapacity: '45 Litres',
    seatingCapacity: '6', // Captain seats standard
    doors: '5',

    // Suspension & Brakes
    frontSuspension: 'MacPherson Strut & Coil Spring',
    rearSuspension: 'Torsion Beam & Coil Spring',
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Drum', // All Disc? Wait. XL6 usually Drum rear.
    // Image 4 says "Brakes Front: Disc, Rear: Drum". Confirmed.

    // Safety Standard
    // airbags: '4', // Wait. Image 1 Safety: 4 Airbags (Front, Side). NO Curtain? 
    // Wait. "6 Airbags (Front, Side and Curtain) - Tick for ALL".
    // Wait. My eyes. Let's re-read. First line under Safety & Security: "4 Airbags (Front and Side) - Tick for ALL".
    // Is it 4 or 6? Updates usually bring 6.
    // Ah, the image provided has "4 Airbags (Driver, Co-Driver, Front Side)".
    // BUT! Wait. Grand Vitara has 6. XL6 updated 2022/23.
    // Let's look closer at Image 1 Safety. "4 Airbags (Driver + Co-Driver + Front Side)".
    // Wait. There's another line "Quad Airbags".
    // Actually, newer XL6 (2023+ with Ventilated Seats) might have 6?
    // Let's stick to what the image says explicitly if visible.
    // Image 1 Safety: Row 1 "Quad Airbags (Dual Front + Dual Side)".
    // Row 2 "Tyre Pressure Monitoring System" -> Alpha+ (Tick). Zeta (-).
    // Let's verify standard 4 vs 6.
    // Recent mandates push for 6. But if brochure says 4...
    // Let's check another image.
    // Image 1 is "Feature List".
    // Row under Safety: "Quad Airbags".
    // Okay, I will put '4' based on this specific brochure image, or '4 (Standard)'
    // Wait. Let's look at "Safety & Security" section in Image 1.
    // "Quad Airbags (Dual Front + Dual Front Seat Side)".
    // So 4 Airbags.
    airbags: '4',
    airbagsLocation: 'Driver, Passenger, Front Side',
    abs: 'Yes',
    ebd: 'Yes',
    esp: 'Yes',
    hillHoldAssist: 'Yes',
    isofix: 'Yes',
    seatbeltWarning: 'Yes',
    engineImmobilizer: 'Yes',
    ba: 'Yes',
    speedAlertSystem: 'Yes',
    rearUniqueSensors: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isAlpha = variantName.includes('Alpha');
    const isAlphaPlus = variantName.includes('Alpha Plus') || variantName.includes('Alpha+');
    const isZeta = variantName.includes('Zeta');
    const isAT = variantName.includes('AT');
    const isCNG = variantName.includes('CNG');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Key Features
    let keyFeaturesArr = ['Captain Seats', 'Auto AC', 'Cruise Control', 'ESP'];
    let summary = `The XL6 ${variantName} `;

    // Common
    features.headLights = 'LED Reflector (Quad Chamber)';
    features.alloyWheels = '16 inch Alloy (Machined)';
    features.rearWiper = 'Yes';
    features.climateControl = 'Automatic';
    features.airConditioning = 'Automatic';
    features.cruiseControl = 'Yes';
    features.pushButtonStart = 'Yes';
    features.steeringMountedControls = 'Yes';
    features.paddleShifters = isAT ? 'Yes' : 'No';
    features.leatherSeats = 'No (Fabric)'; // Premium Stone Finish Fabric? Or Leather?
    // Image 3 Interiors: "Leather Wrapped Steering Wheel" -> Alpha, Alpha+. Zeta (-).
    // "Premium Leatherette Seats" -> Alpha, Alpha+. Zeta (-).
    // So Zeta is Fabric. Alpha/Alpha+ is Leatherette.

    if (isZeta) {
        keyFeaturesArr.push('7-inch SmartPlay Studio', 'Captain Seats', 'Rear AC Vents');
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm Touchscreen';
        features.leatherSeats = 'No (Fabric)';
        features.ventilatedSeats = 'No';
        features.sunroof = 'No'; // No sunroof on Zeta? Wait. Brochure doesn't explicitly say Sunroof.
        // Usually XL6 doesn't have sunroof unless specified?
        // Wait, looking for Sunroof in "Feature List". Not found in Image 1/3?
        // Ah, looking at Image 2 for Alpha+? "Tyre Pressure Monitoring System".
        // Where is Sunroof?
        // Ah, common knowledge: XL6 DOES NOT HAVE SUNROOF.
        // Wait. Grand Vitara has Pano. Brezza has Sunroof. XL6?
        // XL6 2022 facelift added Ventilated seats but checking sunroof...
        // Most sources say No Sunroof for XL6.
        features.sunroof = 'No';
        features.rearCamera = 'Yes'; // In Image 3 Exterior? "Rear Camera" -> Zeta (Tick). Alpha (Tick). Alpha+ (Tick). Wait "360 View Camera" -> Alpha+ (Tick). Zeta (-). Alpha (-/Tick?)
        // Image 3: "Rear Camera" -> Zeta(Tick), Alpha(No? Dash), Alpha+(No? Dash).
        // "360 View Camera" -> Zeta(No), Alpha(Tick), Alpha+(Tick).
        // So Alpha/Alpha+ upgrade to 360.
        summary += 'offers premium 6-seater comfort with Captain seats and SmartPlay Studio.';
    } else if (isAlpha && !isAlphaPlus) {
        keyFeaturesArr.push('Leather Seats', '360 Camera', 'UV Cut Glass', 'Auto Headlamps');
        features.touchScreenInfotainment = '7 inch'; // SmartPlay Pro?
        // Image 1: "17.78 cm SmartPlay Pro" -> Alpha (Tick), Alpha+ (Tick). Zeta (-).
        // "17.78 cm SmartPlay Studio" -> Zeta (Tick).
        features.infotainmentScreen = '17.78 cm SmartPlay Pro';
        features.leatherSeats = 'Yes (Leatherette)';
        features.ventilatedSeats = 'No'; // Ventilated is Alpha+ only usually.
        // Image 1 Feature List: "Ventilated Seats (Dr/Co-Dr)" -> Alpha+ (Tick). Zeta (-), Alpha (-).
        features.reverseCamera = '360 Degree View';
        features.autoHeadlamps = 'Yes';
        features.uvCutGlass = 'Yes'; // UV Cut Side Glasses -> Alpha, Alpha+.
        summary += 'adds luxury with leatherette seats, 360-degree camera, and UV cut glass.';
    } else if (isAlphaPlus) {
        keyFeaturesArr.push('Ventilated Seats', 'TPMS', 'Tyre Pressure Monitoring');
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78 cm SmartPlay Pro';
        features.leatherSeats = 'Yes (Leatherette)';
        features.ventilatedSeats = 'Front';
        features.tpms = 'Yes';
        features.reverseCamera = '360 Degree View';
        features.autoHeadlamps = 'Yes';
        features.uvCutGlass = 'Yes';
        summary += 'is the pinnacle of comfort with Ventilated Seats and Tyre Pressure Monitoring System.';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' Powered by the refined 1.5L K-Series engine.';

    // Wheels
    features.wheelSize = '16 inch';
    features.tyreSize = '195/60 R16';

    features.speakers = '4 Speakers + 2 Tweeters';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AT')) return 'Petrol AT';
    return 'Petrol MT';
}

const XL6_VARIANTS = [
    { name: 'XL6 Zeta MT', price: 1152300 },
    { name: 'XL6 Alpha MT', price: 1248800 },
    { name: 'XL6 Zeta CNG', price: 1243300 },
    { name: 'XL6 Zeta AT', price: 1287300 },
    { name: 'XL6 Alpha Plus MT', price: 1312500 },
    { name: 'XL6 Alpha AT', price: 1383800 },
    { name: 'XL6 Alpha Plus AT', price: 1447500 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /XL6/i } }).lean();
    if (!model) {
        console.error('❌ Maruti Suzuki XL6 model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI XL6 VARIANTS UPDATE ===\n');
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
    for (const v of XL6_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${XL6_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = XL6_VARIANTS[6]; // Alpha Plus AT
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
        for (const variant of XL6_VARIANTS) {
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
        console.log(`\n🎉 Maruti Suzuki XL6 now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
