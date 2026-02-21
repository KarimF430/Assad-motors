'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import './FloatingAIBot.css'

interface FloatingAIBotProps {
    type: 'brand' | 'model' | 'variant' | 'comparison' | 'price'
    id: string
    name: string
    hasStickyBottomBar?: boolean
}

interface QuirkyBit {
    text: string
    ctaText: string
    chatContext: string
    type: string
    entityName: string
}

export function FloatingAIBot({ type, id, name, hasStickyBottomBar = false }: FloatingAIBotProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [quirkyBit, setQuirkyBit] = useState<QuirkyBit | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const router = useRouter()

    // Fetch quirky bit on mount
    useEffect(() => {
        const fetchQuirkyBit = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
                const response = await fetch(`${backendUrl}/api/quirky-bit/${type}/${id}`)

                if (!response.ok) {
                    console.error('Failed to fetch quirky bit:', response.status, response.statusText)
                    throw new Error('Failed to fetch quirky bit')
                }

                const data = await response.json()
                setQuirkyBit(data)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching quirky bit:', err)
                setError(true)
                setLoading(false)
            }
        }

        fetchQuirkyBit()
    }, [type, id])

    const handleChatClick = () => {
        if (!quirkyBit) return

        // Navigate to AI chat with pre-filled context
        router.push(`/ai-chat?message=${encodeURIComponent(quirkyBit.chatContext)}&autoSend=true`)
    }

    // Don't render if loading, error, no data, or explicitly closed
    if (loading || error || !quirkyBit) return null

    return (
        <div className={`floating-ai-bot ${hasStickyBottomBar ? 'has-sticky-bar' : ''}`}>
            {/* Floating Bot Icon - Draggable */}
            <motion.div
                className="bot-icon-container"
                drag
                dragMomentum={false}
                dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
                whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
            >
                {/* Close Button (X) */}
                <button
                    className="bot-close-btn"
                    onClick={(e) => {
                        e.stopPropagation()
                        setQuirkyBit(null) // Hide the bot
                    }}
                    aria-label="Close bot"
                >
                    ×
                </button>

                <motion.div
                    className="bot-icon"
                    onHoverStart={() => setIsExpanded(true)}
                    onHoverEnd={() => setIsExpanded(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="bot-avatar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="notification-badge">
                        <span>1</span>
                    </div>
                </motion.div>

                {/* Expanded Card */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            className="quirky-card"
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                            <div className="card-header">
                                <span className="ai-icon">✨</span>
                                <span className="label">Did you know?</span>
                                <button
                                    className="close-btn"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsExpanded(false)
                                    }}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <p className="quirky-text">
                                {quirkyBit.text}
                            </p>

                            <button
                                className="chat-cta"
                                onClick={handleChatClick}
                            >
                                <span>💬</span>
                                <span>{quirkyBit.ctaText}</span>
                                <span>→</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
