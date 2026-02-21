const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5001';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2NDMwOTE0MCwiZXhwIjoxNzY0Mzk1NTQwfQ.1CtT-6Jk1ZWAV3nwe3aNluPvT3WK-nWDr17PUcxuaSc';

// Helper to generate default comprehensive data
function getDefaultVariantData(baseData) {
    const isEV = baseData.fuelType === 'Electric';
    const isAutomatic = baseData.transmission !== 'Manual';

    return {
        // Page 1
        status: 'active',
        isValueForMoney: false,
        keyFeatures: `• ${baseData.fuelType} Engine\n• ${baseData.transmission} Transmission\n• Touchscreen Infotainment\n• Safety Features`,
        headerSummary: `The ${baseData.name} is a ${baseData.fuelType} variant with ${baseData.transmission} transmission.`,
        description: `Detailed description for ${baseData.name}. It offers a balance of performance and features.`,
        exteriorDesign: 'Modern and stylish exterior design with LED elements.',
        comfortConvenience: 'Equipped with essential comfort features for a pleasant drive.',
        highlightImages: [],

        // Page 2
        engineName: baseData.engine,
        engineSummary: `A powerful ${baseData.engine} engine delivering ${baseData.power}.`,
        engineTransmission: baseData.transmission.toLowerCase(),
        enginePower: baseData.power,
        engineTorque: baseData.torque,
        engineSpeed: isAutomatic ? '6-Speed' : '5-Speed',

        mileageEngineName: `${baseData.engine} ${baseData.transmission}`,
        mileageCompanyClaimed: `${baseData.mileage} ${isEV ? 'Km' : 'Kmpl'}`,
        mileageCityRealWorld: `${Math.floor(baseData.mileage * 0.8)} ${isEV ? 'Km' : 'Kmpl'}`,
        mileageHighwayRealWorld: `${Math.floor(baseData.mileage * 0.9)} ${isEV ? 'Km' : 'Kmpl'}`,

        ventilatedSeats: 'Front Only',
        sunroof: 'Panoramic',
        airPurifier: 'Yes',
        headsUpDisplay: 'Yes',
        cruiseControl: 'Adaptive',
        rainSensingWipers: 'Yes',
        automaticHeadlamp: 'Yes',
        followMeHomeHeadlights: 'Yes',
        keylessEntry: 'Smart Key',
        ignition: 'Push Button Start',
        ambientLighting: 'Multi-color',
        steeringAdjustment: 'Tilt & Telescopic',
        airConditioning: 'Automatic Climate Control',
        climateZones: 'Dual Zone',
        rearACVents: 'Yes',
        frontArmrest: 'With Storage',
        rearArmrest: 'With Cup Holders',
        insideRearViewMirror: 'Auto Dimming',
        outsideRearViewMirrors: 'Electrically Adjustable & Foldable',
        steeringMountedControls: 'Audio, Phone, Cruise',
        rearWindshieldDefogger: 'Yes',
        frontWindshieldDefogger: 'Yes',
        cooledGlovebox: 'Yes',

        // Page 3
        globalNCAPRating: '5 Stars',
        airbags: '6',
        airbagsLocation: 'Front, Side, Curtain',
        adasLevel: 'Level 2',
        adasFeatures: 'Lane Keep Assist, AEB, Blind Spot Monitor',
        reverseCamera: '360 Degree',
        reverseCameraGuidelines: 'Dynamic',
        tyrePressureMonitor: 'Yes',
        hillHoldAssist: 'Yes',
        hillDescentControl: 'Yes',
        rollOverMitigation: 'Yes',
        parkingSensor: 'Front & Rear',
        discBrakes: 'All 4 Discs',
        electronicStabilityProgram: 'Yes',
        abs: 'Yes',
        ebd: 'Yes',
        brakeAssist: 'Yes',
        isofixMounts: 'Yes',
        seatbeltWarning: 'All Seats',
        speedAlertSystem: 'Yes',
        speedSensingDoorLocks: 'Yes',
        immobiliser: 'Yes',

        touchScreenInfotainment: '10.25 inch',
        androidAppleCarplay: 'Wireless',
        speakers: '8',
        tweeters: '4',
        subwoofers: '1',
        usbCChargingPorts: '2 Front, 2 Rear',
        usbAChargingPorts: '1 Front',
        twelvevChargingPorts: '1 Front, 1 Boot',
        wirelessCharging: 'Yes',
        connectedCarTech: 'Yes',

        // Page 4
        engineNamePage4: baseData.engine,
        engineCapacity: isEV ? 'N/A' : '1498 cc',
        fuel: baseData.fuelType,
        transmission: baseData.transmission,
        noOfGears: isEV ? '1' : '6',
        paddleShifter: isAutomatic ? 'Yes' : 'No',
        maxPower: baseData.power,
        torque: baseData.torque,
        zeroTo100KmphTime: '9.5 sec',
        topSpeed: '160 kmph',
        evBatteryCapacity: isEV ? '50 kWh' : 'N/A',
        hybridBatteryCapacity: 'N/A',
        batteryType: isEV ? 'Lithium Ion' : 'N/A',
        electricMotorPlacement: isEV ? 'Front Axle' : 'N/A',
        evRange: isEV ? `${baseData.mileage} Km` : 'N/A',
        evChargingTime: isEV ? '6h AC / 50min DC' : 'N/A',
        maxElectricMotorPower: isEV ? baseData.power : 'N/A',
        turboCharged: !isEV ? 'Yes' : 'No',
        hybridType: 'None',
        driveTrain: 'FWD',
        drivingModes: 'Eco, City, Sport',
        offRoadModes: 'Snow, Mud, Sand',
        differentialLock: 'Electronic',
        limitedSlipDifferential: 'No',

        seatUpholstery: 'Leatherette',
        seatsAdjustment: 'Electric',
        driverSeatAdjustment: '6-way Power',
        passengerSeatAdjustment: '4-way Manual',
        rearSeatAdjustment: 'Reclining',
        welcomeSeats: 'Yes',
        memorySeats: 'Driver Only',

        headLights: 'LED Projector',
        tailLight: 'LED',
        frontFogLights: 'LED',
        roofRails: 'Functional',
        radioAntenna: 'Shark Fin',
        outsideRearViewMirror: 'Body Colored',
        daytimeRunningLights: 'LED',
        sideIndicator: 'On ORVM',
        rearWindshieldWiper: 'Yes',

        // Page 5
        groundClearance: '190 mm',
        length: '4300 mm',
        width: '1800 mm',
        height: '1650 mm',
        wheelbase: '2600 mm',
        turningRadius: '5.2 m',
        kerbWeight: '1400 kg',

        frontTyreProfile: '215/60 R17',
        rearTyreProfile: '215/60 R17',
        spareTyreProfile: '215/60 R16',
        spareWheelType: 'Steel',
        frontSuspension: 'McPherson Strut',
        rearSuspension: 'Torsion Beam',

        cupholders: '4',
        fuelTankCapacity: isEV ? 'N/A' : '50 Litres',
        bootSpace: '433 Litres',
        bootSpaceAfterFoldingRearRowSeats: '1000 Litres',

        // Merge provided base data last to override defaults if needed
        ...baseData
    };
}

