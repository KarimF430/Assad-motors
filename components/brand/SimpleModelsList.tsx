'use client'

import { useEffect, useState } from 'react'
import { OptimizedImage } from '@/components/common/OptimizedImage'

interface Model {
  id: string
  name: string
  price: string
  rating: number
  reviews: number
  power: string
  image: string
  isNew: boolean
  seating: string
  fuelType: string
  transmission: string
  mileage: string
  variants: number
  slug: string
  brandName: string
}

interface SimpleModelsListProps {
  brand: string
}

export default function SimpleModelsList({ brand }: SimpleModelsListProps) {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchModels() {
      try {
        setLoading(true)
        setError(null)

        console.log('🔍 Fetching models for brand:', brand)

        // First get the brand ID from the slug
        const brandsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/brands`)
        if (!brandsResponse.ok) {
          throw new Error(`Failed to fetch brands: ${brandsResponse.status}`)
        }

        const brands = await brandsResponse.json()
        const foundBrand = brands.find((b: any) => {
          const normalizedBrandName = b.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          const normalizedSlug = brand.toLowerCase()

          return normalizedBrandName === normalizedSlug || b.name.toLowerCase() === normalizedSlug
        })

        if (!foundBrand) {
          setError('Brand not found')
          return
        }

        // Then get the models for that brand
        const modelsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/frontend/brands/${foundBrand.id}/models`)
        if (!modelsResponse.ok) {
          throw new Error(`Failed to fetch models: ${modelsResponse.status}`)
        }

        const data = await modelsResponse.json()
        setModels(data.models || [])

        console.log('✅ Loaded', data.models?.length || 0, 'models for', foundBrand.name)
      } catch (err) {
        console.error('❌ Error loading models:', err)
        setError('Failed to load models')
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [brand])

  if (loading) {
    return (
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading models...</div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col justify-center items-center py-12 space-y-4">
            <div className="text-red-500 text-xl font-bold">Error: {error}</div>
            <div className="text-gray-600 text-sm">
              <p>Brand slug: {brand}</p>
              <p>Trying to fetch from: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/brands</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (models.length === 0) {
    return (
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">No models found for {brand}</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Simple Model Cards - Exactly like the second image */}
        <div className="space-y-4">
          {models.map((model) => (
            <div key={model.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center">
                {/* Car Image */}
                <div className="relative w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-600 flex-shrink-0">
                  {model.image && (
                    <OptimizedImage
                      src={model.image}
                      alt={model.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  {model.isNew && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      NEW
                    </div>
                  )}
                </div>

                {/* Car Details */}
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {/* Brand + Model Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {model.brandName} {model.name}
                      </h3>

                      {/* Rating and Reviews */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          {model.rating}/5
                        </span>
                        <span>{model.reviews} Ratings</span>
                      </div>

                      {/* Power and Variants */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{model.power}</span>
                        <span>{model.variants} Variants</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        Rs. {model.price} Lakh
                      </div>
                      <div className="text-sm text-gray-500">onwards</div>
                      <div className="text-xs text-gray-400">Avg. Ex-Showroom price</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
