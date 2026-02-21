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

async function updateCretaNLine() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const cretaNLine = await Model.findOne({ id: 'model-brand-hyundai-creta-n-line' });

        if (!cretaNLine) {
            console.error('Hyundai Creta N Line model not found (id: model-brand-hyundai-creta-n-line).');
            return;
        }

        console.log(`Found Creta N Line model: ${cretaNLine.name}`);

        // Update fields with Simple English content from CRETA_N_LINE_DATA_PREVIEW

        cretaNLine.headerSeo = `The Hyundai Creta N Line gives the popular SUV a sporty makeover with racing-inspired looks and a powerful engine. It is built for enthusiasts who want the comfort of a Creta but with a thrilling drive. With its aggressive design, stiffened suspension for better handling, and a powerful 1.5L Turbo petrol engine, the Creta N Line stands out on any road.`;

        cretaNLine.summary = `The Creta N Line is a performance-focused version of the standard Creta. It features a unique grille, sporty 18-inch wheels, and red accents inside and out. Under the hood, it has a powerful turbo engine that produces 158 BHP, paired with sporty transmission options. It combines SUV practicality with the fun of a hot hatch.`;

        cretaNLine.description = `From the moment you look at it, the Creta N Line screams performance. It features a dark chrome grille with the N Line logo, twin-tip exhaust, and a roof spoiler. Inside, the all-black cabin is stitched with red highlights, and the metal pedals adds to the sporty feel. It is not just about looks; the steering and suspension are tuned to be more responsive, giving you more confidence in corners. It also comes with Level 2 ADAS for advanced safety.`;

        cretaNLine.pros = `Powerful Engine: The 1.5L Turbo GDi engine offers thrilling acceleration and highway speeds.
Sporty Handling: Tuned suspension and weighted steering make it fun to drive around bends.
Aggressive Looks: N Line specific body kit, 18-inch wheels, and red accents look very premium.
Loaded with Tech: Comes with dual 10.25-inch screens, Level 2 ADAS, and ventilated seats.`;

        cretaNLine.cons = `Firm Ride: The stiffer suspension means you might feel bumps more than the standard Creta.
Fuel Efficiency: The powerful turbo engine can be thirsty if driven aggressively.
Price: It commands a premium price over the standard petrol variants.`;

        cretaNLine.exteriorDesign = `The exterior is bold and athletic. The front profile is dominated by a sporty black grille and sequential LED turn indicators. The side profile shows off the large 18-inch diamond-cut alloy wheels with N-logo center caps and red brake calipers. The rear gets a sporty spoiler and a twin-tip muffler that delivers a deeper exhaust note.`;

        cretaNLine.comfortConvenience = `The interior is designed to connect the driver with the car. You get a sporty N Line steering wheel with paddle shifters on the automatic version. The seats are wrapped in leatherette with red stitching and N badging. It also features dual-zone climate control, a panoramic sunroof, and a Bose premium sound system for a luxurious experience.`;

        // Engine Summaries (BHP)
        cretaNLine.engineSummaries = [
            {
                title: '1.5L Turbo GDi Petrol',
                summary: 'The raw power of 158 horses gives an adrenaline-pumping drive.',
                transmission: '6-Manual / 7-DCT',
                power: '158 BHP @ 5500 rpm',
                torque: '253 Nm @ 1500-3500 rpm',
                speed: '~190 kmph'
            }
        ];

        // FAQs
        cretaNLine.faqs = [
            {
                question: "How is it different from the regular Creta?",
                answer: "It has a more powerful engine option as standard, a stiffer suspension setup for better handling, and unique sporty looks inside and out."
            },
            {
                question: "Does it have a manual gearbox?",
                answer: "Yes, unlike many performance SUVs, the Creta N Line offers a proper 6-speed manual transmission for enthusiasts."
            },
            {
                question: "What is the power output?",
                answer: "The 1.5L Turbo engine produces 158 BHP (160 PS) and 253 Nm of torque."
            },
            {
                question: "Is it safe?",
                answer: "Yes, it comes with 6 airbags, ESC, and Level 2 ADAS features like Autonomous Emergency Braking."
            },
            {
                question: "What wheels does it have?",
                answer: "It rides on larger 18-inch diamond-cut alloy wheels which are exclusive to the N Line model."
            }
        ] as any;

        await cretaNLine.save();
        console.log('Successfully updated Hyundai Creta N Line model data.');

    } catch (error) {
        console.error('Error updating Creta N Line:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateCretaNLine();
