/**
 * Content Humanizer Utility
 * 
 * Transforms AI-generated content to sound more natural and neutral.
 * - Removes overly positive/promotional language
 * - Adds human-like variations (contractions, casual phrases)
 * - Maintains SEO value while improving readability
 */

// Overly positive words/phrases to neutralize
const POSITIVE_REPLACEMENTS: Record<string, string[]> = {
    // General Positive Words
    'exceptional': ['solid', 'notable', 'strong'],
    'outstanding': ['good', 'reliable', 'competent'],
    'remarkable': ['interesting', 'notable', 'worth noting'],
    'incredible': ['notable', 'significant'],
    'amazing': ['interesting', 'worth considering'],
    'stunning': ['attractive', 'good-looking'],
    'breathtaking': ['distinctive', 'eye-catching'],
    'magnificent': ['good', 'well-built', 'solid'],
    'extraordinary': ['notable', 'uncommon'],
    'phenomenal': ['strong', 'impressive'],
    'superb': ['very good', 'high-quality'],
    'excellent': ['good', 'solid'],
    'perfect': ['well-suited', 'appropriate'],
    'flawless': ['clean', 'well-done', 'solid'],
    'unparalleled': ['unique', 'distinctive'],
    'unmatched': ['competitive', 'strong'],
    'world-class': ['competitive', 'high-standard'],
    'best-in-class': ['competitive', 'among the better options'],
    'top-notch': ['good', 'solid', 'decent'],
    'premium': ['high-quality', 'well-appointed'],
    'luxurious': ['comfortable', 'well-equipped'],
    'state-of-the-art': ['modern', 'current-gen'],
    'cutting-edge': ['modern', 'current', 'new'],
    'revolutionary': ['modern', 'updated'],
    'game-changing': ['significant', 'notable'],
    'incredibly': ['quite', 'fairly', 'reasonably'],
    'extremely': ['quite', 'fairly', 'pretty'],
    'absolutely': ['quite', 'definitely', 'certainly'],
    'truly': ['certainly', 'definitely'],
    'undoubtedly': ['likely', 'probably', 'generally'],
    'certainly': ['likely', 'probably', 'generally'],
    'definitely': ['likely', 'preferably'],
    'without a doubt': ['likely', 'probably'],
    'the best': ['a good option', 'among the better choices'],
    'market-leading': ['competitive', 'well-positioned'],
    'industry-leading': ['competitive', 'established'],
    'class-leading': ['competitive', 'among the better'],
    'segment-best': ['competitive', 'among the good options'],
    'pinnacle': ['top-tier', 'flagship', 'highlight'],
    'ultimate': ['comprehensive', 'top-level', 'flagship'],
    'legendary': ['well-known', 'established', 'classic'],
    'benchmark': ['standard', 'reference', 'leader'],
    'masterpiece': ['well-crafted', 'standout model'],
    'unrivaled': ['leading', 'top-tier'],

    // Aggressive Marketing Phrases (Specific Targets)
    'undisputed leader': ['popular option', 'strong seller', 'common choice'],
    'design philosophy': ['design style', 'look', 'aesthetics'],
    'commanding exterior': ['distinctive exterior', 'exterior look'],
    'futuristic': ['modern', 'new-age', 'current'],
    'uncompromised safety': ['standard safety features', 'safety equipment'],
    'loaded with': ['includes', 'has', 'features'],
    'segment-first': ['notable', 'new', 'modern'],
    'thrill-inducing': ['powerful', 'responsive', 'quick'],
    'experience': ['check out', 'note', 'see'],
    'discover': ['check out', 'look at', 'consider'],
    'redefined by': ['featuring', 'using', 'with'],
    'blends': ['mixes', 'combines', 'has'],
    'combines': ['mixes', 'has', 'features'],
    'epitome of': ['a good example of', 'known for'],
    'testament to': ['shows', 'indicates'],
    'set apart': ['distinguish', 'differentiate'],
    'dynamic': ['responsive', 'good'],
    'sculpted': ['shaped', 'designed'],
    'silhouette': ['shape', 'look'],
    'stance': ['look', 'appearance'],
    'all-new': ['new', 'latest'],
    'meticulously': ['carefully', 'well'],
    'crafted': ['made', 'built'],
};

