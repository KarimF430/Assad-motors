/**
 * Preview Creta Variant Data - Shows all fields for each variant
 */

// Engine Specs from Brochure
const ENGINES = {
    '1.5 MPi Petrol MT': {
        engineName: '1.5l MPi Petrol',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1497',
        power: '115 PS @ 6300 rpm',
        maxPower: '84.4 kW (115 PS) @ 6300 r/min',
        torque: '143.8 Nm @ 4500 rpm',
        engineTorque: '143.8 Nm (14.7 kgm) @ 4500 r/min',
        engineTransmission: 'Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'Manual',
    },
    '1.5 MPi Petrol IVT': {
        engineName: '1.5l MPi Petrol',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1497',
        power: '115 PS @ 6300 rpm',
        maxPower: '84.4 kW (115 PS) @ 6300 r/min',
        torque: '143.8 Nm @ 4500 rpm',
        engineTorque: '143.8 Nm (14.7 kgm) @ 4500 r/min',
        engineTransmission: 'IVT',
        engineSpeed: 'IVT',
        noOfGears: 'CVT',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'IVT',
    },
    '1.5 Diesel MT': {
        engineName: '1.5l U2 CRDi Diesel',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1493',
        power: '116 PS @ 4000 rpm',
        maxPower: '85 kW (116 PS) @ 4000 r/min',
        torque: '250 Nm @ 1500-2750 rpm',
        engineTorque: '250 Nm (25.5 kgm) @ 1500-2750 r/min',
        engineTransmission: 'Manual',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Manual',
    },
    '1.5 Diesel AT': {
        engineName: '1.5l U2 CRDi Diesel',
        engineType: '4 cylinders, 16 valves DOHC',
        displacement: '1493',
        power: '116 PS @ 4000 rpm',
        maxPower: '85 kW (116 PS) @ 4000 r/min',
        torque: '250 Nm @ 1500-2750 rpm',
        engineTorque: '250 Nm (25.5 kgm) @ 1500-2750 r/min',
        engineTransmission: 'Automatic',
        engineSpeed: '6-Speed',
        noOfGears: '6',
        fuelType: 'Diesel',
        fuel: 'Diesel',
        transmission: 'Automatic',
    },
    '1.5 Turbo GDi DCT': {
        engineName: '1.5l Turbo GDi Petrol',
        engineType: '4 cylinders, 16 valves DOHC Turbo',
        displacement: '1482',
        power: '160 PS @ 5500 rpm',
        maxPower: '117.5 kW (160 PS) @ 5500 r/min',
        torque: '253 Nm @ 1500-3500 rpm',
        engineTorque: '253 Nm (25.8 kgm) @ 1500-3500 r/min',
        engineTransmission: 'DCT',
        engineSpeed: '7-Speed',
        noOfGears: '7',
        fuelType: 'Petrol',
        fuel: 'Petrol',
        transmission: 'DCT',
        turboCharged: 'Yes',
        paddleShifter: 'Yes',
    },
};

