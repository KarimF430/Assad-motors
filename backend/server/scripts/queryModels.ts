import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function queryModels() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        // Find Creta for reference
        const creta = await Model.findOne({ name: /creta/i }).lean();
        console.log('\n=== HYUNDAI CRETA REFERENCE ===');
        console.log('ID:', creta?.id);
        console.log('Name:', creta?.name);
        console.log('\nHeader SEO:', creta?.headerSeo);
        console.log('\nSummary:', creta?.summary);
        console.log('\nDescription:', creta?.description);
        console.log('\nPros:', creta?.pros);
        console.log('\nCons:', creta?.cons);
        console.log('\nExterior Design:', creta?.exteriorDesign);
        console.log('\nComfort Convenience:', creta?.comfortConvenience);
        console.log('\nEngine Summaries:', JSON.stringify(creta?.engineSummaries, null, 2));
        console.log('\nFAQs:', JSON.stringify(creta?.faqs, null, 2));

        // Find Sierra
        const sierra = await Model.findOne({ name: /sierra/i }).lean();
        console.log('\n=== TATA SIERRA ===');
        console.log('ID:', sierra?.id);
        console.log('Name:', sierra?.name);
        console.log('BrandId:', sierra?.brandId);
        console.log('Has headerSeo:', !!sierra?.headerSeo);
        console.log('Has summary:', !!sierra?.summary);
        console.log('Has description:', !!sierra?.description);

        // Find Kylaq
        const kylaq = await Model.findOne({ name: /kylaq/i }).lean();
        console.log('\n=== SKODA KYLAQ ===');
        console.log('ID:', kylaq?.id);
        console.log('Name:', kylaq?.name);
        console.log('BrandId:', kylaq?.brandId);
        console.log('Has headerSeo:', !!kylaq?.headerSeo);
        console.log('Has summary:', !!kylaq?.summary);
        console.log('Has description:', !!kylaq?.description);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected.');
    }
}

queryModels();
