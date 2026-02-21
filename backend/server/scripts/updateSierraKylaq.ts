import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function updateSierraAndKylaq() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        // ==================== UPDATE TATA SIERRA ====================
        const sierra = await Model.findOne({ id: 'model-brand-tata-sierra' });

        if (!sierra) {
            console.error('Tata Sierra model not found (id: model-brand-tata-sierra).');
        } else {
            console.log(`Found Sierra model: ${sierra.name}`);

            sierra.headerSeo = `The 2025 Tata Sierra revives an iconic nameplate with modern engineering. Priced from ₹11.49 lakh to ₹21.29 lakh, this 5-seater SUV is built on the ARGOS platform with 24 variants across 7 personas (Smart+, Pure, Adventure, Accomplished).

Engine options: 1.5L Revotron NA petrol (106 PS), 1.5L Hyperion turbo petrol (160 PS, 260 Nm), and 1.5L Kryojet diesel (118 PS, 280 Nm). Key highlights include the "TheatrePro" cabin with triple-screen setup (12.3" infotainment + 12.3" passenger screen + 10.25" cluster), segment-largest panoramic sunroof (1525x925mm), 12-speaker JBL Dolby Atmos sound, Level 2 ADAS with 22 features, and class-leading 622L boot space. Deliveries begin January 15, 2026.`;

            sierra.summary = `The Tata Sierra makes a comeback after 3 decades with a completely reimagined design. The "TheatrePro" cabin features a triple-screen dashboard layout—a segment first—with a dedicated 12.3-inch passenger entertainment display for streaming and gaming. The iconic wraparound rear glass and boxy silhouette pay tribute to the original 1991 Sierra while offering modern conveniences like "Boss Mode" rear seats that can slide the front passenger seat for maximum legroom.`;

            sierra.description = `Built on the ARGOS platform, the 2025 Sierra offers three powertrain options catering to different buyer needs. The 1.5L NA petrol suits urban commuters, while the turbo petrol delivers spirited performance with 160 PS and 260 Nm. The diesel variant balances efficiency with strong low-end torque (280 Nm). Safety is paramount with 6 airbags, ESP with 21 functions, ABS with EBD, and Level 2 ADAS featuring adaptive cruise control with stop-and-go, autonomous emergency braking, blind spot detection, and lane keep assist.`;

            sierra.pros = `Iconic Design: Distinctive boxy styling with wraparound rear glass stands out on road.
Triple-Screen Dashboard: Segment-first 12.3" passenger entertainment display with streaming and gaming.
Massive Boot: Class-leading 622L boot space, expandable to 1257L with seats folded.
Premium Audio: 12-speaker JBL SonicShaft soundbar with Dolby Atmos and 18 audio modes.
Largest Sunroof: Segment-largest panoramic sunroof (1525x925mm) extends to rear passengers.`;

            sierra.cons = `NA Petrol Power: 106 PS base engine may feel underpowered for highway overtakes.
No AWD Option: FWD-only configuration, unlike some rivals offering 4x4.
New Product: Long-term reliability and service experience yet to be established.
Fuel Efficiency: Turbo petrol delivers 8-10 kmpl city, which may concern economy-focused buyers.`;

            sierra.exteriorDesign = `The Sierra's design is a modern tribute to the 1991 original, featuring the signature boxy stance and wraparound rear glass that defined the nameplate. The front gets sleek LED headlamps with DRLs, while the rear features connected LED tail lamps. The segment-largest panoramic sunroof (1525x925mm) extends significantly towards the rear, adding to the airy feel. With dimensions of 4340mm length, 1841mm width, and 1715mm height, plus 205mm ground clearance, the Sierra commands a strong road presence.`;

            sierra.comfortConvenience = `The "TheatrePro" cabin features a triple-screen layout: 10.25" digital instrument cluster, 12.3" touchscreen infotainment, and a segment-first 12.3" passenger entertainment screen for independent streaming and gaming. The 12-speaker JBL SonicShaft soundbar delivers Dolby Atmos audio with 18 modes. Comfort features include ventilated front seats, 6-way powered driver seat with memory and welcome function, "Boss Mode" rear seats (front passenger seat slides for extra legroom), dual-zone climate control, HypAR Head-Up Display, 360-degree camera, wireless charging, and configurable ambient lighting. Rear window sunshades add extra comfort.`;

            sierra.engineSummaries = [
                {
                    title: '1.5L Revotron NA Petrol',
                    summary: 'Naturally aspirated petrol refined for smooth city driving and everyday commutes.',
                    transmission: '6-MT / 7-DCT',
                    power: '106 PS @ 6000 rpm',
                    torque: '145 Nm @ 2100 rpm',
                    speed: '~16-18 kmpl'
                },
                {
                    title: '1.5L Hyperion Turbo Petrol',
                    summary: 'Turbocharged petrol delivering punchy performance for enthusiast drivers.',
                    transmission: '6-AT (Torque Converter)',
                    power: '160 PS @ 5000 rpm',
                    torque: '260 Nm @ 1750-4000 rpm',
                    speed: '~10-15 kmpl'
                },
                {
                    title: '1.5L Kryojet Turbo Diesel',
                    summary: 'Torquey diesel engine ideal for highway runs and fuel-conscious buyers.',
                    transmission: '6-MT / 6-AT',
                    power: '118 PS @ 4000 rpm',
                    torque: '280 Nm @ 1500-2750 rpm',
                    speed: '~16-17 kmpl'
                }
            ] as any;

            sierra.faqs = [
                {
                    question: "What is the price of Tata Sierra in India?",
                    answer: "The Tata Sierra is priced from ₹11.49 lakh to ₹21.29 lakh (ex-showroom). It's available in 24 variants across 7 personas: Smart+, Pure, Adventure, and Accomplished."
                },
                {
                    question: "What engine options are available in Sierra?",
                    answer: "The Sierra offers three engines: 1.5L Revotron NA petrol (106 PS, 145 Nm), 1.5L Hyperion turbo petrol (160 PS, 260 Nm), and 1.5L Kryojet diesel (118 PS, 280 Nm) with manual and automatic options."
                },
                {
                    question: "What is the boot space of Tata Sierra?",
                    answer: "The Sierra offers class-leading 622 liters of boot space (up to parcel tray), expandable to 1257 liters with rear seats folded. The boot features a wide opening and flat floor."
                },
                {
                    question: "Does the Tata Sierra have ADAS?",
                    answer: "Yes, the Sierra features Level 2 ADAS with 22 functions including adaptive cruise control with stop-and-go, autonomous emergency braking, blind spot detection, lane keep assist, rear cross traffic alert, and traffic sign recognition."
                },
                {
                    question: "When will Sierra deliveries start?",
                    answer: "Tata Sierra deliveries are scheduled to begin from January 15, 2026. Bookings are currently open."
                }
            ] as any;

            await sierra.save();
            console.log('Successfully updated Tata Sierra model data.\n');
        }

        // ==================== UPDATE SKODA KYLAQ ====================
        const kylaq = await Model.findOne({ id: 'model-brand-skoda-kylaq' });

        if (!kylaq) {
            console.error('Skoda Kylaq model not found (id: model-brand-skoda-kylaq).');
        } else {
            console.log(`Found Kylaq model: ${kylaq.name}`);

            kylaq.headerSeo = `The Skoda Kylaq is a made-for-India sub-4-meter SUV built on the MQB-A0-IN platform. Priced from ₹7.89 lakh to ₹14.40 lakh (ex-showroom), it features a 1.0L TSI turbo petrol engine producing 115 PS and 178 Nm, available with 6-speed manual or 6-speed torque converter automatic.

Notably, the Kylaq achieved 5-star Bharat NCAP safety rating with the highest score for any ICE sub-4-meter SUV (30.88/32 adult, 45/49 child protection). Features include 10.1" touchscreen, 8" digital cockpit, ventilated front seats, single-pane sunroof, wireless Android Auto/Apple CarPlay, and 446L boot space expandable to 1265L. Deliveries started January 27, 2025.`;

            kylaq.summary = `The Skoda Kylaq marks Skoda's entry into India's competitive sub-4-meter SUV segment. Built on the proven MQB-A0-IN platform shared with Kushaq and Slavia, it offers European build quality at accessible prices. The "Modern Solid" design language gives it a distinctive presence with a shiny black grille, slim LED headlights, and a boxy SUV stance. Despite its compact footprint, it offers a generous 446L boot and 2566mm wheelbase for comfortable cabin space.`;

            kylaq.description = `Launched on November 6, 2024, the Kylaq comes in four variants: Classic, Signature, Signature Plus, and Prestige. The 1.0L TSI three-cylinder turbo engine is peppy and refined, reaching 0-100 kmph in 10.5 seconds with a top speed of 188 kmph. Safety is a standout—it's the highest-rated ICE sub-4-meter SUV in Bharat NCAP with standard 6 airbags, ESC, electronic differential lock, hill hold control, and TPMS across variants. Skoda's "Simply Clever" features add practical touches like dedicated parcel tray storage, bag hooks, and smart bottle holders.`;

            kylaq.pros = `5-Star Safety: Highest Bharat NCAP score for ICE sub-4-meter SUV (30.88/32 adult protection).
TSI Engine: Refined 1.0L turbo delivers 115 PS and 178 Nm with good efficiency (19+ kmpl).
European Build: MQB-A0-IN platform ensures solid build quality and confident handling.
Boot Space: 446L is segment-leading, expandable to 1265L with seats folded.
Aggressive Pricing: ₹7.89 lakh starting price undercuts many rivals.`;

            kylaq.cons = `Single Engine Option: Only petrol available—no diesel, CNG, or electric variants.
Rear Seat Width: Best for two adults; three-abreast seating is tight.
Three-Cylinder: Some vibrations typical of 3-cylinder engines at idle.
No ADAS: Lacks advanced driver assistance features available in some segment rivals.`;

            kylaq.exteriorDesign = `The Kylaq adopts Skoda's "Modern Solid" design language with a bold, confident stance. The front features a shiny black grille with 3D ribs flanked by slim LED headlamps and a bold lower spoiler in aluminum optics. The boxy profile with short overhangs enhances SUV character, while the rear gets connected LED tail lamps. At 3995mm length, 1783mm width, 1619mm height, and 189mm ground clearance, it offers a commanding presence within sub-4-meter limits. Top variants get 17-inch alloys (205/55 R17).`;

            kylaq.comfortConvenience = `The cabin features a 10.1" touchscreen with wireless Apple CarPlay and Android Auto, plus an 8" digital cockpit display in higher variants. Comfort highlights include ventilated front seats with 6-way electric adjustment, automatic Climatronic AC, single-pane sunroof, wireless phone charger, and ambient lighting. Skoda's "Simply Clever" storage solutions add practicality: dedicated parcel tray storage, bag hooks, Smartgrip bottle holders, coat hooks, and phone holders. Rear passengers get AC vents and adequate knee/headroom, though width suits two adults best.`;

            kylaq.engineSummaries = [
                {
                    title: '1.0L TSI Petrol Manual',
                    summary: 'Three-cylinder turbo petrol paired with 6-speed manual for engaging, fuel-efficient driving.',
                    transmission: '6-Speed MT',
                    power: '115 PS @ 5000-5500 rpm',
                    torque: '178 Nm @ 1750-4000 rpm',
                    speed: '19.68 kmpl (ARAI)'
                },
                {
                    title: '1.0L TSI Petrol Automatic',
                    summary: 'Same turbo engine with 6-speed torque converter automatic for relaxed commutes.',
                    transmission: '6-Speed AT',
                    power: '115 PS @ 5000-5500 rpm',
                    torque: '178 Nm @ 1750-4000 rpm',
                    speed: '19.05 kmpl (ARAI)'
                }
            ] as any;

            kylaq.faqs = [
                {
                    question: "What is the price of Skoda Kylaq in India?",
                    answer: "The Skoda Kylaq is priced from ₹7.89 lakh for Classic to ₹14.40 lakh for Prestige AT (ex-showroom). Automatic variants cost about ₹1-1.10 lakh more than manuals."
                },
                {
                    question: "What is the Bharat NCAP rating of Kylaq?",
                    answer: "The Kylaq achieved a 5-star Bharat NCAP rating with 30.88/32 in adult protection and 45/49 in child protection—the highest for any ICE-powered sub-4-meter SUV."
                },
                {
                    question: "What is the boot space of Skoda Kylaq?",
                    answer: "The Kylaq offers 446 liters of boot space, expandable to 1265 liters with rear seats folded—segment-leading in the sub-4-meter SUV class."
                },
                {
                    question: "What are the variants available in Kylaq?",
                    answer: "The Kylaq comes in four variants: Classic, Signature, Signature Plus, and Prestige. Each is available with 6-speed manual, and Signature Plus and Prestige also offer 6-speed automatic."
                },
                {
                    question: "What is the mileage of Skoda Kylaq?",
                    answer: "The Kylaq delivers ARAI-certified mileage of 19.68 kmpl for manual and 19.05 kmpl for automatic. Real-world efficiency is around 15-18 kmpl depending on driving conditions."
                }
            ] as any;

            await kylaq.save();
            console.log('Successfully updated Skoda Kylaq model data.');
        }

    } catch (error) {
        console.error('Error updating models:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateSierraAndKylaq();
