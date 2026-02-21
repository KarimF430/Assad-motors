'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Star, Pencil, Search, ChevronDown } from 'lucide-react'
import Link from 'next/link'

// 6 Star Rating Categories (5 stars each)
const RATING_CATEGORIES = [
    { key: 'valueForMoney', label: 'Overall Value for Money' },
    { key: 'drivingComfort', label: 'Driving Comfort & Ride Quality' },
    { key: 'enginePerformance', label: 'Engine Performance & Mileage' },
    { key: 'maintenanceService', label: 'Maintenance & Service Experience' },
    { key: 'buildQuality', label: 'Build Quality & Safety Feel' },
    { key: 'featuresTechnology', label: 'Features & Technology' }
]

interface CarModel {
    id: string
    name: string
    brand: string
    slug: string
    brandSlug: string
    image?: string
}

interface RateReviewClientProps {
    brandSlug: string
    modelSlug: string
    carName: string
}

export default function RateReviewClient({ brandSlug, modelSlug, carName }: RateReviewClientProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    // Car selection state
    const [showCarSearch, setShowCarSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<CarModel[]>([])
    const [selectedCar, setSelectedCar] = useState<{ name: string; brandSlug: string; modelSlug: string }>({
        name: carName,
        brandSlug,
        modelSlug
    })
    const searchRef = useRef<HTMLDivElement>(null)

    // Form state
    const [starRatings, setStarRatings] = useState<Record<string, number>>({})
    const [reviewTitle, setReviewTitle] = useState('')
    const [reviewText, setReviewText] = useState('')
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    // Fetch all models and brands on mount and filter client-side
    const [allModels, setAllModels] = useState<CarModel[]>([])
    const [modelsLoaded, setModelsLoaded] = useState(false)

    // Auto-open search if no model selected
    useEffect(() => {
        if (!modelSlug || carName === 'Select your Car') {
            setShowCarSearch(true)
        }
    }, [modelSlug, carName])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

                // Fetch brands and models in parallel
                const [brandsRes, modelsRes] = await Promise.all([
                    fetch(`${API_URL}/api/brands`),
                    fetch(`${API_URL}/api/models`)
                ])

                const brandsData = await brandsRes.json()
                const modelsData = await modelsRes.json()

                // Create brand map for quick lookup
                const brandMap = new Map()
                if (Array.isArray(brandsData)) {
                    brandsData.forEach((brand: any) => {
                        brandMap.set(brand.id, {
                            name: brand.name,
                            slug: brand.name.toLowerCase().replace(/\s+/g, '-')
                        })
                    })
                }

                if (Array.isArray(modelsData)) {
                    setAllModels(modelsData.map((model: any) => {
                        const brandInfo = brandMap.get(model.brandId) || { name: 'Unknown', slug: '' }
                        return {
                            id: model.id || model._id,
                            name: model.name,
                            brand: brandInfo.name, // Use mapped brand name
                            slug: model.slug || model.name?.toLowerCase().replace(/\s+/g, '-'),
                            brandSlug: brandInfo.slug, // Use mapped brand slug
                            image: model.heroImage || model.image
                        }
                    }))
                }
                setModelsLoaded(true)
            } catch (error) {
                console.error('Failed to fetch data:', error)
                setModelsLoaded(true)
            }
        }
        fetchData()
    }, [])

    // Filter models based on search query
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([])
            return
        }

        const query = searchQuery.toLowerCase()
        const filtered = allModels.filter(model =>
            model.name?.toLowerCase().includes(query) ||
            model.brand?.toLowerCase().includes(query) ||
            `${model.brand} ${model.name}`.toLowerCase().includes(query)
        ).slice(0, 10)

        setSearchResults(filtered)
    }, [searchQuery, allModels])

    // Close search on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowCarSearch(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectCar = (car: CarModel) => {
        setSelectedCar({
            name: `${car.brand} ${car.name}`,
            brandSlug: car.brandSlug,
            modelSlug: car.slug
        })
        setShowCarSearch(false)
        setSearchQuery('')
        // Clear ratings when car changes
        setStarRatings({})
    }

    // Calculate consolidated rating
    const consolidatedRating = useMemo(() => {
        const values = Object.values(starRatings)
        if (values.length === 0) return { total: 0, average: 0, count: 0 }
        const total = values.reduce((sum, val) => sum + val, 0)
        const average = total / values.length
        return { total, average: Math.round(average * 10) / 10, count: values.length }
    }, [starRatings])

    const handleStarSelect = (category: string, value: number) => {
        setStarRatings(prev => ({ ...prev, [category]: value }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length + images.length > 5) {
            alert('Maximum 5 images allowed')
            return
        }
        const newImages = [...images, ...files].slice(0, 5)
        setImages(newImages)
        const previews = newImages.map(file => URL.createObjectURL(file))
        setImagePreviews(previews)
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = imagePreviews.filter((_, i) => i !== index)
        setImages(newImages)
        setImagePreviews(newPreviews)
    }

    const validateForm = (): string | null => {
        for (const cat of RATING_CATEGORIES) {
            if (!starRatings[cat.key]) return `Please rate ${cat.label}`
        }
        if (reviewText.length < 300) return 'Review must be at least 300 characters'
        if (reviewTitle.length < 10) return 'Title must be at least 10 characters'
        if (!userName.trim()) return 'Please enter your name'
        if (!userEmail.trim() || !userEmail.includes('@')) return 'Please enter a valid email'
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationError = validateForm()
        if (validationError) {
            setSubmitError(validationError)
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            const formData = new FormData()
            formData.append('brandSlug', selectedCar.brandSlug)
            formData.append('modelSlug', selectedCar.modelSlug)
            formData.append('userName', userName)
            formData.append('userEmail', userEmail)
            formData.append('drivingExperience', 'Owner') // Default value required by backend
            formData.append('starRatings', JSON.stringify(starRatings))
            formData.append('reviewTitle', reviewTitle)
            formData.append('reviewText', reviewText)
            images.forEach(image => formData.append('images', image))

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
            const response = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                body: formData
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Failed to submit review')
            setSubmitSuccess(true)
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit review')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center border border-orange-100">
                    <div className="text-5xl sm:text-6xl mb-4">🎉</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                        Your review has been submitted successfully.
                    </p>
                    <Link
                        href={`/${selectedCar.brandSlug}-cars/${selectedCar.modelSlug}`}
                        className="inline-block bg-[#291e6a] hover:bg-[#1c144a] text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg"
                    >
                        Back to {selectedCar.name}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-orange-50 rounded-xl transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5 text-red-600" />
                        </button>
                        <div>
                            <p className="text-xs sm:text-sm text-orange-600 font-medium">Rate and Review</p>
                            <h1 className="text-base sm:text-lg font-bold text-gray-900">{selectedCar.name}</h1>
                        </div>
                    </div>

                    {/* Consolidated Rating */}
                    {consolidatedRating.count > 0 && (
                        <div className="flex items-center gap-2 bg-[#291e6a] px-3 py-2 rounded-xl shadow-md">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-300" />
                            <span className="text-sm sm:text-base font-bold text-white">{consolidatedRating.average}</span>
                            <span className="text-xs text-white/80 hidden sm:inline">({consolidatedRating.count}/6)</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Error Message */}
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-xl text-sm">
                            {submitError}
                        </div>
                    )}

                    {/* Car Selection with Search */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-100 shadow-sm relative" ref={searchRef}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-orange-600 font-medium mb-1">Selected Car</p>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{selectedCar.name}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCarSearch(!showCarSearch)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:from-red-100 hover:to-orange-100 border border-orange-200 rounded-xl transition-all"
                            >
                                <Pencil className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-600">Change</span>
                                <ChevronDown className={`w-4 h-4 text-red-600 transition-transform ${showCarSearch ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Car Search Dropdown */}
                        {showCarSearch && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-orange-200 shadow-xl z-30 p-3">
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for a car model..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                                        autoFocus
                                    />
                                </div>

                                {searchQuery.length >= 2 && searchResults.length === 0 && modelsLoaded && (
                                    <div className="text-center py-4 text-gray-500 text-sm">No cars found</div>
                                )}

                                {searchResults.length > 0 && (
                                    <div className="max-h-60 overflow-y-auto space-y-1">
                                        {searchResults.map(car => (
                                            <button
                                                key={car.id}
                                                type="button"
                                                onClick={() => handleSelectCar(car)}
                                                className="w-full flex items-center gap-3 p-2.5 hover:bg-orange-50 rounded-lg transition-colors text-left"
                                            >
                                                {car.image && (
                                                    <img
                                                        src={car.image}
                                                        alt={car.name}
                                                        className="w-12 h-8 object-contain rounded"
                                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{car.brand} {car.name}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {searchQuery.length < 2 && (
                                    <p className="text-center py-4 text-gray-400 text-sm">Type at least 2 characters to search</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Star Ratings Section */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-sm">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
                            Rate your experience
                        </h3>

                        <div className="space-y-4 sm:space-y-5">
                            {RATING_CATEGORIES.map(category => (
                                <div key={category.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <p className="text-sm font-medium text-gray-700">{category.label}</p>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(value => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => handleStarSelect(category.key, value)}
                                                className="p-0.5 sm:p-1 transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Star
                                                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${starRatings[category.key] >= value
                                                        ? 'text-orange-400 fill-orange-400'
                                                        : 'text-gray-200'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-sm space-y-4">
                        <div>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Share the details of your experience..."
                                className="w-full h-32 sm:h-40 px-3 sm:px-4 py-3 border border-orange-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base bg-orange-50/30"
                            />
                            <p className={`text-xs sm:text-sm text-right mt-1 ${reviewText.length < 300 ? 'text-gray-400' : 'text-green-600 font-medium'}`}>
                                {reviewText.length}/300 min
                            </p>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={reviewTitle}
                                onChange={(e) => setReviewTitle(e.target.value)}
                                placeholder="Review Title"
                                className="w-full px-3 sm:px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base bg-orange-50/30"
                            />
                            <p className={`text-xs sm:text-sm text-right mt-1 ${reviewTitle.length < 10 ? 'text-gray-400' : 'text-green-600 font-medium'}`}>
                                Min 10 chars
                            </p>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 sm:mb-4">
                            Photos <span className="font-normal text-gray-400">(Optional)</span>
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-orange-200">
                                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {images.length < 5 && (
                                <label className="w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center border-2 border-dashed border-orange-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all">
                                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                                    <span className="text-xs text-orange-500 mt-1">Add</span>
                                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-sm space-y-3 sm:space-y-4">
                        <h3 className="text-sm font-bold text-gray-900">
                            Your Details<span className="text-red-500">*</span>
                        </h3>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Your name"
                            className="w-full px-3 sm:px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base bg-orange-50/30"
                        />
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="Your email"
                            className="w-full px-3 sm:px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base bg-orange-50/30"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#291e6a] hover:bg-[#1c144a] disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl text-base sm:text-lg"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    )
}
