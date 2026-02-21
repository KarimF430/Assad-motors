import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function updateLandCruiserLC300() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const lc300 = await Model.findOne({ id: 'model-brand-toyota-land-cruiser-lc300' });

        if (!lc300) {
            console.error('Toyota Land Cruiser LC300 model not found.');
            return;
        }

        console.log(`Found Land Cruiser LC300 model: ${lc300.name}`);

        lc300.headerSeo = `The Toyota Land Cruiser LC300 is a premium diesel SUV priced from A$96,991 to A$145,791 (Australia) / ₹2.16-2.25 Crore (India), powered by a 3.3L twin-turbo V6 diesel engine producing 304 HP (227 kW) and 700 Nm torque. Features 9-12.3-inch touchscreen with Apple CarPlay/Android Auto, 10-14-speaker JBL sound system, satellite navigation, 7-12.3-inch digital instrument cluster, leather upholstery, heated/ventilated front/second-row seats, dual-zone or four-zone climate control, power-adjustable front seats with driver memory, heated steering wheel, cool box, wireless phone charger, head-up display. Available with 10-speed automatic transmission, full-time 4WD. Mileage: 8.9 L/100km (claimed). 3500kg towing capacity. Dimensions: 17-20-inch wheels, LED headlights, power tailgate. Off-road: Crawl Control, Hill Descent Control, multi-terrain select. Safety: Toyota Safety Sense, up to 10 airbags, ABS with EBD, traction/stability control, 360-degree camera, pre-collision system, adaptive cruise control, lane tracing assist, blind spot monitoring. GR Sport: locking front/rear differentials, E-KDSS.`;

        lc300.summary = `The 2025 Land Cruiser LC300 features premium off-road capabilities with Crawl Control, Hill Descent Control, multi-terrain select system, GR Sport with locking differentials and E-KDSS (Electronic-Kinetic Dynamic Suspension System), woodgrain/leatherette inlays (higher trims), 17-20-inch wheels (depending on variant), LED headlights with manual/auto-levelling, automatic high-beam, LED front fog lights, side steps, power tailgate, and available in GX, Sahara ZX, and GR Sport trims. Full-time 4WD. 10-speed automatic transmission. 3.3L twin-turbo V6 diesel.`;

        lc300.description = `This premium diesel SUV offers legendary off-road capability with full-time 4WD, Crawl Control, Hill Descent Control, and multi-terrain select. Safety: Toyota Safety Sense technologies, up to 10 airbags, ABS with EBD, traction/stability control, 360-degree camera, pre-collision system, adaptive cruise control, lane tracing assist, blind spot monitoring. GR Sport: locking front/rear differentials, E-KDSS for enhanced off-road performance. Ideal for families seeking premium diesel SUV with robust off-road capabilities and luxury features.`;

        lc300.pros = `Powerful Diesel: 304 HP, 700 Nm torque, 3500kg towing capacity.
Off-Road Capability: Crawl Control, Hill Descent Control, multi-terrain select, E-KDSS (GR Sport).
Premium Features: Heated/ventilated seats, 4-zone climate control, 14-speaker JBL, head-up display.
Safety: Toyota Safety Sense, up to 10 airbags, 360° camera, adaptive cruise control.`;

        lc300.cons = `Price: Starts at A$96,991 (Australia) / ₹2.16 Crore (India), premium for diesel SUV.
Mileage: 8.9 L/100km is modest for a diesel SUV.
Size: Large dimensions may limit urban maneuverability.
Fuel Tank: Large fuel tank necessary for long trips.`;

        lc300.exteriorDesign = `The Land Cruiser LC300 features premium design with 17-20-inch wheels (depending on variant), LED headlights with manual/auto-levelling, automatic high-beam, LED front fog lights, side steps, and power tailgate creating a robust premium SUV aesthetic.`;

        lc300.comfortConvenience = `The cabin features 9-12.3-inch touchscreen with Apple CarPlay/Android Auto, 10-14-speaker JBL sound system, satellite navigation, 7-12.3-inch digital instrument cluster, leather upholstery, heated/ventilated front/second-row seats, dual-zone or four-zone climate control, power-adjustable front seats with driver memory, heated steering wheel, cool box, wireless phone charger, head-up display, and woodgrain/leatherette inlays (higher trims).`;

        lc300.engineSummaries = [
            {
                title: '3.3L Twin-Turbo V6 Diesel',
                summary: 'Full-time 4WD.',
                transmission: '10-speed AT',
                power: '304 HP (227 kW)',
                torque: '700 Nm',
                speed: '8.9 L/100km'
            }
        ] as any;

        lc300.faqs = [
            {
                question: "What is the towing capacity?",
                answer: "3500 kg (braked) towing capacity."
            },
            {
                question: "What is E-KDSS?",
                answer: "Electronic-Kinetic Dynamic Suspension System (GR Sport) for enhanced off-road performance."
            },
            {
                question: "What is the mileage?",
                answer: "8.9 L/100km (claimed, Australian market)."
            },
            {
                question: "What off-road features are included?",
                answer: "Crawl Control, Hill Descent Control, multi-terrain select, locking differentials (GR Sport)."
            },
            {
                question: "What is the price range?",
                answer: "A$96,991-A$145,791 (Australia) / ₹2.16-2.25 Crore (India)."
            }
        ] as any;

        await lc300.save();
        console.log('Successfully updated Toyota Land Cruiser LC300 model data.');

    } catch (error) {
        console.error('Error updating Land Cruiser LC300:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateLandCruiserLC300();
