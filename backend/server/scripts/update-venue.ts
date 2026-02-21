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

async function updateVenue() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const venue = await Model.findOne({ id: 'model-brand-hyundai-venue-1' });

        if (!venue) {
            console.error('Hyundai Venue model not found (id: model-brand-hyundai-venue).');
            return;
        }

        console.log(`Found Venue model: ${venue.name}`);

        // Update fields with Simple English content from VENUE_DATA_PREVIEW

        venue.headerSeo = `The new Hyundai Venue 2025 is a compact SUV that packs a punch with its bold design and smart technology. It features advanced safety with standard 6 airbags and Level 2 ADAS for smarter driving. You can choose from three efficient engine options including a turbo petrol and diesel, making it perfect for both city traffic and weekend getaways. With 60+ connected features and a premium cabin, the Venue stands out in its class.`;

        venue.summary = `The Hyundai Venue is a stylish compact SUV known for its bold looks and tech-loaded cabin. It offers a sunroof, power driver seat, and a large infotainment screen. With multiple engine and gearbox choices, it provides a smooth and fun driving experience for small families.`;

        venue.description = `The Hyundai Venue 2025 is built to excite with its sporty design and modern interior. Inside, you get a comfortable space with a 2-step reclining rear seat and sleek ambient lighting. It features a digital cluster, Alexa connectivity, and a high-quality Bose sound system. Whether driving in the city or on the highway, the Venue offers great control and safety with its solid build and smart features.`;

        venue.pros = `Tech-Loaded: Features a dashcam, power driver seat, and 60+ Bluelink connected features.
Advanced Safety: Level 2 ADAS with 16 safety features and standard 6 airbags.
Engine Variety: Offers petrol, turbo-petrol, and diesel engines with manual and automatic options.
Compact & Agile: Easy to drive in the city with great visibility and handling.`;

        venue.cons = `Rear Space: The rear seat space is good for two but can be tight for three adults.
Ride Quality: The suspension can feel a bit stiff on bad roads compared to some rivals.
Price: Top variants can get expensive for the compact SUV segment.`;

        venue.exteriorDesign = `The Venue has a bold dark chrome grille and split LED headlights that give it a tough SUV look. The connecting tail lamps at the back make it look smart and modern. The roof rails and sporty alloy wheels add to its strong road presence.`;

        venue.comfortConvenience = `The cabin feels premium with a dual-tone finish and high-quality materials. The driver gets a powered seat for finding the perfect position. The rear seats can recline for better comfort on long journeys. It also has a cooled glovebox, wireless charger, and paddle shifters for a sporty drive.`;

        // Engine Summaries (Updated: PS -> BHP)
        venue.engineSummaries = [
            {
                title: 'Kappa 1.2 MPi Petrol',
                summary: 'Smooth and quiet engine, best for daily city driving.',
                transmission: '5-Speed MT',
                power: '82 BHP @ 6000 rpm',  // 83 PS approx 81.8 BHP
                torque: '114 Nm @ 4000 rpm',
                speed: '~165 kmph'
            },
            {
                title: 'Kappa 1.0 Turbo GDi',
                summary: 'Powerful and sporty engine for those who love to drive fast.',
                transmission: '6-MT / 7-DCT',
                power: '118 BHP @ 6000 rpm', // 120 PS approx 118.3 BHP
                torque: '172 Nm @ 1500-4000 rpm',
                speed: '~185 kmph'
            },
            {
                title: 'U2 1.5 CRDi Diesel',
                summary: 'Strong diesel engine with good mileage, now available with automatic convenience.',
                transmission: '6-MT / Automatic',
                power: '114 BHP @ 4000 rpm', // 116 PS approx 114.4 BHP
                torque: '250 Nm @ 1500-2750 rpm',
                speed: '~180 kmph'
            }
        ] as any;

        // Added FAQs
        venue.faqs = [
            {
                question: "Does the Hyundai Venue have a sunroof?",
                answer: "Yes, the Hyundai Venue features a smart electric sunroof available in the higher variants."
            },
            {
                question: "Is the diesel automatic available in Venue?",
                answer: "Yes, the new Hyundai Venue now offers an automatic transmission option with its 1.5L CRDi diesel engine."
            },
            {
                question: "What is the mileage of the Hyundai Venue?",
                answer: "The Venue delivers a mileage of approx. 17 kmpl to 18 kmpl for petrol variants and up to 21 kmpl for diesel variants."
            },
            {
                question: "Is the Hyundai Venue safe?",
                answer: "Absolutely. It comes with standard 6 airbags, ESC, and Level 2 ADAS features like Forward Collision Warning and Lane Keep Assist."
            },
            {
                question: "Does it have ventilated seats?",
                answer: "Yes, the Hyundai Venue is equipped with a 4-way powered driver seat and front ventilated seats for added comfort."
            }
        ] as any;

        await venue.save();
        console.log('Successfully updated Hyundai Venue model data with BHP and FAQs.');

    } catch (error) {
        console.error('Error updating Venue:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateVenue();
