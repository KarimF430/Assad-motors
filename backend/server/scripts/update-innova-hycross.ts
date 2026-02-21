import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function updateInnovaHycross() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const innovaHycross = await Model.findOne({ id: 'model-brand-toyota-innova-hycross' });

        if (!innovaHycross) {
            console.error('Toyota Innova Hycross model not found.');
            return;
        }

        console.log(`Found Innova Hycross model: ${innovaHycross.name}`);

        innovaHycross.headerSeo = `The Toyota Innova Hycross is a premium hybrid MPV priced from ₹19.94 lakh to ₹31.34 lakh (January 2025 prices), available with two 2.0L petrol engines: standard (173 HP, 209 Nm, 16.13 km/l) and strong hybrid (184 HP, 188 Nm, 22.16-23.24 km/l). Features 5-star Bharat NCAP rating, 10.1-inch touchscreen, panoramic sunroof with mood lighting, powered ottoman seats, ventilated front seats, 8-way power-adjustable driver seat with memory, 9-speaker JBL audio, ADAS (Level 2), 360-degree camera, wireless charging. Monocoque frame. 7-8-seater. Dimensions: 4755mm length, 2850mm wheelbase. Boot: 289L (690L third row folded).`;

        innovaHycross.summary = `The 2025 Innova Hycross features modern design with sharp lines, bold grille, LED headlights/DRLs, 18-inch gunmetal grey alloy wheels, wheel-arch cladding, spacious cabin with generous legroom/headroom, premium upholstery, automatic climate control, rear AC vents, rear charging sockets, tumble fold seats, paddle shifters, cruise control, keyless entry, push-button start, wireless Android Auto/Apple CarPlay, voice commands, navigation, digital instrument clusters. Hybrid: fifth-generation self-charging hybrid electric technology, e-CVT, Eco/Normal/Power modes. January 2025 price hike: ₹17,000 (base) to ₹34,000-₹36,000 (hybrid).`;

        innovaHycross.description = `This premium hybrid MPV features monocoque frame for enhanced ride comfort and handling. Safety: 5-star Bharat NCAP (adult and child), up to 6 SRS airbags, ABS with EBD, stability control, hill-start assist, ADAS (dynamic radar cruise control, lane trace assist, rear cross-traffic alert, blind spot monitor, pre-collision system, auto high beam), 360-degree camera, front/rear parking sensors. Hybrid: self-charging, no external charging needed. Ideal for families seeking premium hybrid MPV with advanced safety and technology.`;

        innovaHycross.pros = `5-Star BNCAP: Top safety rating for adult and child occupants.
Strong Hybrid: 184 HP, 22.16-23.24 km/l, fifth-generation self-charging technology.
Premium Features: Panoramic sunroof, ottoman seats, ventilated seats, 9-speaker JBL, ADAS.
Spacious: 7-8-seater, 289L boot (690L third row folded).`;

        innovaHycross.cons = `Price: Starts at ₹19.94 lakh, premium for hybrid MPV segment.
Price Increase: January 2025 hike of ₹17,000-₹36,000.
Fuel Tank: 52L is modest for long trips.
Boot Space: 289L with all rows up is limited.`;

        innovaHycross.exteriorDesign = `The Innova Hycross features modern design with sharp lines, bold grille, LED headlights, LED DRLs, 18-inch gunmetal grey metallic alloy wheels (higher variants), and wheel-arch cladding creating a premium hybrid MPV aesthetic.`;

        innovaHycross.comfortConvenience = `The cabin features 8-10.1-inch touchscreen with wireless Android Auto/Apple CarPlay, voice commands, navigation, 9-speaker JBL sound system (some variants), automatic climate control, rear AC vents, rear charging sockets, tumble fold seats, paddle shifters, cruise control, keyless entry, push-button start, wireless charging, digital instrument clusters, panoramic sunroof with mood lighting, powered ottoman seats, ventilated front seats, 8-way power-adjustable driver seat with memory, and 289L boot (690L third row folded).`;

        innovaHycross.engineSummaries = [
            {
                title: '2.0L Petrol',
                summary: 'Standard petrol engine.',
                transmission: 'Automatic',
                power: '173 HP (172.99 BHP)',
                torque: '209 Nm',
                speed: '16.13 km/l'
            },
            {
                title: '2.0L Strong Hybrid',
                summary: 'Petrol + electric motor, e-CVT.',
                transmission: 'e-CVT Automatic',
                power: '184 HP (183.72 BHP)',
                torque: '188 Nm',
                speed: '22.16-23.24 km/l'
            }
        ] as any;

        innovaHycross.faqs = [
            {
                question: "What is the mileage?",
                answer: "22.16-23.24 km/l (strong hybrid), 16.13 km/l (standard petrol)."
            },
            {
                question: "What is the Bharat NCAP rating?",
                answer: "5-star Bharat NCAP rating for adult and child occupant safety."
            },
            {
                question: "Is ADAS available?",
                answer: "Yes, Level 2 ADAS available (dynamic radar cruise control, lane trace assist, pre-collision system)."
            },
            {
                question: "What is the boot space?",
                answer: "289L with all rows up, 690L with third row folded."
            },
            {
                question: "What is the price range?",
                answer: "Starts from ₹19.94 lakh to ₹31.34 lakh (ex-showroom, January 2025 prices)."
            }
        ] as any;

        await innovaHycross.save();
        console.log('Successfully updated Toyota Innova Hycross model data.');

    } catch (error) {
        console.error('Error updating Innova Hycross:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateInnovaHycross();
