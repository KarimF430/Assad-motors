
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Model, Brand, UpcomingCar, Variant } from '../db/schemas';
import { humanizeContent, humanizeEngineSummaries } from '../utils/content-humanizer';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found in environment variables');
        process.exit(1);
    }

    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('✅ Connected.');

        // 1. Humanize Brands
        console.log('\n--- Processing BRANDS ---');
        const brands = await Brand.find({});
        let brandsUpdated = 0;

        for (const brand of brands) {
            if (brand.summary) {
                const humanized = humanizeContent(brand.summary);
                if (humanized !== brand.summary) {
                    await Brand.updateOne({ _id: brand._id }, { $set: { summary: humanized } });
                    brandsUpdated++;
                    process.stdout.write('.');
                }
            }
        }
        console.log(`\n✅ Brands updated: ${brandsUpdated}/${brands.length}`);

        // 2. Humanize Models
        console.log('\n--- Processing MODELS ---');
        const models = await Model.find({});
        let modelsUpdated = 0;

        for (const model of models) {
            const updates: Record<string, any> = {};
            const fields = ['summary', 'description', 'exteriorDesign', 'comfortConvenience', 'pros', 'headerSeo'];

            for (const field of fields) {
                const val = (model as any)[field];
                if (val && typeof val === 'string') {
                    const h = humanizeContent(val);
                    if (h !== val) updates[field] = h;
                }
            }

            // Engine Summaries
            if (model.engineSummaries && model.engineSummaries.length > 0) {
                const hEngines = humanizeEngineSummaries(model.engineSummaries as any);
                const changed = hEngines.some((h, i) => h.summary !== (model.engineSummaries?.[i] as any)?.summary);
                if (changed) updates.engineSummaries = hEngines;
            }

            if (Object.keys(updates).length > 0) {
                await Model.updateOne({ _id: model._id }, { $set: updates });
                modelsUpdated++;
                process.stdout.write('.');
            }
        }
        console.log(`\n✅ Models updated: ${modelsUpdated}/${models.length}`);

        // 3. Humanize Upcoming Cars
        console.log('\n--- Processing UPCOMING CARS ---');
        const upcoming = await UpcomingCar.find({});
        let upcomingUpdated = 0;

        for (const car of upcoming) {
            const updates: Record<string, any> = {};
            const fields = ['summary', 'description', 'exteriorDesign', 'comfortConvenience', 'pros', 'headerSeo'];

            for (const field of fields) {
                const val = (car as any)[field];
                if (val && typeof val === 'string') {
                    const h = humanizeContent(val);
                    if (h !== val) updates[field] = h;
                }
            }

            if (car.engineSummaries && car.engineSummaries.length > 0) {
                const hEngines = humanizeEngineSummaries(car.engineSummaries as any);
                const changed = hEngines.some((h, i) => h.summary !== (car.engineSummaries?.[i] as any)?.summary);
                if (changed) updates.engineSummaries = hEngines;
            }

            if (Object.keys(updates).length > 0) {
                await UpcomingCar.updateOne({ _id: car._id }, { $set: updates });
                upcomingUpdated++;
                process.stdout.write('.');
            }
        }
        console.log(`\n✅ Upcoming cars updated: ${upcomingUpdated}/${upcoming.length}`);

        // 4. Humanize Variants
        console.log('\n--- Processing VARIANTS ---');
        const variants = await Variant.find({});
        let variantsUpdated = 0;

        for (const variant of variants) {
            const updates: Record<string, any> = {};
            const fields = ['description', 'headerSummary', 'keyFeatures', 'exteriorDesign', 'comfortConvenience', 'engineSummary'];

            for (const field of fields) {
                const val = (variant as any)[field];
                if (val && typeof val === 'string') {
                    const h = humanizeContent(val);
                    if (h !== val) updates[field] = h;
                }
            }

            if (Object.keys(updates).length > 0) {
                await Variant.updateOne({ _id: variant._id }, { $set: updates });
                variantsUpdated++;
                process.stdout.write('.');
            }
        }
        console.log(`\n✅ Variants updated: ${variantsUpdated}/${variants.length}`);

        console.log('\n🎉 ALL DONE!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error during execution:', error);
        process.exit(1);
    }
}

run();
