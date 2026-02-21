/**
 * Show Creta Variant Sample Data Structure
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);

    // Get one Creta variant as sample
    const sampleVariant = await Variant.findOne({
        modelId: 'model-brand-hyundai-creta'
    }).lean();

    if (sampleVariant) {
        console.log('=== CRETA VARIANT SAMPLE ===\n');
        console.log('Name:', sampleVariant.name);
        console.log('Price:', sampleVariant.price);
        console.log('Fuel Type:', sampleVariant.fuelType);
        console.log('Transmission:', sampleVariant.transmission);

        console.log('\n=== ALL FIELDS WITH VALUES ===\n');
        const filledFields: string[] = [];
        const emptyFields: string[] = [];

        for (const [key, value] of Object.entries(sampleVariant)) {
            if (key === '_id' || key === '__v') continue;
            if (value !== null && value !== '' && value !== undefined) {
                filledFields.push(key);
            } else {
                emptyFields.push(key);
            }
        }

        console.log('Filled Fields:', filledFields.length);
        console.log('Empty Fields:', emptyFields.length);

        console.log('\n=== FILLED FIELDS DETAILS ===\n');
        for (const [key, value] of Object.entries(sampleVariant)) {
            if (key === '_id' || key === '__v' || key === 'highlightImages') continue;
            if (value !== null && value !== '' && value !== undefined) {
                const displayValue = typeof value === 'string' ? value.substring(0, 80) : value;
                console.log(`${key}: ${displayValue}`);
            }
        }
    }

    // List all Creta variant names and prices
    console.log('\n\n=== ALL CRETA VARIANTS ===\n');
    const allCretaVariants = await Variant.find({
        modelId: 'model-brand-hyundai-creta'
    }).select('name price fuelType transmission').lean();

    for (const v of allCretaVariants) {
        console.log(`${v.name} | ₹${(v.price / 100000).toFixed(2)}L | ${v.fuelType} | ${v.transmission}`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
