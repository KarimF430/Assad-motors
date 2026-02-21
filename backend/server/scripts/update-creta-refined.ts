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

async function updateCretaRefined() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";

    if (!process.env.MONGODB_URI) {
        console.warn('MONGODB_URI not found in env, using default localhost');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    try {
        const creta = await Model.findOne({ id: 'model-brand-hyundai-creta' });

        if (!creta) {
            console.error('Hyundai Creta model not found (id: model-brand-hyundai-creta).');
            return;
        }

        console.log(`Found Creta model: ${creta.name}`);

        // 1. Update Header SEO (User requested 2025)
        creta.headerSeo = 'Hyundai Creta 2025 - Price, Specs, Mileage, Interior & Features';

        // 2. Fix Pros & Cons (Remove markdown stars)
        // The collected strings had `* **Text**:`, we want generic bold or just text?
        // User said "showing stars", implying they want it clean.
        // If I remove `**`, it will just be text.
        // Let's formatting it as "Title: Description"

        creta.pros = `Advanced Safety: Standard 6 Airbags, ESC, VSM, and Level 2 ADAS with 19 safety features.
Premium Features: Voice-enabled Panoramic Sunroof, Ventilated Front Seats, and 8-way Power Driver Seat.
Tech-Loaded: Dual 10.25-inch screens (Infotainment & Cluster), Bose Premium Sound System (8 Speakers), and Bluelink connectivity.
Powertrain Choice: Offers three distinct engine options (Petrol, Diesel, Turbo Petrol) and four transmission choices.`;

        creta.cons = `Price Premium: Higher variants with ADAS and Turbo Multi-Clutch are priced significantly higher than base models.
Rear Seat Width: While comfortable for two, squeezing three adults in the rear can be tight compared to some wider rivals.
No Safety Rating (Facelift): The latest facelift has not yet been crash-tested by Global NCAP (Pre-facelift was 3-star).`;

        // 3. Ensure Summary/Description is long enough (User: "more than 4 lines")
        // The previous summary was good, but maybe headerSeo was being used?
        // We will update both just in case.
        creta.summary = 'The new Hyundai Creta is the ultimate SUV that commands attention with its parametric design and premium interiors. It features advanced technology like Level 2 ADAS, a voice-enabled panoramic sunroof, and a 10.25-inch infotainment system. Available in Petrol, Diesel, and Turbo Petrol engines with multiple transmission options, it offers a powerful and comfortable driving experience. With its robust stance and refined performance, the Creta continues to dominate the mid-size SUV segment in India, offering a perfect blend of style, comfort, and practicality for the modern family.';

        // 4. Engine summaries - data seemed correct, issue was frontend label.
        // Re-saving to be sure.
        creta.engineSummaries = [
            {
                title: '1.5L MPi Petrol',
                summary: 'Refined and linear naturally aspirated engine, perfect for city commutes and relaxed highway cruising.',
                transmission: '6-MT / IVT (CVT)',
                power: '115 PS @ 6300 rpm',
                torque: '143.8 Nm @ 4500 rpm',
                speed: '~170 kmph'
            },
            {
                title: '1.5L U2 CRDi Diesel',
                summary: 'A torquey and highly fuel-efficient diesel workhorse, ideal for high-mileage users and highway runs.',
                transmission: '6-MT / 6-AT',
                power: '116 PS @ 4000 rpm',
                torque: '250 Nm @ 1500-2750 rpm',
                speed: '~175 kmph'
            },
            {
                title: '1.5L Turbo GDi Petrol',
                summary: 'High-performance engine delivering punchy acceleration and sporty dynamics for the enthusiast.',
                transmission: '7-Speed DCT',
                power: '160 PS @ 5500 rpm',
                torque: '253 Nm @ 1500-3500 rpm',
                speed: '~190 kmph'
            }
        ];

        await creta.save();
        console.log('Successfully refined Hyundai Creta model data.');

    } catch (error) {
        console.error('Error updating Creta:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateCretaRefined();