const COMMON_SPECS = {
    length: '4330',
    width: '1790',
    height: '1635',
    wheelbase: '2610',
    fuelTankCapacity: '50 Litres',
    seatingCapacity: '5',
    doors: '5',
    frontSuspension: 'McPherson strut with coil spring',
    rearSuspension: 'Coupled torsion beam axle',
    frontBrake: 'Disc',
    rearBrake: 'Disc',
    discBrakes: 'Front & Rear',
    emissionStandard: 'BS6 Phase 2',
};

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

    let features: Record<string, any> = {
        abs: 'Yes',
        ebd: 'Yes',
        electronicStabilityProgram: 'Yes',
        hillHoldAssist: 'Yes',
        seatbeltWarning: 'Yes',
        speedAlertSystem: 'Yes',
        immobiliser: 'Yes',
        powerSteering: 'Motor driven with Tilt & Telescopic',
        powerWindows: 'Front & Rear',
        rearACVents: 'Yes',
        isofixMounts: 'Yes',
        isofix: 'Yes',
        rearWindshieldDefogger: 'Yes',
        daytimeRunningLights: 'LED',
        drl: 'Yes',
        tailLights: 'LED',
        tailLight: 'LED',
        usbCChargingPorts: '3',
        twelvevChargingPorts: '1',
    };

    // Airbags
    if (isE || isEX) {
        features.airbags = '2';
        features.airbagsLocation = 'Driver & Passenger';
    } else {
        features.airbags = '6';
        features.airbagsLocation = 'Driver, Passenger, Side & Curtain';
    }

    // Wheels
    if (isE || isEX) {
        features.wheelSize = '16 inch';
        features.tyreSize = '205/65 R16';
        features.alloyWheels = 'No (Steel with wheel cover)';
    } else if (isSXO || isKing) {
        features.wheelSize = '18 inch';
        features.tyreSize = '215/55 R18';
        features.alloyWheels = '18 inch Diamond Cut / Matte Black';
    } else {
        features.wheelSize = '17 inch';
        features.tyreSize = '215/60 R17';
        features.alloyWheels = '17 inch Black / Diamond Cut';
    }

    // Infotainment
    if (isE) {
        features.touchScreenInfotainment = 'No';
    } else if (isEX || isS) {
        features.touchScreenInfotainment = '8 inch';
        features.infotainmentScreen = '20.32 cm (8.0") Touchscreen';
        features.androidAppleCarplay = 'Wireless';
    } else {
        features.touchScreenInfotainment = '10.25 inch';
        features.infotainmentScreen = '26.03 cm (10.25") HD Navigation';
        features.androidAppleCarplay = 'Wireless';
    }

    // Speakers
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.speakers = '8 (Bose)';
        features.tweeters = '4';
        features.subwoofers = '1';
    } else if (!isE) {
        features.speakers = '6';
    }

    // Sunroof
    if (isS && !isE && !isEX) {
        features.sunroof = 'Smart Panoramic';
    } else if (isSXO || isKing) {
        features.sunroof = 'Voice Enabled Smart Panoramic';
    }

    // Climate
    if (isE || isEX) {
        features.airConditioning = 'Manual';
    } else {
        features.airConditioning = 'Automatic';
        features.climateControl = 'Dual Zone (DATC)';
        features.climateZones = 'Dual Zone';
    }

    // Ventilated Seats
    if (isSXO || isKing) {
        features.ventilatedSeats = 'Front Row';
    }

    // Keyless & Ignition
    if (isS || isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.keylessEntry = 'Smart Key';
        features.pushButtonStart = 'Yes';
        features.ignition = 'Push Button Start';
    } else {
        features.keylessEntry = 'Foldable Key';
        features.ignition = 'Key Start';
    }

    // Parking
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.parkingSensor = 'Front & Rear';
        features.reverseCamera = 'Yes';
        features.reverseCameraGuidelines = 'Dynamic';
    } else if (!isE) {
        features.parkingSensor = 'Rear';
    }

    // ADAS
    if (isSXO || isKing) {
        features.adasLevel = 'Level 2';
        features.adasFeatures = 'FCW, FCA, LKA, LDW, SCC, HBA, BVM, SVM';
        features.blindSpotMonitor = 'Yes';
        features.cruiseControl = 'Smart Cruise with Stop & Go';
    } else if (isSX || isSXTech || isSXPremium) {
        features.cruiseControl = 'Yes';
    }

    // Connected Car
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.connectedCarTech = 'Hyundai BlueLink';
    }

    // Headlights
    if (isE || isEX) {
        features.headLights = 'Quad Beam LED';
    } else {
        features.headLights = 'LED Projector';
    }

    // Seat Upholstery
    if (isE || isEX) {
        features.seatUpholstery = 'Fabric';
    } else if (isKing && isKnight) {
        features.seatUpholstery = 'Black Leather with Brass';
    } else if (isSXO || isKing) {
        features.seatUpholstery = 'Leatherette';
    } else {
        features.seatUpholstery = 'Semi-Leather';
    }

    // Driver Seat
    if (isSXO || isKing) {
        features.driverSeatAdjustment = 'Electric 8-way';
        features.memorySeats = 'Driver';
    } else {
        features.driverSeatAdjustment = 'Manual Height Adjust';
    }

    // TPMS
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.tyrePressureMonitor = 'Yes';
    }

    // ORVM
    if (isSXO || isKing) {
        features.outsideRearViewMirrors = 'Electric Fold with Auto Fold';
    } else if (isSX || isSXTech || isSXPremium) {
        features.outsideRearViewMirrors = 'Electric Fold';
    } else {
        features.outsideRearViewMirrors = 'Electric Adjust';
    }

    // Other features
    if (!isE) {
        features.followMeHomeHeadlights = 'Yes';
        features.steeringMountedControls = 'Audio & Bluetooth';
    }
    if (isSX || isSXTech || isSXPremium || isSXO || isKing) {
        features.automaticHeadlamp = 'Yes';
    }
    if (isSXO || isKing) {
        features.rainSensingWipers = 'Yes';
    }
    if (isSXTech || isSXO || isKing) {
        features.wirelessCharging = 'Yes';
    }

    return features;
}

