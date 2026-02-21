/**
 * DELETE All Non-Creta Variants
 * 
 * This will delete 1,781 variants from all models EXCEPT Creta.
 * Run with --dry-run first to see what will be deleted without actually deleting.
 * 
 * Usage:
 *   npx tsx server/scripts/deleteNonCretaVariants.ts --dry-run   # Preview only
 *   npx tsx server/scripts/deleteNonCretaVariants.ts --execute   # Actually delete
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model, Brand } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const CRETA_MODEL_ID = 'model-brand-hyundai-creta';

async function run() {
    const args = process.argv.slice(2);
    const isDryRun = args.includes('--dry-run');
    const isExecute = args.includes('--execute');

    if (!isDryRun && !isExecute) {
        console.log('⚠️  Please specify --dry-run or --execute');
        console.log('   --dry-run: Preview what will be deleted');
        console.log('   --execute: Actually delete the variants');
        process.exit(1);
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Count variants to delete
    const toDelete = await Variant.find({
        modelId: { $ne: CRETA_MODEL_ID }
    }).select('name modelId brandId').lean();

    console.log('=== DELETION SUMMARY ===\n');
    console.log(`Creta Model ID: ${CRETA_MODEL_ID}`);
    console.log(`Variants to DELETE: ${toDelete.length}`);

    // Get Creta count for confirmation
    const cretaCount = await Variant.countDocuments({ modelId: CRETA_MODEL_ID });
    console.log(`Creta variants (KEEPING): ${cretaCount}`);

    if (isDryRun) {
        console.log('\n=== DRY RUN MODE ===');
        console.log('This is a preview. No data will be deleted.\n');

        // Group by model for summary
        const byModel: Record<string, number> = {};
        for (const v of toDelete) {
            byModel[v.modelId] = (byModel[v.modelId] || 0) + 1;
        }

        console.log('Variants per model to delete:');
        const sortedModels = Object.entries(byModel).sort((a, b) => b[1] - a[1]);
        for (const [modelId, count] of sortedModels.slice(0, 20)) {
            console.log(`  ${modelId}: ${count} variants`);
        }
        if (sortedModels.length > 20) {
            console.log(`  ... and ${sortedModels.length - 20} more models`);
        }

        console.log('\n✅ Dry run complete. Run with --execute to delete.');
    }

    if (isExecute) {
        console.log('\n=== EXECUTING DELETION ===');
        console.log('⚠️  This will permanently delete variants...\n');

        const result = await Variant.deleteMany({
            modelId: { $ne: CRETA_MODEL_ID }
        });

        console.log(`✅ Deleted ${result.deletedCount} variants`);

        // Verify Creta variants still exist
        const remainingCreta = await Variant.countDocuments({ modelId: CRETA_MODEL_ID });
        console.log(`✅ Creta variants remaining: ${remainingCreta}`);

        const totalRemaining = await Variant.countDocuments({});
        console.log(`✅ Total variants remaining: ${totalRemaining}`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
