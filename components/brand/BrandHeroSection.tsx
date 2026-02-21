'use client'

import { useState } from 'react'
import Link from 'next/link'
import BrandCarsList from './BrandCarsList'
import BrandUpcomingCars from './BrandUpcomingCars'
import AlternativeBrands from './AlternativeBrands'
import BrandFAQ from './BrandFAQ'
import BrandYouTube from './BrandYouTube'
import AdBanner from '@/components/home/AdBanner'
import Ad3DCarousel from '../ads/Ad3DCarousel'
interface Brand {
  name: string
  slug: string
  logo?: string
  description: string
  fullDescription: string
  priceRange: {
    min: number
    max: number
  }
  totalModels: number
  categories: {
    suv: number
    sedan: number
    hatchback: number
    muv: number
    minivan: number
  }
  upcomingCars: number
  models?: string[]
}

interface BrandHeroSectionProps {
  brand: Brand
  brands?: any[]
  models?: any[]
  brandId?: string
  backendBrand?: any
  newsSlot?: React.ReactNode
}

export default function BrandHeroSection({ brand, brands = [], models = [], brandId, backendBrand, newsSlot }: BrandHeroSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatPrice = (price: number) => {
    return (price / 100000).toFixed(2)
  }

  // Get current month and year
  const getCurrentMonthYear = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const now = new Date()
    return `${months[now.getMonth()]} ${now.getFullYear()}`
  }

  // Get all models sorted by price
  const getAllModels = () => {
    if (!models || models.length === 0) return []

    // Filter models with valid prices and sort by lowest price
    const validModels = models
      .filter((m: any) => m.lowestPrice && m.lowestPrice > 0)
      .sort((a: any, b: any) => a.lowestPrice - b.lowestPrice)

    return validModels
  }

  // Get top 5 for the inline text
  const getTop5Models = () => {
    const allModels = getAllModels()
    return allModels.slice(0, 5)
  }

  const allModels = getAllModels()
  const top5Models = getTop5Models()

  // Generate model slug for links
  const generateModelSlug = (brandName: string, modelName: string) => {
    const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-')
    const modelSlug = modelName.toLowerCase().replace(/\s+/g, '-')
    return `/${brandSlug}-cars/${modelSlug}`
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Ad3DCarousel className="my-3 sm:my-4" />
      </div>

      {/* Brand Title and SEO Text Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Brand Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {brand.name} Cars Price in India, New Models {new Date().getFullYear()}, Reviews & Offers
          </h1>

          {/* Dynamic SEO Description */}
          <div className="bg-white">
            <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
              <p className="mb-2">
                {brand.name} offers {brand.totalModels} car models in India, including {brand.categories.suv > 0 ? `${brand.categories.suv} SUVs, ` : ''}{brand.categories.sedan > 0 ? `${brand.categories.sedan} Sedans, ` : ''}{brand.categories.hatchback > 0 ? `${brand.categories.hatchback} Hatchbacks` : ''}.
                The price range for {brand.name} cars starts from <span className="font-semibold">₹ {formatPrice(brand.priceRange.min)} Lakh</span> and goes up to <span className="font-semibold">₹ {formatPrice(brand.priceRange.max)} Lakh</span> (Avg. ex-showroom).
              </p>

              {!isExpanded ? (
                <>
                  <p className="inline">
                    Some of the most popular {brand.name} cars include {top5Models.map(m => m.name).join(', ')}.
                    {brand.upcomingCars > 0 && ` There are ${brand.upcomingCars} upcoming ${brand.name} cars expected to launch in ${new Date().getFullYear()}.`}
                  </p>
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="ml-2 text-red-600 hover:text-orange-600 font-medium transition-colors hover:underline"
                  >
                    Read More
                  </button>
                </>
              ) : (
                <div className="mt-4 space-y-6 animate-fadeIn">
                  {/* Detailed Description */}
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p>{brand.fullDescription}</p>

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-3">
                      Why Buy {brand.name} Cars?
                    </h2>
                    <p>
                      {brand.name} is one of the leading car manufacturers in India, known for its widespread service network,
                      {brand.name === 'Maruti Suzuki' ? ' exceptional fuel efficiency, and low maintenance costs.' :
                        brand.name === 'Hyundai' ? ' feature-rich vehicles, premium interiors, and modern design language.' :
                          brand.name === 'Tata' ? ' robust build quality, 5-star safety ratings, and stylish designs.' :
                            brand.name === 'Mahindra' ? ' rugged SUV capabilities, powerful engines, and road presence.' :
                              brand.name === 'Kia' ? ' futuristic design, connected car technology, and premium features.' :
                                brand.name === 'Toyota' ? ' legendary reliability, strong resale value, and hybrid technology.' :
                                  brand.name === 'Honda' ? ' refined engines, spacious interiors, and excellent durability.' :
                                    ' reliable engineering and value for money proposition.'}
                    </p>

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-3">
                      {brand.name} Car Categories
                    </h2>
                    <ul className="list-disc pl-5 space-y-1">
                      {brand.categories.hatchback > 0 && <li><strong>Hatchbacks:</strong> Perfect for city driving and first-time buyers.</li>}
                      {brand.categories.sedan > 0 && <li><strong>Sedans:</strong> Offering comfort, status, and better boot space.</li>}
                      {brand.categories.suv > 0 && <li><strong>SUVs:</strong> High ground clearance, commanding view, and family comfort.</li>}
                      {brand.categories.muv > 0 && <li><strong>MUVs/MPVs:</strong> Ideal for large families with 6-7 seater options.</li>}
                    </ul>
                  </div>

                  {/* Price Table */}
                  <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {brand.name} Car Prices List ({getCurrentMonthYear()})
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="grid grid-cols-2 bg-gray-50 px-4 py-2 font-semibold text-xs sm:text-sm text-gray-700">
                        <div>Model</div>
                        <div className="text-right">Price (Ex-Showroom)</div>
                      </div>
                      {allModels.map((model: any, index: number) => (
                        <div key={index} className="grid grid-cols-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <Link
                            href={generateModelSlug(brand.name, model.name)}
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                          >
                            {brand.name} {model.name}
                          </Link>
                          <div className="text-right text-gray-900 font-medium text-sm">
                            Rs. {formatPrice(model.lowestPrice)} Lakh*
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 italic border-t border-gray-200">
                      *Prices are subject to change. Check specific model pages for accurate on-road prices.
                    </div>
                  </div>

                  {/* Collapse Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Read Less
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Car Models List with Filters */}
      <BrandCarsList brand={brand.slug} initialModels={models} brandId={brandId} />

      {/* Section 3: Ad Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Ad3DCarousel className="my-3 sm:my-4" />
      </div>

      {/* Section 4: Upcoming Cars Section - Using BrandUpcomingCars Component */}
      {brandId && <BrandUpcomingCars brandId={brandId} brandName={brand.name} />}

      {/* Section 4: Ad Banner + Alternative Brands */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Ad3DCarousel className="my-3 sm:my-4" />
      </div>

      {/* Alternative Brands Section - Dynamic with Backend Logic */}
      <AlternativeBrands currentBrand={brand.slug} initialBrands={brands} />



      {/* Section 6: Brand News and Videos */}
      <div className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {newsSlot}
        </div>
      </div>

      {/* Brand Videos Section - Using BrandYouTube Component */}
      <BrandYouTube brandName={brand.name} />

      {/* Section 7: Ad Banner + Brand FAQ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Ad3DCarousel className="my-3 sm:my-4" />
      </div>

      {/* Brand FAQ Section - Dynamic with Backend Logic */}
      <BrandFAQ brandName={brand.name} initialBrand={backendBrand} />

      {/* Section 8: Owner Reviews */}
      <section className="py-6 sm:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{brand.name} Owner Reviews</h2>
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Own a {brand.name.toLowerCase()} car? Share your experience!</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Be the first to review this car and help other buyers make informed decisions
            </p>
            <Link
              href={`/${brand.slug}-cars/write-review`}
              className="inline-block bg-[#291e6a] hover:bg-[#1c144a] text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-all duration-200 shadow-md text-sm sm:text-base"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </section>

      {/* Website Feedback Section */}
      <section className="py-6 sm:py-8 bg-gray-50">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center mb-2 sm:mb-3">
              Share Your Feedback
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
              Help us improve our website by sharing your experience
            </p>

            <form className="space-y-4 sm:space-y-5">
              {/* Feedback Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Your Feedback
                </label>
                <textarea
                  placeholder="Tell us what you think about our website..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Name and Email - Stack on mobile, side-by-side on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Submit Feedback</span>
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
