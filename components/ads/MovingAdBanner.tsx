'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface AdBannerProps {
    variant?: 'horizontal' | 'vertical' | 'square'
    className?: string
}

export default function MovingAdBanner({ variant = 'horizontal', className = '' }: AdBannerProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [currentAdIndex, setCurrentAdIndex] = useState(0)

    // Sample ad data - replace with real ads from your backend
    const ads = [
        {
            id: 1,
            title: 'Get Best Car Deals',
            description: 'Save up to ₹2 Lakhs on your dream car',
            image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=400&fit=crop',
            cta: 'Explore Deals',
            link: '/deals',
            bgGradient: 'from-blue-600 to-purple-600'
        },
        {
            id: 2,
            title: 'Electric Cars 2025',
            description: 'Discover the future of mobility',
            image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=400&fit=crop',
            cta: 'View EVs',
            link: '/electric-cars',
            bgGradient: 'from-green-600 to-teal-600'
        },
        {
            id: 3,
            title: 'Car Insurance',
            description: 'Get instant quotes from top insurers',
            image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=400&fit=crop',
            cta: 'Get Quote',
            link: '/insurance',
            bgGradient: 'from-orange-600 to-red-600'
        },
        {
            id: 4,
            title: 'Car Loan EMI',
            description: 'Low interest rates starting from 7.5%',
            image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=400&fit=crop',
            cta: 'Calculate EMI',
            link: '/emi-calculator',
            bgGradient: 'from-indigo-600 to-blue-600'
        }
    ]

    // Auto-rotate ads every 5 seconds
    useEffect(() => {
        if (!isVisible) return

        const interval = setInterval(() => {
            setCurrentAdIndex((prev) => (prev + 1) % ads.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isVisible, ads.length])

    if (!isVisible) return null

    const currentAd = ads[currentAdIndex]

    // Horizontal banner (default)
    if (variant === 'horizontal') {
        return (
            <div className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}>
                {/* Close button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 transition-all shadow-md"
                    aria-label="Close ad"
                >
                    <X className="h-4 w-4 text-gray-700" />
                </button>

                {/* Ad content */}
                <div className={`relative bg-gradient-to-r ${currentAd.bgGradient} overflow-hidden`}>
                    <div className="grid md:grid-cols-2 gap-6 items-center p-6 md:p-8">
                        {/* Text content */}
                        <div className="text-white space-y-4 z-10">
                            <h3 className="text-2xl md:text-3xl font-bold animate-fade-in">
                                {currentAd.title}
                            </h3>
                            <p className="text-base md:text-lg text-white/90 animate-fade-in-delay">
                                {currentAd.description}
                            </p>
                            <a
                                href={currentAd.link}
                                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 animate-fade-in-delay-2"
                            >
                                {currentAd.cta}
                            </a>
                        </div>

                        {/* Image */}
                        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden animate-slide-in">
                            <img
                                src={currentAd.image}
                                alt={currentAd.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400' fill='%23ffffff20'%3E%3Crect width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23ffffff' font-size='24' font-family='Arial'%3EAd Banner%3C/text%3E%3C/svg%3E"
                                }}
                            />
                        </div>
                    </div>

                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
                    </div>
                </div>

                {/* Pagination dots */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {ads.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentAdIndex(index)}
                            className={`h-2 rounded-full transition-all ${index === currentAdIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to ad ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        )
    }

    // Vertical banner
    if (variant === 'vertical') {
        return (
            <div className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 transition-all shadow-md"
                    aria-label="Close ad"
                >
                    <X className="h-4 w-4 text-gray-700" />
                </button>

                <div className={`relative bg-gradient-to-b ${currentAd.bgGradient} p-6 min-h-[400px] flex flex-col`}>
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4 animate-slide-in">
                        <img
                            src={currentAd.image}
                            alt={currentAd.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23ffffff20'%3E%3Crect width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23ffffff' font-size='20' font-family='Arial'%3EAd%3C/text%3E%3C/svg%3E"
                            }}
                        />
                    </div>

                    <div className="text-white space-y-3 flex-1">
                        <h3 className="text-xl font-bold animate-fade-in">{currentAd.title}</h3>
                        <p className="text-sm text-white/90 animate-fade-in-delay">{currentAd.description}</p>
                    </div>

                    <a
                        href={currentAd.link}
                        className="block text-center bg-white text-gray-900 px-4 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl mt-4 animate-fade-in-delay-2"
                    >
                        {currentAd.cta}
                    </a>

                    <div className="flex justify-center gap-2 mt-4">
                        {ads.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentAdIndex(index)}
                                className={`h-2 rounded-full transition-all ${index === currentAdIndex
                                        ? 'w-8 bg-white'
                                        : 'w-2 bg-white/50 hover:bg-white/75'
                                    }`}
                                aria-label={`Go to ad ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Square banner
    return (
        <div className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 transition-all shadow-md"
                aria-label="Close ad"
            >
                <X className="h-4 w-4 text-gray-700" />
            </button>

            <div className={`relative bg-gradient-to-br ${currentAd.bgGradient} aspect-square p-6 flex flex-col`}>
                <div className="relative flex-1 rounded-xl overflow-hidden mb-4 animate-slide-in">
                    <img
                        src={currentAd.image}
                        alt={currentAd.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23ffffff20'%3E%3Crect width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23ffffff' font-size='20' font-family='Arial'%3EAd%3C/text%3E%3C/svg%3E"
                        }}
                    />
                </div>

                <div className="text-white space-y-2">
                    <h3 className="text-lg font-bold animate-fade-in">{currentAd.title}</h3>
                    <p className="text-xs text-white/90 animate-fade-in-delay">{currentAd.description}</p>
                </div>

                <a
                    href={currentAd.link}
                    className="block text-center bg-white text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl mt-3 text-sm animate-fade-in-delay-2"
                >
                    {currentAd.cta}
                </a>

                <div className="flex justify-center gap-1.5 mt-3">
                    {ads.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentAdIndex(index)}
                            className={`h-1.5 rounded-full transition-all ${index === currentAdIndex
                                    ? 'w-6 bg-white'
                                    : 'w-1.5 bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to ad ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
