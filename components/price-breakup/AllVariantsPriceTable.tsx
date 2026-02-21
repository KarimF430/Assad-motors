'use client'

import React, { useState, useMemo } from 'react'

interface Variant {
    id: string
    name: string
    price: number
    fuel: string
    transmission: string
}

interface AllVariantsPriceTableProps {
    variants: Variant[]
    brandName: string
    modelName: string
    cityName: string
    stateName: string
    onVariantSelect?: (variant: Variant) => void
}

// Helper function to format price in Indian numbering system
const formatIndianPrice = (price: number): string => {
    return price.toLocaleString('en-IN', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    })
}

export default function AllVariantsPriceTable({
    variants,
    brandName,
    modelName,
    cityName,
    stateName,
    onVariantSelect
}: AllVariantsPriceTableProps) {
    const [selectedFilter, setSelectedFilter] = useState<string>('All')

    // Get unique fuel types for filter pills
    const fuelTypes = useMemo(() => {
        const types = new Set<string>(['All'])
        variants.forEach(v => {
            if (v.fuel) types.add(v.fuel)
        })
        return Array.from(types)
    }, [variants])

    // Filter variants based on selected fuel type
    const filteredVariants = useMemo(() => {
        if (selectedFilter === 'All') return variants
        return variants.filter(v => v.fuel === selectedFilter)
    }, [variants, selectedFilter])

    // Calculate on-road prices for all variants
    const variantsWithPrices = useMemo(() => {
        return filteredVariants.map(variant => {
            const breakup = { rtoCharges: 0, insurance: 0, otherCharges: 0, roadSafetyTax: 0, totalOnRoadPrice: variant.price }
            return {
                ...variant,
                exShowroom: variant.price,
                rto: breakup.rtoCharges,
                insurance: breakup.insurance,
                otherCharges: breakup.otherCharges + breakup.roadSafetyTax,
                onRoadPrice: breakup.totalOnRoadPrice
            }
        })
    }, [filteredVariants, stateName])

    if (!variants || variants.length === 0) return null

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-[#291e6a] px-4 sm:px-6 py-4">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                    {brandName} {modelName} Price List in {cityName}
                </h3>
                <p className="text-sm text-white/80 mt-1">
                    On-road prices of all {variants.length} variants
                </p>
            </div>

            {/* Filter Pills */}
            {fuelTypes.length > 2 && (
                <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                        {fuelTypes.map((fuel) => (
                            <button
                                key={fuel}
                                onClick={() => setSelectedFilter(fuel)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedFilter === fuel
                                    ? 'bg-[#291e6a] text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {fuel}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Table - Responsive with horizontal scroll on mobile */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Variant
                            </th>
                            <th className="text-right px-3 py-3 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Ex-Showroom
                            </th>
                            <th className="text-right px-3 py-3 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                RTO
                            </th>
                            <th className="text-right px-3 py-3 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Insurance
                            </th>
                            <th className="text-right px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide">
                                On-Road Price
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {variantsWithPrices.map((variant, index) => (
                            <tr
                                key={variant.id}
                                className={`hover:bg-gray-50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                    }`}
                                onClick={() => onVariantSelect?.(variant)}
                            >
                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                                        {variant.name}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                        {variant.fuel} • {variant.transmission}
                                    </div>
                                </td>
                                <td className="text-right px-3 py-3 sm:py-4 text-sm text-gray-700 whitespace-nowrap">
                                    ₹{(variant.exShowroom / 100000).toFixed(2)}L
                                </td>
                                <td className="text-right px-3 py-3 sm:py-4 text-sm text-gray-700 whitespace-nowrap">
                                    ₹{formatIndianPrice(variant.rto)}
                                </td>
                                <td className="text-right px-3 py-3 sm:py-4 text-sm text-gray-700 whitespace-nowrap">
                                    ₹{formatIndianPrice(variant.insurance)}
                                </td>
                                <td className="text-right px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                    <span className="font-bold text-green-600 text-sm sm:text-base">
                                        ₹{(variant.onRoadPrice / 100000).toFixed(2)}L
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Note */}
            <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    * Prices are indicative and may vary. On-road price includes RTO, insurance & other charges for {cityName}.
                </p>
            </div>
        </div>
    )
}
