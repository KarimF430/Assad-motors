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

async function updateExter() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const exter = await Model.findOne({ id: 'model-brand-hyundai-exter' });

        if (!exter) {
            console.error('Hyundai Exter model not found (id: model-brand-hyundai-exter).');
            return;
        }

        console.log(`Found Exter model: ${exter.name}`);

        // Update fields with Simple English content from EXTER_DATA_PREVIEW

        exter.headerSeo = `The Hyundai Exter is a smart and spacious micro-SUV built for the city and beyond. It sets a new benchmark for safety with 6 airbags standard across all variants. With features like a voice-enabled sunroof and the innovative Hy-CNG Duo technology for better boot space, the Exter is perfect for small families looking for a stylish and practical ride.`;

        exter.summary = `The Exter is a tough-looking micro-SUV that offers big features in a small package. It comes with a sunroof, paddle shifters, and a factory-fitted CNG option that saves trunk space. With standard 6 airbags and Electronic Stability Control (ESC), it is one of the safest cars in its segment.`;

        exter.description = `The Hyundai Exter combines the look of a proper SUV with the ease of driving a small car. Inside, it feels open and airy with plenty of headroom and legroom. It is packed with tech like a digital dashboard, wireless charger, and cruise control. The Hy-CNG Duo version uses two small cylinders instead of one big one, giving you plenty of space for luggage while enjoying low running costs.`;

        exter.pros = `High Safety: Comes with 6 airbags standard on all models, plus ESC and Hill Assist.
CNG Boot Space: The dual-cylinder CNG design leaves usable space for luggage, unlike other CNG cars.
Feature Rich: Offers a sunroof, paddle shifters, dashcam, and wireless charger.
Easy to Drive: Compact size and light steering make it great for city traffic.`;

        exter.cons = `No Diesel: Only available in petrol and petrol-CNG options.
Engine Power: The 1.2L engine is good for the city but can feel a bit relaxed on open highways.
Rear Seat Width: Best suited for two adults and a child in the back seat.`;

        exter.exteriorDesign = `The Exter has a boxy and rugged design with H-shaped LED daytime running lights that make it instantly recognizable. It features sturdy skid plates and prominent wheel arches that give it a tough stance. The textured pillar finish and bridge-type roof rails add to its outdoor character.`;

        exter.comfortConvenience = `Step inside and you will find a cabin designed for comfort. The driver seat is height-adjustable, and the rear passengers get their own AC vents. It has a cooled glovebox for your drinks and a smart sunroof that opens with voice commands. The semi-leatherette seats add a premium touch to the interior.`;

        // Engine Summaries (BHP)
        exter.engineSummaries = [
            {
                title: '1.2 Kappa Petrol',
                summary: 'A refined 4-cylinder engine that offers a smooth and quiet drive.',
                transmission: '5-MT / AMT',
                power: '82 BHP @ 6000 rpm',
                torque: '114 Nm @ 4000 rpm',
                speed: '~160 kmph' // Approx top speed
            },
            {
                title: '1.2 Bi-Fuel CNG',
                summary: 'Economic CNG engine with dual-cylinder tech for better boot space.',
                transmission: '5-Speed Manual',
                power: '68 BHP @ 6000 rpm',
                torque: '95.2 Nm @ 4000 rpm',
                speed: '~150 kmph'
            }
        ];

        // FAQs
        exter.faqs = [
            {
                question: "What is special about the Exter CNG?",
                answer: "It uses 'Hy-CNG Duo' technology with two smaller cylinders tucked away, so you still get a good amount of boot space for your bags."
            },
            {
                question: "Is the Hyundai Exter safe?",
                answer: "Yes, it is very safe with 6 airbags standard across all variants, along with ESC and Hill Assist Control."
            },
            {
                question: "Does it have an automatic gear option?",
                answer: "Yes, the petrol version comes with a Smart Auto AMT which also has paddle shifters for better control."
            },
            {
                question: "How is the mileage?",
                answer: "The petrol version gives around 19 kmpl, while the CNG version delivers an impressive 27 km/kg."
            },
            {
                question: "What features does the top model get?",
                answer: "The top model gets a sunroof, dual-camera dashcam, wireless charger, and 15-inch diamond-cut alloy wheels."
            }
        ] as any;

        await exter.save();
        console.log('Successfully updated Hyundai Exter model data.');

    } catch (error) {
        console.error('Error updating Exter:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateExter();
