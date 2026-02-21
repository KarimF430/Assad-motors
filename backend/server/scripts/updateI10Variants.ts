/**
 * Update Hyundai Grand i10 NIOS Variants - December 2025
 * 
 * Data Source: Official Hyundai Brochure + Price List
 * Total Variants: 15
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
        engineName: '1.2l Kappa Petrol',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '82 Bhp',
        maxPower: '82 Bhp',
        enginePower: '82 Bhp',
        torque: '113.8 Nm',
        engineTorque: '113.8 Nm (11.6 kgm) @ 4000 r/min',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'Petrol AMT': {
        engineName: '1.2l Kappa Petrol',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '82 Bhp',
        maxPower: '82 Bhp',
        enginePower: '82 Bhp',
        torque: '113.8 Nm',
        engineTorque: '113.8 Nm (11.6 kgm) @ 4000 r/min',
        engineTransmission: 'Smart Auto AMT',
        engineSpeed: '5-Speed AMT',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'AMT',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'CNG MT': {
        engineName: '1.2l Bi-Fuel Kappa (Petrol + CNG)',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '68 Bhp',
        maxPower: '68 Bhp',
        enginePower: '68 Bhp',
        torque: '95.2 Nm',
        engineTorque: '95.2 Nm (9.7 kgm) @ 4000 r/min',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'CNG',
        fuel: 'Petrol + CNG',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
};

// Mileage data
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.2l Kappa Petrol Manual',
        mileageCompanyClaimed: '20.7',
        mileageCityRealWorld: '14',
        mileageHighwayRealWorld: '18',
        mileageCity: '14',
        mileageHighway: '18',
        engineSummary: 'The 1.2-litre Kappa petrol engine delivers 82 Bhp and 113.8 Nm of torque. Paired with a 5-speed manual, it offers peppy city performance and good fuel efficiency.',
    },
    'Petrol AMT': {
        mileageEngineName: '1.2l Kappa Petrol AMT',
        mileageCompanyClaimed: '20.5',
        mileageCityRealWorld: '13',
        mileageHighwayRealWorld: '17',
        mileageCity: '13',
        mileageHighway: '17',
        engineSummary: 'The 1.2-litre Kappa petrol with Smart Auto AMT offers hassle-free city driving. The AMT provides convenience without a clutch pedal while maintaining good fuel efficiency.',
    },
    'CNG MT': {
        mileageEngineName: '1.2l Bi-Fuel CNG',
        mileageCompanyClaimed: '28.3',
        mileageCityRealWorld: '22',
        mileageHighwayRealWorld: '26',
        mileageCity: '22',
        mileageHighway: '26',
        engineSummary: 'The Bi-Fuel CNG variant offers exceptional running costs with 28.3 km/kg claimed mileage. Power drops to 68 Bhp on CNG but running costs are significantly lower than petrol.',
    },
};

// Common specs from brochure
const COMMON_SPECS = {
    // Dimensions
    length: '3815',
    width: '1680',
    height: '1520',
    wheelbase: '2450',
    groundClearance: '165',
    turningRadius: '4.91',
    kerbWeight: '920-1040',
    seatingCapacity: '5',
    doors: '5',
    bootSpace: '260 Litres',
    cupholders: '4',

    // Suspension
    frontSuspension: 'McPherson strut',
    rearSuspension: 'Coupled torsion beam axle',
    shockAbsorber: 'Gas type',

    // Brakes
    frontBrake: 'Disc',
    rearBrake: 'Drum',

    // Emission
    emissionStandard: 'BS6 Phase 2',

    // Global NCAP Rating
    globalNCAPRating: '2-Star',

    // Common Safety
    abs: 'Yes',
    ebd: 'Yes',
    seatbeltWarning: 'Yes (All seats)',
    speedAlertSystem: 'Yes',
    threePointSeatbelts: 'All seats',
};

// Variant-specific features
function getVariantFeatures(variantName: string) {
    const isEra = variantName.startsWith('Era');
    const isMagna = variantName.startsWith('Magna');
    const isCorporate = variantName.startsWith('Corporate');
    const isSportz = variantName.startsWith('Sportz') && !variantName.includes('Sportz(O)');
    const isSportzO = variantName.includes('Sportz(O)');
    const isAsta = variantName.startsWith('Asta');
    const isDT = variantName.includes('DT');
    const isAMT = variantName.includes('AMT');
    const isCNG = variantName.includes('CNG');

    let features: Record<string, any> = {};

    // Warranty
    features.warranty = '3 Years / Unlimited Km';

    // Fuel Tank
    if (isCNG) {
        features.fuelTankCapacity = 'Petrol: 37 L, CNG: 60 L (water equivalent)';
    } else {
        features.fuelTankCapacity = '37 Litres';
    }

    // Key Features
    let keyFeaturesArr: string[] = [];
    if (isEra) {
        keyFeaturesArr = ['Driver Airbag', 'ABS with EBD', 'Power Steering', 'Central Locking', '14-inch Steel Wheels'];
    } else if (isMagna) {
        keyFeaturesArr = ['Dual Airbags', 'Power Windows', 'Front & Rear Speakers', 'Body Colored Bumpers', '14-inch Steel Wheels'];
    } else if (isCorporate) {
        keyFeaturesArr = ['4 Airbags', 'Rear Parking Sensors', '8-inch Touchscreen', 'Rear Camera', '15-inch Steel Wheels'];
    } else if (isSportz) {
        keyFeaturesArr = ['4 Airbags', 'TPMS', 'LED DRLs', 'Rear Defogger', '15-inch Styled Steel Wheels', isDT ? 'Dual Tone Exterior' : 'Shark Fin Antenna'];
    } else if (isSportzO) {
        keyFeaturesArr = ['4 Airbags', 'Smart Key', 'Push Button Start', '15-inch Diamond Cut Alloys', 'LED DRLs', 'Premium Interiors'];
    } else if (isAsta) {
        keyFeaturesArr = ['4 Airbags', 'Smart Key', 'Push Button Start', '15-inch Diamond Cut Alloys', 'Wireless Charger', 'Automatic Headlamps', 'Chrome Door Handles'];
    }
    if (isCNG) keyFeaturesArr.push('Factory Fitted CNG');
    if (isAMT) keyFeaturesArr.push('AMT Transmission');
    features.keyFeatures = keyFeaturesArr.join(', ');

    // Header Summary
    if (isEra) {
        features.headerSummary = `The Grand i10 NIOS ${variantName} is the base variant offering essential features at the most affordable price. Ideal for budget-conscious buyers.`;
    } else if (isMagna) {
        features.headerSummary = `The Grand i10 NIOS ${variantName} adds dual airbags and power windows, making it a practical choice for everyday commuting.`;
    } else if (isCorporate) {
        features.headerSummary = `The Grand i10 NIOS ${variantName} is a great value pick with 4 airbags, 8-inch touchscreen, and rear camera at a competitive price.`;
    } else if (isSportz) {
        features.headerSummary = `The Grand i10 NIOS ${variantName} offers sporty styling with LED DRLs, TPMS, and premium features for the enthusiast buyer.`;
    } else if (isSportzO) {
        features.headerSummary = `The Grand i10 NIOS ${variantName} adds smart key with push button start and 15-inch diamond cut alloys for a premium feel.`;
    } else if (isAsta) {
        features.headerSummary = `The Grand i10 NIOS ${variantName} is the top variant with wireless charging, automatic headlamps, and all premium features.`;
    }

    // Description
    if (isEra) {
        features.description = 'The Era is the base variant designed for practical buyers who want a reliable city car at an attractive price. It comes with essential safety features and manual controls.';
    } else if (isMagna) {
        features.description = 'The Magna variant adds comfort features like power windows and a 2-DIN audio system. It offers a good balance of features and value for daily commuters.';
    } else if (isCorporate) {
        features.description = 'The Corporate variant is positioned as a value-for-money choice with an 8-inch touchscreen, rear camera, and 4 airbags - features typically found in higher trims.';
    } else if (isSportz) {
        features.description = 'The Sportz variant brings sporty styling elements like LED DRLs and a shark fin antenna. It also adds safety features like TPMS and ESC.';
    } else if (isSportzO) {
        features.description = 'The Sportz(O) elevates the experience with premium black interiors, smart key with push button start, and stylish 15-inch diamond cut alloy wheels.';
    } else if (isAsta) {
        features.description = 'The Asta is the fully-loaded variant with wireless charging, automatic headlamps, chrome door handles, and all the bells and whistles Grand i10 NIOS has to offer.';
    }

    // Airbags
    if (isEra) {
        features.airbags = '1';
        features.airbagsLocation = 'Driver';
    } else if (isMagna) {
        features.airbags = '2';
        features.airbagsLocation = 'Driver & Passenger';
    } else {
        features.airbags = '4';
        features.airbagsLocation = 'Driver, Passenger & Side';
    }

    // ESC, VSM, HAC
    if (isCorporate && isAMT) {
        features.electronicStabilityProgram = 'Yes (AMT Only)';
        features.esc = 'Yes';
        features.hillHoldAssist = 'Yes (AMT Only)';
    } else if (isSportz || isSportzO || isAsta) {
        features.electronicStabilityProgram = 'Yes';
        features.esc = 'Yes';
        features.hillHoldAssist = 'Yes';
    }

    // Seat belt pretensioners
    if (!isEra) {
        features.seatBeltPretensioners = 'Driver & Passenger';
    }

    // TPMS
    if (isSportz || isSportzO || isAsta) {
        features.tyrePressureMonitor = 'Yes (Highline)';
    }

    // ISOFIX
    if (isSportzO || isAsta) {
        features.isofix = 'Yes';
        features.isofixMounts = 'Yes';
    }

    // Speed sensing door lock
    if (!isEra) {
        features.speedSensingDoorLocks = 'Yes';
    }

    // Impact sensing door unlock
    if (isCorporate || isSportz || isSportzO || isAsta) {
        features.impactSensingDoorUnlock = 'Yes';
    }

    // Immobilizer & Central Locking
    features.immobiliser = 'Yes';
    features.centralLocking = 'Yes';

    // Burglar Alarm
    if (!isEra) {
        features.burglarAlarm = 'Yes';
    }

    // Emergency Stop Signal
    if (!isEra) {
        features.emergencyStopSignal = 'Yes';
    }

    // Inside Rear View Mirror
    if (isSportz || isSportzO || isAsta) {
        features.insideRearViewMirror = 'Day & Night';
    }

    // Parking Sensors
    if (isCorporate || isSportz || isSportzO || isAsta) {
        features.parkingSensor = 'Rear';
        features.parkingSensors = 'Rear';
    }

    // Rear Camera
    if (isCorporate || isSportz || isSportzO || isAsta) {
        features.reverseCamera = 'Yes';
        features.reverseCameraGuidelines = 'Static';
        features.parkingCamera = 'Rear with static guidelines';
    }

    // Rear Defogger
    if (isSportz || isSportzO || isAsta) {
        features.rearWindshieldDefogger = 'Yes';
    }

    // Headlamp escort (Follow me home)
    if (!isEra) {
        features.followMeHomeHeadlights = 'Yes';
    }

    // Wheels & Tyres
    if (isEra) {
        features.wheelSize = '14 inch';
        features.tyreSize = '165/70 R14';
        features.alloyWheels = 'No (Steel)';
    } else if (isMagna) {
        features.wheelSize = '14 inch';
        features.tyreSize = '165/70 R14';
        features.alloyWheels = 'No (Full wheel cover)';
    } else if (isCorporate || (isSportz && !isSportzO && !isDT)) {
        features.wheelSize = '15 inch';
        features.tyreSize = '175/60 R15';
        features.alloyWheels = 'No (Dual tone styled steel)';
    } else {
        features.wheelSize = '15 inch';
        features.tyreSize = '175/60 R15';
        features.alloyWheels = '15 inch Diamond Cut';
    }

    // Exterior
    if (isCorporate || isSportz || isSportzO || isAsta) {
        features.radiatorGrille = 'Painted Black';
    }

    // Projector Headlamps
    if (isSportz || isSportzO || isAsta) {
        features.headLights = 'Projector';
        features.headlights = 'Projector';
    } else {
        features.headLights = 'Halogen';
        features.headlights = 'Halogen';
    }

    // LED DRLs
    if (isSportz || isSportzO || isAsta) {
        features.daytimeRunningLights = 'LED';
        features.drl = 'Yes';
    }

    // LED Tail Lamp
    features.tailLights = 'LED';
    features.tailLight = 'LED';

    // Body Colored
    if (!isEra) {
        features.bodyColoredBumpers = 'Yes';
    }
    if (isSportz || isSportzO || isAsta) {
        features.bodyColoredDoorMirrors = 'Yes';
        features.bodyColoredDoorHandles = 'Yes';
    }

    // Chrome outside door handles
    if (isAsta) {
        features.outsideDoorHandles = 'Chrome';
    }

    // Roof Rails
    if (isSportzO || isAsta) {
        features.roofRails = 'Yes';
    }

    // Antenna
    if (isMagna || isCorporate) {
        features.radioAntenna = 'Roof Antenna';
    } else if (isSportz || isSportzO || isAsta) {
        features.radioAntenna = 'Shark Fin';
    }

    // B-pillar black tape
    if (isSportzO || isAsta) {
        features.bPillarBlackout = 'Yes';
    }

    // Turn indicators on mirrors
    if ((isCorporate && isAMT) || isSportz || isSportzO || isAsta) {
        features.sideIndicator = 'On ORVM';
    }

    // Interior
    if (isSportzO || isAsta) {
        features.interiorColor = 'Premium Glossy Black';
    }

    // Footwell Lighting
    if (!isEra) {
        features.footwellLighting = 'Yes';
    }

    // Leather wrapped steering wheel
    if ((isSportz && isDT) || isSportzO || isAsta) {
        features.steeringWheelType = 'Leather Wrapped';
    }

    // Chrome finish
    if ((isCorporate && isAMT) || isSportz || isSportzO || isAsta) {
        features.chromeGearKnob = 'Yes';
    }

    // Front room lamp
    if (!isEra) {
        features.roomLamp = 'Yes';
    }

    // Front passenger seat back pocket
    if (!isEra) {
        features.seatBackPocket = 'Yes';
    }

    // Metal finish inside door handles
    if (isSportzO || isAsta) {
        features.insideDoorHandles = 'Metal Finish';
    }

    // Infotainment
    if (isEra) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'No';
    } else if (isMagna) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = '2-DIN Integrated Audio with AM/FM';
    } else if (isCorporate) {
        features.touchScreenInfotainment = '6.75 inch';
        features.infotainmentScreen = '17.14 cm (6.75") Touchscreen Display Audio';
    } else {
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.25 cm (8") Touchscreen Display Audio with Navigation';
    }

    // Smartphone Connectivity
    if (isSportz || isSportzO || isAsta) {
        features.androidAppleCarplay = 'Wireless';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wireless';
    } else if (isCorporate) {
        features.androidAppleCarplay = 'Wired';
        features.androidAuto = 'Yes';
        features.appleCarPlay = 'Yes';
    }

    // Voice Recognition
    if (isSportz || isSportzO || isAsta) {
        features.voiceRecognition = 'Yes';
    }

    // Bluetooth
    if (!isEra) {
        features.bluetooth = 'Yes';
    }

    // Steering wheel controls
    if (!isEra) {
        features.steeringMountedControls = 'Audio & Bluetooth';
    }

    // Front & Rear Speakers
    if (!isEra) {
        features.speakers = '4 (Front & Rear)';
    }

    // USB port
    if (!isEra) {
        features.usbCChargingPorts = '1';
    }

    // Wireless Charger
    if ((isSportz && isDT) || isAsta) {
        features.wirelessCharging = 'Yes';
    }

    // Smart Key & Push Button Start
    if (isSportzO || isAsta) {
        features.keylessEntry = 'Smart Key';
        features.ignition = 'Push Button Start';
        features.pushButtonStart = 'Yes';
    } else if (!isEra) {
        features.keylessEntry = 'Yes';
        features.ignition = 'Key Start';
    }

    // Cruise Control
    if ((isSportz && !isDT && !isAMT) || isSportzO || isAsta) {
        features.cruiseControl = 'Yes';
    }

    // Power Steering
    if (!isEra) {
        features.powerSteering = 'Motor Driven Electric';
    } else {
        features.powerSteering = 'Manual';
    }

    // Tilt Steering
    if (isSportz || isSportzO || isAsta) {
        features.steeringAdjustment = 'Tilt';
    }

    // Air Conditioning
    if (isSportzO || isAsta) {
        features.airConditioning = 'Automatic';
        features.climateControl = 'Automatic';
    } else {
        features.airConditioning = 'Manual';
    }

    // Rear AC Vent
    if (!isEra) {
        features.rearACVents = 'Yes';
    }

    // Power Windows
    if (isEra) {
        features.powerWindows = 'Front Only';
    } else if (isMagna || isCorporate) {
        features.powerWindows = 'Front & Rear';
    } else {
        features.powerWindows = 'Front & Rear with Auto Down (Driver)';
    }

    // Outside Mirror
    if (isSportzO || isAsta) {
        features.outsideRearViewMirrors = 'Electric Folding';
    } else if (isCorporate && isAMT) {
        features.outsideRearViewMirrors = 'Electric Folding (AMT Only)';
    } else if (!isEra) {
        features.outsideRearViewMirrors = 'Electric Adjust';
    } else {
        features.outsideRearViewMirrors = 'Manual';
    }

    // Power Outlet
    if (!isEra) {
        features.powerOutlet = 'Front & Rear';
    }

    // Fast USB Charger Type C
    if (isCorporate || isSportz || isSportzO || isAsta) {
        features.fastUSBCharger = 'Type C';
    }

    // Driver seat height adjust
    if (isCorporate || isSportz || isSportzO || isAsta) {
        features.driverSeatAdjustment = 'Height Adjustable';
    }

    // Passenger vanity mirror
    if (!isEra) {
        features.vanityMirror = 'Passenger';
    }

    // Rear parcel tray
    if (isSportzO) {
        features.rearParcelTray = 'Yes';
    }

    // Battery saver
    if (!isEra) {
        features.batterySaver = 'Yes';
    }

    // Adjustable rear headrests
    if (!isEra) {
        features.heightAdjustableHeadrest = 'Front & Rear';
    }

    // Rear wiper washer
    if (isSportzO || isAsta) {
        features.rearWindshieldWiper = 'Yes';
    }

    // Luggage lamp
    if ((isSportz && !isDT && !isAMT) || isSportzO || isAsta) {
        features.luggageLamp = 'Yes';
    }

    // Automatic Headlamps
    if (isAsta) {
        features.automaticHeadlamp = 'Yes';
    }

    // Dual Tone (DT)
    if (isDT) {
        features.dualTonePack = 'Yes (Black Roof)';
    }

    // Exterior Design
    if (isEra) {
        features.exteriorDesign = 'Halogen headlamps, LED tail lamps, 14-inch steel wheels, basic bumpers.';
    } else if (isMagna) {
        features.exteriorDesign = 'Body colored bumpers, full wheel covers, roof antenna, halogen headlamps, LED tail lamps.';
    } else if (isCorporate) {
        features.exteriorDesign = 'Painted black grille, 15-inch styled steel wheels, roof antenna, LED tail lamps, body colored elements.';
    } else if (isSportz) {
        features.exteriorDesign = 'LED DRLs, projector headlamps, shark fin antenna, 15-inch styled/alloy wheels, body colored door handles and mirrors.';
    } else if (isSportzO) {
        features.exteriorDesign = 'LED DRLs, projector headlamps, 15-inch diamond cut alloys, shark fin antenna, roof rails, B-pillar blackout.';
    } else if (isAsta) {
        features.exteriorDesign = 'LED DRLs, projector headlamps, 15-inch diamond cut alloys, chrome door handles, shark fin antenna, roof rails, automatic headlamps.';
    }

    // Comfort Summary
    if (isEra) {
        features.comfortConvenience = 'Manual AC, front power windows, central locking, basic audio preparation.';
    } else if (isMagna || isCorporate) {
        features.comfortConvenience = 'Manual AC, all power windows, rear AC vents, Bluetooth connectivity, steering mounted controls.';
    } else if (isSportz) {
        features.comfortConvenience = 'Manual AC, rear AC vents, tilt steering, power windows with driver auto-down, rear defogger, Type-C fast charging.';
    } else if (isSportzO) {
        features.comfortConvenience = 'Auto AC, smart key, push button start, electric folding ORVMs, rear wiper, premium black interiors.';
    } else if (isAsta) {
        features.comfortConvenience = 'Auto AC, smart key, push button start, wireless charger, electric folding ORVMs, automatic headlamps, chrome accents.';
    }

    return features;
}

// Parse variant name to get engine type
function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('AMT')) return 'Petrol AMT';
    return 'Petrol MT';
}

// All 15 Grand i10 NIOS variants with prices
const I10_VARIANTS = [
    { name: 'Era Petrol MT', price: 547278 },
    { name: 'Magna Petrol MT', price: 625853 },
    { name: 'Corporate Petrol MT', price: 648629 },
    { name: 'Sportz Petrol MT', price: 679089 },
    { name: 'Magna Petrol AMT', price: 685035 },
    { name: 'Sportz DT Petrol MT', price: 701500 },
    { name: 'Sportz(O) Petrol MT', price: 706440 },
    { name: 'Corporate Petrol AMT', price: 707812 },
    { name: 'Sportz Petrol AMT', price: 731046 },
    { name: 'Asta Petrol MT', price: 739735 },
    { name: 'Sportz(O) Petrol AMT', price: 758396 },
    { name: 'Asta Petrol AMT', price: 791692 },
    { name: 'Magna Dual CNG MT', price: 716684 },
    { name: 'Sportz CNG MT', price: 758945 },
    { name: 'Sportz Dual CNG MT', price: 766720 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Find i10 NIOS model
    const i10Model = await Model.findOne({ name: { $regex: /i10.*nios/i } }).lean();
    if (!i10Model) {
        console.error('❌ Grand i10 NIOS model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== HYUNDAI GRAND i10 NIOS VARIANTS UPDATE ===\n');
    console.log(`Model ID: ${i10Model.id}`);
    console.log(`Brand ID: ${i10Model.brandId}\n`);

    // Delete existing variants
    if (!isDryRun) {
        const deleteResult = await Variant.deleteMany({ modelId: i10Model.id });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing variants\n`);
    } else {
        const existingCount = await Variant.countDocuments({ modelId: i10Model.id });
        console.log(`Would delete ${existingCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(65));

    for (const v of I10_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(30)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }

    console.log('-'.repeat(65));
    console.log(`Total: ${I10_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = I10_VARIANTS[I10_VARIANTS.length - 3]; // Asta
        const engineKey = getEngineKey(sampleVariant.name);
        const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
        const mileageData = MILEAGE_DATA[engineKey as keyof typeof MILEAGE_DATA];
        const features = getVariantFeatures(sampleVariant.name);

        const allSpecs = { ...COMMON_SPECS, ...engineSpecs, ...mileageData, ...features };
        const specCount = Object.keys(allSpecs).length;

        console.log(`\n📊 Sample: ${sampleVariant.name}`);
        console.log(`   Total Specs: ${specCount} fields`);
        console.log('\n🔍 DRY RUN - No data inserted');
        console.log('Run with --execute to insert variants');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');

        for (const variant of I10_VARIANTS) {
            const variantId = `variant-${i10Model.brandId}-${i10Model.id}-${variant.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`;
            const engineKey = getEngineKey(variant.name);
            const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
            const mileageData = MILEAGE_DATA[engineKey as keyof typeof MILEAGE_DATA];
            const features = getVariantFeatures(variant.name);

            const variantDoc = {
                id: variantId,
                name: variant.name,
                brandId: i10Model.brandId,
                modelId: i10Model.id,
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

        const newCount = await Variant.countDocuments({ modelId: i10Model.id });
        console.log(`\n🎉 Grand i10 NIOS now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
