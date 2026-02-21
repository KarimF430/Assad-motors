'use client'

import Link from 'next/link'
import { Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Mail } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/common/Header'
import Footer from '@/components/Footer'

// Sample article data - this would normally come from an API
const sampleArticle = {
    id: 'catherine-ohara-tribute',
    title: "Catherine O'Hara Died at 71 of Pulmonary Embolism, Rectal Cancer",
    subtitle: "Emmy Award-winning actress Catherine O'Hara, star of 'Home Alone' and 'Schitt's Creek,' died of a pulmonary embolism on January 30.",
    author: {
        name: 'Mandy French',
        role: 'Senior Health Journalist',
        avatar: '/api/placeholder/80/80'
    },
    reviewer: {
        name: 'Jill Seladi-Schulman, Ph.D.',
        role: 'Medical Reviewer'
    },
    publishDate: 'February 9, 2026',
    lastUpdated: 'February 9, 2026',
    readTime: '5 min read',
    featuredImage: {
        url: '/api/placeholder/1200/600',
        alt: "Catherine O'Hara"
    },
    keyTakeaways: [
        "Catherine O'Hara, star of 'Home Alone' and 'Schitt's Creek,' died in Los Angeles on January 30 after being hospitalized with an illness.",
        "Her cause of death was a pulmonary embolism, with rectal cancer named as an underlying cause.",
        "In 2020, O'Hara mentioned in an interview that she had been diagnosed with a rare genetic condition called dextrocardia with sinus inversus."
    ],
    content: [
        {
            type: 'paragraph',
            text: 'Actor Catherine O\'Hara, best-known for starring in films like "Home Alone," "Beetlejuice," and the hit TV show "Schitt\'s Creek", died on January 30 at 71.'
        },
        {
            type: 'paragraph',
            text: 'According to E! News, the Los Angeles Fire Department confirmed in a press release that O\'Hara had been transported to the hospital in "serious condition" early that morning.'
        },
        {
            type: 'paragraph',
            text: 'O\'Hara\'s cause of death was a pulmonary embolism, a blood clot in the lung, with rectal cancer listed as an underlying cause. The details listed on her death certificate were released on February 9 by the Los Angeles County Medical Examiner\'s Office.'
        },
        {
            type: 'paragraph',
            text: 'The Emmy Award-winning actor is survived by her husband, Bo Welch, and their two children, Luke and Matthew.'
        },
        {
            type: 'paragraph',
            text: 'O\'Hara had been noticeably absent from the Golden Globes earlier in January, despite having been nominated for a Best Supporting Actress in a TV Series award.'
        },
        {
            type: 'heading',
            level: 2,
            text: 'O\'Hara lived with rare genetic condition'
        },
        {
            type: 'paragraph',
            text: 'In a 2020 interview with Kathryn Hall\'s Virtual Happy Hour, O\'Hara revealed she had a rare genetic condition.'
        },
        {
            type: 'paragraph',
            text: 'This condition, known as dextrocardia with situs inversus, is characterized by an abnormal position of the heart. This positioning includes the tip (apex) of the heart being positioned to the right side of the chest instead of the left. Also, the chambers of the heart are mirrored. It may also include the reversal of organs, such as the liver and the spleen.'
        },
        {
            type: 'paragraph',
            text: 'The National Organization for Rare Disorders (NORD) notes that most people with this condition can live without associated symptoms or disability.'
        },
        {
            type: 'paragraph',
            text: 'This condition affects only about 1 in every 10,000 individuals. The exact cause is still unknown.'
        },
        {
            type: 'heading',
            level: 2,
            text: 'Stars pay tribute to Catherine O\'Hara'
        },
        {
            type: 'paragraph',
            text: 'O\'Hara\'s costars and friends paid tribute to her following the announcement of her death.'
        },
        {
            type: 'paragraph',
            text: 'Macaulay Culkin, her Home Alone son, wrote a heartbreaking tribute in a social media post: "Mama. I thought we had time. I wanted more. I wanted to sit in a chair next to you. I heard you. But I had so much more to say. I love you. I\'ll see you later."'
        }
    ],
    relatedArticles: [
        {
            title: 'Understanding Pulmonary Embolism: Symptoms and Treatment',
            image: '/api/placeholder/300/200',
            category: 'Health',
            slug: 'pulmonary-embolism-guide'
        },
        {
            title: 'What is Dextrocardia? Living with a Rare Heart Condition',
            image: '/api/placeholder/300/200',
            category: 'Medical Conditions',
            slug: 'dextrocardia-explained'
        },
        {
            title: 'Rectal Cancer: Early Signs and Prevention',
            image: '/api/placeholder/300/200',
            category: 'Cancer',
            slug: 'rectal-cancer-prevention'
        }
    ]
}

