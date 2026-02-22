'use client'

import React, { useState } from 'react'
import { ChevronDown, Car, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react'

const usedCarFaqs = [
    {
        question: "What are the benefits of buying a used car?",
        answer: "Used cars offer exceptional value by allowing you to own a higher-segment vehicle at a fraction of the original cost. You benefit from significantly lower depreciation rates and lower insurance premiums compared to new cars."
    },
    {
        question: "How do I verify the vehicle's history?",
        answer: "Every car should be verified through comprehensive service records and the Parivahan portal. We recommend checking for past insurance claims and ensuring the Registration Certificate (RC) is clear of any hypothecation or legal issues."
    },
    {
        question: "What documents are essential for the purchase?",
        answer: "The critical documents include the original Registration Certificate (RC), valid Insurance, PUC Certificate, and a complete Service History. For transfer, Form 29 and 30 are required to initiated the RTO process."
    },
    {
        question: "Is financing available for pre-owned cars?",
        answer: "Absolutely. We partner with leading financial institutions to offer customized loan options with competitive interest rates and flexible tenures, making premium car ownership accessible."
    },
    {
        question: "How do I check for past accidental damage?",
        answer: "A professional inspection is key. Look for inconsistent panel gaps, paint thickness variations, and signs of structural repair in the engine bay or under the boot floor. At Assad Motors, we do this for you."
    }
]

const assadMotorsFaqs = [
    {
        question: "Why trust Assad Motors for my next car?",
        answer: "Assad Motors stands for quality and transparency. Each vehicle in our curated collection undergoes a rigorous multi-point quality check, ensuring that only the finest pre-owned cars reach our showroom."
    },
    {
        question: "Do you offer any post-purchase protection?",
        answer: "Yes, we provide comprehensive warranty packages on our certified vehicles and offer clear, transparent documentation. Our commitment to you continues long after you drive off our lot."
    }
]

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className={`group border-b border-gray-100 last:border-0 transition-all duration-300 ${isOpen ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 sm:py-6 flex items-start gap-4 text-left px-4 sm:px-6 transition-all duration-300"
            >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#291e6a]/5 flex items-center justify-center text-[#291e6a] text-xs font-bold mt-0.5 group-hover:bg-[#291e6a] group-hover:text-white transition-all duration-300">
                    {index + 1}
                </span>
                <span className="flex-grow text-[15px] sm:text-lg font-semibold text-[#1c144a] leading-snug group-hover:text-[#291e6a]">
                    {question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#291e6a] border-[#291e6a]' : ''}`}>
                    <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-white' : 'text-gray-400'}`} />
                </div>
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pb-6 px-4 sm:px-[72px] pr-4 sm:pr-12">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed border-l-2 border-[#e21a22] pl-4 py-1">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function HomeFAQ() {
    return (
        <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Premium Header */}
            <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#291e6a]/5 text-[#291e6a] text-xs sm:text-sm font-bold tracking-wider uppercase mb-6">
                    <HelpCircle className="w-4 h-4" />
                    <span>Knowledge Center</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1c144a] mb-6 tracking-tight leading-tight">
                    Have Questions? <span className="text-[#e21a22]">We Have Answers.</span>
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                    Navigate your used car journey with confidence. Explore our expert guide and discover the Assad Motors difference.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                {/* Left Column: Used Car FAQs (Desktop: col-span-7) */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-gray-900 rounded-2xl shadow-lg ring-4 ring-gray-50">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-[#1c144a]">Used Car Buying Guide</h3>
                            <p className="text-sm text-gray-500">Expert tips for a secure purchase</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        {usedCarFaqs.map((faq, index) => (
                            <FaqItem key={index} index={index} {...faq} />
                        ))}
                    </div>
                </div>

                {/* Right Column: Trust & CTA (Desktop: col-span-5) */}
                <div className="lg:col-span-5 space-y-8 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-[#e21a22] rounded-2xl shadow-lg shadow-red-200/50 ring-4 ring-red-50">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-[#1c144a]">The Assad Promise</h3>
                            <p className="text-sm text-gray-500">Why thousands choose us</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-8">
                        {assadMotorsFaqs.map((faq, index) => (
                            <FaqItem key={index} index={usedCarFaqs.length + index} {...faq} />
                        ))}
                    </div>

                    {/* High-Impact CTA Card */}
                    <div className="relative group flex-grow rounded-[32px] bg-[#1c144a] p-8 sm:p-10 overflow-hidden flex flex-col justify-center">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-red-600/20 transition-all duration-500"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#291e6a]/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                        <div className="relative z-10">
                            <h4 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 leading-tight">
                                Still Need <br />Personal Assistance?
                            </h4>
                            <p className="text-blue-100/70 mb-8 max-w-xs leading-relaxed">
                                Connect with our expert consultants for a personalized car buying experience.
                            </p>

                            <button
                                onClick={() => window.open('https://wa.me/919945210466', '_blank')}
                                className="inline-flex items-center gap-3 bg-[#e21a22] hover:bg-[#c9151e] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-red-900/20 group-hover:translate-x-1"
                            >
                                <span>Chat on WhatsApp</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Background Icon */}
                        <Car className="absolute bottom-[-20%] right-[-10%] w-64 h-64 text-white/[0.03] rotate-[-15deg]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
