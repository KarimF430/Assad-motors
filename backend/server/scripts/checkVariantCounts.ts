/**
 * Check Variant Counts - Show status before deletion
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model, Brand } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Get Creta model ID
    const creta = await Model.findOne({ name: 'Creta' }).select('id name').lean();
    console.log('=== CRETA MODEL ===');
    console.log('ID:', creta?.id);

    // Count Creta variants
    const cretaVariants = await Variant.countDocuments({ modelId: creta?.id });
    console.log('Creta Variants:', cretaVariants);

    // Count total variants
    const totalVariants = await Variant.countDocuments({});
    console.log('\n=== TOTAL VARIANTS ===');
    console.log('Total:', totalVariants);

    // Count non-Creta variants (to be deleted)
    const nonCretaVariants = await Variant.countDocuments({ modelId: { $ne: creta?.id } });
    console.log('Non-Creta (will delete):', nonCretaVariants);

    // Get active brands count
    const activeBrands = await Brand.find({ status: 'active' }).select('id name').lean();
    console.log('\n=== ACTIVE BRANDS ===');
    console.log('Count:', activeBrands.length);
    console.log('Names:', activeBrands.map(b => b.name).join(', '));

    // Get count of models per brand (active brands only)
    const activeBrandIds = activeBrands.map(b => b.id);
    const activeModels = await Model.find({
        status: 'active',
        brandId: { $in: activeBrandIds }
    }).select('id name brandId').lean();
    console.log('\n=== ACTIVE MODELS (14 brands) ===');
    console.log('Count:', activeModels.length);

    await mongoose.disconnect();
}

run().catch(console.error);