export default function SampleNewsArticle() {
    const [showShareMenu, setShowShareMenu] = useState(false)

    const shareArticle = (platform: string) => {
        // Share functionality would go here
        console.log(`Sharing on ${platform}`)
        setShowShareMenu(false)
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li><Link href="/" className="hover:text-red-600 transition-colors">Home</Link></li>
                        <li className="text-gray-400">/</li>
                        <li><Link href="/news" className="hover:text-red-600 transition-colors">News</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-700 font-medium">Article</li>
                    </ol>
                </nav>

                {/* Article Header */}
                <article>
                    <header className="mb-8 pb-6 border-b border-gray-200">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            {sampleArticle.title}
                        </h1>

                        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                            {sampleArticle.subtitle}
                        </p>

                        {/* Article Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-red-500" />
                                <span>Updated {sampleArticle.lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <span>{sampleArticle.readTime}</span>
                            </div>
                            <button
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors relative"
                            >
                                <Share2 className="h-4 w-4 text-gray-600" />
                                <span>Share</span>

                                {/* Share Menu Dropdown */}
                                {showShareMenu && (
                                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[160px]">
                                        <button
                                            onClick={() => shareArticle('facebook')}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                                        >
                                            <Facebook className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm">Facebook</span>
                                        </button>
                                        <button
                                            onClick={() => shareArticle('twitter')}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                                        >
                                            <Twitter className="h-4 w-4 text-sky-500" />
                                            <span className="text-sm">Twitter</span>
                                        </button>
                                        <button
                                            onClick={() => shareArticle('linkedin')}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                                        >
                                            <Linkedin className="h-4 w-4 text-blue-700" />
                                            <span className="text-sm">LinkedIn</span>
                                        </button>
                                        <button
                                            onClick={() => shareArticle('email')}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                                        >
                                            <Mail className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm">Email</span>
                                        </button>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Author & Reviewer Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-red-600 font-bold text-lg">
                                    {sampleArticle.author.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{sampleArticle.author.name}</p>
                                    <p className="text-sm text-gray-500">{sampleArticle.author.role}</p>
                                </div>
                            </div>
                            <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Medically reviewed by:</span> {sampleArticle.reviewer.name}
                                </p>
                                <p className="text-sm text-gray-500">{sampleArticle.reviewer.role}</p>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-md">
                        <img
                            src={sampleArticle.featuredImage.url}
                            alt={sampleArticle.featuredImage.alt}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Key Takeaways */}
                    <div className="mb-10 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-6 border-l-4 border-red-500">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-red-600">•</span>
                            Key Takeaways
                        </h2>
                        <ul className="space-y-3">
                            {sampleArticle.keyTakeaways.map((takeaway, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#291e6a] text-white flex items-center justify-center text-xs font-bold mt-0.5">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700 leading-relaxed">{takeaway}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">
                        {sampleArticle.content.map((block, index) => {
                            if (block.type === 'heading') {
                                const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements
                                return (
                                    <HeadingTag
                                        key={index}
                                        className="text-2xl font-bold text-gray-900 mt-10 mb-4 bg-[#291e6a] bg-clip-text text-transparent"
                                    >
                                        {block.text}
                                    </HeadingTag>
                                )
                            }

                            if (block.type === 'paragraph') {
                                return (
                                    <p key={index} className="text-gray-700 leading-relaxed mb-5 text-lg">
                                        {block.text}
                                    </p>
                                )
                            }

                            return null
                        })}
                    </div>

                    {/* Article Footer - Source & Review Info */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">How we reviewed this article:</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><span className="font-medium">Sources:</span> Medical journals, health organizations, expert interviews</p>
                                <p><span className="font-medium">Last updated:</span> {sampleArticle.lastUpdated}</p>
                                <p><span className="font-medium">Medical review:</span> {sampleArticle.reviewer.name}</p>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related Articles */}
                <section className="mt-16 pt-8 border-t-2 border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 bg-[#291e6a] bg-clip-text text-transparent">
                        Related Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sampleArticle.relatedArticles.map((article, index) => (
                            <Link
                                key={index}
                                href={`/news/${article.slug}`}
                                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:border-red-300 transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-red-600">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Back to News */}
                <div className="mt-12 text-center">
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#291e6a] hover:bg-[#1c144a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        ← Back to All News
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}
