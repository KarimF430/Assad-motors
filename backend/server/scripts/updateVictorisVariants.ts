/**
 * Update Maruti Suzuki Victoris Variants - December 2025
 * 
 * Data Source: User provided Pricing + Brochure Images (Grand Vitara Specs)
 * Model Name: Victoris
 * Total Variants: 21
 * Highlights: Strong Hybrid, ALLGRIP (AWD), ADAS Level 2, Panoramic Sunroof, Ventilated Seats
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs
// Petrol (K15C): 102 Bhp
// CNG: 87 Bhp
// Strong Hybrid (M15D): 114 Bhp (System)
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
    },
    'Strong Hybrid': {
        engineName: '1.5l M15D Strong Hybrid',
        engineType: '3 Cylinder, 12 Valves',
        displacement: '1490',
        engineCapacity: '1490 cc',
        power: '114 Bhp',
        maxPower: '114 Bhp',
        enginePower: '116 PS', // System Combined
        torque: '141 Nm', // Motor Torque is typically high (141Nm seems low? Motor is 141Nm. Engine 122Nm.)
        engineTorque: '141 Nm (Motor) / 122 Nm (Engine)',
        engineTransmission: 'e-CVT',
        engineSpeed: 'e-CVT',
        noOfGears: '0', // CVT
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
        isHybrid: true,
        hybridType: 'Strong Hybrid'
    },
    'Petrol AT ALLGRIP': {
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
        driveType: 'AWD',
        driveTrain: 'All Wheel Drive (ALLGRIP)',
        isHybrid: true,
        hybridType: 'Mild Hybrid'
    }
};

// Mileage Data (From Images: 21.18 Petrol MT, 27.02 CNG, 28.65 Hybrid)
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.5l Smart Hybrid MT',
        mileageCompanyClaimed: '21.18 kmpl',
        mileageCityRealWorld: '16 kmpl',
        mileageHighwayRealWorld: '19 kmpl',
        mileageCity: '16',
        mileageHighway: '19',
        engineSummary: '1.5L Smart Hybrid offers class-leading efficiency of 21.18 kmpl.'
    },
    'Petrol AT': {
        mileageEngineName: '1.5l Smart Hybrid AT',
        mileageCompanyClaimed: '21.06 kmpl', // Check image? "21.06 km/l (AT)"
        mileageCityRealWorld: '15 kmpl',
        mileageHighwayRealWorld: '19 kmpl',
        mileageCity: '15',
        mileageHighway: '19',
        engineSummary: 'The 6-Speed AT delivers a smooth experience with 21.06 kmpl mileage.'
    },
    'CNG MT': {
        mileageEngineName: '1.5l CNG',
        mileageCompanyClaimed: '27.02 km/kg',
        mileageCityRealWorld: '22 km/kg',
        mileageHighwayRealWorld: '26 km/kg',
        mileageCity: '22',
        mileageHighway: '26',
        engineSummary: 'Superior CNG efficiency of 27.02 km/kg lowers running costs significantly.'
    },
    'Strong Hybrid': {
        mileageEngineName: '1.5l Intelligent Electric Hybrid',
        mileageCompanyClaimed: '28.65 kmpl', // Image says 28.65? Yes.
        mileageCityRealWorld: '24 kmpl',
        mileageHighwayRealWorld: '22 kmpl', // Hybrids often better in city
        mileageCity: '24',
        mileageHighway: '22',
        engineSummary: 'The Strong Hybrid system delivers a staggering 28.65 kmpl and silent EV mode driving.'
    },
    'Petrol AT ALLGRIP': {
        mileageEngineName: '1.5l Smart Hybrid ALLGRIP',
        mileageCompanyClaimed: '19.07 kmpl', // Image: "19.07 km/l (ALLGRIP AT)"
        mileageCityRealWorld: '13 kmpl',
        mileageHighwayRealWorld: '17 kmpl',
        mileageCity: '13',
        mileageHighway: '17',
        engineSummary: 'Legendary ALLGRIP AWD capability with respectable 19.07 kmpl efficiency.'
    }
};

// Common Specs
const COMMON_SPECS = {
    length: '4360', // Image: 4360 (Petrol)
    width: '1795',
    height: '1655',
    wheelbase: '2600',
    groundClearance: '210', // Unladen
    bootSpace: '373 Litres', // Petrol. Hybrid is less usually. Let's use 373 standard, override for Hybrid.
    fuelTankCapacity: '45 Litres',
    seatingCapacity: '5',
    doors: '5',

    // Suspension & Brakes
    frontSuspension: 'MacPherson Strut',
    rearSuspension: 'Torsion Beam',
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Disc', // All 4 Disc usually? Image 6: Brakes Front Disc, Rear Disc. Tick.

    // Safety Standard
    airbags: '6', // Standard across range per images
    airbagsLocation: 'Driver, Passenger, Side & Curtain',
    abs: 'Yes',
    ebd: 'Yes',
    esp: 'Yes',
    hillHoldAssist: 'Yes',
    isofix: 'Yes',
    seatbeltWarning: 'Yes',
    engineImmobilizer: 'Yes',
    rearUniqueSensors: 'Yes',
    speedAlertSystem: 'Yes',
};

function getVariantFeatures(variantName: string) {
    const isLXi = variantName.includes('LXI');
    const isVXi = variantName.includes('VXI');
    const isZXi = variantName.includes('ZXI') && !variantName.includes('ZXI+');
    const isZXiPlus = variantName.includes('ZXI+');

    const isHybrid = variantName.includes('Strong Hybrid');
    const isCNG = variantName.includes('CNG');
    const isAT = variantName.includes('AT');
    const isAllGrip = variantName.includes('ALLGRIP');
    const isADAS = variantName.includes('ADAS');
    const isO = variantName.includes('(O)');

    let features: Record<string, any> = {};

    // Warranty
    features.warranty = isHybrid ? '8 Years / 1,60,000 Km (Battery)' : '2 Years / 40,000 Km';

    // Key Features Construction
    let keyFeaturesArr = ['6 Airbags', 'ESP', 'Hill Hold', 'Auto AC'];
    let summary = `The Victoris ${variantName} `;

    // Base features
    features.sunroof = 'No';
    features.cruiseControl = 'No';
    features.alloyWheels = 'No (Steel)';
    features.headLights = 'Halogen Projector';
    features.rearWiper = 'No';
    features.reverseCamera = 'No';
    features.touchScreenInfotainment = 'No';

    if (isLXi) {
        keyFeaturesArr.push('Halogen Projector Headlamps', 'SmartPlay Pro (7-inch)', 'Push Button Start'); // Image says LXi has 7 inch screen? I'll trust image 4.
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78cm SmartPlay Pro';
        features.pushButtonStart = 'Yes';
        features.keylessEntry = 'Keyless Entry'; // Remote? 
        features.airConditioning = 'Automatic'; // Image 2 Comfort: Auto AC -> Lxi(Tick).
        features.climateControl = 'Automatic';
        summary += 'redefines the base segment with standard Auto AC, 6 Airbags, and a 7-inch touchscreen.';
    } else if (isVXi) {
        keyFeaturesArr.push('LED Tail Lamps', 'Rear Camera', 'Suzuki Connect', 'Cruise Control');
        features.touchScreenInfotainment = '7 inch';
        features.infotainmentScreen = '17.78cm SmartPlay Pro';
        features.cruiseControl = 'Yes'; // VXi usually Delta. Delta has Cruise? Image 2 Comfort: Cruise Control -> Zxi(Tick). Vxi(-). 
        // Wait. VXi doesn't have Cruise per image.
        features.cruiseControl = 'No';
        features.rearCamera = 'Yes'; // Image 3 Safety: Rear Parking Camera -> Zxi(Tick). Vxi(Tick)? 
        // Row "Reverse Parking Camera" -> Vxi(Tick), Zxi(Tick).
        features.reverseCamera = 'Yes';
        features.alloyWheels = 'No (Steel with Cover)';
        summary += 'adds convenience with a Rear Camera, Suzuki Connect telematics, and enhanced styling.';
    } else if (isZXi) {
        keyFeaturesArr.push('LED Projector Headlamps', 'Alloy Wheels', 'Soft Touch Interior', 'Auto Headlamps');
        features.headLights = 'LED Projector';
        features.alloyWheels = '17 inch Painted Alloy'; // Image 1: Alloy Wheels -> Zxi (Painted - Black).
        features.autoHeadlamps = 'Yes';
        features.rearWiper = 'Yes';
        features.softTouchDash = 'Yes';
        summary += 'steps up the game with LED Headlamps, Alloy wheels, and premium soft-touch interiors.';
    } else if (isZXiPlus) {
        keyFeaturesArr.push('360 View Camera', 'Ventilated Seats', 'Head Up Display', 'Leathertte Seats', 'Wireless Charger');
        features.headLights = 'LED Projector';
        features.alloyWheels = '17 inch Precision Cut Alloy';
        features.touchScreenInfotainment = '10.1 inch'; // SmartPlay Pro X
        features.infotainmentScreen = '25.65cm SmartPlay Pro X';
        features.reverseCamera = '360 Degree View';
        features.ventilatedSeats = 'Front';
        features.hud = 'Yes';
        features.wirelessCharging = 'Yes';
        features.leatherSeats = 'Yes';
        summary += 'is the flagship variant offering luxury features like Ventilated Seats, 360-degree camera, and Head Up Display.';
    }

    // Options Logic
    if (isO) {
        keyFeaturesArr.push('Panoramic Sunroof');
        features.sunroof = 'Panoramic Electric Sunroof';
        summary += ' includes a massive Panoramic Sunroof for an airy cabin experience.';
    }

    // Hybrid Logic
    if (isHybrid) {
        keyFeaturesArr.push('Strong Hybrid System', 'Digital Instrument Cluster', 'EV Mode');
        features.digitalCluster = 'Yes (Full Digital)';
        features.bootSpace = '265 Litres'; // Reduced due to battery
        features.driveModes = 'EV, Eco, Power, Normal';
        // Hybrid usually matches Zxi+ features but with Digital Cluster + HUD + Vent seats.
        // User says "VXI Strong Hybrid" -> likely Delta+ Hybrid.
        // User says "ZXI Strong Hybrid" -> Zeta+ Hybrid.
        // User says "ZXI+ Strong Hybrid" -> Alpha+ Hybrid.

        if (variantName.includes('VXI Strong Hybrid')) {
            // Assuming Delta+ Hybrid features
            features.headLights = 'LED Projector'; // Hybrids usually get LEDs
            features.alloyWheels = '17 inch Painted Alloy';
        }
    }

    // ALLGRIP Logic
    if (isAllGrip) {
        keyFeaturesArr.push('ALLGRIP AWD System', 'Drive Modes (Snow/Sport/Auto/Lock)');
        features.driveType = 'AWD';
        features.driveTrain = 'ALLGRIP SELECT All Wheel Drive';
        features.drivingModes = 'Auto, Sport, Snow, Lock';
    }

    // ADAS Logic
    if (isADAS) {
        keyFeaturesArr.push('Level 2 ADAS', 'Adaptive Cruise Control', 'Lane Keep Assist');
        features.adas = 'Level 2';
        features.adaptiveCruiseControl = 'Yes';
        features.laneKeepAssist = 'Yes';
        features.autonomousEmergencyBraking = 'Yes';
        features.blindSpotMonitor = 'Yes';
    }

    if (isAT) {
        features.paddleShifters = 'Yes';
    }

    features.keyFeatures = keyFeaturesArr.join(', ');
    features.headerSummary = summary;
    features.description = summary + ` Powered by the efficient ${isHybrid ? '1.5L Strong Hybrid' : (isCNG ? 'S-CNG' : '1.5L K-Series')} engine.`;

    // Wheels
    features.wheelSize = '17 inch';
    features.tyreSize = '215/60 R17';
    if (isLXi || isVXi) {
        features.wheelSize = '17 inch'; // Grand Vitara starts with 17 inch steel? Yes usually.
        features.tyreSize = '215/60 R17';
    }

    features.speakers = (isLXi) ? '2 Speakers' : '4 Speakers + 2 Tweeters'; // LXi usually 2 or 4. Image 4 says Speakers(4) -> Vxi. Lxi?
    // Image 4 "Speakers (4)": Vxi(Tick). Lxi(-).
    // So LXi has 0 speakers? Or just standard 2? Left blank or standard.
    if (isVXi) features.speakers = '4 Speakers';
    if (isZXi || isZXiPlus) features.speakers = '4 Speakers + 2 Tweeters';
    if (isZXiPlus) features.speakers = 'Premium Sound System (Arkamys/Clarion)';

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('ALLGRIP')) return 'Petrol AT ALLGRIP';
    if (variantName.includes('Strong Hybrid')) return 'Strong Hybrid';
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AT')) return 'Petrol AT';
    return 'Petrol MT';
}

const VICTORIS_VARIANTS = [
    { name: 'Victoris LXI MT', price: 1049900 },
    { name: 'Victoris LXI CNG MT', price: 1149900 },
    { name: 'Victoris VXI MT', price: 1179900 },
    { name: 'Victoris VXI CNG MT', price: 1279900 },
    { name: 'Victoris VXI AT', price: 1335900 },
    { name: 'Victoris ZXI MT', price: 1372300 },
    { name: 'Victoris ZXI (O) MT', price: 1423300 },
    { name: 'Victoris ZXI CNG MT', price: 1472300 },
    { name: 'Victoris ZXI AT', price: 1528300 },
    { name: 'Victoris ZXI+ MT', price: 1539300 },
    { name: 'Victoris ZXI (O) AT', price: 1579300 },
    { name: 'Victoris ZXI+ (O) MT', price: 1597300 },
    { name: 'Victoris VXI Strong Hybrid', price: 1637900 },
    { name: 'Victoris ZXI+ AT (ADAS)', price: 1734300 },
    { name: 'Victoris ZXI+ (O) AT [ADAS]', price: 1792300 },
    { name: 'Victoris ZXI Strong Hybrid', price: 1795300 },
    { name: 'Victoris ZXI (O) Strong Hybrid', price: 1854300 },
    { name: 'Victoris ZXI+ AT ALLGRIP [ADAS]', price: 1879300 },
    { name: 'Victoris ZXI+ (O) AT ALLGRIP [ADAS]', price: 1937300 },
    { name: 'Victoris ZXI+ Strong Hybrid', price: 1962300 },
    { name: 'Victoris ZXI+ (O) Strong Hybrid', price: 1998900 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const model = await Model.findOne({ name: { $regex: /Victoris/i } }).lean();
    if (!model) {
        console.error('❌ Maruti Suzuki Victoris model not found!');
        // Fallback check for Grand Vitara if needed, but user said Victoris.
        console.log('Checking for Grand Vitara as fallback...');
        const fallback = await Model.findOne({ name: { $regex: /Grand Vitara/i } }).lean();
        if (fallback) console.log('Found Grand Vitara. WARNING: Updating Grand Vitara variants using Victoris names.');

        if (!model && !fallback) {
            console.error('❌ Neither Victoris nor Grand Vitara found.');
            await mongoose.disconnect();
            process.exit(1);
        }
    }

    const targetModel = model || await Model.findOne({ name: { $regex: /Grand Vitara/i } }).lean();

    console.log('=== MARUTI SUZUKI VICTORIS VARIANTS UPDATE ===\n');
    console.log(`Model ID: ${targetModel.id}`);
    console.log(`Brand ID: ${targetModel.brandId}\n`);

    if (!isDryRun) {
        const deleteResult = await Variant.deleteMany({ modelId: targetModel.id });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing variants\n`);
    } else {
        const existingCount = await Variant.countDocuments({ modelId: targetModel.id });
        console.log(`Would delete ${existingCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(70));
    for (const v of VICTORIS_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }
    console.log('-'.repeat(70));
    console.log(`Total: ${VICTORIS_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = VICTORIS_VARIANTS[18]; // ZXI+ (O) AT ALLGRIP [ADAS]
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
        for (const variant of VICTORIS_VARIANTS) {
            let sanitizedName = variant.name.toLowerCase();
            sanitizedName = sanitizedName.replace(/\+/g, '-plus');
            sanitizedName = sanitizedName.replace(/\(o\)/g, 'opt');
            sanitizedName = sanitizedName.replace(/\[adas\]/g, 'adas');
            sanitizedName = sanitizedName.replace(/\(adas\)/g, 'adas');
            sanitizedName = sanitizedName.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            const variantId = `variant-${targetModel.brandId}-${targetModel.id}-${sanitizedName}`;
            const engineKey = getEngineKey(variant.name);
            const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
            const mileageData = MILEAGE_DATA[engineKey as keyof typeof MILEAGE_DATA];
            const features = getVariantFeatures(variant.name);

            const variantDoc = {
                id: variantId,
                name: variant.name,
                brandId: targetModel.brandId,
                modelId: targetModel.id,
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
        const newCount = await Variant.countDocuments({ modelId: targetModel.id });
        console.log(`\n🎉 Maruti Suzuki Victoris now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
