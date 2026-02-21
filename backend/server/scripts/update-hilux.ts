import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function updateHilux() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const hilux = await Model.findOne({ id: 'model-brand-toyota-hilux' });

        if (!hilux) {
            console.error('Toyota Hilux model not found.');
            return;
        }

        console.log(`Found Hilux model: ${hilux.name}`);

        hilux.headerSeo = `The Toyota Hilux is a diesel pickup truck priced from ₹11.38 lakh (Pakistan) to A$75,310 (Australia), powered by 2.4L (148 BHP, 400 Nm) or 2.8L turbo-diesel engines (201 BHP, 500 Nm standard / 221 BHP, 550 Nm GR Sport). Features V-Active 48V mild-hybrid system (2.8L, 4WD automatic only), 8-12.3-inch touchscreen with wireless Apple CarPlay/Android Auto, 5-star ANCAP safety rating, autonomous emergency braking, blind-spot monitoring, lane departure alert, adaptive cruise control, Multi-Terrain Select (6 modes), Crawl Control, hill descent control. Available with 6-speed manual or automatic transmission. 4WD/RWD. Mileage: 8-13 km/l (5.7-7.4 L/100km mild-hybrid). 3500kg towing capacity. Dimensions: 5325-5330mm length, 215-310mm ground clearance. Launch: Q3 2025 (November 2025 unveiling).`;

        hilux.summary = `The 2025 Hilux features refreshed design with bold grille, sharper LED headlights, redesigned bumper, strong body lines, flared wheel arches, strong ladder-frame chassis, high ground clearance, durable suspension, off-road driving modes, refined yet rugged interior with durability focus, supportive seats, improved noise insulation, heated leather seats (higher trims), premium sound system (higher trims), advanced cabin detection system for child safety, and 5-seater (some cab chassis: 2-seater). V-Active mild-hybrid: motor generator, 48V battery, improved fuel efficiency, 4WD automatic only. Expected late 2025/2026 production for some variants.`;

        hilux.description = `This diesel pickup truck offers legendary toughness with strong ladder-frame chassis, high ground clearance, durable suspension, and off-road capabilities. Safety: 5-star ANCAP rating, autonomous emergency braking (pedestrian/cyclist detection), front/rear parking sensors, blind-spot monitoring, lane departure alert, adaptive cruise control, stability control, advanced cabin detection system. V-Active mild-hybrid: 48V system improves efficiency (outputs generally unchanged: 150 kW, 500 Nm). Multi-Terrain Select: 6 modes. Ideal for work and off-road adventures with robust specifications.`;

        hilux.pros = `Powerful Diesel: 148/201/221 BHP, 400/500/550 Nm, 3500kg towing capacity.
V-Active Mild-Hybrid: 48V system improves efficiency (2.8L, 4WD automatic).
5-Star ANCAP: Top safety rating with ADAS features.
Off-Road Capability: Multi-Terrain Select (6 modes), Crawl Control, hill descent control.`;

        hilux.cons = `Launch Date: Expected Q3 2025 (November 2025 unveiling).
Mileage: 8-13 km/l is modest for a diesel pickup.
Mild-Hybrid Limited: V-Active 48V only for 2.8L 4WD automatic.
Price Varies: Wide price range across markets (₹11.38L-A$75,310).`;

        hilux.exteriorDesign = `The Hilux features refreshed design with bold grille, sharper LED headlights, redesigned bumper, strong body lines, and flared wheel arches creating a rugged pickup truck aesthetic.`;

        hilux.comfortConvenience = `The cabin features 8-12.3-inch touchscreen with wireless Apple CarPlay/Android Auto, refined yet rugged interior with durability focus, supportive seats, improved noise insulation, heated leather seats (higher trims), premium sound system (higher trims), and advanced cabin detection system for child safety.`;

        hilux.engineSummaries = [
            {
                title: '2.4L Turbo-Diesel',
                summary: '4-cylinder diesel, RWD/4WD.',
                transmission: '6-speed MT/AT',
                power: '148 BHP (110 kW)',
                torque: '400 Nm',
                speed: '8-13 km/l'
            },
            {
                title: '2.8L Turbo-Diesel',
                summary: '4-cylinder diesel, RWD/4WD.',
                transmission: '6-speed MT/AT',
                power: '201 BHP (150 kW)',
                torque: '420-500 Nm',
                speed: '8-13 km/l'
            },
            {
                title: '2.8L V-Active Mild-Hybrid',
                summary: '48V mild-hybrid diesel, 4WD AT.',
                transmission: '6-speed AT',
                power: '201 BHP (150 kW)',
                torque: '500 Nm',
                speed: '5.7 L/100km (improved)'
            },
            {
                title: '2.8L GR Sport',
                summary: 'High-performance diesel, 4WD AT.',
                transmission: '6-speed AT',
                power: '221 BHP (165 kW)',
                torque: '550 Nm',
                speed: '8-13 km/l'
            }
        ] as any;

        hilux.faqs = [
            {
                question: "What is the towing capacity?",
                answer: "3500 kg (braked) towing capacity for 4x4 diesel models."
            },
            {
                question: "What is V-Active mild-hybrid?",
                answer: "48V system with motor generator and battery, improves fuel efficiency (2.8L 4WD automatic only)."
            },
            {
                question: "When is the launch?",
                answer: "Expected Q3 2025 (November 2025 unveiling). Some variants (2.8D 48V) expected 2026 production."
            },
            {
                question: "What is the ANCAP rating?",
                answer: "5-star ANCAP safety rating."
            },
            {
                question: "What is the price range?",
                answer: "Varies by market: ₹11.38 lakh (Pakistan) to A$75,310 (Australia)."
            }
        ] as any;

        await hilux.save();
        console.log('Successfully updated Toyota Hilux model data.');

    } catch (error) {
        console.error('Error updating Hilux:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateHilux();
