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

async function updateCretaBHP() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const creta = await Model.findOne({ id: 'model-brand-hyundai-creta' });

        if (!creta) {
            console.error('Hyundai Creta model not found.');
            return;
        }

        console.log(`Found Creta model: ${creta.name}`);

        // Update Power fields to BHP
        // 1.5L Petrol: 115 PS -> ~113 BHP (113.4)
        // 1.5L Diesel: 116 PS -> ~114 BHP (114.4)
        // 1.5L Turbo: 160 PS -> ~158 BHP (157.8)

        // Helper to safely update array items if logic gets complex, 
        // but here we just rewrite the array to be safe and explicit.
        // Preserving the existing text/specs, just changing Power.

        creta.engineSummaries = [
            {
                title: '1.5L MPi Petrol',
                summary: 'Refined and linear naturally aspirated engine, perfect for city commutes and relaxed highway cruising.',
                transmission: '6-MT / IVT (CVT)',
                power: '113 BHP @ 6300 rpm', // Changed from 115 PS
                torque: '143.8 Nm @ 4500 rpm',
                speed: '~170 kmph'
            },
            {
                title: '1.5L U2 CRDi Diesel',
                summary: 'A torquey and highly fuel-efficient diesel workhorse, ideal for high-mileage users and highway runs.',
                transmission: '6-MT / 6-AT',
                power: '114 BHP @ 4000 rpm', // Changed from 116 PS
                torque: '250 Nm @ 1500-2750 rpm',
                speed: '~175 kmph'
            },
            {
                title: '1.5L Turbo GDi Petrol',
                summary: 'High-performance engine delivering punchy acceleration and sporty dynamics for the enthusiast.',
                transmission: '7-Speed DCT',
                power: '158 BHP @ 5500 rpm', // Changed from 160 PS
                torque: '253 Nm @ 1500-3500 rpm',
                speed: '~190 kmph'
            }
        ];

        await creta.save();
        console.log('Successfully updated Hyundai Creta power ratings to BHP.');

    } catch (error) {
        console.error('Error updating Creta:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateCretaBHP();
