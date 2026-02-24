'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import PageContainer, { PageSection } from '@/components/layout/PageContainer'

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => { window.scrollTo(0, 0) }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            // Send via mailto as a reliable fallback — opens the user's email client
            // with the form data pre-filled, ensuring the message actually reaches us
            const subject = encodeURIComponent(`[assadmotors Contact] ${formData.subject || 'General Inquiry'} — from ${formData.name}`)
            const body = encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\n\nMessage:\n${formData.message}`
            )
            window.location.href = `mailto:Karim0beldaar@gmail.com?subject=${subject}&body=${body}`
            setSubmitted(true)
        } catch {
            setError('Something went wrong. Please email us directly at Karim0beldaar@gmail.com')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageContainer maxWidth="lg">
                <PageSection spacing="normal">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-[#1c144a] hover:text-[#1c144a] mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
                        <p className="text-gray-600 mb-8">Have questions or feedback? We&apos;re here to help.</p>

                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your email client should open now</h3>
                                <p className="text-gray-600 mb-2">Your message has been pre-filled. Just hit Send in your email app.</p>
                                <p className="text-sm text-gray-500 mb-6">
                                    If it didn&apos;t open, email us directly at{' '}
                                    <a href="mailto:Karim0beldaar@gmail.com" className="text-[#1c144a] hover:underline">
                                        Karim0beldaar@gmail.com
                                    </a>
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                                    className="text-[#1c144a] hover:text-[#1c144a] font-medium"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Contact Info */}
                                <div className="lg:col-span-1 space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h2 className="font-semibold text-gray-900 mb-1 leading-6">Email</h2>
                                        <a href="mailto:Karim0beldaar@gmail.com" className="text-[#1c144a] text-sm hover:underline">Karim0beldaar@gmail.com</a>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h2 className="font-semibold text-gray-900 mb-1 leading-6">Phone</h2>
                                        <a href="tel:+919945210466" className="text-[#1c144a] text-sm hover:underline">+91 99452 10466</a>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h2 className="font-semibold text-gray-900 mb-1 leading-6">Location</h2>
                                        <p className="text-gray-600 text-sm">Mumbai, India</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h2 className="font-semibold text-gray-900 mb-1 leading-6">Response Time</h2>
                                        <p className="text-gray-600 text-sm">We aim to reply within 24 business hours.</p>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">YOUR NAME *</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#291e6a] text-sm" placeholder="Full name" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">EMAIL *</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#291e6a] text-sm" placeholder="you@example.com" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">PHONE</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#291e6a] text-sm" placeholder="+91 99452 10466" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">SUBJECT *</label>
                                            <select name="subject" value={formData.subject} onChange={handleChange} required
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#291e6a] text-sm">
                                                <option value="">Select subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="support">Technical Support</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="partnership">Business Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">MESSAGE *</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#291e6a] text-sm resize-none" placeholder="How can we help?" />
                                    </div>

                                    {error && (
                                        <p className="text-sm text-red-600">{error}</p>
                                    )}

                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full bg-[#1c144a] hover:bg-[#1c144a] disabled:bg-gray-300 text-white font-semibold py-3 rounded transition-colors"
                                    >
                                        {isSubmitting ? 'Opening email...' : 'Send Message'}
                                    </button>
                                    <p className="text-xs text-gray-400 text-center">
                                        Clicking Send will open your email client with the message pre-filled.
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </PageSection>
            </PageContainer>
        </div>
    )
}
