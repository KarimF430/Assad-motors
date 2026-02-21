'use client'

import { useState, useEffect } from 'react'
import { X, Volume2, VolumeX, MessageCircle, Sparkles } from 'lucide-react'

export default function AIChatbotPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [animationFrame, setAnimationFrame] = useState(0)

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('ai-chatbot-popup-dismissed')

        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [])

    // Animate content
    useEffect(() => {
        if (!isVisible) return

        const interval = setInterval(() => {
            setAnimationFrame((prev) => (prev + 1) % 2)
        }, 2500)

        return () => clearInterval(interval)
    }, [isVisible])

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem('ai-chatbot-popup-dismissed', 'true')
    }

    const handleNavigate = () => {
        localStorage.setItem('ai-chatbot-popup-dismissed', 'true')
        window.location.href = '/ai-chat'
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed bottom-4 left-4 z-[9999] w-40 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
        >
            {/* Compact Card */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
                {/* Video Area */}
                <div className="relative bg-gradient-to-br from-orange-500 to-red-600 aspect-video group cursor-pointer" onClick={handleNavigate}>
                    {/* Animated Content */}
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        {animationFrame === 0 ? (
                            <div className="text-center px-2">
                                <MessageCircle className="w-8 h-8 text-white mx-auto mb-1.5 animate-bounce" strokeWidth={2.5} />
                                <p className="text-white text-xs font-bold leading-tight">Ask Anything</p>
                                <p className="text-white/90 text-[10px] leading-tight">About Cars</p>
                            </div>
                        ) : (
                            <div className="text-center px-2">
                                <Sparkles className="w-8 h-8 text-white mx-auto mb-1.5 animate-pulse" strokeWidth={2.5} />
                                <p className="text-white text-xs font-bold leading-tight">Get Instant</p>
                                <p className="text-white/90 text-[10px] leading-tight">Answers</p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClose()
                            }}
                            className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition-all transform hover:scale-110"
                        >
                            <X className="w-3 h-3 text-white" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsMuted(!isMuted)
                            }}
                            className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition-all transform hover:scale-110"
                        >
                            {isMuted ? <VolumeX className="w-3 h-3 text-white" /> : <Volume2 className="w-3 h-3 text-white" />}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-2.5 bg-white">
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-900 leading-tight">🤔 Confused About Cars?</p>
                    </div>

                    <p className="text-[9px] text-gray-600 mb-2 leading-tight">
                        Ask our AI assistant anything!
                    </p>

                    {/* CTA */}
                    <button
                        onClick={handleNavigate}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        Try AI Chat Now
                    </button>
                </div>
            </div>
        </div>
    )
}
