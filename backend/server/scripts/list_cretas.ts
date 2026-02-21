
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

    const models = await Model.find({ name: { $regex: /Creta/i } });

    console.log(`\n🔍 Found ${models.length} models matching 'Creta':`);
    console.log('----------------------------------------');

    models.forEach(m => {
        console.log(`ID: ${m._id}`);
        console.log(`Name: ${m.name}`);
        console.log(`HeaderSEO Start: ${m.headerSeo ? m.headerSeo.substring(0, 50) : 'N/A'}`);
        console.log('----------------------------------------');
    });

    process.exit(0);
}

run();
