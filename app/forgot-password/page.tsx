'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
            const response = await fetch(`${backendUrl}/api/user/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setSubmitted(true)
            } else if (response.status === 404 && data.isNewEmail) {
                // Show specific message for new emails
                alert(data.message || 'This email is not registered. Please sign up to create an account.')
                router.push('/signup')
            } else {
                alert(data.message || 'Failed to send reset email')
            }
        } catch (error) {
            alert('Failed to send reset email. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="bg-green-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <Mail className="h-20 w-20 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Check Your Email</h1>
                    <p className="text-gray-600 text-lg mb-4">
                        If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Please check your inbox and spam folder.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block bg-[#291e6a] hover:bg-[#1c144a] text-white px-8 py-3 rounded-xl font-semibold transition-all"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex flex-col">
            {/* Header */}
            <div className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Forgot Password</h1>
                <p className="text-red-50 text-center mt-2">We'll help you reset it</p>
            </div>

            {/* Form Container */}
            <div className="flex-1 bg-white rounded-t-3xl p-4 sm:p-6 shadow-2xl">
                <div className="max-w-md mx-auto">
                    <Link
                        href="/login"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Login</span>
                    </Link>

                    <div className="mb-6">
                        <p className="text-gray-700 text-lg">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your-email@example.com"
                                className="w-full px-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
