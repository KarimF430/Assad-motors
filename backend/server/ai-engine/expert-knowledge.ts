/**
 * Expert Knowledge Graph for Claude-Like AI Reasoning
 * Contains structured knowledge that a 15-year car expert would have
 */

// ============================================
// HEAD-TO-HEAD COMPARISONS (What experts know)
// ============================================

export const HEAD_TO_HEAD: Record<string, {
    cars: [string, string];
    winner: { overall: string; resale: string; features: string; safety: string; value: string };
    insight: string;
    forWhom: { car1: string; car2: string };
    proTip: string;
}> = {
    // Compact SUV Wars
    "creta_seltos": {
        cars: ["Hyundai Creta", "Kia Seltos"],
        winner: { overall: "tie", resale: "creta", features: "seltos", safety: "tie", value: "tie" },
        insight: "Same platform, different personalities. Creta is the sensible elder sibling, Seltos is the flashy younger one.",
        forWhom: {
            car1: "Family-first buyers who value resale and service network",
            car2: "Tech enthusiasts who want the 'wow' factor"
        },
        proTip: "Creta's resale is ₹1-2L higher after 5 years. That's a free vacation."
    },
    "nexon_brezza": {
        cars: ["Tata Nexon", "Maruti Brezza"],
        winner: { overall: "nexon", resale: "brezza", features: "nexon", safety: "nexon", value: "nexon" },
        insight: "Nexon destroyed the 'Maruti is safest' myth. 5-star NCAP changed the game.",
        forWhom: {
            car1: "Safety-conscious families willing to accept lower resale",
            car2: "Those who prioritize service network and resale over everything"
        },
        proTip: "Nexon EV has the best range in segment. Consider if you have home charging."
    },
    "seltos_nexon": {
        cars: ["Kia Seltos", "Tata Nexon"],
        winner: { overall: "seltos", resale: "seltos", features: "seltos", safety: "nexon", value: "nexon" },
        insight: "Seltos is premium but pricey. Nexon gives 80% of features at 70% price.",
        forWhom: {
            car1: "Those who can stretch budget for premium experience",
            car2: "Value-seekers who won't compromise on safety"
        },
        proTip: "Seltos HTX+ is the sweet spot variant. Nexon XZ+ is its competition."
    },
    "creta_xuv300": {
        cars: ["Hyundai Creta", "Mahindra XUV300"],
        winner: { overall: "creta", resale: "creta", features: "creta", safety: "xuv300", value: "xuv300" },
        insight: "XUV300 punches above its weight in safety but Creta owns the segment.",
        forWhom: {
            car1: "Those who want the segment leader with proven track record",
            car2: "Budget buyers who want SUV feel with top safety"
        },
        proTip: "XUV300 has better diesel than Creta. Consider if you drive 20K+ km/year."
    },

    // Premium SUV Battle
    "xuv700_safari": {
        cars: ["Mahindra XUV700", "Tata Safari"],
        winner: { overall: "xuv700", resale: "xuv700", features: "xuv700", safety: "tie", value: "xuv700" },
        insight: "XUV700 came and ate Safari's lunch. Same-ish price, more features, ADAS.",
        forWhom: {
            car1: "Tech lovers who want ADAS and panoramic sunroof",
            car2: "Those who prefer Safari's classic SUV stance and cabin feel"
        },
        proTip: "XUV700 AX5 with ADAS is the smart buy. Skip AX7 unless you need roof rails."
    },
    "xuv700_harrier": {
        cars: ["Mahindra XUV700", "Tata Harrier"],
        winner: { overall: "xuv700", resale: "tie", features: "xuv700", safety: "tie", value: "xuv700" },
        insight: "Harrier looks meaner but XUV700 is smarter. Literally, it has ADAS.",
        forWhom: {
            car1: "Those who want the 'best in class' bragging rights",
            car2: "Those who prefer Harrier's aggressive design language"
        },
        proTip: "Both have same engine. XUV700 diesel tuned for more power."
    },
    "fortuner_gloster": {
        cars: ["Toyota Fortuner", "MG Gloster"],
        winner: { overall: "fortuner", resale: "fortuner", features: "gloster", safety: "gloster", value: "gloster" },
        insight: "Gloster gives you Fortuner-level space at ₹8L less. But Toyota resale is unbeatable.",
        forWhom: {
            car1: "Those buying for the badge and bullet-proof resale",
            car2: "Those who want more features for less money"
        },
        proTip: "Fortuner's resale after 5 years pays for a Swift. Think about that."
    },

    // Sedan Showdowns
    "city_verna": {
        cars: ["Honda City", "Hyundai Verna"],
        winner: { overall: "city", resale: "city", features: "verna", safety: "verna", value: "tie" },
        insight: "City is the Toyota of sedans - boring but brilliant. Verna is the looker.",
        forWhom: {
            car1: "Those who want refinement and long-term reliability",
            car2: "Those who want a head-turner with more features"
        },
        proTip: "City hybrid exists. 26 kmpl real-world. Best kept secret in the market."
    },
    "ciaz_verna": {
        cars: ["Maruti Ciaz", "Hyundai Verna"],
        winner: { overall: "verna", resale: "ciaz", features: "verna", safety: "verna", value: "ciaz" },
        insight: "Ciaz is for sensible dads. Verna is for those who want some flair.",
        forWhom: {
            car1: "Budget-conscious buyers who prioritize space and mileage",
            car2: "Those willing to pay more for looks and features"
        },
        proTip: "Ciaz CNG is the best taxi/daily driver combo. Commercial viability."
    },

    // Hatchback Battles
    "swift_altroz": {
        cars: ["Maruti Swift", "Tata Altroz"],
        winner: { overall: "swift", resale: "swift", features: "altroz", safety: "altroz", value: "tie" },
        insight: "Swift is the crowd favorite but Altroz is catching up with 5-star safety.",
        forWhom: {
            car1: "Those who want proven reliability and fun driving",
            car2: "Safety-first buyers who want premium hatch feel"
        },
        proTip: "Swift resale is almost like gold. Altroz safety is almost like a bigger car."
    },
    "i20_altroz": {
        cars: ["Hyundai i20", "Tata Altroz"],
        winner: { overall: "i20", resale: "i20", features: "i20", safety: "altroz", value: "altroz" },
        insight: "i20 is the feature king. Altroz is the safety king. Pick your priority.",
        forWhom: {
            car1: "Feature lovers who want premium hatchback experience",
            car2: "Those who prioritize safety over bells and whistles"
        },
        proTip: "i20 N-Line is hilariously fun. If you can stretch budget, try it."
    },
    "baleno_glanza": {
        cars: ["Maruti Baleno", "Toyota Glanza"],
        winner: { overall: "tie", resale: "baleno", features: "tie", safety: "tie", value: "glanza" },
        insight: "Same car, different badges. Glanza from Toyota dealer = better service.",
        forWhom: {
            car1: "Those who want Maruti service network",
            car2: "Those who prefer Toyota's ownership experience"
        },
        proTip: "Glanza gets Toyota's service reputation. Sometimes worth the ₹10K extra."
    }
};

