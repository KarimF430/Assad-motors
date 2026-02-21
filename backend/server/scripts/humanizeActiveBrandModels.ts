/**
 * Humanize Models - ONLY for 14 Active Brands
 * 
 * Filters models to only include those from active brands
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';
import { Model, Brand } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const groqApiKey = process.env.GROQ_API_KEY || '';
if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY not found');
    process.exit(1);
}
const groq = new Groq({ apiKey: groqApiKey });

async function humanizeText(text: string, fieldType: string, carName: string): Promise<string> {
    if (!text || text.trim().length < 30) return text;

    const prompts: Record<string, string> = {
        headerSeo: `Rewrite this car meta description to sound human (150-200 chars). Make it conversational. Car: ${carName}`,
        summary: `Rewrite this car summary like a car enthusiast explaining to a friend. Remove marketing fluff. Car: ${carName}`,
        description: `Rewrite this description naturally, like a car reviewer talking casually. Car: ${carName}`,
        pros: `Rewrite these car pros to sound real and honest, not like marketing. Car: ${carName}`,
        cons: `Rewrite these car cons to sound balanced and fair. Car: ${carName}`,
        exteriorDesign: `Rewrite this exterior description conversationally. Car: ${carName}`,
        comfortConvenience: `Rewrite this interior description naturally. Car: ${carName}`
    };

    const fullPrompt = `${prompts[fieldType] || `Rewrite naturally for ${carName}`}

RULES:
1. Sound human, NOT like AI/marketing
2. Use contractions (it's, you'll)
3. Vary sentence lengths
4. NO "Here's the thing" or "Worth noting"
5. Keep similar length
6. Preserve specs/facts
7. No emojis

ORIGINAL:
${text}

REWRITTEN:`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: fullPrompt }],
            max_tokens: 600,
            temperature: 0.75
        });

        const result = completion.choices[0]?.message?.content?.trim();
        if (result && result.length > 30 && result.length < text.length * 2.5) {
            return result;
        }
        return text;
    } catch (error: any) {
        console.error(`  Groq error: ${error.message}`);
        return text;
    }
}

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) process.exit(1);

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    // Get active brand IDs first
    const activeBrands = await Brand.find({ status: 'active' }).select('id name').lean();
    const activeBrandIds = activeBrands.map(b => b.id);
    const brandNames = activeBrands.map(b => b.name);

    console.log(`📊 Active brands (${activeBrands.length}): ${brandNames.join(', ')}\n`);

    // Fetch models ONLY from active brands
    const models = await Model.find({
        status: 'active',
        brandId: { $in: activeBrandIds }
    })
        .select('id name brand brandId headerSeo summary description pros cons exteriorDesign comfortConvenience')
        .lean();

    console.log(`🚗 Found ${models.length} models from active brands\n`);
    console.log('='.repeat(60));

    const fields = ['headerSeo', 'summary', 'description', 'pros', 'cons', 'exteriorDesign', 'comfortConvenience'];
    let totalUpdates = 0;

    for (const model of models) {
        console.log(`\n🚗 ${model.brand || ''} ${model.name}`);
        console.log('-'.repeat(40));

        const updates: Record<string, string> = {};

        for (const field of fields) {
            const original = (model as any)[field];
            if (!original || original.length < 30) continue;

            console.log(`  📝 ${field}...`);
            await new Promise(r => setTimeout(r, 1200)); // Rate limit

            const humanized = await humanizeText(original, field, `${model.brand || ''} ${model.name}`);

            if (humanized !== original) {
                updates[field] = humanized;
                console.log(`    ✨ Done`);
            } else {
                console.log(`    ⏭️  Unchanged`);
            }
        }

        if (Object.keys(updates).length > 0) {
            await Model.updateOne({ _id: model._id }, { $set: updates });
            console.log(`  💾 Saved ${Object.keys(updates).length} field(s)`);
            totalUpdates++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n🎉 Done! Updated ${totalUpdates}/${models.length} models`);

    await mongoose.disconnect();
    process.exit(0);
}

run().catch(console.error);
