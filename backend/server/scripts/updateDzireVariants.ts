/**
 * Update Maruti Suzuki Dzire Variants - December 2025
 * 
 * Data Source: New Dzire Brochure (4th Gen)
 * Total Variants: 9
 * Highlights: 5-Star GNCAP Rating, Electric Sunroof, 360 Camera, Z-Series Engine
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs (Z12E - Same as Swift but tuned slightly differently?)
// Brochure says: 60 kW @ 5700 rpm (Petrol), 51.3 kW (CNG). Torque 111.7 Nm.
// This matches Swift Z12E.
const ENGINES = {
    'Petrol MT': {
        engineName: '1.2L Z-Series',
        engineType: 'Z12E',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '80 Bhp', // 81.58 PS
        maxPower: '80 Bhp',
        enginePower: '82 PS',
        torque: '112 Nm',
        engineTorque: '111.7 Nm @ 4300 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        cylinders: '3'
    },
    'Petrol AMT': { // Brochure calls it AMT, not AGS? "5MT/5AMT".
        engineName: '1.2L Z-Series AMT',
        engineType: 'Z12E',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '80 Bhp',
        maxPower: '80 Bhp',
        enginePower: '82 PS',
        torque: '112 Nm',
        engineTorque: '111.7 Nm @ 4300 rpm',
        engineTransmission: '5-Speed AMT',
        engineSpeed: '5-Speed AMT',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        cylinders: '3'
    },
    'CNG MT': {
        engineName: '1.2L Z-Series S-CNG',
        engineType: 'Z12E',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '69 Bhp', // 69.75 PS
        maxPower: '69 Bhp',
        enginePower: '70 PS',
        torque: '102 Nm',
        engineTorque: '101.8 Nm @ 2900 rpm',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'CNG',
        fuel: 'CNG',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        cylinders: '3'
    },
};

// Mileage data
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.2l Petrol Manual',
        mileageCompanyClaimed: '24.79',
        mileageCityRealWorld: '19',
        mileageHighwayRealWorld: '22',
        mileageCity: '19',
        mileageHighway: '22',
        engineSummary: 'The Dzire delivers class-leading efficiency with the smooth Z-Series engine.',
    },
    'Petrol AMT': {
        mileageEngineName: '1.2l Petrol AMT',
        mileageCompanyClaimed: '25.71',
        mileageCityRealWorld: '20',
        mileageHighwayRealWorld: '23',
        mileageCity: '20',
        mileageHighway: '23',
        engineSummary: 'Enjoy convenience and superior mileage of 25.71 kmpl with the AMT variant.',
    },
    'CNG MT': {
        mileageEngineName: '1.2l S-CNG',
        mileageCompanyClaimed: '33.73 km/kg',
        mileageCityRealWorld: '27 km/kg',
        mileageHighwayRealWorld: '31 km/kg',
        mileageCity: '27',
        mileageHighway: '31',
        engineSummary: 'Dzire S-CNG offers exceptional savings of 33.73 km/kg with no compromise on comfort.',
    },
};

// Common specs
const COMMON_SPECS = {
    length: '3995',
    width: '1735',
    height: '1525',
    wheelbase: '2450',
    groundClearance: '163',
    fuelTankCapacity: '37 Litres', // CNG: 55L Water
    doors: '4', // Sedan
    seatingCapacity: '5',
    bootSpace: '382 Litres', // Class leading

    // Suspension
    frontSuspension: 'MacPherson Strut',
    rearSuspension: 'Torsion Beam',

    // Brakes
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Safety (Standard across all)
    airbags: '6', // 6 Airbags Standard
    abs: 'Yes',
    esp: 'Yes',
    hillHoldAssist: 'Yes',
    isofix: 'Yes',
    seatbeltWarning: 'Yes', // All Seats
    parkingSensors: 'Rear',
    speedAlertSystem: 'Yes',
    engineImmobilizer: 'Yes',
    globalNCAPRating: '5-Star (Adult & Child)', // New Dzire is 5-Star!
};

function getVariantFeatures(variantName: string) {
    const isLXi = variantName.includes('LXi');
    const isVXi = variantName.includes('VXi');
    const isZXi = variantName.includes('ZXi') && !variantName.includes('ZXi+');
    const isZXiPlus = variantName.includes('ZXi+');
    const isAMT = variantName.includes('AMT') || variantName.includes('AGS'); // User data says AMT
    const isCNG = variantName.includes('CNG');

    let features: Record<string, any> = {};

    features.warranty = '2 Years / 40,000 Km';

    // Wheels
    if (isZXi || isZXiPlus) {
        features.wheelSize = '15 inch';
        features.tyreSize = '185/65 R15';
        features.alloyWheels = isZXiPlus ? 'Yes (Precision Cut)' : 'Yes (Painted)';
    } else { // LXi, VXi
        features.wheelSize = '14 inch';
        features.tyreSize = '165/80 R14';
        features.alloyWheels = 'No (Steel)'; // VXi has Full Wheel Covers
        if (isVXi) features.alloyWheels = 'No (Full Wheel Covers)';
    }

    // Key Features Sequence
    let keyFeaturesArr = ['5-Star Safety', '6 Airbags', 'ESP', 'Hill Hold Assist'];
    let summary = `The Dzire ${variantName} `;

    features.powerSteering = 'Electric Power Steering'; // "Power & Tilt Steering" - LXi Tick

    if (isLXi) {
        summary += 'sets a new benchmark with standard 6 airbags, 5-star safety, and premium design.';
        features.projectorHeadlamps = 'Yes (Halogen)';
        features.rearTaillamps = 'LED';
        features.sharkFinAntenna = 'Yes';
        features.powerWindows = 'Front & Rear'; // LXi Tick
        features.centralLocking = 'Manual?'; // Brochure: Remote Keyless Entry -> VXi. Central Locking -> All.
        features.centralLocking = 'Yes';
        features.airConditioning = 'Manual AC';
    } else if (isVXi) {
        keyFeaturesArr.push('7-inch SmartPlay Pro', 'Wireless Android Auto/CarPlay', 'Rear AC Vents', 'Rear Armrest');
        summary += 'adds comfort and connectivity with a 7-inch touchscreen, rear AC vents, and wireless smartphone integration.';
        features.infotainmentScreen = '17.78 cm Touch Screen (SmartPlay Pro)';
        features.touchScreenInfotainment = '7 inch';
        features.speakers = '4';
        features.androidAppleCarplay = 'Wireless';
        features.steeringMountedControls = 'Yes';
        features.adjustableORVM = 'Electrically Adjustable & Foldable';
        features.bodyColouredORVMs = 'Yes';
        features.turnIndicatorsOnORVM = 'Yes';
        features.rearACVents = 'Yes'; // VXi Tick
        features.rearArmrest = 'Yes (with Cup Holder)'; // VXi Tick
        features.centralLocking = 'Remote Keyless Entry';
        features.fastChargingUSB = 'Yes (Type A & C Rear)';
    } else if (isZXi) {
        keyFeaturesArr.push('LED Headlamps', 'Wireless Charger', 'Auto Headlamps', 'TPMS', 'Suzuki Connect');
        summary += 'enhances style and safety with LED headlamps, TPMS, and connected car features.';
        features.projectorHeadlamps = 'Yes (LED Crystal Vision)';
        features.drls = 'Yes (LED)';
        features.wirelessCharger = 'Yes';
        features.tpms = 'Yes'; // ZXi Tick
        features.suzukiConnect = 'Yes';
        features.automaticHeadlamps = 'Yes';
        features.reverseCamera = 'Yes'; // ZXi Tick
        features.alloyWheels = 'Yes (Painted)';
        features.pushButtonStart = 'Yes'; // Engine Push Start-Stop: ZXi Tick
        features.airConditioning = 'Automatic Climate Control';
    } else if (isZXiPlus) {
        keyFeaturesArr.push('Electric Sunroof', '360° Camera', '9-inch SmartPlay Pro+', 'Cruise Control', 'Leather Steering');
        summary += 'is the flagship variant offering a segment-first electric sunroof, 360-degree camera, and premium leatherette touches.';
        features.sunroof = 'Electric Sunroof'; // ZXi+ Tick
        features.camera360 = 'Yes (HD)'; // 360 View Camera
        features.infotainmentScreen = '22.86 cm Touch Screen (SmartPlay Pro+)';
        features.touchScreenInfotainment = '9 inch';
        features.cruiseControl = 'Yes';
        features.leatherSteeringWheel = 'Yes';
        features.fogLamps = 'Front (LED)';
        features.footwellLighting = 'Yes';
        features.features = 'Color MID';
    }

    // CNG
    if (isCNG) {
        features.fuelTankCapacity = '55 Litres (Water Equiv) + 37 Litres (Petrol)';
        features.bootSpace = 'Reduced (Cylinder)';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ' Rated 5-Stars by Global NCAP for superior safety.';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AMT')) return 'Petrol AMT';
    return 'Petrol MT';
}

const DZIRE_VARIANTS = [
    { name: 'Dzire LXi MT', price: 625600 },
    { name: 'Dzire VXi MT', price: 717100 },
    { name: 'Dzire VXi AMT', price: 762100 }, // AMT matches user list
    { name: 'Dzire VXi CNG', price: 803100 },
    { name: 'Dzire ZXi MT', price: 817700 },
    { name: 'Dzire ZXi AMT', price: 862700 },
    { name: 'Dzire ZXi+ MT', price: 886300 },
    { name: 'Dzire ZXi CNG', price: 903700 },
    { name: 'Dzire ZXi+ AMT', price: 931300 },
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

    const model = await Model.findOne({ name: { $regex: /Dzire/i } }).lean();

    if (!model) {
        console.error('❌ Maruti Suzuki Dzire model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SUZUKI DZIRE VARIANTS UPDATE ===\n');
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
    for (const v of DZIRE_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${DZIRE_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = DZIRE_VARIANTS[8]; // ZXi+ AMT
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
        for (const variant of DZIRE_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/\s+/g, '-');
            sanitizedName = sanitizedName.replace(/[^a-z0-9-]+/g, '');

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
        console.log(`\n🎉 Maruti Suzuki Dzire now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
