'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronDown, Info, X, Pencil, Search, ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import PageContainer, { PageSection } from '../layout/PageContainer'
import analytics from '@/lib/analytics'
import { AnalyticsEvent } from '@/types/analytics'

import Breadcrumb from '@/components/common/Breadcrumb'



interface CarVariant {
  id: string
  name: string
  price: number
  transmission?: string
  fuelType?: string
}

interface CarModel {
  id: string
  name: string
  brand: string
  slug: string
  brandSlug: string
  image?: string
  startingPrice?: number
}

export default function EMICalculatorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Get URL parameters
  const brandParam = searchParams.get('brand') || ''
  const modelParam = searchParams.get('model') || ''
  const variantParam = searchParams.get('variant') || ''
  const priceParam = searchParams.get('price') || ''

  // State
  const [carPrice, setCarPrice] = useState(Number(priceParam) || 1358976)
  const [downPayment, setDownPayment] = useState(Math.round((Number(priceParam) || 1358976) * 0.2))
  const [tenure, setTenure] = useState(7)
  const [tenureMonths, setTenureMonths] = useState(84)
  const [interestRate, setInterestRate] = useState(8)

  // Analytics tracking for calculation
  useEffect(() => {
    // Debounce the tracking to avoid firing on every slider change
    const timer = setTimeout(() => {
      analytics.trackEvent(AnalyticsEvent.EMI_CALCULATED, {
        loan_amount: carPrice - downPayment,
        interest_rate: interestRate,
        tenure_years: tenure,
        timestamp: Date.now()
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [carPrice, downPayment, interestRate, tenure]);

  // Section visibility - all open by default
  const [showDownPayment, setShowDownPayment] = useState(true)
  const [showInterest, setShowInterest] = useState(true)

  // Car selection state
  const [showCarSearch, setShowCarSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CarModel[]>([])
  const [allModels, setAllModels] = useState<CarModel[]>([])
  const [modelsLoaded, setModelsLoaded] = useState(false)

  // Two-step selection
  const [selectionStep, setSelectionStep] = useState<'search' | 'variants'>('search')
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null)
  const [modelVariants, setModelVariants] = useState<CarVariant[]>([])
  const [loadingVariants, setLoadingVariants] = useState(false)

  // Selected car details
  const displayBrand = brandParam || 'Hyundai'
  const displayModel = modelParam || 'Creta'
  const displayVariant = variantParam || 'E Petrol MT'

  const [selectedCar, setSelectedCar] = useState({
    brand: displayBrand,
    model: displayModel,
    variant: displayVariant,
    fullName: `${displayBrand} ${displayModel} ${displayVariant}`,
    price: Number(priceParam) || 1358976
  })

  // Fetch models on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        const [brandsRes, modelsRes] = await Promise.all([
          fetch(`${API_URL}/api/brands`),
          fetch(`${API_URL}/api/models`)
        ])

        const brandsData = await brandsRes.json()
        const modelsData = await modelsRes.json()

        const brandMap = new Map()
        if (Array.isArray(brandsData)) {
          brandsData.forEach((brand: any) => {
            brandMap.set(brand.id, {
              name: brand.name,
              slug: brand.name.toLowerCase().replace(/\s+/g, '-')
            })
          })
        }

        if (Array.isArray(modelsData)) {
          setAllModels(modelsData.map((model: any) => {
            const brandInfo = brandMap.get(model.brandId) || { name: 'Unknown', slug: '' }
            return {
              id: model.id || model._id,
              name: model.name,
              brand: brandInfo.name,
              slug: model.slug || model.name?.toLowerCase().replace(/\s+/g, '-'),
              brandSlug: brandInfo.slug,
              image: model.heroImage || model.image,
              startingPrice: model.startingPrice || model.price || 1000000
            }
          }))
        }
        setModelsLoaded(true)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setModelsLoaded(true)
      }
    }
    fetchData()
  }, [])

  // Fetch variants for selected model - FIXED to use correct API endpoint
  const fetchVariantsForModel = async (model: CarModel) => {
    setLoadingVariants(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      // Use correct API endpoint: /api/variants?modelId=<id>
      const response = await fetch(`${API_URL}/api/variants?modelId=${model.id}`)
      const data = await response.json()

      if (Array.isArray(data) && data.length > 0) {
        setModelVariants(data.map((v: any) => ({
          id: v.id || v._id,
          name: v.name,
          price: v.exShowroomPrice || v.price || model.startingPrice || 1000000,
          transmission: v.transmission,
          fuelType: v.fuelType
        })))
      } else {
        setModelVariants([{ id: 'default', name: 'Base Variant', price: model.startingPrice || 1000000 }])
      }
    } catch {
      setModelVariants([{ id: 'default', name: 'Base Variant', price: model.startingPrice || 1000000 }])
    }
    setLoadingVariants(false)
  }

  // Filter models
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const query = searchQuery.toLowerCase()
    setSearchResults(allModels.filter(m =>
      m.name?.toLowerCase().includes(query) ||
      m.brand?.toLowerCase().includes(query) ||
      `${m.brand} ${m.name}`.toLowerCase().includes(query)
    ).slice(0, 10))
  }, [searchQuery, allModels])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowCarSearch(false)
        setSelectionStep('search')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectModel = (model: CarModel) => {
    setSelectedModel(model)
    setSelectionStep('variants')
    fetchVariantsForModel(model)
  }

  const handleSelectVariant = (variant: CarVariant) => {
    if (!selectedModel) return
    setSelectedCar({
      brand: selectedModel.brand,
      model: selectedModel.name,
      variant: variant.name,
      fullName: `${selectedModel.brand} ${selectedModel.name} ${variant.name}`,
      price: variant.price
    })
    setCarPrice(variant.price)
    setDownPayment(Math.round(variant.price * 0.2))
    setShowCarSearch(false)
    setSelectionStep('search')
    setSelectedModel(null)
    setSearchQuery('')
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate EMI
  const emiCalculation = useMemo(() => {
    const principal = carPrice - downPayment
    const monthlyRate = interestRate / 12 / 100
    const months = tenureMonths

    if (monthlyRate === 0) {
      return { emi: Math.round(principal / months), totalAmount: principal, totalInterest: 0, principal }
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const totalAmount = emi * months
    return { emi: Math.round(emi), totalAmount: Math.round(totalAmount), totalInterest: Math.round(totalAmount - principal), principal }
  }, [carPrice, downPayment, tenureMonths, interestRate])

  // Amortization table
  const amortizationTable = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100
    const table = []
    for (const month of [12, 24, 36, 48, 60, 72, 84]) {
      if (month <= tenureMonths) {
        let tempBalance = emiCalculation.principal
        let totalPrincipal = 0, totalInt = 0
        for (let i = 1; i <= month; i++) {
          const interest = tempBalance * monthlyRate
          const principalPaid = emiCalculation.emi - interest
          tempBalance -= principalPaid
          totalPrincipal += principalPaid
          totalInt += interest
        }
        // If this is the last period, set balance to 0 to avoid rounding errors
        const finalBalance = month === tenureMonths ? 0 : Math.round(Math.max(0, emiCalculation.principal - totalPrincipal))
        table.push({ months: month, principal: Math.round(totalPrincipal), interest: Math.round(totalInt), balance: finalBalance })
      }
    }
    return table
  }, [emiCalculation.principal, emiCalculation.emi, tenureMonths, interestRate])

  // Sync tenure months
  useEffect(() => { setTenureMonths(tenure * 12) }, [tenure])

  const loanAmount = carPrice - downPayment

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer maxWidth="md">
        <PageSection spacing="normal">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-base font-semibold text-gray-900">Choose your EMI options</h1>
                <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Car Selection */}
            <div className="p-4 border-b border-gray-200 relative" ref={searchRef}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Selected Car</p>
                  <p className="font-semibold text-gray-900">{selectedCar.brand} {selectedCar.model}</p>
                  <p className="text-sm text-gray-600">{selectedCar.variant}</p>
                </div>
                <button
                  onClick={() => { setShowCarSearch(!showCarSearch); setSelectionStep('search') }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#1c144a] border border-[#6b5fc7] rounded-lg hover:bg-[#f0eef5] transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Change
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCarSearch ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Search Dropdown */}
              {showCarSearch && (
                <div className="absolute left-4 right-4 top-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-30 p-3">
                  {selectionStep === 'search' ? (
                    <>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search car brand or model..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#291e6a] text-sm"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-gray-400 mb-2">Step 1: Select a model</p>
                      {searchQuery.length >= 2 && searchResults.length === 0 && modelsLoaded && (
                        <p className="text-center py-4 text-gray-500 text-sm">No cars found</p>
                      )}
                      {searchResults.length > 0 && (
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {searchResults.map(model => (
                            <button
                              key={model.id}
                              onClick={() => handleSelectModel(model)}
                              className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded text-left"
                            >
                              <p className="font-medium text-gray-900 text-sm">{model.brand} {model.name}</p>
                              <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                            </button>
                          ))}
                        </div>
                      )}
                      {searchQuery.length < 2 && <p className="text-center py-4 text-gray-400 text-sm">Type at least 2 characters</p>}
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setSelectionStep('search'); setSelectedModel(null) }} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1c144a] mb-3">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <p className="font-semibold text-gray-900 text-sm">{selectedModel?.brand} {selectedModel?.name}</p>
                        <p className="text-xs text-gray-500">Step 2: Select variant</p>
                      </div>
                      {loadingVariants ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#291e6a] mx-auto"></div>
                        </div>
                      ) : (
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {modelVariants.map(v => (
                            <button
                              key={v.id}
                              onClick={() => handleSelectVariant(v)}
                              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded border border-gray-100 text-left"
                            >
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{v.name}</p>
                                {(v.transmission || v.fuelType) && <p className="text-xs text-gray-500">{[v.fuelType, v.transmission].filter(Boolean).join(' • ')}</p>}
                              </div>
                              <p className="font-semibold text-[#1c144a] text-sm">{formatCurrency(v.price)}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* EMI Display Header - Refined */}
            <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(emiCalculation.emi)}</p>
                  <p className="text-xs text-gray-500 mt-1">Monthly EMI</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e8e6f0] text-[#1c144a] text-sm font-medium">
                    EMI For {tenure} Years
                  </span>
                </div>
              </div>
            </div>

            {/* Down Payment - Refined */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-900">
                  Down Payment: <span className="text-[#1c144a] font-bold">{formatCurrency(downPayment)}</span>
                </label>
                <button onClick={() => setShowDownPayment(!showDownPayment)} className="text-sm font-medium text-[#1c144a] hover:text-[#1c144a] transition-colors">
                  {showDownPayment ? 'Hide' : 'Show'}
                </button>
              </div>

              {showDownPayment && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>{formatCurrency(Math.round(carPrice * 0.2))}</span>
                    <span>{formatCurrency(carPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={Math.round(carPrice * 0.2)}
                    max={carPrice}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#291e6a]"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={downPayment}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      setDownPayment(val ? Number(val) : 0)
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291e6a] focus:border-transparent text-sm font-medium bg-gray-50"
                  />
                  <p className="text-sm text-gray-600">
                    Your loan amount will be: <span className="text-[#1c144a] font-semibold">{formatCurrency(loanAmount)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Tenure Section - Refined */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-900">Tenure</label>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-900">Interest</span>
                  <Info className="w-4 h-4 text-gray-400" />
                  <button onClick={() => setShowInterest(!showInterest)} className="text-sm text-[#1c144a] hover:text-[#1c144a] ml-2">
                    {showInterest ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-5">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>1 year</span>
                    <span>7 years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#291e6a]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>8%</span>
                    <span>20%</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={20}
                    step={0.5}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#291e6a]"
                  />
                </div>
              </div>

              {/* Input Boxes - Refined */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-2">Years</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={tenure}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      const num = val ? Math.min(7, Math.max(1, Number(val))) : 1
                      setTenure(num)
                    }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291e6a] focus:border-transparent text-sm text-center font-medium bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-2">Months</label>
                  <div className="px-3 py-2.5 border-2 border-[#6b5fc7] rounded-lg bg-[#f0eef5] text-sm text-center text-[#1c144a] font-bold">
                    {tenureMonths}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-2">Interest %</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={interestRate}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '')
                      const num = val ? Math.min(20, Math.max(5, Number(val))) : 8
                      setInterestRate(num)
                    }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291e6a] focus:border-transparent text-sm text-center font-medium bg-gray-50"
                  />
                </div>
              </div>
            </div>



            {/* Amortization Table - Refined */}
            <div className="p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Payment Schedule</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 font-semibold text-gray-700">Months</th>
                    <th className="text-right py-3 font-semibold text-gray-700">Principal</th>
                    <th className="text-right py-3 font-semibold text-gray-700">Interest</th>
                    <th className="text-right py-3 font-semibold text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {amortizationTable.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-gray-900 font-medium">{row.months}</td>
                      <td className="py-3 text-right text-gray-700">{formatCurrency(row.principal)}</td>
                      <td className="py-3 text-right text-[#1c144a]">{formatCurrency(row.interest)}</td>
                      <td className="py-3 text-right text-gray-900 font-medium">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer - NEW */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Total Interest:</span>
                  <span className="font-semibold text-[#1c144a]">{formatCurrency(emiCalculation.totalInterest)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(emiCalculation.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Know Your Loan Eligibility */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-2">Know Your Loan Eligibility</h3>
              <p className="text-sm text-gray-600 mb-4">Buy your dream car with easy online offers in 3 simple steps</p>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Step 1 - Get Started</h4>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">FULL NAME</label>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#291e6a] text-sm">
                      <option>Mr</option>
                      <option>Mrs</option>
                      <option>Ms</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Full Name as per PAN card"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#291e6a] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">MOBILE*</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l text-sm">+91</span>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      maxLength={10}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-1 focus:ring-[#291e6a] text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">An OTP will be sent to you for verification</p>
                </div>
              </div>
            </div>

            {/* Get Loan Offers Button - FIXED: Orange theme instead of teal */}
            <div className="p-4">
              <button className="w-full bg-[#1c144a] hover:bg-[#1c144a] text-white font-semibold py-3 rounded transition-colors">
                Get Eligible Loan Offers
              </button>
              <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
                By proceeding ahead you agree to assadmotors <Link href="/visitor-agreement" className="text-[#1c144a] hover:underline">Visitor Agreement</Link> and <Link href="/terms-and-conditions" className="text-[#1c144a] hover:underline">Terms and Conditions</Link>. This site is protected by reCAPTCHA and Google <Link href="/google-terms" className="text-[#1c144a] hover:underline">terms of service</Link> apply.
              </p>
            </div>

            {/* SEO Content */}
            <div className="mt-8 border-t border-gray-200 p-6 md:p-8 bg-gray-50/50">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Guide to Car Loan EMI Calculation</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Buying a new car is an exciting milestone, but financial planning is key to a stress-free ownership experience.
                  The assadmotors Car Loan EMI Calculator is designed to help you plan your finances effectively.
                  By estimating your monthly Equated Monthly Installment (EMI), you can choose a loan amount and tenure that fits your budget comfortably.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our advanced calculator considers key factors like the car's on-road price, your down payment, interest rate, and loan tenure to give you an accurate EMI figure.
                  It also provides a detailed amortization schedule, showing you exactly how much interest you'll pay over the life of the loan.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Key Factors Affecting Your Car Loan EMI</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">1. Loan Amount (Principal)</h4>
                    <p className="text-sm text-gray-600">The total amount you borrow from the bank. A higher down payment reduces the principal, thereby lowering your EMI and total interest outgo.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">2. Interest Rate</h4>
                    <p className="text-sm text-gray-600">The rate at which the bank lends you money. Even a small difference of 0.5% can significantly impact your total repayment amount over a long tenure.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">3. Loan Tenure</h4>
                    <p className="text-sm text-gray-600">The duration of your loan. Longer tenure (e.g., 7 years) means lower monthly EMIs but higher total interest payment. Shorter tenure means higher EMIs but you become debt-free sooner.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">4. Credit Score</h4>
                    <p className="text-sm text-gray-600">A high credit score (750+) can help you negotiate better interest rates with lenders, directly reducing your EMI burden.</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Benefits of Using an EMI Calculator</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="min-w-1.5 h-1.5 rounded-full bg-[#291e6a] mt-2"></div>
                    <p><strong className="text-gray-900">Financial Planning:</strong> Gives you a clear picture of your monthly outflow, helping you budget for other expenses.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-1.5 h-1.5 rounded-full bg-[#291e6a] mt-2"></div>
                    <p><strong className="text-gray-900">Compare Options:</strong> You can experiment with different loan amounts, tenures, and interest rates to find the combination that works best for you.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-1.5 h-1.5 rounded-full bg-[#291e6a] mt-2"></div>
                    <p><strong className="text-gray-900">Negotiation Tool:</strong> Knowing the exact EMI and interest breakdown helps you negotiate better terms with car dealers and banks.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-1.5 h-1.5 rounded-full bg-[#291e6a] mt-2"></div>
                    <p><strong className="text-gray-900">Avoid Payment Shocks:</strong> Helps you ensure you don't commit to an EMI that strains your monthly finances.</p>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <details className="group border-b border-gray-200 pb-4">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-[#1c144a]">
                      <span>How is car loan EMI calculated?</span>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 text-sm">The formula used is: <strong>E = [P x R x (1+R)^N] / [(1+R)^N-1]</strong><br />Where E is EMI, P is Principal Loan Amount, R is monthly interest rate, and N is loan tenure in months.</p>
                  </details>
                  <details className="group border-b border-gray-200 pb-4">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-[#1c144a]">
                      <span>Can I pay off my car loan early?</span>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 text-sm">Yes, most banks allow prepayment or foreclosure of car loans. However, many lenders charge a foreclosure fee (usually 3-5% of the outstanding principal) if you close the loan before the tenure ends. Some banks offer zero foreclosure charges after a specific period (e.g., 2 years).</p>
                  </details>
                  <details className="group border-b border-gray-200 pb-4">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-[#1c144a]">
                      <span>Is a down payment mandatory?</span>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 text-sm">While some banks offer 100% financing on the ex-showroom price for eligible customers, you typically still need to pay for registration, insurance, and accessories as a down payment. Making a larger down payment (20% or more) is recommended to reduce your interest burden.</p>
                  </details>
                  <details className="group border-b border-gray-200 pb-4">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-[#1c144a]">
                      <span>Fixed vs Floating Interest Rate: Which is better?</span>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 text-sm">Most car loans in India come with fixed interest rates, meaning your EMI remains constant throughout the tenure. This safeguards you from market fluctuations and makes budgeting easier. Floating rates are rarer for auto loans.</p>
                  </details>
                </div>
              </section>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Explore More Tools</h3>
                <div className="flex flex-wrap gap-4">
                  <Link href="/fuel-cost-calculator" className="text-sm font-medium text-[#1c144a] hover:text-[#1c144a] flex items-center gap-1">
                    Fuel Cost Calculator <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>

                  <Link href="/location" className="text-sm font-medium text-[#1c144a] hover:text-[#1c144a] flex items-center gap-1">
                    Check On-Road Price <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </PageSection>
      </PageContainer>

      <Breadcrumb items={[{ label: 'EMI Calculator' }]} />
    </div >
  )
}
