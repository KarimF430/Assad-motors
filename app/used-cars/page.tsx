import { Metadata } from 'next'
import UsedCarsClient from './UsedCarsClient'

export const metadata: Metadata = {
    title: 'Used Cars in India - Buy Second Hand Cars at Best Prices | Gadizone',
    description: 'Find the best used cars in India. Search pre-owned cars by budget, age, fuel type & ownership history. Get expert tips on buying certified second hand cars. Compare prices and find your perfect car.',
    keywords: 'used cars India, second hand cars, pre-owned cars, buy used car, certified used cars, used car prices India, second hand car dealer, used car buying guide, best used cars to buy',
    openGraph: {
        title: 'Used Cars in India - Buy Second Hand Cars | Gadizone',
        description: 'Find the best used cars in India. Search by budget, age, fuel type. Get expert tips on buying certified pre-owned cars.',
        type: 'website',
        siteName: 'Gadizone',
        locale: 'en_IN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Used Cars in India - Buy Second Hand Cars | Gadizone',
        description: 'Find the best used cars in India. Compare prices and get expert buying tips.',
    },
    alternates: {
        canonical: '/used-cars',
    },
    robots: {
        index: true,
        follow: true,
    }
}

// JSON-LD Structured Data
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Used Cars in India',
    description: 'Find and compare used cars in India. Filter by budget, age, fuel type, and ownership history.',
    provider: {
        '@type': 'Organization',
        name: 'Gadizone',
        url: 'https://gadizone.com'
    },
    mainEntity: {
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What should I check before buying a used car?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Check the service history, verify ownership documents, inspect for accident damage, test drive thoroughly, and get a professional inspection done.'
                }
            },
            {
                '@type': 'Question',
                name: 'How do I determine the fair price of a used car?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Consider the car age, kilometers driven, condition, service history, and current market rates. Depreciation typically ranges from 15-20% per year for the first few years.'
                }
            },
            {
                '@type': 'Question',
                name: 'Is it better to buy from a dealer or private seller?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Dealers offer warranties and paperwork assistance but may be pricier. Private sellers offer better prices but require more due diligence on your part.'
                }
            }
        ]
    }
}

export default function UsedCarsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <UsedCarsClient />
        </>
    )
}
