'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Ad3DCarouselProps {
    className?: string
    autoRotate?: boolean
    rotateInterval?: number
}

export default function Ad3DCarousel({
    className = '',
    autoRotate = true,
    rotateInterval = 4000
}: Ad3DCarouselProps) {
    // Temporarily hide all ads
    return null;
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [currentTranslate, setCurrentTranslate] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Premium ad data with vibrant gradients
    const ads = [
        {
            id: 1,
            title: 'Monsoon Service Camp',
            subtitle: 'Free 40-Point Checkup',
            description: 'Ensure your car is monsoon ready. 20% off on labor.',
            image: 'https://images.unsplash.com/photo-1632823471565-1ec2a1ad4015?w=1200&h=600&fit=crop',
            gradient: 'from-blue-600 via-cyan-600 to-teal-600',
            cta: 'Book Service',
            link: '/service',
            badge: 'LIMITED'
        },
        {
            id: 2,
            title: 'New Tata Nexon',
            subtitle: 'Way Ahead',
            description: 'Book now and get priority delivery + accessories worth ₹15k',
            image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=600&fit=crop',
            gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
            cta: 'Check Offers',
            link: '/tata-cars/nexon',
            badge: 'LAUNCH'
        },
        {
            id: 3,
            title: 'Zero Dep Insurance',
            subtitle: 'Starting @ ₹2099',
            description: 'Protect your car with comprehensive coverage. Cashless claims.',
            image: 'https://images.unsplash.com/photo-1450101499121-e5b934472494?w=1200&h=600&fit=crop',
            gradient: 'from-orange-600 via-amber-600 to-yellow-600',
            cta: 'Get Quote',
            link: '/insurance',
            badge: 'SAVE 40%'
        },
        {
            id: 4,
            title: 'Sell Your Car',
            subtitle: 'Best Price Guarantee',
            description: 'Get instant valuation and payment in 1 hour. Free RC transfer.',
            image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200&h=600&fit=crop',
            gradient: 'from-emerald-600 via-green-600 to-lime-600',
            cta: 'Get Value',
            link: '/sell-car',
            badge: 'INSTANT'
        },
        {
            id: 5,
            title: 'Premium Tyres',
            subtitle: 'Buy 3 Get 1 Free',
            description: 'Upgrade your ride with premium tyres. Michelin, Bridgestone & more.',
            image: 'https://images.unsplash.com/photo-1578844251758-2f71da645217?w=1200&h=600&fit=crop',
            gradient: 'from-red-600 via-rose-600 to-pink-600',
            cta: 'Shop Now',
            link: '/accessories/tyres',
            badge: 'OFFER'
        }
    ]

    // Auto-rotate
    useEffect(() => {
        if (!autoRotate || !isVisible || isDragging) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length)
        }, rotateInterval)

        return () => clearInterval(interval)
    }, [autoRotate, isVisible, isDragging, ads.length, rotateInterval])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % ads.length)
    }

    // Touch/Mouse drag handlers
    const handleDragStart = (clientX: number) => {
        setIsDragging(true)
        setStartX(clientX)
    }

    const handleDragMove = (clientX: number) => {
        if (!isDragging) return
        const diff = clientX - startX
        setCurrentTranslate(diff)
    }

    const handleDragEnd = () => {
        setIsDragging(false)

        if (Math.abs(currentTranslate) > 100) {
            if (currentTranslate > 0) {
                goToPrevious()
            } else {
                goToNext()
            }
        }

        setCurrentTranslate(0)
    }

    if (!isVisible) return null

    // Calculate which slides are visible (current, prev, next)
    const getSlidePosition = (index: number) => {
        const diff = index - currentIndex

        if (diff === 0) return 'center'
        if (diff === 1 || diff === -(ads.length - 1)) return 'right'
        if (diff === -1 || diff === ads.length - 1) return 'left'
        return 'hidden'
    }

    const getSlideStyle = (position: string) => {
        const baseStyle = 'absolute top-0 transition-all duration-700 ease-out'

        switch (position) {
            case 'center':
                return `${baseStyle} left-1/2 -translate-x-1/2 z-30 scale-100 opacity-100`
            case 'left':
                return `${baseStyle} left-0 -translate-x-[20%] z-20 scale-90 opacity-60 blur-[2px]`
            case 'right':
                return `${baseStyle} right-0 translate-x-[20%] z-20 scale-90 opacity-60 blur-[2px]`
            default:
                return `${baseStyle} left-1/2 -translate-x-1/2 z-10 scale-75 opacity-0`
        }
    }

    return (
        <div className={`relative w-full ${className}`}>
            {/* Close button */}
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-1.5 sm:p-2 transition-all shadow-lg hover:shadow-xl"
                aria-label="Close carousel"
            >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
            </button>

            {/* 3D Carousel Container */}
            <div
                ref={containerRef}
                className="relative h-[140px] sm:h-[160px] lg:h-[180px] overflow-hidden rounded-xl mx-auto"
                style={{ perspective: '1000px', maxWidth: '100%' }}
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onMouseMove={(e) => handleDragMove(e.clientX)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                onTouchEnd={handleDragEnd}
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

                {/* Slides */}
                {ads.map((ad, index) => {
                    const position = getSlidePosition(index)

                    return (
                        <div
                            key={ad.id}
                            className={`${getSlideStyle(position)} w-[340px] sm:w-[380px] lg:w-[398px] max-w-[90%] cursor-grab active:cursor-grabbing`}
                            style={{
                                transform: isDragging && position === 'center'
                                    ? `translateX(calc(-50% + ${currentTranslate}px))`
                                    : undefined
                            }}
                            onClick={() => position !== 'center' && goToSlide(index)}
                        >
                            {/* Card */}
                            <div className={`relative h-[140px] sm:h-[160px] lg:h-[180px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${ad.gradient}`}>
                                {/* Badge */}
                                <div className="absolute top-1.5 left-2 sm:top-2 sm:left-3 z-20">
                                    <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-1.5 py-0.5 sm:px-2 rounded-full text-[8px] sm:text-[9px] font-bold shadow-sm animate-pulse">
                                        {ad.badge}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative h-full flex flex-row items-center justify-between p-2 sm:p-2.5 lg:p-3 gap-2 sm:gap-3">
                                    {/* Text Content */}
                                    <div className="flex-1 text-white space-y-0.5 sm:space-y-1 z-10 min-w-0 pt-1 sm:pt-2">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] sm:text-[9px] font-semibold text-white/80 uppercase tracking-wider">
                                                {ad.subtitle}
                                            </p>
                                            <h2 className="text-base sm:text-lg font-bold leading-tight truncate">
                                                {ad.title}
                                            </h2>
                                        </div>

                                        <p className="text-[10px] sm:text-xs text-white/90 line-clamp-2 leading-tight">
                                            {ad.description}
                                        </p>

                                        <a
                                            href={ad.link}
                                            className="inline-flex items-center gap-0.5 sm:gap-1 bg-white text-gray-900 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md font-bold text-[9px] sm:text-[10px] hover:bg-gray-100 transition-all shadow-md hover:shadow-lg hover:scale-105 transform mt-0.5 sm:mt-1"
                                        >
                                            {ad.cta}
                                            <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                        </a>
                                    </div>

                                    {/* Image */}
                                    <div className="flex-shrink-0 relative h-[110px] w-[130px] sm:h-[130px] sm:w-[150px] lg:h-[140px] lg:w-[160px] mt-1 sm:mt-2">
                                        <div className="absolute inset-0 rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={ad.image}
                                                alt={ad.title}
                                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200' fill='%23ffffff20'%3E%3Crect width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23ffffff' font-size='24' font-family='Arial'%3EAd%3C/text%3E%3C/svg%3E"
                                                }}
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                        </div>
                                    </div>
                                </div>

                                {/* Animated background pattern */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-slow" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 sm:p-3 md:p-4 transition-all shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-900" />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 sm:p-3 md:p-4 transition-all shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Next slide"
            >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-900" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-1.5 sm:gap-2">
                {ads.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all rounded-full ${index === currentIndex
                            ? 'w-6 h-2 sm:w-8 sm:h-2.5 lg:w-10 lg:h-3 bg-white'
                            : 'w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-white/50 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress bar */}
            {autoRotate && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-40">
                    <div
                        className="h-full bg-white transition-all"
                        style={{
                            width: '100%',
                            animation: `progress ${rotateInterval}ms linear infinite`
                        }}
                    />
                </div>
            )}
        </div>
    )
}