// ============================================
// COMMON OBJECTIONS & EXPERT RESPONSES
// ============================================

export const OBJECTIONS: Record<string, {
    objection: string;
    response: string;
    data: string;
    alternative?: string;
}> = {
    "tata_service": {
        objection: "Tata service is bad",
        response: "This was true in 2018, but Tata has transformed. They now have 1200+ touchpoints and 98% parts availability. Customer satisfaction scores have improved 300% since 2020.",
        data: "1200+ service centers, 98% parts availability, 24/7 RSA",
        alternative: "If still worried, consider extended warranty. Costs ₹15K for 5 years of peace of mind."
    },
    "tata_resale": {
        objection: "Tata resale is bad",
        response: "Nexon resale is now 60-65% after 3 years - almost matching Hyundai. The safety reputation is driving demand for used Tatas.",
        data: "Nexon: 60-65% after 3 years, Harrier: 58-62%",
        alternative: "Buy Nexon in popular color (white/red) for best resale."
    },
    "maruti_safety": {
        objection: "Maruti cars are unsafe",
        response: "Valid concern for older models. But Maruti is adding 6 airbags to ALL new models by 2024. New Brezza and Grand Vitara have ESP standard.",
        data: "6 airbags becoming standard, HEARTECT platform on new models",
        alternative: "Wait for 2025 Swift facelift with improved safety. Or consider Baleno which already has 6 airbags."
    },
    "kia_service": {
        objection: "Kia is new, service will be a problem",
        response: "Kia has expanded to 300+ service centers in 4 years. Plus their 7-year warranty is industry-best - you literally don't need to worry for 7 years.",
        data: "300+ service centers, 7-year warranty, 24/7 RSA",
        alternative: "Their customer satisfaction scores are actually higher than most established brands."
    },
    "xuv700_waiting": {
        objection: "XUV700 has 6 month waiting",
        response: "True for AX7 diesel automatic. But AX5 petrol has 2-3 week delivery. Javelin color across variants has shortest wait.",
        data: "AX5 Petrol: 2-3 weeks, AX7 Diesel AT: 6 months, Javelin color: fastest",
        alternative: "Consider AX5 with ADAS option pack. You get key features without the wait."
    },
    "diesel_vs_petrol": {
        objection: "Should I buy diesel or petrol?",
        response: "Simple rule: If you drive less than 15,000 km/year, petrol wins. Diesel needs highway runs to stay healthy. City-only diesel = expensive repairs.",
        data: "Break-even: 15K km/year, Diesel maintenance: 20% higher",
        alternative: "For city use, consider CNG or mild-hybrid petrol. Best of both worlds."
    },
    "automatic_reliability": {
        objection: "Automatic cars are unreliable",
        response: "That was true for old AMTs. Modern CVT and torque converters are bulletproof. Toyota Glanza CVT has near-zero complaints. Hyundai DCT is also refined now.",
        data: "CVT: Most reliable, Torque Converter: Proven, DCT: Improved since 2022",
        alternative: "Avoid AMT if budget allows. CVT or proper automatic worth the extra ₹1L."
    },
    "sunroof_leak": {
        objection: "Sunroof will leak",
        response: "Modern sunroofs with proper drainage don't leak. Just clean the drainage channels once a year. I've seen more issues from people NOT using the sunroof than from using it.",
        data: "Leaks happen when drainage is blocked - maintenance issue, not design flaw",
        alternative: "If paranoid, skip sunroof. But you're missing out on Goa trip vibes."
    },
    "first_year_problems": {
        objection: "Never buy a car in its first year",
        response: "Partially valid. BUT modern cars are much better tested. XUV700 launched with minimal issues. Nexon facelift was flawless from day 1.",
        data: "First 6 months = most updates. After that, stable platform.",
        alternative: "Wait 3-6 months after launch if you can. Let early adopters find issues."
    },
    "ev_charging": {
        objection: "No charging infrastructure for EVs",
        response: "If you have home charging, you never need public chargers for daily use. 80% of EV owners charge at home. Range anxiety is mostly a myth.",
        data: "Average daily commute: 40km. EV range: 300km. You charge once a week at home.",
        alternative: "Tata/MG have best charging networks. Nexon EV MAX has 437km range."
    }
};

