'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Filter, Grid, List, Star, Fuel, Users, IndianRupee, TrendingUp } from 'lucide-react'

interface BrandCarsListingProps {
  brand: string
}

interface Car {
  id: number
  name: string
  brand: string
  slug: string
  priceRange: string
  startingPrice: number
  rating: number
  reviewCount: number
  mileage: string
  fuelType: string
  transmission: string
  seating: number
  bodyType: string
  image: string
  isNew: boolean
  offers: string[]
}

interface BrandInfo {
  name: string
  logo: string
  description: string
  established: string
  headquarters: string
  totalModels: number
  popularModels: string[]
  highlights: string[]
}

export default function BrandCarsListing({ brand }: BrandCarsListingProps) {
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceFilter, setPriceFilter] = useState('')
  const [fuelFilter, setFuelFilter] = useState('')
  const [bodyTypeFilter, setBodyTypeFilter] = useState('')

  const brandName = brand.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

  // Mock brand data
  const brandInfo: { [key: string]: BrandInfo } = {
    'maruti-suzuki': {
      name: 'Maruti Suzuki',
      logo: '/brands/maruti-suzuki.png',
      description: 'India\'s largest car manufacturer known for fuel-efficient and reliable vehicles.',
      established: '1981',
      headquarters: 'New Delhi, India',
      totalModels: 16,
      popularModels: ['Swift', 'Baleno', 'Wagon R', 'Alto'],
      highlights: ['Best-in-class fuel efficiency', 'Extensive service network', 'Affordable pricing', 'High resale value']
    },
    'hyundai': {
      name: 'Hyundai',
      logo: '/brands/hyundai.png',
      description: 'South Korean automaker offering premium features and modern design in Indian cars.',
      established: '1996',
      headquarters: 'Chennai, India',
      totalModels: 12,
      popularModels: ['i20', 'Creta', 'Venue', 'Verna'],
      highlights: ['Premium features', 'Modern design', 'Advanced safety', 'Blue Link connectivity']
    },
    'tata': {
      name: 'Tata Motors',
      logo: '/brands/tata.png',
      description: 'Indian automotive giant known for safety, innovation, and robust build quality.',
      established: '1945',
      headquarters: 'Mumbai, India',
      totalModels: 10,
      popularModels: ['Nexon', 'Harrier', 'Safari', 'Altroz'],
      highlights: ['5-star safety ratings', 'Robust build quality', 'Indian heritage', 'Innovative features']
    }
  }

  // Mock cars data filtered by brand
  const allCars: Car[] = [
    // Maruti Suzuki cars
    {
      id: 1,
      name: 'Swift',
      brand: 'Maruti Suzuki',
      slug: 'swift',
      priceRange: '₹5.85 - 8.67 Lakh',
      startingPrice: 585000,
      rating: 4.2,
      reviewCount: 1247,
      mileage: '23.20 kmpl',
      fuelType: 'Petrol',
      transmission: 'Manual/AMT',
      seating: 5,
      bodyType: 'Hatchback',
      image: '/cars/swift.jpg',
      isNew: false,
      offers: ['₹25,000 Cash Discount', 'Low EMI from ₹8,999']
    },
    {
      id: 2,
      name: 'Baleno',
      brand: 'Maruti Suzuki',
      slug: 'baleno',
      priceRange: '₹6.61 - 9.88 Lakh',
      startingPrice: 661000,
      rating: 4.1,
      reviewCount: 892,
      mileage: '22.35 kmpl',
      fuelType: 'Petrol',
      transmission: 'Manual/AMT',
      seating: 5,
      bodyType: 'Hatchback',
      image: '/cars/baleno.jpg',
      isNew: false,
      offers: ['₹30,000 Exchange Bonus', 'Free Insurance']
    },
    {
      id: 3,
      name: 'Wagon R',
      brand: 'Maruti Suzuki',
      slug: 'wagon-r',
      priceRange: '₹5.54 - 7.44 Lakh',
      startingPrice: 554000,
      rating: 4.0,
      reviewCount: 756,
      mileage: '25.19 kmpl',
      fuelType: 'Petrol/CNG',
      transmission: 'Manual/AMT',
      seating: 5,
      bodyType: 'Hatchback',
      image: '/cars/wagon-r.jpg',
      isNew: false,
      offers: ['₹20,000 Cash Discount']
    },
    // Hyundai cars
    {
      id: 4,
      name: 'i20',
      brand: 'Hyundai',
      slug: 'i20',
      priceRange: '₹7.04 - 11.21 Lakh',
      startingPrice: 704000,
      rating: 4.3,
      reviewCount: 1156,
      mileage: '20.35 kmpl',
      fuelType: 'Petrol',
      transmission: 'Manual/CVT',
      seating: 5,
      bodyType: 'Hatchback',
      image: '/cars/i20.jpg',
      isNew: false,
      offers: ['₹40,000 Cash Discount', 'Low EMI from ₹11,999']
    },
    {
      id: 5,
      name: 'Creta',
      brand: 'Hyundai',
      slug: 'creta',
      priceRange: '₹11.00 - 20.15 Lakh',
      startingPrice: 1100000,
      rating: 4.4,
      reviewCount: 2341,
      mileage: '17.4 kmpl',
      fuelType: 'Petrol/Diesel',
      transmission: 'Manual/Automatic',
      seating: 5,
      bodyType: 'SUV',
      image: '/cars/creta.jpg',
      isNew: false,
      offers: ['₹50,000 Exchange Bonus', '0% Interest Rate']
    },
    // Tata cars
    {
      id: 6,
      name: 'Nexon',
      brand: 'Tata',
      slug: 'nexon',
      priceRange: '₹7.60 - 14.08 Lakh',
      startingPrice: 760000,
      rating: 4.2,
      reviewCount: 1834,
      mileage: '17.57 kmpl',
      fuelType: 'Petrol/Diesel',
      transmission: 'Manual/AMT',
      seating: 5,
      bodyType: 'SUV',
      image: '/cars/nexon.jpg',
      isNew: false,
      offers: ['₹35,000 Cash Discount', 'Free Accessories Worth ₹15,000']
    }
  ]

  const currentBrandInfo = brandInfo[brand as keyof typeof brandInfo]
  const brandCars = allCars.filter(car => car.brand.toLowerCase().replace(' ', '-') === brand)

  // Apply filters
  let filteredCars = brandCars

  if (priceFilter) {
    const [min, max] = priceFilter.split('-').map(p => parseInt(p) * 100000)
    filteredCars = filteredCars.filter(car => 
      car.startingPrice >= min && (max ? car.startingPrice <= max : true)
    )
  }

  if (fuelFilter) {
    filteredCars = filteredCars.filter(car => 
      car.fuelType.toLowerCase().includes(fuelFilter.toLowerCase())
    )
  }

  if (bodyTypeFilter) {
    filteredCars = filteredCars.filter(car => 
      car.bodyType.toLowerCase() === bodyTypeFilter.toLowerCase()
    )
  }

  // Apply sorting
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.startingPrice - b.startingPrice
      case 'price-high':
        return b.startingPrice - a.startingPrice
      case 'rating':
        return b.rating - a.rating
      case 'mileage':
        return parseFloat(b.mileage) - parseFloat(a.mileage)
      default:
        return b.reviewCount - a.reviewCount // popularity
    }
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  // If brand info not found in mock data, create a default one
  const displayBrandInfo = currentBrandInfo || {
    name: brandName,
    logo: '',
    description: `Explore ${brandName} cars`,
    established: '',
    headquarters: '',
    totalModels: 0,
    popularModels: [],
    highlights: []
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/new-cars" className="text-gray-500 hover:text-gray-700">New Cars</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{displayBrandInfo.name}</span>
          </nav>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {displayBrandInfo.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {displayBrandInfo.name} Cars
                </h1>
                <p className="text-gray-600 max-w-2xl">
                  {displayBrandInfo.description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary-600">{displayBrandInfo.totalModels}</p>
                <p className="text-sm text-gray-600">Models</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600">{brandCars.length}</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600">
                  {displayBrandInfo.established}
                </p>
                <p className="text-sm text-gray-600">Est.</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600">
                  {(brandCars.reduce((sum, car) => sum + car.rating, 0) / brandCars.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </div>

          {/* Brand Highlights */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose {displayBrandInfo.name}?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayBrandInfo.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Sort */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Prices</option>
                <option value="0-5">Under ₹5 Lakh</option>
                <option value="5-10">₹5-10 Lakh</option>
                <option value="10-15">₹10-15 Lakh</option>
                <option value="15-20">₹15-20 Lakh</option>
                <option value="20">Above ₹20 Lakh</option>
              </select>

              <select
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Fuel Types</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
              </select>

              <select
                value={bodyTypeFilter}
                onChange={(e) => setBodyTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Body Types</option>
                <option value="hatchback">Hatchback</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="mpv">MPV</option>
              </select>
            </div>

            {/* Sort and View */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="mileage">Mileage</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {sortedCars.length} of {brandCars.length} {displayBrandInfo.name} cars
          </div>
        </div>

        {/* Cars Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {sortedCars.map((car) => (
            <div
              key={car.id}
              className={`bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 ${
                viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Car Image */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Car Image</span>
                    </div>
                    {car.isNew && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {car.brand} {car.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(car.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        ({car.reviewCount} reviews)
                      </span>
                    </div>

                    <p className="text-xl font-bold text-primary-600 mb-3">
                      {car.priceRange}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Fuel className="h-4 w-4" />
                        <span>{car.mileage}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{car.seating} Seater</span>
                      </div>
                    </div>

                    {car.offers.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-green-700 font-medium mb-1">Offers:</p>
                        <p className="text-xs text-green-600">{car.offers[0]}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Link
                        href={`/cars/${brand}/${car.slug}`}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        View Details
                      </Link>
                      <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                        Compare
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* List View */}
                  <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 text-xs">Car Image</span>
                  </div>
                  
                  <div className="flex-1 ml-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {car.brand} {car.name}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(car.rating)}
                          <span className="text-sm text-gray-600 ml-2">
                            ({car.reviewCount})
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>{car.mileage}</span>
                          <span>{car.fuelType}</span>
                          <span>{car.seating} Seater</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-600">
                          {car.priceRange}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Link
                            href={`/cars/${brand}/${car.slug}`}
                            className="bg-primary-600 hover:bg-primary-700 text-white py-1 px-3 rounded text-sm font-medium transition-colors duration-200"
                          >
                            View Details
                          </Link>
                          <button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-1 px-3 rounded text-sm font-medium transition-colors duration-200">
                            Compare
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedCars.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No cars found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more {displayBrandInfo.name} cars
              </p>
              <button
                onClick={() => {
                  setPriceFilter('')
                  setFuelFilter('')
                  setBodyTypeFilter('')
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
