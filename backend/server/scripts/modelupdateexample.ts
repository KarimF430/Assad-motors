import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function updateBE6() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const be6 = await Model.findOne({ id: 'model-brand-mahindra-be-6' });

        if (!be6) {
            console.error('Mahindra BE 6 model not found (id: model-brand-mahindra-be-6).');
            return;
        }

        console.log(`Found BE 6 model: ${be6.name}`);

        be6.headerSeo = `The Mahindra BE.06 (BE 6) is an all-electric compact crossover SUV built on the INGLO platform, delivering 278 BHP (282 hp) and 380 Nm torque with RWD. Available with 59 kWh (557 km range) or 79 kWh (682 km ARAI range) LFP Blade cell battery packs, it accelerates 0-100 km/h in 6.7 seconds with a top speed of 200 km/h. Priced from ₹18.9 lakh to ₹27.65 lakh, it features dual 12.3-inch displays, panoramic "Infinity" glass roof with LED mood lighting, wireless charging, ventilated front seats, and 5-star Bharat NCAP rating. Fast charging (175 kW) charges 20-80% in under 20 minutes.`;

        be6.summary = `The BE 6 features a tech-forward coupe-SUV design with an aircraft-style thrust lever gear selector and touch-sensitive controls. The cabin offers soft-touch surfaces, leatherette upholstery, brushed aluminum trim, dual-zone climate control, and 455 liters boot space plus 45-liter frunk. Built on the modular INGLO platform with Mahindra Artificial Intelligence Architecture (MAIA), it measures 4371mm in length with a 2775mm wheelbase. The vehicle supports 175 kW DC fast charging and 7.2 kW or 11.2 kW AC wallbox chargers.`;

        be6.description = `This 5-seater electric crossover features Level 2 ADAS with Mobileye EyeQTM6 chip (some variants), 7 airbags, ABS with EBD, ESP, four-wheel disc brakes, traction control, hill-hold and hill-descent control, TPMS, and ISOFIX mounts. The MAIA system integrates Qualcomm Snapdragon 8295 chipset with 24 GB RAM, 128 GB storage, Wi-Fi 6.0, Bluetooth 5.2, and 5G connectivity for real-time updates. Multi-drive modes include Range, Everyday, Race, and Snow. Advanced features include auto park assist, in-car camera, and Secure360 surveillance.`;

        be6.pros = `Range: 682 km ARAI range (79 kWh), 557 km (59 kWh), class-leading for compact crossover.
Performance: 278 BHP, 0-100 km/h in 6.7 seconds, 200 km/h top speed.
Ultra-Fast Charging: 175 kW DC charging, 20-80% in under 20 minutes.
Premium Features: Dual 12.3" screens, panoramic glass roof, 5-star BNCAP, Level 2 ADAS.`;

        be6.cons = `Price: Starts at ₹18.9 lakh, premium pricing for compact crossover segment.
Charging Infrastructure: 175 kW fast charging limited to select locations.
Boot Space: 455L is adequate but smaller than traditional SUVs.
Rear Headroom: Coupe-SUV design may limit rear headroom for tall passengers.`;

        be6.exteriorDesign = `The BE 6 features a dynamic coupe-SUV design with aggressive stance and aerodynamic sculpting. The design emphasizes performance and efficiency with a low center of gravity and 50:50 weight distribution. The INGLO platform enables a flat-floor design for maximum cabin space.`;

        be6.comfortConvenience = `The cabin features a dual 12.3-inch digital display setup (instrument cluster and infotainment) integrated seamlessly. An aircraft-style thrust lever gear selector and touch-sensitive controls create a futuristic experience. Features include a panoramic "Infinity" glass roof with LED mood lighting, wireless phone charging, ventilated front seats (higher trims), dual-zone climate control, soft-touch surfaces, leatherette upholstery, and brushed aluminum trim. MAIA with Qualcomm Snapdragon 8295 chipset offers wireless Android Auto and Apple CarPlay, multi-drive modes, auto park assist, in-car camera, and Secure360 surveillance.`;

        be6.engineSummaries = [
            {
                title: '59 kWh RWD',
                summary: 'Electric motor with 59 kWh LFP battery.',
                transmission: 'Single Speed',
                power: '225 BHP (228 PS)',
                torque: '380 Nm',
                speed: '557 km (ARAI)'
            },
            {
                title: '79 kWh RWD',
                summary: 'Electric motor with 79 kWh LFP battery.',
                transmission: 'Single Speed',
                power: '278 BHP (282 PS)',
                torque: '380 Nm',
                speed: '682 km (ARAI)'
            }
        ] as any;

        be6.faqs = [
            {
                question: "What is the ARAI-certified range?",
                answer: "557 km (59 kWh) or 682 km (79 kWh), class-leading for compact crossover segment."
            },
            {
                question: "How fast can it charge?",
                answer: "175 kW DC fast charging 20-80% in under 20 minutes. 7.2 kW/11.2 kW AC wallbox charging available."
            },
            {
                question: "What is the performance?",
                answer: "278 BHP (79 kWh), 380 Nm torque, 0-100 km/h in 6.7 seconds, top speed 200 km/h."
            },
            {
                question: "Does it have Level 2 ADAS?",
                answer: "Yes, Level 2 ADAS with Mobileye EyeQTM6 chip (some variants), including AEB, adaptive cruise control, and lane-keep assist."
            },
            {
                question: "What is the boot space?",
                answer: "455 liters of boot space plus 45-liter frunk (front trunk)."
            }
        ] as any;

        await be6.save();
        console.log('Successfully updated Mahindra BE 6 model data.');

    } catch (error) {
        console.error('Error updating BE 6:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateBE6();
