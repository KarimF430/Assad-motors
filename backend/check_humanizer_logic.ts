
import { humanizeContent, testHumanizer } from './server/utils/content-humanizer';

const testCases = [
    "The Tata Nexon is an exceptional vehicle that offers outstanding performance.",
    "It is equipped with a state-of-the-art infotainment system. Furthermore, it boasts incredible safety features.",
    "You will love the premium interior feeling. It is truly a game-changing experience.",
    "The car features a stunning design. The engine delivers unnecessary power. The ride quality is unmatched."
];

console.log('🧪 Testing Content Humanizer Logic...\n');

testCases.forEach((text, i) => {
    console.log(`\n--- Test Case ${i + 1} ---`);
    console.log(`ORIGINAL: ${text}`);
    const result = humanizeContent(text);
    console.log(`HUMANIZED: ${result}`);

    if (result === text) {
        console.log('⚠️  NO CHANGE DETECTED');
    } else {
        console.log('✅  Changes applied successfully');
    }
});

console.log('\n\n--- Testing Sentence Variation ---');
const repetitive = "The car is good. The seats are comfortable. The engine is quiet. The mileage is decent.";
console.log(`ORIGINAL: ${repetitive}`);
console.log(`HUMANIZED: ${humanizeContent(repetitive)}`);
