'use client'

import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Camera, ChevronDown } from 'lucide-react'
import Footer from '@/components/Footer'

// Lazy load the modal - it's heavy and only needed on click
const ImageGalleryModal = lazy(() => import('@/components/common/ImageGalleryModal'))

interface GalleryImage {
    src: string
    alt: string
    caption?: string
    category: 'all' | 'exterior' | 'interior' | 'colors'
}

interface ColorImage {
    caption?: string
    imageUrl: string
    hexCode?: string
}

interface GalleryData {
    brand: string
    brandSlug: string
    model: string
    modelSlug: string
    heroImage: string
    gallery: string[]
    colorImages: ColorImage[]
    keyFeaturesImages: Array<{ caption?: string; imageUrl: string }>
    interiorImages: string[]
    exteriorImages: string[]
    seoDescription: string
    rating: number
    reviewCount: number
}

interface ModelGalleryClientProps {
    galleryData: GalleryData
}

type GallerySection = 'all' | 'exterior' | 'interior' | 'colors'

// Optimized image component with blur placeholder
function GalleryImageCard({
    image,
    index,
    onClick
}: {
    image: GalleryImage
    index: number
    onClick: () => void
}) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    return (
        <div
            onClick={onClick}
            className="cursor-pointer rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-red-200 hover:shadow-md transition-all duration-200"
        >
            <div className="aspect-[4/3] relative bg-gray-100">
                {!isLoaded && !hasError && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setHasError(true)
                        setIsLoaded(true)
                    }}
                />
                {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <Camera className="w-8 h-8 text-gray-300" />
                    </div>
                )}
            </div>
            <p className="px-3 py-2 text-sm text-gray-700 truncate font-medium">
                {image.caption}
            </p>
        </div>
    )
}

