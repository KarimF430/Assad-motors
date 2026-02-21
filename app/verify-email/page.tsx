'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')
    const status = searchParams.get('status')
    const message = searchParams.get('message')

    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [errorMessage, setErrorMessage] = useState('')
    const [resending, setResending] = useState(false)

    useEffect(() => {
        // Check if redirected from backend with error
        if (status === 'error') {
            setVerificationStatus('error')
            if (message === 'invalid_token') {
                setErrorMessage('Verification link is invalid or has expired')
            } else {
                setErrorMessage('Verification failed. Please try again.')
            }
            return
        }

        // Verification happens on backend via redirect
        // If we get here without error, check if we have a token
        if (!token) {
            setVerificationStatus('error')
            setErrorMessage('Invalid verification link')
            return
        }

        // If we have a token and no error status, the user clicked the link
        // Backend will handle verification and redirect
        setVerificationStatus('loading')
    }, [token, status, message])

    const handleResendVerification = async () => {
        setResending(true)
        try {
            const email = prompt('Please enter your email address to resend verification:')
            if (!email) {
                setResending(false)
                return
            }

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
            const response = await fetch(`${backendUrl}/api/user/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            if (response.ok) {
                alert('Verification email sent! Please check your inbox.')
                router.push('/login')
            } else {
                const data = await response.json()
                alert(data.message || 'Failed to resend email')
            }
        } catch (error) {
            alert('Failed to resend verification email')
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                {verificationStatus === 'loading' && (
                    <>
                        <Loader2 className="h-20 w-20 text-red-600 animate-spin mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Verifying Email...</h1>
                        <p className="text-gray-600 text-lg">
                            Please wait while we verify your email address.
                        </p>
                    </>
                )}

                {verificationStatus === 'success' && (
                    <>
                        <div className="bg-green-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                            <CheckCircle className="h-20 w-20 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-green-600 mb-3">Email Verified!</h1>
                        <p className="text-gray-600 text-lg mb-6">
                            Your email has been successfully verified. Welcome to gadizone!
                        </p>
                        <p className="text-sm text-gray-500 mb-6">Redirecting to home page...</p>
                        <div className="animate-pulse flex justify-center">
                            <div className="h-2 w-2 bg-red-600 rounded-full mx-1"></div>
                            <div className="h-2 w-2 bg-orange-600 rounded-full mx-1"></div>
                            <div className="h-2 w-2 bg-red-600 rounded-full mx-1"></div>
                        </div>
                    </>
                )}

                {verificationStatus === 'error' && (
                    <>
                        <div className="bg-red-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                            <XCircle className="h-20 w-20 text-red-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-red-600 mb-3">Verification Failed</h1>
                        <p className="text-gray-600 text-lg mb-6">{errorMessage}</p>

                        <div className="space-y-3">
                            <button
                                onClick={handleResendVerification}
                                disabled={resending}
                                className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {resending ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-5 w-5" />
                                        <span>Resend Verification Email</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => router.push('/login')}
                                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
                            >
                                Go to Login
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex items-center justify-center p-4">
                <div className="text-white text-xl">Loading...</div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}
