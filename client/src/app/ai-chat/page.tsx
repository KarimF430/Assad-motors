'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './ai-chat.css'

interface Message {
    role: 'user' | 'ai'
    content: string
}

interface Car {
    brand: string
    name: string
    price: number
    imageUrl?: string
}

interface UserState {
    budget?: number
    usage?: string
    familySize?: number
}

export default function AIChatPage() {
    const searchParams = useSearchParams()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [cars, setCars] = useState<Car[]>([])
    const [conversationState, setConversationState] = useState<UserState>({})
    const [suggestedReplies, setSuggestedReplies] = useState<string[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, loading])

    // Handle pre-filled message from quirky bot
    useEffect(() => {
        const message = searchParams.get('message')
        const autoSend = searchParams.get('autoSend')

        if (message) {
            setInput(message)
            if (autoSend === 'true') {
                setTimeout(() => {
                    sendMessage(message)
                }, 500)
            }
        }
    }, [searchParams])

    const sendMessage = async (messageText?: string) => {
        const text = messageText || input.trim()
        if (!text) return

        // Add user message
        const userMessage: Message = { role: 'user', content: text }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)
        setSuggestedReplies([]) // Clear previous suggestions

        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    sessionId: 'web-session',
                    conversationHistory: messages,
                    conversationState // Send current state to backend
                })
            })

            const data = await response.json()

            // Add AI response
            const aiMessage: Message = { role: 'ai', content: data.reply }
            setMessages(prev => [...prev, aiMessage])

            // Update state & cars
            if (data.conversationState) setConversationState(data.conversationState)
            if (data.cars && data.cars.length > 0) setCars(data.cars)
            if (data.suggestedReplies) setSuggestedReplies(data.suggestedReplies)

        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage: Message = {
                role: 'ai',
                content: 'Sorry, I encountered an error. Please try again.'
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage()
    }

    return (
        <div className="ai-chat-page">
            <div className="chat-container">
                {/* Header with Glassmorphism */}
                <div className="chat-header">
                    <div className="header-content">
                        <div className="avatar-wrapper">
                            <span className="bot-icon">🤖</span>
                            <span className="expert-badge">PRO</span>
                        </div>
                        <div>
                            <h1>Karan (Auto Expert)</h1>
                            <p className="status-text">{loading ? 'Typing...' : 'Online'}</p>
                        </div>
                    </div>
                    {/* Persisted State Indicators */}
                    {(conversationState.budget || conversationState.usage) && (
                        <div className="state-pills">
                            {conversationState.budget && <span className="pill">💰 ₹{(conversationState.budget / 100000).toFixed(1)}L</span>}
                            {conversationState.usage && <span className="pill">🚗 {conversationState.usage}</span>}
                        </div>
                    )}
                </div>

                {/* Messages Area */}
                <div className="messages-container">
                    {messages.length === 0 && (
                        <div className="welcome-message">
                            <div className="welcome-avatar">
                                <span className="bot-emoji">🤖</span>
                            </div>
                            <h2>Hi! I'm Karan, your Auto Expert.</h2>
                            <p>I can help you find the perfect car based on your budget and needs. I don't guess—I analyze.</p>

                            <div className="quick-questions">
                                <button onClick={() => sendMessage('Suggest a safe SUV under 15 Lakhs')}>
                                    🛡️ Safe SUV &lt; ₹15L
                                </button>
                                <button onClick={() => sendMessage('Best mileage car for city driving')}>
                                    ⛽ Best City Mileage
                                </button>
                                <button onClick={() => sendMessage('Creta vs Seltos - which is better?')}>
                                    🆚 Creta vs Seltos
                                </button>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`message ${msg.role}`}
                            >
                                <div className="message-content">
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <div className="message ai">
                            <div className="message-content typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Cars Display (Horizontal Scroll) */}
                {cars.length > 0 && (
                    <div className="cars-display-wrapper">
                        <h3 className="suggestions-title">My Top Recommendations</h3>
                        <div className="cars-grid">
                            {cars.map((car, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="car-card"
                                >
                                    {car.imageUrl && (
                                        <div className="car-image-container">
                                            <img src={car.imageUrl} alt={`${car.brand} ${car.name}`} />
                                        </div>
                                    )}
                                    <div className="car-info">
                                        <h4>{car.brand} {car.name}</h4>
                                        <p className="price">₹{(car.price / 100000).toFixed(2)}L</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Suggested Replies (Chips) */}
                {suggestedReplies.length > 0 && !loading && (
                    <div className="suggested-replies">
                        {suggestedReplies.map((reply, idx) => (
                            <button key={idx} onClick={() => sendMessage(reply)}>
                                {reply}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <form className="chat-input-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={loading}
                        className="chat-input"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="send-button"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}
