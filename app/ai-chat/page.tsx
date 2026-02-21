'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Send, Mic, ThumbsUp, ThumbsDown, Copy, Menu, Sparkles, ChevronRight, ShieldCheck, Fuel, GitCompare, Zap, Gauge, Heart } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import './ai-chat.css'
import analytics from '@/lib/analytics'
import { AnalyticsEvent } from '@/types/analytics'
import ChatSidebar from '@/components/ai-chat/ChatSidebar'
import { useAuth } from '@/lib/auth-context'
import { OptimizedImage } from '@/components/common/OptimizedImage'
import { useFavourites } from '@/lib/favourites-context'

/**
 * Helper to highlight car names in text and turn them into links
 */
function highlightCarNames(text: string, cars?: any[]) {
    if (!text) return text

    // 1. Identify all brands
    const brands = ['Maruti', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'Honda', 'MG', 'Skoda', 'Volkswagen', 'Maruti Suzuki']
    let highlightedText = text.replace(/\n/g, '<br/>')

    // 2. Identify full car models from the provided cars array if available
    if (cars && cars.length > 0) {
        // Sort by name length descending to match full names first (Longer name "Maruti Grand Vitara" before "Maruti")
        const sortedCars = [...cars].sort((a, b) => {
            const nameA = `${a.brandName || a.brand || ''} ${a.name || ''}`
            const nameB = `${b.brandName || b.brand || ''} ${b.name || ''}`
            return nameB.length - nameA.length
        })

        sortedCars.forEach(car => {
            const brand = car.brandName || car.brand || ''
            const fullCarName = `${brand} ${car.name}`

            const brandSlug = car.brandSlug || brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || ''
            const modelSlug = car.modelSlug || car.name?.toLowerCase().replace(/\s+/g, '-') || ''
            const href = `/${brandSlug}-cars/${modelSlug}`

            // Regex to find full car name case insensitively
            const regex = new RegExp(`\\b${fullCarName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
            highlightedText = highlightedText.replace(regex, `<a href="${href}" class="highlight-car">${fullCarName}</a>`)
        })
    }

    // 3. Fallback: Highlight remaining brands as unlinked spans
    brands.forEach(brand => {
        const regex = new RegExp(`\\b${brand}\\b(?![^<]*</a>)`, 'gi') // Don't replace if inside <a>
        highlightedText = highlightedText.replace(regex, `<span class="highlight-car">${brand}</span>`)
    })

    return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />
}

interface Message {
    id: string
    role: 'user' | 'ai'
    content: string
    timestamp: Date
    cars?: any[] // Array of car objects
    quickReplies?: string[]
}

/**
 * Premium Car Card Component for AI Chat
 */
function AICarCard({ car }: { car: any; href?: string }) {
    const { isFavourite, toggleFavourite } = useFavourites()
    const [mounted, setMounted] = useState(false)
    const isFav = mounted ? isFavourite(car.id) : false

    useEffect(() => {
        setMounted(true)
    }, [])

    const displayPrice = car.price || car.minPrice || 0
    const priceLabel = 'Price'

    // Format image URL
    const formatImageUrl = (url: string) => {
        if (!url) return null
        if (url.startsWith('http')) return url
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`
    }

    const imageSrc = formatImageUrl(car.heroImage || car.image)

    // Generate car href
    const brandSlug = car.brandSlug || car.brandName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || ''
    const modelSlug = car.modelSlug || car.name?.toLowerCase().replace(/\s+/g, '-') || ''
    const variantSlug = car.variantSlug

    const carHref = variantSlug
        ? `/${brandSlug}-cars/${modelSlug}/${variantSlug}`
        : `/${brandSlug}-cars/${modelSlug}`

    return (
        <a
            href={carHref}
            className="block flex-shrink-0 w-[260px] sm:w-72 bg-white rounded-xl border border-gray-200 hover:shadow-lg active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer group no-underline text-inherit"
        >
            {/* Image Container */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {car.isNew && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-10 shadow-md">
                        NEW
                    </div>
                )}
                {car.isPopular && !car.isNew && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-10 shadow-md">
                        POPULAR
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavourite(car)
                    }}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full shadow-md transition-all duration-200 z-10 ${isFav
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-400 hover:text-red-500'
                        }`}
                >
                    <Heart className="h-4 w-4" fill={isFav ? 'currentColor' : 'none'} />
                </button>

                {/* Car Image */}
                <div className="w-full h-full flex items-center justify-center relative">
                    {imageSrc ? (
                        <OptimizedImage
                            src={imageSrc}
                            alt={`${car.brandName} ${car.name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 300px"
                            className="object-contain p-2"
                        />
                    ) : (
                        <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400 font-bold">
                            {car.name}
                        </div>
                    )}
                </div>
            </div>

            {/* Car Info */}
            <div className="p-4 sm:p-5">
                <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg truncate">
                    {car.brandName || car.brand} {car.name}
                </h3>

                <div className="flex flex-col mb-3 sm:mb-4">
                    <div className="flex items-baseline">
                        <span className="text-red-600 font-bold text-lg sm:text-xl">
                            ₹ {(displayPrice / 100000).toFixed(2)} Lakh
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm ml-2">Onwards</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">{priceLabel}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{Array.isArray(car.fuelTypes) ? car.fuelTypes.join('/') : (car.fuelType || 'Petrol')}</span>
                    </div>
                    <div className="flex items-center">
                        <Gauge className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{Array.isArray(car.transmissions) ? car.transmissions.join('/') : (car.transmission || 'Manual/Automatic')}</span>
                    </div>
                </div>

                <div className="w-full bg-[#291e6a] text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base text-center transition-all duration-200 shadow-md transform group-hover:scale-105">
                    View Details
                </div>
            </div>
        </a>
    )
}

function AICarFinderContent() {
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const initialQuery = searchParams?.get('q') || ''

    const [input, setInput] = useState(initialQuery)
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [sessionId, setSessionId] = useState<string>('')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [conversationState, setConversationState] = useState<any>({})

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Scroll to bottom on new message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    // Generate Session ID on load
    useEffect(() => {
        setSessionId(crypto.randomUUID())
        if (initialQuery) {
            handleSend(initialQuery)
        }
    }, [])

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return

        // Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Analytics
        analytics.trackEvent({
            category: 'AI Chat',
            action: 'Send Message',
            label: text.substring(0, 50)
        } as unknown as AnalyticsEvent)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/ai-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                    sessionId: sessionId
                })
            })

            const data = await response.json()

            if (data.reply) {
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    content: data.reply,
                    timestamp: new Date(),
                    cars: data.cars || [],
                    quickReplies: data.suggestedReplies || []
                }
                setMessages(prev => [...prev, aiMsg])
                if (data.sessionId) setSessionId(data.sessionId)
                if (data.conversationState) setConversationState(data.conversationState)
            }
        } catch (error) {
            console.error('Chat error:', error)
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "Sorry, I'm having trouble connecting to my brain right now. Please try again.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMsg])
        } finally {
            setIsTyping(false)
            // Focus input after response
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleNewChat = () => {
        setMessages([])
        setSessionId(crypto.randomUUID())
        setConversationState({})
        setSidebarOpen(false)
    }

    const handleSelectChat = (chat: any) => {
        setMessages(chat.messages || [])
        setSessionId(chat.id)
        setSidebarOpen(false)
    }

    return (
        <div className="ai-chat-page">
            <div className="chat-layout">
                {/* Sidebar */}
                <ChatSidebar
                    currentSessionId={sessionId}
                    onSelectChat={handleSelectChat}
                    onNewChat={handleNewChat}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                {/* Main Chat Area */}
                <div className="chat-main">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="header-content">
                            <button
                                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu size={20} />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-600"><Sparkles size={18} /></span>
                                <h1 className="text-xl font-bold bg-[#291e6a] bg-clip-text text-transparent">Gadizone AI</h1>
                            </div>
                        </div>
                        <p className="status-text hidden sm:block">{isTyping ? 'Thinking...' : 'Ready to help'}</p>
                    </div>

                    {/* Messages */}
                    <div className="messages-container">
                        {messages.length === 0 && (
                            <div className="welcome-message">
                                <h2>Your Elite Automotive <br />Consultant is Ready.</h2>
                                <p>Discover your next car with real-time data and expert insights.</p>
                                <div className="quick-questions">
                                    <button onClick={() => handleSend('Show me the safest SUVs under 15 Lakhs')}>
                                        <div className="q-icon shield"><ShieldCheck size={24} strokeWidth={1.5} /></div>
                                        <span>Safety Leaders</span>
                                        <ChevronRight size={14} className="q-arrow" />
                                    </button>
                                    <button onClick={() => handleSend('Which are the best fuel efficient city cars?')}>
                                        <div className="q-icon fuel"><Fuel size={24} strokeWidth={1.5} /></div>
                                        <span>Fuel Efficiency</span>
                                        <ChevronRight size={14} className="q-arrow" />
                                    </button>
                                    <button onClick={() => handleSend('Compare Hyundai Creta and Maruti Grand Vitara')}>
                                        <div className="q-icon compare"><GitCompare size={24} strokeWidth={1.5} /></div>
                                        <span>Comparison</span>
                                        <ChevronRight size={14} className="q-arrow" />
                                    </button>
                                    <button onClick={() => handleSend('Recommended electric vehicles under 25 Lakhs')}>
                                        <div className="q-icon zap"><Zap size={24} strokeWidth={1.5} /></div>
                                        <span>EV Revolution</span>
                                        <ChevronRight size={14} className="q-arrow" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div key={message.id} className={`message ${message.role}`}>
                                <div className="message-content-wrapper">
                                    <div className="message-avatar">
                                        {message.role === 'user' ? (user?.firstName?.[0] || 'U') : <Sparkles size={20} />}
                                    </div>
                                    <div className="message-content">
                                        <div className="message-text">
                                            {highlightCarNames(message.content, message.cars)}
                                        </div>

                                        {/* Click instruction for cards */}
                                        {message.cars && message.cars.length > 0 && (
                                            <div className="text-[11px] text-blue-500 font-medium mt-4 mb-2 flex items-center gap-1">
                                                <Sparkles size={10} /> Click on any card below to view full specifications, price breakup, or comparison.
                                            </div>
                                        )}

                                        {/* Car Cards */}
                                        {message.cars && message.cars.length > 0 && (
                                            <div className="car-cards">
                                                {message.cars.map((car: any) => (
                                                    <AICarCard
                                                        key={car.id || car.name}
                                                        car={car}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Quick Replies */}
                                        {message.quickReplies && message.quickReplies.length > 0 && (
                                            <div className="quick-replies">
                                                {message.quickReplies.map((reply, idx) => (
                                                    <button key={idx} className="quick-reply-btn" onClick={() => handleSend(reply)}>
                                                        {reply}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message ai">
                                <div className="message-content-wrapper">
                                    <div className="message-avatar text-blue-500 animate-pulse"><Sparkles size={20} /></div>
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="input-container">
                        <div className="input-layout">
                            <div className="flex items-center gap-2">
                                <textarea
                                    ref={inputRef}
                                    className="input-box"
                                    placeholder="Ask anything about cars..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                />
                                <div className="input-actions">
                                    <button className="mic-btn"><Mic size={20} /></button>
                                    <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim()}>
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="helper-text">
                            Gadizone AI can make mistakes. Please verify important information.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AICarFinderPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading Auto Expert...</div>}>
            <AICarFinderContent />
        </Suspense>
    )
}
