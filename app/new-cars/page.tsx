import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CarFilters from '@/components/cars/CarFilters'
import CarGrid from '@/components/cars/CarGrid'
import SortOptions from '@/components/cars/SortOptions'
import Breadcrumb from '@/components/common/Breadcrumb'

export const metadata: Metadata = {
  title: 'New Cars in India 2025 - Check Prices, Specs, Mileage & Reviews',
  description: 'Explore 500+ new cars in India 2025. Compare on-road prices, specifications, mileage, features & expert reviews. Find Maruti, Hyundai, Tata, Mahindra, Kia, MG & more. Check SUV, Sedan, Hatchback prices.',
  keywords: [
    'new cars India 2025',
    'latest car prices India',
    'new car launches 2025',
    'upcoming cars India',
    'Maruti Suzuki new cars',
    'Hyundai new cars 2025',
    'Tata new cars',
    'Mahindra new SUV',
    'Kia new cars India',
    'best SUV under 15 lakhs',
    'best sedan under 10 lakhs',
    'best hatchback India',
    'electric cars India 2025',
    'CNG cars India',
    'hybrid cars India',
    'car on road price',
    'car EMI calculator',
    'car mileage comparison',
    'petrol cars',
    'diesel cars India',
    'automatic cars India',
  ].join(', '),
  openGraph: {
    title: 'New Cars in India 2025 - Latest Prices, Specs & Reviews | gadizone',
    description: 'Browse 500+ new cars in India. Compare prices, specifications, mileage & reviews of Maruti, Hyundai, Tata, Mahindra & more brands.',
    url: 'https://www.gadizone.com/new-cars',
    siteName: 'gadizone',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.gadizone.com/new-cars',
  },
}

export default function NewCarsPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main>
          {/* Page Header */}
          <section className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  New Cars in India
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Discover the latest cars with detailed specifications, prices, and expert reviews
                </p>
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-900">487 cars</span> from
                  <span className="font-medium text-gray-900"> 25 brands</span>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <CarFilters />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 mt-6 lg:mt-0">
                <SortOptions />
                <CarGrid />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Breadcrumb items={[{ label: 'New Cars' }]} />
      <Footer />
    </>
  )
}
