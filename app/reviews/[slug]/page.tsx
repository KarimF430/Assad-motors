
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, Share2, Star, CheckCircle2, AlertCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import ReviewRenderer from '@/components/reviews/ReviewRenderer'
import ProsCons from '@/components/reviews/ProsCons'

// Mock Data for a specific review (Tata Curvv EV)
const MOCK_REVIEW = {
    id: '1',
    slug: 'tata-curvv-ev-review',
    title: 'Tata Curvv EV Review: The Coupe SUV That Changes Everything?',
    excerpt: 'The Tata Curvv EV brings a fresh coupe-SUV design to the mass market. But does it have the performance and range to back up its stunning looks? We drove it for 500km to find out.',
    author: {
        name: 'Haji Karim',
        role: 'Senior Editor',
        image: '/api/placeholder/100/100' // Placeholder
    },
    publishDate: 'Oct 15, 2024',
    updatedDate: 'Oct 16, 2024',
    heroImage: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/139651/curvv-exterior-right-front-three-quarter.jpeg?isig=0&q=80',

    // The Verdict
    rating: 8.5,
    verdictTitle: 'A Game Changer',
    verdictSummary: 'The Tata Curvv EV is more than just a pretty face. It offers a usable real-world range of 350km+, a tech-loaded cabin, and a ride quality that handles Indian roads with aplomb. While the rear headroom is slightly compromised by the coupe roofline, it remains a compelling package for those who want to stand out.',

    pros: [
        'Stunning Concept-like Design',
        'Real-world range of 350-380km',
        'Feature-loaded Cabin (Panoroamic roof, ADAS Level 2)',
        'Comfortable Ride Quality'
    ],
    cons: [
        'Rear headroom is tight for tall passengers',
        'Plastic quality in lower cabin feels average',
        'Charging curve could be faster'
    ],

    // Content Blocks
    contentBlocks: [
        {
            id: 'p1',
            type: 'paragraph',
            content: 'The Indian automotive market has long been dominated by boxy SUVs. They are practical, rugged, and impose a certain presence. However, they rarely scream "style." Enter the Tata Curvv EV. It is not just another SUV; it is a statement. With its sloping roofline and high-riding stance, it brings the "Coupe SUV" body style—previously reserved for luxury brands like BMW and Mercedes—to the mass market.'
        },
        {
            id: 'h1',
            type: 'heading1',
            content: 'Exterior: Looks That Kill'
        },
        {
            id: 'p2',
            type: 'paragraph',
            content: 'There is no denying it—the Curvv looks spectacular. The front fascia, with its connected DRL bar and parametric grille, is distinctly Tata but evolved. The side profile is where the magic happens. The roofline dips aggressively past the B-pillar, merging into a short, stubby boot lid. It looks fast even when standing still. The 18-inch alloy wheels fill the arches well, giving it a planted stance.'
        },
        {
            id: 'img1',
            type: 'image',
            imageUrl: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/139651/curvv-exterior-rear-view.jpeg?isig=0&q=80',
            imageCaption: 'The sloping roofline is the defining feature of the Curvv.'
        },
        {
            id: 'h2',
            type: 'heading1',
            content: 'Interior & Features'
        },
        {
            id: 'p3',
            type: 'paragraph',
            content: 'Step inside, and you are greeted by a cabin that feels modern and airy. The dashboard is dominated by a massive 12.3-inch touchscreen infotainment system and a 10.25-inch digital instrument cluster. The 4-spoke steering wheel with the illuminated logo looks premium.'
        },
        {
            id: 'quote1',
            type: 'quote',
            content: 'The 4-spoke steering wheel with the illuminated logo looks premium and feels great to hold.'
        },
        {
            id: 'h3',
            type: 'heading2',
            content: 'Key Features'
        },
        {
            id: 'list1',
            type: 'bulletList',
            content: 'Panoramic Sunroof (Voice Assisted)\nLevel 2 ADAS with 20 functionalities\nVentilated Front Seats\n360-degree Camera\nJBL Sound System with 9 speakers'
        },
        {
            id: 'h4',
            type: 'heading1',
            content: 'Performance & Range'
        },
        {
            id: 'p4',
            type: 'paragraph',
            content: 'We tested the Long Range variant with the 55kWh battery pack. Tata claims a range of 585km, but in our mix of city and highway driving, we achieved a respectable 360-380km. The motor puts out 167PS and 215Nm, which is enough to propel the Curvv from 0-100kmph in just 8.6 seconds.'
        }
    ]
}

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    // Real implementation: Fetch from backend using slug
    // For now using mock
    const review = MOCK_REVIEW

    if (slug !== review.slug) return { title: 'Review Not Found' }

    return {
        title: `${review.title} | gadizone Expert Review`,
        description: review.excerpt,
        openGraph: {
            images: [review.heroImage]
        }
    }
}

export default async function ReviewDetailPage({ params }: PageProps) {
    const { slug } = await params
    // In real app: Fetch data here
    // const review = await fetchReview(slug)
    const review = MOCK_REVIEW // Mock for now

    if (slug !== review.slug && slug !== 'test') { // Allow 'test' for viewing template
        // notFound() 
        // Commented out to allow viewing the template with any slug for demo
    }

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900">

            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full">
                <div className="absolute inset-0">
                    <img
                        src={review.heroImage}
                        alt={review.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
                            Expert Review
                        </span>
                        <span className="text-gray-300 text-sm flex items-center">
                            <Calendar className="w-4 h-4 mr-1" /> {review.publishDate}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                        {review.title}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-300" />
                            </div>
                            <div>
                                <div className="text-white font-bold">{review.author.name}</div>
                                <div className="text-gray-400 text-xs">{review.author.role}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">

                {/* The Verdict Box */}
                <div className="bg-white rounded-2xl shadow-xl border-t-4 border-red-600 p-8 mb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-shrink-0 text-center md:text-left">
                            <div className="w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center mb-2 mx-auto md:mx-0">
                                <span className="text-4xl font-extrabold text-white">{review.rating}</span>
                                <span className="text-gray-400 text-lg ml-1">/10</span>
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">gadizone Rating</div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                The Verdict
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {review.verdictSummary}
                            </p>
                        </div>
                    </div>

                    <hr className="my-8 border-gray-100" />

                    {/* Pros & Cons */}
                    <ProsCons pros={review.pros} cons={review.cons} />
                </div>

                {/* Main Content */}
                <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-red-600 mb-16">
                    <ReviewRenderer blocks={review.contentBlocks as any} />
                </div>

                {/* Share / Author Footer */}
                <div className="border-t border-gray-200 pt-8 pb-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                            <User className="w-full h-full p-3 text-gray-400" />
                        </div>
                        <div>
                            <div className="text-gray-900 font-bold text-lg">Written by {review.author.name}</div>
                            <div className="text-gray-500 text-sm">Reviewing cars since 2015</div>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-bold transition-colors">
                        <Share2 className="w-5 h-5" />
                        Share this Review
                    </button>
                </div>

            </main>

            <Footer />
        </div>
    )
}
