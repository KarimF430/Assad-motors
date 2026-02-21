
import { generateExpertReview } from './lib/expert-review-logic';

const mockVariant = {
    name: 'Creta E Petrol MT',
    brand: 'Hyundai',
    startingPrice: 1073000,
    power: '113 BHP',
    torque: '143.8 Nm @ 4500 rpm',
    mileage: [{ value: '17.4 kmpl' }],
    engine: '1.5l MPi Petrol',
    transmission: 'Manual',
    rating: '3',
    bodyType: 'SUV',
    fuelType: 'Petrol'
};

const result = generateExpertReview(mockVariant);
console.log(JSON.stringify(result, null, 2));