const variantsData = {
    'Thar 5-Door': [
        { name: 'AX Opt Petrol MT', price: 1500000, fuelType: 'Petrol', transmission: 'Manual', engine: '2.0L Turbo', power: '150 bhp', torque: '300 Nm', mileage: 12 },
        { name: 'AX Opt Petrol AT', price: 1650000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L Turbo', power: '150 bhp', torque: '300 Nm', mileage: 11 },
        { name: 'AX Opt Diesel MT', price: 1550000, fuelType: 'Diesel', transmission: 'Manual', engine: '2.2L Diesel', power: '130 bhp', torque: '300 Nm', mileage: 15 },
        { name: 'AX Opt Diesel AT', price: 1700000, fuelType: 'Diesel', transmission: 'Automatic', engine: '2.2L Diesel', power: '130 bhp', torque: '300 Nm', mileage: 14 },
        { name: 'LX Petrol MT', price: 1750000, fuelType: 'Petrol', transmission: 'Manual', engine: '2.0L Turbo', power: '150 bhp', torque: '300 Nm', mileage: 12 },
        { name: 'LX Petrol AT', price: 1900000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L Turbo', power: '150 bhp', torque: '300 Nm', mileage: 11 },
        { name: 'LX Diesel MT', price: 1800000, fuelType: 'Diesel', transmission: 'Manual', engine: '2.2L Diesel', power: '130 bhp', torque: '300 Nm', mileage: 15 },
        { name: 'LX Diesel AT', price: 1950000, fuelType: 'Diesel', transmission: 'Automatic', engine: '2.2L Diesel', power: '130 bhp', torque: '300 Nm', mileage: 14 },
        { name: 'LX Hard Top Petrol AT', price: 2000000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L Turbo', power: '150 bhp', torque: '300 Nm', mileage: 11 },
        { name: 'LX Hard Top Diesel AT', price: 2100000, fuelType: 'Diesel', transmission: 'Automatic', engine: '2.2L Diesel', power: '130 bhp', torque: '300 Nm', mileage: 14 }
    ],
    'Nexon EV Long Range': [
        { name: 'Creative +', price: 1800000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 },
        { name: 'Fearless', price: 1900000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 },
        { name: 'Fearless +', price: 1950000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 },
        { name: 'Fearless + S', price: 2000000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 },
        { name: 'Empowered', price: 2050000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 },
        { name: 'Empowered +', price: 2100000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 },
        { name: 'Dark Edition Creative', price: 1850000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 },
        { name: 'Dark Edition Fearless', price: 1950000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 },
        { name: 'Dark Edition Empowered', price: 2100000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 },
        { name: 'Jet Edition', price: 2150000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '150 bhp', torque: '350 Nm', mileage: 450 }
    ],
    'XUV500 2025': [
        { name: 'MX Petrol MT', price: 1600000, fuelType: 'Petrol', transmission: 'Manual', engine: '2.0L Turbo', power: '200 bhp', torque: '380 Nm', mileage: 13 },
        { name: 'MX Diesel MT', price: 1650000, fuelType: 'Diesel', transmission: 'Manual', engine: '2.2L Diesel', power: '185 bhp', torque: '420 Nm', mileage: 16 },
        { name: 'AX3 Petrol MT', price: 1750000, fuelType: 'Petrol', transmission: 'Manual', engine: '2.0L Turbo', power: '200 bhp', torque: '380 Nm', mileage: 13 },
        { name: 'AX3 Diesel MT', price: 1800000, fuelType: 'Diesel', transmission: 'Manual', engine: '2.2L Diesel', power: '185 bhp', torque: '420 Nm', mileage: 16 },
        { name: 'AX5 Petrol AT', price: 1950000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L Turbo', power: '200 bhp', torque: '380 Nm', mileage: 12 },
        { name: 'AX5 Diesel AT', price: 2000000, fuelType: 'Diesel', transmission: 'Automatic', engine: '2.2L Diesel', power: '185 bhp', torque: '420 Nm', mileage: 15 },
        { name: 'AX7 Petrol AT', price: 2150000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L Turbo', power: '200 bhp', torque: '380 Nm', mileage: 12 },
        { name: 'AX7 Diesel AT', price: 2200000, fuelType: 'Diesel', transmission: 'Automatic', engine: '2.2L Diesel', power: '185 bhp', torque: '420 Nm', mileage: 15 },
        { name: 'AX7 L Petrol AT', price: 2300000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L Turbo', power: '200 bhp', torque: '380 Nm', mileage: 12 },
        { name: 'AX7 L Diesel AT', price: 2400000, fuelType: 'Diesel', transmission: 'Automatic', engine: '2.2L Diesel', power: '185 bhp', torque: '420 Nm', mileage: 15 }
    ],
    'Curvv EV': [
        { name: 'XE', price: 1600000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 400 },
        { name: 'XM', price: 1700000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 400 },
        { name: 'XT', price: 1800000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 400 },
        { name: 'XZ', price: 1900000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 400 },
        { name: 'XZ+', price: 2000000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 500 },
        { name: 'XZ+ Lux', price: 2100000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 500 },
        { name: 'XZ+ Tech', price: 2150000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 500 },
        { name: 'Dark Edition XT', price: 1850000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 400 },
        { name: 'Dark Edition XZ+', price: 2050000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 500 },
        { name: 'Dark Edition XZ+ Lux', price: 2200000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '145 bhp', torque: '310 Nm', mileage: 500 }
    ],
    'Swift 2025': [
        { name: 'LXi', price: 650000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L Z-Series', power: '82 bhp', torque: '112 Nm', mileage: 25 },
        { name: 'VXi', price: 750000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L Z-Series', power: '82 bhp', torque: '112 Nm', mileage: 25 },
        { name: 'VXi AMT', price: 800000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.2L Z-Series', power: '82 bhp', torque: '112 Nm', mileage: 26 },
        { name: 'ZXi', price: 850000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L Z-Series', power: '82 bhp', torque: '112 Nm', mileage: 25 },
        { name: 'ZXi AMT', price: 900000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.2L Z-Series', power: '82 bhp', torque: '112 Nm', mileage: 26 },
        { name: 'ZXi+', price: 920000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L Z-Series', power: '82 bhp', torque: '112 Nm', mileage: 25 },
        { name: 'ZXi+ AMT', price: 970000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.2L Z-Series', power: '82 bhp', torque: '112 Nm', mileage: 26 },
        { name: 'VXi CNG', price: 840000, fuelType: 'CNG', transmission: 'Manual', engine: '1.2L Z-Series', power: '70 bhp', torque: '95 Nm', mileage: 30 },
        { name: 'ZXi CNG', price: 940000, fuelType: 'CNG', transmission: 'Manual', engine: '1.2L Z-Series', power: '70 bhp', torque: '95 Nm', mileage: 30 },
        { name: 'ZXi+ Dual Tone', price: 935000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L Z-Series', power: '82 bhp', torque: '112 Nm', mileage: 25 }
    ],
    'Amaze 2025': [
        { name: 'E', price: 750000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 19 },
        { name: 'S', price: 850000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 19 },
        { name: 'S CVT', price: 950000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 18.5 },
        { name: 'VX', price: 950000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 19 },
        { name: 'VX CVT', price: 1050000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 18.5 },
        { name: 'VX Elite', price: 1000000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 19 },
        { name: 'VX Elite CVT', price: 1100000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 18.5 },
        { name: 'ZX', price: 1050000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 19 },
        { name: 'ZX CVT', price: 1150000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 18.5 },
        { name: 'ZX Plus', price: 1100000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.2L i-VTEC', power: '90 bhp', torque: '110 Nm', mileage: 19 }
    ],
    'Cloud EV': [
        { name: 'Excite', price: 2000000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 },
        { name: 'Exclusive', price: 2200000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 },
        { name: 'Essence', price: 2400000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 },
        { name: 'Essence Dual Tone', price: 2450000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 },
        { name: 'Luxury', price: 2500000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 },
        { name: 'Luxury Plus', price: 2600000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 },
        { name: 'Premium', price: 2100000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 },
        { name: 'Premium Plus', price: 2300000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 },
        { name: 'Signature', price: 2550000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 },
        { name: 'Signature Plus', price: 2650000, fuelType: 'Electric', transmission: 'Automatic', engine: 'PMS Motor', power: '134 bhp', torque: '200 Nm', mileage: 460 }
    ],
    'Skyraptor': [
        { name: 'Adventure', price: 2500000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 },
        { name: 'Adventure +', price: 2600000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 },
        { name: 'Accomplished', price: 2700000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 },
        { name: 'Accomplished +', price: 2800000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 },
        { name: 'Fearless AWD', price: 2900000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 },
        { name: 'Fearless AWD +', price: 3000000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 },
        { name: 'Dark Edition Adventure', price: 2550000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 },
        { name: 'Dark Edition Accomplished', price: 2750000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 },
        { name: 'Dark Edition Fearless', price: 2950000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 },
        { name: 'Camo Edition', price: 2850000, fuelType: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '300 bhp', torque: '600 Nm', mileage: 450 }
    ],
    'Alcazar 2025': [
        { name: 'Prestige Petrol MT', price: 1700000, fuelType: 'Petrol', transmission: 'Manual', engine: '1.5L Turbo', power: '160 bhp', torque: '253 Nm', mileage: 17.5 },
        { name: 'Prestige Diesel MT', price: 1800000, fuelType: 'Diesel', transmission: 'Manual', engine: '1.5L Diesel', power: '116 bhp', torque: '250 Nm', mileage: 20.4 },
        { name: 'Platinum Petrol DCT', price: 2000000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.5L Turbo', power: '160 bhp', torque: '253 Nm', mileage: 18 },
        { name: 'Platinum Diesel AT', price: 2100000, fuelType: 'Diesel', transmission: 'Automatic', engine: '1.5L Diesel', power: '116 bhp', torque: '250 Nm', mileage: 19 },
        { name: 'Signature Petrol DCT', price: 2200000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.5L Turbo', power: '160 bhp', torque: '253 Nm', mileage: 18 },
        { name: 'Signature Diesel AT', price: 2300000, fuelType: 'Diesel', transmission: 'Automatic', engine: '1.5L Diesel', power: '116 bhp', torque: '250 Nm', mileage: 19 },
        { name: 'Prestige (O) Petrol DCT', price: 1900000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.5L Turbo', power: '160 bhp', torque: '253 Nm', mileage: 18 },
        { name: 'Prestige (O) Diesel AT', price: 2000000, fuelType: 'Diesel', transmission: 'Automatic', engine: '1.5L Diesel', power: '116 bhp', torque: '250 Nm', mileage: 19 },
        { name: 'Platinum (O) Petrol DCT', price: 2100000, fuelType: 'Petrol', transmission: 'Automatic', engine: '1.5L Turbo', power: '160 bhp', torque: '253 Nm', mileage: 18 },
        { name: 'Platinum (O) Diesel AT', price: 2200000, fuelType: 'Diesel', transmission: 'Automatic', engine: '1.5L Diesel', power: '116 bhp', torque: '250 Nm', mileage: 19 }
    ],
    'Kodiaq 2025': [
        { name: 'Style', price: 4000000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 },
        { name: 'Sportline', price: 4200000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 },
        { name: 'L&K', price: 4500000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 },
        { name: 'Style 4x4', price: 4100000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 },
        { name: 'Sportline 4x4', price: 4300000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 },
        { name: 'L&K 4x4', price: 4600000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 },
        { name: 'Corporate Edition', price: 3900000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 },
        { name: 'Monte Carlo', price: 4400000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 },
        { name: 'Scout', price: 4250000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 },
        { name: 'Laurin & Klement', price: 4550000, fuelType: 'Petrol', transmission: 'Automatic', engine: '2.0L TSI', power: '190 bhp', torque: '320 Nm', mileage: 13 }
    ]
};

async function createVariants() {
    console.log('Fetching upcoming cars to get IDs...');

    try {
        const carsResponse = await fetch(`${API_BASE}/api/upcoming-cars`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });

        if (!carsResponse.ok) throw new Error('Failed to fetch upcoming cars');

        const upcomingCars = await carsResponse.json();

        for (const [carName, variants] of Object.entries(variantsData)) {
            const car = upcomingCars.find(c => c.name === carName);

            if (!car) {
                console.error(`❌ Car not found: ${carName}`);
                continue;
            }

            console.log(`Creating variants for ${carName} (ID: ${car.id})...`);

            for (const variant of variants) {
                // Generate full variant data with defaults
                const fullVariantData = getDefaultVariantData(variant);

                // Add required relationship fields
                fullVariantData.modelId = car.id;
                fullVariantData.brandId = car.brandId;
                fullVariantData.isUpcoming = true;

                try {
                    const response = await fetch(`${API_BASE}/api/variants`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${AUTH_TOKEN}`
                        },
                        body: JSON.stringify(fullVariantData)
                    });

                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(error);
                    }

                    const result = await response.json();
                    console.log(`  ✅ Created variant: ${variant.name} (ID: ${result.id})`);
                } catch (err) {
                    console.error(`  ❌ Failed to create ${variant.name}: ${err.message}`);
                }
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

createVariants();
