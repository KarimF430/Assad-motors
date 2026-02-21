'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

interface Brand {
  id: string
  name: string
}

interface Model {
  id: string
  name: string
  brandId: string
}

interface Comparison {
  id?: string
  model1Id: string
  model2Id: string
  order: number
}

export default function PopularComparisonsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  // Fetch brands, models, and existing comparisons
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch brands
      const brandsRes = await fetch(`${backendUrl}/api/brands`)
      const brandsData = await brandsRes.json()
      setBrands(brandsData)

      // Fetch models
      const modelsRes = await fetch(`${backendUrl}/api/models`)
      const modelsData = await modelsRes.json()
      setModels(modelsData)

      // Fetch existing comparisons
      const comparisonsRes = await fetch(`${backendUrl}/api/popular-comparisons`)
      if (comparisonsRes.ok) {
        const comparisonsData = await comparisonsRes.json()
        setComparisons(comparisonsData)
      } else {
        // Initialize with empty comparisons if none exist
        setComparisons(Array(10).fill(null).map((_, i) => ({
          model1Id: '',
          model2Id: '',
          order: i + 1
        })))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Initialize with empty comparisons on error
      setComparisons(Array(10).fill(null).map((_, i) => ({
        model1Id: '',
        model2Id: '',
        order: i + 1
      })))
    } finally {
      setLoading(false)
    }
  }

  const handleBrandChange = (index: number, side: 'model1' | 'model2', brandId: string) => {
    const newComparisons = [...comparisons]
    // Reset model when brand changes
    if (side === 'model1') {
      newComparisons[index] = { ...newComparisons[index], model1Id: '' }
    } else {
      newComparisons[index] = { ...newComparisons[index], model2Id: '' }
    }
    setComparisons(newComparisons)
  }

  const handleModelChange = (index: number, side: 'model1' | 'model2', modelId: string) => {
    const newComparisons = [...comparisons]
    newComparisons[index] = { ...newComparisons[index], [side + 'Id']: modelId }
    setComparisons(newComparisons)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Filter out empty comparisons
      const validComparisons = comparisons.filter(c => c.model1Id && c.model2Id)
      
      const response = await fetch(`${backendUrl}/api/popular-comparisons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validComparisons)
      })

      if (response.ok) {
        alert('Popular comparisons saved successfully!')
        fetchData() // Refresh data
      } else {
        alert('Error saving comparisons')
      }
    } catch (error) {
      console.error('Error saving comparisons:', error)
      alert('Error saving comparisons')
    } finally {
      setSaving(false)
    }
  }

  const getModelsByBrand = (brandId: string) => {
    return models.filter(m => m.brandId === brandId)
  }

  const getBrandIdByModelId = (modelId: string) => {
    const model = models.find(m => m.id === modelId)
    return model?.brandId || ''
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Popular Comparison</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="space-y-6">
        {comparisons.map((comparison, index) => (
          <div key={index} className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-center gap-8">
              {/* Comparison Number */}
              <div className="text-3xl font-bold text-gray-400 w-12">
                {index + 1}
              </div>

              {/* Model 1 */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Brand
                  </label>
                  <select
                    value={getBrandIdByModelId(comparison.model1Id)}
                    onChange={(e) => handleBrandChange(index, 'model1', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Model
                  </label>
                  <select
                    value={comparison.model1Id}
                    onChange={(e) => handleModelChange(index, 'model1', e.target.value)}
                    disabled={!getBrandIdByModelId(comparison.model1Id) && !comparison.model1Id}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select Model</option>
                    {getModelsByBrand(getBrandIdByModelId(comparison.model1Id) || '').map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* VS Badge */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[#291e6a] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">VS</span>
                </div>
              </div>

              {/* Model 2 */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Brand
                  </label>
                  <select
                    value={getBrandIdByModelId(comparison.model2Id)}
                    onChange={(e) => handleBrandChange(index, 'model2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Model
                  </label>
                  <select
                    value={comparison.model2Id}
                    onChange={(e) => handleModelChange(index, 'model2', e.target.value)}
                    disabled={!getBrandIdByModelId(comparison.model2Id) && !comparison.model2Id}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select Model</option>
                    {getModelsByBrand(getBrandIdByModelId(comparison.model2Id) || '').map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-lg font-semibold"
        >
          <Save className="h-6 w-6" />
          {saving ? 'Saving...' : 'Save All Comparisons'}
        </button>
      </div>
    </div>
  )
}
