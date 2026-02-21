'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ArrowLeft, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { motion, AnimatePresence } from 'framer-motion'

interface CarModel {
    id: string
    name: string
    brandName: string
    brandSlug: string
    modelSlug: string
    slug: string
    heroImage: string
}

interface SearchResponse {
    results: CarModel[]
    count: number
    took: number
    query: string
    matchType?: string
}

interface SearchClientProps {
    trendingSearches: { term: string, url: string }[]
    initialQuery?: string
}

const RECENT_SEARCHES_KEY = 'gz_recent_searches'

export default function SearchClient({ trendingSearches, initialQuery = '' }: SearchClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [searchResults, setSearchResults] = useState<CarModel[]>([])
    const [loading, setLoading] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const abortControllerRef = useRef<AbortController | null>(null)

    // Reduced debounce for "instant" feel
    const debouncedSearchQuery = useDebounce(searchQuery, 150)

    // Load recent searches from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    setRecentSearches(parsed)
                }
            } catch (e) {
                console.error('Failed to parse recent searches', e)
            }
        }
    }, [])

    // Update search query from URL params
    useEffect(() => {
        const query = searchParams.get('q')
        if (query && query !== searchQuery) {
            setSearchQuery(query)
        }
    }, [searchParams])

    // Search functionality
    useEffect(() => {
        const performSearch = async (query: string) => {
            if (abortControllerRef.current) abortControllerRef.current.abort()

            if (query.trim() === '' || query.length < 2) {
                setSearchResults([])
                return
            }

            try {
                setLoading(true)
                abortControllerRef.current = new AbortController()

                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
                const response = await fetch(
                    `${backendUrl}/api/search?q=${encodeURIComponent(query)}&limit=15`,
                    { signal: abortControllerRef.current.signal }
                )

                if (!response.ok) throw new Error('Search failed')

                const data: SearchResponse = await response.json()
                setSearchResults(data.results)
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Error searching:', error)
                    setSearchResults([])
                }
            } finally {
                setLoading(false)
            }
        }

        if (debouncedSearchQuery) {
            performSearch(debouncedSearchQuery)
        } else {
            setSearchResults([])
        }

        return () => abortControllerRef.current?.abort()
    }, [debouncedSearchQuery])

    const handleItemClick = (term: string) => {
        setSearchQuery(term)
        // Also save to recent when clicking from trending
        addToRecent(term)
    }

    const addToRecent = (term: string) => {
        if (!term.trim()) return

        // Get latest from state to avoid stale closure issues
        setRecentSearches(prev => {
            const newRecent = [term, ...prev.filter(s => s !== term)].slice(0, 5)
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecent))
            return newRecent
        })
    }

    const highlightText = (text: string, query: string) => {
        if (!query) return text
        const parts = text.split(new RegExp(`(${query})`, 'gi'))
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase()
                        ? <span key={i} className="font-bold text-gray-900">{part}</span>
                        : <span key={i} className="text-gray-600">{part}</span>
                )}
            </span>
        )
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        },
        exit: { opacity: 0 }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95 }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* sticky Search Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="flex items-center px-4 h-14 gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-1 -ml-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search cars (e.g. Swift, City, SUV)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2 bg-transparent text-lg focus:outline-none placeholder-gray-400"
                            autoFocus
                        />
                        <AnimatePresence>
                            {searchQuery && (
                                <motion.button
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-semibold text-red-600"
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
                    {/* 1. Initial State: Recent and Trending */}
                    {(!searchQuery || searchQuery.length < 2) && (
                        <motion.div
                            key="initial"
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            variants={containerVariants}
                            className="px-4 py-4 space-y-8"
                        >
                            {/* Recently viewed - Hidden if empty */}
                            {recentSearches.length > 0 && (
                                <section>
                                    <h3 className="text-[12px] font-bold text-gray-400 mb-4">Recently viewed</h3>
                                    <div className="space-y-4">
                                        {recentSearches.map((term, idx) => (
                                            <motion.button
                                                key={`recent-${term}-${idx}`}
                                                variants={itemVariants}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleItemClick(term)}
                                                className="flex items-center gap-4 w-full text-left group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-red-500" />
                                                </div>
                                                <span className="text-base text-gray-700 font-medium group-hover:text-red-600 transition-colors">{term}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Trending searches */}
                            <section>
                                <h3 className="text-[12px] font-bold text-gray-400 mb-4">Trending searches</h3>
                                <div className="space-y-4">
                                    {trendingSearches.map((item, idx) => (
                                        <Link
                                            key={`trending-${item.term}-${idx}`}
                                            href={item.url}
                                            className="block"
                                        >
                                            <motion.div
                                                variants={itemVariants}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex items-center gap-4 w-full text-left group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                                                    <TrendingUp className="w-4 h-4 text-orange-500" />
                                                </div>
                                                <span className="text-base text-gray-700 font-medium group-hover:text-orange-600 transition-colors">{item.term}</span>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {/* 2. Loading State */}
                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="divide-y divide-gray-50"
                        >
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="px-4 py-4 flex items-center gap-4 animate-pulse">
                                    <div className="w-8 h-8 bg-gray-50 rounded-full"></div>
                                    <div className="h-5 bg-gray-50 rounded w-2/3"></div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* 3. Search Results */}
                    {!loading && searchQuery.length >= 2 && searchResults.length > 0 && (
                        <motion.div
                            key="results"
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            variants={containerVariants}
                            className="divide-y divide-gray-50"
                        >
                            {searchResults.map((car) => (
                                <motion.div key={car.id} variants={itemVariants}>
                                    <Link
                                        href={`/${car.brandSlug}-cars/${car.modelSlug}`}
                                        onClick={() => addToRecent(`${car.brandName} ${car.name}`)}
                                        className="px-4 py-4 flex items-center gap-4 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                            <Search className="w-4 h-4 text-red-500 opacity-50" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-base text-gray-700 truncate">
                                                {highlightText(`${car.brandName} ${car.name}`, searchQuery)}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transform group-hover:translate-x-1 transition-all" />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* 4. No Results State */}
                    {!loading && searchQuery.length >= 2 && searchResults.length === 0 && (
                        <motion.div
                            key="no-results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-20 text-center"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No results for "{searchQuery}"</h3>
                            <p className="text-gray-500 text-sm px-10">We couldn't find any cars matching your search. Try checking for typos or use fewer keywords.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
