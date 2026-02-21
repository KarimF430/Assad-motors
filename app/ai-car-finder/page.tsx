import { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, MessageSquare, Search, Zap, CheckCircle2, ArrowRight } from 'lucide-react'
import JsonLd from '@/components/seo/JsonLd'

export const metadata: Metadata = {
    title: 'AI Car Finder - Find Your Perfect Car in Seconds | gadizone',
    description: 'Confused about which car to buy? Use gadizone AI Car Finder. Our advanced AI assistant analyzes your needs, budget, and preferences to recommend the perfect car for you.',
    keywords: 'AI car finder, car buying assistant, best car for me, find my car, car recommendation engine, artificial intelligence car search',
    openGraph: {
        title: 'AI Car Finder - Your Personal Car Buying Expert',
        description: 'Stop searching, start driving. Let gadizone AI find the perfect car for your needs and budget in seconds.',
        images: ['/ai-car-finder-og.jpg'], // Ensure this image exists or use a generic one
    },
}

export default function AICarFinderLandingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "gadizone AI Car Finder",
        "applicationCategory": "LifestyleApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        },
        "description": "An intelligent car recommendation engine that helps users find their perfect vehicle based on budget, usage, and preferences.",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
        }
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <JsonLd data={jsonLd} />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gray-900 pt-20 pb-24 lg:pt-32 lg:pb-40">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 mb-8 animate-fade-in-up">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Powered by Advanced AI</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Dream Car</span> <br className="hidden md:block" /> Without the Confusion.
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Overwhelmed by choices? Tell our AI about your lifestyle, budget, and driving habits. We'll find the perfect match for you in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/ai-chat" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-900/50 flex items-center justify-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Start Chatting with AI
                        </Link>
                        <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all border border-gray-700">
                            How it Works
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="how-it-works" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why use AI Car Finder?</h2>
                        <p className="text-lg text-gray-600">Takes the guesswork out of car buying with data-backed recommendations.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Search className="w-8 h-8 text-blue-600" />,
                                title: 'Personalized Search',
                                desc: 'Forget filters. Just say "I need a safe family car for city driving under 15 Lakhs" and get instant results.'
                            },
                            {
                                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                                title: 'Instant Comparisons',
                                desc: 'Not sure between Nexon and Brezza? Ask the AI to compare them based on your specific priorities.'
                            },
                            {
                                icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
                                title: 'Real Owner Insights',
                                desc: 'Our AI aggregates thousands of owner reviews to warn you about hidden pros and cons.'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example Prompts / Quick Start */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Try these prompts</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            "Best SUV under 15 Lakhs providing high mileage?",
                            "Safest car for highway driving under 20 Lakhs?",
                            "Electric car with range over 400km?",
                            "Low maintenance family car for 5 people?",
                            "Sporty sedan under 30 Lakhs with sunroof?"
                        ].map((prompt, idx) => (
                            <Link
                                key={idx}
                                href={`/ai-chat?message=${encodeURIComponent(prompt)}&autoSend=true`}
                                className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
                            >
                                <span className="text-gray-700 font-medium group-hover:text-blue-700">"{prompt}"</span>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your perfect drive?</h2>
                    <p className="text-xl text-gray-400 mb-8">Join thousands of happy owners who found their car with gadizone AI.</p>
                    <Link href="/ai-chat" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
                        Launch AI Assistant <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
