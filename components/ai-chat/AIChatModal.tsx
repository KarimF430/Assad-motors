'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, Mic, Sparkles } from 'lucide-react'

interface Message {
    id: string
    role: 'user' | 'ai'
    content: string
    timestamp: Date
    quickReplies?: string[]
    cars?: CarMatch[]
}

interface CarMatch {
    id: string
    name: string
    brand: string
    price: number
    matchScore: number
    image: string
    reasons: string[]
}

interface AIChatModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [sessionId] = useState(() => Math.random().toString(36).substring(7))
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Initialize conversation
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Welcome message
            setMessages([{
                id: '1',
                role: 'ai',
                content: "Hi! 👋 I'm your AI car assistant. I'll help you find the perfect car based on your needs.\n\nLet's start with a simple question:",
                timestamp: new Date(),
                quickReplies: undefined
            }, {
                id: '2',
                role: 'ai',
                content: "👨‍👩‍👧‍👦 How many people will usually travel in the car?",
                timestamp: new Date(),
                quickReplies: ['Just me (1-2)', '3-4 people', '5 people', '6-7 people', '7+ people']
            }])
        }
    }, [isOpen])

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (message?: string) => {
        const textToSend = message || input
        if (!textToSend.trim()) return

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSend,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        try {
            // Call AI API
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    sessionId,
                    conversationHistory: messages
                })
            })

            const data = await response.json()

            // Add AI response
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: data.reply,
                timestamp: new Date(),
                quickReplies: data.quickReplies,
                cars: data.cars
            }
            setMessages(prev => [...prev, aiMessage])
        } catch (error) {
            console.error('Error:', error)
            // Fallback response
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "Sorry, I'm having trouble connecting. Please try again!",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    const handleQuickReply = (reply: string) => {
        handleSend(reply)
    }

    const handleVoiceInput = () => {
        // Voice input implementation
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition()
            recognition.lang = 'en-IN'
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                setInput(transcript)
            }
            recognition.start()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col m-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-red-500 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">AI Car Assistant</h2>
                            <p className="text-xs text-white/80">Powered by gadizone</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-white" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id}>
                            {/* Message Bubble */}
                            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>

                            {/* Quick Replies */}
                            {message.quickReplies && (
                                <div className="flex flex-wrap gap-2 mt-3 ml-2">
                                    {message.quickReplies.map((reply, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleQuickReply(reply)}
                                            className="px-4 py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-full hover:bg-orange-50 transition-colors text-sm font-medium"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Car Results */}
                            {message.cars && (
                                <div className="mt-4 space-y-3">
                                    {message.cars.map((car) => (
                                        <div
                                            key={car.id}
                                            className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-colors cursor-pointer"
                                        >
                                            <div className="flex gap-4">
                                                <img
                                                    src={car.image}
                                                    alt={car.name}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{car.brand} {car.name}</h3>
                                                            <p className="text-sm text-gray-600">₹{(car.price / 100000).toFixed(2)} Lakh</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-orange-600">{car.matchScore}%</div>
                                                            <div className="text-xs text-gray-500">Match</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 space-y-1">
                                                        {car.reasons.slice(0, 3).map((reason, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                                <span className="text-green-500">✓</span>
                                                                <span>{reason}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-3 flex gap-2">
                                                        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                                                            View Details
                                                        </button>
                                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                                                            Compare
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                    <div className="flex gap-2">
                        <button
                            onClick={handleVoiceInput}
                            className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors"
                        >
                            <Mic className="h-5 w-5 text-gray-600" />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
