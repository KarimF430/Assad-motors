'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import './FloatingAIBot.css'

interface FloatingAIBotProps {
    type: 'brand' | 'model' | 'variant'
    id: string
    name: string
}

interface QuirkyBit {
    text: string
    ctaText: string
    chatContext: string
    type: string
    entityName: string
}

export function FloatingAIBot({ type, id, name }: FloatingAIBotProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [quirkyBit, setQuirkyBit] = useState<QuirkyBit | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const router = useRouter()

    // Fetch quirky bit on mount
    useEffect(() => {
        const fetchQuirkyBit = async () => {
            try {
                const response = await fetch(`/api/quirky-bit/${type}/${id}`)

                if (!response.ok) {
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

    // Don't render if loading, error, or no data
    if (loading || error || !quirkyBit) return null

    return (
        <div className="floating-ai-bot">
            {/* Floating Bot Icon */}
            <motion.div
                className="bot-icon"
                onHoverStart={() => setIsExpanded(true)}
                onHoverEnd={() => setIsExpanded(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="bot-avatar">
                    <span className="bot-emoji">🤖</span>
                </div>
                {/* Expert Badge */}
                <div className="expert-badge" style={{
                    position: 'absolute',
                    bottom: '-5px',
                    right: '-5px',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 10
                }}>
                    PRO
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
                            <span className="ai-icon">🤖</span>
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
        </div>
    )
}