// ============================================
// PRO TIPS (Secret Expert Knowledge)
// ============================================

export const PRO_TIPS: Record<string, string[]> = {
    "negotiation": [
        "Best time to buy: March (year-end targets) and September (festive discounts)",
        "Monday morning = Worst time. Weekend = Salespeople are desperate.",
        "Ask for 'dead stock' cars. 2-3 month old inventory gets heavy discounts.",
        "Never negotiate on price first. Get accessories free, then negotiate.",
        "Threaten to walk away. Works 80% of the time."
    ],
    "insurance": [
        "NEVER take dealer insurance. It's 20-30% more expensive.",
        "Zero depreciation add-on is MUST for first 3 years.",
        "Compare on Policybazaar. Same IDV, different prices.",
        "Don't over-insure. IDV should be realistic market value."
    ],
    "waiting_hacks": [
        "Less popular colors = shorter wait. Sometimes 2 weeks vs 2 months.",
        "Base/mid variants often have shorter waits than top variants.",
        "Ask dealer for 'cancelled bookings'. Instant delivery sometimes.",
        "Book at multiple dealers. Cancel the slower ones."
    ],
    "test_drive": [
        "Always test drive in traffic. Empty roads tell you nothing.",
        "Test the back seat. That's where your family will be.",
        "Check boot with shopping bags. Sales pics are deceptive.",
        "Listen for rattles at 60+ kmph. New cars shouldn't rattle.",
        "Test drive the specific variant you're buying, not the top model."
    ],
    "ownership_costs": [
        "Service cost varies 2x between brands. Maruti cheapest, Kia priciest.",
        "Tyres are expensive. Budget ₹30-40K every 40,000 km.",
        "Extended warranty is worth it for Korean/Tata cars.",
        "Insurance drops ~15% each year. First year is painful."
    ],
    "resale_secrets": [
        "White/Silver cars resell 5-10% higher. Avoid unusual colors.",
        "Petrol > Diesel for resale in post-2020 cars (diesel bans)",
        "Manual > Automatic for resale (buyers fear auto repairs)",
        "Keep all service records. Missing records = ₹50K off value.",
        "Low mileage < 10K/year actually hurts resale (cars need running)"
    ]
};

// ============================================
// REGIONAL INTELLIGENCE
// ============================================

