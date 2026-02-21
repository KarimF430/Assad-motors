'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { sendOtp, verifyOtp } = useAuth()

    // Step management: 'email' or 'otp'
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState('')
    const [maskedEmail, setMaskedEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [resendCountdown, setResendCountdown] = useState(0)

    // Refs for OTP inputs
    const otpRefs = useRef<(HTMLInputElement | null)[]>([])

    // Countdown timer for resend OTP
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendCountdown])

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const result = await sendOtp(email)
            setMaskedEmail(result.maskedEmail)
            setStep('otp')
            setResendCountdown(30)
            // Focus first OTP input
            setTimeout(() => otpRefs.current[0]?.focus(), 100)
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }

        // Auto-submit when all 6 digits entered
        if (value && index === 5 && newOtp.every(digit => digit)) {
            handleVerifyOtp(newOtp.join(''))
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pastedData.length === 6) {
            const newOtp = pastedData.split('')
            setOtp(newOtp)
            // Trigger verification
            handleVerifyOtp(pastedData)
        }
    }

    const handleVerifyOtp = async (otpValue?: string) => {
        const otpToVerify = otpValue || otp.join('')
        if (otpToVerify.length !== 6) {
            setError('Please enter the complete 6-digit code')
            return
        }

        setError('')
        setIsLoading(true)

        try {
            await verifyOtp(email, otpToVerify, rememberMe)
            router.push('/') // Redirect to home on success
        } catch (err: any) {
            setError(err.message || 'Invalid OTP. Please try again.')
            // Clear OTP on error
            setOtp(['', '', '', '', '', ''])
            otpRefs.current[0]?.focus()
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (resendCountdown > 0) return

        setError('')
        setIsLoading(true)

        try {
            await sendOtp(email)
            setResendCountdown(30)
            setOtp(['', '', '', '', '', ''])
            otpRefs.current[0]?.focus()
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBackToEmail = () => {
        setStep('email')
        setOtp(['', '', '', '', '', ''])
        setError('')
    }

    const handleGoogleLogin = () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        window.location.href = `${backendUrl}/api/user/auth/google`
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex flex-col">
            {/* Header */}
            <div className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1.5 sm:mb-2">
                    {step === 'email' ? 'Sign in to your Account' : 'Enter Verification Code'}
                </h1>
                <p className="text-sm sm:text-base text-red-50">
                    {step === 'email'
                        ? 'Enter your email to receive a login code'
                        : `Code sent to ${maskedEmail}`
                    }
                </p>
                {step === 'email' && (
                    <p className="text-xs text-red-100 mt-2 max-w-sm mx-auto opacity-90">
                        By logging in, you will receive updates on latest car launches, price drops, and automotive news.
                    </p>
                )}
            </div>

            {/* Form Container */}
            <div className="flex-1 bg-white rounded-t-3xl p-4 sm:p-6 shadow-2xl">
                {step === 'email' ? (
                    /* Step 1: Email Entry */
                    <form onSubmit={handleSendOtp} className="max-w-md mx-auto space-y-3.5 sm:space-y-4">
                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full py-3 sm:py-3.5 px-4 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center space-x-3 hover:border-gray-300 hover:shadow-sm transition-all active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-medium text-sm sm:text-base text-gray-700">Continue with Google</span>
                        </button>

                        {/* Divider */}
                        <div className="relative my-4 sm:my-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-3 sm:px-4 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Send OTP Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
                        >
                            {isLoading ? 'Sending...' : 'Send OTP Code'}
                        </button>

                        {/* Sign Up Link */}
                        <p className="text-center text-gray-600 text-xs sm:text-sm pt-2">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-red-600 hover:text-red-700 font-medium">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                ) : (
                    /* Step 2: OTP Verification */
                    <div className="max-w-md mx-auto space-y-4 sm:space-y-5">
                        {/* Back Button */}
                        <button
                            onClick={handleBackToEmail}
                            className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
                        >
                            <ArrowLeft size={18} className="mr-1" />
                            Change email
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                                {error}
                            </div>
                        )}

                        {/* OTP Input Boxes */}
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => { otpRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={handleOtpPaste}
                                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        {/* Remember Me */}
                        <label className="flex items-center justify-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="text-gray-600 text-sm">Remember me</span>
                        </label>

                        {/* Verify Button */}
                        <button
                            onClick={() => handleVerifyOtp()}
                            disabled={isLoading || otp.some(d => !d)}
                            className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Login'}
                        </button>

                        {/* Resend OTP */}
                        <p className="text-center text-gray-600 text-xs sm:text-sm">
                            Didn't receive the code?{' '}
                            {resendCountdown > 0 ? (
                                <span className="text-gray-400">Resend in {resendCountdown}s</span>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    disabled={isLoading}
                                    className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
