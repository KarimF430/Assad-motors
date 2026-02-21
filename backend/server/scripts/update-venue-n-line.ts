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

async function updateVenueNLine() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const venueNLine = await Model.findOne({ id: 'model-brand-hyundai-venue-n-line' });

        if (!venueNLine) {
            console.error('Hyundai Venue N Line model not found (id: model-brand-hyundai-venue-n-line).');
            return;
        }

        console.log(`Found Venue N Line model: ${venueNLine.name}`);

        // Update fields with Simple English content from VENUE_N_LINE_DATA_PREVIEW

        venueNLine.headerSeo = `The Hyundai Venue N Line is for those who love to drive. It takes the standard Venue and adds a sporty layer with a stiffer suspension, throatier exhaust sound, and sharp 'N Line' styling. Powered by a punchy turbo-petrol engine, it offers a thrilling drive with precise handling. With its all-black interior and red accents, every drive feels like an occasion.`;

        venueNLine.summary = `The Venue N Line is the sportiest compact SUV you can buy. It features a unique grille, sporty alloy wheels, and a dual-tip exhaust that sounds great. Inside, it gets an all-black cabin with red stitching and a special N Line steering wheel. It is perfect for enthusiasts who want a fun-to-drive SUV.`;

        venueNLine.description = `Designed to command attention, the Venue N Line wears its attitude on the outside with a dark chrome grille and red highlights on the bumpers. The interior is crafted for the driver, featuring metal pedals, a sporty gear knob, and paddle shifters. Under the skin, the suspension and steering are tuned for better cornering, making it more agile than the regular model. It also comes with a dashcam and 4-disc brakes for added safety.`;

        venueNLine.pros = `Driving Dynamics: Stiffened suspension and weighted steering make it fun to corner.
Sporty Looks: Unique N Line grille, red accents, and twin-tip exhaust stand out.
Performance: Punchy turbo engine with a quick-shifting DCT gearbox.
Braking: Comes with disc brakes on all four wheels for better stopping power.`;

        venueNLine.cons = `Stiff Ride: You will feel bumps more in the cabin due to the sporty suspension.
Price: It is priced significantly higher than the standard Venue turbo variants.
No Manual: Only available with iMT (clutchless manual) or DCT automatic, no pure manual stick shift.`;

        venueNLine.exteriorDesign = `The N Line gets a special 'Thunder Blue' color option with a black roof. The front has a dark chrome grille with the N Line logo. Side profiles show sporty 17-inch alloy wheels with red brake calipers. The rear features a roof spoiler and a dual-tip exhaust that not only looks good but sounds sporty too.`;

        venueNLine.comfortConvenience = `The cabin sets the mood with red ambient lighting and sporty black seats. The driver gets a powered seat and a leather-wrapped steering wheel that feels great to hold. It includes a dual-camera dashcam to record your drives. Rear passengers get ample space, AC vents, and USB chargers.`;

        // Engine Summaries (BHP)
        venueNLine.engineSummaries = [
            {
                title: 'Kappa 1.0 Turbo GDi',
                summary: 'A high-performance engine tuned for a spirited drive with a sporty exhaust note.',
                transmission: '6-Speed Manual / 7-DCT',
                power: '118 BHP @ 6000 rpm',
                torque: '172 Nm @ 1500-4000 rpm',
                speed: '~185 kmph'
            }
        ];

        // FAQs
        venueNLine.faqs = [
            {
                question: "What is unique about the Venue N Line?",
                answer: "It has a stiffer suspension, sporty exhaust, 4-disc brakes, and unique N Line styling compared to the regular Venue."
            },
            {
                question: "Does it have a sunroof?",
                answer: "Yes, the Venue N Line comes with a smart electric sunroof."
            },
            {
                question: "Is it faster than the normal Venue?",
                answer: "The engine is the same 1.0L Turbo, but the handling and braking are improved for a faster real-world driving feel."
            },
            {
                question: "What safety features does it get?",
                answer: "It gets 6 airbags, ESC, a dashcam with dual cameras, and disc brakes on all 4 wheels."
            },
            {
                question: "Does it have Apple CarPlay?",
                answer: "Yes, it features wireless Android Auto and Apple CarPlay on a large infotainment screen."
            }
        ] as any;

        await venueNLine.save();
        console.log('Successfully updated Hyundai Venue N Line model data.');

    } catch (error) {
        console.error('Error updating Venue N Line:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateVenueNLine();
