import { Metadata } from 'next'
import CarExpertClient from './CarExpertClient'

// Comprehensive SEO Metadata for Car Expert Page
export const metadata: Metadata = {
    title: 'Best Car Buying Consultant in India | Expert Advice for New & Used Cars | gadizone',
    description: 'Get unbiased car buying advice from certified automotive experts. Compare new cars, check used car prices, find best deals, and avoid dealership traps. Trusted by 10,000+ car buyers in India.',
    keywords: [
        // Primary Keywords - High Intent
        'car buying consultant India',
        'best car to buy in India 2025',
        'new car advice',
        'used car buying tips',
        'car expert near me',
        // Long-tail Keywords
        'which car should I buy under 10 lakhs',
        'best family car in India',
        'best mileage car in India',
        'car comparison expert',
        'car buying help India',
        // Problem-Aware Keywords
        'avoid getting cheated at car dealership',
        'how to negotiate car price in India',
        'best car for daily commute',
        'safest cars in India',
        // Brand Comparisons
        'Creta vs Seltos vs Nexon comparison',
        'best SUV under 15 lakhs',
        'best hatchback under 8 lakhs',
        // Used Car Keywords
        'used car inspection checklist',
        'second hand car buying guide',
        'certified pre-owned cars India',
    ],
    alternates: {
        canonical: 'https://www.gadizone.com/car-expert',
    },
    openGraph: {
        title: 'Car Buying Consultant | Expert Advice for New & Used Cars | gadizone',
        description: 'Stop guessing, start driving with confidence. Get unbiased car buying advice from engineers, not salespeople. Trusted by 10,000+ happy customers.',
        url: 'https://www.gadizone.com/car-expert',
        siteName: 'gadizone',
        images: [
            {
                url: 'https://www.gadizone.com/og-car-expert.jpg',
                width: 1200,
                height: 630,
                alt: 'gadizone Car Buying Expert Consultation',
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Best Car Buying Consultant in India | gadizone',
        description: 'Expert, unbiased car buying advice. Compare new cars, check prices, and avoid dealership traps. Trusted by 10,000+ buyers.',
        images: ['https://www.gadizone.com/og-car-expert.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

// Helper functions copied from home page logic to ensure same data formatting
const normalizeFuelType = (fuel: string): string => {
    const lower = fuel.toLowerCase()
    if (lower === 'petrol') return 'Petrol'
    if (lower === 'diesel') return 'Diesel'
    if (lower === 'cng') return 'CNG'
    if (lower === 'electric') return 'Electric'
    if (lower === 'hybrid') return 'Hybrid'
    return fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase()
}

const resolveAssetUrl = (path: string, backendUrl: string) => {
    if (!path) return ''
    const r2Url = process.env.R2_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || ''
    const legacyR2 = 'https://pub-a4a4bb84fc2d41cba103f4e2a8b5d185.r2.dev'

    if (path.includes(legacyR2) && r2Url) {
        return path.replace(legacyR2, r2Url)
    }

    if (path.startsWith('http')) return path

    if (path.startsWith('/uploads/') && r2Url) return `${r2Url}${path}`
    if (path.startsWith('/uploads/')) return `${backendUrl}${path}`
    return path
}

const normalizeTransmission = (transmission: string): string => {
    const lower = transmission.toLowerCase()
    if (lower === 'manual') return 'Manual'
    if (lower === 'automatic') return 'Automatic'
    if (lower === 'amt') return 'AMT'
    if (lower === 'cvt') return 'CVT'
    if (lower === 'dct') return 'DCT'
    if (lower === 'torque converter') return 'Automatic'
    return transmission.toUpperCase()
}

async function getCarExpertData() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    try {
        const [modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/models-with-pricing?limit=200`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        const modelsData = await modelsRes.json()
        const brandsData = await brandsRes.json()

        const models = modelsData.data || modelsData

        // Filter brands to only active ones
        const brands = Array.isArray(brandsData)
            ? brandsData.filter((b: any) => b.status === 'active' || !b.status)
            : []

        // Create brand map and active brands set
        const activeBrandIds = new Set<string>()
        const brandMap = brands.reduce((acc: any, brand: any) => {
            activeBrandIds.add(brand.id)
            if (brand._id) activeBrandIds.add(brand._id)

            acc[brand.id] = brand.name
            if (brand._id) acc[brand._id] = brand.name
            return acc
        }, {})

        // Process All Cars (for Budget)
        const allCars = Array.isArray(models) ? models
            .filter((model: any) => activeBrandIds.has(model.brandId)) // Filter inactive brands
            .map((model: any) => {
                const brandName = brandMap[model.brandId] || 'Unknown'
                return {
                    id: model.id,
                    name: model.name,
                    brand: model.brandId,
                    brandName: brandName,
                    image: model.heroImage ? resolveAssetUrl(model.heroImage, backendUrl) : '/placeholder-car.svg',
                    startingPrice: model.lowestPrice || 0,
                    fuelTypes: (model.fuelTypes || ['Petrol']).map(normalizeFuelType),
                    transmissions: (model.transmissions || ['Manual']).map(normalizeTransmission),
                    seating: 5,
                    launchDate: model.launchDate || 'Launched',
                    slug: `${brandName.toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
                    isNew: model.isNew || false,
                    isPopular: model.isPopular || false,
                }
            }).filter((car: any) => car.startingPrice >= 100000) : [] // Filter out cars with price < 1 lakh

        return {
            allCars,
            brands
        }
    } catch (error) {
        console.error('Error fetching car expert data:', error)
        return {
            allCars: [],
            brands: []
        }
    }
}

// JSON-LD Structured Data for Rich Snippets
const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'ProfessionalService',
            '@id': 'https://www.gadizone.com/car-expert#service',
            name: 'gadizone Car Buying Consultant',
            alternateName: 'gadizone Car Expert',
            description: 'Expert car buying consultation service in India. We help you find the best new or used car based on your needs, budget, and preferences. Avoid dealership traps and get unbiased advice.',
            url: 'https://www.gadizone.com/car-expert',
            logo: 'https://www.gadizone.com/new-gz-logo.png',
            image: 'https://www.gadizone.com/og-car-expert.jpg',
            priceRange: '₹₹',
            areaServed: {
                '@type': 'Country',
                name: 'India',
            },
            serviceType: [
                'Car Buying Consultation',
                'New Car Advice',
                'Used Car Inspection',
                'Price Negotiation Help',
                'Car Comparison Service',
            ],
        },
        {
            '@type': 'FAQPage',
            '@id': 'https://www.gadizone.com/car-expert#faq',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'How can a car buying consultant help me?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'A car buying consultant provides unbiased advice based on your specific needs, budget, and driving habits. We analyze hundreds of options, compare prices, identify the best variant, and help you avoid dealership upsells and hidden charges.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Is this service free?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'We offer a free initial consultation. For detailed analysis and end-to-end support, we have affordable plans starting at just ₹499.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Do you help with used car purchases?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! We provide used car inspection checklists, help you verify the car\'s history, and guide you on fair pricing for second-hand vehicles.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Which cities do you operate in?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Our consultation services are available pan-India. We provide remote advice over phone/video call, so you can get expert help from anywhere in India.',
                    },
                },
            ],
        },
        {
            '@type': 'BreadcrumbList',
            '@id': 'https://www.gadizone.com/car-expert#breadcrumb',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://www.gadizone.com',
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Car Expert',
                    item: 'https://www.gadizone.com/car-expert',
                },
            ],
        },
    ],
};

// Organization schema for pan-India service
const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.gadizone.com#organization',
    name: 'gadizone',
    url: 'https://www.gadizone.com',
    logo: 'https://www.gadizone.com/new-gz-logo.png',
    description: 'India\'s trusted car buying consultant platform. Expert advice for new and used car purchases across all Indian cities.',
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-99452-10466',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
        'https://www.instagram.com/gadizone',
        'https://www.facebook.com/gadizone',
    ],
};




export default async function CarExpertPage() {
    const { allCars, brands } = await getCarExpertData();

    return (
        <>
            {/* Main structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Organization schema for pan-India service */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <CarExpertClient allCars={allCars} brands={brands} />
        </>
    );
}
