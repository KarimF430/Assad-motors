'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import VariantCard from './VariantCard'

interface AllVariantsClientProps {
  model: any
  brandSlug?: string
  modelSlug?: string
  initialVariants?: any[] // ✅ Server-rendered variants
}

export default function AllVariantsClient({
  model,
  brandSlug,
  modelSlug,
  initialVariants = [] // ✅ Server-rendered data
}: AllVariantsClientProps) {
  const router = useRouter()
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']) // Multi-select filters

  // ✅ Use server-rendered variants directly (no client-side fetch)
  const modelVariants = initialVariants

  // Transform backend variant data to match component structure (EXACT COPY FROM MODEL PAGE)
  const allVariants = modelVariants.map(variant => ({
    id: variant.id,
    name: variant.name,
    price: variant.price ? (variant.price / 100000) : 0, // Convert to lakhs
    fuel: (variant as any).fuel || variant.fuelType || "Petrol",
    transmission: (variant as any).transmission || "Manual",
    power: (variant as any).power || (variant as any).maxPower || variant.enginePower || "N/A", // Check power, maxPower, then enginePower
    features: variant.keyFeatures || variant.headerSummary || "Standard features included",
    isValueForMoney: variant.isValueForMoney || false
  })).sort((a, b) => a.price - b.price)

  // Helper function to check if transmission is automatic type (EXACT COPY FROM MODEL PAGE)
  const isAutomaticTransmission = (transmission: string) => {
    const automaticTypes = ['automatic', 'cvt', 'amt', 'dct', 'torque converter', 'dual clutch']
    return automaticTypes.some(type => transmission.toLowerCase().includes(type))
  }

  // Generate dynamic filters based on available variants
  const getDynamicFilters = () => {
    const filters = ['All']
    const fuelTypes = new Set<string>()
    const transmissionTypes = new Set<string>()
    let hasValueVariants = false

    allVariants.forEach(variant => {
      if (variant.fuel) fuelTypes.add(variant.fuel)
      if (variant.transmission) {
        if (isAutomaticTransmission(variant.transmission)) {
          transmissionTypes.add('Automatic')
        } else {
          transmissionTypes.add('Manual')
        }
      }
      if (variant.isValueForMoney === true) {
        hasValueVariants = true
      }
    })

    fuelTypes.forEach(fuel => filters.push(fuel))
    transmissionTypes.forEach(trans => filters.push(trans))
    if (hasValueVariants) filters.push('Value for Money')

    return filters
  }

  const availableFilters = useMemo(() => getDynamicFilters(), [allVariants])

  // Handle filter toggle (multi-select)
  const handleFilterToggle = (filter: string) => {
    if (filter === 'All') {
      setSelectedFilters(['All'])
    } else {
      setSelectedFilters(prev => {
        // Remove 'All' if selecting a specific filter
        const withoutAll = prev.filter(f => f !== 'All')

        // Toggle the clicked filter
        if (withoutAll.includes(filter)) {
          const newFilters = withoutAll.filter(f => f !== filter)
          // If no filters left, select 'All'
          return newFilters.length === 0 ? ['All'] : newFilters
        } else {
          return [...withoutAll, filter]
        }
      })
    }
  }

  // Filter variants based on selected filters (multi-select logic) - Memoized for performance
  const filteredVariants = useMemo(() => {
    if (selectedFilters.includes('All')) {
      return allVariants
    }

    return allVariants.filter(variant => {
      const fuelFilters = selectedFilters.filter(f => ['Petrol', 'Diesel', 'CNG', 'Electric'].includes(f))
      const transmissionFilters = selectedFilters.filter(f => ['Manual', 'Automatic'].includes(f))
      const specialFilters = selectedFilters.filter(f => f === 'Value for Money')

      let matchesFuel = fuelFilters.length === 0 || fuelFilters.includes(variant.fuel)
      let matchesTransmission = transmissionFilters.length === 0

      if (transmissionFilters.length > 0) {
        if (transmissionFilters.includes('Automatic')) {
          matchesTransmission = matchesTransmission || isAutomaticTransmission(variant.transmission)
        }
        if (transmissionFilters.includes('Manual')) {
          matchesTransmission = matchesTransmission || !isAutomaticTransmission(variant.transmission)
        }
      }

      let matchesSpecial = specialFilters.length === 0 || (specialFilters.includes('Value for Money') && variant.isValueForMoney)

      return matchesFuel && matchesTransmission && matchesSpecial
    })
  }, [allVariants, selectedFilters])


  const handleVariantClick = (variant: any) => {
    // Use provided slugs first, fallback to constructing from model data
    const finalBrandSlug = brandSlug || (model?.brandName?.toLowerCase().replace(/\s+/g, '-') + '-cars')
    const finalModelSlug = modelSlug || model?.name?.toLowerCase().replace(/\s+/g, '-')
    const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-')
    const variantUrl = `/${finalBrandSlug}/${finalModelSlug}/${variantSlug}`
    console.log('Navigating to variant page:', variantUrl)
    router.push(variantUrl)
  }

  const handleBackClick = () => {
    // Use provided slugs first, fallback to constructing from model data
    const finalBrandSlug = brandSlug || (model?.brandName?.toLowerCase().replace(/\s+/g, '-') + '-cars')
    const finalModelSlug = modelSlug || model?.name?.toLowerCase().replace(/\s+/g, '-')

    if (finalBrandSlug && finalModelSlug) {
      router.push(`/${finalBrandSlug}/${finalModelSlug}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Variants</h1>
        </div>
      </div>

      {/* EXACT COPY OF VARIANTS SECTION FROM MODEL PAGE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filter Buttons - Dynamic */}
          <div className="flex flex-wrap gap-3 mb-6">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterToggle(filter)}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedFilters.includes(filter)
                  ? 'bg-[#291e6a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Variant Cards - Dynamic (Show ALL variants) */}
          <div className="space-y-4">
            {filteredVariants.length > 0 ? (
              filteredVariants.map((variant) => (
                <VariantCard
                  key={variant.id}
                  variant={variant}
                  onClick={() => handleVariantClick(variant)}
                  onGetPrice={(e) => {
                    e.stopPropagation()
                    handleVariantClick(variant)
                  }}
                  onCompare={(e) => e.stopPropagation()}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No variants found for the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
