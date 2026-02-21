'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Share2, Heart, Calendar, Fuel, Users, Landmark, Check, ChevronRight, Info, Award, Gauge, Shield, Zap, TrendingUp, MessageSquare } from 'lucide-react'
import { formatPrice } from '@/utils/priceFormatter'
import PageSection from '../common/PageSection'
import AdBanner from '../home/AdBanner'
import Ad3DCarousel from '../ads/Ad3DCarousel'
import Footer from '../Footer'
import Breadcrumb from '../common/Breadcrumb'
import VariantCard from '../car-model/VariantCard'
import CarCard from '../home/CarCard'
import ModelOwnerReviews from '../car-model/ModelOwnerReviews'
import CarExpertBanner from '../CarExpertBanner'
import EmbeddedEMICalculator from './EmbeddedEMICalculator'
import CityPriceGrid from './CityPriceGrid'
import { OptimizedImage } from '../common/OptimizedImage'
import TestDriveBottomBar from '../common/TestDriveBottomBar'
import LeadFormModal from '../common/LeadFormModal'



// Helper function to format price in Indian numbering system
const formatIndianPrice = (price: number): string => {
  return price.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })
}

// Helper function to format launch date
const formatLaunchDate = (date: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const parts = date.split('-')
  if (parts.length === 2) {
    const year = parts[0]
    const monthIndex = parseInt(parts[1]) - 1
    return `${months[monthIndex]} ${year}`
  }
  return date
}

// Helper function to normalize variant names for matching - moved outside component for SSR initialization
const normalizeForMatch = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s*\(([^)]*)\)/g, '-$1-') // Extract content from parentheses: "S (O)" -> "s-o-"
    .replace(/[()]/g, '')  // Remove any remaining parentheses
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric except hyphens
    .replace(/-+/g, '-')   // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

// Helper to find lowest price variant from array
const findLowestPriceVariant = (variants: any[]) => {
  if (!variants || variants.length === 0) return null
  return variants.reduce((lowest, current) =>
    (current.price < lowest.price) ? current : lowest, variants[0]
  )
}

interface PriceBreakupPageProps {
  brandSlug?: string
  modelSlug?: string
  citySlug?: string
  // SSR initial data
  initialBrand?: any
  initialModel?: any
  initialVariants?: any[]
  initialSimilarCars?: any[]
  initialPopularCars?: any[]
}

