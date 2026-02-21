/**
 * Global type declarations for mobile app
 */

// Navigation route params
export type RootStackParamList = {
    HomeMain: undefined;
    Brand: { brandSlug: string };
    Model: { brandSlug: string; modelSlug: string };
    Variant: { brandSlug: string; modelSlug: string; variantSlug: string };
    CompareMain: undefined;
    CompareDetail: { carIds: string[] };
    SearchMain: undefined;
    NewsList: undefined;
    NewsDetail: { newsId: string };
    ProfileMain: undefined;
    Login: undefined;
    Signup: undefined;
};

// Car data types
export interface Car {
    id: string;
    name: string;
    brand: string;
    brandName: string;
    image: string;
    startingPrice: number;
    lowestPriceFuelType?: string;
    fuelTypes: string[];
    transmissions: string[];
    seating: number;
    launchDate: string;
    slug: string;
    isNew: boolean;
    isPopular: boolean;
}

export interface Brand {
    id: string;
    name: string;
    logo?: string;
    slug: string;
}

// Extend React Navigation types
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
