import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import RateReviewClient from './RateReviewClient'

interface RateReviewPageProps {
    params: Promise<{
        'brand-cars': string
        model: string
    }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: RateReviewPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
    const modelSlug = resolvedParams.model

    const brandName = brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1)
    const modelName = modelSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const carName = `${brandName} ${modelName}`

    return {
        title: `Rate & Review ${carName} | Share Your Experience`,
        description: `Write a review for ${carName}. Share your driving experience, rate mileage, maintenance, safety, comfort, and help other buyers make informed decisions.`,
    }
}

export default async function RateReviewPage({ params }: RateReviewPageProps) {
    const resolvedParams = await params
    const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
    const modelSlug = resolvedParams.model

    // Format car name
    const brandName = brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1)
    const modelName = modelSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const carName = `${brandName} ${modelName}`

    return (
        <RateReviewClient
            brandSlug={brandSlug}
            modelSlug={modelSlug}
            carName={carName}
        />
    )
}
