'use client'

import { useState, useEffect } from 'react'

import CarCard from '@/components/home/CarCard'
import CarGrid from '@/components/common/CarGrid'
import HorizontalCarCard from '@/components/common/HorizontalCarCard'

interface Car {
    id: string
    name: string
    brand: string
    brandName: string
    image: string
    startingPrice: number
    lowestPriceFuelType?: string
    fuelTypes: string[]
    transmissions: string[]
    seating: number
    launchDate: string
    slug: string
    isNew: boolean
    isPopular: boolean
    rating?: number
    reviews?: number
    variants?: number
}

interface BudgetCarsClientProps {
    initialCars: Car[]
    popularCars: Car[]
    newLaunchedCars: Car[]
    budgetLabel: string
    budgetDescription: string
}

const fuelFilters = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
const transmissionFilters = ['Manual', 'Automatic']

export default function BudgetCarsClient({
    initialCars,
    popularCars,
    newLaunchedCars,
    budgetLabel,
    budgetDescription
}: BudgetCarsClientProps) {
    const [selectedFuel, setSelectedFuel] = useState<string[]>([])
    const [selectedTransmission, setSelectedTransmission] = useState<string[]>([])
    const [isExpanded, setIsExpanded] = useState(false)

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Parse description - supports both JSON format and plain text
    let shortText = budgetDescription
    let extendedText = ''
    try {
        const parsed = JSON.parse(budgetDescription)
        shortText = parsed.short || budgetDescription
        extendedText = parsed.extended || ''
    } catch {
        // Plain text fallback - no extended text
    }

    // Apply filters
    const filteredCars = initialCars.filter(car => {
        if (selectedFuel.length > 0) {
            const hasFuel = selectedFuel.some(fuel =>
                car.fuelTypes.some(f => f.toLowerCase() === fuel.toLowerCase())
            )
            if (!hasFuel) return false
        }

        if (selectedTransmission.length > 0) {
            const hasTransmission = selectedTransmission.some(trans =>
                car.transmissions.some(t => t.toLowerCase().includes(trans.toLowerCase()))
            )
            if (!hasTransmission) return false
        }

        return true
    })

    const toggleFilter = (type: 'fuel' | 'transmission', value: string) => {
        if (type === 'fuel') {
            setSelectedFuel(prev =>
                prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
            )
        } else {
            setSelectedTransmission(prev =>
                prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
            )
        }
    }

    return (
        <>
            {/* Header & Filters */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {budgetLabel.includes('Best Cars') ? `${budgetLabel} in India ${new Date().getFullYear()}` : `Best ${budgetLabel} Cars in India ${new Date().getFullYear()}`}
                </h1>
                <div className="text-gray-600 mb-6">
                    <p className={isExpanded ? 'mb-4' : 'line-clamp-2'}>{shortText}</p>
                    {isExpanded && (
                        <div
                            className="mt-4 animate-fadeIn"
                            dangerouslySetInnerHTML={{ __html: extendedText }}
                        />
                    )}
                    {extendedText && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-red-600 font-medium hover:text-red-700 transition-colors mt-2"
                        >
                            {isExpanded ? '...show less' : '...read more'}
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-200">
                    {fuelFilters.map(fuel => (
                        <button
                            key={fuel}
                            onClick={() => toggleFilter('fuel', fuel)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFuel.includes(fuel)
                                ? 'bg-[#291e6a] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {fuel}
                        </button>
                    ))}
                    {transmissionFilters.map(trans => (
                        <button
                            key={trans}
                            onClick={() => toggleFilter('transmission', trans)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTransmission.includes(trans)
                                ? 'bg-[#291e6a] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {trans}
                        </button>
                    ))}
                </div>
            </div>





            {/* Cars List */}
            {filteredCars.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No cars found matching your filters.</p>
                </div>
            ) : (
                <CarGrid>
                    {filteredCars.map((car) => (
                        <HorizontalCarCard key={car.id} car={car} />
                    ))}
                </CarGrid>
            )}

            {/* Popular Cars */}
            {popularCars.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Popular Cars in India {new Date().getFullYear()}</h2>
                    <div className="relative group">
                        {/* Left Scroll Arrow */}
                        <button
                            onClick={() => {
                                const container = document.getElementById('budget-popular-scroll')
                                container?.scrollBy({ left: -300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                            aria-label="Scroll left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                const container = document.getElementById('budget-popular-scroll')
                                container?.scrollBy({ left: 300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                            aria-label="Scroll right"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div id="budget-popular-scroll" className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {popularCars.map((car) => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    onClick={() => {
                                        const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                                        const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                                        window.location.href = `/${brandSlug}-cars/${modelSlug}`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* New Launches */}
            {newLaunchedCars.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Newly Launched Cars in India {new Date().getFullYear()}</h2>
                    <div className="relative group">
                        {/* Left Scroll Arrow */}
                        <button
                            onClick={() => {
                                const container = document.getElementById('budget-new-scroll')
                                container?.scrollBy({ left: -300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                            aria-label="Scroll left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                const container = document.getElementById('budget-new-scroll')
                                container?.scrollBy({ left: 300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                            aria-label="Scroll right"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div id="budget-new-scroll" className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {newLaunchedCars.map((car) => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    onClick={() => {
                                        const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                                        const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                                        window.location.href = `/${brandSlug}-cars/${modelSlug}`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
