
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.assadmotors.com'

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'assadmotors',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        sameAs: [
            'https://facebook.com/assadmotors',
            'https://twitter.com/assadmotors',
            'https://instagram.com/assadmotors',
            'https://youtube.com/assadmotors'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-99452-10466',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: 'en'
        }
    }
}

export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'assadmotors',
        url: BASE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    }
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.item.startsWith('http') ? item.item : `${BASE_URL}${item.item}`
        }))
    }
}

export function generateCarProductSchema(car: {
    name: string
    brand: string
    image: string
    description?: string
    lowPrice: number
    highPrice?: number
    currency?: string
    rating?: number
    reviewCount?: number
    reviews?: any[]
    bodyType?: string
    fuelType?: string
    transmission?: string
    seatingCapacity?: number
    modelDate?: string
}) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'Car',
        name: car.name,
        image: car.image?.startsWith('http') ? car.image : `${BASE_URL}${car.image}`,
        description: car.description,
        brand: {
            '@type': 'Brand',
            name: car.brand
        },
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: car.currency || 'INR',
            lowPrice: car.lowPrice,
            highPrice: car.highPrice || car.lowPrice,
            offerCount: 1,
            availability: 'https://schema.org/InStock'
        },
        model: car.name,
        vehicleConfiguration: car.description ? car.description.substring(0, 150) : undefined,
        bodyType: car.bodyType,
        fuelType: car.fuelType,
        vehicleTransmission: car.transmission,
        seatingCapacity: car.seatingCapacity,
        productionDate: car.modelDate
    }

    if (car.rating && car.rating > 0) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: car.rating,
            reviewCount: car.reviewCount || 1,
            bestRating: '5',
            worstRating: '1'
        }
    }

    if (car.reviews && car.reviews.length > 0) {
        schema.review = car.reviews.map((review: any) => ({
            '@type': 'Review',
            author: {
                '@type': 'Person',
                name: review.userName || review.user?.name || 'Anonymous'
            },
            datePublished: review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : undefined,
            reviewBody: review.comment || review.content,
            reviewRating: {
                '@type': 'Rating',
                ratingValue: review.rating || 5,
                bestRating: '5',
                worstRating: '1'
            }
        }))
    }

    return schema
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    }
}

export function generateFinancialProductSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "Car Loan EMI Calculator",
        "description": "Calculate your monthly car loan payments with our free EMI calculator. Compare interest rates and loan tenures.",
        "brand": {
            "@type": "Brand",
            "name": "assadmotors"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        },
        "annualPercentageRate": "8.5",
        "feesAndCommissionsSpecification": "No hidden fees"
    }
}