export default function ModelGalleryClient({ galleryData }: ModelGalleryClientProps) {
    const [activeSection, setActiveSection] = useState<GallerySection>('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalInitialIndex, setModalInitialIndex] = useState(0)
    const [showAll, setShowAll] = useState(false)

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Prepare all images with categories - memoized
    const allImages: GalleryImage[] = useMemo(() => {
        const images: GalleryImage[] = []

        if (galleryData.heroImage) {
            images.push({
                src: galleryData.heroImage,
                alt: `${galleryData.brand} ${galleryData.model}`,
                caption: 'Front Three Quarter',
                category: 'exterior'
            })
        }

        galleryData.gallery.forEach((img, idx) => {
            const captions = ['Left Side', 'Rear View', 'Front View', 'Side Profile']
            images.push({
                src: img,
                alt: `${galleryData.brand} ${galleryData.model} - ${idx + 1}`,
                caption: captions[idx % captions.length],
                category: 'exterior'
            })
        })

        galleryData.exteriorImages.forEach((img, idx) => {
            images.push({
                src: img,
                alt: `${galleryData.brand} ${galleryData.model} Exterior`,
                caption: `Exterior ${idx + 1}`,
                category: 'exterior'
            })
        })

        galleryData.interiorImages.forEach((img, idx) => {
            const captions = ['Dashboard', 'Steering', 'Seats', 'Console']
            images.push({
                src: img,
                alt: `${galleryData.brand} ${galleryData.model} Interior`,
                caption: captions[idx % captions.length],
                category: 'interior'
            })
        })

        galleryData.keyFeaturesImages.forEach((img) => {
            if (img.imageUrl) {
                images.push({
                    src: img.imageUrl,
                    alt: img.caption || 'Feature',
                    caption: img.caption,
                    category: 'interior'
                })
            }
        })

        galleryData.colorImages.forEach((img) => {
            if (img.imageUrl) {
                images.push({
                    src: img.imageUrl,
                    alt: img.caption || 'Colour',
                    caption: img.caption,
                    category: 'colors'
                })
            }
        })

        return images
    }, [galleryData])

    // Pre-compute section counts once
    const sectionCounts = useMemo(() => ({
        all: allImages.length,
        exterior: allImages.filter(img => img.category === 'exterior').length,
        interior: allImages.filter(img => img.category === 'interior').length,
        colors: allImages.filter(img => img.category === 'colors').length
    }), [allImages])

    // Filter images based on active section
    const filteredImages = useMemo(() => {
        if (activeSection === 'all') return allImages
        return allImages.filter(img => img.category === activeSection)
    }, [allImages, activeSection])

    // Only show first 6 images initially for faster render
    const displayImages = showAll ? filteredImages : filteredImages.slice(0, 6)

    const openModal = (index: number) => {
        const img = displayImages[index]
        const actualIndex = allImages.findIndex(i => i.src === img.src)
        setModalInitialIndex(actualIndex >= 0 ? actualIndex : 0)
        setIsModalOpen(true)
    }

    const carName = `${galleryData.brand} ${galleryData.model}`

    return (
        <div className="min-h-screen bg-white">
            {/* Header - White with border */}
            {/* Header - White with border */}
            <div className="bg-white border-b z-40">
                <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
                    <Link
                        href={`/${galleryData.brandSlug}-cars/${galleryData.modelSlug}`}
                        className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                        prefetch={false}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm font-medium">{sectionCounts.all} Images</span>
                    </div>
                </div>
            </div>

            {/* Title Section */}
            <div className="bg-white border-b">
                <div className="px-4 py-4 max-w-7xl mx-auto">
                    <h1 className="text-xl font-bold text-gray-900">
                        {carName} <span className="bg-[#291e6a] bg-clip-text text-transparent">Images</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View {carName} images - interior, exterior and {sectionCounts.colors} colours.
                    </p>
                </div>
            </div>

            {/* Section Tabs */}
            {/* Section Tabs */}
            <div className="bg-white border-b z-30">
                <div className="px-4 max-w-7xl mx-auto">
                    <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'model', label: galleryData.model, isLabel: true },
                            { id: 'all', label: 'All' },
                            { id: 'exterior', label: 'Exterior' },
                            { id: 'interior', label: 'Interior' },
                            { id: 'colors', label: 'Colours' }
                        ].map((tab, idx) => (
                            <button
                                key={idx}
                                onClick={() => !tab.isLabel && setActiveSection(tab.id as GallerySection)}
                                className={`py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${tab.isLabel
                                    ? 'text-gray-900 font-semibold border-transparent'
                                    : activeSection === tab.id
                                        ? 'text-red-600 font-medium border-red-600'
                                        : 'text-gray-500 font-medium border-transparent hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Image Grid */}
            <div className="px-4 py-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {displayImages.map((image, index) => (
                        <GalleryImageCard
                            key={`${image.src}-${index}`}
                            image={image}
                            index={index}
                            onClick={() => openModal(index)}
                        />
                    ))}
                </div>

                {/* View More Button */}
                {filteredImages.length > 6 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className={`w-full mt-5 py-3 text-sm font-medium flex items-center justify-center gap-1 rounded-xl transition-all duration-200 ${showAll
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-[#291e6a] text-white hover:bg-[#1c144a] shadow-md'
                            }`}
                    >
                        {showAll ? 'Show Less' : `View All ${filteredImages.length} Images`}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>

            {/* Link to Model Page */}
            <div className="px-4 pb-8 max-w-7xl mx-auto">
                <Link
                    href={`/${galleryData.brandSlug}-cars/${galleryData.modelSlug}`}
                    className="block text-center bg-[#291e6a] bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity"
                    prefetch={false}
                >
                    View {carName} Details →
                </Link>
            </div>

            <Footer />

            {/* Lazy-loaded Modal */}
            {isModalOpen && (
                <Suspense fallback={
                    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
                    </div>
                }>
                    <ImageGalleryModal
                        images={allImages}
                        initialIndex={modalInitialIndex}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        carName={carName}
                    />
                </Suspense>
            )}
        </div>
    )
}