export const REGIONAL_ADVICE: Record<string, {
    traffic: string;
    fuel: string;
    recommendation: string;
    avoid: string;
    tip: string;
}> = {
    "mumbai": {
        traffic: "Stop-and-go traffic 80% of the time",
        fuel: "Petrol + CNG is king. Diesel doesn't make sense for most.",
        recommendation: "Automatic/CVT mandatory. Compact preferred. CNG if available.",
        avoid: "Large SUVs unless you have a driver. Parking is a nightmare.",
        tip: "WagonR/Celerio CNG is the ultimate Mumbai car. Fight me."
    },
    "delhi": {
        traffic: "Mix of highway and city. Metro + car combo works best.",
        fuel: "Petrol preferred. BS6 diesel OK for now but uncertain future.",
        recommendation: "Good AC is critical. Air purifier feature is actually useful.",
        avoid: "Diesel if unsure about 10/15 year policy changes.",
        tip: "NCR has strict pollution norms. Keep emission papers ready."
    },
    "bangalore": {
        traffic: "Unpredictable. Can be 2 hours for 20km.",
        fuel: "Petrol for city. Diesel if doing Chennai/Mysore trips often.",
        recommendation: "Ground clearance 180mm+ (speed breakers everywhere). Good sound system (you'll be stuck in traffic).",
        avoid: "Low cars suffer. Avoid if < 170mm ground clearance.",
        tip: "ORR commute? Consider car + metro hybrid lifestyle."
    },
    "chennai": {
        traffic: "Better than Bangalore but waterlogging is real.",
        fuel: "Petrol + CNG growing. Diesel still popular for outstation.",
        recommendation: "Good ground clearance (flooding). Rust protection important (sea air).",
        avoid: "Low sedans during monsoon can be risky.",
        tip: "Get underbody anti-rust coating. Sea air corrodes fast."
    },
    "pune": {
        traffic: "City traffic bad. Outskirts and Mumbai highway = excellent.",
        fuel: "Petrol for city dwellers. Diesel for Mumbai commuters.",
        recommendation: "Balanced car works. Something that handles both city and highway.",
        avoid: "Pure city cars if doing Mumbai trips often.",
        tip: "Expressway + city driving = diesel often makes sense here."
    },
    "hyderabad": {
        traffic: "ORR is excellent. Old city is chaos.",
        fuel: "Petrol preferred. CNG network growing.",
        recommendation: "SUV preferred (road conditions vary). Automatic for old city.",
        avoid: "Low ground clearance in old city area.",
        tip: "If living in Gachibowli/Hitech City area, you'll barely face traffic."
    },
    "tier2_tier3": {
        traffic: "Generally manageable. Highways matter more.",
        fuel: "Diesel makes more sense (longer distances).",
        recommendation: "Maruti/Tata preferred (service network). Sturdy build for road conditions.",
        avoid: "Premium brands with limited service network.",
        tip: "Check nearest authorized service center before buying. Should be < 50km."
    }
};

// ============================================
// COMPETITOR MAPPING
// ============================================

export const COMPETITORS: Record<string, string[]> = {
    "creta": ["seltos", "grand_vitara", "hyryder"],
    "seltos": ["creta", "grand_vitara", "hyryder"],
    "nexon": ["brezza", "venue", "sonet"],
    "brezza": ["nexon", "venue", "sonet"],
    "xuv700": ["safari", "harrier", "hector"],
    "safari": ["xuv700", "hector", "harrier"],
    "harrier": ["xuv700", "safari", "hector"],
    "swift": ["altroz", "i20", "baleno"],
    "altroz": ["swift", "i20", "baleno"],
    "i20": ["altroz", "swift", "baleno"],
    "city": ["verna", "ciaz", "virtus"],
    "verna": ["city", "ciaz", "slavia"],
    "fortuner": ["gloster", "endeavour"],
    "punch": ["magnite", "eiger", "fronx"],
    "magnite": ["punch", "fronx", "eiger"]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getHeadToHead(car1: string, car2: string): typeof HEAD_TO_HEAD[string] | null {
    const key1 = `${car1.toLowerCase()}_${car2.toLowerCase()}`;
    const key2 = `${car2.toLowerCase()}_${car1.toLowerCase()}`;
    return HEAD_TO_HEAD[key1] || HEAD_TO_HEAD[key2] || null;
}

export function getObjectionResponse(topic: string): typeof OBJECTIONS[string] | null {
    const key = Object.keys(OBJECTIONS).find(k =>
        topic.toLowerCase().includes(k.replace('_', ' '))
    );
    return key ? OBJECTIONS[key] : null;
}

export function getCompetitors(carName: string): string[] {
    const normalized = carName.toLowerCase().replace(/\s+/g, '_');
    return COMPETITORS[normalized] || [];
}

export function getRegionalAdvice(city: string): typeof REGIONAL_ADVICE[string] | null {
    const normalized = city.toLowerCase();
    return REGIONAL_ADVICE[normalized] || REGIONAL_ADVICE['tier2_tier3'];
}

export function getRandomProTip(category?: string): string {
    if (category && PRO_TIPS[category]) {
        const tips = PRO_TIPS[category];
        return tips[Math.floor(Math.random() * tips.length)];
    }
    // Random category
    const categories = Object.keys(PRO_TIPS);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const tips = PRO_TIPS[randomCategory];
    return tips[Math.floor(Math.random() * tips.length)];
}