// Formal phrases to make more casual
const CASUAL_REPLACEMENTS: Record<string, string[]> = {
    'Discover the': ['The', 'Take a look at the'],
    'Experience the': ['The', 'Check out the'],
    'Introducing the': ['The', 'Here is the'],
    'Welcome to': ['This is', 'Here is'],
    'Redefined by': ['With', 'Featuring'],
    'It is': ["It's", "It's"],
    'it is': ["it's", "it's"],
    'We are': ["We're", "We're"],
    'we are': ["we're", "we're"],
    'They are': ["They're", "They're"],
    'they are': ["they're", "they're"],
    'You will': ["You'll", "You'll"],
    'you will': ["you'll", "you'll"],
    'does not': ["doesn't", "doesn't"],
    'do not': ["don't", "don't"],
    'cannot': ["can't", "can't"],
    'will not': ["won't", "won't"],
    'should not': ["shouldn't", "shouldn't"],
    'would not': ["wouldn't", "wouldn't"],
    'could not': ["couldn't", "couldn't"],
    'is not': ["isn't", "isn't"],
    'are not': ["aren't", "aren't"],
    'Furthermore,': ['Also,', 'Plus,', 'On top of that,'],
    'Moreover,': ['Also,', 'What\'s more,', 'Plus,'],
    'Additionally,': ['Also,', 'On top of that,', 'Plus,'],
    'In conclusion,': ['Overall,', 'All things considered,', 'To sum up,'],
    'However,': ['That said,', 'But,', 'On the flip side,'],
    'Nevertheless,': ['Still,', 'Even so,', 'That said,'],
    'Consequently,': ['So,', 'As a result,', 'Because of this,'],
    'Subsequently,': ['Then,', 'After that,', 'Following this,'],
    'Notwithstanding,': ['Despite this,', 'Even so,', 'Still,'],
    'Henceforth,': ['From now on,', 'Going forward,'],
    'Thereafter,': ['After that,', 'Following this,'],
    'Heretofore,': ['Until now,', 'Before this,'],
    'In order to': ['To', 'For'],
    'Due to the fact that': ['Because', 'Since'],
    'For the purpose of': ['To', 'For'],
    'In the event that': ['If', 'When'],
    'At this point in time': ['Now', 'Currently'],
    'In the near future': ['Soon', 'Shortly'],
    'It should be noted that': ['Note that', 'Keep in mind,'],
    'It is important to note that': ['Worth noting,', 'Keep in mind,'],
    'It is worth mentioning that': ['Worth mentioning,', 'Also,'],
    'As a matter of fact': ['Actually', 'In fact'],
    'provides': ['offers', 'gives you', 'comes with'],
    'features': ['has', 'includes', 'comes with'],
    'boasts': ['has', 'offers', 'includes'],
    'delivers': ['provides', 'gives you', 'offers'],
    'ensures': ['makes sure', 'helps with', 'gives you'],
    'offers': ['has', 'comes with', 'includes'],
    'equipped with': ['has', 'comes with'],
    'comes equipped with': ['has', 'includes'],
};

// Human expressions to occasionally insert
const HUMAN_EXPRESSIONS = [
    "Here's the thing —",
    "Worth mentioning:",
    "Quick note:",
    "One thing to consider:",
    "Something to keep in mind:",
    "From what we've seen,",
    "Based on real-world usage,",
];

// Balanced/neutral openers for sections
const NEUTRAL_OPENERS = [
    "Looking at the",
    "When it comes to",
    "In terms of",
    "Regarding the",
    "As for the",
    "Talking about",
];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function neutralizePositiveLanguage(text: string): string {
    let result = text;

    for (const [positive, neutralOptions] of Object.entries(POSITIVE_REPLACEMENTS)) {
        const regex = new RegExp(`\\b${positive}\\b`, 'gi');
        result = result.replace(regex, () => getRandomItem(neutralOptions));
    }

    return result;
}

function addContractions(text: string): string {
    let result = text;

    for (const [formal, casualOptions] of Object.entries(CASUAL_REPLACEMENTS)) {
        // Use case-sensitive replacement
        const regex = new RegExp(formal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        result = result.replace(regex, () => getRandomItem(casualOptions));
    }

    return result;
}

function varySentenceStarters(text: string): string {
    // Replace repetitive "The [noun]" starters occasionally
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length === 0) return text;

    let theCount = 0;

    const varied = sentences.map((sentence, index) => {
        const trimmed = sentence.trim();
        if (trimmed.startsWith('The ')) {
            theCount++;
            // Only vary if we've seen a couple of "The" starters already
            if (theCount > 1 && Math.random() > 0.6) {
                const nounMatch = trimmed.match(/^The\s+([a-z]+)\s+/i);
                if (nounMatch) {
                    const noun = nounMatch[1];
                    const rest = trimmed.substring(nounMatch[0].length);

                    const openers = [
                        `When looking at the ${noun},`,
                        `As for the ${noun},`,
                        `Regarding the ${noun},`,
                        `In terms of the ${noun},`
                    ];

                    const opener = getRandomItem(openers);
                    // Ensure the rest of the sentence starts with lowercase unless it's "I"
                    const fixedRest = rest.charAt(0).toLowerCase() + rest.slice(1);
                    return ` ${opener} ${fixedRest}`;
                }
            }
        }
        return sentence;
    });

    return varied.join('');
}

