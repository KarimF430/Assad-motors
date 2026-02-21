
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

    const model = await Model.findOne({ name: { $regex: /Creta/i } });

    if (!model) {
        console.log('❌ Creta model not found!');
        process.exit(1);
    }

    console.log(`\n🔍 PROCESSING MODEL: ${model.name}`);
    console.log('----------------------------------------');

    const fields = ['summary', 'description', 'exteriorDesign', 'comfortConvenience', 'pros', 'headerSeo'];
    const newUpdates: any = {};

    for (const field of fields) {
        const original = (model as any)[field];
        if (original && typeof original === 'string') {
            console.log(`\nField: ${field.toUpperCase()}`);
            console.log('ORIGINAL:', original.substring(0, 150) + '...');

            const humanized = humanizeContent(original);
            console.log('HUMANIZED:', humanized.substring(0, 150) + '...');

            if (humanized !== original) {
                newUpdates[field] = humanized;
            } else {
                console.log('(No change needed)');
            }
        }
    }

    if (Object.keys(newUpdates).length > 0) {
        await Model.updateOne({ _id: model._id }, { $set: newUpdates });
        console.log('\n✅ Database updated for Creta.');
    } else {
        console.log('\n⚠️ No changes applied (text was already compliant).');
    }

    process.exit(0);
}

run();
