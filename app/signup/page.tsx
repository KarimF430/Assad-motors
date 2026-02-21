'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft } from 'lucide-react'

export default function SignUpPage() {
    const router = useRouter()
    const { registerSendOtp, registerVerifyOtp } = useAuth()

    // Step management: 'details' or 'otp'
    const [step, setStep] = useState<'details' | 'otp'>('details')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        phone: ''
    })
    const [maskedEmail, setMaskedEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const result = await registerSendOtp(formData)
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
            await registerVerifyOtp(formData.email, otpToVerify)
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
            await registerSendOtp(formData)
            setResendCountdown(30)
            setOtp(['', '', '', '', '', ''])
            otpRefs.current[0]?.focus()
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBackToDetails = () => {
        setStep('details')
        setOtp(['', '', '', '', '', ''])
        setError('')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex flex-col">
            {/* Header */}
            <div className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
                    {step === 'details' ? 'Sign Up' : 'Verify Email'}
                </h1>
                {step === 'otp' && (
                    <p className="text-center text-red-50 mt-2">
                        Code sent to {maskedEmail}
                    </p>
                )}
            </div>

            {/* Form Container */}
            <div className="flex-1 bg-white rounded-t-3xl p-4 sm:p-6 shadow-2xl">
                <div className="max-w-md mx-auto">
                    {step === 'details' ? (
                        /* Step 1: User Details */
                        <>
                            {/* Back Button */}
                            <button
                                onClick={() => router.back()}
                                className="mb-3 sm:mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800 active:scale-95 transition-all"
                            >
                                <ArrowLeft size={20} />
                            </button>

                            {/* Already Have Account */}
                            <p className="text-center text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
                                Already have an account?{' '}
                                <Link href="/login" className="text-red-600 hover:text-red-700 font-medium">
                                    Login
                                </Link>
                            </p>

                            <form onSubmit={handleSendOtp} className="space-y-3.5 sm:space-y-4">
                                {/* Error Message */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* First Name & Last Name */}
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Lois"
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Becket"
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Loisbecket@gmail.com"
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                {/* Birth of Date */}
                                <div>
                                    <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">Birth of date</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">Phone Number</label>
                                    <div className="flex space-x-2">
                                        <select className="px-2.5 sm:px-3 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                                            <option value="+91">🇮🇳 +91</option>
                                            <option value="+1">🇺🇸 +1</option>
                                            <option value="+44">🇬🇧 +44</option>
                                        </select>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(454) 726-0592"
                                            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !formData.firstName || !formData.lastName || !formData.email}
                                    className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] mt-5 sm:mt-6 text-sm sm:text-base"
                                >
                                    {isLoading ? 'Sending OTP...' : 'Send OTP & Register'}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Step 2: OTP Verification */
                        <div className="space-y-4 sm:space-y-5">
                            {/* Back Button */}
                            <button
                                onClick={handleBackToDetails}
                                className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
                            >
                                <ArrowLeft size={18} className="mr-1" />
                                Edit details
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

                            {/* Verify Button */}
                            <button
                                onClick={() => handleVerifyOtp()}
                                disabled={isLoading || otp.some(d => !d)}
                                className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
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
        </div>
    )
}
