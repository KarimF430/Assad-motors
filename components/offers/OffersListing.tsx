'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, Calendar, Tag, Gift, Percent, Car, IndianRupee, Clock, ChevronRight } from 'lucide-react'

interface Offer {
  id: number
  title: string
  description: string
  brand: string
  model?: string
  offerType: 'cash-discount' | 'exchange-bonus' | 'finance-offer' | 'festive-offer' | 'corporate-discount'
  discountAmount: number
  validUntil: string
  cities: string[]
  terms: string[]
  image: string
  isActive: boolean
  isFeatured: boolean
}

export default function OffersListing() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedOfferType, setSelectedOfferType] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Mock offers data
  const offers: Offer[] = [
    {
      id: 1,
      title: 'Festive Season Mega Discount',
      description: 'Get up to ₹50,000 cash discount + exchange bonus on Swift',
      brand: 'Maruti Suzuki',
      model: 'Swift',
      offerType: 'festive-offer',
      discountAmount: 50000,
      validUntil: '2024-01-31',
      cities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'],
      terms: ['Valid on select variants only', 'Exchange bonus applicable on cars above 3 years', 'Cannot be combined with other offers'],
      image: '/cars/swift-offer.jpg',
      isActive: true,
      isFeatured: true
    },
    {
      id: 2,
      title: 'Zero Down Payment Scheme',
      description: 'Buy Creta with 0% down payment and attractive EMI options',
      brand: 'Hyundai',
      model: 'Creta',
      offerType: 'finance-offer',
      discountAmount: 0,
      validUntil: '2024-02-15',
      cities: ['Delhi', 'Mumbai', 'Pune', 'Ahmedabad'],
      terms: ['Subject to loan approval', 'Processing charges applicable', 'Valid for salaried customers only'],
      image: '/cars/creta-offer.jpg',
      isActive: true,
      isFeatured: true
    },
    {
      id: 3,
      title: 'Corporate Discount Program',
      description: 'Special discounts for corporate employees and government staff',
      brand: 'Tata',
      model: 'Nexon',
      offerType: 'corporate-discount',
      discountAmount: 25000,
      validUntil: '2024-03-31',
      cities: ['All Cities'],
      terms: ['Valid employee ID required', 'Minimum 2 years of service', 'Applicable on select variants'],
      image: '/cars/nexon-offer.jpg',
      isActive: true,
      isFeatured: false
    },
    {
      id: 4,
      title: 'Exchange Bonus Offer',
      description: 'Get additional ₹30,000 exchange bonus on your old car',
      brand: 'Honda',
      model: 'City',
      offerType: 'exchange-bonus',
      discountAmount: 30000,
      validUntil: '2024-01-20',
      cities: ['Mumbai', 'Pune', 'Nashik', 'Aurangabad'],
      terms: ['Valid on cars registered before 2020', 'Car should be in running condition', 'Valuation subject to inspection'],
      image: '/cars/city-offer.jpg',
      isActive: true,
      isFeatured: false
    },
    {
      id: 5,
      title: 'Year-End Cash Discount',
      description: 'Flat ₹40,000 cash discount on all Venue variants',
      brand: 'Hyundai',
      model: 'Venue',
      offerType: 'cash-discount',
      discountAmount: 40000,
      validUntil: '2024-01-15',
      cities: ['Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
      terms: ['Valid on immediate delivery only', 'Cannot be combined with exchange offer', 'Limited stock available'],
      image: '/cars/venue-offer.jpg',
      isActive: true,
      isFeatured: false
    }
  ]

  const cities = ['All Cities', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad']
  const brands = ['All Brands', 'Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Mahindra', 'Kia']
  const offerTypes = [
    { value: '', label: 'All Offers' },
    { value: 'cash-discount', label: 'Cash Discount' },
    { value: 'exchange-bonus', label: 'Exchange Bonus' },
    { value: 'finance-offer', label: 'Finance Offers' },
    { value: 'festive-offer', label: 'Festive Offers' },
    { value: 'corporate-discount', label: 'Corporate Discount' }
  ]

  const getOfferTypeIcon = (type: string) => {
    switch (type) {
      case 'cash-discount': return <IndianRupee className="h-4 w-4" />
      case 'exchange-bonus': return <Car className="h-4 w-4" />
      case 'finance-offer': return <Percent className="h-4 w-4" />
      case 'festive-offer': return <Gift className="h-4 w-4" />
      case 'corporate-discount': return <Tag className="h-4 w-4" />
      default: return <Gift className="h-4 w-4" />
    }
  }

  const getOfferTypeLabel = (type: string) => {
    return offerTypes.find(t => t.value === type)?.label || 'Special Offer'
  }

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (offer.model && offer.model.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCity = !selectedCity || selectedCity === 'All Cities' || 
                       offer.cities.includes(selectedCity) || offer.cities.includes('All Cities')
    
    const matchesBrand = !selectedBrand || selectedBrand === 'All Brands' || offer.brand === selectedBrand
    
    const matchesOfferType = !selectedOfferType || offer.offerType === selectedOfferType

    return matchesSearch && matchesCity && matchesBrand && matchesOfferType && offer.isActive
  })

  const featuredOffers = filteredOffers.filter(offer => offer.isFeatured)
  const regularOffers = filteredOffers.filter(offer => !offer.isFeatured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers by brand, model, or offer type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-4 pt-4 border-t border-gray-200 lg:border-t-0 lg:pt-0 lg:mt-4`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {cities.map(city => (
                  <option key={city} value={city === 'All Cities' ? '' : city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand === 'All Brands' ? '' : brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Offer Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type</label>
              <select
                value={selectedOfferType}
                onChange={(e) => setSelectedOfferType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {offerTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Offers */}
      {featuredOffers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Offers</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredOffers.map(offer => (
              <div key={offer.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Car className="h-16 w-16 mx-auto mb-2 opacity-80" />
                      <p className="text-sm opacity-80">{offer.brand} {offer.model}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-lg text-sm font-medium flex items-center">
                      {getOfferTypeIcon(offer.offerType)}
                      <span className="ml-1">{getOfferTypeLabel(offer.offerType)}</span>
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>

                  {offer.discountAmount > 0 && (
                    <div className="flex items-center mb-4">
                      <IndianRupee className="h-5 w-5 text-green-600 mr-1" />
                      <span className="text-2xl font-bold text-green-600">
                        {offer.discountAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-500 ml-2">Savings</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{offer.cities.join(', ')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/cars/${offer.brand.toLowerCase().replace(' ', '-')}/${offer.model?.toLowerCase().replace(' ', '-')}`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      View Car Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Get Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Offers */}
      {regularOffers.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {featuredOffers.length > 0 ? 'More Offers' : 'Available Offers'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularOffers.map(offer => (
              <div key={offer.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Car className="h-12 w-12 mx-auto mb-1 opacity-80" />
                      <p className="text-xs opacity-80">{offer.brand} {offer.model}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium flex items-center">
                      {getOfferTypeIcon(offer.offerType)}
                      <span className="ml-1 hidden sm:inline">{getOfferTypeLabel(offer.offerType)}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{offer.description}</p>

                  {offer.discountAmount > 0 && (
                    <div className="flex items-center mb-3">
                      <IndianRupee className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-lg font-bold text-green-600">
                        {offer.discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Until {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{offer.cities.join(', ')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/cars/${offer.brand.toLowerCase().replace(' ', '-')}/${offer.model?.toLowerCase().replace(' ', '-')}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Car
                    </Link>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      Get Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filters or search terms to find more offers.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCity('')
              setSelectedBrand('')
              setSelectedOfferType('')
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
