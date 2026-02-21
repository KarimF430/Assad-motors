'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, ChevronRight, Fuel, Car, Users, Calendar, IndianRupee, Search, Shield, FileCheck, AlertTriangle, CheckCircle, ExternalLink, RotateCcw } from 'lucide-react'
import { subscribeToCityChange } from '@/lib/city-events'
import Footer from '@/components/Footer'
import FeedbackSection from '@/components/car-model/FeedbackSection'
import Breadcrumb from '@/components/common/Breadcrumb'

// Used Car Platforms with URL generators - Universal list
const usedCarPlatforms = [
    {
        name: 'Cars24',
        logo: '🚗',
        description: 'Certified used cars with warranty',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const searchParam = query ? `&search=${encodeURIComponent(query)}` : ''
            return `https://www.cars24.com/buy-used-cars-${citySlug}/?${searchParam}`
        }
    },
    {
        name: 'Spinny',
        logo: '🔄',
        description: 'Full car history with warranty',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const searchParam = query ? `?q=${encodeURIComponent(query)}` : ''
            return `https://www.spinny.com/used-cars/${citySlug}/${searchParam}`
        }
    },
    {
        name: 'OLX Autos',
        logo: '📱',
        description: 'Buy from verified sellers',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const searchParam = query ? encodeURIComponent(query) : ''
            return `https://www.olx.in/cars_c84/${citySlug}?q=${searchParam}`
        }
    },
    {
        name: 'CarWale',
        logo: '🚙',
        description: 'Compare prices & deals',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const searchParam = query ? `keyword=${encodeURIComponent(query)}&` : ''
            return `https://www.carwale.com/used/cars-in-${citySlug}/?${searchParam}`
        }
    },
    {
        name: 'CarDekho',
        logo: '🔍',
        description: 'Large inventory with reviews',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const searchParam = query ? `&q=${encodeURIComponent(query)}` : ''
            return `https://www.cardekho.com/used-cars+in+${citySlug}${searchParam}`
        }
    },
    {
        name: 'Droom',
        logo: '💎',
        description: 'AI-powered car marketplace',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase()
            const searchParam = query ? encodeURIComponent(query) : ''
            return `https://droom.in/used-cars/${citySlug}?q=${searchParam}`
        }
    },
    {
        name: 'Maruti True Value',
        logo: '🏪',
        description: 'Maruti certified pre-owned',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            return `https://www.marutitruevalue.com/used-cars/${citySlug}`
        }
    },
    {
        name: 'Mahindra First Choice',
        logo: '🛡️',
        description: 'Multi-brand certified cars',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            return `https://www.mahindrafirstchoice.com/buy-used-car/${citySlug}`
        }
    },
    {
        name: 'CarTrade',
        logo: '💼',
        description: 'New & used car marketplace',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const searchParam = query ? `?keyword=${encodeURIComponent(query)}` : ''
            return `https://www.cartrade.com/buy-used-cars/${citySlug}/${searchParam}`
        }
    },
    {
        name: 'Quikr Cars',
        logo: '⚡',
        description: 'Classifieds with quick deals',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const searchParam = query ? `?q=${encodeURIComponent(query)}` : ''
            return `https://www.quikr.com/cars-bikes/cars/${citySlug}${searchParam}`
        }
    },
    {
        name: 'Truebil',
        logo: '✅',
        description: 'Inspected used cars',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            return `https://www.truebil.com/used-cars-in-${citySlug}`
        }
    },
    {
        name: 'Park+',
        logo: '🅿️',
        description: 'FASTag & car services',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            return `https://www.parkplus.io/used-cars/${citySlug}`
        }
    },
    {
        name: 'Gaadi',
        logo: '🚘',
        description: 'Car portal with reviews',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const searchParam = query ? `?q=${encodeURIComponent(query)}` : ''
            return `https://www.gaadi.com/used-cars/${citySlug}${searchParam}`
        }
    },
    {
        name: 'Toyota U Trust',
        logo: '🔷',
        description: 'Toyota certified used cars',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            return `https://www.toyotabharat.com/utrust/buy-a-car?city=${citySlug}`
        }
    },
    {
        name: 'Hyundai Promise',
        logo: '🔶',
        description: 'Hyundai certified pre-owned',
        getUrl: (query: string, city: string) => {
            const citySlug = city.toLowerCase()
            return `https://www.hyundai.com/in/en/find-a-car/used-cars?city=${citySlug}`
        }
    },
    {
        name: 'Facebook Marketplace',
        logo: '📘',
        description: 'Local sellers near you',
        getUrl: (query: string, city: string) => {
            const searchParam = query ? encodeURIComponent(query) : 'used car'
            return `https://www.facebook.com/marketplace/category/vehicles?query=${searchParam}`
        }
    }
]

