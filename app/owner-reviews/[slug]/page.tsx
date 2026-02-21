'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Fuel, Wrench, Banknote, Shield, PenTool } from 'lucide-react'
import OwnerReviewCard, { OwnerReview } from '@/components/reviews/OwnerReviewCard'
import OwnerReviewSummary from '@/components/reviews/OwnerReviewSummary'
import Footer from '@/components/Footer'
import JsonLd from '@/components/seo/JsonLd'

// Mock Data Generation (to be replaced with API)
const getMockData = (slug: string) => {
    // In real app, slug would be like 'tata-nexon'
    const carName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

    return {
        carName,
        rating: 4.2,
        totalReviews: 128,
        recommendation: 84,
        summaryBreakdown: [
            { aspect: 'Mileage', score: 8.5, icon: <Fuel className="w-4 h-4" /> },
            { aspect: 'Maintenance', score: 7.8, icon: <Wrench className="w-4 h-4" /> },
            { aspect: 'Comfort', score: 9.0, icon: <Shield className="w-4 h-4" /> }, // Using Shield as placeholder for Comfort
            { aspect: 'Value', score: 8.8, icon: <Banknote className="w-4 h-4" /> },
        ],
        reviews: [
            {
                id: '1',
                authorName: 'Rahul Sharma',
                city: 'Mumbai',
                ownershipDuration: '1.5 Years',
                variant: 'XZ Plus Petrol',
                kilometersDriven: '12,500 km',
                rating: 4.5,
                title: 'Great car for city drives, mileage could be better',
                review: `I have been driving the ${carName} for over a year now in Mumbai traffic. The comfort is top-notch and the suspension handles potholes easily. However, the city mileage is around 10-11 kmpl which is slightly lower than expected. Highway performance is stable and confidence-inspiring.`,
                pros: ['Excellent Ride Quality', 'Spacious Cabin', 'Safety Rating'],
                cons: ['City Mileage', 'Touchscreen lag sometimes'],
                mileage: { city: '10.5 kmpl', highway: '15.2 kmpl' }
            },
            {
                id: '2',
                authorName: 'Sneha Gupta',
                city: 'Bangalore',
                ownershipDuration: '6 Months',
                variant: 'Creative AMT',
                kilometersDriven: '4,200 km',
                rating: 4.0,
                title: 'Perfect family SUV, but AMT is jerky',
                review: 'The car looks amazing and feels safe. My family loves the space. The only downside is the AMT gearbox which feels a bit jerky in bumper to bumper usage. Otherwise, it is a solid package.',
                pros: ['Road Presence', 'Build Quality'],
                cons: ['AMT Jerkiness', 'Engine Noise at high RPM'],
                mileage: { city: '11 kmpl', highway: '16 kmpl' }
            },
            {
                id: '3',
                authorName: 'Vikram Singh',
                city: 'Delhi',
                ownershipDuration: '2 Years',
                variant: 'Diesel Manual',
                kilometersDriven: '28,000 km',
                rating: 4.8,
                title: 'Diesel engine is a gem!',
                review: 'If you drive a lot, get the diesel. It is punchy and gives me 18+ kmpl easily on my Noida commute. Service costs are reasonable too.',
                pros: ['Diesel Punch', 'Highway Mileage', 'Resale Value'],
                cons: ['Hard Clutch'],
                mileage: { city: '16 kmpl', highway: '21 kmpl' }
            }
        ] as OwnerReview[]
    }
}

export default function OwnerReviewsPage() {
    const params = useParams()
    const slug = typeof params?.slug === 'string' ? params.slug : 'tata-nexon' // Default fallback

    const data = getMockData(slug)
    const currentYear = new Date().getFullYear()

    // Structured Data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": data.carName,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": data.rating,
            "reviewCount": data.totalReviews,
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": data.reviews.map(r => ({
            "@type": "Review",
            "author": { "@type": "Person", "name": r.authorName },
            "datePublished": "2024-01-15", // Mock date
            "reviewBody": r.review,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": r.rating,
                "bestRating": "5",
                "worstRating": "1"
            }
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-16">
            <JsonLd data={jsonLd} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb & Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-red-600 mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                        {data.carName} <span className="text-red-600">Real Owner Reviews</span>
                    </h1>
                    <p className="text-gray-600">
                        Read honest feedback from {data.totalReviews} verified owners about mileage, maintenance, and driving experience.
                    </p>
                </div>

                {/* Summary Section */}
                <div className="mb-10">
                    <OwnerReviewSummary
                        overallRating={data.rating}
                        totalReviews={data.totalReviews}
                        breakdown={data.summaryBreakdown}
                        recommendationPercentage={data.recommendation}
                    />
                </div>

                {/* Filter/Action Bar (Placeholder) */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 gap-4">
                    <div className="text-gray-900 font-semibold">
                        Showing {data.reviews.length} Featured Reviews
                    </div>
                    <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl">
                        <PenTool className="w-4 h-4" />
                        Write a Review
                    </button>
                </div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.reviews.map((review) => (
                        <OwnerReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}
