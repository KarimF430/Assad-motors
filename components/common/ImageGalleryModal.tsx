'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Download,
    Share2,
    Heart,
    Maximize2,
    Minimize2
} from 'lucide-react'

interface GalleryImage {
    src: string
    alt: string
    caption?: string
    category?: 'all' | 'exterior' | 'interior' | 'features' | 'colors'
}

interface ImageGalleryModalProps {
    images: GalleryImage[]
    initialIndex?: number
    isOpen: boolean
    onClose: () => void
    carName: string
}

export default function ImageGalleryModal({
    images,
    initialIndex = 0,
    isOpen,
    onClose,
    carName
}: ImageGalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [isLiked, setIsLiked] = useState(false)
    const [showLikeAnimation, setShowLikeAnimation] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
    const imageContainerRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex)
            setZoomLevel(1)
            setDragPosition({ x: 0, y: 0 })
        }
    }, [isOpen, initialIndex])

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    goToPrevious()
                    break
                case 'ArrowRight':
                    goToNext()
                    break
                case 'Escape':
                    onClose()
                    break
                case '+':
                case '=':
                    handleZoomIn()
                    break
                case '-':
                    handleZoomOut()
                    break
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, currentIndex])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            // Store current scroll position
            const scrollY = window.scrollY
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'
            document.body.style.overflow = 'hidden'
        }

        return () => {
            // Cleanup on unmount or when isOpen changes to false
            if (isOpen) { // Only cleanup if it was open (handles unexpected unmounts)
                const scrollY = document.body.style.top
                document.body.style.position = ''
                document.body.style.top = ''
                document.body.style.width = ''
                document.body.style.overflow = ''
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }
    }, [isOpen])

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setZoomLevel(1)
        setDragPosition({ x: 0, y: 0 })
    }, [images.length])

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        setZoomLevel(1)
        setDragPosition({ x: 0, y: 0 })
    }, [images.length])

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.5, 3))
    }

    const handleZoomOut = () => {
        setZoomLevel((prev) => {
            const newZoom = Math.max(prev - 0.5, 1)
            if (newZoom === 1) {
                setDragPosition({ x: 0, y: 0 })
            }
            return newZoom
        })
    }

    const handleDownload = async () => {
        const currentImage = images[currentIndex]
        try {
            const response = await fetch(currentImage.src)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${carName.replace(/\s+/g, '-')}-${currentIndex + 1}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            window.open(currentImage.src, '_blank')
        }
    }

    const handleShare = async () => {
        const currentImage = images[currentIndex]
        const shareData = {
            title: `${carName} - Image Gallery`,
            text: currentImage.caption || `Check out this image of ${carName}!`,
            url: window.location.href
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (error) {
                console.log('Share cancelled')
            }
        } else {
            await navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    const handleLike = () => {
        setIsLiked(!isLiked)
        if (!isLiked) {
            setShowLikeAnimation(true)
            setTimeout(() => setShowLikeAnimation(false), 1000)
        }
    }

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            try {
                await modalRef.current?.requestFullscreen()
                setIsFullscreen(true)
            } catch (error) {
                console.log('Fullscreen not supported')
            }
        } else {
            await document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    // Touch handlers for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const minSwipeDistance = 50

        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) {
                goToNext()
            } else {
                goToPrevious()
            }
        }
    }

    // Double tap to zoom
    const handleDoubleClick = () => {
        if (zoomLevel === 1) {
            setZoomLevel(2)
        } else {
            setZoomLevel(1)
            setDragPosition({ x: 0, y: 0 })
        }
    }

    // Drag to pan when zoomed
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoomLevel > 1) {
            setIsDragging(true)
            e.preventDefault()
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoomLevel > 1) {
            setDragPosition(prev => ({
                x: prev.x + e.movementX,
                y: prev.y + e.movementY
            }))
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    if (!isOpen || images.length === 0) return null

    const currentImage = images[currentIndex]

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            {/* Header - White with border */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                {/* Left: Image counter */}
                <div className="text-gray-900 text-sm font-medium">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                        {currentIndex + 1} / {images.length}
                    </span>
                </div>

                {/* Right: Action buttons */}
                <div className="flex items-center gap-1">
                    {/* Download */}
                    <button
                        onClick={handleDownload}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download image"
                    >
                        <Download className="w-5 h-5" />
                    </button>

                    {/* Share */}
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Share"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>

                    {/* Like */}
                    <button
                        onClick={handleLike}
                        className={`p-2 rounded-lg transition-all ${isLiked
                            ? 'text-red-500 bg-red-50'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        title={isLiked ? "Unlike" : "Like"}
                    >
                        <Heart className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} />
                    </button>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Image Area */}
            <div
                ref={imageContainerRef}
                className="flex-1 relative flex items-center justify-center overflow-hidden bg-gray-50"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
            >
                {/* Navigation Arrow - Left */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white shadow-lg hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-700 transition-all border border-gray-200"
                >
                    <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>

                {/* Image */}
                <div
                    className="relative max-w-full max-h-full transition-transform duration-200"
                    style={{
                        transform: `scale(${zoomLevel}) translate(${dragPosition.x / zoomLevel}px, ${dragPosition.y / zoomLevel}px)`,
                    }}
                >
                    <img
                        src={currentImage.src}
                        alt={currentImage.alt}
                        className="max-w-[90vw] max-h-[70vh] object-contain select-none"
                        draggable={false}
                    />

                    {/* Like animation */}
                    {showLikeAnimation && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Heart className="w-24 h-24 text-red-500 fill-current animate-ping" />
                        </div>
                    )}
                </div>

                {/* Navigation Arrow - Right */}
                <button
                    onClick={goToNext}
                    className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white shadow-lg hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-700 transition-all border border-gray-200"
                >
                    <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
            </div>

            {/* Caption */}
            {currentImage.caption && (
                <div className="text-center py-3 px-4 bg-white border-t">
                    <p className="text-gray-900 text-sm sm:text-base font-medium">{currentImage.caption}</p>
                </div>
            )}

            {/* Thumbnail Strip */}
            <div className="bg-white border-t py-3 px-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index)
                                setZoomLevel(1)
                                setDragPosition({ x: 0, y: 0 })
                            }}
                            className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                                ? 'border-red-500 ring-2 ring-red-200'
                                : 'border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            <img
                                src={image.src}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile zoom controls */}
            <div className="sm:hidden fixed bottom-32 right-4 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    className="w-10 h-10 bg-white shadow-lg border border-gray-200 hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-700 disabled:opacity-40"
                >
                    <ZoomIn className="w-5 h-5" />
                </button>
                <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="w-10 h-10 bg-white shadow-lg border border-gray-200 hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-700 disabled:opacity-40"
                >
                    <ZoomOut className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
