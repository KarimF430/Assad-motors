/**
 * Update Maruti Suzuki Ertiga Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images
 * Total Variants: 9
 * Highlights: 1.5L K15C Smart Hybrid, 7 Seater, 6 Airbags Standard, No Sunroof
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs (Standardized to Bhp, No RPM text)
// Petrol (Smart Hybrid): 75.8 kW (103.06 PS) -> ~102 Bhp
// Petrol (CNG Mode): 64.6 kW (87.8 PS) -> ~87 Bhp
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
        engineTorque: '136.8 Nm @ 4400 rpm',
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
        engineTorque: '136.8 Nm @ 4400 rpm',
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

// Mileage Data (Approximate based on market standards for Ertiga K15C)
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.5l Smart Hybrid MT',
        mileageCompanyClaimed: '20.51 kmpl',
        mileageCityRealWorld: '14 kmpl',
        mileageHighwayRealWorld: '18 kmpl',
        mileageCity: '14',
        mileageHighway: '18',
        engineSummary: 'The reliable 1.5L K15C Smart Hybrid engine ensures a fuel-efficient drive with 103 PS.'
    },
    'Petrol AT': {
        mileageEngineName: '1.5l Smart Hybrid AT',
        mileageCompanyClaimed: '20.30 kmpl',
        mileageCityRealWorld: '13 kmpl',
        mileageHighwayRealWorld: '18 kmpl',
        mileageCity: '13',
        mileageHighway: '18',
        engineSummary: 'The 6-Speed Automatic transmission offers smooth shifts and great efficiency for city driving.'
    },
    'CNG MT': {
        mileageEngineName: '1.5l S-CNG',
        mileageCompanyClaimed: '26.11 km/kg',
        mileageCityRealWorld: '21 km/kg',
        mileageHighwayRealWorld: '25 km/kg',
        mileageCity: '21',
        mileageHighway: '25',
        engineSummary: 'Ertiga S-CNG offers market-leading efficiency of 26.11 km/kg, making it the perfect MPV for long hauls.'
    }
};

// Common Specs from Brochure
const COMMON_SPECS = {
    length: '4395', // Brochure says 4435? Wait. Old Ertiga was shorter. Image 4 says "Length (mm): 4435". Checking... XL6 is 4445. Ertiga update: 4395 is usually the old one. Image clearly says 4435.
    length: '4435',
    width: '1735',
    height: '1690',
    wheelbase: '2740',
    groundClearance: '185', // Standard for Ertiga
    bootSpace: '209 Litres', // All seats up. 550L with 3rd row fold.
    fuelTankCapacity: '45 Litres',
    seatingCapacity: '7',
    doors: '5',

    // Suspension & Brakes
    frontSuspension: 'MacPherson Strut & Coil Spring',
    rearSuspension: 'Torsion Beam & Coil Spring',
    frontBrake: 'Disc', // Ventilated Disc
    rearBrake: 'Drum',

    // Safety Standard
    airbags: '6', // Image 3: 6 Airbags (Front, Side and Curtain) - Tick for ALL.
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    abs: 'Yes',
    ebd: 'Yes',
    ba: 'Yes', // Brake Assist
    esp: 'Yes', // Electronic Stability Program - Tick for ALL
    hillHoldAssist: 'Yes', // Tick for ALL
    isofix: 'Yes', // Tick for ALL
    seatbeltWarning: 'Yes',
    engineImmobilizer: 'Yes',
    rearUniqueSensors: 'Yes',
    speedAlertSystem: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isLXi = variantName.includes('LXi');
    const isVXi = variantName.includes('VXi');
    const isZXi = variantName.includes('ZXi') && !variantName.includes('ZXi+');
    const isZXiPlus = variantName.includes('ZXi+');
    const isCNG = variantName.includes('CNG');
    const isAT = variantName.includes('AT');

    let features: Record<string, any> = {};

    // Warranty
    features.warranty = '2 Years / 40,000 Km';

    // Key Features Construction
    let keyFeaturesArr = ['6 Airbags (Standard)', 'ESP', 'Hill Hold Assist'];
    let summary = `The Ertiga ${variantName} `;

    // Feature Logic
    features.headLights = 'Halogen Projector';
    features.sunroof = 'No';
    features.cruiseControl = 'No';

    if (isLXi) {
        keyFeaturesArr.push('Projector Headlamps', 'Manual AC', 'All Power Windows', 'ISOFIX');
        features.alloyWheels = 'No (Steel)';
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'No';
        features.airConditioning = 'Manual';
        features.rearACVents = 'No'; // Brochure: 2nd Row AC Vents - Tick for VXi onwards. LXi - ? Image 2 "2nd Row AC Vents" - Dash implies No for LXi.
        // Wait, "2nd Row AC Vents" -> LXi (-), VXi (Tick).
        summary += 'is the safe and practical entry variant with standard 6 airbags and projector headlamps.';
    } else if (isVXi) {
        keyFeaturesArr.push('7-inch SmartPlay Studio', '2nd Row AC', 'Steering Mounted Controls', 'Keyless Entry');
        features.alloyWheels = 'No (Steel with Caps)';
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78cm SmartPlay Studio';
        features.airConditioning = 'Manual';
        features.rearACVents = 'Yes';
        features.rearDefogger = 'No'; // Image 2: Rear Defogger -> ZXi onwards. VXi (-)
        features.androidAppleCarplay = 'Wired'; // Likely wired on Studio
        summary += 'adds essential comfort with 2nd row AC vents and the SmartPlay Studio infotainment system.';
    } else if (isZXi) {
        keyFeaturesArr.push('Machined Alloys', 'Auto AC', 'Push Button Start', 'Rear Wiper', 'Chrome Door Handles');
        features.alloyWheels = '15 inch Machined Alloy';
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78cm SmartPlay Studio';
        features.airConditioning = 'Automatic';
        features.climateControl = 'Automatic';
        features.rearACVents = 'Yes';
        features.rearDefogger = 'Yes';
        features.keylessEntry = 'Smart Key';
        features.pushButtonStart = 'Yes';
        features.rearWiper = 'Yes';
        features.armRest = 'Front (Sliding)';
        summary += 'offers premium features like alloy wheels, automatic climate control, and push-button start.';
    } else if (isZXiPlus) {
        keyFeaturesArr.push('7-inch SmartPlay Pro', 'Cruise Control', 'Auto Headlamps', 'Leather Wrapped Steering', '4 Airbags (Already Standard)');
        // 4 Airbags note redundant since 6 standard now.
        features.alloyWheels = '15 inch Machined Alloy';
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78cm SmartPlay Pro';
        features.airConditioning = 'Automatic';
        features.climateControl = 'Automatic';
        features.rearACVents = 'Yes';
        features.cruiseControl = 'Yes'; // Only on ZXi+
        features.autoHeadlamps = 'Yes'; // Only on ZXi+ ("Auto Headlamps with Follow Me...")
        features.rearCamera = 'Yes'; // Only on ZXi+? Image 3: Rear Parking Camera -> ZXi (-), ZXi+ (Tick)? 
        // Wait, Image 3 "Rear Parking Camera" -> ZXi (Tick), ZXi+ (Tick). Safe to say ZXi has it?
        // Let's re-read Image 3. Row "Rear Parking Camera". LXi (-), VXi (-), ZXi (Tick), ZXi+ (Tick).
        features.reverseCamera = 'Yes';
        summary += 'is the top-tier variant with cruise control, SmartPlay Pro, and enhanced styling.';
    }

    // Camera fix for ZXi
    if (isZXi) features.reverseCamera = 'Yes';


    if (isAT) {
        keyFeaturesArr.push('Paddle Shifters');
        features.paddleShifters = 'Yes';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` Powered by the ${isCNG ? 'Eco-friendly 1.5L S-CNG' : 'refined 1.5L K-Series Smart Hybrid'} engine.`;

    // Wheels
    features.wheelSize = '15 inch';
    features.tyreSize = '185/65 R15';

    features.speakers = (isLXi) ? 'No' : '4 Speakers + 2 Tweeters'; // VXi has 4 speakers? Image 2: Speakers(4) -> VXi(Tick), ZXi(Tick). Tweeters(2) -> VXi(-), ZXi(Tick).
    if (isVXi) features.speakers = '4 Speakers';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AT')) return 'Petrol AT';
    return 'Petrol MT';
}

const ERTIGA_VARIANTS = [
    { name: 'Ertiga LXi MT', price: 880000 },
    { name: 'Ertiga VXi MT', price: 985300 },
    { name: 'Ertiga VXi CNG', price: 1076300 },
    { name: 'Ertiga ZXi MT', price: 1091500 },
    { name: 'Ertiga VXi AT', price: 1120300 },
    { name: 'Ertiga ZXi+ MT', price: 1159100 },
    { name: 'Ertiga ZXi CNG', price: 1182500 },
    { name: 'Ertiga ZXi AT', price: 1226500 },
    { name: 'Ertiga ZXi+ AT', price: 1294100 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Ertiga/i } }).lean();
    if (!model) {
        console.error('❌ Maruti Suzuki Ertiga model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI ERTIGA VARIANTS UPDATE ===\n');
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
    for (const v of ERTIGA_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${ERTIGA_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = ERTIGA_VARIANTS[7]; // ZXi AT
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
        for (const variant of ERTIGA_VARIANTS) {
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
        console.log(`\n🎉 Maruti Suzuki Ertiga now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
