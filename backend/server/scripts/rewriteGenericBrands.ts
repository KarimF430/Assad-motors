/**
 * Rewrite Generic Brand Summaries
 * 
 * Many brands have the same generic placeholder text.
 * This script rewrites them with proper, unique content.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';
import { Brand } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const groqApiKey = process.env.GROQ_API_KEY || '';
if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY not found');
    process.exit(1);
}
const groq = new Groq({ apiKey: groqApiKey });

// Brands with generic placeholder text that need complete rewrite
const BRANDS_TO_REWRITE = [
    { name: 'Kia', context: 'Korean automaker, entered India in 2019 with Seltos. Known for Seltos, Sonet, Carens, EV6. Strong feature-loaded offerings, stylish design, good value.' },
    { name: 'Skoda', context: 'Czech brand (VW group), known for Kushaq, Slavia, Kodiaq. Build quality, driving dynamics, European engineering. Has been in India since 2001.' },
    { name: 'Renault', context: 'French automaker, popular for Kwid, Triber, Kiger. Budget-friendly, good mileage, compact cars. Strong presence in entry-level segment.' },
    { name: 'MG Motor', context: 'British heritage brand owned by SAIC (China). Known for Hector, Astor, ZS EV. Tech-loaded, premium features at competitive prices. Entered India 2019.' },
    { name: 'Volkswagen', context: 'German engineering, known for Polo (discontinued), Virtus, Taigun. Premium feel, solid build, driving experience. Smaller footprint than Skoda in India.' },
    { name: 'Citroen', context: 'French brand (PSA group), entered India 2021 with C5 Aircross. Known for comfort, unique design. Has C3, eC3, C3 Aircross. Quirky but comfortable.' },
    { name: 'Nissan', context: 'Japanese automaker, known for Magnite. Previously had Sunny, Terrano. Budget SUV focus, good value. Smaller dealer network than competitors.' },
    { name: 'Jeep', context: 'American brand (Stellantis), known for Compass, Meridian, Wrangler, Grand Cherokee. Off-road capability, rugged image, premium positioning.' },
    { name: 'Hyundai', context: 'Korean giant, second largest in India. Known for Creta, i20, Venue, Verna, Tucson. Feature-rich, modern design, good resale value. Chennai plant exports globally.' }
];

async function generateBrandSummary(brandName: string, context: string): Promise<string> {
    const prompt = `Write a 3-4 sentence summary about ${brandName} as a car brand in India. 

CONTEXT: ${context}

RULES:
1. Sound like a car enthusiast explaining to a friend, NOT like marketing copy
2. Mention 1-2 popular models
3. Mention what they're known for (strength)
4. Keep it conversational - use "they're", "you'll find", etc.
5. NO generic phrases like "innovative technology" or "customer satisfaction"
6. About 60-80 words total
7. No emojis or bullet points

Example tone: "Kia's only been in India since 2019, but they've made quite an impression. The Seltos basically took the mid-size SUV segment by storm, and the Sonet isn't far behind. What sets them apart? Loaded features at prices that undercut the competition. Their cars look sharp, drive well, and you get stuff like ventilated seats in variants where others wouldn't even think of offering them."

Now write for ${brandName}:`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
            temperature: 0.8
        });

        return completion.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
        console.error(`Groq error for ${brandName}:`, error);
        return '';
    }
}

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    for (const brandInfo of BRANDS_TO_REWRITE) {
        console.log(`\n🔄 Rewriting: ${brandInfo.name}`);
        console.log('-'.repeat(40));

        await new Promise(r => setTimeout(r, 1500)); // Rate limit

        const newSummary = await generateBrandSummary(brandInfo.name, brandInfo.context);

        if (newSummary && newSummary.length > 50) {
            console.log('✨ New summary:', newSummary.substring(0, 150) + '...');

            await Brand.updateOne(
                { name: { $regex: new RegExp(`^${brandInfo.name}$`, 'i') } },
                { $set: { summary: newSummary } }
            );
            console.log('💾 Saved!');
        } else {
            console.log('⚠️ Generation failed, skipping');
        }
    }

    console.log('\n🎉 All brands rewritten!');
    await mongoose.disconnect();
    process.exit(0);
}

run().catch(console.error);
