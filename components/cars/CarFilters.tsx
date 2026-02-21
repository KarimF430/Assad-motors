'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react'

export default function CarFilters() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    price: true,
    fuel: true,
    body: true,
    transmission: false,
    seating: false,
  })

  const [selectedFilters, setSelectedFilters] = useState({
    brands: [] as string[],
    priceRange: [0, 50],
    fuelTypes: [] as string[],
    bodyTypes: [] as string[],
    transmissions: [] as string[],
    seatingCapacity: [] as string[],
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (category: keyof typeof selectedFilters, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const brands = [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 
    'Kia', 'MG', 'Renault', 'Nissan', 'Ford', 'Volkswagen'
  ]

  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
  
  // Comprehensive body type and sub-body type mapping
  const bodyTypeMapping: { [key: string]: string[] } = {
    'SUV': ['Premium Level', 'Compact', 'Mid Size', 'Full Size Luxury', 'Flagship Luxury', 'Luxury Entry Level'],
    'Sedan': ['Mid Level', 'Entry Level', 'Luxury Entry Level', 'Flagship Luxury'],
    'Hatchback': ['Entry Level', 'Compact', 'Premium'],
    'MPV': ['Electric Entry Level', 'Mid Level', 'Luxury'],
    'Coupe': ['Mid Size', 'Sports Car', 'Luxury Sports'],
    'Pickup': ['Entry Level Luxury', 'Mid Size', 'Full Size'],
    'Convertible': ['Compact Luxury', 'Full Size Luxury', 'Sports Car']
  }
  
  const bodyTypes = Object.keys(bodyTypeMapping)
  const subBodyTypes = [
    'Premium Level',
    'Mid Level',
    'Entry Level',
    'Electric Entry Level',
    'Mid Size',
    'Entry Level Luxury',
    'Compact Luxury',
    'Compact',
    'Full Size Luxury',
    'Flagship Luxury Electric',
    'Flagship Luxury',
    'Sports Car',
    'Compact Luxury Electric',
    'Luxury Entry Level',
    'Luxury Electric Entry Level',
    'Luxury Sports'
  ]
  
  const transmissions = ['Manual', 'Automatic', 'CVT', 'AMT']
  const seatingOptions = ['2', '4', '5', '6', '7', '8+']

  const FilterSection = ({ 
    title, 
    isExpanded, 
    onToggle, 
    children 
  }: { 
    title: string
    isExpanded: boolean
    onToggle: () => void
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-primary-600"
      >
        <span>{title}</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFiltersOpen(true)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center space-x-2 hover:bg-gray-50"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsFiltersOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setIsFiltersOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20">
              <FiltersContent />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700">
            Clear All
          </button>
        </div>
        <FiltersContent />
      </div>
    </>
  )

  function FiltersContent() {
    return (
      <div className="space-y-6">
        {/* Brand Filter */}
        <FilterSection
          title="Brand"
          isExpanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedFilters.brands.includes(brand)}
                  onChange={(e) => {
                    const newBrands = e.target.checked
                      ? [...selectedFilters.brands, brand]
                      : selectedFilters.brands.filter(b => b !== brand)
                    handleFilterChange('brands', newBrands)
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={selectedFilters.priceRange[0] || ''}
                onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), selectedFilters.priceRange[1]])}
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={selectedFilters.priceRange[1] || ''}
                onChange={(e) => handleFilterChange('priceRange', [selectedFilters.priceRange[0], Number(e.target.value)])}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Under 5L', '5-10L', '10-15L', '15-25L', '25L+'].map((range) => (
                <button
                  key={range}
                  className="px-3 py-1 border border-gray-300 rounded-full hover:border-primary-500 hover:text-primary-600"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Fuel Type Filter */}
        <FilterSection
          title="Fuel Type"
          isExpanded={expandedSections.fuel}
          onToggle={() => toggleSection('fuel')}
        >
          <div className="space-y-2">
            {fuelTypes.map((fuel) => (
              <label key={fuel} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedFilters.fuelTypes.includes(fuel)}
                  onChange={(e) => {
                    const newFuels = e.target.checked
                      ? [...selectedFilters.fuelTypes, fuel]
                      : selectedFilters.fuelTypes.filter(f => f !== fuel)
                    handleFilterChange('fuelTypes', newFuels)
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">{fuel}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Body Type Filter */}
        <FilterSection
          title="Body Type"
          isExpanded={expandedSections.body}
          onToggle={() => toggleSection('body')}
        >
          <div className="space-y-2">
            {bodyTypes.map((body) => (
              <label key={body} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedFilters.bodyTypes.includes(body)}
                  onChange={(e) => {
                    const newBodies = e.target.checked
                      ? [...selectedFilters.bodyTypes, body]
                      : selectedFilters.bodyTypes.filter(b => b !== body)
                    handleFilterChange('bodyTypes', newBodies)
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">{body}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Transmission Filter */}
        <FilterSection
          title="Transmission"
          isExpanded={expandedSections.transmission}
          onToggle={() => toggleSection('transmission')}
        >
          <div className="space-y-2">
            {transmissions.map((transmission) => (
              <label key={transmission} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedFilters.transmissions.includes(transmission)}
                  onChange={(e) => {
                    const newTransmissions = e.target.checked
                      ? [...selectedFilters.transmissions, transmission]
                      : selectedFilters.transmissions.filter(t => t !== transmission)
                    handleFilterChange('transmissions', newTransmissions)
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">{transmission}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Seating Capacity Filter */}
        <FilterSection
          title="Seating Capacity"
          isExpanded={expandedSections.seating}
          onToggle={() => toggleSection('seating')}
        >
          <div className="grid grid-cols-3 gap-2">
            {seatingOptions.map((seats) => (
              <button
                key={seats}
                className={`px-3 py-2 text-sm border rounded-lg ${
                  selectedFilters.seatingCapacity.includes(seats)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-primary-300'
                }`}
                onClick={() => {
                  const newSeating = selectedFilters.seatingCapacity.includes(seats)
                    ? selectedFilters.seatingCapacity.filter(s => s !== seats)
                    : [...selectedFilters.seatingCapacity, seats]
                  handleFilterChange('seatingCapacity', newSeating)
                }}
              >
                {seats} Seater
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    )
  }
}
