import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function fetchKiaModels() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        // Fetch all Kia models using brand ID
        const kiaModels = await Model.find({
            brandId: 'brand-kia'
        }).select('id name headerSeo summary description pros cons');

        console.log(`\n========== KIA MODELS (${kiaModels.length} found) ==========\n`);

        kiaModels.forEach((model, index) => {
            console.log(`${index + 1}. Model Name: ${model.name}`);
            console.log(`   Model ID: ${model.id}`);
            console.log(`   Header SEO: ${model.headerSeo ? 'EXISTS (' + model.headerSeo.length + ' chars)' : 'MISSING'}`);
            console.log(`   Summary: ${model.summary ? 'EXISTS (' + model.summary.length + ' chars)' : 'MISSING'}`);
            console.log(`   Description: ${model.description ? 'EXISTS (' + model.description.length + ' chars)' : 'MISSING'}`);
            console.log(`   Pros: ${model.pros ? 'EXISTS' : 'MISSING'}`);
            console.log(`   Cons: ${model.cons ? 'EXISTS' : 'MISSING'}`);
            console.log('   ---');
        });

        console.log(`\n========== SUMMARY ==========`);
        console.log(`Total Kia Models Found: ${kiaModels.length}`);
        console.log(`\nModel IDs for update scripts:`);
        kiaModels.forEach(model => {
            const slug = model.id.replace('model-brand-kia-', '');
            console.log(`  - ${model.name}: ${slug}`);
        });

    } catch (error) {
        console.error('Error fetching Kia models:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB.');
    }
}

fetchKiaModels();
