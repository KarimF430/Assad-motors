import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function updateCamry() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    await mongoose.connect(mongoUri);

    try {
        const camry = await Model.findOne({ id: 'model-brand-toyota-camry' });

        if (!camry) {
            console.error('Toyota Camry model not found.');
            return;
        }

        console.log(`Found Camry model: ${camry.name}`);

        camry.headerSeo = `The Toyota Camry is an exclusively hybrid sedan (ninth generation) priced from $28,400 to $35,995 (₹28.4-36 lakh approx), powered by a 2.5L 4-cylinder hybrid engine producing 225 HP (FWD) or 232 HP (AWD) with 163 lb-ft torque. Features 7-12.3-inch touchscreen with Apple CarPlay/Android Auto/Amazon Alexa, Toyota Safety Sense 2.5+ (pre-collision warning, lane departure alert, adaptive cruise control, automatic high beams), wireless charging, multiple USB-C ports, head-up display, dual-zone climate control, heated front seats, white LED ambient lighting. ECVT transmission. Mileage: 44-53 MPG (18.7-22.5 km/l). Dimensions: redesigned with wider sharper grille, slim LED headlights, new LED taillamps. Available in LE, SE, XLE, XSE trims. XSE Nightshade Edition: blacked-out accents, 19-inch black alloy wheels.`;

        camry.summary = `The 2025 Camry features stylish sporty design, calm spacious well-built cabin with soft-touch materials, comfortable redesigned seating, ample legroom/headroom for five passengers, digital instrument cluster (higher trims), 9-12.3-inch touchscreen (higher trims), wireless charging, multiple USB-C ports, head-up display, dual-zone climate control, heated front seats, white LED ambient lighting, multiple airbags, ABS, traction control, and Toyota Safety Sense 2.5+. AWD adds $1,525. Exclusively hybrid for 2025. Ninth generation. Competitive against Honda Accord Hybrid and Hyundai Sonata Hybrid.`;

        camry.description = `This exclusively hybrid sedan (ninth generation) offers blend of style, comfort, and fuel efficiency. Safety: Toyota Safety Sense 2.5+ (pre-collision warning with pedestrian detection, lane departure alert with steering assist, adaptive cruise control, automatic high beams), multiple airbags, ABS, traction control. ECVT transmission. FWD or AWD (AWD adds rear electric motor). Ideal for families seeking efficient hybrid sedan with premium features and competitive pricing.`;

        camry.pros = `Hybrid-Only: 225-232 HP, 44-53 MPG (18.7-22.5 km/l), exclusively hybrid for 2025.
Toyota Safety Sense 2.5+: Pre-collision warning, lane departure alert, adaptive cruise control.
Stylish Design: Wider sharper grille, slim LED headlights, new LED taillamps.
Competitive Pricing: Starts at $28,400, comparable to outgoing hybrid models.`;

        camry.cons = `No Gas-Only Option: Exclusively hybrid for 2025.
AWD Premium: AWD adds $1,525 plus destination charges.
Torque: 163 lb-ft is modest for a mid-size sedan.
Rear Seat: Adequate but not class-leading space.`;

        camry.exteriorDesign = `The Camry features stylish sporty design with wider sharper front grille, slim LED headlights, and new LED taillamps creating a modern hybrid sedan aesthetic.`;

        camry.comfortConvenience = `The cabin features 7-12.3-inch touchscreen (depending on trim) with Apple CarPlay/Android Auto/Amazon Alexa, digital instrument cluster (higher trims), wireless charging, multiple USB-C ports, head-up display, dual-zone climate control, heated front seats, white LED ambient lighting, calm spacious well-built cabin with soft-touch materials, comfortable redesigned seating, and ample legroom/headroom for five passengers.`;

        camry.engineSummaries = [
            {
                title: '2.5L Hybrid FWD',
                summary: '4-cylinder hybrid, FWD.',
                transmission: 'ECVT',
                power: '225 HP',
                torque: '163 lb-ft',
                speed: '51-53 MPG (21.7-22.5 km/l)'
            },
            {
                title: '2.5L Hybrid AWD',
                summary: '4-cylinder hybrid + rear electric motor, AWD.',
                transmission: 'ECVT',
                power: '232 HP',
                torque: '163 lb-ft',
                speed: '44-51 MPG (18.7-21.7 km/l)'
            }
        ] as any;

        camry.faqs = [
            {
                question: "What is the mileage?",
                answer: "44-53 MPG (18.7-22.5 km/l) depending on trim and drivetrain."
            },
            {
                question: "Is AWD available?",
                answer: "Yes, AWD available for $1,525 additional cost."
            },
            {
                question: "What is Toyota Safety Sense 2.5+?",
                answer: "Pre-collision warning with pedestrian detection, lane departure alert with steering assist, adaptive cruise control, automatic high beams."
            },
            {
                question: "What trims are available?",
                answer: "LE, SE, XLE, XSE, and XSE Nightshade Edition."
            },
            {
                question: "What is the price range?",
                answer: "Starts from $28,400 (LE) to $35,995 (XSE) plus destination charges."
            }
        ] as any;

        await camry.save();
        console.log('Successfully updated Toyota Camry model data.');

    } catch (error) {
        console.error('Error updating Camry:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateCamry();
