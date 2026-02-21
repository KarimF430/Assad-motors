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

async function updateCretaEV() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const cretaEV = await Model.findOne({ id: 'model-brand-hyundai-creta-ev' });

        if (!cretaEV) {
            console.error('Hyundai Creta EV model not found (id: model-brand-hyundai-creta-ev).');
            return;
        }

        console.log(`Found Creta EV model: ${cretaEV.name}`);

        // Update fields with Simple English content from CRETA_EV_DATA_PREVIEW

        cretaEV.headerSeo = `The Hyundai Creta Electric marks the arrival of the ultimate electric SUV. With a futuristic pixelated design and a massive range of up to 510 km, it redefines what an EV can do. Powered by a potent motor delivering 168 BHP and packed with smart tech like Level 2 ADAS, the Creta Electric is ready to electrify your drive.`;

        cretaEV.summary = `The Creta Electric combines the trust of the Creta name with futuristic electric performance. It features a unique pixelated grille, aero-optimized wheels, and a tech-loaded interior with dual screens. With a 0-100 km/h time of just 7.9 seconds and a range of over 500 km, it offers both thrill and practicality.`;

        cretaEV.description = `The Creta Electric stands out with its 'Power Pose' design, featuring pixelated LED graphics on the front and rear bumpers. Inside, it transports you to a world of calm with a dual-tone grey interior and ocean-blue ambient lighting. The highlight is the new steering wheel with a Morse code 'H' logo. It is not just about looks; the car features ADAS-linked regenerative braking that charges the battery while keeping you safe.`;

        cretaEV.pros = `Impressive Range: Up to 510 km on a single charge (for the 51.4 kWh pack) banishes range anxiety.
Thrilling Performance: The 168 BHP motor launches the SUV from 0-100 km/h in just 7.9 seconds.
Futuristic Design: Pixelated lights and aero wheels give it a distinct, high-tech look.
Loaded Features: Comes with Level 2 ADAS, ventilated seats, and dual 10.25-inch screens.`;

        cretaEV.cons = `Charging Time: Like all EVs, long trips require planning for charging stops.
Price: Likely to be priced at a premium compared to the petrol/diesel Creta.
Rear Floor: The battery pack might slightly raise the floor level for rear passengers.`;

        cretaEV.exteriorDesign = `The design is tech-inspired, featuring a closed-off pixelated grille and a charging port integrated into the front. It rides on special 17-inch aero alloy wheels designed to reduce wind resistance. The rear mirrors the front with a pixelated bumper and connecting tail lamps, making it instantly engaging.`;

        cretaEV.comfortConvenience = `The cabin feels spacious and modern. A floating center console and a column-mounted gear selector (drive-by-wire) free up space. The driver gets a futuristic 3-spoke steering wheel and a panoramic display. Rear passengers enjoy generous legroom, AC vents, and a flat floor for extra comfort.`;

        // Engine/Motor Summaries (BHP)
        cretaEV.engineSummaries = [
            {
                title: 'Long Range (51.4 kWh)',
                summary: 'High-performance battery pack for long-distance touring.',
                transmission: 'Single Speed Reduction Gear',
                power: '168 BHP (171 PS)',
                torque: 'Instant Torque',
                speed: '~510 km Range'
            },
            {
                title: 'Standard Range (42 kWh)',
                summary: 'Reliable battery pack perfect for daily city commutes.',
                transmission: 'Single Speed Reduction Gear',
                power: '133 BHP (135 PS)',
                torque: 'Instant Torque',
                speed: '~420 km Range'
            }
        ] as any;

        // Mileage Data (Range)
        cretaEV.mileageData = [
            {
                engineName: 'Long Range (51.4 kWh)',
                companyClaimed: '510 km',
                cityRealWorld: '450 km',
                highwayRealWorld: '380 km'
            },
            {
                engineName: 'Standard Range (42 kWh)',
                companyClaimed: '420 km',
                cityRealWorld: '380 km',
                highwayRealWorld: '320 km'
            }
        ] as any;

        // FAQs
        cretaEV.faqs = [
            {
                question: "What is the real-world range?",
                answer: "The certified range is 510 km for the long-range version, but real-world driving should typically deliver between 380-450 km depending on usage."
            },
            {
                question: "How fast does it charge?",
                answer: "With a 50kW DC fast charger, it can charge from 10% to 80% in about 58 minutes."
            },
            {
                question: "Is it faster than the Petrol Creta?",
                answer: "Yes, the electric motor's instant torque makes it quicker, doing 0-100 km/h in just 7.9 seconds."
            },
            {
                question: "What is the battery warranty?",
                answer: "Hyundai typically offers an 8-year/1,60,000 km warranty on the high-voltage battery pack."
            },
            {
                question: "Does it have ADAS?",
                answer: "Yes, it comes equipped with Hyundai SmartSense Level 2 ADAS with 20 safety features."
            }
        ] as any;

        await cretaEV.save();
        console.log('Successfully updated Hyundai Creta Electric model data.');

    } catch (error) {
        console.error('Error updating Creta EV:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateCretaEV();
