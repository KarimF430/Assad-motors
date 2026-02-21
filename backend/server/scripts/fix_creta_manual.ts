
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Model } from '../db/schemas';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);
    await mongoose.connect(uri);

    const model = await Model.findOne({ name: { $regex: /Creta/i } });

    if (!model) {
        console.log('❌ Creta model not found!');
        process.exit(1);
    }

    const humanText = `Take a look at the updated 2025 Hyundai Creta facelift. It's widely considered a top choice in the mid-size SUV segment across India. Featuring Hyundai's 'Sensuous Sportiness' design style, the new Creta mixes a bold exterior with a modern, well-finished interior.

Worth noting: it includes 6 airbags as standard and the recent Level 2 ADAS suite with 19 safety features. You also get dual 10.25-inch screens, a voice-enabled smart panoramic sunroof, and a Bose sound system.

Choosing the right drive is simpler now with three engine options: the refined 1.5L MPi Petrol, the reliable 1.5L Diesel, and the punchy 1.5L Turbo Petrol. Available with multiple transmission choices like DCT, IVT, and AT, the Creta balances performance and efficiency really well. Check out the price list and specs to see why the Creta 2025 is such a strong option for families.`;

    await Model.updateOne({ _id: model._id }, { $set: { headerSeo: humanText } });

    console.log('\n✅ Manually updated Creta SEO Header to high-quality human text.');
    console.log('----------------------------------------');
    console.log(humanText);

    process.exit(0);
}

run();
