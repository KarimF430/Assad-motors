/**
 * Mock Data Fixtures for E2E Tests
 * Provides consistent test data across all E2E tests
 */

export const mockBrands = [
    {
        id: 'brand-1',
        name: 'Maruti Suzuki',
        slug: 'maruti-suzuki',
        logo: '/uploads/brands/maruti-suzuki-logo.webp'
    },
    {
        id: 'brand-2',
        name: 'Hyundai',
        slug: 'hyundai',
        logo: '/uploads/brands/hyundai-logo.webp'
    },
    {
        id: 'brand-3',
        name: 'Tata',
        slug: 'tata',
        logo: '/uploads/brands/tata-logo.webp'
    }
];

export const mockModels = [
    {
        id: 'model-1',
        name: 'Swift',
        brandId: 'brand-1',
        brandName: 'Maruti Suzuki',
        slug: 'maruti-suzuki-swift',
        startingPrice: 599000,
        fuelTypes: ['Petrol', 'CNG'],
        transmissions: ['Manual', 'AMT'],
        seating: 5,
        isPopular: true,
        isNew: false
    },
    {
        id: 'model-2',
        name: 'Creta',
        brandId: 'brand-2',
        brandName: 'Hyundai',
        slug: 'hyundai-creta',
        startingPrice: 1099000,
        fuelTypes: ['Petrol', 'Diesel'],
        transmissions: ['Manual', 'Automatic'],
        seating: 5,
        isPopular: true,
        isNew: false
    },
    {
        id: 'model-3',
        name: 'Nexon',
        brandId: 'brand-3',
        brandName: 'Tata',
        slug: 'tata-nexon',
        startingPrice: 799000,
        fuelTypes: ['Petrol', 'Diesel', 'Electric'],
        transmissions: ['Manual', 'AMT'],
        seating: 5,
        isPopular: true,
        isNew: false
    }
];

export const mockVariants = [
    {
        id: 'variant-1',
        modelId: 'model-1',
        name: 'VXi',
        price: 699000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        engine: '1.2L K-Series',
        power: '89 PS',
        mileage: '22.38 kmpl'
    },
    {
        id: 'variant-2',
        modelId: 'model-1',
        name: 'ZXi+',
        price: 849000,
        fuelType: 'Petrol',
        transmission: 'AMT',
        engine: '1.2L K-Series',
        power: '89 PS',
        mileage: '22.56 kmpl'
    }
];

export const mockUser = {
    id: 'user-test-1',
    email: 'test@gadizone.com',
    name: 'Test User',
    googleId: 'google-test-123'
};

export const formatPrice = (price: number): string => {
    return `₹${(price / 100000).toFixed(2)} Lakh`;
};
