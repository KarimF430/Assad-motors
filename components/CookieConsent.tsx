'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

export default function CookieConsent() {
    const [visible, setVisible] = useState(false)
    const [hiding, setHiding] = useState(false)

    useEffect(() => {
        try {
            const accepted = localStorage.getItem('gz_cookie_consent')
            if (!accepted) {
                const timer = setTimeout(() => setVisible(true), 1500)
                return () => clearTimeout(timer)
            }
        } catch {
            // localStorage not available
        }
    }, [])

    const dismiss = (accepted: boolean) => {
        setHiding(true)
        setTimeout(() => {
            try {
                localStorage.setItem('gz_cookie_consent', accepted ? 'accepted' : 'dismissed')
            } catch { /* ignore */ }
            setVisible(false)
            setHiding(false)
        }, 300)
    }

    if (!visible) return null

    return (
        <>
            <style>{`
                @keyframes gz-cookie-slide-up {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes gz-cookie-slide-down {
                    from { opacity: 1; transform: translateY(0); }
                    to   { opacity: 0; transform: translateY(24px); }
                }
                .gz-cookie-enter { animation: gz-cookie-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
                .gz-cookie-exit  { animation: gz-cookie-slide-down 0.3s ease-in both; }
            `}</style>

            <div
                role="dialog"
                aria-label="Cookie consent"
                className={hiding ? 'gz-cookie-exit' : 'gz-cookie-enter'}
                style={{
                    position: 'fixed',
                    bottom: '1.25rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    width: 'min(480px, calc(100vw - 2rem))',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #f3f4f6',
                    overflow: 'hidden',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                {/* Gradient accent bar at top */}
                <div style={{
                    height: 4,
                    background: 'linear-gradient(to right, #dc2626, #f97316)',
                }} />

                <div style={{ padding: '1.25rem 1.25rem 1.25rem' }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #dc2626, #f97316)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <Cookie size={16} color="#fff" />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827' }}>
                                We use cookies
                            </span>
                        </div>
                        <button
                            onClick={() => dismiss(false)}
                            aria-label="Dismiss"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                                color: '#9ca3af',
                                flexShrink: 0,
                                lineHeight: 1,
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body text */}
                    <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem', lineHeight: '1.55', color: '#6b7280' }}>
                        gadizone uses cookies to improve your experience and serve personalised ads via Google AdSense.{' '}
                        <Link
                            href="/privacy-policy"
                            style={{ color: '#ea580c', textDecoration: 'underline', fontWeight: 500 }}
                        >
                            Privacy Policy
                        </Link>
                    </p>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                        <button
                            onClick={() => dismiss(true)}
                            style={{
                                flex: 1,
                                background: 'linear-gradient(to right, #dc2626, #ea580c)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '0.625rem 1rem',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                letterSpacing: '0.01em',
                                boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
                                transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                            Accept All
                        </button>
                        <button
                            onClick={() => dismiss(false)}
                            style={{
                                flex: 1,
                                background: '#f9fafb',
                                color: '#374151',
                                border: '1px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '0.625rem 1rem',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#f9fafb')}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
