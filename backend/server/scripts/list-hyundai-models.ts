import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function listHyundaiModels() {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const models = await Model.find({ brandId: { $regex: /hyundai/i } }, 'id name');
        console.log('--- Hyundai Models ---');
        models.forEach(m => console.log(`ID: ${m.id} | Name: ${m.name}`));
        console.log('----------------------');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listHyundaiModels();
