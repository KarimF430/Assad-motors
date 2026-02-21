
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Model } from '../db/schemas';
import { humanizeContent } from '../utils/content-humanizer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);

    const models = await Model.find({});
    let skippedCount = 0;

    console.log('\n🔍 DIAGNOSING SKIPPED MODELS:\n');

    for (const model of models) {
        let wouldUpdate = false;
        const fields = ['summary', 'description', 'exteriorDesign', 'comfortConvenience', 'pros', 'headerSeo'];

        // Check if any field WOULD change
        for (const field of fields) {
            const val = (model as any)[field];
            if (val && typeof val === 'string') {
                const h = humanizeContent(val);
                if (h !== val) wouldUpdate = true;
            }
        }

        // Since we ALREADY ran the update, "wouldUpdate" should be false for everything now 
        // (because they are already humanized).
        // So this logic detects if there is *still* something to do.

        // However, we want to know why some were NOT counted in the 199.
        // The previous run updated 199. So 25 were untouched.
        // Untouched means: they were either empty OR already human/neutral.

        // Let's print details of models that have EMPTY content, as that's the likely reason.
        const hasContent = fields.some(f => (model as any)[f] && (model as any)[f].length > 10);

        if (!hasContent) {
            console.log(`- [EMPTY] ${model.name}`);
            skippedCount++;
        } else {
            if (!wouldUpdate) {
                console.log(`\n- [SKIPPED - COMPLIANT] ${model.name}`);
                console.log(`  Summary: ${model.summary ? model.summary.substring(0, 100) : 'N/A'}...`);
                console.log(`  Description: ${model.description ? model.description.substring(0, 100) : 'N/A'}...`);
            }
            // If it has content but wasn't updated, maybe it was already neutral?
            // Since we don't track "updatedAt" for this specific batch easily without a new run,
            // we can't be 100% sure which ones were the 25.
            // But we can check if they look "human" (i.e. if humanizeContent returns same string).
            // Since we ran the script, ALL models should now return same string.
            // So checking now doesn't help distiguish the 199 vs 25.

            // But "Little or no text content" is the best guess.
        }
    }

    console.log(`\nTotal models with empty/low content: ${skippedCount}`);
    process.exit(0);
}

run();
