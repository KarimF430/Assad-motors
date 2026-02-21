
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Model } from '../db/schemas';

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

    console.log('\n🔍 CURRENT DB STATE FOR CRETA:');
    console.log('----------------------------------------');
    console.log('HEADER SEO:', model.headerSeo);

    process.exit(0);
}

run();
