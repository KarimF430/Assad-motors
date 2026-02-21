'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight, Target, Zap, Users, Lightbulb, CheckCircle, Mail, Phone, ArrowLeft, Brain, Sparkles } from 'lucide-react'
import PageContainer, { PageSection } from '@/components/layout/PageContainer'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'

export default function FounderPage() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <>
            <div className="min-h-screen bg-[#F8F8F8]">
                {/* Hero Section - Matches Model Page Header Style */}
                <div className="bg-white border-b border-gray-100">
                    <PageContainer maxWidth="lg">
                        <PageSection spacing="normal" className="py-8 md:py-12">

                            {/* Hero Layout: Image on Right (Desktop), First on Mobile */}
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                                {/* Content Side */}
                                <div className="flex-1 order-2 lg:order-1">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                                        Me & <span className="text-orange-600">Gadizone</span>
                                    </h1>

                                    {/* Intro Quote - Model Page Style */}
                                    <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                                        Gadizone exists because I saw a clear gap between how cars are sold online and how people actually make decisions.
                                    </p>

                                    {/* Key Stats - Matching Model Page Spec Pills */}
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                            <Brain className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm font-medium text-gray-700">Product-First</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                            <Zap className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm font-medium text-gray-700">System-Driven</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                            <Users className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm font-medium text-gray-700">User-Centric</span>
                                        </div>
                                    </div>

                                    {/* Contact CTAs - Model Page Button Style */}
                                    <div className="flex flex-wrap gap-3">
                                        <a href="mailto:karim0beldaar@gmail.com" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-md shadow-orange-600/20">
                                            <Mail className="w-4 h-4" />
                                            Email Me
                                        </a>
                                        <a href="tel:9945210466" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                                            <Phone className="w-4 h-4" />
                                            +91 99452 10466
                                        </a>
                                    </div>
                                </div>

                                {/* Image Side - Smaller Card */}
                                <div className="w-full sm:w-48 lg:w-56 flex-shrink-0 order-1 lg:order-2">
                                    <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                                        <div className="relative aspect-square w-full bg-gray-100">
                                            <Image
                                                src="/DSC06261_Original 2.jpg"
                                                alt="Haji Karim"
                                                fill
                                                className="object-cover"
                                                priority
                                                sizes="(max-width: 768px) 100vw, 320px"
                                            />
                                        </div>
                                        <div className="p-4 text-center border-t border-gray-50">
                                            <h2 className="text-lg font-bold text-gray-900">Haji Karim</h2>
                                            <p className="text-orange-600 font-medium text-sm">Founder & Product Architect</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageSection>
                    </PageContainer>
                </div>

                {/* Main Content Sections - Matches Model Page Section Styling */}
                <PageContainer maxWidth="lg">
                    {/* Section 1: The Builder's Mindset */}
                    <PageSection spacing="normal" className="py-10">
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">The Builder's Mindset</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-base">
                                I come from a builder's mindset — <span className="font-semibold text-gray-800">product-first, user-first, and system-driven</span>. While working hands-on across product thinking, full-stack development, data structuring, and UX, I repeatedly noticed the same issue in the automotive space: users aren't confused because they lack information, they're confused because information is <span className="font-semibold text-gray-800">poorly organised, biased, and overwhelming</span>.
                            </p>
                            <p className="text-orange-600 font-bold text-lg mt-4">
                                I built Gadizone to solve that.
                            </p>
                        </div>
                    </PageSection>

                    {/* Section 2: A Decision Platform */}
                    <PageSection spacing="tight" className="pb-10">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Target className="w-6 h-6 text-orange-600" />
                                    <h3 className="text-lg font-bold text-gray-900">A Decision Platform</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Instead of creating another car listing or content-heavy website, I designed Gadizone as a <span className="font-semibold text-gray-800">decision platform</span> — one that helps users think clearly, compare logically, and arrive at confident choices without sales pressure or manipulation.
                                </p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Zap className="w-6 h-6 text-orange-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Built from Ground Up</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    I built Gadizone independently. From ideation to execution, every part of the platform reflects direct involvement: <span className="font-semibold text-gray-800">information architecture, comparison logic, user journeys, performance, and scalability</span>.
                                </p>
                            </div>
                        </div>
                    </PageSection>

                    {/* Section 3: Key Focus Areas - Pill Style matching Model Page Specs */}
                    <PageSection spacing="tight" className="pb-10">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Key Focus Areas</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Information Architecture', 'Comparison Logic', 'User Journeys', 'Performance', 'Scalability', 'Real User Behaviour'].map((item) => (
                                <span key={item} className="inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </PageSection>

                    {/* Section 4: Bridging Disciplines */}
                    <PageSection spacing="tight" className="pb-10">
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Bridging Disciplines</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-base">
                                My background allows me to bridge multiple disciplines: I <span className="font-semibold text-gray-800">think like a product manager</span>, <span className="font-semibold text-gray-800">build like an engineer</span>, and <span className="font-semibold text-gray-800">evaluate like a user</span>. This combination shaped Gadizone into a system where data, content, and experience work together instead of competing for attention.
                            </p>
                        </div>
                    </PageSection>

                    {/* Section 5: What Gadizone Solves - Dark Highlight Card */}
                    <PageSection spacing="tight" className="pb-10">
                        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles className="w-6 h-6 text-orange-400" />
                                    <h3 className="text-lg font-bold text-orange-400 uppercase tracking-wider">What Gadizone Solves</h3>
                                </div>
                                <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed mb-4">
                                    Decision paralysis.
                                </p>
                                <p className="text-gray-300 leading-relaxed">
                                    It reduces cognitive load by translating complex automotive data into structured, understandable insights. It prioritises <span className="text-white font-medium">trust, clarity, and logic</span> over traffic-driven incentives.
                                </p>
                            </div>
                        </div>
                    </PageSection>

                    {/* Section 6: Long-Term Vision */}
                    <PageSection spacing="tight" className="pb-10">
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">The Long-Term Vision</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-base">
                                Gadizone reflects how I build products: <span className="font-semibold text-gray-800">quietly, intentionally, and with long-term vision</span>. It is designed as a foundation — not just for car discovery today, but for future AI-assisted consultation and intelligent decision systems that scale responsibly.
                            </p>
                        </div>
                    </PageSection>

                    {/* Closing Statement */}
                    <PageSection spacing="tight" className="pb-16">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 md:p-8 border border-orange-100">
                            <p className="text-lg md:text-xl font-semibold text-gray-900 leading-relaxed mb-3">
                                For me, Gadizone is not just a project.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                It is proof of how thoughtful product design, grounded execution, and user-centric thinking can fix real problems — and a starting point for building <span className="font-semibold text-gray-900">clarity-first digital platforms at scale</span>.
                            </p>
                            <div className="mt-6 pt-6 border-t border-orange-200/50 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-600/30">HK</div>
                                <div>
                                    <div className="font-bold text-gray-900">Haji Karim</div>
                                    <div className="text-orange-600 text-sm font-medium">Founder, Gadizone</div>
                                </div>
                            </div>
                        </div>
                    </PageSection>
                </PageContainer>
            </div>
            <Breadcrumb items={[{ label: 'Founder' }]} />
            <Footer />
        </>
    )
}
