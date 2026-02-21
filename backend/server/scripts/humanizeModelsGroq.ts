/**
 * Humanize Model Content using Groq API (FREE)
 * 
 * Rewrites: headerSeo, summary, description, pros, cons, exteriorDesign, comfortConvenience
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';
import { Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const groqApiKey = process.env.GROQ_API_KEY || '';
if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY not found');
    process.exit(1);
}
const groq = new Groq({ apiKey: groqApiKey });

/**
 * Humanize text using Groq
 */
async function humanizeText(text: string, fieldType: string, carName: string): Promise<string> {
    if (!text || text.trim().length < 30) return text;

    const prompts: Record<string, string> = {
        headerSeo: `Rewrite this car meta description to sound human and engaging (150-200 chars max). Make it conversational, not salesy. Car: ${carName}`,
        summary: `Rewrite this car summary to sound like a car enthusiast explaining to a friend. Keep facts, remove marketing fluff. Car: ${carName}`,
        description: `Rewrite this description naturally. Like a car reviewer talking casually. Keep all key points. Car: ${carName}`,
        pros: `Rewrite these car pros to sound real and honest, not like marketing. Keep them as bullet points but natural language. Car: ${carName}`,
        cons: `Rewrite these car cons to sound balanced and fair, like honest feedback. Car: ${carName}`,
        exteriorDesign: `Rewrite this exterior description conversationally. Like describing the car to someone who hasn't seen it. Car: ${carName}`,
        comfortConvenience: `Rewrite the interior/comfort description naturally. Focus on what actually matters to buyers. Car: ${carName}`
    };

    const basePrompt = prompts[fieldType] || `Rewrite this naturally for ${carName}`;

    const fullPrompt = `${basePrompt}

RULES:
1. Sound human, NOT like AI or marketing copy
2. Use contractions (it's, you'll, they're)
3. Vary sentence structure
4. No phrases like "Here's the thing" or "Worth noting"
5. Keep similar length (±30%)
6. Preserve key facts/specs
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

    // Fetch active models with text content
    const models = await Model.find({ status: 'active' })
        .select('id name brand headerSeo summary description pros cons exteriorDesign comfortConvenience')
        .lean();

    console.log(`📊 Found ${models.length} active models\n`);
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

            // Rate limiting - 1.5s between API calls
            await new Promise(r => setTimeout(r, 1500));

            const humanized = await humanizeText(original, field, model.name || 'this car');

            if (humanized !== original) {
                updates[field] = humanized;
                console.log(`    ✨ Humanized (${humanized.length} chars)`);
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
    console.log(`\n🎉 Done! Updated ${totalUpdates} models`);

    await mongoose.disconnect();
    process.exit(0);
}

run().catch(console.error);
