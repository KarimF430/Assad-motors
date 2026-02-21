
export interface ExpertReviewData {
    rating: number
    verdictTitle: string
    verdictSummary: string
    pros: string[]
    cons: string[]
    author: {
        name: string
        role: string
        image?: string
    }
}

// ------------------------------------------------------------------
// VOCABULARY BANKS: "Human-like" Variety
// ------------------------------------------------------------------
const VOCAB = {
    openers: [
        "makes a compelling case", "enters the fray", "stands out", "aims to redefine",
        "presents itself as", "arrives with promise", "competes aggressively",
        "make a strong statement", "is a refreshing addition"
    ],
    performance_good: [
        "spirited", "punchy", "eager", "responsive", "athletic", "dynamic",
        "confidence-inspiring", "robust", "lively", "enthusiastic"
    ],
    performance_bad: [
        "leisurely", "relaxed", "adequate", "sedate", "unhurried", "conservative",
        "utilitarian", "laid-back", "modest"
    ],
    efficiency_good: [
        "stellar", "impressive", "wallet-friendly", "exceptional", "class-leading",
        "frugal", "remarkably efficient", "budget-conscious"
    ],
    efficiency_bad: [
        "acceptable", "decent", "average", "standard", "expected", "typical for this segment",
        "nothing to write home about"
    ],
    verdict_positive: [
        "a no-brainer", "a top pick", "hard to ignore", "a segment leader",
        "a complete package", "a formidable contender", "hard to beat"
    ],
    verdict_balanced: [
        "a sensible market choice", "a well-rounded offering", "a practical decision",
        "worth a test drive", "a strong alternative", "a balanced proposition"
    ],
    verdict_mixed: [
        "an interesting option", "a decent alternative", "worth a look", "a safe bet"
    ]
}

const AUTHORS: { name: string; role: string; image?: string }[] = [
    { name: 'Aditya Rao', role: 'Senior Editor' },
    { name: 'Sidharth K.', role: 'Road Test Editor' },
    { name: 'Vikrant Singh', role: 'Automotive Expert' },
    { name: 'Rahul Ghosh', role: 'Reviews Desk' },
    { name: 'Ameya Dandekar', role: 'Chief Editor' }
]

// ------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------

