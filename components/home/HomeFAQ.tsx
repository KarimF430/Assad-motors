'use client'

import React, { useState } from 'react'
import { ChevronDown, Car, ShieldCheck, HelpCircle, ArrowRight, MessageCircle, Sparkles, Zap } from 'lucide-react'

const allFaqs = [
    {
        category: "Buying Guide",
        icon: <Car className="w-5 h-5" />,
        items: [
            {
                question: "Is buying a used car actually worth it?",
                answer: "Absolutely! Think of it as a smart shortcut to a premium lifestyle. You can drive a high-end luxury car for the price of a basic new one, all while skipping the steep 'first-year' depreciation that hurts new car owners the most."
            },
            {
                question: "How do I know I'm not buying someone else's trouble?",
                answer: "Peace of mind is everything. We deep-dive into the car's past for you—checking every service record and verify legal status on the Parivahan portal. At Assad Motors, we only pick cars we'd be proud to drive ourselves."
            },
            {
                question: "What's the 'paperwork' headache truly like?",
                answer: "We keep it simple. All you really need are the basics (RC, Insurance, Service History). We handle the complex RTO transfers (Form 29/30) so you can focus on the excitement of your new drive, not the legal fine print."
            },
            {
                question: "How do you ensure the car hasn't been in a major accident?",
                answer: "Every car in our collection undergoes a structural integrity check. We look for signs of chassis damage, repainting, and panel misalignment to ensure you get a car that is safe and genuine."
            }
        ]
    },
    {
        category: "The Assad Promise",
        icon: <ShieldCheck className="w-5 h-5" />,
        items: [
            {
                question: "Why should I pick Assad Motors over a local dealer?",
                answer: "Because we treat every car like it's going to our own family. Every single vehicle undergoes a rigorous multi-point health check. We don't just sell cars; we curate a collection of the finest pre-owned machines in India."
            },
            {
                question: "What happens after I drive away?",
                answer: "Our relationship doesn't end at the showroom door. We offer comprehensive warranty packages and ongoing support. If you ever have a question or a concern, we're just a phone call away. You're part of the Assad family now."
            },
            {
                question: "Do you offer financing options for used cars?",
                answer: "Yes, we have tie-ups with leading banks and NBFCs to provide competitive interest rates and flexible EMIs, making your dream car purchase smooth and affordable."
            },
            {
                question: "Can I trade in my current car when buying one from Assad Motors?",
                answer: "Absolutely! We offer the best exchange values in the market. You can bring your current car for a quick valuation and use that as a down payment for your next luxury upgrade."
            }
        ]
    }
]

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="group border-b border-gray-100 last:border-0 transition-all duration-300"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 sm:py-8 flex items-center gap-4 text-left px-6 sm:px-10 transition-all duration-300"
            >
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-[#291e6a] text-white shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'}`}>
                    <HelpCircle className="w-5 h-5" />
                </div>
                <span className={`flex-grow text-lg sm:text-xl font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#1c144a]' : 'text-gray-700 group-hover:text-[#291e6a]'}`}>
                    {question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180 bg-white border-transparent shadow-sm' : 'bg-transparent text-gray-300'}`}>
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-[#291e6a]' : ''}`} />
                </div>
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pb-8 px-6 sm:px-[90px] pr-6 sm:pr-16">
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function HomeFAQ() {
    return (
        <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6">
            {/* Humanized Header */}
            <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-[#e21a22] text-xs sm:text-sm font-bold tracking-wide uppercase mb-8 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Your Car Journey, Simplified</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#1c144a] mb-6 tracking-tight leading-[1.1]">
                    Everything You Need <br />
                    <span className="text-[#e21a22]">To Know.</span>
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto text-lg sm:text-xl leading-relaxed font-medium">
                    Buying a car is a big decision. We're here to make it as transparent and human as possible.
                </p>
            </div>

            {/* Combined Single Column FAQ List */}
            <div className="space-y-12">
                {allFaqs.map((category, catIndex) => (
                    <div key={catIndex} className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="p-2 bg-[#291e6a]/5 rounded-lg text-[#291e6a]">
                                {category.icon}
                            </div>
                            <h3 className="text-xl font-extrabold text-[#1c144a] uppercase tracking-widest text-sm">{category.category}</h3>
                        </div>

                        <div className="border-t border-gray-100">
                            {category.items.map((item, index) => (
                                <FaqItem key={index} index={index} {...item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>


            {/* Mobile friendly note */}
            <p className="text-center mt-12 text-gray-400 text-sm font-medium">
                Prefer a direct call? <a href="tel:+919945210466" className="text-[#1c144a] underline">+91 99452 10466</a>
            </p>
        </div>
    )
}

