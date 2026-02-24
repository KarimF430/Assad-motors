'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { BrandCarCard, Car } from '@/components/common/BrandCarCard'

interface BrandCarsListProps {
  brand: string
  initialModels?: any[]
  brandId?: string
}

// Custom Dropdown Component for Filters
function FilterDropdown({
  label,
  options,
  selected,
  onChange
}: {
  label: string;
  options: string[];
  selected: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${selected
          ? 'bg-[#291e6a] text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        {selected || label}
        <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 sm:mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50">
          <button
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-50 transition-colors ${selected === '' ? 'text-[#291e6a] font-semibold bg-gray-50' : 'text-gray-700'
              }`}
          >
            All
          </button>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-50 transition-colors ${selected === option ? 'text-[#291e6a] font-semibold bg-gray-50' : 'text-gray-700'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrandCarsList({ brand, initialModels = [], brandId }: BrandCarsListProps) {
  const [selectedFuel, setSelectedFuel] = useState<string[]>([])
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([])

  // New Filter States
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedKms, setSelectedKms] = useState<string>('')

  const fuelFilters = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
  const transmissionFilters = ['Manual', 'Automatic']

  const priceRangeOptions = [
    'Under 3 Lakhs',
    '3 - 5 Lakhs',
    '5 - 8 Lakhs',
    '8 - 10 Lakhs',
    'Above 10 Lakhs'
  ]

  const kmsOptions = [
    '10,000 or Less',
    '30,000 or Less',
    '50,000 or Less',
    '75,000 or Less',
    '1 Lakh or Less',
    '2 Lakh or Less'
  ]

  const yearOptions = [
    '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017 & Before'
  ]

  const brandName = brand === 'maruti-suzuki' ? 'Maruti Suzuki' : brand.charAt(0).toUpperCase() + brand.slice(1)

  // Convert backend models to frontend format
  const models: Car[] = initialModels.map((model: any) => ({
    id: model.id,
    name: model.name,
    brand: brandId || '',
    brandName: brandName,
    image: model.heroImage || '/car-placeholder.jpg',
    startingPrice: model.lowestPrice || 0,
    lowestPriceFuelType: model.lowestPriceFuelType,
    fuelTypes: model.fuelTypes || ['Petrol'],
    transmissions: model.transmissions || ['Manual'],
    seating: 5,
    launchDate: model.launchDate || 'Launched',
    slug: `${brandName.toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
    isNew: model.isNew || false,
    isPopular: model.isPopular || false,
    rating: model.rating || 0,
    reviews: model.reviews || model.reviewCount || 0,
    variants: model.variantCount || 0
  }))

  // Apply filters
  const filteredModels = models.filter((model) => {
    // Fuel Filter
    if (selectedFuel.length > 0) {
      const hasFuel = selectedFuel.some(fuel =>
        model.fuelTypes.some(f => f.toLowerCase() === fuel.toLowerCase())
      )
      if (!hasFuel) return false
    }

    // Transmission Filter
    if (selectedTransmission.length > 0) {
      const hasTransmission = selectedTransmission.some(trans =>
        model.transmissions.some(t => t.toLowerCase().includes(trans.toLowerCase()))
      )
      if (!hasTransmission) return false
    }

    // Price Range Filter
    if (selectedPriceRange) {
      const priceInLakhs = model.startingPrice / 100000;
      if (selectedPriceRange === 'Under 3 Lakhs' && priceInLakhs >= 3) return false;
      if (selectedPriceRange === '3 - 5 Lakhs' && (priceInLakhs < 3 || priceInLakhs > 5)) return false;
      if (selectedPriceRange === '5 - 8 Lakhs' && (priceInLakhs < 5 || priceInLakhs > 8)) return false;
      if (selectedPriceRange === '8 - 10 Lakhs' && (priceInLakhs < 8 || priceInLakhs > 10)) return false;
      if (selectedPriceRange === 'Above 10 Lakhs' && priceInLakhs <= 10) return false;
    }

    // Year Filter
    if (selectedYear) {
      const yearMatch = model.launchDate?.match(/\d{4}/);
      const modelYear = yearMatch ? parseInt(yearMatch[0]) : null;
      if (modelYear) {
        if (selectedYear === '2017 & Before') {
          if (modelYear > 2017) return false;
        } else {
          if (modelYear !== parseInt(selectedYear)) return false;
        }
      }
    }

    // KMs Filter (Mocked for now as we don't have kms on models from API directly)
    // In a real scenario, this would filter by model.kmsDriven
    // if (selectedKms) { ... }

    return true
  })

  const toggleFilter = (type: 'fuel' | 'transmission', value: string) => {
    if (type === 'fuel') {
      setSelectedFuel(prev =>
        prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
      )
    } else {
      setSelectedTransmission(prev =>
        prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
      )
    }
  }

  return (
    <>
      {/* Filters Section */}
      <section className="bg-white pt-2 pb-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Top row: Fuel & Transmission pills + Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-3 border-b border-gray-200">
            {fuelFilters.map(fuel => (
              <button
                key={fuel}
                onClick={() => toggleFilter('fuel', fuel)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${selectedFuel.includes(fuel)
                  ? 'bg-[#291e6a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {fuel}
              </button>
            ))}
            {transmissionFilters.map(trans => (
              <button
                key={trans}
                onClick={() => toggleFilter('transmission', trans)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${selectedTransmission.includes(trans)
                  ? 'bg-[#291e6a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {trans}
              </button>
            ))}

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-gray-300 mx-1"></div>

            <FilterDropdown
              label="Price Range"
              options={priceRangeOptions}
              selected={selectedPriceRange}
              onChange={setSelectedPriceRange}
            />

            <FilterDropdown
              label="Kms Driven"
              options={kmsOptions}
              selected={selectedKms}
              onChange={setSelectedKms}
            />
          </div>

          {/* Bottom row: Reg Year Scroll */}
          <div className="pt-3">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <span className="text-xs sm:text-sm font-bold text-gray-700 whitespace-nowrap mr-1">Reg Year:</span>
              {yearOptions.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(selectedYear === year ? '' : year)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${selectedYear === year
                    ? 'bg-[#291e6a] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Car Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {models.length === 0 ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-500 text-lg">No models found for {brandName}</p>
              </div>
            ) : (
              filteredModels.map((car, index) => (
                <BrandCarCard key={car.id} car={car} index={index} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}
