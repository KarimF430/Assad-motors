
import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Star } from 'lucide-react'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'

export const metadata: Metadata = {
    title: 'Expert Car Reviews & Road Tests | gadizone',
    description: 'In-depth car reviews, road tests, and verdicts from gadizone experts. Unbiased analysis of performance, comfort, features, and value for money.',
}

// Mock Data for Initial Development
const REVIEWS = [
    {
        id: '1',
        slug: 'tata-curvv-ev-review',
        title: 'Tata Curvv EV Review: The Coupe SUV That Changes Everything?',
        excerpt: 'The Tata Curvv EV brings a fresh coupe-SUV design to the mass market. But does it have the performance and range to back up its stunning looks? We drove it for 500km to find out.',
        author: 'Haji Karim',
        date: 'Oct 15, 2024',
        rating: 8.5,
        image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/139651/curvv-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
        verdict: 'A bold design statement backed by solid EV tech.'
    },
    {
        id: '2',
        slug: 'mahindra-thar-roxqn-review',
        title: 'Mahindra Thar Roxx Review: The 5-Door Family Off-Roader',
        excerpt: 'The 5-door Thar Roxx aims to be the only car you need. It retains the go-anywhere capability but adds family comfort. Is it refined enough for the daily commute?',
        author: 'Rajesh Kumar',
        date: 'Oct 10, 2024',
        rating: 9.0,
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?q=80',
        verdict: 'The lifestyle SUV that finally makes practical sense.'
    },
    {
        id: '3',
        slug: 'hyundai-creta-n-line-review',
        title: 'Hyundai Creta N Line Review: Genuine Sportiness or Cosmetic Job?',
        excerpt: 'With stiffer suspension, a throaty exhaust, and WRC-inspired looks, the Creta N Line promises excitement. Does it deliver on the road?',
        author: 'Haji Karim',
        date: 'Oct 05, 2024',
        rating: 8.2,
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/creta-n-line-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80',
        verdict: 'Fun, fast, and still a practical family SUV.'
    },
    {
        id: '4',
        slug: 'maruti-swift-2024-review',
        title: '2024 Maruti Swift Review: Can It Maintain Its Crown?',
        excerpt: 'The new Swift gets a 3-cylinder engine and significant safety upgrades. We test the mileage and performance to see if it remains the king of hatchbacks.',
        author: 'Amit Singh',
        date: 'Sep 28, 2024',
        rating: 7.8,
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/158599/swift-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
        verdict: 'Efficiency gains are real, but enthusiastic drivers might miss the old engine.'
    }
]

export default function ReviewsPage() {
    return (
        <>
            <div className="min-h-screen bg-gray-50 font-sans">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Expert <span className="text-red-600">Reviews</span> & Road Tests
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Deep-dive analysis, real-world mileage tests, and definitive verdicts from the gadizone expert team.
                        </p>
                    </div>

                    {/* Featured Review (First Item) */}
                    <div className="mb-16">
                        <Link href={`/reviews/${REVIEWS[0].slug}`} className="group relative block rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
                            <div className="md:flex h-[500px]">
                                <div className="md:w-2/3 h-64 md:h-full relative overflow-hidden">
                                    <img
                                        src={REVIEWS[0].image}
                                        alt={REVIEWS[0].title}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Latest Review
                                    </div>
                                </div>
                                <div className="md:w-1/3 bg-gray-900 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                        <span className="text-yellow-400 font-bold text-xl">{REVIEWS[0].rating}/10</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-red-400 transition-colors">
                                        {REVIEWS[0].title}
                                    </h2>
                                    <p className="text-gray-400 mb-6 line-clamp-3">
                                        {REVIEWS[0].excerpt}
                                    </p>
                                    <div className="flex items-center text-gray-500 text-sm mt-auto">
                                        <User className="w-4 h-4 mr-2" />
                                        <span className="mr-4">{REVIEWS[0].author}</span>
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>{REVIEWS[0].date}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Reviews Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {REVIEWS.slice(1).map((review) => (
                            <Link key={review.id} href={`/reviews/${review.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                                <div className="h-56 relative overflow-hidden">
                                    <img
                                        src={review.image}
                                        alt={review.title}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="font-bold text-gray-900">{review.rating}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                                        {review.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                                        {review.excerpt}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <User className="w-3 h-3 mr-1" />
                                            {review.author}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {review.date}
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Verdict</span>
                                        <p className="text-sm font-medium text-gray-800 italic">"{review.verdict}"</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </main>
            </div>
            <Breadcrumb items={[{ label: 'Reviews' }]} />
            <Footer />
        </>
    )
}
