
import { generateExpertReview } from './lib/expert-review-logic';

const mockVariants = [
    { name: 'E Petrol', power: '113 BHP', torque: '144 Nm', price: 1000000, mileage: '17.4 kmpl' },
    { name: 'SX Turbo', power: '158 BHP', torque: '253 Nm', price: 1800000, transmission: 'DCT', mileage: '18.4 kmpl' },
    { name: 'Diesel EX', power: '113 BHP', torque: '250 Nm', price: 1200000, fuel: 'Diesel', mileage: '21.8 kmpl' }
];

const mockModel = {
    name: 'Creta',
    brand: 'Hyundai',
    startingPrice: 1000000,
    endingPrice: 1800000,
    keySpecs: {
        power: '113 BHP', // Base spec often populated here
        torque: '144 Nm',
    },
    variants: mockVariants
};

console.log("--- Generating Model Review ---");
const result = generateExpertReview(mockModel, mockVariants);
console.log(JSON.stringify(result, null, 2));
