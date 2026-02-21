import { Metadata } from 'next'
import SellCarForm from './SellCarForm'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Sell Used Car Online - List Your Second Hand Car for Free | GadiZone',
    description: 'List your used car on GadiZone and connect with genuine buyers directly. Best resale value for second hand cars. Free listing, zero commission, and instant leads.',
    keywords: ['sell used car', 'second hand car valuation', 'sell car online', 'list my car', 'used car resale value', 'sell old car'],
    alternates: {
        canonical: 'https://www.gadizone.com/sell-car'
    },
    openGraph: {
        title: 'Sell Your Used Car Online - Zero Commission | GadiZone',
        description: 'Get the best price for your second hand car. List for free and find genuine buyers in your city.',
        url: 'https://www.gadizone.com/sell-car',
        type: 'website',
        images: ['/sell-car-og.jpg'] // You might want to add a real OG image later
    }
}

const faqs = [
    {
        q: "Is it free to list my car on GadiZone?",
        a: "Yes, absolutely! Listing your used car on GadiZone is completely free. We don't charge any commission or hidden fees from sellers."
    },
    {
        q: "How do I get the best resale value?",
        a: "To get the best price, upload clear photos of your car (exterior and interior), mention all details accurately, and keep your service records handy. Verified listings with photos attract 40% more buyers."
    },
    {
        q: "Will GadiZone buy my car directly?",
        a: "No, we are a listing platform. We connect you directly with thousands of genuine buyers interested in second-hand cars. You negotiate the price and close the deal directly."
    },
    {
        q: "How long does it take to find a buyer?",
        a: "Most authentic listings on GadiZone receive their first inquiry within 24 hours. The time to sell depends on your car's condition and asking price."
    },
    {
        q: "Can I sell a car with an outstanding loan?",
        a: "Yes, but you will need to clear the loan with your bank and get an NOC (No Objection Certificate) before transferring ownership to the buyer."
    }
]

function FAQSection() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <details key={idx} className="group bg-white rounded-xl border border-gray-200 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex items-center justify-between p-5 cursor-pointer">
                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#FF6B35] transition-colors">{faq.q}</h3>
                            <span className="ml-4 flex-shrink-0 text-gray-400">
                                <Plus className="w-5 h-5 group-open:hidden" />
                                <Minus className="w-5 h-5 hidden group-open:block text-[#FF6B35]" />
                            </span>
                        </summary>
                        <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                            {faq.a}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    )
}

export default function SellCarPage() {
    return (
        <main className="min-h-screen bg-gray-50 pb-12">
            {/* Hero Section */}
            <div className="relative bg-[#0f172a] text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2694&auto=format&fit=crop"
                        alt="Sell Used Car Background"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/20 to-gray-50/10" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[#FF6B35]/20 border border-[#FF6B35]/30 text-[#FF6B35] text-sm font-semibold mb-6 backdrop-blur-sm">
                        #1 Platform for Second Hand Cars
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                        Connect with Genuine <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C60]">Car Buyers Directly</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        List your used car for free in under 2 minutes. Get the best resale value without paying any commission.
                    </p>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#FF6B35]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <span>Zero Commission</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#FF6B35]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <span>Genuine Buyers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#FF6B35]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span>Verified Listings</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section - Overlapping Hero */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-6 md:-mt-16 z-10">
                <SellCarForm />
            </div>

            {/* Why List With Us */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why List on GadiZone?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">We make selling your car simple, transparent, and rewarding.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Maximum Reach',
                            desc: 'Your listing is visible to thousands of everyday buyers, not just dealers.',
                            icon: (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            )
                        },
                        {
                            title: 'Best Price Guarantee',
                            desc: 'Since you deal directly with buyers, there are no middleman margins eating into your profit.',
                            icon: (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )
                        },
                        {
                            title: 'Safe & Secure',
                            desc: 'We verify phone numbers and buyers to ensure you only get genuine inquiries.',
                            icon: (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            )
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center group">
                            <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200 transform group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-100/50 border-t border-gray-200">
                <FAQSection />
            </div>

            <Footer />
        </main>
    )
}