function addOccasionalHumanTouch(text: string): string {
    // Only add human expressions to longer text (more than 100 chars)
    if (text.length < 100) return text;

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    // Add a human expression before a random sentence (not first)
    if (sentences.length > 3 && Math.random() > 0.6) {
        const insertIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
        const expression = getRandomItem(HUMAN_EXPRESSIONS);

        // Make sure we handle spacing correctly
        const originalSentence = sentences[insertIndex].trim();
        const lowerCasedOriginal = originalSentence.charAt(0).toLowerCase() + originalSentence.slice(1);

        sentences[insertIndex] = ` ${expression} ${lowerCasedOriginal}`;
    }

    return sentences.join('');
}

function balanceTone(text: string): string {
    // Remove excessive exclamation marks
    let result = text.replace(/!{2,}/g, '!');

    // Replace patterns like "You will love" with more neutral alternatives
    result = result.replace(/You will (love|adore|enjoy|appreciate)/gi, "You might appreciate");
    result = result.replace(/You('ll| will) be (amazed|impressed|blown away)/gi, "You may notice");

    // Handle "It is equipped with" -> "It comes with" to avoid "It's has" issues later
    result = result.replace(/It is equipped with/gi, "It comes with");
    result = result.replace(/It comes equipped with/gi, "It includes");

    // Tone down superlatives
    result = result.replace(/the most ([a-z]+) (car|vehicle|model|variant)/gi, 'a notably $1 $2');
    result = result.replace(/one of the (best|finest|greatest)/gi, 'among the better');

    return result;
}

/**
 * Main humanizer function - transforms AI content to sound more natural and neutral
 */
export function humanizeContent(text: string | null | undefined): string {
    if (!text || typeof text !== 'string') return '';

    let result = text;

    // Step 1: Balance overly positive tone
    result = balanceTone(result);

    // Step 2: Neutralize promotional language
    result = neutralizePositiveLanguage(result);

    // Step 3: Add contractions for casual feel
    result = addContractions(result);

    // Step 4: Vary sentence starters
    result = varySentenceStarters(result);

    // Step 5: Occasionally add human touches
    result = addOccasionalHumanTouch(result);

    // Clean up any double spaces
    result = result.replace(/\s{2,}/g, ' ').trim();

    return result;
}

/**
 * Humanize an array of strings (like bullet points)
 */
export function humanizeContentArray(arr: string[] | null | undefined): string[] {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map(item => humanizeContent(item));
}

/**
 * Humanize model-specific content fields
 */
export interface ModelContentFields {
    summary?: string | null;
    description?: string | null;
    exteriorDesign?: string | null;
    comfortConvenience?: string | null;
    pros?: string | null;
    cons?: string | null;
    headerSeo?: string | null;
}

export function humanizeModelContent(model: ModelContentFields): ModelContentFields {
    return {
        summary: humanizeContent(model.summary),
        description: humanizeContent(model.description),
        exteriorDesign: humanizeContent(model.exteriorDesign),
        comfortConvenience: humanizeContent(model.comfortConvenience),
        pros: humanizeContent(model.pros),
        cons: model.cons, // Keep cons as-is (they're already negative/balanced)
        headerSeo: humanizeContent(model.headerSeo),
    };
}

/**
 * Humanize brand summary
 */
export function humanizeBrandContent(brand: { summary?: string | null }): { summary: string } {
    return {
        summary: humanizeContent(brand.summary),
    };
}

/**
 * Humanize engine summaries
 */
export function humanizeEngineSummaries(engines: Array<{ title?: string; summary?: string }> | null | undefined): Array<{ title?: string; summary: string }> {
    if (!engines || !Array.isArray(engines)) return [];
    return engines.map(engine => ({
        ...engine,
        summary: humanizeContent(engine.summary),
    }));
}

/**
 * Test function to see before/after
 */
export function testHumanizer(sampleText: string): { before: string; after: string } {
    return {
        before: sampleText,
        after: humanizeContent(sampleText),
    };
}
