'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import PageContainer, { PageSection } from '@/components/layout/PageContainer'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'

export default function FeedbackPage() {
    const [formData, setFormData] = useState({ name: '', email: '', rating: 0, category: '', feedback: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [hoveredRating, setHoveredRating] = useState(0)

    useEffect(() => { window.scrollTo(0, 0) }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setSubmitted(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <PageContainer maxWidth="md">
                    <PageSection spacing="normal">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-10">
                            <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Link>

                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Share Your Feedback</h1>
                            <p className="text-gray-600 mb-8">Help us improve gadizone with your valuable input.</p>

                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                                    <p className="text-gray-600 mb-6">Your feedback helps us serve you better.</p>
                                    <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', rating: 0, category: '', feedback: '' }) }} className="text-orange-600 hover:text-orange-700 font-medium">
                                        Submit more feedback
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Star Rating */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-3">How would you rate your experience?</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    onMouseEnter={() => setHoveredRating(star)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    className="p-1 transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`h-8 w-8 transition-colors ${star <= (hoveredRating || formData.rating)
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {formData.rating > 0 && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formData.rating === 1 && 'Poor'}
                                                {formData.rating === 2 && 'Fair'}
                                                {formData.rating === 3 && 'Good'}
                                                {formData.rating === 4 && 'Very Good'}
                                                {formData.rating === 5 && 'Excellent!'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">YOUR NAME (Optional)</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">EMAIL (Optional)</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">FEEDBACK CATEGORY *</label>
                                        <select name="category" value={formData.category} onChange={handleChange} required
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm">
                                            <option value="">Select category</option>
                                            <option value="website">Website Experience</option>
                                            <option value="content">Content Quality</option>
                                            <option value="feature">Feature Request</option>
                                            <option value="bug">Bug Report</option>
                                            <option value="suggestion">Suggestion</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">YOUR FEEDBACK *</label>
                                        <textarea name="feedback" value={formData.feedback} onChange={handleChange} required rows={5}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm resize-none" placeholder="Tell us what you think..." />
                                    </div>

                                    <button type="submit" disabled={isSubmitting || !formData.category || !formData.feedback}
                                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded transition-colors">
                                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* SEO Content */}
                        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">Your Voice Matters</h2>
                            <p className="text-sm text-gray-600">
                                At gadizone, we're constantly working to improve our platform based on user feedback.
                                Whether it's a bug you've encountered, a feature you'd like to see, or general thoughts about your experience -
                                your input helps shape the future of gadizone. Every piece of feedback is read and considered by our team.
                            </p>
                        </div>
                    </PageSection>
                </PageContainer>
            </div>
            <Breadcrumb items={[{ label: 'Feedback' }]} />
            <Footer />
        </>
    )
}