function getEngineKey(variantName: string): string {
    if (variantName.includes('DCT')) return '1.5 Turbo GDi DCT';
    if (variantName.includes('Diesel AT')) return '1.5 Diesel AT';
    if (variantName.includes('Diesel MT')) return '1.5 Diesel MT';
    if (variantName.includes('IVT')) return '1.5 MPi Petrol IVT';
    return '1.5 MPi Petrol MT';
}

// Sample variants (showing 5 representatives)
const SAMPLE_VARIANTS = [
    { name: 'E Petrol MT', price: 1072589 },          // Base
    { name: 'EX(O) Diesel AT', price: 1541433 },     // Mid Diesel AT
    { name: 'SX Tech Petrol IVT', price: 1714173 }, // SX Tech
    { name: 'SX(O) Petrol DCT', price: 1949276 },   // SX(O) Turbo
    { name: 'King DT Knight Edition Diesel AT', price: 2019855 }, // Top
];

console.log('=== HYUNDAI CRETA VARIANT DATA PREVIEW ===\n');

for (const variant of SAMPLE_VARIANTS) {
    const engineKey = getEngineKey(variant.name);
    const engineSpecs = ENGINES[engineKey as keyof typeof ENGINES];
    const features = getVariantFeatures(variant.name);

    if (engineKey === '1.5 Turbo GDi DCT') {
        features.drivingModes = 'Eco, Normal, Sport';
        features.offRoadModes = 'Snow, Mud, Sand';
    }

    const fullData = {
        name: variant.name,
        price: `₹${(variant.price / 100000).toFixed(2)} Lakh`,
        ...COMMON_SPECS,
        ...engineSpecs,
        ...features,
    };

    console.log('═'.repeat(60));
    console.log(`📌 ${variant.name}`);
    console.log('═'.repeat(60));

    // Group by category
    console.log('\n🔧 ENGINE & TRANSMISSION:');
    console.log(`   Engine: ${fullData.engineName}`);
    console.log(`   Type: ${fullData.engineType}`);
    console.log(`   Displacement: ${fullData.displacement} cc`);
    console.log(`   Power: ${fullData.power}`);
    console.log(`   Torque: ${fullData.torque}`);
    console.log(`   Transmission: ${fullData.transmission} (${fullData.engineSpeed})`);
    if (fullData.turboCharged) console.log(`   Turbo: ${fullData.turboCharged}`);
    if (fullData.paddleShifter) console.log(`   Paddle Shifter: ${fullData.paddleShifter}`);

    console.log('\n💰 PRICE:');
    console.log(`   Ex-Showroom: ${fullData.price}`);

    console.log('\n📏 DIMENSIONS:');
    console.log(`   Length: ${fullData.length} mm`);
    console.log(`   Width: ${fullData.width} mm`);
    console.log(`   Height: ${fullData.height} mm`);
    console.log(`   Wheelbase: ${fullData.wheelbase} mm`);
    console.log(`   Fuel Tank: ${fullData.fuelTankCapacity}`);
    console.log(`   Seating: ${fullData.seatingCapacity} persons`);

    console.log('\n🛞 WHEELS & TYRES:');
    console.log(`   Wheel Size: ${fullData.wheelSize}`);
    console.log(`   Tyre Size: ${fullData.tyreSize}`);
    console.log(`   Alloy Wheels: ${fullData.alloyWheels}`);

    console.log('\n🛡️ SAFETY:');
    console.log(`   Airbags: ${fullData.airbags} (${fullData.airbagsLocation})`);
    console.log(`   ABS: ${fullData.abs} | EBD: ${fullData.ebd} | ESC: ${fullData.electronicStabilityProgram}`);
    console.log(`   Hill Hold: ${fullData.hillHoldAssist}`);
    console.log(`   ISOFIX: ${fullData.isofix}`);
    if (fullData.adasLevel) console.log(`   ADAS: ${fullData.adasLevel} - ${fullData.adasFeatures}`);
    if (fullData.tyrePressureMonitor) console.log(`   TPMS: ${fullData.tyrePressureMonitor}`);
    if (fullData.blindSpotMonitor) console.log(`   Blind Spot Monitor: ${fullData.blindSpotMonitor}`);

    console.log('\n🌡️ COMFORT:');
    console.log(`   A/C: ${fullData.airConditioning}`);
    if (fullData.climateControl) console.log(`   Climate Control: ${fullData.climateControl}`);
    if (fullData.ventilatedSeats) console.log(`   Ventilated Seats: ${fullData.ventilatedSeats}`);
    if (fullData.sunroof) console.log(`   Sunroof: ${fullData.sunroof}`);
    console.log(`   Seat Upholstery: ${fullData.seatUpholstery}`);
    console.log(`   Driver Seat: ${fullData.driverSeatAdjustment}`);
    if (fullData.memorySeats) console.log(`   Memory Seats: ${fullData.memorySeats}`);
    console.log(`   Keyless Entry: ${fullData.keylessEntry}`);
    console.log(`   Ignition: ${fullData.ignition}`);
    if (fullData.cruiseControl) console.log(`   Cruise Control: ${fullData.cruiseControl}`);

    console.log('\n📱 INFOTAINMENT:');
    console.log(`   Touchscreen: ${fullData.touchScreenInfotainment}`);
    if (fullData.infotainmentScreen) console.log(`   Display: ${fullData.infotainmentScreen}`);
    if (fullData.androidAppleCarplay) console.log(`   Android Auto/CarPlay: ${fullData.androidAppleCarplay}`);
    if (fullData.speakers) console.log(`   Speakers: ${fullData.speakers}`);
    if (fullData.connectedCarTech) console.log(`   Connected Car: ${fullData.connectedCarTech}`);
    if (fullData.wirelessCharging) console.log(`   Wireless Charging: ${fullData.wirelessCharging}`);

    console.log('\n💡 EXTERIOR:');
    console.log(`   Headlights: ${fullData.headLights}`);
    console.log(`   DRL: ${fullData.drl}`);
    console.log(`   Tail Lights: ${fullData.tailLights}`);
    console.log(`   ORVM: ${fullData.outsideRearViewMirrors}`);
    if (fullData.parkingSensor) console.log(`   Parking Sensors: ${fullData.parkingSensor}`);
    if (fullData.reverseCamera) console.log(`   Reverse Camera: ${fullData.reverseCamera}`);

    if (fullData.drivingModes) {
        console.log('\n🏎️ DRIVING MODES:');
        console.log(`   Modes: ${fullData.drivingModes}`);
        console.log(`   Off-Road: ${fullData.offRoadModes}`);
    }

    console.log('\n');
}

console.log('═'.repeat(60));
console.log('Total Variants: 70 (Showing 5 sample above)');
console.log('═'.repeat(60));