export default function PriceBreakupPage({
  brandSlug,
  modelSlug,
  citySlug,
  initialBrand,
  initialModel,
  initialVariants = [],
  initialSimilarCars = [],
  initialPopularCars = []
}: PriceBreakupPageProps = {}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showVariantDropdown, setShowVariantDropdown] = useState(false)
  const variantDropdownRef = useRef<HTMLDivElement>(null)

  // Get URL parameters - support both new slug-based URLs and old query params
  const getBrandName = () => {
    if (brandSlug) {
      // Convert slug to display name: "honda" -> "Honda"
      return brandSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }
    return searchParams.get('brand') || 'Honda'
  }

  const getModelName = () => {
    if (modelSlug) {
      // Convert slug to display name: "elevate" -> "Elevate"
      return modelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }
    return searchParams.get('model') || 'Elevate'
  }

  const getCityName = () => {
    if (citySlug) {
      // Convert slug to display name: "bangalore" -> "Bangalore, Karnataka"
      const cityMap: { [key: string]: string } = {
        'mumbai': 'Mumbai, Maharashtra',
        'delhi': 'Delhi, NCR',
        'bangalore': 'Bangalore, Karnataka',
        'bengaluru': 'Bangalore, Karnataka',
        'chennai': 'Chennai, Tamil Nadu',
        'hyderabad': 'Hyderabad, Telangana',
        'pune': 'Pune, Maharashtra',
        'kolkata': 'Kolkata, West Bengal',
        'ahmedabad': 'Ahmedabad, Gujarat',
        'jaipur': 'Jaipur, Rajasthan'
      }
      return cityMap[citySlug.toLowerCase()] || `${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)}, India`
    }
    return searchParams.get('city') || 'Mumbai, Maharashtra'
  }

  const brandName = getBrandName()
  const modelName = getModelName()
  const variantParam = searchParams.get('variant')
  const [selectedCity, setSelectedCity] = useState(() => getCityName())

  // Initialize selectedVariantName from SSR data immediately (no waiting for useEffect)
  const [selectedVariantName, setSelectedVariantName] = useState<string>(() => {
    if (initialVariants && initialVariants.length > 0) {
      // Try to match variant from URL param first
      if (variantParam) {
        const normalizedParam = normalizeForMatch(variantParam)
        const matched = initialVariants.find((v: any) =>
          normalizeForMatch(v.name) === normalizedParam
        )
        if (matched) return matched.name
        // Try partial match
        const partial = initialVariants.find((v: any) => {
          const normalized = normalizeForMatch(v.name)
          return normalized.includes(normalizedParam) || normalizedParam.includes(normalized)
        })
        if (partial) return partial.name
      }
      // Fallback to lowest price variant
      const lowest = findLowestPriceVariant(initialVariants)
      return lowest?.name || ''
    }
    return ''
  })
  const [activeSection, setActiveSection] = useState('overview')

  // Effect to read variant from localStorage on mount (for clean URL support)
  useEffect(() => {
    // Only verify localStorage if NOT using a specific URL param variant
    if (!variantParam) {
      const storedVariant = localStorage.getItem('priceBreakupVariant')
      if (storedVariant && initialVariants && initialVariants.length > 0) {
        // Verify it exists in the list
        const exists = initialVariants.some((v: any) => v.name === storedVariant)
        if (exists) {
          console.log('✅ Restoring variant from local storage:', storedVariant)
          setSelectedVariantName(storedVariant)
          // Optional: Clear it so it doesn't persist forever? 
          // Keeping it might be better for consistent refresh behavior.
        } else {
          // Try partial matching if exact match fails (e.g. normalization differences)
          const partial = initialVariants.find((v: any) => v.name.includes(storedVariant) || storedVariant.includes(v.name))
          if (partial) {
            console.log('✅ Restoring variant from local storage (partial match):', partial.name)
            setSelectedVariantName(partial.name)
          }
        }
      }
    }
  }, [initialVariants, variantParam])

  // Section navigation data
  const sections = [
    { id: 'overview', name: 'Overview' },
    { id: 'price-breakup', name: 'Price Breakup' },
    { id: 'emi', name: 'EMI' },
    { id: 'variants', name: 'Variants' },
    { id: 'similar-cars', name: 'Similar Cars' },
    { id: 'popular-cars', name: 'Popular Cars' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'faq', name: 'FAQ' },
    { id: 'summary', name: 'Buying Guide' },
    { id: 'dealers', name: 'Dealers' },
    { id: 'feedback', name: 'Feedback' }
  ]

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 60 // Height of sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Update active section after scroll
      setTimeout(() => setActiveSection(sectionId), 100)
    }
  }

  // Scroll spy - update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for better UX

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section) {
          const sectionTop = section.offsetTop
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i].id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update city when citySlug prop changes
  useEffect(() => {
    console.log('🔍 citySlug changed:', citySlug)
    const cityMap: { [key: string]: string } = {
      'mumbai': 'Mumbai, Maharashtra',
      'delhi': 'Delhi, NCR',
      'bangalore': 'Bangalore, Karnataka',
      'bengaluru': 'Bangalore, Karnataka',
      'chennai': 'Chennai, Tamil Nadu',
      'hyderabad': 'Hyderabad, Telangana',
      'pune': 'Pune, Maharashtra',
      'kolkata': 'Kolkata, West Bengal',
      'ahmedabad': 'Ahmedabad, Gujarat',
      'jaipur': 'Jaipur, Rajasthan'
    }

    if (citySlug) {
      const newCity = cityMap[citySlug.toLowerCase()] || `${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)}, India`
      console.log('✅ Setting city to:', newCity)
      setSelectedCity(newCity)
    }
  }, [citySlug])

  // Variants state - Use multi-select filters like VariantPage
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All'])
  const [modelVariants, setModelVariants] = useState<any[]>(initialVariants)
  const [loadingVariants, setLoadingVariants] = useState(initialVariants.length === 0)
  const [showAllVariants, setShowAllVariants] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  // Popular cars state
  const [popularCars, setPopularCars] = useState<any[]>(initialPopularCars)
  const [loadingPopularCars, setLoadingPopularCars] = useState(initialPopularCars.length === 0)

  // On-Road Price Calculation - Calculate immediately from SSR data
  const initialPriceBreakup = useMemo(() => {
    if (!selectedVariantName || !initialVariants || initialVariants.length === 0) return null
    const variant = initialVariants.find((v: any) => v.name === selectedVariantName)
    if (!variant) return null
    const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'
    const fuelType = variant.fuel || variant.fuelType || 'Petrol'
    console.log('⚡ Instant SSR price calculation:', { variant: variant.name, price: variant.price, state, fuel: fuelType })
    return {
      totalOnRoadPrice: variant.price,
      state,
      fuelType: fuelType.split(",")[0],
      exShowroomPrice: variant.price,
      rtoCharges: 0,
      roadSafetyTax: 0,
      insurance: 0,
      tcs: 0,
      otherCharges: 0,
      hypothecation: 0,
      fasTag: 0
    }
  }, [selectedVariantName, selectedCity, initialVariants])

  interface OnRoadPriceBreakup {
    totalOnRoadPrice: number;
    state: string;
    fuelType: string;
    exShowroomPrice: number;
    rtoCharges: number;
    roadSafetyTax: number;
    insurance: number;
    tcs: number;
    otherCharges: number;
    hypothecation: number;
    fasTag: number;
  }

  const [priceBreakup, setPriceBreakup] = useState<OnRoadPriceBreakup | null>(initialPriceBreakup)
  const [isTextExpanded, setIsTextExpanded] = useState(false)

  // Calculate EMI for display (20% down, 7 years, 8% interest)
  const calculateDisplayEMI = (price: number) => {
    const downPayment = price * 0.2
    const principal = price - downPayment
    const monthlyRate = 8 / 12 / 100
    const months = 7 * 12

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)

    return Math.round(emi)
  }

  const displayEMI = priceBreakup ? calculateDisplayEMI(priceBreakup.totalOnRoadPrice) : 0

  // Hero image - use SSR data if available
  const [heroImage, setHeroImage] = useState<string>(() => {
    return initialModel?.heroImage || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop'
  })

  // Model and Brand data - initialize from SSR props
  const [model, setModel] = useState<any>(initialModel || null)
  const [brand, setBrand] = useState<any>(initialBrand || null)

  // Fetch model, brand, and variants from backend - SKIP if SSR data exists
  useEffect(() => {
    // Skip fetch if we have SSR data
    if (initialVariants && initialVariants.length > 0 && initialModel) {
      console.log('✅ Using SSR data, skipping client-side fetch. Variants:', initialVariants.length)
      setLoadingVariants(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoadingVariants(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

        console.log('🔍 PriceBreakup: Fetching data for:', { brandName, modelName, variantParam })

        // Fetch all models to find the current model
        const modelsRes = await fetch(`${backendUrl}/api/models`)
        const models = await modelsRes.json()

        // Find the model by name (case-insensitive)
        const foundModel = models.find((m: any) =>
          m.name.toLowerCase() === modelName.toLowerCase()
        )

        if (foundModel) {
          setModel(foundModel)

          // Fetch hero image - OptimizedImage will handle resolution
          if (foundModel.heroImage) {
            setHeroImage(foundModel.heroImage)
          } else {
            console.warn('⚠️ No hero image found for model:', foundModel.name)
          }

          // Fetch variants for this model - use full=true to get keyFeatures and power
          const variantsRes = await fetch(`${backendUrl}/api/variants?modelId=${foundModel.id}&full=true`)
          const variants = await variantsRes.json()

          console.log('✅ Fetched variants:', variants.length)

          // Transform variants to match the expected format
          const transformedVariants = variants.map((v: any) => ({
            id: v.id,
            name: v.name,
            fuel: v.fuel || v.fuelType || 'Petrol',
            transmission: v.transmission || 'Manual',
            power: v.maxPower || v.power || '',
            keyFeatures: v.keyFeatures || [],
            features: Array.isArray(v.keyFeatures) ? v.keyFeatures.join(', ') : (v.keyFeatures || ''),
            price: v.price // Keep in rupees for exact calculation
          }))

          setModelVariants(transformedVariants)

          // Set default variant: use URL param if provided, otherwise lowest price variant
          if (variantParam) {
            // Enhanced normalize function to handle all edge cases
            // MUST match the normalization in VariantPage.tsx exactly
            const normalizeForMatch = (str: string) =>
              str
                .toLowerCase()
                .replace(/\s*\(([^)]*)\)/g, '-$1-') // Extract content from parentheses: "S (O)" -> "s-o-"
                .replace(/[()]/g, '')  // Remove any remaining parentheses
                .replace(/\s+/g, '-')  // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric except hyphens
                .replace(/-+/g, '-')   // Replace multiple consecutive hyphens with single hyphen
                .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

            const normalizedParam = normalizeForMatch(variantParam)

            console.log('🔍 Variant matching - Input:', {
              variantParam,
              normalizedParam
            })

            // Try to find match by comparing normalized versions
            const matchedVariant = transformedVariants.find((v: any) => {
              const normalizedVariantName = normalizeForMatch(v.name)
              const isMatch = normalizedVariantName === normalizedParam

              if (isMatch) {
                console.log('✅ MATCH FOUND:', {
                  original: v.name,
                  normalized: normalizedVariantName,
                  urlParam: normalizedParam
                })
              }

              return isMatch
            })

            console.log('🔍 Variant matching - Results:', {
              variantParam,
              normalizedParam,
              matchedVariant: matchedVariant?.name,
              allVariants: transformedVariants.map((v: any) => ({
                name: v.name,
                normalized: normalizeForMatch(v.name),
                matches: normalizeForMatch(v.name) === normalizedParam
              }))
            })

            if (matchedVariant) {
              setSelectedVariantName(matchedVariant.name)
              console.log('✅ Successfully matched variant from URL:', matchedVariant.name)
            } else {
              // Fallback: Try partial matching if exact match fails
              const partialMatch = transformedVariants.find((v: any) => {
                const normalizedName = normalizeForMatch(v.name)
                return normalizedName.includes(normalizedParam) || normalizedParam.includes(normalizedName)
              })

              if (partialMatch) {
                setSelectedVariantName(partialMatch.name)
                console.log('✅ Matched variant using partial match:', partialMatch.name)
              } else {
                // Final fallback to lowest price variant if no match found
                const lowestPriceVariant = transformedVariants.reduce((lowest: any, current: any) => {
                  return (current.price < lowest.price) ? current : lowest
                }, transformedVariants[0])
                setSelectedVariantName(lowestPriceVariant?.name || '')
                console.warn('⚠️ No variant match found, using lowest price:', lowestPriceVariant?.name, {
                  searchedFor: normalizedParam,
                  availableVariants: transformedVariants.map((v: any) => normalizeForMatch(v.name))
                })
              }
            }
          } else {
            // Find lowest price variant
            const lowestPriceVariant = transformedVariants.reduce((lowest: any, current: any) => {
              return (current.price < lowest.price) ? current : lowest
            }, transformedVariants[0])

            setSelectedVariantName(lowestPriceVariant?.name || '')
            console.log('🎯 Auto-selected lowest price variant:', lowestPriceVariant?.name, '₹', lowestPriceVariant?.price)
          }
        }

        setLoadingVariants(false)
      } catch (error) {
        console.error('❌ Error fetching data:', error)
        setLoadingVariants(false)
      }
    }

    fetchData()
  }, [brandName, modelName, variantParam, initialVariants, initialModel])

  // Fetch popular cars from backend - using same /api/cars/popular as home page
  useEffect(() => {
    // Skip fetching if SSR data exists
    if (initialPopularCars && initialPopularCars.length > 0) {
      console.log('✅ Using SSR data for Popular Cars. Count:', initialPopularCars.length)
      setLoadingPopularCars(false)
      return
    }

    const fetchPopularCars = async () => {
      try {
        setLoadingPopularCars(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

        // Fetch brands to check active status
        const [popularRes, brandsRes] = await Promise.all([
          fetch(`${backendUrl}/api/cars/popular?limit=20`), // Fetch more to allow for filtering
          fetch(`${backendUrl}/api/brands`)
        ])

        if (!popularRes.ok || !brandsRes.ok) {
          console.error('Failed to fetch popular cars or brands')
          setPopularCars([])
          setLoadingPopularCars(false)
          return
        }

        const popularData = await popularRes.json()
        const brands = await brandsRes.json()


        // Create map of active brand IDs and names
        const activeBrandIds = new Set(
          brands
            .filter((b: any) => b.status === 'active')
            .map((b: any) => b.id)
        )
        const activeBrandNames = new Set(
          brands
            .filter((b: any) => b.status === 'active')
            .map((b: any) => b.name)
        )

        // Process popular cars - filter by active brand (check both ID and name)
        const processedCars = Array.isArray(popularData) ? popularData
          .filter((car: any) => activeBrandIds.has(car.brandId) || activeBrandNames.has(car.brandName) || activeBrandNames.has(car.brand)) // Only show active brands
          .slice(0, 10) // Limit to 10 after filtering
          .map((car: any) => ({
            id: car.id,
            name: car.name,
            brand: car.brandId,
            brandName: car.brandName,
            image: car.image || '',
            startingPrice: car.startingPrice,
            fuelTypes: car.fuelTypes || ['Petrol'],
            transmissions: car.transmissions || ['Manual'],
            seating: car.seating || 5,
            launchDate: car.launchDate ? `Launched ${formatLaunchDate(car.launchDate)}` : 'Launched',
            slug: `${car.brandName.toLowerCase().replace(/\s+/g, '-')}-${car.name.toLowerCase().replace(/\s+/g, '-')}`,
            isNew: car.isNew || false,
            isPopular: car.isPopular || true,
            popularRank: car.popularRank || null
          })) : []

        setPopularCars(processedCars)
      } catch (error) {
        console.error('Error fetching popular cars:', error)
      } finally {
        setLoadingPopularCars(false)
      }
    }

    fetchPopularCars()
  }, [])

  const mockVariants = [
    'V Apex Summer Edition',
    'VX',
    'ZX',
    'ZX CVT'
  ]
  const mockCities = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Chennai, Tamil Nadu'
  ]

  // Similar cars data - using exact same logic as CarModelPage
  const [similarCars, setSimilarCars] = useState<any[]>(initialSimilarCars)
  const [loadingSimilarCars, setLoadingSimilarCars] = useState(initialSimilarCars.length === 0)

  // Helper function to format launch date (same as CarModelPage)
  const formatLaunchDateForSimilar = (date: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const parts = date.split('-')
    if (parts.length === 2) {
      const year = parts[0]
      const monthIndex = parseInt(parts[1]) - 1
      return `${months[monthIndex]} ${year}`
    }
    return date
  }

  // Fetch similar cars using exact same logic as CarModelPage
  useEffect(() => {
    // Skip fetching if SSR data exists
    if (initialSimilarCars && initialSimilarCars.length > 0) {
      console.log('✅ Using SSR data for Similar Cars. Count:', initialSimilarCars.length)
      setLoadingSimilarCars(false)
      return
    }

    const fetchSimilarCars = async () => {
      if (!model?.id) {
        setSimilarCars([])
        setLoadingSimilarCars(false)
        return
      }

      try {
        setLoadingSimilarCars(true)
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

        // Fetch models with pricing (matches CarModelPage) and brands
        const [modelsRes, brandsRes] = await Promise.all([
          fetch(`${backendUrl}/api/models-with-pricing?limit=20`), // Fetch more to allow for filtering
          fetch(`${backendUrl}/api/brands`)
        ])

        if (!modelsRes.ok || !brandsRes.ok) {
          console.error('Failed to fetch similar cars data')
          setSimilarCars([])
          setLoadingSimilarCars(false)
          return
        }

        const modelsData = await modelsRes.json()
        const brands = await brandsRes.json()

        const models = modelsData.data || modelsData || []

        // Create a map of active brand IDs and names
        const activeBrandIds = new Set<string>()
        const brandMap = brands.reduce((acc: Record<string, string>, brand: any) => {
          // Only add to active set if status is active (default to active for safety if missing)
          const isActive = brand.status === 'active' || !brand.status
          if (isActive) {
            activeBrandIds.add(brand.id)
            if (brand._id) activeBrandIds.add(brand._id)
          }

          acc[brand.id] = brand.name
          if (brand._id) acc[brand._id] = brand.name
          return acc
        }, {})

        // Process each model - filter by active brand and valid price
        const processedCars = models
          .filter((m: any) => {
            // Exclude current model
            if (m.id === model.id) return false
            // Check active brand
            if (!activeBrandIds.has(m.brandId)) return false
            // Exclude invalid prices (less than 1 Lakh = 100000)
            const price = m.lowestPrice || m.price || 0
            if (price <= 100000) return false
            return true
          })
          .slice(0, 10) // Limit to 10 similar cars after filtering
          .map((m: any) => {
            // Use model's lowestPrice directly from API if available, else usage price
            const lowestPrice = m.lowestPrice || m.price || 0

            // Get hero image - OptimizedImage will handle direct resolution
            const heroImage = m.heroImage || ''

            return {
              id: m.id,
              name: m.name,
              brand: m.brandId,
              brandName: brandMap[m.brandId] || m.brandName || 'Unknown',
              image: heroImage,
              startingPrice: lowestPrice,
              fuelTypes: m.fuelTypes && m.fuelTypes.length > 0 ? m.fuelTypes : ['Petrol'],
              transmissions: m.transmissions && m.transmissions.length > 0 ? m.transmissions : ['Manual'],
              seating: m.seating || 5,
              launchDate: m.launchDate ? `Launched ${formatLaunchDateForSimilar(m.launchDate)}` : 'Launched',
              slug: `${(brandMap[m.brandId] || m.brandName || '').toLowerCase().replace(/\s+/g, '-')}-${m.name.toLowerCase().replace(/\s+/g, '-')}`,
              isNew: m.isNew || false,
              isPopular: m.isPopular || false,
              popularRank: m.popularRank || null
            }
          })

        setSimilarCars(processedCars)
        setLoadingSimilarCars(false)
      } catch (error) {
        console.error('Error fetching similar cars:', error)
        setSimilarCars([])
        setLoadingSimilarCars(false)
      }
    }

    fetchSimilarCars()
  }, [model?.id])


  // Use real variants from backend, fallback to empty array if loading
  const allVariants = modelVariants

  // Helper function to check if transmission is automatic type
  const isAutomaticTransmission = (transmission: string) => {
    const automaticTypes = ['automatic', 'cvt', 'amt', 'dct', 'torque converter', 'dual clutch']
    return automaticTypes.some(type => transmission.toLowerCase().includes(type))
  }

  // Helper function to check if transmission is manual type
  const isManualTransmission = (transmission: string) => {
    return transmission.toLowerCase().includes('manual') ||
      (transmission.toLowerCase() === 'mt') ||
      (!isAutomaticTransmission(transmission) && transmission.toLowerCase() !== '')
  }

  // Generate dynamic filters based on available variants - matches VariantPage
  const getDynamicFilters = () => {
    const filters = ['All']
    const fuelTypes = new Set<string>()
    let hasAutomatic = false
    let hasManual = false

    allVariants.forEach(variant => {
      if (variant.fuel) fuelTypes.add(variant.fuel)
      if (variant.transmission) {
        if (isAutomaticTransmission(variant.transmission)) {
          hasAutomatic = true
        }
        if (isManualTransmission(variant.transmission)) {
          hasManual = true
        }
      }
    })

    // Add fuel types first
    fuelTypes.forEach(fuel => filters.push(fuel))

    // Add transmission types (Manual before Automatic like VariantPage)
    if (hasManual) filters.push('Manual')
    if (hasAutomatic) filters.push('Automatic')

    return filters
  }

  const availableFilters = getDynamicFilters()

  // Filter variants based on selected filters (multi-select like VariantPage)
  const getFilteredVariants = () => {
    if (selectedFilters.includes('All')) {
      return allVariants
    }

    return allVariants.filter(variant => {
      // Check if variant matches any of the selected filters
      const matchesFuel = selectedFilters.some(filter =>
        ['Petrol', 'Diesel', 'CNG', 'Electric'].includes(filter) && variant.fuel === filter
      )
      const matchesAutomatic = selectedFilters.includes('Automatic') &&
        variant.transmission && isAutomaticTransmission(variant.transmission)
      const matchesManual = selectedFilters.includes('Manual') &&
        variant.transmission && isManualTransmission(variant.transmission)

      return matchesFuel || matchesAutomatic || matchesManual
    })
  }

  const filteredVariants = getFilteredVariants()

  // Handle filter toggle (multi-select) - Exact copy from VariantPage
  const handleFilterToggle = (filter: string) => {
    if (filter === 'All') {
      setSelectedFilters(['All'])
    } else {
      setSelectedFilters(prev => {
        // Remove 'All' if selecting a specific filter
        const withoutAll = prev.filter(f => f !== 'All')

        // Toggle the clicked filter
        if (withoutAll.includes(filter)) {
          const newFilters = withoutAll.filter(f => f !== filter)
          // If no filters left, select 'All'
          return newFilters.length === 0 ? ['All'] : newFilters
        } else {
          return [...withoutAll, filter]
        }
      })
    }
  }

  const handleVariantClick = (variant: any) => {
    const brandSlug = brandName?.toLowerCase().replace(/\s+/g, '-')
    const modelSlug = modelName?.toLowerCase().replace(/\s+/g, '-')
    const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-')
    router.push(`/${brandSlug}-cars/${modelSlug}/${variantSlug}`)
  }

  // Note: Model image is now fetched in the main fetchData useEffect above
  // This separate useEffect is no longer needed as it duplicates the logic

  // Listen for city changes from localStorage (when user returns from location page)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCity = localStorage.getItem('selectedCity')
      if (savedCity && savedCity !== selectedCity) {
        setSelectedCity(savedCity)
        // Update URL with new city
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-')
        const modelSlug = modelName.toLowerCase().replace(/\s+/g, '-')
        const citySlug = savedCity.split(',')[0].toLowerCase().replace(/\s+/g, '-')
        router.push(`/${brandSlug}-cars/${modelSlug}/price-in-${citySlug}`)
      }
    }

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange)

    // Check on mount
    handleStorageChange()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Calculate On-Road Price when variant or city changes
  useEffect(() => {
    // Only calculate if we have variants loaded and a selected variant
    if (allVariants.length === 0 || !selectedVariantName) {
      console.log('⏳ Waiting for variants to load...', {
        variantsCount: allVariants.length,
        selectedVariantName
      })
      return
    }

    // Find the selected variant from allVariants
    const selectedVariant = allVariants.find(v => v.name === selectedVariantName)

    if (selectedVariant) {
      // Price is already in rupees from backend (e.g., 1201150)
      const exShowroomPrice = selectedVariant.price

      console.log('💰 Calculating on-road price:', {
        variant: selectedVariantName,
        exShowroomPrice,
        city: selectedCity
      })

      // Extract state from city (e.g., "Mumbai, Maharashtra" -> "Maharashtra")
      const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'

      // Get fuel type
      const fuelType = selectedVariant.fuel || 'Petrol'

      // Calculate the breakup mock
      const breakup: OnRoadPriceBreakup = {
        totalOnRoadPrice: exShowroomPrice,
        state,
        fuelType,
        exShowroomPrice: exShowroomPrice,
        rtoCharges: 0,
        roadSafetyTax: 0,
        insurance: 0,
        tcs: 0,
        otherCharges: 0,
        hypothecation: 0,
        fasTag: 0
      }
      setPriceBreakup(breakup)
    } else {
      console.warn('⚠️ Variant not found:', selectedVariantName, 'Available:', allVariants.map(v => v.name))
    }
  }, [selectedVariantName, selectedCity, allVariants])

  // FAQ toggle function
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  // Dynamic FAQ data with city-specific questions
  const cityName = selectedCity.split(',')[0]
  const lowestPriceVariant = modelVariants.length > 0
    ? modelVariants.reduce((a, b) => a.price < b.price ? a : b)
    : null
  const highestPriceVariant = modelVariants.length > 0
    ? modelVariants.reduce((a, b) => a.price > b.price ? a : b)
    : null

  const faqs = [
    {
      question: `Q: What is the on-road price of ${brandName} ${modelName} in ${cityName}?`,
      answer: priceBreakup
        ? `The on-road price of ${brandName} ${modelName} in ${cityName} starts at ₹${formatIndianPrice(priceBreakup.totalOnRoadPrice)} for the ${selectedVariantName} variant. This includes ex-showroom price, RTO charges, insurance, and other applicable fees.`
        : `The on-road price of ${brandName} ${modelName} in ${cityName} varies by variant. Please select a variant to see the detailed price breakup.`
    },
    {
      question: `Q: What is the ex-showroom price of ${brandName} ${modelName} base model?`,
      answer: lowestPriceVariant
        ? `The ex-showroom price of the ${brandName} ${modelName} base model (${lowestPriceVariant.name}) is ₹${formatIndianPrice(lowestPriceVariant.price)} (₹${(lowestPriceVariant.price / 100000).toFixed(2)} Lakh).`
        : `The ${brandName} ${modelName} base model starts at approximately ₹12.01 Lakh ex-showroom.`
    },
    {
      question: `Q: What is the ex-showroom price of ${brandName} ${modelName} top model?`,
      answer: highestPriceVariant
        ? `The ex-showroom price of the ${brandName} ${modelName} top model (${highestPriceVariant.name}) is ₹${formatIndianPrice(highestPriceVariant.price)} (₹${(highestPriceVariant.price / 100000).toFixed(2)} Lakh).`
        : `The ${brandName} ${modelName} top model is priced around ₹16.93 Lakh ex-showroom.`
    },
    {
      question: `Q: How many variants of ${brandName} ${modelName} are available in ${cityName}?`,
      answer: `The ${brandName} ${modelName} is available in ${modelVariants.length} variants in ${cityName}. These include ${[...new Set(modelVariants.map(v => v.fuel))].join(', ')} fuel options with ${[...new Set(modelVariants.map(v => v.transmission))].join(' and ')} transmission choices.`
    },
    {
      question: `Q: What is the EMI for ${brandName} ${modelName} in ${cityName}?`,
      answer: priceBreakup
        ? `The EMI for ${brandName} ${modelName} starts at approximately ₹${formatIndianPrice(displayEMI)} per month. This is calculated at 8% interest rate for 7 years with 20% down payment on the on-road price of ₹${formatIndianPrice(priceBreakup.totalOnRoadPrice)}.`
        : `The EMI for ${brandName} ${modelName} varies based on the variant selected, down payment, loan tenure, and interest rate. Use our EMI calculator above for accurate calculations.`
    },
    {
      question: `Q: What is the real world versus claimed mileage of ${brandName} ${modelName}?`,
      answer: `The ${brandName} ${modelName} delivers a real-world mileage of 14-16 km/l in city conditions and 18-20 km/l on highways, while the claimed mileage is around 16-18 km/l.`
    }
  ]

  // Mock dealers data
  const dealers = [
    {
      name: 'Solitaire Honda',
      address: 'Krish Cars Pvt.Ltd. C/o Shakti Insulated Wires, Shakti Industrial & Commercial Business Centre, Dattapada road, Rajendra Nagar, Borivali (East)',
      city: 'Mumbai, Maharashtra, 400066'
    },
    {
      name: 'Arya Honda',
      address: 'Shaman Cars India, 99/100, L.B.S. Marg, Next to St. Xaviers High School, Bhandup (W)',
      city: 'Mumbai, Maharashtra, 400078'
    },
    {
      name: 'Arya Honda',
      address: 'Janmabhoomi Chambers, Walchand Hirachand Marg, Near G.P.O, Ballard Estate',
      city: 'Mumbai, Maharashtra, 400001'
    }
  ]

  // Mock city prices data
  const cityPrices = [
    { id: '1', name: 'Delhi', price: 12.89 },
    { id: '2', name: 'Mumbai', price: 12.99 },
    { id: '3', name: 'Bangalore', price: 13.09 },
    { id: '4', name: 'Chennai', price: 13.19 },
  ]

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    feedback: '',
    name: '',
    email: ''
  })

  // Close variant dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (variantDropdownRef.current && !variantDropdownRef.current.contains(event.target as Node)) {
        setShowVariantDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${brandName} ${modelName}`,
            "image": heroImage,
            "description": `Check ${brandName} ${modelName} on-road price in ${selectedCity.split(',')[0]}. Detailed breakup includes RTO, insurance, and EMI options.`,
            "brand": {
              "@type": "Brand",
              "name": brandName
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": Math.min(...(modelVariants.map(v => v.price) || [0])),
              "highPrice": Math.max(...(modelVariants.map(v => v.price) || [0])),
              "priceCurrency": "INR",
              "offerCount": modelVariants.length,
              "areaServed": selectedCity
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      {/* Sticky Navigation Ribbon */}
      <div className="bg-white border-b sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeSection === section.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: Hero with Car Image, Variant/City Selection, and On-Road Price */}
      <PageSection background="white" maxWidth="7xl">
        <div id="overview" className="">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {brandName} {modelName} On-Road Price in {selectedCity.split(',')[0]} {new Date().getFullYear()}
            </h1>
            <div className="relative">
              <div className={`text-gray-600 leading-relaxed transition-all duration-300 ${!isTextExpanded ? 'line-clamp-2' : ''}`}>
                {/* Dynamic SEO Content based on variant data */}
                {(() => {
                  const cityName = selectedCity.split(',')[0]
                  const minPrice = Math.min(...(modelVariants.map(v => v.price) || [0]))
                  const maxPrice = Math.max(...(modelVariants.map(v => v.price) || [0]))
                  const minPriceLakh = (minPrice / 100000).toFixed(2)
                  const maxPriceLakh = (maxPrice / 100000).toFixed(2)
                  const totalVariants = modelVariants.length

                  // Get fuel-wise pricing data
                  const petrolVariants = modelVariants.filter(v => v.fuel?.toLowerCase() === 'petrol')
                  const dieselVariants = modelVariants.filter(v => v.fuel?.toLowerCase() === 'diesel')
                  const cngVariants = modelVariants.filter(v => v.fuel?.toLowerCase() === 'cng')
                  const electricVariants = modelVariants.filter(v => v.fuel?.toLowerCase() === 'electric')

                  // Get transmission-wise pricing
                  const automaticVariants = modelVariants.filter(v =>
                    v.transmission?.toLowerCase().includes('automatic') ||
                    v.transmission?.toLowerCase().includes('cvt') ||
                    v.transmission?.toLowerCase().includes('amt') ||
                    v.transmission?.toLowerCase().includes('dct')
                  )
                  const manualVariants = modelVariants.filter(v =>
                    v.transmission?.toLowerCase().includes('manual') ||
                    v.transmission?.toLowerCase() === 'mt'
                  )

                  // Calculate on-road starting price
                  const onRoadStartPrice = priceBreakup?.totalOnRoadPrice || (minPrice * 1.15) // Approx 15% markup
                  const onRoadStartLakh = (onRoadStartPrice / 100000).toFixed(2)

                  // Calculate starting EMI (20% down, 7 years, 8.5% interest)
                  const loanAmount = onRoadStartPrice * 0.8
                  const monthlyRate = 8.5 / 12 / 100
                  const months = 84
                  const startingEMI = Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1))

                  const bodyType = model?.bodyType || 'Car'

                  return (
                    <>
                      <p>
                        The {brandName} {modelName} on road price in {cityName} starts at Rs. {formatIndianPrice(Math.round(onRoadStartPrice))} (₹{onRoadStartLakh} Lakh).
                        {maxPrice > minPrice && ` ${modelName} top model price is Rs. ${formatIndianPrice(maxPrice)} (₹${maxPriceLakh} Lakh).`}
                        {automaticVariants.length > 0 && ` ${modelName} automatic price starts from Rs. ${formatIndianPrice(Math.min(...automaticVariants.map(v => v.price)))} and goes up to Rs. ${formatIndianPrice(Math.max(...automaticVariants.map(v => v.price)))}.`}
                        {dieselVariants.length > 0 && ` ${modelName} diesel price starts from Rs. ${formatIndianPrice(Math.min(...dieselVariants.map(v => v.price)))} and goes up to Rs. ${formatIndianPrice(Math.max(...dieselVariants.map(v => v.price)))}.`}
                      </p>
                      <p className="mt-2">
                        {brandName} {modelName} is available in {totalVariants} variants
                        {petrolVariants.length > 0 && dieselVariants.length > 0
                          ? ` with ${petrolVariants.length} Petrol and ${dieselVariants.length} Diesel options`
                          : petrolVariants.length > 0
                            ? ` with Petrol engine`
                            : electricVariants.length > 0
                              ? ` with Electric powertrain`
                              : ''
                        }
                        {cngVariants.length > 0 && ` including ${cngVariants.length} CNG variant${cngVariants.length > 1 ? 's' : ''}`}.
                        {manualVariants.length > 0 && automaticVariants.length > 0
                          ? ` Both Manual and Automatic transmission options are available.`
                          : ''
                        }
                      </p>
                      <p className="mt-2">
                        {modelName} EMI starts at ₹{formatIndianPrice(startingEMI)}/month (for 7 years, 20% down payment).
                        Check the detailed on-road price breakup including RTO charges ({selectedCity.includes('Maharashtra') ? 'Maharashtra' : selectedCity.includes('Delhi') ? 'Delhi NCR' : selectedCity.includes('Karnataka') ? 'Karnataka' : 'your state'}),
                        insurance cost (comprehensive 1-year), and road tax below. Compare all {modelName} variant prices and get the best deal on your new {bodyType.toLowerCase()}.
                      </p>
                    </>
                  )
                })()}
              </div>
              <button
                onClick={() => setIsTextExpanded(!isTextExpanded)}
                className="flex items-center text-red-600 font-medium text-sm mt-1 hover:text-orange-600 transition-colors"
              >
                {isTextExpanded ? (
                  <>
                    Read Less <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Read More <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Hero Image */}
            <div>
              {/* Clickable Image - Links to Model Page */}
              <Link
                href={`/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${modelName.toLowerCase().replace(/\s+/g, '-')}`}
                className="block bg-gray-100 rounded-2xl overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity"
              >
                {heroImage ? (
                  <OptimizedImage
                    src={heroImage}
                    alt={`${brandName} ${modelName}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    wrapperClassName="aspect-[16/10]"
                    className="object-contain"
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='#374151' className="w-3/4 h-3/4">
                      <path d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z' />
                      <circle cx='100' cy='220' r='25' fill='#111827' />
                      <circle cx='300' cy='220' r='25' fill='#111827' />
                      <path d='M80 110h240l-20-30H100z' fill='#6B7280' />
                    </svg>
                  </div>
                )}
              </Link>

              {/* Car Name with Icons */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold text-gray-900">
                  <Link
                    href={`/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${modelName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {brandName} {modelName}
                  </Link>
                  {' '}{selectedVariantName}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      const shareData = {
                        title: `${brandName} ${modelName} Price - gadizone`,
                        text: `Check out the on-road price of ${brandName} ${modelName} in ${selectedCity}`,
                        url: window.location.href
                      };

                      if (navigator.share) {
                        navigator.share(shareData).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Variant Dropdown - Shows all variants with prices */}
              <div className="mb-4 relative" ref={variantDropdownRef}>
                <button
                  onClick={() => setShowVariantDropdown(!showVariantDropdown)}
                  className="w-full bg-white border-2 border-blue-500 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-blue-600 transition-colors"
                >
                  <span className="text-gray-900 font-medium">Choose Variant</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showVariantDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showVariantDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                    {allVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariantName(variant.name)
                          setShowVariantDropdown(false)
                        }}
                        className={`block w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${variant.name === selectedVariantName ? 'bg-blue-50' : ''
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-gray-900 font-medium ${variant.name === selectedVariantName ? 'text-blue-600' : ''}`}>
                            {variant.name}
                          </span>
                          <span className="text-gray-600 text-sm font-semibold">
                            ₹ {(variant.price / 100000).toFixed(2)} Lakh
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* City Selector - Links to Location Page */}
              <Link
                href="/location"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
              >
                <span className="text-gray-700">{selectedCity}</span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </Link>
            </div>

            {/* Right: On-Road Price Breakdown - Clean & SEO Optimized */}
            <div id="price-breakup">
              {/* Section Header - Matches other sections */}
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  On-Road Price Breakdown
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Complete cost breakdown for {selectedCity.split(',')[0]}
                </p>
              </div>

              {/* Price Table - Semantic HTML for SEO */}
              {priceBreakup ? (
                <div className="bg-white rounded-xl border border-gray-200" itemScope itemType="https://schema.org/Product">
                  <meta itemProp="name" content={`${brandName} ${modelName}`} />
                  <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <meta itemProp="priceCurrency" content="INR" />
                    <meta itemProp="price" content={String(priceBreakup.totalOnRoadPrice)} />
                    <meta itemProp="availability" content="https://schema.org/InStock" />
                  </div>

                  <table className="w-full">
                    <caption className="sr-only">{brandName} {modelName} price breakdown in {selectedCity.split(',')[0]}</caption>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-5 py-4 rounded-tl-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-medium">Ex-Showroom Price</span>
                            <div className="group relative">
                              <Info className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 cursor-help transition-colors" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl z-20 font-normal transform-gpu transition-all animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                The basic price of the vehicle at the dealership, excluding taxes and registration.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-gray-900 rounded-tr-xl">₹{formatIndianPrice(priceBreakup.exShowroomPrice)}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">RTO Registration</span>
                            <div className="group relative">
                              <Info className="h-3.5 w-3.5 text-gray-300 group-hover:text-orange-500 cursor-help transition-colors" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl z-20 font-normal transform-gpu transition-all animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                Mandatory state government tax for vehicle registration and number plate.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-medium text-gray-900">₹{formatIndianPrice(priceBreakup.rtoCharges)}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">Road Safety Tax/Cess</span>
                            <div className="group relative">
                              <Info className="h-3.5 w-3.5 text-gray-300 group-hover:text-green-500 cursor-help transition-colors" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl z-20 font-normal transform-gpu transition-all animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                Small additional tax levied by state governments for road development and safety funds.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-medium text-gray-900">₹{formatIndianPrice(priceBreakup.roadSafetyTax)}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">Insurance (1 Year)</span>
                            <div className="group relative">
                              <Info className="h-3.5 w-3.5 text-gray-300 group-hover:text-purple-500 cursor-help transition-colors" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl z-20 font-normal transform-gpu transition-all animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                Comprehensive insurance coverage including Third Party and Own Damage for 1 year.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-medium text-gray-900">₹{formatIndianPrice(priceBreakup.insurance)}</td>
                      </tr>
                      {priceBreakup.tcs > 0 && (
                        <tr>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-700">TCS (1%)</span>
                              <div className="group relative">
                                <Info className="h-3.5 w-3.5 text-gray-300 group-hover:text-red-500 cursor-help transition-colors" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl z-20 font-normal transform-gpu transition-all animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                  Tax Collected at Source. Mandatory 1% tax on vehicles with ex-showroom price above ₹10 Lakhs.
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right font-medium text-gray-900">₹{formatIndianPrice(priceBreakup.tcs)}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">Other Charges</span>
                            <div className="group relative">
                              <Info className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-600 cursor-help transition-colors" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl z-20 font-normal transform-gpu transition-all animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                Includes incidental charges, dealer logistics, and documentation fees.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-medium text-gray-900">₹{formatIndianPrice(priceBreakup.otherCharges)}</td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">Hypothecation (if financed)</span>
                            <div className="group relative">
                              <Info className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 cursor-help transition-colors" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl z-20 font-normal transform-gpu transition-all animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                Fee for noting the bank's interest on the vehicle's registration certificate if you take a loan.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right text-gray-500 text-sm">₹{formatIndianPrice(priceBreakup.hypothecation)}</td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">FASTag</span>
                            <div className="group relative">
                              <Info className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 cursor-help transition-colors" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-2xl z-20 font-normal transform-gpu transition-all animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                Mandatory electronic toll collection tag fitted on the windshield.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right text-gray-500 text-sm">₹{formatIndianPrice(priceBreakup.fasTag)}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-green-50 border-t-2 border-green-200">
                        <td className="px-5 py-5">
                          <span className="block text-sm text-gray-600">On-Road Price in {selectedCity.split(',')[0]}</span>
                        </td>
                        <td className="px-5 py-5 text-right">
                          <span className="text-2xl sm:text-3xl font-bold text-green-600">₹{formatIndianPrice(priceBreakup.totalOnRoadPrice)}</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                    <p className="text-xs text-gray-500">
                      * Prices are indicative and may vary. Contact your nearest {brandName} dealer for exact on-road price.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <div className="animate-pulse text-gray-400 text-sm">Calculating price...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection background="gray" maxWidth="7xl">
        <div id="emi" className="space-y-10">
          {/* Ad Banner */}
          <Ad3DCarousel />

          {/* Embedded EMI Calculator */}
          {priceBreakup && (
            <EmbeddedEMICalculator
              onRoadPrice={priceBreakup.totalOnRoadPrice}
              carName={`${brandName} ${modelName}`}
            />
          )}
        </div>
      </PageSection>

      {/* Section 3: Large White Block (Variants, Comparisons, Reviews, FAQ) */}
      <PageSection background="white" maxWidth="7xl">
        <div className="space-y-16 sm:space-y-24">
          {/* Variants Section */}
          <div id="variants" className="space-y-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {brandName} {modelName} Variants Price in {selectedCity.split(',')[0]} {new Date().getFullYear()}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Compare {modelVariants.length} variants with on-road prices, features & specifications
              </p>
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap gap-2">
              {availableFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterToggle(filter)}
                  className={`px-4 py-2 rounded-lg transition-colors border ${selectedFilters.includes(filter)
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Variant Cards */}
            <div className="space-y-4">
              {loadingVariants ? (
                <div className="text-center py-12">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 mt-4">Finding best prices...</p>
                </div>
              ) : filteredVariants.length > 0 ? (
                filteredVariants
                  .slice(0, showAllVariants ? undefined : 6)
                  .map((variant) => (
                    <VariantCard
                      key={variant.id}
                      variant={{
                        ...variant,
                        price: variant.price / 100000 // Lakh format
                      }}
                      onClick={() => handleVariantClick(variant)}
                      onGetPrice={(e) => {
                        e.stopPropagation()
                        setSelectedVariantName(variant.name)
                        scrollToSection('price-breakup')
                      }}
                      onCompare={(e) => {
                        e.stopPropagation()
                        // Add to comparison logic could go here
                        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-')
                        const modelSlug = modelName.toLowerCase().replace(/\s+/g, '-')
                        router.push(`/${brandSlug}-cars/${modelSlug}/compare`)
                      }}
                    />
                  ))
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                  <p className="text-gray-500">No variants found matching the selected filters.</p>
                </div>
              )}

              {filteredVariants.length > 6 && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => setShowAllVariants(!showAllVariants)}
                    className="inline-flex items-center space-x-2 text-red-600 font-bold hover:text-red-700 transition-colors"
                  >
                    <span>{showAllVariants ? 'Show Less' : `Show All ${filteredVariants.length} Variants`}</span>
                    {showAllVariants ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Similar Cars & Popular Cars */}
          <div className="space-y-16 sm:space-y-24">
            <div id="similar-cars" className="space-y-10">
              <Ad3DCarousel />
              <div className="space-y-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Compare {brandName} {modelName} with Similar Cars
                </h2>

                <div className="relative group">
                  <button
                    onClick={() => {
                      const container = document.getElementById('price-similar-scroll')
                      container?.scrollBy({ left: -300, behavior: 'smooth' })
                    }}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                    aria-label="Scroll left"
                  >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => {
                      const container = document.getElementById('price-similar-scroll')
                      container?.scrollBy({ left: 300, behavior: 'smooth' })
                    }}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div
                    id="price-similar-scroll"
                    className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {similarCars.map((car: any, index: number) => (
                      <CarCard key={car.id} car={car} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="popular-cars" className="space-y-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Popular Cars in India {new Date().getFullYear()}</h2>
              <div className="relative group">
                <button
                  onClick={() => {
                    const container = document.getElementById('price-popular-scroll')
                    container?.scrollBy({ left: -300, behavior: 'smooth' })
                  }}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                  aria-label="Scroll left"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  onClick={() => {
                    const container = document.getElementById('price-popular-scroll')
                    container?.scrollBy({ left: 300, behavior: 'smooth' })
                  }}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div
                  id="price-popular-scroll"
                  className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {popularCars.map((car: any, index: number) => (
                    <CarCard key={car.id} car={car} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & FAQ */}
          <div className="space-y-16 sm:space-y-24">
            <div id="reviews" className="space-y-10">
              <Ad3DCarousel />
              <ModelOwnerReviews
                brandName={brandName}
                modelName={modelName}
                modelSlug={modelName.toLowerCase().replace(/\s+/g, '-')}
                brandSlug={brandName.toLowerCase().replace(/\s+/g, '-')}
              />
            </div>

            <div id="faq" className="space-y-10">
              <Ad3DCarousel />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{brandName} {modelName} FAQ</h2>
                <div className="space-y-4 max-w-4xl">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`} />
                      </button>
                      {openFAQ === index && (
                        <div className="px-6 pb-5 pt-2 border-t border-gray-50 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Summary & Buying Guide - Integrated Design */}
            <div id="summary" className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {brandName} {modelName} Expert Verdict
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Curated by our automotive editorial team</p>
                    </div>
                    <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-lg border border-blue-100">
                      <Award className="w-5 h-5 text-red-600" />
                      <div>
                        <span className="text-2xl font-bold text-red-600">8.4</span>
                        <span className="text-red-400 text-sm font-medium ml-1">/ 10</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed font-medium">
                        "The {modelName} is a standout in the {cityName} market, offering a perfect blend of urban agility and high-end features."
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        With an on-road price starting at ₹{((priceBreakup?.totalOnRoadPrice || 0) / 100000).toFixed(2)} Lakh, it remains one of the most value-driven choices in the {model?.bodyType?.toLowerCase() || 'car'} category. We particularly recommend the mid-range variants for most buyers as they offer the best balance of safety and comfort.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        Quick Highlights
                      </h4>
                      <ul className="space-y-2">
                        {[
                          `Consistent high resale demand in ${cityName}`,
                          `Optimized ${modelVariants[0]?.fuel} efficiency for city traffic`,
                          `Vast service network across ${selectedCity.split(',')[1] || 'your state'}`,
                          `Premium cabin tech in mid & top trims`
                        ].map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 italic text-gray-500 text-sm">
                    <strong>Buyer Tip:</strong> Compare dealership insurance quotes with independent providers; you can often save 15-20% on your total on-road cost in {cityName}.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </PageSection>

      {/* Section 4: Bottom Gray Block (Nearby Cities & Feedback) */}
      <PageSection background="gray" maxWidth="7xl">
        <div id="dealers" className="space-y-16 sm:space-y-24">
          {modelVariants.length > 0 && (
            <CityPriceGrid
              brandSlug={brandName.toLowerCase().replace(/\s+/g, '-')}
              modelSlug={modelName.toLowerCase().replace(/\s+/g, '-')}
              brandName={brandName}
              modelName={modelName}
              basePrice={modelVariants[0]?.price || 0}
              fuelType={modelVariants[0]?.fuel || 'Petrol'}
              currentCity={selectedCity.split(',')[0]}
            />
          )}

          {/* Feedback Form */}
          <div id="feedback" className="max-w-2xl mx-auto w-full">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center mb-2 sm:mb-3">
                Share Your Feedback
              </h2>
              <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                Help us improve our website by sharing your experience
              </p>

              <form className="space-y-4 sm:space-y-5" onSubmit={(e) => e.preventDefault()}>
                {/* Feedback Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedbackForm.feedback}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
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
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
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
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
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
        </div>
      </PageSection>

      <Breadcrumb
        items={[
          { label: brandName, href: `/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars` },
          { label: modelName, href: `/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${modelName.toLowerCase().replace(/\s+/g, '-')}` },
          { label: `Price in ${selectedCity.split(',')[0]}` }
        ]}
      />
      <TestDriveBottomBar onBookTestDrive={() => setIsLeadModalOpen(true)} />
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        carName={`${brandName} ${modelName} ${selectedVariantName}`}
      />
      <Footer />
    </div>
  )
}
