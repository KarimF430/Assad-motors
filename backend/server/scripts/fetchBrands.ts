import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Brand } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not found');
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    // Fetch all active brands
    const brands = await Brand.find({ status: 'active' })
        .select('id name summary')
        .lean();

    console.log(`=== ${brands.length} ACTIVE BRANDS ===\n`);

    for (const brand of brands) {
        console.log(`--- ${brand.name} ---`);
        console.log(`ID: ${brand.id}`);
        console.log(`Summary: ${brand.summary || '(No summary)'}`);
        console.log('');
    }

    await mongoose.disconnect();
}

run();