// Pseudo-random number generator using string seed (to ensure same car gets same review)
function getSeededRandom(seed: string): number {
    let hash = 0;
    if (seed.length === 0) return 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

function pick<T>(array: T[], seed: string): T {
    const index = Math.floor(getSeededRandom(seed) * array.length);
    return array[index];
}

function camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

// ------------------------------------------------------------------
// MAIN GENERATION LOGIC
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// MAIN GENERATION LOGIC
// ------------------------------------------------------------------
export function generateExpertReview(model: any, variants: any[] = []): ExpertReviewData {
    // 1. Data Normalization & Extraction
    const name = model.name || 'Car';
    const brand = model.brand || 'Brand';
    const fullName = `${brand} ${name}`;

    // Price Logic (Range vs Single)
    const basePrice = model.startingPrice || 0;
    const topPrice = model.endingPrice || 0;
    const priceLakhsMin = basePrice / 100000;
    const priceLakhsMax = topPrice / 100000;

    // Helper to extract first number (int or float)
    const extractNumber = (str: string): number => {
        if (!str) return 0;
        const match = str.toString().match(/(\d+(\.\d+)?)/);
        return match ? parseFloat(match[0]) : 0;
    };

    // Specs extraction - Smart Fallback for Models
    let powerStr = (model.keySpecs?.power || model.power || '0').toString();
    let torqueStr = (model.keySpecs?.torque || model.torque || '0').toString();

    // If we have variants (Model Page), find the BEST specs to represent potential
    let isModelReview = variants && variants.length > 0;
    let maxBHP = 0;
    let maxTorque = 0;
    let maxMileage = 0;

    if (isModelReview) {
        variants.forEach(v => {
            const p = extractNumber(v.power || v.maxPower || '0');
            const t = extractNumber(v.torque || v.maxTorque || '0');
            const m = extractNumber(v.mileage || v.claimedMileage || v.fuelEfficiency || '0');
            if (p > maxBHP) maxBHP = p;
            if (t > maxTorque) maxTorque = t;
            if (m > maxMileage) maxMileage = m;
        });
        // Fallback if extraction failed
        if (maxBHP === 0) maxBHP = extractNumber(powerStr);
        if (maxTorque === 0) maxTorque = extractNumber(torqueStr);
    } else {
        maxBHP = extractNumber(powerStr);
        maxTorque = extractNumber(torqueStr);
    }

    const mileageStr = (model.mileage?.[0]?.value || model.mileage || '0').toString();
    // If we found a better mileage in variants, use that. Otherwise fallback to model.mileage
    const efficiency = maxMileage > 0 ? maxMileage : extractNumber(mileageStr);
    const engineStr = (model.keySpecs?.engine || model.engineName || model.engine || 'Engine').toString();
    const transStr = (model.transmission || 'Manual').toString();
    const safetyStr = (model.keySpecs?.safetyRating || model.rating || '0').toString();

    // Body Type Logic
    const rawBodyType = (model.bodyType || 'Car').toLowerCase();
    let segment = 'market';
    if (rawBodyType.includes('suv')) segment = 'competitive SUV space';
    else if (rawBodyType.includes('sedan')) segment = 'sedan segment';
    else if (rawBodyType.includes('hatch')) segment = 'hatchback market';
    else if (rawBodyType.includes('mpv')) segment = 'MPV segment';
    else if (rawBodyType.includes('luxury')) segment = 'luxury tier';

    const fuelType = (model.fuelType || 'Petrol').toLowerCase();

    // Numeric conversions
    const bhp = Math.round(maxBHP); // Use MAX bhp for scoring
    const torque = Math.round(maxTorque);

    const safetyStars = Math.round(extractNumber(safetyStr));

    // Boolean Flags
    const isAutomatic = transStr.toLowerCase().includes('auto') || transStr.toLowerCase().includes('cvt') || transStr.toLowerCase().includes('dct') || (variants.some(v => (v.transmission || '').toLowerCase().includes('auto')));
    const isEV = fuelType.includes('electric') || name.toLowerCase().includes('ev');
    const isDiesel = fuelType.includes('diesel') || (variants.some(v => (v.fuel || '').toLowerCase().includes('diesel')));
    const isHybrid = fuelType.includes('hybrid');
    const isTurbo = engineStr.toLowerCase().includes('turbo') || engineStr.toLowerCase().includes('tgdi') || (variants.some(v => (v.name || '').toLowerCase().includes('turbo')));

    // Seed for deterministic variety
    const seed = fullName + priceLakhsMin;

    // ----------------------------------------------------------------
    // 2. Intelligent Scoring Logic (0-10 Scale)
    // ----------------------------------------------------------------
    let score = 7.0; // Market Standard Start

    if (isEV) {
        if (bhp > 200) score += 1.5;
        else if (bhp > 130) score += 1.0;
        else if (bhp > 90) score += 0.5;
        else if (bhp < 60) score -= 0.5;
    } else {
        if (bhp > 180) score += 1.5;
        else if (bhp > 140) score += 1.0;
        else if (bhp > 110) score += 0.5;
        else if (bhp < 75 && rawBodyType.includes('suv')) score -= 1.0;
        else if (bhp < 65) score -= 0.5;
    }

    // -- Efficiency Impact (or Range for EV) --
    if (isEV) {
        if (efficiency > 450) score += 1.5;
        else if (efficiency > 350) score += 1.0;
        else if (efficiency < 200) score -= 1.0;
    } else {
        if (efficiency > 23) score += 1.5;
        else if (efficiency > 19) score += 1.0;
        else if (efficiency > 16) score += 0.5;
        else if (efficiency < 10) score -= 1.0;
    }

    // -- Safety Impact --
    if (safetyStars === 5) score += 1.0;
    else if (safetyStars === 4) score += 0.5;
    else if (safetyStars > 0 && safetyStars < 3) score -= 1.0;

    // -- Value & Features Context --
    if (isAutomatic && priceLakhsMin < 10) score += 0.5;
    if (isTurbo && priceLakhsMin < 12) score += 0.5;
    if (priceLakhsMin > 25 && safetyStars < 4 && safetyStars > 0) score -= 0.5;

    // -- Final Cap & Rounding --
    score = Math.min(Math.max(score, 5.0), 9.4);
    const finalScore = Math.round(score * 10) / 10;

    // ----------------------------------------------------------------
    // 3. Dynamic Text Block Generation
    // ----------------------------------------------------------------
    const paragraphs: string[] = [];

    // -- BLOCK 1: Introduction --
    const introOpener = pick(VOCAB.openers, seed + "intro");

    let introText = `The **${fullName}** ${introOpener} in the ${segment}. `

    if (priceLakhsMin > 0 && priceLakhsMax > priceLakhsMin) {
        introText += `Priced between **₹${priceLakhsMin.toFixed(2)} - ₹${priceLakhsMax.toFixed(2)} Lakhs**, `
    } else if (priceLakhsMin > 0) {
        introText += `Priced at **₹${priceLakhsMin.toFixed(2)} Lakhs**, `
    } else {
        introText += `Priced competitively, `
    }

    if (finalScore > 8.5) {
        introText += `it targets buyers looking for a premium, no-compromise experience that sets new benchmarks.`
    } else if (finalScore > 7.5) {
        introText += `it strikes a fine balance between value, performance, and everyday practicality.`
    } else {
        introText += `it aims to offer a functional and budget-friendly solution for the mass market.`
    }
    paragraphs.push(introText);

    // -- BLOCK 2: Performance & Drive (RANGE AWARE) --
    const perfAdj = bhp > 115 ? pick(VOCAB.performance_good, seed + "perf") : pick(VOCAB.performance_bad, seed + "perf");

    let engineDesc = "";
    if (isEV) {
        engineDesc = `Powered by an electric motor producing up to **${bhp} BHP**, the ${name} offers instant torque delivery.`
    } else {
        if (isModelReview) {
            engineDesc = `Under the hood, the ${name} offers powertrain options delivering up to **${bhp} BHP** and **${torque} Nm** of peak torque.`
        } else {
            engineDesc = `Under the hood lies the **${engineStr}**, delivering **${bhp} BHP** and **${torque} Nm** of torque.`
        }
    }

    let driveFeel = "";
    if (bhp > 140) {
        driveFeel = `This setup feels **${perfAdj}**, making highway overtakes effortless and city driving genuinely fun.`
    } else if (bhp > 95) {
        driveFeel = `The performance is **${perfAdj}** for city commutes, though it settles into a comfortable rhythm on the highway.`
    } else {
        driveFeel = `While the engine performance is **${perfAdj}**, it is tuned for efficiency rather than outright speed, requiring some planning for quick overtakes.`
    }

    let transComment = "";
    if (isAutomatic && !isEV) {
        transComment = ` Available with automatic transmission, the driving experience is hassle-free in traffic.`
    }

    paragraphs.push(`**Performance:** ${engineDesc} ${driveFeel}${transComment}`);

    // -- BLOCK 3: Efficiency & Economy --
    const effAdj = (efficiency > 18 || (isEV && efficiency > 350)) ? pick(VOCAB.efficiency_good, seed + "eff") : pick(VOCAB.efficiency_bad, seed + "eff");
    const effMetric = isEV ? "driving range" : "mileage";
    const effUnit = isEV ? "km on full charge" : "kmpl";

    let effText = `**${isEV ? 'Range' : 'Efficiency'}:** For the cost-conscious buyer, the stats are ${effAdj}. With a claimed ${effMetric} of **${efficiency} ${effUnit}**, `;

    if (efficiency > 18 || (isEV && efficiency > 400)) {
        effText += `it promises to be one of the most wallet-friendly options in its class.`;
    } else {
        effText += `it remains practical for daily usage without breaking the bank.`;
    }
    paragraphs.push(effText);

    // -- BLOCK 4: Safety & Verdict --
    if (safetyStars > 0) {
        const safeAdj = safetyStars >= 4 ? "reassuring" : "standard";
        paragraphs.push(`**Safety:** Security is ${safeAdj} with a **${safetyStars}-Star Global NCAP** rating, ensuring peace of mind for you and your family.`);
    }

    const verdictTone = finalScore > 8 ? pick(VOCAB.verdict_positive, seed + "verdict") :
        finalScore > 7 ? pick(VOCAB.verdict_balanced, seed + "verdict") :
            pick(VOCAB.verdict_mixed, seed + "verdict");

    let verdictSummary = `\n\n**Verdict:** Scoring a solid **${finalScore}/10**, the ${name} is ${verdictTone}. `;

    if (finalScore > 8.5) verdictSummary += "It sets a new benchmark in its class and is highly recommended.";
    else if (finalScore > 7.5) verdictSummary += "It checks all the right boxes for the modern family buyer.";
    else verdictSummary += "It faces stiff competition but holds its own with specific value-focused strengths.";

    paragraphs.push(verdictSummary);


    // ----------------------------------------------------------------
    // 4. Generate Pros & Cons
    // ----------------------------------------------------------------
    const forcedPros: string[] = [];
    const forcedCons: string[] = [];

    // Pros Logic
    if (bhp > 130) forcedPros.push("Strong Performance Options");
    else if (isTurbo) forcedPros.push("Punchy Turbo Variants Available");

    if (efficiency > 20) forcedPros.push("Excellent Mileage");
    if (safetyStars >= 4) forcedPros.push(`High Safety Rating (${safetyStars}-Star)`);
    if (isAutomatic && priceLakhsMin < 10) forcedPros.push("Affordable Automatic Option");
    if (isEV && efficiency > 400) forcedPros.push("Great Driving Range");
    if (torque > 250) forcedPros.push("Great Low-end Torque");
    if (priceLakhsMin < 7) forcedPros.push("Budget Friendly Entry Price");

    // Cons Logic
    if (priceLakhsMin > 20 && !isAutomatic) forcedCons.push("Missing Automatic at this price");
    if (efficiency < 12 && !isEV) forcedCons.push("Low Fuel Economy");
    if (bhp < 75 && !isEV && rawBodyType.includes('suv')) forcedCons.push("Base engine feels underpowered");
    if (safetyStars > 0 && safetyStars < 3) forcedCons.push("Mediocre Safety Rating");
    if (priceLakhsMin > 15 && !model.sunroof) forcedCons.push("Missing Sunroof");

    // Fallbacks
    if (forcedPros.length === 0) forcedPros.push("Value for money", "Comfortable Ride", "Decent Feature List");
    if (forcedCons.length === 0) forcedCons.push("Subjective Styling", "Firm ride quality on bad roads");

    // Deduplicate strings just in case
    const uniquePros = Array.from(new Set(forcedPros));
    const uniqueCons = Array.from(new Set(forcedCons));

    // Author Rotation
    const authorIndex = Math.floor(getSeededRandom(seed + "author") * AUTHORS.length);

    return {
        rating: finalScore,
        verdictTitle: finalScore > 8 ? "Highly Recommended" : (finalScore > 7 ? "Great Choice" : "Worthy Contender"),
        verdictSummary: paragraphs.join(" "),
        pros: uniquePros,
        cons: uniqueCons,
        author: {
            name: AUTHORS[authorIndex].name,
            role: AUTHORS[authorIndex].role,
            image: AUTHORS[authorIndex].image || ''
        }
    }
}
