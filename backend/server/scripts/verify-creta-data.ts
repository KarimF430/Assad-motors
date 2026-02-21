import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function verifyCreta() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    try {
        // Find the Creta model
        // Using loose regex to ensure we find it
        const creta = await Model.findOne({ name: { $regex: /Creta/i }, id: 'model-brand-hyundai-creta' });

        if (!creta) {
            console.error('Creta model NOT FOUND with id model-brand-hyundai-creta');
            const anyCreta = await Model.findOne({ name: { $regex: /Creta/i } });
            if (anyCreta) {
                console.log('Found A Creta but with different id:', anyCreta.id);
                console.log('Name:', anyCreta.name);
            }
            return;
        }

        console.log('--- VERIFICATION DATA ---');
        console.log('ID:', creta.id);
        console.log('Name:', creta.name);
        console.log('Header SEO:', creta.headerSeo); // Should include 2025
        console.log('Summary Length:', creta.summary ? creta.summary.length : 0);
        console.log('Summary Start:', creta.summary ? creta.summary.substring(0, 50) + '...' : 'N/A');
        console.log('Description Length:', creta.description ? creta.description.length : 0);
        console.log('Pros (First 100 chars):', creta.pros ? creta.pros.substring(0, 100) : 'N/A'); // Should check for **
        console.log('-------------------------');

    } catch (error) {
        console.error('Error verifying:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyCreta();
