/**
 * Unique editorial descriptions for each budget segment.
 * These replace the templated generateDynamicDescription() function
 * that was producing near-identical content across all 12 budget pages.
 *
 * Each entry has:
 *  - short: 1-2 sentence intro shown above the fold
 *  - extended: richer HTML content shown in the "Read More" section
 */

export const budgetEditorials: Record<string, { short: string; extended: string }> = {
    '8-lakh': {
        short: `The under ₹8 lakh segment is where most first-time car buyers start in India. These are primarily hatchbacks — compact, fuel-efficient, and easy to park in city traffic. CNG variants from Maruti Suzuki and Tata are especially popular here for their low running costs.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Who Should Buy a Car Under ₹8 Lakh?</h2>
                <p>This segment is ideal for first-time buyers, students, and urban commuters who need a reliable daily driver without a large EMI burden. The cars here are mostly petrol and CNG hatchbacks — small on the outside but surprisingly practical for a family of four.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">What to Expect:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Petrol and CNG engine options — CNG variants can cost ₹2–3/km to run</li>
                    <li>Manual transmission standard; AMT available on select models</li>
                    <li>Basic safety: dual airbags and ABS are now standard across most models</li>
                    <li>Infotainment: expect a basic touchscreen on mid and top variants</li>
                </ul>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Top Picks to Consider:</h3>
                <p>Maruti Suzuki Alto K10, Maruti Suzuki S-Presso, and Tata Tiago are consistently the top sellers in this bracket. The Tiago stands out for its safety ratings; the Alto K10 for its resale value and CNG efficiency.</p>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '10-lakh': {
        short: `The ₹8–10 lakh range is the sweet spot of the Indian car market — it's where hatchbacks get feature-rich and entry-level SUVs begin. You'll find automatic options, larger touchscreens, and better safety kits here compared to the sub-₹8L segment.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Why the ₹8–10 Lakh Segment Is India's Most Competitive</h2>
                <p>More cars compete in this price band than any other in India. Maruti Suzuki, Tata, Hyundai, and Kia all have strong offerings here, which means buyers get more features per rupee than almost anywhere else in the market.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">What You Get at This Price:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Touchscreen infotainment with Android Auto and Apple CarPlay</li>
                    <li>Automatic transmission options (AMT or CVT)</li>
                    <li>4–6 airbags on top variants</li>
                    <li>Rear parking camera and sensors</li>
                    <li>Connected car features on select models</li>
                </ul>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Segment Highlights:</h3>
                <p>The Maruti Suzuki Swift and Baleno dominate sales here. The Tata Punch is the entry-level SUV option with a 5-star Global NCAP rating. If you want a compact SUV feel without crossing ₹10L, the Punch is hard to beat.</p>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '15-lakh': {
        short: `Between ₹10–15 lakh, compact SUVs take centre stage. This is where the Maruti Suzuki Brezza, Tata Nexon, and Hyundai Venue compete fiercely — and where buyers can expect proper automatic gearboxes, sunroofs, and 6-airbag safety kits.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">The Compact SUV Sweet Spot</h2>
                <p>The ₹10–15 lakh range is where most Indian families upgrading from a hatchback land. Compact SUVs dominate here because they offer higher ground clearance (useful for Indian roads), better visibility, and a more commanding presence — all within a budget that keeps EMIs manageable.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Features to Expect:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Sunroof/moonroof on top variants</li>
                    <li>6 airbags standard on higher trims</li>
                    <li>Wireless Android Auto / Apple CarPlay</li>
                    <li>Automatic climate control</li>
                    <li>Turbo petrol engines for better performance</li>
                </ul>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Who Should Buy Here:</h3>
                <p>Young professionals, small families, and buyers upgrading from an entry hatchback. If you drive mostly in the city but want the option of comfortable highway trips, this segment delivers that balance well.</p>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '20-lakh': {
        short: `The ₹15–20 lakh range is where compact SUVs get premium and mid-size SUVs begin. Expect diesel engine options, larger cabins, panoramic sunroofs, and ADAS safety features on top variants. This is the segment for buyers who want more space without going full-size.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Premium Compact to Mid-Size SUVs</h2>
                <p>At ₹15–20 lakh, you're entering the territory where cars start feeling genuinely premium. Diesel engines make a strong case here for buyers who clock 1,500+ km per month — the fuel savings over 3–4 years can offset the higher upfront cost.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">What Sets This Segment Apart:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Diesel engine options with better highway efficiency</li>
                    <li>ADAS features: lane assist, automatic emergency braking on top variants</li>
                    <li>Larger 10.25-inch+ touchscreens</li>
                    <li>Ventilated front seats on premium trims</li>
                    <li>360-degree camera systems</li>
                </ul>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Best For:</h3>
                <p>Families of 4–5 who need a comfortable second car or a primary vehicle for mixed city-highway use. The Hyundai Creta and Tata Harrier are the benchmarks here.</p>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '25-lakh': {
        short: `Between ₹20–25 lakh, mid-size SUVs and premium sedans compete for attention. This is where you find the Hyundai Creta top variants, Tata Harrier, and Maruti Suzuki Grand Vitara — cars with genuinely premium interiors, strong safety ratings, and connected car technology.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Mid-Size SUVs and Premium Sedans</h2>
                <p>The ₹20–25 lakh bracket is where Indian buyers start expecting near-luxury features. The competition is intense — Korean, Indian, and Japanese brands all have strong entries here, and the feature wars have pushed quality up significantly in recent years.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Standout Features:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Strong hybrid options (Grand Vitara, Hyryder) for excellent real-world mileage</li>
                    <li>Panoramic sunroofs becoming standard on top trims</li>
                    <li>Level 2 ADAS on flagship variants</li>
                    <li>Premium audio systems (Bose, JBL)</li>
                    <li>Digital instrument clusters and heads-up displays</li>
                </ul>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Who Buys Here:</h3>
                <p>Established professionals, families upgrading from a compact SUV, and buyers who want a car they'll be happy with for 7–10 years. Resale value matters more at this price point — Hyundai and Maruti tend to hold value better than average.</p>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '30-lakh': {
        short: `The ₹25–30 lakh range is where SUVs get full-size and sedans get genuinely premium. Expect 7-seater options, turbocharged engines with serious performance, and connected car ecosystems that rival European brands at twice the price.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Full-Size SUVs and Performance Sedans</h2>
                <p>At ₹25–30 lakh, you're looking at cars that can genuinely do everything — comfortable enough for daily city use, capable enough for long highway runs, and spacious enough for a family of 6–7. The Tata Safari, Hyundai Alcazar, and MG Hector Plus are key players here.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">What Defines This Segment:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>3-row 7-seater configurations available</li>
                    <li>Turbo petrol engines with 150–200 bhp outputs</li>
                    <li>Advanced connected car tech with OTA updates</li>
                    <li>Wireless charging, ambient lighting, powered tailgates</li>
                    <li>Better NVH (noise, vibration, harshness) insulation</li>
                </ul>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '40-lakh': {
        short: `The ₹30–40 lakh segment is where premium SUVs and performance-oriented cars live. You'll find the Tata Harrier top variants, Hyundai Tucson, and entry-level luxury crossovers competing here — cars with genuinely upscale interiors and powerful drivetrains.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Premium SUVs and Near-Luxury Crossovers</h2>
                <p>At ₹30–40 lakh, the gap between Indian mainstream brands and entry-level luxury narrows significantly. You get leather interiors, powerful engines, and feature sets that would have cost ₹60–70 lakh five years ago. This is also where hybrid and plug-in hybrid options start appearing.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Key Considerations:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Strong hybrid options for buyers who want premium + efficiency</li>
                    <li>AWD/4WD available on select models for off-road capability</li>
                    <li>Premium leather and semi-aniline upholstery</li>
                    <li>Diesel engines with 180–200 bhp for highway cruising</li>
                </ul>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '50-lakh': {
        short: `Between ₹40–50 lakh, you're in the territory of full-size premium SUVs and entry-level luxury sedans. This is where Jeep, Volkswagen, and Skoda compete with top-spec Indian brands — and where buyers expect near-European build quality and refinement.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Full-Size Premium SUVs</h2>
                <p>The ₹40–50 lakh bracket is a transition zone — you're leaving the mainstream Indian market and entering near-luxury territory. Cars here have noticeably better build quality, quieter cabins, and more sophisticated suspension tuning than anything below ₹30 lakh.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">What to Expect:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>European-spec turbocharged engines (1.5T, 2.0T)</li>
                    <li>7-speed DSG or 8-speed automatic transmissions</li>
                    <li>All-wheel drive as standard or optional</li>
                    <li>Significantly better highway NVH than mainstream SUVs</li>
                </ul>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '60-lakh': {
        short: `The ₹50–60 lakh range is proper luxury territory — where BMW, Mercedes-Benz, and Audi entry models compete with top-spec Jeeps and Volvos. Buyers here prioritise brand prestige, cabin refinement, and driving dynamics over pure value-for-money.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Entry Luxury — Where Prestige Begins</h2>
                <p>At ₹50–60 lakh, you're firmly in luxury car territory. The ownership experience changes here — dealer service quality, brand prestige, and the driving experience itself become as important as the spec sheet. Depreciation is also steeper, so resale planning matters more.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Considerations for Luxury Buyers:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Higher service and maintenance costs than mainstream brands</li>
                    <li>Significantly better cabin materials and NVH</li>
                    <li>Brand prestige and social signalling</li>
                    <li>Better resale in metro cities vs. tier-2 towns</li>
                </ul>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '80-lakh': {
        short: `Between ₹60–80 lakh, you're in the heart of the Indian luxury car market. BMW 3 Series, Mercedes C-Class, and Audi A4 compete here — alongside full-size luxury SUVs from Volvo and Jeep. Buyers at this level expect a fundamentally different ownership experience.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Core Luxury — Sedans and Full-Size SUVs</h2>
                <p>The ₹60–80 lakh segment is where German luxury brands dominate. The BMW 3 Series and Mercedes C-Class have defined this space for decades — and for good reason. The driving dynamics, interior quality, and technology at this price point are genuinely world-class.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">What Defines Luxury at This Level:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Rear-wheel drive or AWD platforms with sport-tuned suspension</li>
                    <li>Ambient lighting with 64+ colour options</li>
                    <li>Massaging front seats on top variants</li>
                    <li>Over-the-air software updates</li>
                    <li>Significantly better crash safety than mainstream cars</li>
                </ul>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    '1-crore': {
        short: `The ₹80 lakh–1 crore range is where full-size luxury SUVs and performance sedans live. BMW 5 Series, Mercedes E-Class, and Volvo XC90 compete here — cars that offer a genuinely different tier of comfort, technology, and driving refinement.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Upper Luxury — Where Comfort Becomes Exceptional</h2>
                <p>At ₹80 lakh to ₹1 crore, you're buying a car that will genuinely impress in any context. These are vehicles with near-silent cabins, adaptive air suspension, and technology that anticipates your needs. The BMW 5 Series and Mercedes E-Class are the benchmarks.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">Ownership Considerations:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Annual service costs of ₹60,000–₹1,20,000</li>
                    <li>Depreciation of 15–20% in year one</li>
                    <li>Best experienced with a chauffeur or as a driver's car — not both</li>
                    <li>Comprehensive insurance costs ₹1.5–2L per year</li>
                </ul>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },

    'above-1-crore': {
        short: `Above ₹1 crore, you're in ultra-luxury and performance territory — BMW 7 Series, Mercedes S-Class, Porsche Cayenne, and Range Rover. These are not just cars; they're statements. Buyers here prioritise exclusivity, craftsmanship, and the absolute best in automotive technology.`,
        extended: `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Ultra-Luxury — The Top of the Market</h2>
                <p>Above ₹1 crore, the conversation shifts from features to experience. These cars are hand-assembled with materials sourced globally, and the ownership experience — from the dealership to the service centre — is designed to match. The Mercedes S-Class and BMW 7 Series define this segment in India.</p>

                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">What Makes These Cars Different:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Rear-seat entertainment systems with individual screens</li>
                    <li>Air suspension with road-scanning preview</li>
                    <li>Bespoke interior customisation options</li>
                    <li>Dedicated relationship manager from the brand</li>
                    <li>Performance variants with 500+ bhp outputs</li>
                </ul>

                <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change. Check individual model pages for current offers.</p>
            </div>
        `,
    },
}
