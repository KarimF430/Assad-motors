/**
 * Humanize Brand Summaries using Groq API (FREE)
 * 
 * Uses the existing Groq API key configured in the project to
 * rewrite AI-generated content in a natural, human tone.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';
import { Brand } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize Groq
const groqApiKey = process.env.GROQ_API_KEY || process.env.HF_API_KEY || '';
if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY not found in environment!');
    process.exit(1);
}
const groq = new Groq({ apiKey: groqApiKey });

/**
 * Humanize text using Groq's Llama model
 */
async function humanizeText(originalText: string, context: string): Promise<string> {
    if (!originalText || originalText.trim().length < 20) {
        return originalText;
    }

    const prompt = `You are a professional automotive copywriter. Rewrite the following car brand description to sound 100% human-written.

RULES:
1. Keep it natural, conversational, not robotic or AI-sounding
2. Use simple words, avoid marketing jargon like "cutting-edge", "unparalleled", "state-of-the-art"
3. Add subtle personality - like a friend who knows cars explaining to you
4. Keep the key facts but make them flow naturally
5. Use contractions (it's, they're, don't) 
6. Vary sentence lengths - mix short punchy sentences with longer ones
7. Don't use phrases like "Here's the thing" or "Worth noting" - those are AI tells
8. Keep similar word count (±20%)
9. Maintain SEO value - keep brand name and key model mentions
10. NO emojis, NO bullet points - just natural prose

CONTEXT: ${context}

ORIGINAL TEXT:
${originalText}

REWRITTEN (human-sounding version):`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
            temperature: 0.8 // Higher temp for more creative/human variation
        });

        const result = completion.choices[0]?.message?.content?.trim();

        // Basic validation - ensure result is reasonable
        if (result && result.length > 50 && result.length < originalText.length * 2) {
            return result;
        }
        return originalText;
    } catch (error) {
        console.error('Groq API error:', error);
        return originalText;
    }
}

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found');
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    // Fetch all active brands
    const brands = await Brand.find({ status: 'active' }).lean();
    console.log(`📊 Found ${brands.length} active brands\n`);
    console.log('='.repeat(60));

    let updated = 0;
    let skipped = 0;

    for (const brand of brands) {
        console.log(`\n🔄 Processing: ${brand.name}`);
        console.log('-'.repeat(40));

        if (!brand.summary || brand.summary.length < 50) {
            console.log('⏭️  Skipped (no summary or too short)');
            skipped++;
            continue;
        }

        console.log('📝 Original:', brand.summary.substring(0, 100) + '...');

        // Add a small delay to respect rate limits
        await new Promise(r => setTimeout(r, 1000));

        const humanized = await humanizeText(
            brand.summary,
            `This is about ${brand.name}, an automotive brand in India`
        );

        if (humanized !== brand.summary) {
            console.log('✨ Humanized:', humanized.substring(0, 100) + '...');

            // Update in database
            await Brand.updateOne(
                { _id: brand._id },
                { $set: { summary: humanized } }
            );
            console.log('💾 Saved to database');
            updated++;
        } else {
            console.log('⏭️  No change needed');
            skipped++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n🎉 DONE! Updated: ${updated}, Skipped: ${skipped}`);

    await mongoose.disconnect();
    process.exit(0);
}

run().catch(error => {
    console.error('❌ Script error:', error);
    process.exit(1);
});