// Items per page for pagination
const ITEMS_PER_PAGE = 6

// Filter options
const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
const transmissionTypes = ['Manual', 'Automatic']
const ownerOptions = ['1st', '2nd', '3rd', '4th+']

interface CarModel {
    id: string
    name: string
    brand: string
    slug: string
    brandSlug: string
}

export default function UsedCarsClient() {
    const [selectedCity, setSelectedCity] = useState('Mumbai')
    const [searchQuery, setSearchQuery] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [allModels, setAllModels] = useState<CarModel[]>([])
    const [filteredModels, setFilteredModels] = useState<CarModel[]>([])
    const [showResults, setShowResults] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const searchRef = useRef<HTMLDivElement>(null)
    const resultsRef = useRef<HTMLDivElement>(null)

    // Pagination computed values
    const totalPages = Math.ceil(usedCarPlatforms.length / ITEMS_PER_PAGE)
    const visiblePlatforms = usedCarPlatforms.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

    // Filter states
    const [budgetMax, setBudgetMax] = useState(50)
    const [carAgeMax, setCarAgeMax] = useState(10)
    const [selectedFuel, setSelectedFuel] = useState<string[]>([])
    const [selectedTransmission, setSelectedTransmission] = useState<string[]>([])
    const [selectedOwners, setSelectedOwners] = useState<string[]>([])

    // Fetch car models
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
                const [brandsRes, modelsRes] = await Promise.all([
                    fetch(`${API_URL}/api/brands`),
                    fetch(`${API_URL}/api/models`)
                ])
                const brandsData = await brandsRes.json()
                const modelsData = await modelsRes.json()

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
                            brand: brandInfo.name,
                            slug: model.slug || model.name?.toLowerCase().replace(/\s+/g, '-'),
                            brandSlug: brandInfo.slug,
                        }
                    }))
                }
            } catch (error) {
                console.error('Failed to fetch models:', error)
            }
        }
        fetchModels()
    }, [])

    // Filter models based on search query
    useEffect(() => {
        if (searchQuery.length < 2) {
            setFilteredModels([])
            return
        }
        const query = searchQuery.toLowerCase()
        const results = allModels.filter(m =>
            m.name?.toLowerCase().includes(query) ||
            m.brand?.toLowerCase().includes(query) ||
            `${m.brand} ${m.name}`.toLowerCase().includes(query)
        ).slice(0, 8)
        setFilteredModels(results)
    }, [searchQuery, allModels])

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Load city from localStorage
    useEffect(() => {
        const savedCity = localStorage.getItem('selectedCity')
        if (savedCity) {
            const cityName = savedCity.split(',')[0]?.trim() || 'Mumbai'
            setSelectedCity(cityName)
        }

        const unsubscribe = subscribeToCityChange((newCity: string) => {
            const cityName = newCity.split(',')[0]?.trim() || 'Mumbai'
            setSelectedCity(cityName)
        })

        const handleStorageChange = () => {
            const saved = localStorage.getItem('selectedCity')
            if (saved) {
                const cityName = saved.split(',')[0]?.trim() || 'Mumbai'
                setSelectedCity(cityName)
            }
        }
        window.addEventListener('storage', handleStorageChange)

        return () => {
            unsubscribe()
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    const toggleSelection = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        if (arr.includes(value)) {
            setArr(arr.filter(v => v !== value))
        } else {
            setArr([...arr, value])
        }
    }

    const formatBudget = (value: number) => {
        if (value >= 100) return '₹1 Crore+'
        return `₹${value} Lakh`
    }

    const handleSelectCar = (model: CarModel) => {
        setSearchQuery(`${model.brand} ${model.name}`)
        setShowSuggestions(false)
    }

    const router = useRouter()

    const handleSearch = () => {
        // Feature temporarily disabled as requested
        console.log('Search clicked', { searchQuery, selectedCity, budgetMax })
        alert('Advanced search feature is coming soon!')
    }

    const handleNewSearch = () => {
        setShowResults(false)
        setCurrentPage(0)
        setSearchQuery('')
        setSelectedFuel([])
        setSelectedTransmission([])
        setSelectedOwners([])
        setBudgetMax(50)
        setCarAgeMax(10)
    }

    // Pagination handlers
    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const goToPrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1)
        }
    }

    // Generate filter summary for display
    const getFilterSummary = () => {
        const parts = []
        if (searchQuery) parts.push(searchQuery)
        if (budgetMax < 100) parts.push(`Up to ${formatBudget(budgetMax)}`)
        if (carAgeMax < 10) parts.push(`${carAgeMax} years old`)
        if (selectedFuel.length) parts.push(selectedFuel.join(', '))
        if (selectedTransmission.length) parts.push(selectedTransmission.join(', '))
        if (selectedOwners.length) parts.push(`${selectedOwners.join('/')} owner`)
        return parts.length > 0 ? parts.join(' • ') : 'All cars'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Find Used Cars in India
                    </h1>
                    <p className="text-gray-600">
                        Search for quality pre-owned cars in {selectedCity}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-6">

                {/* Search Input with Autocomplete */}
                <div className="mb-5" ref={searchRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Car
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="e.g. Honda City, Maruti Swift, Hyundai i20..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                        />

                        {/* Autocomplete Suggestions */}
                        {showSuggestions && filteredModels.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                                {filteredModels.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => handleSelectCar(model)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                                    >
                                        <Car className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">{model.brand} {model.name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* City Selection */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                    </label>
                    <Link
                        href="/location"
                        className="flex items-center justify-between px-3 py-3 bg-white border border-gray-300 rounded-lg hover:border-orange-400 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-orange-500" />
                            <span className="text-gray-900 font-medium">{selectedCity}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                </div>

                {/* Budget */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <IndianRupee className="h-4 w-4 text-orange-500" />
                            Budget
                        </label>
                        <span className="text-sm font-semibold text-orange-600">
                            Up to {formatBudget(budgetMax)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹1 Lakh</span>
                        <span>₹1 Crore+</span>
                    </div>
                </div>

                {/* Car Age */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            Car Age
                        </label>
                        <span className="text-sm font-semibold text-orange-600">
                            Up to {carAgeMax} years
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={carAgeMax}
                        onChange={(e) => setCarAgeMax(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 Year</span>
                        <span>10+ Years</span>
                    </div>
                </div>

                {/* Fuel Type */}
                <div className="mb-5">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Fuel className="h-4 w-4 text-orange-500" />
                        Fuel Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {fuelTypes.map(fuel => (
                            <button
                                key={fuel}
                                onClick={() => toggleSelection(selectedFuel, setSelectedFuel, fuel)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFuel.includes(fuel)
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-400'
                                    }`}
                            >
                                {fuel}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Transmission */}
                <div className="mb-5">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Car className="h-4 w-4 text-orange-500" />
                        Transmission
                    </label>
                    <div className="flex gap-2">
                        {transmissionTypes.map(trans => (
                            <button
                                key={trans}
                                onClick={() => toggleSelection(selectedTransmission, setSelectedTransmission, trans)}
                                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedTransmission.includes(trans)
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-400'
                                    }`}
                            >
                                {trans}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Owners */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Users className="h-4 w-4 text-orange-500" />
                        Previous Owners
                    </label>
                    <div className="flex gap-2">
                        {ownerOptions.map(owner => (
                            <button
                                key={owner}
                                onClick={() => toggleSelection(selectedOwners, setSelectedOwners, owner)}
                                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedOwners.includes(owner)
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-400'
                                    }`}
                            >
                                {owner}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors mb-10"
                >
                    <Search className="inline-block h-5 w-5 mr-2" />
                    Search Used Cars
                </button>

                {/* SEO Content Section */}
                <div>
                    {/* Guide Introduction */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">Complete Guide to Buying Used Cars in India</h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-left">
                            Buying a pre-owned car is a smart financial decision that can save you lakhs of rupees compared to purchasing a new vehicle.
                            With the right knowledge and proper inspection, you can find a reliable second-hand car that serves you well for years.
                            This comprehensive guide will help you navigate the used car market in India confidently.
                        </p>
                        <p className="text-gray-700 leading-relaxed text-left">
                            The Indian used car market has grown significantly, with over 4 million pre-owned cars sold annually.
                            Whether you're a first-time buyer or looking to upgrade, understanding the key factors that affect a car's value
                            and condition is essential for making an informed purchase.
                        </p>
                    </div>

                    {/* Why Buy Used */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-left">Why Buy a Used Car?</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <IndianRupee className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-900">Lower Cost</h4>
                                    <p className="text-sm text-gray-600">Save 30-50% compared to new car prices. Avoid the steep first-year depreciation.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-900">Lower Insurance</h4>
                                    <p className="text-sm text-gray-600">Insurance premiums are calculated on current value, reducing your annual costs.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Car className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-900">More Car for Your Budget</h4>
                                    <p className="text-sm text-gray-600">Get a higher segment car with better features within the same budget.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <FileCheck className="h-5 w-5 text-orange-600" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-900">Proven Reliability</h4>
                                    <p className="text-sm text-gray-600">A well-maintained used car has already proven its reliability on Indian roads.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inspection Checklist */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-left">Essential Inspection Checklist</h3>
                        <p className="text-gray-700 mb-4 text-left">
                            Before finalizing any used car purchase, ensure you thoroughly inspect these critical areas:
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 text-left"><span className="font-medium text-gray-900">Body & Paint:</span> Look for uneven gaps, mismatched paint, or signs of rust. These may indicate accident repairs.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 text-left"><span className="font-medium text-gray-900">Engine Condition:</span> Check for oil leaks, unusual sounds, and white smoke from exhaust. Request a cold start to observe starting behavior.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 text-left"><span className="font-medium text-gray-900">Odometer Reading:</span> Verify the kilometers driven match the wear on pedals, steering wheel, and seats. Cross-check with service records.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 text-left"><span className="font-medium text-gray-900">Documents:</span> Verify RC, insurance, PUC certificate, and ownership transfer history. Ensure there are no pending loans or challans.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 text-left"><span className="font-medium text-gray-900">Test Drive:</span> Drive at least 10-15 km covering city and highway conditions. Check brakes, steering response, and AC cooling.</p>
                            </div>
                        </div>
                    </div>

                    {/* Red Flags */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-left">Red Flags to Watch Out For</h3>
                        <div className="bg-red-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 text-left"><strong className="text-gray-900">Reluctance to test drive</strong> – A genuine seller will always allow thorough testing.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 text-left"><strong className="text-gray-900">Missing service history</strong> – No records may indicate poor maintenance or hidden issues.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 text-left"><strong className="text-gray-900">Price too good to be true</strong> – Unusually low prices often hide serious problems.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 text-left"><strong className="text-gray-900">Multiple owners in short time</strong> – Frequent ownership changes may signal recurring issues.</p>
                            </div>
                        </div>
                    </div>

                    {/* Best Used Cars to Buy */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-left">Best Used Cars to Buy in India (By Budget)</h3>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-left">Under ₹5 Lakh</h4>
                                <p className="text-gray-700 text-sm text-left">
                                    Maruti Swift, Hyundai i10/i20, Honda Jazz, and Maruti Wagon R are excellent choices.
                                    These cars offer low maintenance costs, good mileage, and easy availability of spare parts across India.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-left">₹5-10 Lakh</h4>
                                <p className="text-gray-700 text-sm text-left">
                                    Honda City, Hyundai Verna, Maruti Ciaz, and Hyundai Creta (older models) offer premium features at affordable prices.
                                    Look for diesel variants if you drive over 1,500 km/month.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-left">₹10-20 Lakh</h4>
                                <p className="text-gray-700 text-sm text-left">
                                    Toyota Fortuner, Mahindra XUV500, Skoda Octavia, and Honda CR-V become accessible.
                                    These offer genuine luxury and performance at significant discounts from new prices.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-left">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <details className="group border-b border-gray-200 pb-4">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-orange-600 text-left">
                                    <span>What should I check before buying a used car?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-3 text-sm leading-relaxed text-left">
                                    Check the service history to verify regular maintenance. Examine the body for accident damage or repaint.
                                    Inspect the engine for leaks and unusual noises. Verify all documents including RC, insurance, and PUC.
                                    Always take a thorough test drive covering different road conditions.
                                </p>
                            </details>

                            <details className="group border-b border-gray-200 pb-4">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-orange-600 text-left">
                                    <span>How do I determine the fair price of a used car?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-3 text-sm leading-relaxed text-left">
                                    Used car prices depend on age, kilometers driven, condition, service history, and variant.
                                    As a rule of thumb, cars depreciate 15-20% in the first year and about 10-15% each subsequent year.
                                    Well-maintained cars from popular brands hold their value better. Compare prices of similar cars in your city before negotiating.
                                </p>
                            </details>

                            <details className="group border-b border-gray-200 pb-4">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-orange-600 text-left">
                                    <span>Is it better to buy from a dealer or private seller?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-3 text-sm leading-relaxed text-left">
                                    Both have pros and cons. Dealers typically offer warranties, finance options, and handle paperwork, but charge a premium.
                                    Private sellers offer better prices but require more due diligence. For first-time buyers, certified pre-owned from reputed
                                    dealerships may be worth the extra cost for peace of mind.
                                </p>
                            </details>

                            <details className="group border-b border-gray-200 pb-4">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-orange-600 text-left">
                                    <span>What documents are needed for used car transfer?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-3 text-sm leading-relaxed text-left">
                                    You need the original RC (Registration Certificate), Form 28/29/30 for transfer, valid insurance papers,
                                    PUC certificate, NOC from the financer (if applicable), and ID proof of both buyer and seller.
                                    The transfer must be completed at the RTO within 14 days of purchase.
                                </p>
                            </details>

                            <details className="group border-b border-gray-200 pb-4">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-orange-600 text-left">
                                    <span>Can I get a loan for a used car?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-3 text-sm leading-relaxed text-left">
                                    Yes, most banks and NBFCs offer used car loans. The car should typically be less than 7-8 years old at the
                                    time of purchase. Interest rates for used car loans are 1-3% higher than new car loans.
                                    Loan tenure is usually shorter (3-5 years), and you may need to pay a higher down payment (15-25%).
                                </p>
                            </details>

                            <details className="group pb-4">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-orange-600 text-left">
                                    <span>How many kilometers is too much for a used car?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-3 text-sm leading-relaxed text-left">
                                    For petrol cars, 10,000-12,000 km per year is average. Diesel cars can comfortably handle higher usage.
                                    A 5-year-old car with 50,000-60,000 km is generally fine. More important than absolute numbers is how the
                                    car was maintained. Highway kilometers are gentler on the engine than city driving.
                                </p>
                            </details>
                        </div>
                    </div>

                </div>
            </div>

            {/* Feedback Section */}
            <FeedbackSection />

            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'Used Cars' }]} />

            {/* Footer */}
            <Footer />
        </div>
    )
}
