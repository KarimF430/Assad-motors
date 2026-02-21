'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ComparisonData {
  id: string
  model1: {
    id: string
    name: string
    brand: string
    heroImage: string
    startingPrice: number
    fuelTypes: string[]
  }
  model2: {
    id: string
    name: string
    brand: string
    heroImage: string
    startingPrice: number
    fuelTypes: string[]
  }
}

export default function PopularComparisons() {
  const [comparisons, setComparisons] = useState<ComparisonData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  // Helper function to calculate on-road price
  const getOnRoadPrice = (exShowroomPrice: number, fuelType: string): number => {
    const selectedCity = typeof window !== 'undefined'
      ? localStorage.getItem('selectedCity') || 'Mumbai, Maharashtra'
      : 'Mumbai, Maharashtra'

    const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'
    const breakup = calculateOnRoadPrice(exShowroomPrice, state, fuelType)
    return breakup.totalOnRoadPrice
  }

  useEffect(() => {
    fetchComparisons()
  }, [])

  const fetchComparisons = async () => {
    try {
      setLoading(true)

      // Fetch popular comparisons
      const comparisonsRes = await fetch(`${backendUrl}/api/popular-comparisons`)
      if (!comparisonsRes.ok) {
        setComparisons([])
        return
      }

      const comparisonsData = await comparisonsRes.json()

      // Fetch models with pricing and brands (optimized)
      // Use a large limit to get all models for comparisons
      const modelsRes = await fetch(`${backendUrl}/api/models-with-pricing?limit=100`)
      const modelsResponse = await modelsRes.json()

      // Extract data from pagination response
      const models = modelsResponse.data || modelsResponse

      const brandsRes = await fetch(`${backendUrl}/api/brands`)
      const brands = await brandsRes.json()

      // Create brand map
      const brandMap: Record<string, string> = {}
      brands.forEach((brand: any) => {
        brandMap[brand.id] = brand.name
      })

      // Process comparisons with full model data
      const processedComparisons = comparisonsData
        .filter((comp: any) => comp.model1Id && comp.model2Id)
        .map((comp: any) => {
          const model1 = models.find((m: any) => m.id === comp.model1Id)
          const model2 = models.find((m: any) => m.id === comp.model2Id)

          if (!model1 || !model2) return null

          return {
            id: comp.id,
            model1: {
              id: model1.id,
              name: model1.name,
              brand: brandMap[model1.brandId] || 'Unknown',
              heroImage: model1.heroImage || '',
              startingPrice: model1.lowestPrice || 0,
              fuelTypes: model1.fuelTypes || ['Petrol']
            },
            model2: {
              id: model2.id,
              name: model2.name,
              brand: brandMap[model2.brandId] || 'Unknown',
              heroImage: model2.heroImage || '',
              startingPrice: model2.lowestPrice || 0,
              fuelTypes: model2.fuelTypes || ['Petrol']
            }
          }
        })
        .filter(Boolean)

      setComparisons(processedComparisons)

      // Debug: Log first comparison image URLs
      if (processedComparisons.length > 0) {
        console.log('🔍 PopularComparisons - First comparison images:', {
          model1: processedComparisons[0].model1.heroImage,
          model2: processedComparisons[0].model2.heroImage,
          backendUrl
        })
      }
    } catch (error) {
      console.error('Error fetching comparisons:', error)
      setComparisons([])
    } finally {
      setLoading(false)
    }
  }

  const handleCompareClick = (model1: any, model2: any) => {
    const slug1 = `${model1.brand.toLowerCase().replace(/\s+/g, '-')}-${model1.name.toLowerCase().replace(/\s+/g, '-')}`
    const slug2 = `${model2.brand.toLowerCase().replace(/\s+/g, '-')}-${model2.name.toLowerCase().replace(/\s+/g, '-')}`
    router.push(`/compare/${slug1}-vs-${slug2}`)
  }

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Popular Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (comparisons.length === 0) {
    return null // Don't show section if no comparisons
  }

  return (
    <div>
      {/* Section Header */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Comparison</h2>

      {/* Comparison Cards - Horizontal Scroll */}
      {/* Comparison Cards Horizontal Scroll */}
      <div className="relative">
        <div
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {comparisons.map((comparison) => {
            const model1OnRoad = getOnRoadPrice(
              comparison.model1.startingPrice,
              comparison.model1.fuelTypes[0] || 'Petrol'
            )
            const model2OnRoad = getOnRoadPrice(
              comparison.model2.startingPrice,
              comparison.model2.fuelTypes[0] || 'Petrol'
            )

            return (
              <div
                key={comparison.id}
                className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-300"
              >
                {/* Side by Side Layout with VS Badge */}
                <div className="flex items-start gap-2 mb-3">
                  {/* Model 1 */}
                  <div className="flex-1">
                    <div className="relative mb-2">
                      <img
                        src={comparison.model1.heroImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"}
                        alt={`${comparison.model1.brand} ${comparison.model1.name}`}
                        className="w-full h-20 object-contain"
                        onError={(e) => {
                          if (e.currentTarget.src !== "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E") {
                            console.error('❌ Failed to load image:', comparison.model1.heroImage)
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                          }
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-500">{comparison.model1.brand}</div>
                      <div className="font-bold text-sm text-gray-900 mb-1">{comparison.model1.name}</div>
                      <div className="text-red-600 font-bold text-sm">
                        ₹ {(model1OnRoad / 100000).toFixed(2)} Lakh
                      </div>
                      <div className="text-xs text-gray-500">Price</div>
                    </div>
                  </div>

                  {/* VS Badge - Positioned between cards */}
                  <div className="flex items-center justify-center" style={{ marginTop: '30px' }}>
                    <div className="w-8 h-8 rounded-full bg-[#291e6a] flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">VS</span>
                    </div>
                  </div>

                  {/* Model 2 */}
                  <div className="flex-1">
                    <div className="relative mb-2">
                      <img
                        src={comparison.model2.heroImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"}
                        alt={`${comparison.model2.brand} ${comparison.model2.name}`}
                        className="w-full h-20 object-contain"
                        onError={(e) => {
                          if (e.currentTarget.src !== "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E") {
                            console.error('❌ Failed to load image:', comparison.model2.heroImage)
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                          }
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-500">{comparison.model2.brand}</div>
                      <div className="font-bold text-sm text-gray-900 mb-1">{comparison.model2.name}</div>
                      <div className="text-red-600 font-bold text-sm">
                        ₹ {(model2OnRoad / 100000).toFixed(2)} Lakh
                      </div>
                      <div className="text-xs text-gray-500">Price</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCompareClick(comparison.model1, comparison.model2)}
                  className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-sm"
                >
                  Compare Now
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Compare Cars of Your Choice Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => router.push('/compare')}
          className="w-full max-w-md bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 py-3 rounded-lg transition-all duration-200 font-medium"
        >
          Compare Cars of Your Choice
        </button>
      </div>
    </div>
  )
}
