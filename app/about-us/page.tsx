import { Metadata } from 'next'
import PageSection from '@/components/common/PageSection'

export const metadata: Metadata = {
    title: 'About gadizone — Honest Car Research for Indian Buyers',
    description: 'gadizone is an independent car research platform built for Indian buyers. We cover prices, specs, expert reviews, and real-world mileage for cars from Maruti Suzuki, Hyundai, Tata, and more.',
    alternates: {
        canonical: '/about-us',
    },
}

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageSection background="white" maxWidth="lg">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-10 my-8">
                    <div className="prose prose-gray max-w-none">

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">About gadizone</h1>
                        <p className="text-gray-500 text-sm mb-8">India&apos;s independent car research platform</p>

                        {/* Origin Story */}
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Buying a car in India is one of the biggest financial decisions most families make — and yet, for years, the information available to buyers was either buried in spec sheets, padded with dealer bias, or written in language that assumed you already knew what a torque figure meant. gadizone was built to fix that.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            We started with a simple question: <em>what would a genuinely helpful car research platform look like?</em> Not one that pushes you toward a particular dealer or a sponsored model, but one that gives you the same honest, complete picture that a knowledgeable friend in the automotive industry would give you. That&apos;s the standard we hold ourselves to.
                        </p>

                        {/* What We Cover */}
                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">What We Cover</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Right now, gadizone covers cars from three of India&apos;s most popular brands — <strong>Maruti Suzuki</strong>, <strong>Hyundai</strong>, and <strong>Tata Motors</strong> — across 43 models and all their variants. We chose to go deep rather than wide. Instead of listing every car on the market with thin, copy-pasted specs, we focus on giving you genuinely useful information for each model we cover.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            For every model, you&apos;ll find:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                            <li><strong>Accurate, up-to-date pricing</strong> — ex-showroom prices for all variants, with our on-road price calculator that factors in RTO charges, road tax, and insurance for your city.</li>
                            <li><strong>Real-world mileage data</strong> — not just the ARAI-claimed figure, but city and highway real-world estimates so you know what to actually expect.</li>
                            <li><strong>Expert reviews</strong> — written analysis that covers who the car is for, what it does well, and where it falls short. We don&apos;t just list features; we tell you whether they matter.</li>
                            <li><strong>Variant-by-variant breakdowns</strong> — so you can figure out which trim gives you the features you actually need without paying for ones you don&apos;t.</li>
                            <li><strong>Side-by-side comparisons</strong> — compare any two cars across price, specs, and features to make your shortlist easier to navigate.</li>
                            <li><strong>FAQs and owner insights</strong> — real questions that real buyers ask, answered honestly.</li>
                        </ul>

                        {/* Our Approach */}
                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Our Editorial Approach</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We don&apos;t accept payment for reviews or rankings. Every expert verdict on gadizone is based on publicly available specifications, manufacturer data, and our editorial team&apos;s analysis of the Indian market. If a car has a weak third row, we say so. If a variant&apos;s price premium over the base model isn&apos;t justified by its additional features, we point that out.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            We also try to write for the actual Indian buyer — someone navigating monsoon roads, tight city parking, school runs, and the occasional highway trip. That context matters. A car that&apos;s excellent on European roads might have terrible ground clearance for Indian conditions. We factor that in.
                        </p>

                        {/* Car Expert Service */}
                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">The gadizone Car Expert</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Beyond research content, we also offer a <strong>Car Expert consultation service</strong> — a one-on-one session with an automotive expert who can help you narrow down your options based on your specific needs, budget, and priorities. This is particularly useful if you&apos;re a first-time buyer, if you&apos;re choosing between very different body types (say, an SUV vs. a sedan), or if you want someone to walk you through the on-road price calculation for your city.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Our experts are not affiliated with any dealership. They don&apos;t earn a commission on what you buy. Their only job is to help you make a decision you&apos;ll be happy with three years from now.
                        </p>

                        {/* Why Trust Us */}
                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Why Trust gadizone?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <h3 className="font-semibold text-blue-900 mb-2">No Dealer Bias</h3>
                                <p className="text-blue-800 text-sm leading-relaxed">We don&apos;t have referral agreements with dealerships. Our recommendations are based purely on what makes sense for the buyer.</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                <h3 className="font-semibold text-green-900 mb-2">India-Specific Context</h3>
                                <p className="text-green-800 text-sm leading-relaxed">Every review and comparison is written with Indian road conditions, fuel prices, and ownership costs in mind — not adapted from global content.</p>
                            </div>
                            <div className="bg-[#f0eef5] rounded-lg p-4 border border-[#e8e6f0]">
                                <h3 className="font-semibold text-[#1c144a] mb-2">Transparent Pricing</h3>
                                <p className="text-[#291e6a] text-sm leading-relaxed">Our on-road price calculator shows you exactly how the final price is built up — RTO, insurance, and accessories — so there are no surprises at the dealership.</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                <h3 className="font-semibold text-purple-900 mb-2">Depth Over Breadth</h3>
                                <p className="text-purple-800 text-sm leading-relaxed">We cover fewer cars than some platforms, but we cover them properly. Every model page has real analysis, not just a spec table.</p>
                            </div>
                        </div>

                        {/* Who We're For */}
                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Who gadizone Is For</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            gadizone is for anyone who wants to make a well-informed car purchase without spending weeks reading forum threads and decoding manufacturer brochures. Specifically:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                            <li><strong>First-time buyers</strong> who need a clear, jargon-free explanation of what different body types, fuel options, and transmission choices actually mean for daily life.</li>
                            <li><strong>Upgraders</strong> who are moving from a hatchback to an SUV and want to understand what they&apos;re actually gaining (and giving up) in the process.</li>
                            <li><strong>Family buyers</strong> who need to balance space, safety ratings, running costs, and resale value — often with a fixed budget.</li>
                            <li><strong>Research-oriented buyers</strong> who want to go into a dealership already knowing the on-road price, the best variant for their needs, and the right questions to ask.</li>
                        </ul>

                        {/* Contact CTA */}
                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Get in Touch</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have a question about a specific car, a suggestion for content we should cover, or feedback on something we got wrong, we genuinely want to hear from you. We&apos;re a small team and we read every message.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-2">
                            You can reach us through our <a href="/contact-us" className="text-blue-600 hover:underline">Contact page</a>. We typically respond within one business day.
                        </p>

                        {/* Founder Bio */}
                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Meet the Founder</h2>
                        <div className="flex items-start gap-4 bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
                            <div style={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #dc2626, #291e6a)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                                flexShrink: 0,
                            }}>
                                KB
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-base mb-0.5">Karim Beldaar</h3>
                                <p className="text-sm text-[#1c144a] mb-2">Founder, gadizone · Mumbai, India</p>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Karim built gadizone after spending months trying to find honest, India-specific car research online and coming up short.
                                    With a background in software engineering and a genuine interest in the Indian automotive market, he set out to create
                                    the kind of platform he wished had existed when he was buying his first car — one that explains things clearly,
                                    prices things accurately, and never pushes a particular brand or dealer.
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed mt-2">
                                    You can reach him directly at{' '}
                                    <a href="mailto:Karim0beldaar@gmail.com" className="text-[#1c144a] hover:underline">
                                        Karim0beldaar@gmail.com
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-gray-500 text-sm">
                                gadizone is an independent automotive research platform based in India. We are not affiliated with any car manufacturer or dealership network.
                            </p>
                        </div>

                    </div>
                </div>
            </PageSection>
        </div>
    )
}
