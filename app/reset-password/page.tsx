'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        if (!token) {
            setError('Invalid reset link. Please request a new password reset.')
            return
        }

        setIsLoading(true)

        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
            const response = await fetch(`${backendUrl}/api/user/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                setTimeout(() => router.push('/login'), 3000)
            } else {
                setError(data.message || 'Failed to reset password')
            }
        } catch (error) {
            setError('Failed to reset password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="bg-red-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <XCircle className="h-20 w-20 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-red-600 mb-3">Invalid Link</h1>
                    <p className="text-gray-600 text-lg mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-block bg-[#291e6a] hover:bg-[#1c144a] text-white px-8 py-3 rounded-xl font-semibold transition-all"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="bg-green-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <CheckCircle className="h-20 w-20 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-600 mb-3">Password Reset!</h1>
                    <p className="text-gray-600 text-lg mb-4">
                        Your password has been successfully reset.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">Redirecting to login page...</p>
                    <div className="animate-pulse flex justify-center">
                        <div className="h-2 w-2 bg-green-600 rounded-full mx-1"></div>
                        <div className="h-2 w-2 bg-green-600 rounded-full mx-1"></div>
                        <div className="h-2 w-2 bg-green-600 rounded-full mx-1"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex flex-col">
            {/* Header */}
            <div className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Reset Password</h1>
                <p className="text-red-50 text-center mt-2">Enter your new password</p>
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                <p className="font-medium">Error</p>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                        )}

                        {/* New Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 transition-all"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">Minimum 6 characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className={`h-2 flex-1 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className={`h-2 flex-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className={`h-2 flex-1 rounded-full ${password.length >= 10 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Password strength: {password.length < 6 ? 'Weak' : password.length < 8 ? 'Good' : 'Strong'}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] mt-6"
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}
