import Link from 'next/link'
import { FrontendBrand } from '@/lib/brand-api'
import { OptimizedImage } from '@/components/common/OptimizedImage'

interface PopularBrandsProps {
  brands: FrontendBrand[]
}

export default function PopularBrands({ brands }: PopularBrandsProps) {
  const loading = false
  const error = null

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Popular Car Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore new cars from India's most trusted automotive brands
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                <div className="text-center">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Keep one demo brand for design reference */}
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                {/* Brand Logo */}
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-red-600">MS</span>
                </div>

                {/* Brand Info */}
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                    Maruti Suzuki
                  </h3>
                  <p className="text-xs text-gray-500">
                    India's most trusted car brand
                  </p>
                </div>
              </div>
            </div>

            {/* Real backend brands */}
            {brands.map((brand) => (
              <Link key={brand.id} href={brand.href} className="group cursor-pointer">
                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  {/* Brand Logo */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm relative overflow-hidden">
                    {brand.logo ? (
                      <OptimizedImage
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                      />
                    ) : null}
                    <span className={`text-2xl font-bold text-red-600 ${brand.logo ? 'hidden' : ''}`}>
                      {brand.name.charAt(0)}
                    </span>
                  </div>

                  {/* Brand Info */}
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {brand.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8 lg:mt-12">
          <Link
            href="/brands"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#291e6a] text-white text-lg font-semibold rounded-full hover:bg-[#1c144a] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Show All {brands.length > 0 ? brands.length : 0} Brands
          </Link>
        </div>
      </div>
    </section>
  )
}
