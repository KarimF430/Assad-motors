import { Metadata } from 'next'
import RateReviewClient from '../[model]/rate-review/RateReviewClient'

interface WriteReviewPageProps {
    params: Promise<{
        'brand-cars': string
    }>
}

export async function generateMetadata({ params }: WriteReviewPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
    const brandName = brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1)

    return {
        title: `Write a Review for ${brandName} Cars | Share Your Experience`,
        description: `Share your ownership experience reviews for ${brandName} cars. Help others make informed decisions.`,
    }
}

export default async function WriteReviewPage({ params }: WriteReviewPageProps) {
    const resolvedParams = await params
    const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')

    return (
        <RateReviewClient
            brandSlug={brandSlug}
            modelSlug=""
            carName="Select your Car"
        />
    )
}
