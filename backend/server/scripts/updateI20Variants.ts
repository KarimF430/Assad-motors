/**
 * Update Hyundai i20 Variants - December 2025
 * 
 * Data Source: Official Hyundai Brochure + Price List
 * Total Variants: 16
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
        engineType: '4 Cylinder, 16 valves DOHC',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '82 Bhp',
        maxPower: '82 Bhp',
        enginePower: '82 Bhp',
        torque: '114.7 Nm',
        engineTorque: '114.7 Nm (11.7 kgm) @ 4200 r/min',
        engineTransmission: '5-Speed Manual',
        engineSpeed: '5-Speed',
        noOfGears: '5',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    'Petrol IVT': {
        engineName: '1.2l Kappa Petrol',
        engineType: '4 Cylinder, 16 valves DOHC',
        displacement: '1197',
        engineCapacity: '1197 cc',
        power: '87 Bhp',
        maxPower: '118 Bhp',
        enginePower: '87 Bhp',
        torque: '114.7 Nm',
        engineTorque: '114.7 Nm (11.7 kgm) @ 4200 r/min',
        engineTransmission: 'Intelligent Variable Transmission (IVT)',
        engineSpeed: 'IVT',
        noOfGears: 'CVT',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'IVT',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
};

// Mileage data
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageEngineName: '1.2l Kappa Petrol Manual',
        mileageCompanyClaimed: '20.35',
        mileageCityRealWorld: '14',
        mileageHighwayRealWorld: '18',
        mileageCity: '14',
        mileageHighway: '18',
        engineSummary: 'The 1.2-litre Kappa petrol engine delivers 82 Bhp and 114.7 Nm of torque. The 5-speed manual offers direct, engaging driving experience ideal for city and highway use.',
    },
    'Petrol IVT': {
        mileageEngineName: '1.2l Kappa Petrol IVT',
        mileageCompanyClaimed: '19.65',
        mileageCityRealWorld: '13',
        mileageHighwayRealWorld: '17',
        mileageCity: '13',
        mileageHighway: '17',
        engineSummary: 'The 1.2-litre Kappa petrol with IVT produces 87 Bhp for effortless city driving. The CVT-style transmission provides smooth, lag-free acceleration without gear shifts.',
    },
};

// Common specs from brochure
const COMMON_SPECS = {
    // Dimensions
    length: '3995',
    width: '1775',
    height: '1505',
    wheelbase: '2580',
    groundClearance: '170',
    turningRadius: '5.2',
    kerbWeight: '1020-1100',
    fuelTankCapacity: '37 Litres',
    seatingCapacity: '5',
    doors: '5',
    bootSpace: '311 Litres',
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
    globalNCAPRating: '3-Star',

    // Common Safety
    abs: 'Yes',
    ebd: 'Yes',
    seatbeltWarning: 'Yes (All seats)',
    speedAlertSystem: 'Yes',
    threePointSeatbelts: 'All seats',
    immobiliser: 'Yes',
    highMountedStopLamp: 'Yes',
};

// Variant-specific features
function getVariantFeatures(variantName: string) {
    const isMagnaExec = variantName.includes('Magna Executive');
    const isMagna = variantName.startsWith('Magna') && !isMagnaExec;
    const isSportz = variantName.startsWith('Sportz') && !variantName.includes('Sportz (O)');
    const isSportzO = variantName.includes('Sportz (O)');
    const isAsta = variantName.startsWith('Asta') && !variantName.includes('Asta (O)');
    const isAstaO = variantName.includes('Asta (O)');
    const isKnight = variantName.includes('Knight');
    const isDT = variantName.includes('DT');
    const isIVT = variantName.includes('IVT');

    let features: Record<string, any> = {};

    // Warranty
    features.warranty = '3 Years / Unlimited Km';

    // Key Features
    let keyFeaturesArr: string[] = [];
    if (isMagnaExec) {
        keyFeaturesArr = ['Dual Airbags', 'ABS with EBD', 'Power Steering', 'Central Locking', '14-inch Steel Wheels', 'Digital Cluster'];
    } else if (isMagna) {
        keyFeaturesArr = ['4 Airbags', 'Rear Parking Sensors', 'Power Windows', 'Front & Rear Speakers', '15-inch Steel Wheels', 'Follow-me-home Headlamps'];
    } else if (isSportz) {
        keyFeaturesArr = ['4 Airbags', '8-inch Touchscreen', 'LED DRLs', 'Rear Camera', '16-inch Styled Wheels', 'Smart Sunroof', isDT ? 'Dual Tone Exterior' : 'Shark Fin Antenna'];
    } else if (isSportzO) {
        keyFeaturesArr = ['4 Airbags', 'Smart Key', 'Push Button Start', 'Cruise Control', '16-inch Styled Wheels', 'Smart Sunroof', isKnight ? 'Knight Edition Styling' : 'Electric Folding ORVMs'];
    } else if (isAsta) {
        keyFeaturesArr = ['4 Airbags', '10.25-inch HD Display', 'Bose 7-Speaker Audio', '16-inch Diamond Cut Alloys', 'Smart Sunroof', 'Wireless CarPlay', 'Automatic AC'];
    } else if (isAstaO) {
        keyFeaturesArr = ['4 Airbags', '10.25-inch HD Display', 'Bose Audio', 'Voice Sunroof', 'BlueLink Connected Car', 'Dash Cam', 'Ambient Lighting', isKnight ? 'Knight Edition Styling' : 'Wireless Charger'];
    }
    if (isDT) keyFeaturesArr.push('Dual Tone Exterior');
    if (isIVT) keyFeaturesArr.push('IVT Automatic');
    features.keyFeatures = keyFeaturesArr.join(', ');

    // Header Summary
    if (isMagnaExec) {
        features.headerSummary = `The Hyundai i20 ${variantName} is the entry-level variant offering essential features at an attractive price point. Perfect for first-time car buyers.`;
    } else if (isMagna) {
        features.headerSummary = `The Hyundai i20 ${variantName} adds 4 airbags and rear parking sensors for enhanced safety and convenience in daily driving.`;
    } else if (isSportz) {
        features.headerSummary = `The Hyundai i20 ${variantName} brings an 8-inch touchscreen, LED DRLs, and smart sunroof for a feature-rich driving experience.`;
    } else if (isSportzO) {
        features.headerSummary = `The Hyundai i20 ${variantName} offers smart key with push button start, cruise control, and electric folding ORVMs for premium convenience.`;
    } else if (isAsta) {
        features.headerSummary = `The Hyundai i20 ${variantName} features a 10.25-inch HD display, Bose premium audio, and wireless connectivity for a premium experience.`;
    } else if (isAstaO) {
        features.headerSummary = `The Hyundai i20 ${variantName} is the top-spec variant with BlueLink connected car tech, dash cam, voice-enabled sunroof, and all premium features.`;
    }

    // Description
    if (isMagnaExec) {
        features.description = 'The Magna Executive is the base variant designed for practical buyers who want i20\'s stylish design and proven reliability at an accessible price.';
    } else if (isMagna) {
        features.description = 'The Magna variant adds important safety features like 4 airbags and ESC along with rear parking sensors and power windows for everyday convenience.';
    } else if (isSportz) {
        features.description = 'The Sportz variant offers an 8-inch touchscreen with wireless smartphone connectivity, LED DRLs, and a smart electric sunroof - great value for tech-savvy buyers.';
    } else if (isSportzO) {
        features.description = 'The Sportz(O) elevates comfort with smart key entry, push button start, cruise control, and electric folding outside mirrors. The Knight Edition adds exclusive styling.';
    } else if (isAsta) {
        features.description = 'The Asta variant brings premium features including a large 10.25-inch HD touchscreen, Bose 7-speaker audio system, and 16-inch diamond cut alloy wheels.';
    } else if (isAstaO) {
        features.description = 'The Asta(O) is the flagship variant with Hyundai BlueLink connected car technology, dash cam, voice-enabled sunroof, ambient lighting, and every premium feature available.';
    }

    // Airbags
    if (isMagnaExec) {
        features.airbags = '2';
        features.airbagsLocation = 'Driver & Passenger';
    } else {
        features.airbags = '4';
        features.airbagsLocation = 'Driver, Passenger & Side Curtain';
    }

    // TPMS
    if (!isMagnaExec) {
        features.tyrePressureMonitor = 'Yes (Highline)';
    }

    // Dash Cam
    if (isAstaO && isIVT) {
        features.dashCam = 'Yes';
    }

    // Puddle Lamps
    if (isAstaO) {
        features.puddleLamps = 'Yes';
    }

    // ESC, VSM, HAC
    if (!isMagnaExec) {
        features.electronicStabilityProgram = 'Yes';
        features.esc = 'Yes';
        features.hillHoldAssist = 'Yes';
        features.vehicleStabilityManagement = 'Yes';
    }

    // Rear Parking Sensors & Camera
    if (!isMagnaExec) {
        features.parkingSensor = 'Rear';
        features.parkingSensors = 'Rear';
    }
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.reverseCamera = 'Yes';
        features.reverseCameraGuidelines = 'Dynamic';
        features.parkingCamera = 'Rear with dynamic guidelines';
    }

    // Inside Rear View Mirror
    if (isMagnaExec || isMagna) {
        features.insideRearViewMirror = 'Day & Night';
    } else if (isSportz || isSportzO) {
        features.insideRearViewMirror = 'Day & Night';
    } else {
        features.insideRearViewMirror = 'BlueLink Buttons (SOS, RSA)';
    }

    // Driver Rear View Monitor
    if (isAstaO) {
        features.driverRearViewMonitor = 'Yes';
    }

    // Automatic Headlamps
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.automaticHeadlamp = 'Yes';
    }

    // Headlamp escort (Follow me home)
    if (!isMagnaExec) {
        features.followMeHomeHeadlights = 'Yes';
    }

    // Emergency Stop Signal
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.emergencyStopSignal = 'Yes';
    }

    // Central Locking
    features.centralLocking = 'Yes (Door & Tailgate)';

    // Smart Pedal
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.smartPedal = 'Yes';
    }

    // Impact sensing door unlock
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.impactSensingDoorUnlock = 'Yes';
    }

    // Speed sensing door lock
    if (!isMagnaExec) {
        features.speedSensingDoorLocks = 'Yes';
    }

    // Keyless Entry
    if (isMagnaExec || isMagna) {
        features.keylessEntry = 'Foldable Key';
        features.ignition = 'Key Start';
        features.pushButtonStart = 'No';
    } else if (isSportz) {
        features.keylessEntry = 'Foldable Key';
        features.ignition = 'Key Start';
        features.pushButtonStart = 'No';
    } else {
        features.keylessEntry = 'Smart Key';
        features.ignition = 'Push Button Start';
        features.pushButtonStart = 'Yes';
    }

    // Burglar Alarm
    if (!isMagnaExec) {
        features.burglarAlarm = 'Yes';
    }

    // Rear Defogger
    if (!isMagnaExec) {
        features.rearWindshieldDefogger = 'Yes (with timer)';
    }

    // Seat Belt Pretensioners
    if (!isMagnaExec) {
        features.seatBeltPretensioners = 'Driver & Passenger';
    }

    // ISOFIX
    if (isSportzO || isAsta || isAstaO) {
        features.isofix = 'Yes';
        features.isofixMounts = 'Yes';
    }

    // Height Adjustable Seat Belts
    if (!isMagnaExec) {
        features.heightAdjustableSeatbelts = 'Driver & Passenger';
    }

    // Headlights
    if (isMagnaExec || isMagna) {
        features.headLights = 'Halogen';
        features.headlights = 'Halogen';
    } else if (isSportz || isSportzO) {
        features.headLights = 'Halogen';
        features.headlights = 'Halogen';
    } else {
        features.headLights = 'LED MFR';
        features.headlights = 'LED MFR (Multi-Focus Reflector)';
    }

    // Z-Shaped LED Tail Lamps
    if (isAsta || isAstaO) {
        features.tailLights = 'Z-Shaped LED';
        features.tailLight = 'Z-Shaped LED';
    } else {
        features.tailLights = 'LED';
        features.tailLight = 'LED';
    }

    // LED DRLs
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.daytimeRunningLights = 'LED';
        features.drl = 'Yes';
    }

    // Chrome Beltline with flyback
    if (isAsta || isAstaO) {
        features.chromeBeltline = 'Yes (with flyback rear quarter glass)';
    }

    // Parametric Jewel Pattern Grille
    if (!isMagnaExec) {
        features.parametricGrille = 'Yes';
    }

    // Painted Black Finish
    if (!isMagnaExec) {
        features.paintedBlackFinish = 'Air curtain, Tailgate garnish';
    }
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.paintedBlackFinish = 'Air curtain, Tailgate garnish, Side sill with i20 branding';
    }
    if (isAsta || isAstaO) {
        features.paintedBlackFinish = 'Air curtain, Tailgate garnish, Side sill with i20 branding, Side wing spoiler, Sporty tailgate spoiler';
    }

    // Door Handles
    if (!isMagnaExec) {
        features.outsideDoorHandles = 'Body Coloured';
    }
    if (isAsta || isAstaO) {
        features.outsideDoorHandles = 'Chrome';
    }

    // Skid Plate
    if (!isMagnaExec) {
        features.skidPlate = 'Silver';
    }
    if (isAstaO && isKnight) {
        features.skidPlate = 'Black Painted';
    }

    // ORVM
    if (isMagnaExec) {
        features.outsideRearViewMirrors = 'Manual';
        features.outsideRearViewMirror = 'Body Colour';
    } else if (isMagna) {
        features.outsideRearViewMirrors = 'Electric Adjust';
        features.outsideRearViewMirror = 'Body Colour';
    } else if (isSportz) {
        features.outsideRearViewMirrors = 'Electric Adjust';
        features.outsideRearViewMirror = 'Body Colour';
    } else if (isAstaO && isDT) {
        features.outsideRearViewMirrors = 'Electric Folding with Auto Fold';
        features.outsideRearViewMirror = 'Black Painted (DT only)';
    } else {
        features.outsideRearViewMirrors = 'Electric Folding with Auto Fold';
        features.outsideRearViewMirror = 'Body Colour';
    }

    // Antenna
    if (isMagnaExec || isMagna) {
        features.radioAntenna = 'Pole (Micro)';
    } else {
        features.radioAntenna = 'Shark Fin';
    }

    // Body Colour Bumpers
    features.bodyColoredBumpers = 'Yes';

    // B-Pillar Blackout
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.bPillarBlackout = 'Yes';
    }

    // Turn Indicators on Mirrors
    if (!isMagnaExec) {
        features.sideIndicator = 'On ORVM';
    }

    // Wheels
    if (isMagnaExec) {
        features.wheelSize = '14 inch';
        features.tyreSize = '185/70 R14';
        features.alloyWheels = 'No (Hub wheel covers)';
    } else if (isMagna) {
        features.wheelSize = '15 inch';
        features.tyreSize = '185/65 R15';
        features.alloyWheels = 'No (Full wheel covers)';
    } else if (isSportz || isSportzO) {
        features.wheelSize = '16 inch';
        features.tyreSize = '195/55 R16';
        features.alloyWheels = isDT ? '16 inch Dual Tone' : '16 inch Styled Steel';
    } else {
        features.wheelSize = '16 inch';
        features.tyreSize = '195/55 R16';
        features.alloyWheels = isKnight ? '16 inch Diamond Cut Black Painted' : '16 inch Diamond Cut';
    }

    // Red Brake Calipers
    if (isAstaO) {
        features.brakeCalipers = 'Red';
    }

    // Knight Edition Emblem
    if (isKnight) {
        features.knightEditionEmblem = 'Yes';
    }

    // Interior
    if (isMagnaExec || isMagna || isSportz) {
        features.interiorColor = '2 Tone Black & Grey with Silver Inserts';
    } else if (isKnight) {
        features.interiorColor = 'All Black with Brass Coloured Inserts';
    } else {
        features.interiorColor = '2 Tone Black & Grey with Silver Inserts';
    }

    // Seat Upholstery
    if (isMagnaExec || isMagna) {
        features.seatUpholstery = 'Fabric (2 Tone Black & Grey)';
    } else if (isKnight) {
        features.seatUpholstery = 'Fabric + Leather (All Black with Brass Highlights)';
    } else if (isAsta || isAstaO) {
        features.seatUpholstery = 'Fabric + Leather (2 Tone Black & Grey)';
    } else {
        features.seatUpholstery = 'Fabric (2 Tone Black & Grey)';
    }

    // Crashpad Soft Touch
    if (isAsta || isAstaO) {
        features.crashpadSoftTouch = 'Yes';
    }

    // Door Armrest Covering
    if (isSportzO || isAsta || isAstaO) {
        features.doorArmrestCovering = 'Leather';
    }

    // Ambient Lighting
    if (isAsta || isAstaO) {
        features.ambientLighting = 'Blue';
    }
    if (isKnight) {
        features.ambientLighting = 'Amber';
    }

    // Sporty Metal Pedals
    if (isAsta || isAstaO) {
        features.sportyMetalPedals = 'Yes';
    }

    // Rear Parcel Tray
    if (isSportzO || isAsta || isAstaO) {
        features.rearParcelTray = 'Yes';
    }

    // Metal Finish Inside Door Handles
    if (!isMagnaExec) {
        features.insideDoorHandles = 'Metal Finish';
    }

    // Leather Wrapped Gear Knob & Steering
    if (isSportzO || isAsta || isAstaO) {
        features.leatherGearKnob = 'Yes';
        features.steeringWheelType = 'Leather Wrapped';
    }

    // Sunglass Holder
    if (!isMagnaExec) {
        features.sunglassHolder = 'Yes';
    }

    // Digital Cluster
    features.digitalCluster = 'Yes (TFT MID)';

    // Tachometer
    features.tachometer = 'Yes';

    // Front Armrest
    if (isMagna) {
        features.frontArmrest = 'Fixed Type';
    } else if (!isMagnaExec) {
        features.frontArmrest = 'Sliding with Storage';
    }

    // Infotainment
    if (isMagnaExec || isMagna) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'No';
    } else if (isSportz || isSportzO) {
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.32 cm (8") Touchscreen Infotainment';
    } else {
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm (10.25") HD Infotainment & Navigation';
    }

    // Smartphone Connectivity
    if (isSportz) {
        features.androidAppleCarplay = 'Wired';
        features.androidAuto = 'Yes';
        features.appleCarPlay = 'Yes';
    } else if (isSportzO && !isIVT) {
        features.androidAppleCarplay = 'Wired (MT)';
        features.androidAuto = 'Yes';
        features.appleCarPlay = 'Yes';
    } else if (isSportzO && isIVT) {
        features.androidAppleCarplay = 'Wireless';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wireless';
    } else if (isAsta || isAstaO) {
        features.androidAppleCarplay = 'Wireless';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wireless';
    }

    // Bose Premium Audio
    if (isSportzO || isAsta || isAstaO) {
        features.speakers = '7 (Bose Premium)';
        features.tweeters = '2 (Front)';
        features.subwoofers = '1';
    } else if (!isMagnaExec) {
        features.speakers = '4 (Front & Rear)';
    }

    // Ambient Sounds of Nature
    if (isAstaO) {
        features.ambientSoundsOfNature = 'Yes';
    }

    // USB Port
    if (!isMagnaExec) {
        features.usbCChargingPorts = 'Front & Rear';
    }

    // Bluetooth
    if (!isMagnaExec) {
        features.bluetooth = 'Yes';
    }

    // Steering Wheel Controls
    if (!isMagnaExec) {
        features.steeringMountedControls = 'Audio & Bluetooth';
    }

    // Voice Recognition
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.voiceRecognition = 'Yes';
    }

    // BlueLink Connected Car
    if (isAstaO) {
        features.connectedCarTech = 'Hyundai BlueLink';
        features.otaUpdates = 'Yes (Maps)';
        features.bluelinkSmartWatch = 'Yes';
        features.homeToCar = 'Yes (with Alexa)';
    }

    // Idle Stop & Go
    if (!isIVT) {
        features.idleStopGo = 'Yes (MT Only)';
    }

    // Sunroof
    if (isSportz || isSportzO) {
        features.sunroof = 'Smart Electric';
    } else if (isAstaO) {
        features.sunroof = 'Voice Enabled Smart Electric';
    } else if (isAsta) {
        features.sunroof = 'Smart Electric';
    }

    // Air Conditioning
    if (isMagnaExec || isMagna) {
        features.airConditioning = 'Manual';
        features.climateControl = 'No';
    } else if (isSportz || isSportzO) {
        features.airConditioning = 'Manual';
        features.climateControl = 'No';
    } else {
        features.airConditioning = 'Automatic (FATC with Digital Display)';
        features.climateControl = 'Automatic';
    }

    // Cruise Control
    if (isSportzO || isAsta || isAstaO) {
        features.cruiseControl = 'Yes';
    }

    // Drive Modes
    if (isIVT && (isSportz || isSportzO)) {
        features.drivingModes = 'Normal & Sport (IVT Only)';
    }

    // Power Windows
    if (isMagnaExec) {
        features.powerWindows = 'Front Only';
    } else if (isMagna) {
        features.powerWindows = 'Front & Rear with Auto Down (Driver)';
    } else if (isSportz || isSportzO) {
        features.powerWindows = 'Front & Rear with Auto Down (Driver)';
    } else {
        features.powerWindows = 'Front & Rear with Auto Up/Down & Pinch Guard (Driver)';
    }

    // Power Steering
    if (!isMagnaExec) {
        features.powerSteering = 'Motor Driven Electric';
    }

    // Rear AC Vents
    if (!isMagnaExec) {
        features.rearACVents = 'Yes';
    }

    // Tilt & Telescopic
    if (!isMagnaExec) {
        features.steeringAdjustment = 'Tilt & Telescopic';
    }

    // Rear Wiper & Washer
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.rearWindshieldWiper = 'Yes';
    }

    // Clutch Footrest
    if (!isMagnaExec) {
        features.clutchFootrest = 'Yes';
    }

    // Vanity Mirror
    if (!isMagnaExec) {
        features.vanityMirror = 'Passenger';
    }

    // Front Power Outlet
    if (!isMagnaExec) {
        features.powerOutlet = 'Front';
    }

    // Map Lamp
    if (!isMagnaExec) {
        features.mapLamps = 'Yes';
    }

    // Luggage Lamp
    if (isSportz || isSportzO || isAsta || isAstaO) {
        features.luggageLamp = 'Yes';
    }

    // Battery Saver
    if (!isMagnaExec) {
        features.batterySaver = 'Yes';
    }

    // Wireless Charger
    if (isAstaO) {
        features.wirelessCharging = 'Yes';
    }

    // Adjustable Headrests
    features.heightAdjustableHeadrest = 'Front & Rear';

    // Height Adjustable Driver Seat
    if (!isMagnaExec) {
        features.driverSeatAdjustment = 'Height Adjustable';
    }

    // Dual Tone
    if (isDT) {
        features.dualTonePack = 'Yes (Black Roof)';
    }

    // Exterior Design
    if (isMagnaExec) {
        features.exteriorDesign = 'Halogen headlamps, LED tail lamps, 14-inch steel wheels, parametric jewel grille.';
    } else if (isMagna) {
        features.exteriorDesign = 'Halogen headlamps, LED tail lamps, 15-inch full wheel covers, parametric grille, body coloured door handles.';
    } else if (isSportz) {
        features.exteriorDesign = 'LED DRLs, halogen headlamps, 16-inch styled wheels, shark fin antenna, B-pillar blackout, silver skid plate.';
    } else if (isSportzO) {
        features.exteriorDesign = 'LED DRLs, halogen headlamps, 16-inch styled wheels, shark fin antenna, electric folding ORVMs, silver skid plate.';
    } else if (isAsta) {
        features.exteriorDesign = 'LED MFR headlamps, Z-shaped LED tail lamps, 16-inch diamond cut alloys, chrome door handles, chrome beltline.';
    } else if (isAstaO) {
        features.exteriorDesign = 'LED MFR headlamps, Z-shaped LED tail lamps, 16-inch diamond cut alloys, red brake calipers, puddle lamps, chrome accents.';
    }

    // Comfort Summary
    if (isMagnaExec) {
        features.comfortConvenience = 'Manual AC, front power windows, central locking, digital cluster.';
    } else if (isMagna) {
        features.comfortConvenience = 'Manual AC, all power windows, rear AC vents, tilt & telescopic steering, Bluetooth connectivity.';
    } else if (isSportz) {
        features.comfortConvenience = 'Manual AC, smart sunroof, rear camera, rear defogger, 8-inch touchscreen, sliding armrest.';
    } else if (isSportzO) {
        features.comfortConvenience = 'Manual AC, smart key, push button start, cruise control, electric folding ORVMs, Bose audio.';
    } else if (isAsta) {
        features.comfortConvenience = 'Auto AC, smart sunroof, 10.25-inch HD display, Bose audio, wireless CarPlay, ambient lighting.';
    } else if (isAstaO) {
        features.comfortConvenience = 'Auto AC, voice sunroof, BlueLink connected car, dash cam (IVT), wireless charger, ambient lighting, Alexa integration.';
    }

    return features;
}

// Parse variant name to get engine type
function getEngineKey(variantName: string): string {
    if (variantName.includes('IVT')) return 'Petrol IVT';
    return 'Petrol MT';
}

// All 16 i20 variants with prices
const I20_VARIANTS = [
    { name: 'Magna Executive Petrol MT', price: 686865 },
    { name: 'Magna Petrol MT', price: 712385 },
    { name: 'Sportz Petrol MT', price: 774403 },
    { name: 'Sportz DT Petrol MT', price: 783734 },
    { name: 'Magna Petrol IVT', price: 813005 },
    { name: 'Sportz (O) Petrol MT', price: 827823 },
    { name: 'Sportz (O) Knight Edition Petrol MT', price: 836879 },
    { name: 'Asta Petrol MT', price: 861211 },
    { name: 'Sportz Petrol IVT', price: 870449 },
    { name: 'Asta (O) Petrol MT', price: 914539 },
    { name: 'Sportz (O) Petrol IVT', price: 914713 },
    { name: 'Asta (O) DT Petrol MT', price: 931004 },
    { name: 'Asta (O) Petrol IVT', price: 1028970 },
    { name: 'Asta (O) Knight Edition Petrol IVT', price: 1038026 },
    { name: 'Asta DT Petrol IVT', price: 1042691 },
    { name: 'Asta (O) DT Knight Edition Petrol IVT', price: 1051747 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Find i20 model
    const i20Model = await Model.findOne({ name: { $regex: /^i20$/i } }).lean();
    if (!i20Model) {
        console.error('❌ Hyundai i20 model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== HYUNDAI i20 VARIANTS UPDATE ===\n');
    console.log(`Model ID: ${i20Model.id}`);
    console.log(`Brand ID: ${i20Model.brandId}\n`);

    // Delete existing variants
    if (!isDryRun) {
        const deleteResult = await Variant.deleteMany({ modelId: i20Model.id });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing variants\n`);
    } else {
        const existingCount = await Variant.countDocuments({ modelId: i20Model.id });
        console.log(`Would delete ${existingCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(70));

    for (const v of I20_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(42)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey}`);
    }

    console.log('-'.repeat(70));
    console.log(`Total: ${I20_VARIANTS.length} variants\n`);

    if (isDryRun) {
        const sampleVariant = I20_VARIANTS[I20_VARIANTS.length - 1];
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

        for (const variant of I20_VARIANTS) {
            const variantId = `variant-${i20Model.brandId}-${i20Model.id}-${variant.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`;
            const engineKey = getEngineKey(variant.name);
            const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
            const mileageData = MILEAGE_DATA[engineKey as keyof typeof MILEAGE_DATA];
            const features = getVariantFeatures(variant.name);

            const variantDoc = {
                id: variantId,
                name: variant.name,
                brandId: i20Model.brandId,
                modelId: i20Model.id,
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

        const newCount = await Variant.countDocuments({ modelId: i20Model.id });
        console.log(`\n🎉 Hyundai i20 now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
