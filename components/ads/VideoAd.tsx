'use client'

import { useEffect, useState, useRef } from 'react'

interface VideoAdProps {
    videoId: string
    className?: string
    variant?: 'floating' | 'inline'
}

export default function VideoAd({ videoId, className = '', variant = 'floating' }: VideoAdProps) {
    const [isVisible, setIsVisible] = useState(variant === 'inline')
    const [isLoaded, setIsLoaded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Lazy load: Only load when component is in viewport
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isLoaded) {
                        // Add delay to ensure it loads last
                        setTimeout(() => {
                            setIsLoaded(true)
                        }, 1000) // 1 second delay after becoming visible
                    }
                })
            },
            {
                root: null,
                rootMargin: '200px', // Start loading 200px before visible
                threshold: 0.1
            }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current)
            }
        }
    }, [isLoaded])

    // Auto-close after 20 seconds if video is playing (only for floating)
    useEffect(() => {
        if (variant === 'floating' && isVisible && isLoaded) {
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, 25000) // Close after 25 seconds (20s video + 5s buffer)

            return () => clearTimeout(timer)
        }
    }, [isVisible, isLoaded, variant])

    if (variant === 'inline') {
        return (
            <div ref={containerRef} className={`w-full max-w-4xl mx-auto ${className}`}>
                {isLoaded ? (
                    <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
                        {/* Ad Badge */}
                        <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            AD
                        </div>

                        <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`}
                                title="Video Advertisement"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="w-full aspect-video bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
                        <span className="text-gray-400 font-medium">Loading Advertisement...</span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div ref={containerRef} className={className}>
            {isLoaded && (
                <div className="relative">
                    {/* Video Ad Container */}
                    <div className={`
            fixed z-50 transition-all duration-500 ease-in-out
            ${isVisible ? 'bottom-4 right-4 opacity-100' : 'bottom-4 right-4 opacity-0 pointer-events-none'}
          `}>
                        <div className="relative bg-black rounded-lg shadow-2xl overflow-hidden max-w-sm w-80 sm:w-96">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-black text-white rounded-full p-2 transition-colors"
                                aria-label="Close video ad"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Ad Badge */}
                            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                AD
                            </div>

                            {/* YouTube Iframe */}
                            <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                                    title="Video Advertisement"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Show Ad Button (appears after page loads) */}
                    {!isVisible && (
                        <button
                            onClick={() => setIsVisible(true)}
                            className="fixed bottom-4 right-4 bg-[#291e6a] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 z-40"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                            </svg>
                            <span className="font-medium">Watch Video</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
