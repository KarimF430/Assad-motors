/**
 * Update Hyundai Creta Variants - December 2025 - COMPLETE SPECS
 * 
 * Data Source: Official Hyundai Brochure + Price List
 * Total Variants: 70
 * All 120+ specs from brochure
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Engine Specs from Brochure (Page 5 - Technical Specifications)
const ENGINES = {
    '1.5 MPi Petrol MT': {
        engineName: '1.5l MPi Petrol',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1497',
        engineCapacity: '1497 cc',
        power: '113 Bhp @ 6300 rpm',
        maxPower: '113 Bhp',
        enginePower: '113 Bhp',
        torque: '143.8 Nm @ 4500 rpm',
        engineTorque: '143.8 Nm (14.7 kgm) @ 4500 r/min',
        engineTransmission: 'Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    '1.5 MPi Petrol IVT': {
        engineName: '1.5l MPi Petrol',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1497',
        engineCapacity: '1497 cc',
        power: '113 Bhp @ 6300 rpm',
        maxPower: '113 Bhp',
        enginePower: '113 Bhp',
        torque: '143.8 Nm @ 4500 rpm',
        engineTorque: '143.8 Nm (14.7 kgm) @ 4500 r/min',
        engineTransmission: 'IVT (Intelligent Variable Transmission)',
        engineSpeed: 'IVT',
        noOfGears: 'CVT',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'IVT',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    '1.5 Diesel MT': {
        engineName: '1.5l U2 CRDi Diesel',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1493',
        engineCapacity: '1493 cc',
        power: '114 Bhp @ 4000 rpm',
        maxPower: '114 Bhp',
        enginePower: '114 Bhp',
        torque: '250 Nm @ 1500-2750 rpm',
        engineTorque: '250 Nm (25.5 kgm) @ 1500-2750 r/min',
        engineTransmission: 'Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    '1.5 Diesel AT': {
        engineName: '1.5l U2 CRDi Diesel',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1493',
        engineCapacity: '1493 cc',
        power: '114 Bhp @ 4000 rpm',
        maxPower: '114 Bhp',
        enginePower: '114 Bhp',
        torque: '250 Nm @ 1500-2750 rpm',
        engineTorque: '250 Nm (25.5 kgm) @ 1500-2750 r/min',
        engineTransmission: '6-Speed Automatic',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Automatic',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
    '1.5 Turbo GDi DCT': {
        engineName: '1.5l Turbo GDi Petrol',
        engineType: '4 cylinders, 16 valves DOHC Turbocharged',
        displacement: '1482',
        engineCapacity: '1482 cc',
        power: '158 Bhp @ 5500 rpm',
        maxPower: '158 Bhp',
        enginePower: '158 Bhp',
        torque: '253 Nm @ 1500-3500 rpm',
        engineTorque: '253 Nm (25.8 kgm) @ 1500-3500 r/min',
        engineTransmission: '7-Speed DCT (Dual Clutch Transmission)',
        engineSpeed: '7-Speed DCT',
        noOfGears: '7',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'DCT',
        turboCharged: 'Yes',
        paddleShifter: 'Yes',
        driveType: 'FWD',
        driveTrain: 'Front Wheel Drive',
    },
};

// Mileage data by engine type
const MILEAGE_DATA = {
    '1.5 MPi Petrol MT': {
        mileageEngineName: '1.5l MPi Petrol Manual',
        mileageCompanyClaimed: '17.4',
        mileageCityRealWorld: '12',
        mileageHighwayRealWorld: '16',
        mileageCity: '12',
        mileageHighway: '16',
        engineSummary: 'The 1.5-litre MPi petrol engine delivers 113 Bhp of power and 143.8 Nm of torque. Paired with a 6-speed manual transmission, it offers a good balance of performance and fuel efficiency for daily commutes.',
    },
    '1.5 MPi Petrol IVT': {
        mileageEngineName: '1.5l MPi Petrol IVT',
        mileageCompanyClaimed: '17.7',
        mileageCityRealWorld: '11',
        mileageHighwayRealWorld: '15',
        mileageCity: '11',
        mileageHighway: '15',
        engineSummary: 'The 1.5-litre MPi petrol engine with Intelligent Variable Transmission (IVT) provides smooth, seamless gear shifts. With 113 Bhp power, it is ideal for city driving with effortless acceleration.',
    },
    '1.5 Diesel MT': {
        mileageEngineName: '1.5l U2 CRDi Diesel Manual',
        mileageCompanyClaimed: '21.8',
        mileageCityRealWorld: '15',
        mileageHighwayRealWorld: '19',
        mileageCity: '15',
        mileageHighway: '19',
        engineSummary: 'The 1.5-litre U2 CRDi diesel engine produces 114 Bhp and an impressive 250 Nm of torque. The 6-speed manual gearbox offers excellent highway cruising capability and superior fuel economy.',
    },
    '1.5 Diesel AT': {
        mileageEngineName: '1.5l U2 CRDi Diesel Automatic',
        mileageCompanyClaimed: '18.5',
        mileageCityRealWorld: '13',
        mileageHighwayRealWorld: '17',
        mileageCity: '13',
        mileageHighway: '17',
        engineSummary: 'The 1.5-litre diesel with 6-speed automatic transmission combines 250 Nm torque with effortless driving. Perfect for those who want diesel efficiency with automatic convenience.',
    },
    '1.5 Turbo GDi DCT': {
        mileageEngineName: '1.5l Turbo GDi Petrol DCT',
        mileageCompanyClaimed: '18.4',
        mileageCityRealWorld: '11',
        mileageHighwayRealWorld: '15',
        mileageCity: '11',
        mileageHighway: '15',
        engineSummary: 'The 1.5-litre Turbocharged GDi petrol engine is the performance powerhouse with 158 Bhp and 253 Nm. The 7-speed DCT with paddle shifters delivers sporty, engaging driving dynamics.',
    },
};

// Common specs from brochure (apply to ALL variants)
const COMMON_SPECS = {
    // Dimensions (from Page 5)
    length: '4330',
    width: '1790',
    height: '1635',
    wheelbase: '2610',
    groundClearance: '190',
    turningRadius: '5.2',
    kerbWeight: '1315-1435',
    fuelTankCapacity: '50 Litres',
    seatingCapacity: '5',
    doors: '5',
    bootSpace: '433 Litres',
    bootSpaceAfterFoldingRearRowSeats: '1025 Litres',
    cupholders: '4',

    // Suspension (from Page 5)
    frontSuspension: 'McPherson strut with coil spring',
    rearSuspension: 'Coupled torsion beam axle',

    // Brakes (from Page 5)
    frontBrake: 'Ventilated Disc',
    rearBrake: 'Disc',
    discBrakes: 'Front (Vented) & Rear',

    // Emission
    emissionStandard: 'BS6 Phase 2',

    // Global NCAP Rating
    globalNCAPRating: '3-Star (Adult & Child)',

    // Common Safety (all variants)
    abs: 'Yes',
    ebd: 'Yes',
    brakeAssist: 'Yes',
    electronicStabilityProgram: 'Yes (ESC)',
    esc: 'Yes',
    hillHoldAssist: 'Yes (HAC)',
    hillAssist: 'Yes',
    seatbeltWarning: 'Yes (All seats)',
    speedAlertSystem: 'Yes',
    immobiliser: 'Yes',
    isofixMounts: 'Yes',
    isofix: 'Yes',
    speedSensingDoorLocks: 'Yes',

    // Common Comfort
    rearACVents: 'Yes',
    rearArmrest: 'Yes (with cup holders)',
    frontArmrest: 'Yes (Sliding with storage)',
    powerSteering: 'Motor driven EPS',
    steeringAdjustment: 'Tilt & Telescopic',
    powerWindows: 'All 4 with driver auto up/down',
    rearWindshieldDefogger: 'Yes (with timer)',

    // Common Exterior
    radioAntenna: 'Shark Fin',
    rearWindshieldWiper: 'Yes (with washer)',

    // USB & Charging
    usbCChargingPorts: '3 (1 Front, 2 Rear)',
    twelvevChargingPorts: '1',
};

// Variant-specific features based on trim level (from brochure pages 1-4)
function getVariantFeatures(variantName: string) {
    const isE = variantName.startsWith('E ');
    const isEX = variantName.startsWith('EX ') || variantName.startsWith('EX(O)');
    const isS = variantName.startsWith('S ') || variantName.startsWith('S(O)');
    const isSX = variantName.startsWith('SX ');
    const isSXTech = variantName.includes('SX Tech');
    const isSXPremium = variantName.includes('SX Premium');
    const isSXO = variantName.startsWith('SX(O)');
    const isKing = variantName.startsWith('King');
    const isKnight = variantName.includes('Knight');
    const isDT = variantName.includes('DT');
    const isAT = variantName.includes(' AT') || variantName.includes('IVT') || variantName.includes('DCT');
    const isDiesel = variantName.includes('Diesel');
    const isDCT = variantName.includes('DCT');

    let features: Record<string, any> = {};

    // ============ KEY INFO & SEO FIELDS ============

    // Warranty
    features.warranty = '3 Years / Unlimited Km';

    // Is Value for Money
    if (isEX || isS || isSX) {
        features.isValueForMoney = true;
    }

    // Key Features (generated based on variant)
    let keyFeaturesArr: string[] = [];

    if (isE) {
        keyFeaturesArr = ['Dual Airbags', 'ABS with EBD', 'Rear Parking Sensors', 'LED Headlamps', 'Manual AC', 'Steel Wheels'];
    } else if (isEX) {
        keyFeaturesArr = ['Dual Airbags', '8" Touchscreen', 'Wireless CarPlay/Android Auto', 'Rear Parking Sensors', 'LED DRL', 'Follow-me-home Headlamps'];
    } else if (isS) {
        keyFeaturesArr = ['6 Airbags', '8" Touchscreen', 'Smart Panoramic Sunroof', '17" Alloy Wheels', 'Smart Key', 'Push Button Start', isDT ? 'Dual Tone Exterior' : 'Rear Camera'];
    } else if (isSX) {
        keyFeaturesArr = ['6 Airbags', '10.25" HD Display', 'Bose 8-Speaker Audio', '17" Diamond Cut Alloys', 'Cruise Control', 'BlueLink Connected Car', 'LED Projector Headlamps'];
    } else if (isSXTech) {
        keyFeaturesArr = ['6 Airbags', '10.25" HD Display', 'Wireless Charger', 'Bose Premium Audio', '10.25" Digital Cluster', 'BlueLink', 'Front Parking Sensors'];
    } else if (isSXPremium) {
        keyFeaturesArr = ['6 Airbags', '10.25" HD Display', 'Leather Seats', 'Bose Premium Audio', 'BlueLink', 'Automatic Headlamps', 'Rain Sensing Wipers'];
    } else if (isSXO) {
        keyFeaturesArr = ['6 Airbags', 'Level 2 ADAS', 'Ventilated Front Seats', 'Voice-enabled Panoramic Sunroof', '18" Alloys', 'Smart Cruise with Stop & Go', 'Blind Spot Monitor', 'Electric Driver Seat'];
    } else if (isKing) {
        keyFeaturesArr = ['6 Airbags', 'Level 2 ADAS', 'Ventilated Seats', 'Panoramic Sunroof', '18" Alloys', 'Rear Wireless Charger', '8-way Electric Front Seats', 'Bose Audio', isKnight ? 'Knight Edition Styling' : 'King Edition Exclusive'];
    }

    if (isDT) keyFeaturesArr.push('Dual Tone Exterior');
    if (isDCT) keyFeaturesArr.push('160 PS Turbo Engine', 'Paddle Shifters');

    features.keyFeatures = keyFeaturesArr.join(', ');

    // Header Summary (SEO description)
    if (isE) {
        features.headerSummary = `The Hyundai Creta ${variantName} is the most affordable variant, offering essential features like dual airbags, ABS, and LED lighting. Perfect for buyers seeking Creta's spacious cabin and stylish design at an entry-level price.`;
    } else if (isEX) {
        features.headerSummary = `The Hyundai Creta ${variantName} adds an 8-inch touchscreen with wireless Apple CarPlay and Android Auto. A great mid-range option with connected features and solid safety.`;
    } else if (isS) {
        features.headerSummary = `The Hyundai Creta ${variantName} brings the popular Smart Panoramic Sunroof, 6 airbags, and smart key with push button start. One of the best-selling variants.`;
    } else if (isSX) {
        features.headerSummary = `The Hyundai Creta ${variantName} offers premium features including a 10.25-inch HD display, Bose audio, BlueLink connected car tech, and LED projector headlamps.`;
    } else if (isSXTech) {
        features.headerSummary = `The Hyundai Creta ${variantName} adds a 10.25-inch fully digital cluster and wireless phone charger to the SX's premium feature set.`;
    } else if (isSXPremium) {
        features.headerSummary = `The Hyundai Creta ${variantName} features genuine leather upholstery, making it a luxurious choice for those who prioritize cabin comfort.`;
    } else if (isSXO) {
        features.headerSummary = `The Hyundai Creta ${variantName} is loaded with Level 2 ADAS, ventilated seats, 18-inch alloys, and advanced safety tech making it one of the safest SUVs in India.`;
    } else if (isKing) {
        features.headerSummary = `The Hyundai Creta ${variantName} is the flagship variant with exclusive King Edition styling, rear wireless charging, 8-way electric seats, and every premium feature available.`;
    }

    // Description
    if (isE) {
        features.description = 'The base E variant is ideal for practical buyers who want Creta\'s proven reliability and spacious interior at the most accessible price point. It includes essential safety features like ABS with EBD, dual airbags, and LED headlamps.';
    } else if (isEX) {
        features.description = 'The EX variant brings modern connectivity with an 8-inch touchscreen featuring wireless smartphone integration. It retains the robust safety package while adding convenience features like follow-me-home headlamps.';
    } else if (isS) {
        features.description = 'The S variant is where the Creta really shines, offering the popular panoramic sunroof, 6 airbags, smart key entry, and 17-inch alloy wheels. This is the sweet spot for features and value.';
    } else if (isSX) {
        features.description = 'The SX variant elevates the experience with a large 10.25-inch HD touchscreen, Bose premium audio system, LED projector headlamps with horizon DRLs, and Hyundai BlueLink connected car technology.';
    } else if (isSXO) {
        features.description = 'The SX(O) is the tech flagship with Level 2 ADAS featuring 16 safety systems, ventilated front seats, voice-enabled sunroof, 64-color ambient lighting, and an electric 8-way adjustable driver seat with memory function.';
    } else if (isKing) {
        features.description = 'The King Edition represents the pinnacle of Creta luxury. It adds rear wireless charging, electric 8-way passenger seat, rear seat back tables, and exclusive King badging. The Knight Edition adds a striking all-black theme.';
    } else {
        features.description = `The Hyundai Creta ${variantName} offers a compelling blend of features, comfort, and safety for discerning buyers.`;
    }

    // Exterior Design
    if (isE || isEX) {
        features.exteriorDesign = 'LED quad beam headlamps with LED DRLs, body-colored bumpers, halogen fog lamps, LED tail lamps, 16-inch steel wheels with wheel covers, shark fin antenna.';
    } else if (isS) {
        features.exteriorDesign = 'LED quad beam headlamps, LED DRLs, silver skid plates, LED tail lamps, 17-inch dual-tone alloy wheels, shark fin antenna, optional dual-tone roof.';
    } else if (isSX) {
        features.exteriorDesign = 'LED projector headlamps, Horizon LED DRLs, chrome door handles, LED tail lamps with sequential indicators, 17-inch diamond cut alloys, silver roof rails option.';
    } else if (isSXO || isKing) {
        features.exteriorDesign = 'LED projector headlamps, Horizon LED DRLs with connected light bar, dark chrome parametric grille, 18-inch diamond cut/matte black alloys, integrated roof rails, red brake calipers, sequential LED tail lamps.';
    }
    if (isKnight) {
        features.exteriorDesign += ' Knight Edition exclusive: Black painted C-pillar, roof rails, ORVMs, rear spoiler, and front/rear skid plates.';
    }

    // Comfort & Convenience summary
    if (isE) {
        features.comfortConvenience = 'Manual air conditioning, power steering with tilt adjustment, front power windows, manual day/night IRVM, central locking.';
    } else if (isEX || isS) {
        features.comfortConvenience = 'Manual/Automatic AC, all power windows with driver auto up/down, cooled glovebox, rear AC vents, sliding front armrest with storage, follow-me-home headlamps.';
    } else if (isSX || isSXTech || isSXPremium) {
        features.comfortConvenience = 'Dual zone automatic climate control, all power windows with auto up/down, cruise control, push button start, smart key, cooled glovebox, front & rear armrests with cupholders.';
    } else if (isSXO || isKing) {
        features.comfortConvenience = 'Dual zone auto climate, ventilated front seats, voice-enabled panoramic sunroof, electric 8-way driver seat with memory, wireless charger, ambient lighting, puddle lamps, rain sensing wipers, auto-dimming IRVM.';
    }

    // ============ SAFETY (from brochure page 1) ============

    // Airbags
    if (isE || isEX) {
        features.airbags = '2';
        features.airbagsLocation = 'Driver & Front Passenger';
    } else {
        features.airbags = '6';
        features.airbagsLocation = 'Driver, Front Passenger, Side (Driver & Passenger), Curtain (Driver & Passenger)';
    }

    // Seat belt pretensioners
    if (!isE) {
        features.seatBeltPretensioners = 'Driver & Passenger';
    }

    // Height adjustable front seat belts
    if (!isE) {
        features.heightAdjustableSeatbelts = 'Yes';
    }

    // 3 Point seat belts (all seats) - all variants
    features.threePointSeatbelts = 'All seats';

    // Emergency Stop Signal (ESS)
    if (!isE) {
        features.emergencyStopSignal = 'Yes';
    }

    // Impact sensing auto door unlock
    if (!isE && !isEX) {
        features.impactSensingDoorUnlock = 'Yes';
    }

    // Inside door override (Driver only)
    if (!isE && !isEX) {
        features.insideDoorOverride = 'Driver only';
    }

    // Driver power window with auto up down & safety
    if (!isE && !isEX && !isS) {
        features.driverWindowAutoUpDown = 'Yes (with anti-pinch)';
    }

    // Burglar alarm
    if (!isE) {
        features.burglarAlarm = 'Yes';
    }

    // Central locking
    features.centralLocking = 'Yes';

    // Inside rear view mirror
    if (isE || isEX || isS) {
        features.insideRearViewMirror = 'Day and night manual';
    } else if (isSX || isSXTech || isSXPremium) {
        features.insideRearViewMirror = 'Day and night with telematics switches';
    } else {
        features.insideRearViewMirror = 'Electro chromic (ECM) with telematics switches';
    }

    // Automatic headlamps
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.automaticHeadlamp = 'Yes';
    }

    // Headlamp escort function (Follow me home)
    if (!isE) {
        features.followMeHomeHeadlights = 'Yes';
    }

    // Puddle lamps with welcome function
    if (isSXO || isKing) {
        features.puddleLamps = 'Yes (with welcome function)';
    }

    // Parking sensors
    if (isE) {
        features.parkingSensor = 'No';
        features.parkingSensors = 'No';
    } else if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.parkingSensor = 'Front & Rear';
        features.parkingSensors = 'Front & Rear';
    } else {
        features.parkingSensor = 'Rear';
        features.parkingSensors = 'Rear';
    }

    // Reverse Camera
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.reverseCamera = 'Yes';
        features.reverseCameraGuidelines = 'Dynamic guidelines';
        features.parkingCamera = 'Rear with dynamic guidelines';
    }

    // Driver Rear View Monitor (DRVM)
    if (isSXO || isKing) {
        features.driverRearViewMonitor = 'Yes';
    }

    // TPMS
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.tyrePressureMonitor = 'Yes (Highline)';
    }

    // ADAS (Hyundai SmartSense) - from brochure page 1
    if (isSXO || isKing) {
        features.adasLevel = 'Level 2';
        features.adasFeatures = 'Forward Collision Warning (FCW), Forward Collision Avoidance Assist (FCA-Car, Pedestrian, Cycle, Junction Turning, Direct Oncoming), Blind-spot Collision Warning (BCW), Blind-spot Collision Avoidance Assist (BCA), Lane Keeping Assist (LKA), Lane Departure Warning (LDW), Driver Attention Warning (DAW), Safe Exit Warning (SEW), Smart Cruise Control with Stop & Go (SCC), Lane Following Assist (LFA), High Beam Assist (HBA), Leading Vehicle Departure Alert (LVDA), Rear Cross Traffic Collision Warning (RCCW), Rear Cross Traffic Collision Avoidance Assist (RCCA), Surround View Monitor (SVM), Blind-spot View Monitor (BVM)';
        features.blindSpotMonitor = 'Yes (BVM)';
    }

    // Dash cam
    if (isSXO || isKing) {
        features.dashCam = 'Yes';
    }

    // ============ WHEELS & TYRES (from brochure page 2) ============
    if (isE || isEX) {
        features.wheelSize = '16 inch';
        features.tyreSize = '205/65 R16';
        features.frontTyreProfile = '205/65 R16';
        features.rearTyreProfile = '205/65 R16';
        features.alloyWheels = 'No (Steel wheel with wheel cover)';
        features.spareTyreProfile = '205/65 R16';
        features.spareWheelType = 'Steel';
    } else if (isSXO || isKing) {
        features.wheelSize = '18 inch';
        features.tyreSize = '215/55 R18';
        features.frontTyreProfile = '215/55 R18';
        features.rearTyreProfile = '215/55 R18';
        features.alloyWheels = '18 inch (D=462mm) Diamond Cut / Matte Black Alloys';
        features.spareTyreProfile = '215/60 R17';
        features.spareWheelType = 'Steel';
    } else {
        features.wheelSize = '17 inch';
        features.tyreSize = '215/60 R17';
        features.frontTyreProfile = '215/60 R17';
        features.rearTyreProfile = '215/60 R17';
        features.alloyWheels = '17 inch (D=436.6mm) Black / Diamond Cut Alloys';
        features.spareTyreProfile = '205/65 R16';
        features.spareWheelType = 'Steel';
    }

    // Front & Rear skid plate
    features.frontSkidPlate = isKnight ? 'Black painted' : 'Silver';
    features.rearSkidPlate = isKnight ? 'Black painted' : 'Silver';

    // ============ EXTERIOR (from brochure page 2) ============

    // Lightening arch C-pillar
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.lighteningArchCPillar = isKnight ? 'Black painted' : 'Silver';
    }

    // Headlamps
    if (isS && !isSX && !isSXO && !isKing) {
        features.headLights = 'Quad Beam LED';
        features.headlights = 'LED';
    } else if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.headLights = 'LED Projector';
        features.headlights = 'LED Projector';
    } else {
        features.headLights = 'Quad Beam LED';
        features.headlights = 'LED';
    }

    // LED positioning lamp
    features.ledPositioningLamp = 'Yes';

    // Horizon LED positioning lamp & DRLs
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.daytimeRunningLights = 'Horizon LED DRL';
        features.drl = 'Yes (Horizon LED)';
    } else {
        features.daytimeRunningLights = 'LED';
        features.drl = 'Yes';
    }

    // LED high mounted stop lamp
    features.highMountedStopLamp = 'LED';

    // LED tail lamps / Rear horizon LED lamp
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.tailLights = 'Rear Horizon LED with sequential function';
        features.tailLight = 'LED with sequential turn signal';
    } else {
        features.tailLights = 'LED';
        features.tailLight = 'LED';
    }

    // LED turn indicators on outside mirrors
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.sideIndicator = 'LED on ORVM';
    }

    // Integrated roof rails
    if (isSXO || isKing) {
        features.roofRails = isKnight ? 'Black painted' : 'Silver';
    }

    // Parametric radiator grille
    if (isSXO || isKing) {
        features.parametricGrille = 'Dark Chrome';
    }

    // Outside door handles
    if (!isE && !isEX && !isS) {
        features.outsideDoorHandles = 'Chrome';
    }

    // Outside door mirrors (ORVM)
    if (isE) {
        features.orvm = 'Body Colour, Manual';
        features.outsideRearViewMirrors = 'Manual';
        features.outsideRearViewMirror = 'Body Colour';
    } else if (isEX || isS) {
        features.orvm = 'Body Colour, Electrically Adjustable';
        features.outsideRearViewMirrors = 'Electric Adjust';
        features.outsideRearViewMirror = 'Body Colour';
    } else if (isSX || isSXTech || isSXPremium) {
        features.orvm = 'Body Colour, Electric Folding';
        features.outsideRearViewMirrors = 'Electric Folding';
        features.outsideRearViewMirror = 'Body Colour';
    } else {
        features.orvm = 'Body Colour, Electric Folding with Auto Fold';
        features.outsideRearViewMirrors = 'Electric Folding with Auto Fold';
        features.outsideRearViewMirror = 'Body Colour';
    }

    // Side sill garnish
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.sideSillGarnish = isKnight ? 'Black painted' : 'Silver';
    }

    // Micro roof (for sunroof variants)
    if (isS && !isE && !isEX && !isSX && !isSXO && !isKing) {
        features.sunroof = 'Smart Panoramic';
    } else if (isSXO || isKing) {
        features.sunroof = 'Voice Enabled Smart Panoramic';
    }

    // Emblem
    if (isKing) {
        features.emblem = isKnight ? 'King Knight' : 'King';
    }

    // Red brake calipers
    if (isSXO || isKing) {
        features.brakeCalipers = 'Red (Front & Rear)';
    }

    // Rear spoiler
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.rearSpoiler = isKnight ? 'Black painted' : 'Body colour';
    }

    // Dual tone pack (for DT variants)
    if (isDT) {
        features.dualTonePack = 'Yes (Black painted - C-pillar, Roof Rails, ORVM, Rear Spoiler)';
    }

    // ============ INTERIOR (from brochure page 3) ============

    // Interior color
    if (isE || isEX || isS) {
        features.interiorColor = 'Gray two tone';
    } else if (isKing && isKnight) {
        features.interiorColor = 'All black with brass coloured inserts';
    } else {
        features.interiorColor = 'Gray two tone';
    }

    // Seat upholstery
    if (isE || isEX) {
        features.seatUpholstery = 'Fabric';
    } else if (isSX || isSXTech) {
        features.seatUpholstery = 'Semi-Leather';
    } else if (isSXPremium) {
        features.seatUpholstery = 'Leather';
    } else if (isKing && isKnight) {
        features.seatUpholstery = 'Exclusive Black Leather with Brass Coloured Highlights';
    } else if (isSXO || isKing) {
        features.seatUpholstery = 'Exclusive Black Fabric / Leatherette';
    } else {
        features.seatUpholstery = 'Fabric';
    }

    // Leather pack
    if (isSXTech || isSXPremium || isSXO || isKing) {
        features.leatherPack = 'Steering wheel, Door armrest, Gear knob';
    }

    // Height adjustable headrest
    features.heightAdjustableHeadrest = 'Front & Rear';

    // Driver seat adjust
    if (isSXO || isKing) {
        features.driverSeatAdjustment = 'Electric 8-way';
        features.seatsAdjustment = 'Driver: Electric 8-way';
    } else {
        features.driverSeatAdjustment = 'Manual height adjust';
        features.seatsAdjustment = 'Driver: Manual height adjust';
    }

    // Sporty metal pedals
    if (isSXO || isKing) {
        features.sportyMetalPedals = 'Yes';
    }

    // 60:40 split rear seat
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.splitRearSeat = '60:40';
    }

    // 2-step rear reclining seat
    if (isSXO || isKing) {
        features.rearSeatAdjustment = '2-step reclining';
        features.rearSeatRecline = 'Yes';
    }

    // Rear window sunshade
    if (isSXO || isKing) {
        features.rearWindowSunshade = 'Yes';
    }

    // Soothing amber ambient light
    if (isSXO || isKing) {
        features.ambientLighting = 'Soothing Amber 64 Colours';
    }

    // Rear seat headrest cushion
    if (isKing) {
        features.rearHeadrestCushion = 'Yes';
    }

    // Inside door handles (Metal finish)
    if (isSXO || isKing) {
        features.insideDoorHandles = 'Metal Finish';
    }

    // Door scuff plates
    if (isSX || isSXTech || isSXPremium) {
        features.doorScuffPlates = 'Yes';
    } else if (isSXO || isKing) {
        features.doorScuffPlates = 'Metal';
    }

    // Rear parcel tray
    if (isSXO || isKing) {
        features.rearParcelTray = 'Yes';
    }

    // D-Cut steering wheel
    if (isSXO || isKing) {
        features.steeringWheelType = 'D-Cut';
    }

    // Driver power seat memory function
    if (isSXO || isKing) {
        features.memorySeats = 'Driver';
    }

    // Passenger seat electric 8-way adjust
    if (isKing) {
        features.passengerSeatAdjustment = 'Electric 8-way';
    }

    // Passenger seat walkin device
    if (isKing) {
        features.passengerWalkIn = 'Yes';
    }

    // Front row seat back table with IT device holder
    if (isKing) {
        features.seatBackTable = 'Yes (with IT device holder & retractable cup holder)';
    }

    // ============ COMFORT & CONVENIENCE (from brochure page 3) ============

    // Sunroof already handled above

    // Air conditioning
    if (isE || isEX) {
        features.airConditioning = 'Manual';
        features.climateControl = 'No';
    } else {
        features.airConditioning = 'Dual Zone Automatic (DATC)';
        features.climateControl = 'Dual Zone Automatic';
        features.climateZones = 'Dual Zone';
    }

    // Front row ventilated seats
    if (isSXO || isKing) {
        features.ventilatedSeats = 'Front Row';
    }

    // Electric parking brake with auto hold
    if (isAT && (isSXO || isKing || isSX || isSXTech || isSXPremium)) {
        features.electricParkingBrake = 'Yes (with Auto Hold)';
    }

    // Smartphone wireless charger
    if (isSXTech || isSXO || isKing) {
        features.wirelessCharging = 'Yes';
    }

    // Drive mode select
    if (isSXO || isKing) {
        features.drivingModes = 'Eco, Normal, Sport';
    }

    // Traction control modes
    if (isSXO || isKing) {
        features.offRoadModes = 'Snow, Mud, Sand';
        features.tractionControl = 'Yes (with modes)';
    }

    // Paddle shifters (for DCT)
    // Already handled in engine specs

    // Cruise control
    if (isSXO || isKing) {
        features.cruiseControl = 'Smart Cruise Control with Stop & Go (SCC)';
    } else if (isSX || isSXTech || isSXPremium) {
        features.cruiseControl = 'Yes';
    }

    // Keyless entry
    if (isE || isEX) {
        features.keylessEntry = 'Foldable Key';
        features.ignition = 'Key Start';
        features.pushButtonStart = 'No';
    } else {
        features.keylessEntry = 'Smart Key with Push Button Start and Motion Sensor';
        features.ignition = 'Push Button Start';
        features.pushButtonStart = 'Yes';
    }

    // Remote engine start with smart key
    if (isSXO || isKing) {
        features.remoteEngineStart = 'Yes';
    }

    // Rear centre armrest with cup holders
    features.rearCentreArmrest = 'Yes (with cup holders)';

    // Electric tailgate release
    if (isSXO || isKing) {
        features.electricTailgate = 'Yes';
    }

    // Power outlet
    features.powerOutlet = 'Yes';

    // Motor driven power steering - tilt & telescopic
    features.steeringAdjustment = 'Tilt & Telescopic';

    // Luggage lamp
    if (!isE) {
        features.luggageLamp = 'Yes';
    }

    // Idle stop & go (ISG)
    if (isSXO || isKing) {
        features.idleStopGo = 'Yes';
    }

    // Passenger vanity mirror
    if (!isE) {
        features.vanityMirror = 'Passenger';
    }

    // Map lamps
    if (!isE) {
        features.mapLamps = 'Yes';
    }

    // Room lamp
    features.roomLamp = 'Yes';

    // LED reading lamps (Rear)
    if (isSXO || isKing) {
        features.rearReadingLamps = 'LED';
    }

    // Sunglass holder
    if (isSXO || isKing) {
        features.sunglassHolder = 'Yes';
    }

    // Glovebox cooling
    if (!isE) {
        features.cooledGlovebox = 'Yes';
    }

    // Rear wireless charger
    if (isKing) {
        features.rearWirelessCharger = 'Yes';
    }

    // Rain sensing wiper
    if (isSXO || isKing) {
        features.rainSensingWipers = 'Yes';
    }

    // ============ INFOTAINMENT & CONNECTIVITY (from brochure page 4) ============

    // Infotainment system
    if (isE) {
        features.touchScreenInfotainment = 'No';
        features.infotainmentScreen = 'No';
    } else if (isEX || isS) {
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.32 cm (8.0") Touchscreen Infotainment System';
    } else {
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm (10.25") HD Audio Video Navigation System';
    }

    // Bose premium sound system
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.speakers = '8 (Bose Premium Sound)';
        features.tweeters = '4 (Front)';
        features.subwoofers = '1 (Front Central)';
    } else if (!isE) {
        features.speakers = '6';
        features.tweeters = 'Yes';
    }

    // Smartphone connectivity
    if (isE) {
        features.androidAppleCarplay = 'No';
        features.androidAuto = 'No';
        features.appleCarPlay = 'No';
    } else {
        features.androidAppleCarplay = 'Wireless';
        features.androidAuto = 'Wireless';
        features.appleCarPlay = 'Wireless';
    }

    // Bluetooth connectivity
    features.bluetooth = 'Yes';

    // JioSaavan music streaming
    if (!isE) {
        features.musicStreaming = 'JioSaavn';
    }

    // Digital cluster
    if (isE || isEX || isS || (isSX && !isSXTech && !isSXPremium)) {
        features.digitalCluster = 'Digital Cluster with Color TFT MID';
    } else {
        features.digitalCluster = '26.03 cm (10.25") Multi Display Digital Cluster';
    }

    // Hyundai BlueLink (Connected car technology)
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.connectedCarTech = 'Hyundai BlueLink';
    }

    // Voice recognition
    if (!isE && !isEX) {
        features.voiceRecognition = 'Yes';
    }

    // Steering wheel with audio & bluetooth controls
    if (!isE) {
        features.steeringMountedControls = 'Audio & Bluetooth Controls';
    }

    // Over-the-air (OTA) updates
    if (isSXO || isKing) {
        features.otaUpdates = 'Yes (Map and Infotainment)';
    }

    // Home to car (H2C) with Alexa
    if (isSXO || isKing) {
        features.homeToCar = 'Yes (with Alexa)';
    }

    return features;
}

// Parse variant name to get engine type
function getEngineKey(variantName: string): string {
    if (variantName.includes('DCT')) return '1.5 Turbo GDi DCT';
    if (variantName.includes('Diesel AT')) return '1.5 Diesel AT';
    if (variantName.includes('Diesel MT')) return '1.5 Diesel MT';
    if (variantName.includes('IVT')) return '1.5 MPi Petrol IVT';
    return '1.5 MPi Petrol MT';
}

// All 70 Creta variants with prices
const CRETA_VARIANTS = [
    // Petrol Manual
    { name: 'E Petrol MT', price: 1072589 },
    { name: 'EX Petrol MT', price: 1189706 },
    { name: 'EX(O) Petrol MT', price: 1252455 },
    { name: 'S Petrol MT', price: 1307016 },
    { name: 'S(O) Petrol MT', price: 1398933 },
    { name: 'S(O) Knight Edition Petrol MT', price: 1417181 },
    { name: 'S(O) DT Knight Edition Petrol MT', price: 1425871 },
    { name: 'SX Petrol MT', price: 1494036 },
    { name: 'SX DT Petrol MT', price: 1508519 },
    { name: 'SX Tech Petrol MT', price: 1569346 },
    { name: 'SX Premium Petrol MT', price: 1578026 },
    { name: 'SX Tech DT Petrol MT', price: 1583829 },
    { name: 'SX Premium DT Petrol MT', price: 1592509 },
    { name: 'SX(O) Petrol MT', price: 1686077 },
    { name: 'SX(O) Knight Edition Petrol MT', price: 1700463 },
    { name: 'SX(O) DT Petrol MT', price: 1700560 },
    { name: 'SX(O) DT Knight Edition Petrol MT', price: 1714946 },
    { name: 'King Petrol MT', price: 1726822 },
    { name: 'King DT Petrol MT', price: 1741304 },
    // Petrol IVT
    { name: 'EX(O) Petrol IVT', price: 1387627 },
    { name: 'S(O) Petrol IVT', price: 1543760 },
    { name: 'S(O) Knight Edition Petrol IVT', price: 1556215 },
    { name: 'S(O) DT Knight Edition Petrol IVT', price: 1570698 },
    { name: 'SX Tech Petrol IVT', price: 1714173 },
    { name: 'SX Premium Petrol IVT', price: 1722853 },
    { name: 'SX Tech DT Petrol IVT', price: 1728656 },
    { name: 'SX Premium DT Petrol IVT', price: 1737336 },
    { name: 'SX(O) Petrol IVT', price: 1827042 },
    { name: 'SX(O) Knight Edition Petrol IVT', price: 1841428 },
    { name: 'SX(O) DT Petrol IVT', price: 1841525 },
    { name: 'SX(O) DT Knight Edition Petrol IVT', price: 1855911 },
    { name: 'King Petrol IVT', price: 1867787 },
    { name: 'King Knight Edition Petrol IVT', price: 1882173 },
    { name: 'King DT Petrol IVT', price: 1882269 },
    { name: 'King Limited Edition Petrol IVT', price: 1896559 },
    { name: 'King DT Knight Edition Petrol IVT', price: 1896655 },
    // Petrol DCT (Turbo)
    { name: 'SX(O) Petrol DCT', price: 1949276 },
    { name: 'SX(O) DT Petrol DCT', price: 1963759 },
    { name: 'King Petrol DCT', price: 1990021 },
    { name: 'King DT Petrol DCT', price: 2004503 },
    // Diesel Manual
    { name: 'E Diesel MT', price: 1224947 },
    { name: 'EX Diesel MT', price: 1343513 },
    { name: 'EX(O) Diesel MT', price: 1406261 },
    { name: 'S Diesel MT', price: 1448261 },
    { name: 'S(O) Diesel MT', price: 1551774 },
    { name: 'S(O) Knight Edition Diesel MT', price: 1570022 },
    { name: 'S(O) DT Knight Edition Diesel MT', price: 1578712 },
    { name: 'SX Tech Diesel MT', price: 1722187 },
    { name: 'SX Premium Diesel MT', price: 1730867 },
    { name: 'SX Tech DT Diesel MT', price: 1736670 },
    { name: 'SX Premium DT Diesel MT', price: 1745350 },
    { name: 'SX(O) Diesel MT', price: 1839014 },
    { name: 'SX(O) Knight Edition Diesel MT', price: 1853400 },
    { name: 'SX(O) DT Diesel MT', price: 1853497 },
    { name: 'SX(O) DT Knight Edition Diesel MT', price: 1867883 },
    { name: 'King Diesel MT', price: 1879759 },
    { name: 'King DT Diesel MT', price: 1894242 },
    // Diesel Automatic
    { name: 'EX(O) Diesel AT', price: 1541433 },
    { name: 'S(O) Diesel AT', price: 1696601 },
    { name: 'S(O) Knight Edition Diesel AT', price: 1709056 },
    { name: 'S(O) DT Knight Edition Diesel AT', price: 1723539 },
    { name: 'SX(O) Diesel AT', price: 1930931 },
    { name: 'SX(O) DT Diesel AT', price: 1945414 },
    { name: 'SX(O) Knight Edition Diesel AT', price: 1964628 },
    { name: 'King Diesel AT', price: 1971676 },
    { name: 'SX(O) DT Knight Edition Diesel AT', price: 1979110 },
    { name: 'King DT Diesel AT', price: 1986159 },
    { name: 'King Knight Edition Diesel AT', price: 2005372 },
    { name: 'King Limited Edition Diesel AT', price: 2019758 },
    { name: 'King DT Knight Edition Diesel AT', price: 2019855 },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Find Creta model
    const cretaModel = await Model.findOne({ name: 'Creta' }).lean();
    if (!cretaModel) {
        console.error('❌ Creta model not found!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== HYUNDAI CRETA VARIANTS UPDATE (FULL SPECS) ===\n');
    console.log(`Model ID: ${cretaModel.id}`);
    console.log(`Brand ID: ${cretaModel.brandId}\n`);

    // Delete existing Creta variants
    if (!isDryRun) {
        const deleteResult = await Variant.deleteMany({ modelId: cretaModel.id });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing Creta variants\n`);
    } else {
        const existingCount = await Variant.countDocuments({ modelId: cretaModel.id });
        console.log(`Would delete ${existingCount} existing variants\n`);
    }

    console.log('Variants to add:');
    console.log('-'.repeat(70));

    for (const v of CRETA_VARIANTS) {
        const engineKey = getEngineKey(v.name);
        console.log(`${v.name.padEnd(45)} | ₹${(v.price / 100000).toFixed(2)}L | ${engineKey.split(' ').slice(-2).join(' ')}`);
    }

    console.log('-'.repeat(70));
    console.log(`Total: ${CRETA_VARIANTS.length} variants\n`);

    if (isDryRun) {
        // Show sample variant with all specs
        const sampleVariant = CRETA_VARIANTS[CRETA_VARIANTS.length - 1]; // King DT Knight Edition
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

        for (const variant of CRETA_VARIANTS) {
            const variantId = `variant-${cretaModel.brandId}-${cretaModel.id}-${variant.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`;
            const engineKey = getEngineKey(variant.name);
            const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
            const mileageData = MILEAGE_DATA[engineKey as keyof typeof MILEAGE_DATA];
            const features = getVariantFeatures(variant.name);

            const variantDoc = {
                id: variantId,
                name: variant.name,
                brandId: cretaModel.brandId,
                modelId: cretaModel.id,
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

        // Verify count
        const newCount = await Variant.countDocuments({ modelId: cretaModel.id });
        console.log(`\n🎉 Creta now has ${newCount} variants with full specs`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
