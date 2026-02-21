/**
 * Add Maruti Swift Variants - December 2025
 * 
 * Data sourced from official Maruti website and CarDekho
 * Only verified specs are filled, rest are null
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Maruti Swift - December 2025 Variants
// Source: Official Maruti Suzuki website, CarDekho, CarWale
const SWIFT_VARIANTS = [
    // Petrol Manual Variants
    {
        name: 'LXi',
        price: 649000,  // ₹6.49 Lakh
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineName: '1.2L Z-Series Petrol',
        engineTransmission: 'Manual',
        enginePower: '82 PS',
        engineTorque: '112 Nm',
        engineSpeed: '5-Speed',
        displacement: '1197 cc',
        mileageCompanyClaimed: '24.80',
        fuelTankCapacity: '37 Litres',
        seatingCapacity: '5',
        airbags: '2',
        abs: 'Yes',
        ebd: 'Yes',
    },
    {
        name: 'VXi',
        price: 749000,  // ₹7.49 Lakh
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineName: '1.2L Z-Series Petrol',
        engineTransmission: 'Manual',
        enginePower: '82 PS',
        engineTorque: '112 Nm',
        engineSpeed: '5-Speed',
        displacement: '1197 cc',
        mileageCompanyClaimed: '24.80',
        fuelTankCapacity: '37 Litres',
        seatingCapacity: '5',
        airbags: '2',
        abs: 'Yes',
        ebd: 'Yes',
        touchScreenInfotainment: '7 inch SmartPlay Studio',
        androidAppleCarplay: 'Wired',
    },
    {
        name: 'VXi (O)',
        price: 784000,  // ₹7.84 Lakh
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineName: '1.2L Z-Series Petrol',
        engineTransmission: 'Manual',
        enginePower: '82 PS',
        engineTorque: '112 Nm',
        engineSpeed: '5-Speed',
        displacement: '1197 cc',
        mileageCompanyClaimed: '24.80',
        fuelTankCapacity: '37 Litres',
        seatingCapacity: '5',
        airbags: '2',
        abs: 'Yes',
        ebd: 'Yes',
        touchScreenInfotainment: '7 inch SmartPlay Studio',
        androidAppleCarplay: 'Wired',
        reverseCamera: 'Yes',
    },
    {
        name: 'VXi AGS',
        price: 799000,  // ₹7.99 Lakh
        fuelType: 'Petrol',
        transmission: 'AMT',
        engineName: '1.2L Z-Series Petrol',
        engineTransmission: 'AMT',
        enginePower: '82 PS',
        engineTorque: '112 Nm',
        engineSpeed: '5-Speed AMT',
        displacement: '1197 cc',
        mileageCompanyClaimed: '25.75',
        fuelTankCapacity: '37 Litres',
        seatingCapacity: '5',
        airbags: '2',
        abs: 'Yes',
        ebd: 'Yes',
        touchScreenInfotainment: '7 inch SmartPlay Studio',
        androidAppleCarplay: 'Wired',
    },
    {
        name: 'ZXi',
        price: 849000,  // ₹8.49 Lakh
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineName: '1.2L Z-Series Petrol',
        engineTransmission: 'Manual',
        enginePower: '82 PS',
        engineTorque: '112 Nm',
        engineSpeed: '5-Speed',
        displacement: '1197 cc',
        mileageCompanyClaimed: '24.80',
        fuelTankCapacity: '37 Litres',
        seatingCapacity: '5',
        airbags: '6',
        abs: 'Yes',
        ebd: 'Yes',
        touchScreenInfotainment: '9 inch SmartPlay Pro+',
        androidAppleCarplay: 'Wireless',
        alloyWheels: '15 inch',
        cruiseControl: 'Yes',
        keylessEntry: 'Yes',
        pushButtonStart: 'Yes',
        reverseCamera: 'Yes',
        climateControl: 'Automatic',
    },
    {
        name: 'ZXi AGS',
        price: 899000,  // ₹8.99 Lakh
        fuelType: 'Petrol',
        transmission: 'AMT',
        engineName: '1.2L Z-Series Petrol',
        engineTransmission: 'AMT',
        enginePower: '82 PS',
        engineTorque: '112 Nm',
        engineSpeed: '5-Speed AMT',
        displacement: '1197 cc',
        mileageCompanyClaimed: '25.75',
        fuelTankCapacity: '37 Litres',
        seatingCapacity: '5',
        airbags: '6',
        abs: 'Yes',
        ebd: 'Yes',
        touchScreenInfotainment: '9 inch SmartPlay Pro+',
        androidAppleCarplay: 'Wireless',
        alloyWheels: '15 inch',
        cruiseControl: 'Yes',
        keylessEntry: 'Yes',
        pushButtonStart: 'Yes',
        reverseCamera: 'Yes',
        climateControl: 'Automatic',
    },
    {
        name: 'ZXi+',
        price: 919000,  // ₹9.19 Lakh
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineName: '1.2L Z-Series Petrol',
        engineTransmission: 'Manual',
        enginePower: '82 PS',
        engineTorque: '112 Nm',
        engineSpeed: '5-Speed',
        displacement: '1197 cc',
        mileageCompanyClaimed: '24.80',
        fuelTankCapacity: '37 Litres',
        seatingCapacity: '5',
        airbags: '6',
        abs: 'Yes',
        ebd: 'Yes',
        touchScreenInfotainment: '9 inch SmartPlay Pro+',
        androidAppleCarplay: 'Wireless',
        alloyWheels: '16 inch Diamond Cut',
        cruiseControl: 'Yes',
        keylessEntry: 'Yes',
        pushButtonStart: 'Yes',
        reverseCamera: 'Yes',
        climateControl: 'Automatic',
        sunroof: 'Electric',
        headLights: 'LED Projector',
        speakers: '6',
    },
    {
        name: 'ZXi+ AGS',
        price: 969000,  // ₹9.69 Lakh
        fuelType: 'Petrol',
        transmission: 'AMT',
        engineName: '1.2L Z-Series Petrol',
        engineTransmission: 'AMT',
        enginePower: '82 PS',
        engineTorque: '112 Nm',
        engineSpeed: '5-Speed AMT',
        displacement: '1197 cc',
        mileageCompanyClaimed: '25.75',
        fuelTankCapacity: '37 Litres',
        seatingCapacity: '5',
        airbags: '6',
        abs: 'Yes',
        ebd: 'Yes',
        touchScreenInfotainment: '9 inch SmartPlay Pro+',
        androidAppleCarplay: 'Wireless',
        alloyWheels: '16 inch Diamond Cut',
        cruiseControl: 'Yes',
        keylessEntry: 'Yes',
        pushButtonStart: 'Yes',
        reverseCamera: 'Yes',
        climateControl: 'Automatic',
        sunroof: 'Electric',
        headLights: 'LED Projector',
        speakers: '6',
    },
    // CNG Variants
    {
        name: 'VXi CNG',
        price: 844000,  // ₹8.44 Lakh
        fuelType: 'Petrol + CNG',
        transmission: 'Manual',
        engineName: '1.2L Z-Series Petrol + CNG',
        engineTransmission: 'Manual',
        enginePower: '70 PS (CNG)',
        engineTorque: '98 Nm (CNG)',
        engineSpeed: '5-Speed',
        displacement: '1197 cc',
        mileageCompanyClaimed: '32.85 km/kg',
        fuelTankCapacity: '37L Petrol + 55L CNG',
        seatingCapacity: '5',
        airbags: '2',
        abs: 'Yes',
        ebd: 'Yes',
        touchScreenInfotainment: '7 inch SmartPlay Studio',
        androidAppleCarplay: 'Wired',
    },
    {
        name: 'ZXi CNG',
        price: 944000,  // ₹9.44 Lakh
        fuelType: 'Petrol + CNG',
        transmission: 'Manual',
        engineName: '1.2L Z-Series Petrol + CNG',
        engineTransmission: 'Manual',
        enginePower: '70 PS (CNG)',
        engineTorque: '98 Nm (CNG)',
        engineSpeed: '5-Speed',
        displacement: '1197 cc',
        mileageCompanyClaimed: '32.85 km/kg',
        fuelTankCapacity: '37L Petrol + 55L CNG',
        seatingCapacity: '5',
        airbags: '6',
        abs: 'Yes',
        ebd: 'Yes',
        touchScreenInfotainment: '9 inch SmartPlay Pro+',
        androidAppleCarplay: 'Wireless',
        alloyWheels: '15 inch',
        cruiseControl: 'Yes',
        keylessEntry: 'Yes',
        pushButtonStart: 'Yes',
        reverseCamera: 'Yes',
        climateControl: 'Automatic',
    },
];

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = !args.includes('--execute');

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Find Swift model
    const swiftModel = await Model.findOne({ name: 'Swift' }).lean();
    if (!swiftModel) {
        console.error('❌ Swift model not found in database!');
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log('=== MARUTI SWIFT VARIANTS ===\n');
    console.log(`Model ID: ${swiftModel.id}`);
    console.log(`Brand ID: ${swiftModel.brandId}\n`);

    console.log('Variants to add:');
    console.log('-'.repeat(60));

    for (const v of SWIFT_VARIANTS) {
        console.log(`${v.name.padEnd(15)} | ₹${(v.price / 100000).toFixed(2)}L | ${v.fuelType.padEnd(12)} | ${v.transmission}`);
    }

    console.log('-'.repeat(60));
    console.log(`Total: ${SWIFT_VARIANTS.length} variants\n`);

    if (isDryRun) {
        console.log('🔍 DRY RUN - No data inserted');
        console.log('Run with --execute to insert variants');
    } else {
        console.log('⚡ INSERTING VARIANTS...\n');

        for (const variant of SWIFT_VARIANTS) {
            const variantId = `variant-${swiftModel.brandId}-${swiftModel.id}-${variant.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

            const variantDoc = {
                id: variantId,
                name: variant.name,
                brandId: swiftModel.brandId,
                modelId: swiftModel.id,
                price: variant.price,
                status: 'active',
                fuelType: variant.fuelType,
                fuel: variant.fuelType.split(' + ')[0], // Petrol or Diesel
                transmission: variant.transmission,
                engineName: variant.engineName,
                engineTransmission: variant.engineTransmission,
                enginePower: variant.enginePower,
                engineTorque: variant.engineTorque,
                engineSpeed: variant.engineSpeed,
                displacement: variant.displacement,
                mileageCompanyClaimed: variant.mileageCompanyClaimed,
                fuelTankCapacity: variant.fuelTankCapacity,
                seatingCapacity: variant.seatingCapacity,
                airbags: variant.airbags,
                abs: variant.abs,
                ebd: variant.ebd,
                touchScreenInfotainment: variant.touchScreenInfotainment || null,
                androidAppleCarplay: variant.androidAppleCarplay || null,
                alloyWheels: variant.alloyWheels || null,
                cruiseControl: variant.cruiseControl || null,
                keylessEntry: variant.keylessEntry || null,
                pushButtonStart: variant.pushButtonStart || null,
                reverseCamera: variant.reverseCamera || null,
                climateControl: variant.climateControl || null,
                sunroof: variant.sunroof || null,
                headLights: variant.headLights || null,
                speakers: variant.speakers || null,
            };

            // Check if variant already exists
            const existing = await Variant.findOne({ id: variantId });
            if (existing) {
                console.log(`⏭️  ${variant.name} already exists, skipping`);
                continue;
            }

            await Variant.create(variantDoc);
            console.log(`✅ Added: ${variant.name}`);
        }

        // Verify count
        const newCount = await Variant.countDocuments({ modelId: swiftModel.id });
        console.log(`\n🎉 Swift now has ${newCount} variants`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
