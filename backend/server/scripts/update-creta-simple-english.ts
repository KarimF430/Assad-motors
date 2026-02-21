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

async function updateCretaSimpleEnglish() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const creta = await Model.findOne({ id: 'model-brand-hyundai-creta' });

        if (!creta) {
            console.error('Hyundai Creta model not found.');
            return;
        }

        // Rewrite all text fields in Simple English

        // Header SEO: Simple, descriptive, >4 lines
        creta.headerSeo = `The new Hyundai Creta 2025 is a premium mid-size SUV that offers a perfect mix of style, comfort, and performance. It comes with a spacious cabin, high-quality interiors, and advanced safety features like 6 airbags and ADAS Level 2 protection. You can choose from powerful petrol and diesel engines paired with smooth automatic or manual transmissions, making it a great choice for both city driving and long highway trips. With its bold look and smart features, the Creta continues to be a favorite for Indian families.`;

        // Summary: Concise, accessible
        creta.summary = `The Hyundai Creta mid-size SUV looks premium with consistent quality. Its cabin is spacious and gets a huge list of features including blind-spot monitoring, 360-degree camera, and panoramic sunroof. It drives well whether one chooses the 1.5-litre petrol or diesel engine options, with smooth automatic and manual gearboxes.`;

        // Description: Slightly more detail, but simple
        creta.description = `The Hyundai Creta 2025 is designed to impress with its modern look and high-quality build. Inside, you get a roomy cabin with comfortable seats and plenty of space for five people. It features a dual-screen setup, premium Bose audio, and smart connectivity options. Whether you prefer a sporty drive or a relaxed commute, the Creta's reliable engine options and smooth wide range of gearboxes deliver a satisfying performance on every journey.`;

        // Pros: Clean bullet points, simple language
        creta.pros = `Feature-Packed: Comes with a panoramic sunroof, 360-degree camera, and ventilated front seats.
High Safety: Standard 6 airbags and advanced driver-assistance systems (ADAS) for extra protection.
Spacious Cabin: Ample legroom and headroom with premium materials inside the cabin.
Engine Variety: Offers petrol, diesel, and turbo-petrol engines with manual and automatic options.`;

        // Cons: Clean bullet points, simple language
        creta.cons = `High Price: The top variants with all the features can be quite expensive compared to base models.
Rear Seat Width: While comfortable, fitting three adults in the back might be a bit tight compared to some wider rivals.
Safety Rating: The new facelift model has not been crash-tested yet by Global NCAP.`;

        // Exterior Design
        creta.exteriorDesign = `The Creta features a bold front grille and stylish LED lights that give it a strong road presence. The connecting tail lamps and sporty alloy wheels add to its modern appeal. Its solid build and sharp lines make it look like a proper, muscular SUV that stands out on the road.`;

        // Comfort & Convenience
        creta.comfortConvenience = `Inside, the Creta is all about comfort with an 8-way power driver seat and a voice-enabled sunroof. The dual-zone AC keeps the cabin cool, while the Bose sound system provides great audio quality. It also has plenty of storage spaces, a cooled glovebox, and wireless charging for added convenience.`;

        await creta.save();
        console.log('Successfully updated Hyundai Creta text to Simple English.');

    } catch (error) {
        console.error('Error updating Creta:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateCretaSimpleEnglish();
