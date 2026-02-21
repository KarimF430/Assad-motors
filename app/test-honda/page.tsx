'use client'

import { useEffect, useState } from 'react'
import BrandFAQ from '@/components/brand/BrandFAQ'
import FormattedBrandSummary from '@/components/brand/FormattedBrandSummary'

export default function TestHondaPage() {
  const [brandData, setBrandData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/brands')
        const result = await response.json()
        
        if (result.success) {
          const honda = result.data.find((b: any) => b.name === 'Honda')
          setBrandData(honda)
          console.log('Honda data:', honda)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!brandData) {
    return <div className="p-8">Honda not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Honda Test Page</h1>
        
        {/* Brand Summary */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Brand Summary</h2>
          <FormattedBrandSummary 
            summary={brandData.summary} 
            brandName={brandData.name} 
          />
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">FAQ Test</h2>
          <p className="mb-4">FAQs found: {brandData.faqs?.length || 0}</p>
          {brandData.faqs?.map((faq: any, index: number) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
              <p className="font-semibold">{faq.question}</p>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* BrandFAQ Component */}
        <BrandFAQ brandName="Honda" brandId={brandData.id} />
      </div>
    </div>
  )
}
