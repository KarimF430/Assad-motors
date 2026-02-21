'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
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
    bodyType?: string
    rating?: number
    reviews?: number
    variants?: number
}

interface PopularCarsClientProps {
    initialCars: Car[]
    dynamicDescription: string
}

const fuelFilters = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
const transmissionFilters = ['Manual', 'Automatic']



export default function PopularCarsClient({
    initialCars,
    dynamicDescription
}: PopularCarsClientProps) {
    const [selectedFuel, setSelectedFuel] = useState<string[]>([])
    const [selectedTransmission, setSelectedTransmission] = useState<string[]>([])
    const [isExpanded, setIsExpanded] = useState(false)

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Parse description
    let shortText = "Discover India's most loved cars! Explore our curated collection of popular models."
    let extendedText = ''
    try {
        const parsed = JSON.parse(dynamicDescription)
        shortText = parsed.short || shortText
        extendedText = parsed.extended || ''
    } catch {
        // Plain text fallback
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Popular Cars in India
                </h1>
                <div className="text-gray-600 mb-6">
                    <p className={isExpanded ? '' : 'line-clamp-2'}>
                        {shortText}
                        {isExpanded && extendedText}
                    </p>
                    {extendedText && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-red-600 font-medium hover:text-red-700 transition-colors"
                        >
                            {isExpanded ? '...show less' : '...read more'}
                        </button>
                    )}
                </div>

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

            {filteredCars.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No popular cars found matching your filters.</p>
                </div>
            ) : (
                <CarGrid>
                    {filteredCars.map((car) => (
                        <HorizontalCarCard key={car.id} car={car} />
                    ))}
                </CarGrid>
            )}
        </>
    )
}
