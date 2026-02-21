'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, ArrowLeft, X, Navigation, Loader2, ChevronRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { searchCities, type City } from '@/lib/cities-data'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '@/hooks/useDebounce'

interface LocationSelectorProps {
    popularCities: City[]
}

export default function LocationSelector({ popularCities }: LocationSelectorProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<City[]>([])
    const [selectedCity, setSelectedCity] = useState<string | null>(null)
    const [isDetectingLocation, setIsDetectingLocation] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    // Reduced debounce for "instant" feel
    const debouncedSearchQuery = useDebounce(searchQuery, 150)

    // Load saved city from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('selectedCity')
        if (saved) {
            setSelectedCity(saved)
        }
    }, [])

    // Search functionality
    useEffect(() => {
        if (debouncedSearchQuery.trim() === '') {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        // Local search is near-instant, but we simulate a tiny delay for "feel"
        const results = searchCities(debouncedSearchQuery)
        setSearchResults(results)
        setIsSearching(false)
    }, [debouncedSearchQuery])

    const handleCitySelect = (city: City) => {
        const cityName = `${city.name}, ${city.state}`
        setSelectedCity(cityName)
        localStorage.setItem('selectedCity', cityName)
        window.dispatchEvent(new Event('storage'))
        // Short delay to let user see selection before navigating back
        setTimeout(() => router.back(), 200)
    }

    const handleDetectLocation = async () => {
        setIsDetectingLocation(true)
        // Simulate detection delay since Google Maps is disabled
        setTimeout(() => {
            alert('Location detection is currently disabled. Please select a city manually.')
            setIsDetectingLocation(false)
        }, 800)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04
            }
        },
        exit: { opacity: 0 }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98 }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Minimalist sticky Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="flex items-center px-4 h-14 gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-1 -ml-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>

                    <div className="flex-1 flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-red-500" />
                        </div>
                        <h1 className="text-lg font-bold text-gray-900">Select location</h1>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="p-1 -mr-1 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Integrated Search Bar in Header */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                        <input
                            type="text"
                            placeholder="Search for city or area..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:border-red-500 focus:bg-white text-base text-gray-900 placeholder-gray-400 transition-all duration-200"
                            autoFocus
                        />
                        <AnimatePresence>
                            {searchQuery && (
                                <motion.button
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-red-600"
                                >
                                    Clear
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white overflow-x-hidden">
                <AnimatePresence mode="wait">
                    {searchQuery.trim() === '' ? (
                        <motion.div
                            key="initial-view"
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            variants={containerVariants}
                            className="px-4 py-4 space-y-6"
                        >
                            {/* Current Location Button */}
                            <motion.button
                                variants={itemVariants}
                                onClick={handleDetectLocation}
                                disabled={isDetectingLocation}
                                className="w-full flex items-center gap-4 p-4 bg-green-50/50 border border-green-100 rounded-xl hover:bg-green-100 transition-all group"
                            >
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm shadow-green-200">
                                    {isDetectingLocation ? (
                                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                                    ) : (
                                        <Navigation className="h-5 w-5 text-white" />
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-bold text-gray-900 text-sm">Use current location</div>
                                    <div className="text-xs text-green-600 font-medium tracking-tight">Detect via GPS</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-green-300 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            {/* Popular Cities */}
                            <section>
                                <h2 className="text-[12px] font-bold text-gray-400 mb-4 ml-1">Popular cities</h2>
                                <div className="grid grid-cols-1 gap-2">
                                    {popularCities.map((city, idx) => (
                                        <motion.button
                                            key={`city-${city.name}-${idx}`}
                                            variants={itemVariants}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleCitySelect(city)}
                                            className="group flex items-center gap-4 p-3 bg-white border border-gray-50 rounded-xl hover:border-orange-200 hover:bg-orange-50/30 transition-all text-left"
                                        >
                                            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                                                <MapPin className="h-5 w-5 text-orange-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-800 text-base group-hover:text-red-500 transition-colors">{city.name}</div>
                                                <div className="text-xs text-gray-400 font-medium">{city.state}</div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
                                        </motion.button>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="search-view"
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            variants={containerVariants}
                            className="px-4 py-4"
                        >
                            {isSearching ? (
                                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                    <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
                                    <p className="text-gray-400 text-sm font-medium">Searching cities...</p>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="h-8 w-8 text-red-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">No cities found</h3>
                                    <p className="text-gray-500 text-sm px-10">We couldn't find any results for "{searchQuery}".</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-[12px] font-bold text-gray-400 mb-4 ml-1">
                                        Found {searchResults.length} results
                                    </div>
                                    <div className="space-y-2">
                                        {searchResults.map((city, idx) => (
                                            <motion.button
                                                key={`search-city-${city.name}-${idx}`}
                                                variants={itemVariants}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleCitySelect(city)}
                                                className="group flex items-center gap-4 p-3 bg-white border border-gray-50 rounded-xl hover:border-red-200 hover:bg-red-50/30 transition-all text-left w-full"
                                            >
                                                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                                                    <MapPin className="h-5 w-5 text-red-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-800 text-base group-hover:text-red-500 transition-colors">{city.name}</div>
                                                    <div className="text-xs text-gray-400 font-medium">{city.state}</div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500" />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
