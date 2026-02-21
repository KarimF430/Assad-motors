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

async function updateCretaHeader() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const creta = await Model.findOne({ id: 'model-brand-hyundai-creta' });

        if (!creta) {
            console.error('Hyundai Creta model not found.');
            return;
        }

        // Update Header SEO to be longer (more than 4 lines of content)
        // Using HTML-like text as it goes into a Rich Text Editor usually, 
        // or just a long string. The user said "it is H2", likely meaning it serves as a major sub-section.
        creta.headerSeo = `Discover the all-new Hyundai Creta 2025 facelift, the undisputed leader of the mid-size SUV segment in India. Redefined by Hyundai's 'Sensuous Sportiness' design philosophy, the new Creta combines a bold, commanding exterior with a futuristic, premium interior. 

Experience uncompromised safety with standard 6 airbags and the cutting-edge Level 2 ADAS suite featuring 19 advanced driver-assistance systems. The SUV is loaded with segment-first technology including dual 10.25-inch integrated screens, a voice-enabled smart panoramic sunroof, and Bose premium sound system.

Choosing your perfect drive is easier than ever with three potent engine options: the refined 1.5L MPi Petrol, the torquey 1.5L U2 CRDi Diesel, and the thrill-inducing 1.5L Turbo GDi Petrol. Available with multiple transmission choices like DCT, IVT, and AT, the Creta delivers the perfect balance of performance and fuel efficiency.

Explore the detailed price list, full technical specifications, real-world mileage figures, and comparison with rivals to see why the Hyundai Creta 2025 is the ultimate SUV for your family.`;

        await creta.save();
        console.log('Successfully updated Hyundai Creta Header SEO text.');

    } catch (error) {
        console.error('Error updating Creta:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateCretaHeader();
