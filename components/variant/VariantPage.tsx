'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OptimizedImage } from '@/components/common/OptimizedImage'
import { truncateCarName } from '@/lib/text-utils'
import { formatPrice, formatPriceRange } from '@/utils/priceFormatter'
import { Heart, Star, Share2, ChevronDown, ChevronRight, Calendar, Users, Fuel, ChevronLeft, Clock, Eye, MessageCircle, ArrowRight, Play, ExternalLink, ThumbsUp, Phone, CheckCircle, Settings, Camera } from 'lucide-react'
import Footer from '../Footer'
import PageSection from '../common/PageSection'
import Breadcrumb from '../common/Breadcrumb'
import AdBanner from '../home/AdBanner'
import VariantCard from '../car-model/VariantCard'
import ExpertReviewSection from '../car-model/ExpertReviewSection'
import { generateExpertReview } from '@/lib/expert-review-logic'
import CarCard from '../home/CarCard'
import UpcomingCars from '../home/UpcomingCars'
import Ad3DCarousel from '../ads/Ad3DCarousel'
import UpcomingCarCard from '../home/UpcomingCarCard'

import ImageGalleryModal from '../common/ImageGalleryModal'
import TestDriveBottomBar from '../common/TestDriveBottomBar'
import LeadFormModal from '../common/LeadFormModal'

interface VariantData {
  brand: string
  model: string
  variant: string
  fullName: string
  price: number
  originalPrice: number
  savings: number
  fuelType: string
  transmission: string
  seating: number
  mileage: number
  engine: string
  power: string
  torque: string
  rating: number
  reviewCount: number
  launchYear: number
  description: string
  images: string[]
  highlights: string[]
  cities: Array<{
    id: number
    name: string
  }>
}

interface UpcomingCar {
  id: string
  name: string
  brandId: string
  brandName: string
  image: string
  expectedPriceMin: number
  expectedPriceMax: number
  fuelTypes: string[]
  expectedLaunchDate: string
  isNew: boolean
  isPopular: boolean
}

interface VariantPageProps {
  brandName: string
  modelName: string
  variantName: string
  newLaunchedCars?: any[]
}

// Mock variant data removed - using real data from backend

const navigationSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'highlights', label: 'Key & Features' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'variants', label: 'Variants' },
  { id: 'offers', label: 'Offers' },
  { id: 'expert-review', label: 'Expert Review' }
]

export default function VariantPage({
  variantData,
  brandName,
  modelName,
  variantName,
  newLaunchedCars = [],
  initialBrand,
  initialModel,
  initialVariant,
  initialAllVariants = []
}: {
  variantData?: VariantData,
  brandName?: string,
  modelName?: string,
  variantName?: string,
  newLaunchedCars?: any[],
  initialBrand?: any,
  initialModel?: any,
  initialVariant?: any,
  initialAllVariants?: any[]
}) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({})
  const [activeSection, setActiveSection] = useState('overview')
  const [isSticky, setIsSticky] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']) // Multi-select filters
  const navRef = useRef<HTMLDivElement>(null)

  // Navigation sections for sticky ribbon
  const navSections = [
    { id: 'overview', name: 'Overview' },
    { id: 'highlights', name: 'EMI & Highlights' },
    { id: 'specifications', name: 'Specifications' },
    { id: 'more-variants', name: 'Variants' },
    { id: 'engine-mileage', name: 'Engine & Mileage' },
    { id: 'expert-review', name: 'Expert Review' },
    { id: 'price-across-india', name: 'Price' },
    { id: 'similar-cars', name: 'Similar Cars' }
  ]

  // Backend data fetching states
  const [variant, setVariant] = useState<any>(null)
  const [model, setModel] = useState<any>(null)
  const [brand, setBrand] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const [allModelVariants, setAllModelVariants] = useState<any[]>([])

  // Upcoming Cars State
  const [upcomingCars, setUpcomingCars] = useState<UpcomingCar[]>([])
  const [loadingUpcomingCars, setLoadingUpcomingCars] = useState(true)

  // Image Gallery Modal state for highlights
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<Array<{ src: string; alt: string; caption?: string }>>([])
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0)

  // Open gallery modal with images
  const openGalleryModal = (images: Array<{ src: string; alt: string; caption?: string }>, initialIndex: number = 0) => {
    setGalleryImages(images)
    setGalleryInitialIndex(initialIndex)
    setGalleryModalOpen(true)
  }

  // Fetch upcoming cars for this brand
  useEffect(() => {
    async function fetchUpcomingCars() {
      if (!brand?.id) return

      try {
        setLoadingUpcomingCars(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
        const response = await fetch(`${backendUrl}/api/upcoming-cars`)

        if (response.ok) {
          const allUpcomingCars = await response.json()
          // Filter by brandId and map to match UpcomingCar interface
          const brandUpcomingCars = allUpcomingCars
            .filter((car: any) => car.brandId === brand.id)
            .map((car: any) => ({
              id: car.id,
              name: car.name,
              brandId: car.brandId,
              brandName: brand.name,
              image: car.heroImage ? (car.heroImage.startsWith('http') ? car.heroImage : `${backendUrl}${car.heroImage}`) : '',
              expectedPriceMin: car.expectedPriceMin,
              expectedPriceMax: car.expectedPriceMax,
              fuelTypes: car.fuelTypes || ['Petrol'],
              expectedLaunchDate: car.expectedLaunchDate,
              isNew: true,
              isPopular: false
            }))
          setUpcomingCars(brandUpcomingCars)
        }
      } catch (error) {
        console.error('Error fetching upcoming cars:', error)
      } finally {
        setLoadingUpcomingCars(false)
      }
    }

    if (brand?.id) {
      fetchUpcomingCars()
    }
  }, [brand?.id, brand?.name])

  // ... (existing code)

  // Extract brand, model, variant names from data (fallback to props or backend data)
  const displayBrandName = brand?.name || brandName || variantData?.brand
  const displayModelName = model?.name || modelName || variantData?.model
  const displayVariantName = variant?.name || variantName || variantData?.variant

  // Helper function to check if transmission is automatic type
  const isAutomaticTransmission = (transmission: string) => {
    const automaticTypes = ['automatic', 'cvt', 'amt', 'dct', 'torque converter', 'dual clutch']
    return automaticTypes.some(type => transmission.toLowerCase().includes(type))
  }

  // Transform backend variant data for More Variants section - exclude current variant and sort by price
  const transformedVariants = useMemo(() => {
    return allModelVariants
      .filter(v => v.id !== variant?.id) // Exclude current variant
      .map(v => ({
        id: v.id,
        name: v.name,
        price: v.price ? (v.price / 100000) : 0, // Convert to lakhs
        fuel: v.fuel || 'Petrol',
        transmission: v.transmission || 'Manual',
        power: v.maxPower || 'N/A',
        features: v.keyFeatures || v.headerSummary || 'Key features not available'
      }))
      .sort((a, b) => a.price - b.price) // Sort by price in ascending order
  }, [allModelVariants, variant?.id])

  // Handle filter toggle (multi-select)
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

  // Generate dynamic filters based on available variants
  const availableFilters = useMemo(() => {
    const filters = ['All']
    const fuelTypes = new Set<string>()
    const transmissionTypes = new Set<string>()

    transformedVariants.forEach(v => {
      if (v.fuel) fuelTypes.add(v.fuel)
      if (v.transmission) {
        if (isAutomaticTransmission(v.transmission)) {
          transmissionTypes.add('Automatic')
        } else {
          transmissionTypes.add('Manual')
        }
      }
    })

    fuelTypes.forEach(fuel => filters.push(fuel))
    transmissionTypes.forEach(trans => filters.push(trans))

    return filters
  }, [transformedVariants])

  // Filter variants based on selected filters (multi-select logic)
  const filteredVariants = useMemo(() => {
    if (selectedFilters.includes('All')) {
      return transformedVariants
    }

    return transformedVariants.filter(v => {
      // Normalize variant data
      const vFuel = (v.fuel || '').toLowerCase().trim()
      const vTransmission = (v.transmission || '').toLowerCase().trim()
      const isAuto = isAutomaticTransmission(vTransmission)

      // Categorize selected filters
      const fuelFilters = selectedFilters.filter(f => {
        const lf = f.toLowerCase()
        return ['petrol', 'diesel', 'cng', 'electric'].some(t => lf.includes(t))
      })

      const transmissionFilters = selectedFilters.filter(f => {
        const lf = f.toLowerCase()
        return ['manual', 'automatic'].includes(lf)
      })

      // Check matches
      let matchesFuel = fuelFilters.length === 0
      if (fuelFilters.length > 0) {
        matchesFuel = fuelFilters.some(f => vFuel.includes(f.toLowerCase()))
      }

      let matchesTransmission = transmissionFilters.length === 0
      if (transmissionFilters.length > 0) {
        if (transmissionFilters.some(f => f.toLowerCase() === 'automatic')) {
          matchesTransmission = matchesTransmission || isAuto
        }
        if (transmissionFilters.some(f => f.toLowerCase() === 'manual')) {
          matchesTransmission = matchesTransmission || !isAuto
        }
      }

      return matchesFuel && matchesTransmission
    })
  }, [transformedVariants, selectedFilters])
  const [isLiked, setIsLiked] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(variantData?.variant)
  const [selectedCity, setSelectedCity] = useState('Delhi')
  const [showVariantDropdown, setShowVariantDropdown] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSummaryDescription, setShowSummaryDescription] = useState(false)
  const [showSummaryExterior, setShowSummaryExterior] = useState(false)
  const [showSummaryComfort, setShowSummaryComfort] = useState(false)
  const [showAllPros, setShowAllPros] = useState(false)
  const [showAllCons, setShowAllCons] = useState(false)
  const [expandedEngine, setExpandedEngine] = useState<boolean>(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)



  const variantDropdownRef = useRef<HTMLDivElement>(null)
  const cityDropdownRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for sticky navigation highlighting
  useEffect(() => {
    const sectionIds = navSections.map(s => s.id)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            // Auto-scroll the nav to show active item
            if (navRef.current) {
              const activeButton = navRef.current.querySelector(`[data-section="${entry.target.id}"]`)
              if (activeButton) {
                // activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
              }
            }
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    // Observe all navigable sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 60
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth'
      })
    }
  }

  // Optimized data fetching - use server-side data if available, otherwise fetch client-side
  useEffect(() => {
    const fetchData = async () => {
      // If we have initial data from server-side, use it directly
      if (initialBrand && initialModel && initialVariant) {
        console.log('Using server-side initial data')
        setBrand(initialBrand)
        setModel(initialModel) // This includes similarCars!
        setVariant(initialVariant)
        setAllModelVariants(initialAllVariants)
        setLoading(false)
        setInitialLoad(false)
        return
      }

      // Otherwise, fetch client-side (fallback for client-side navigation)
      if (!brandName || !modelName || !variantName) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // First, find the brand to get brandId
        const brandsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/brands`)
        if (!brandsResponse.ok) throw new Error('Failed to fetch brands')
        const brands = await brandsResponse.json()

        const foundBrand = brands.find((b: any) =>
          b.name.toLowerCase().replace(/\s+/g, '-') === brandName.toLowerCase()
        )

        if (!foundBrand) {
          setError('Brand not found')
          return
        }

        // Then fetch models for this brand only
        const modelsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/models?brandId=${foundBrand.id}`)
        if (!modelsResponse.ok) throw new Error('Failed to fetch models')
        const models = await modelsResponse.json()

        const foundModel = models.find((m: any) =>
          m.name.toLowerCase().replace(/\s+/g, '-') === modelName.toLowerCase()
        )

        if (!foundModel) {
          setError('Model not found')
          return
        }

        // Finally fetch variants for this model only
        const variantsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/variants?modelId=${foundModel.id}`)
        if (!variantsResponse.ok) throw new Error('Failed to fetch variants')
        const variants = await variantsResponse.json()

        // Store all variants for the More Variants section
        setAllModelVariants(variants)

        // Find variant with flexible matching
        // Normalize both the variant name from URL and database for comparison
        const normalizeForMatch = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const normalizedVariantName = normalizeForMatch(variantName)

        console.log('Looking for variant:', variantName)
        console.log('Normalized variant name:', normalizedVariantName)
        console.log('Available variants:', variants.map((v: any) => ({ name: v.name, normalized: normalizeForMatch(v.name) })))

        let foundVariant = variants.find((v: any) =>
          normalizeForMatch(v.name) === normalizedVariantName
        )

        if (!foundVariant) {
          // Try partial matching
          foundVariant = variants.find((v: any) =>
            normalizeForMatch(v.name).includes(normalizedVariantName) ||
            normalizedVariantName.includes(normalizeForMatch(v.name))
          )
        }

        if (!foundVariant && variants.length > 0) {
          console.warn('Variant not found, using first variant as fallback')
          foundVariant = variants[0] // Use first variant as fallback
        }

        console.log('Found variant:', foundVariant?.name)

        // Now fetch the FULL variant details (not minimal) for the current variant
        if (foundVariant?.id) {
          console.log('Fetching full variant details for:', foundVariant.id)
          const fullVariantResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/variants/${foundVariant.id}`)
          if (fullVariantResponse.ok) {
            const fullVariant = await fullVariantResponse.json()
            console.log('Got full variant details:', fullVariant.name)
            foundVariant = fullVariant // Replace minimal variant with full details
          } else {
            console.error('Failed to fetch full variant details')
          }
        }

        setBrand(foundBrand)
        setModel(foundModel)
        setVariant(foundVariant)

        if (!foundVariant) {
          setError('Variant not found')
        } else {
          console.log('VariantPage: Successfully found variant:', foundVariant.name)
          console.log('VariantPage: Variant highlightImages:', foundVariant.highlightImages)
          console.log('VariantPage: Variant highlightImages count:', foundVariant.highlightImages?.length || 0)
          console.log('VariantPage: Comfort & Convenience specs:', {
            ventilatedSeats: foundVariant.ventilatedSeats,
            sunroof: foundVariant.sunroof,
            airPurifier: foundVariant.airPurifier,
            cruiseControl: foundVariant.cruiseControl,
            rainSensingWipers: foundVariant.rainSensingWipers,
            automaticHeadlamp: foundVariant.automaticHeadlamp,
            followMeHomeHeadlights: foundVariant.followMeHomeHeadlights,
            ignition: foundVariant.ignition,
            ambientLighting: foundVariant.ambientLighting,
            airConditioning: foundVariant.airConditioning,
            climateZones: foundVariant.climateZones,
            rearACVents: foundVariant.rearACVents,
            frontArmrest: foundVariant.frontArmrest
          })
          console.log('VariantPage: Safety specs:', {
            globalNCAPRating: foundVariant.globalNCAPRating,
            airbags: foundVariant.airbags,
            airbagsLocation: foundVariant.airbagsLocation,
            adasLevel: foundVariant.adasLevel,
            reverseCamera: foundVariant.reverseCamera
          })
          console.log('VariantPage: Entertainment & Connectivity specs:', {
            touchScreenInfotainment: foundVariant.touchScreenInfotainment,
            androidAppleCarplay: foundVariant.androidAppleCarplay,
            speakers: foundVariant.speakers,
            wirelessCharging: foundVariant.wirelessCharging
          })
          console.log('VariantPage: Engine & Transmission specs:', {
            engineNamePage4: foundVariant.engineNamePage4,
            engineCapacity: foundVariant.engineCapacity,
            fuel: foundVariant.fuel,
            transmission: foundVariant.transmission,
            maxPower: foundVariant.maxPower
          })
          console.log('VariantPage: Seating Comfort specs:', {
            seatUpholstery: foundVariant.seatUpholstery,
            seatsAdjustment: foundVariant.seatsAdjustment,
            driverSeatAdjustment: foundVariant.driverSeatAdjustment,
            passengerSeatAdjustment: foundVariant.passengerSeatAdjustment,
            rearSeatAdjustment: foundVariant.rearSeatAdjustment,
            welcomeSeats: foundVariant.welcomeSeats,
            memorySeats: foundVariant.memorySeats
          })
          console.log('VariantPage: Exteriors specs:', {
            headLights: foundVariant.headLights,
            tailLight: foundVariant.tailLight,
            frontFogLights: foundVariant.frontFogLights,
            roofRails: foundVariant.roofRails
          })
          console.log('VariantPage: Dimensions specs:', {
            groundClearance: foundVariant.groundClearance,
            length: foundVariant.length,
            width: foundVariant.width,
            height: foundVariant.height,
            wheelbase: foundVariant.wheelbase
          })
          console.log('VariantPage: Tyre & Suspension specs:', {
            frontTyreProfile: foundVariant.frontTyreProfile,
            rearTyreProfile: foundVariant.rearTyreProfile,
            spareTyreProfile: foundVariant.spareTyreProfile,
            frontSuspension: foundVariant.frontSuspension,
            rearSuspension: foundVariant.rearSuspension
          })
          console.log('VariantPage: Storage specs:', {
            cupholders: foundVariant.cupholders,
            fuelTankCapacity: foundVariant.fuelTankCapacity,
            bootSpace: foundVariant.bootSpace,
            bootSpaceAfterFoldingRearRowSeats: foundVariant.bootSpaceAfterFoldingRearRowSeats
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load variant data')
      } finally {
        setLoading(false)
        setInitialLoad(false)
      }
    }

    fetchData()
  }, [brandName, modelName, variantName])





  // Helper function to parse bullet points from backend string
  const parseBulletPoints = (text: string | string[]): string[] => {
    if (Array.isArray(text)) return text
    if (!text) return []
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[•\-\*]\s*/, ''))
  }

  // Helper function to calculate on-road price using the exact same logic as CarsByBudget
  const getOnRoadPrice = (exShowroomPrice: number, fuelType: string): number => {
    // Get selected city from localStorage (same as useOnRoadPrice hook)
    const currentCity = isMounted
      ? localStorage.getItem('selectedCity') || 'Mumbai, Maharashtra'
      : 'Mumbai, Maharashtra'


    const state = currentCity.split(',')[1]?.trim() || 'Maharashtra'

    // Use the exact same calculation function as CarsByBudget
    const breakup = calculateOnRoadPrice(exShowroomPrice, state, fuelType)
    return breakup.totalOnRoadPrice
  }

  // Create dynamic variant data from backend
  const dynamicVariantData = variant ? {
    brand: displayBrandName,
    model: displayModelName,
    variant: displayVariantName,
    fullName: `${displayBrandName} ${displayModelName} ${displayVariantName}`,
    price: variant.price ? (variant.price / 100000) : variantData?.price,
    originalPrice: variant.price ? (variant.price / 100000) : variantData?.originalPrice,
    savings: 0,
    fuelType: (variant as any).fuel || variant.fuelType || variantData?.fuelType,
    transmission: (variant as any).transmission || variantData?.transmission,
    seating: 5, // Default or from specifications
    mileage: parseFloat((variant as any).mileageCompanyClaimed || '0') || variantData?.mileage,
    engine: variant.engineName || (variant as any).engineCapacity || variantData?.engine,
    power: (variant as any).maxPower || variant.enginePower || variantData?.power,
    torque: (variant as any).torque || variant.engineTorque || variantData?.torque,
    rating: (variant as any).rating || 0,
    reviewCount: (variant as any).reviewCount || 0,
    launchYear: 2024, // Default or from model data
    description: variant.headerSummary || variant.description || variant.keyFeatures || variantData?.description,
    images: variant.highlightImages?.map((img: any) => img.url) ||
      model?.galleryImages?.map((img: any) => img.url) ||
      variantData?.images,
    highlights: parseBulletPoints(variant.keyFeatures || variant.headerSummary || ''),
    cities: variantData?.cities
  } : variantData

  // Use dynamic data if available, otherwise fallback to mock data
  // Don't show mock data during initial loading to avoid flash
  const currentVariantData = loading && !variant ? {
    ...variantData,
    fullName: `${displayBrandName || brandName || 'Loading'} ${displayModelName || modelName || 'Loading'} ${displayVariantName || variantName || 'Loading'}`,
    description: 'Loading variant details...',
    price: 0,
    rating: 0,
    reviewCount: 0,
    fuelType: 'Loading...',
    transmission: 'Loading...',
    power: 'Loading...',
    torque: 'Loading...',
    engine: 'Loading...',
    mileage: 0
  } : (variant ? dynamicVariantData : variantData)


  // Get on-road price for current variant
  // currentVariantData.price is in lakhs, so convert to rupees for the hook
  const exShowroomPriceInRupees = (currentVariantData?.price || 0) * 100000

  // Construct variant object for Expert Review (adapting variant data to look like model data)
  const variantForReview = useMemo(() => {
    if (!currentVariantData) return null
    return {
      ...currentVariantData,
      brand: displayBrandName || currentVariantData.brand,
      name: `${displayModelName} ${displayVariantName}`, // Effective name "Creta EX"
      startingPrice: exShowroomPriceInRupees, // Expected in Rupees for logic
      keySpecs: {
        power: currentVariantData.power,
        safetyRating: currentVariantData.rating ? `${currentVariantData.rating} Star` : '0 Star' // Approximation if rating is number
      },
      mileage: [{ value: currentVariantData.mileage }],
      bodyType: model?.bodyType || 'Car'
    }
  }, [currentVariantData, displayBrandName, displayModelName, displayVariantName, exShowroomPriceInRupees, model])

  // Generate dynamic expert review data (Pros, Cons, Verdict)
  const expertReviewData = useMemo(() => {
    if (!variantForReview) return null
    return generateExpertReview(variantForReview)
  }, [variantForReview])

  // Helper to check if electric
  const isElectric = currentVariantData?.fuelType?.toLowerCase()?.includes('electric')

  

  // displayPrice should be in rupees for formatPrice to work correctly
  const displayPrice = exShowroomPriceInRupees
  const cityName = (isMounted ? selectedCity : 'Delhi').split(',')[0] || 'Delhi'
  const priceLabel = 'Price'

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

  const displayEMI = calculateDisplayEMI(displayPrice)

  // Mock variants data removed - using real data from backend

  // Handle variant click function
  const handleVariantChange = (variant: typeof availableVariants[0]) => {
    if (!displayBrandName || !displayModelName || !variant?.name) return

    const brandSlug = displayBrandName.toLowerCase().replace(/\s+/g, '-')
    const modelSlug = displayModelName.toLowerCase().replace(/\s+/g, '-')
    const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-')
    const url = `/${brandSlug}-cars/${modelSlug}/${variantSlug}`
    console.log('Navigating to variant page:', url)
    router.push(url)
  }

  // Available variants for the dropdown - exclude current variant
  const availableVariants = allModelVariants
    .filter(v => v.id !== variant?.id) // Exclude current variant
    .map(v => ({
      id: v.id,
      name: v.name,
      price: (v.price || 0) / 100000 // Convert to lakhs
    }))

  // Listen for city changes from localStorage and set isMounted
  useEffect(() => {
    setIsMounted(true) // Set isMounted to true after initial render
    const handleStorageChange = () => {
      const savedCity = localStorage.getItem('selectedCity')
      if (savedCity) {
        setSelectedCity(savedCity)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleStorageChange()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    handleStorageChange() // Check immediately on mount
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (variantDropdownRef.current && !variantDropdownRef.current.contains(event.target as Node)) {
        setShowVariantDropdown(false)
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Toggle specification section
  const toggleSpecSection = (sectionKey: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  // Fast loading state - show skeleton instead of blank page
  const showSkeleton = loading || initialLoad

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navigation Ribbon */}
      <div className="variant-nav-ribbon bg-white border-b sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={navRef} className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {navSections.map((section) => (
              <button
                key={section.id}
                data-section={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeSection === section.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {section.id === 'engine-mileage' && isElectric ? 'Motor & Range' : section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Section 1: Overview - Variant Specific */}
        <PageSection background="white" maxWidth="7xl">
          <div id="overview" className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column: Images (Desktop: col-span-7) */}
            <div className="md:col-span-7">
              {/* Hero Car Image with Gallery - Scrollable */}
              <div
                className="relative group cursor-pointer"
                onClick={() => {
                  const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                  const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')
                  // Navigate to model gallery (shared for all variants)
                  router.push(`/${brandSlug}-cars/${modelSlug}/images`)
                }}
              >
                <div id="variant-gallery" className="aspect-[16/10] bg-gray-100 rounded-2xl overflow-x-auto snap-x snap-mandatory scrollbar-hide flex touch-pan-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                  {showSkeleton ? (
                    <div className="w-full h-full flex-shrink-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400">Loading image...</div>
                    </div>
                  ) : (
                    <>
                      {/* Hero Image */}
                      {model?.heroImage && (
                        <div className="w-full h-full flex-shrink-0 snap-center relative">
                          <OptimizedImage
                            src={model.heroImage}
                            alt={`${displayBrandName || 'Car'} ${displayModelName || 'Model'}`}
                            fill
                            className="object-contain rounded-2xl"
                            priority={true}
                          />
                        </div>
                      )}
                      {/* Gallery Images */}
                      {model?.galleryImages?.map((img: any, index: number) => (
                        <div key={index} className="w-full h-full flex-shrink-0 snap-center relative">
                          <OptimizedImage
                            src={img.url}
                            alt={`${displayBrandName || 'Car'} ${displayModelName || 'Model'} - Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-2xl"
                            fill
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>



                {/* Image Count Badge */}
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>{1 + (model?.galleryImages?.length || 0)} Images</span>
                </div>

                {/* Gallery Navigation Arrow */}
                {!showSkeleton && ((model?.heroImage && model?.galleryImages && model.galleryImages.length > 0) || (model?.galleryImages && model.galleryImages.length > 1)) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent gallery page navigation
                      const gallery = document.getElementById('variant-gallery');
                      if (gallery) {
                        gallery.scrollBy({ left: gallery.clientWidth, behavior: 'smooth' });
                      }
                    }}
                    className="absolute bottom-4 right-4 bg-white rounded-full p-3 hover:bg-gray-50 transition-colors shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Details (Desktop: col-span-5) */}
            <div className="md:col-span-5 space-y-6">
              {/* Car Title and Actions */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {showSkeleton ? (
                      <div className="bg-gray-200 animate-pulse h-9 w-96 rounded"></div>
                    ) : (
                      currentVariantData?.fullName
                    )}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-4">
                    {showSkeleton ? (
                      <div className="bg-gray-200 animate-pulse h-8 w-24 rounded"></div>
                    ) : (
                      currentVariantData?.reviewCount > 0 ? (
                        <div className="flex items-center bg-[#291e6a] text-white px-3 py-1 rounded">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          <span className="font-semibold">{currentVariantData?.rating}</span>
                          <span className="ml-1">({currentVariantData?.reviewCount})</span>
                        </div>
                      ) : null
                    )}
                    <Link
                      href={`/${displayBrandName?.toLowerCase().replace(/\s+/g, '-')}-cars/${displayModelName?.toLowerCase().replace(/\s+/g, '-')}/rate-review`}
                      className="text-red-600 hover:text-orange-600 font-medium"
                    >
                      Rate & Review
                    </Link>
                  </div>
                </div>

                {/* Share and Heart Icons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      const shareData = {
                        title: `${currentVariantData?.fullName || 'Car Variant'} - Check it out!`,
                        text: `Check out the ${currentVariantData?.fullName || 'car'} on gadizone!`,
                        url: window.location.href
                      };

                      if (navigator.share) {
                        navigator.share(shareData).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 transition-colors ${isLiked ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="text-gray-700 leading-relaxed">
                {showSkeleton ? (
                  <div className="space-y-2">
                    <div className="bg-gray-200 animate-pulse h-4 w-full rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded"></div>
                  </div>
                ) : (
                  <>
                    <p>
                      {showFullDescription ? currentVariantData?.description :
                        (currentVariantData?.description?.length > 150 ?
                          `${currentVariantData?.description.substring(0, 150)}...` :
                          currentVariantData?.description)}
                    </p>
                    {currentVariantData?.description?.length > 150 && (
                      <div className="mt-2">
                        {!showFullDescription ? (
                          <button
                            onClick={() => setShowFullDescription(true)}
                            className="text-red-600 hover:text-orange-600 font-medium"
                          >
                            ...more
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowFullDescription(false)}
                            className="text-red-600 hover:text-orange-600 font-medium"
                          >
                            Show less
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Single Price Display for Variant */}
              <div className="space-y-4">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {showSkeleton ? (
                    <div className="bg-gray-200 animate-pulse h-9 w-32 rounded"></div>
                  ) : (
                    formatPrice(displayPrice / 100000)
                  )}
                </div>
                <div className="text-sm text-gray-500">*{priceLabel}</div>

                <button
                  onClick={() => {
                    const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                    const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')

                    // Load saved city from localStorage after mount to avoid hydration mismatch
                    const selectedCityValue = typeof window !== 'undefined'
                      ? localStorage.getItem('selectedCity') || 'Mumbai, Maharashtra'
                      : 'Mumbai, Maharashtra'
                    const citySlug = selectedCityValue.split(',')[0].toLowerCase().replace(/\s+/g, '-')

                    // Save selected variant to localStorage to persist across navigation without URL param
                    if (displayVariantName) {
                      localStorage.setItem('priceBreakupVariant', displayVariantName)
                    }

                    // Navigate directly to price-in route (clean URL: /brand-cars/model/price-in-city)
                    router.push(`/${brandSlug}-cars/${modelSlug}/price-in-${citySlug}`)
                  }}
                  className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Get On-Road Price
                </button>
              </div>

              {/* Variant and City Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Variant Dropdown */}
                <div className="relative" ref={variantDropdownRef}>
                  <button
                    onClick={() => setShowVariantDropdown(!showVariantDropdown)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <span className="text-gray-700">
                      {selectedVariant || 'Choose Variant'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showVariantDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showVariantDropdown && availableVariants.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                      {availableVariants.map((variantItem) => (
                        <button
                          key={variantItem.id}
                          onClick={() => {
                            const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                            const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')
                            const variantSlug = variantItem.name.toLowerCase().replace(/\s+/g, '-')
                            router.push(`/${brandSlug}-cars/${modelSlug}/${variantSlug}`)
                          }}
                          className="block w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-gray-900">{variantItem.name}</span>
                            <span className="text-gray-600 text-sm">{formatPrice(variantItem.price)}</span>
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
                  <span className="text-gray-700">
                    {isMounted ? (selectedCity || 'Delhi') : 'Delhi'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </Link>
              </div>

            </div>
          </div>
        </PageSection>

        {/* Section 2: AD Banner + Variant Highlights */}
        <PageSection background="white" maxWidth="7xl">
          <div id="highlights" className="space-y-8">
            {/* EMI Calculator - Moved here to match Model Page */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#291e6a] rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">K</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">kotak</h3>
                    <p className="text-sm text-gray-600">Mahindra Bank</p>
                  </div>
                </div>

                {/* EMI Amount Display */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Starting EMI</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(displayEMI ?? 0)}
                  </p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>

              {/* Calculate EMI Button */}
              <Link
                href={`/emi-calculator?brand=${encodeURIComponent(displayBrandName ?? '')}&model=${encodeURIComponent(displayModelName ?? '')}&variant=${encodeURIComponent(displayVariantName ?? '')}&price=${displayPrice}`}
                className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Calculate EMI</span>
              </Link>
            </div>

            {/* Ad Banner */}
            <Ad3DCarousel className="mb-6" />

            {/* Key Features */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Key Features</h2>

              {/* Highlights Grid - Horizontal Scroll */}
              <div className="relative">
                <div className="highlights-scroll-container flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {/* Dynamic Highlight Cards from Variant Backend */}
                  {showSkeleton ? (
                    /* Skeleton loading cards */
                    <>
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="flex-shrink-0 w-64">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (() => {
                    const variantHighlights = variant?.highlightImages || [];

                    return variantHighlights.length > 0 ? (
                      variantHighlights.map((highlight: any, index: number) => {
                        // Build image URL
                        const imageUrl = (() => {
                          if (!highlight.url) return '';
                          if (highlight.url.startsWith('http://') || highlight.url.startsWith('https://')) return highlight.url;
                          if (highlight.url.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${highlight.url}`;
                          return highlight.url;
                        })();
                        const caption = highlight.caption || `${displayBrandName} ${displayModelName} Feature ${index + 1}`;

                        return (
                          <div
                            key={index}
                            className="flex-shrink-0 w-64 cursor-pointer"
                            onClick={() => {
                              // Build gallery images array from all highlights
                              const galleryImgs = variantHighlights.map((h: any, idx: number) => ({
                                src: (() => {
                                  if (!h.url) return '';
                                  if (h.url.startsWith('http://') || h.url.startsWith('https://')) return h.url;
                                  if (h.url.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${h.url}`;
                                  return h.url;
                                })(),
                                alt: h.caption || `Feature ${idx + 1}`,
                                caption: h.caption || `${displayBrandName} ${displayModelName} Feature ${idx + 1}`
                              }));
                              openGalleryModal(galleryImgs, index);
                            }}
                          >
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                              <div className="aspect-[4/3] bg-gray-200 relative">
                                <OptimizedImage
                                  src={imageUrl}
                                  alt={caption}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                                {/* Image Caption Overlay - Backend Caption */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                  <p className="text-sm font-medium text-center">
                                    {caption}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      /* Fallback cards if no backend data */
                      <>
                        {/* Highlight Card 1 */}
                        <div className="flex-shrink-0 w-64">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200 relative">
                              <OptimizedImage
                                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center"
                                alt="Advanced Safety Features"
                                fill
                                className="object-cover rounded-lg"
                              />
                              {/* Image Caption Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                <p className="text-sm font-medium text-center">Advanced Safety Features</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Highlight Card 2 */}
                        <div className="flex-shrink-0 w-64">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200 relative">
                              <OptimizedImage
                                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop&crop=center"
                                alt="Premium Interior"
                                fill
                                className="object-cover rounded-lg"
                              />
                              {/* Image Caption Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                <p className="text-sm font-medium text-center">Premium Interior</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Highlight Card 3 */}
                        <div className="flex-shrink-0 w-64">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200 relative">
                              <OptimizedImage
                                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&crop=center"
                                alt="Fuel Efficiency"
                                fill
                                className="object-cover rounded-lg"
                              />
                              {/* Image Caption Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                <p className="text-sm font-medium text-center">Fuel Efficiency</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Section 3: SEO Text + Specifications */}
        <PageSection background="white" maxWidth="7xl">
          <div id="specifications" className="space-y-8">
            {/* SEO Text Section */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{displayModelName} {displayVariantName} Info</h2>
              <div className="text-gray-700 leading-relaxed">
                {(() => {
                  const keyFeaturesText = variant?.keyFeatures || variant?.headerSummary || '';
                  const baseText = `The ${displayBrandName} ${displayModelName} ${displayVariantName} is priced at ${formatPrice(displayPrice / 100000)} (${priceLabel}).`;
                  const featuresText = keyFeaturesText ? ` Key features include: ${keyFeaturesText}` : '';
                  const endText = ` ${displayModelName} is available in ${allModelVariants?.length || 1} variants.`;
                  const fullText = baseText + featuresText + endText;
                  const truncatedLength = 200;
                  const shouldTruncate = fullText.length > truncatedLength;

                  return (
                    <p>
                      {showFullDescription || !shouldTruncate ? (
                        <>
                          {fullText}
                          {shouldTruncate && (
                            <button
                              onClick={() => setShowFullDescription(false)}
                              className="text-red-600 hover:text-orange-600 font-medium ml-1"
                            >
                              Read Less
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {fullText.substring(0, truncatedLength)}...
                          <button
                            onClick={() => setShowFullDescription(true)}
                            className="text-red-600 hover:text-orange-600 font-medium ml-1"
                          >
                            Read More
                          </button>
                        </>
                      )}
                    </p>
                  );
                })()}
              </div>
            </div>

            {/* Specifications Section */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                {displayModelName} {displayVariantName} Specifications & Features
              </h2>

              {/* Specifications Categories */}
              <div className="space-y-4">
                {/* Comfort & Convenience */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleSpecSection('comfort')}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900">Comfort & Convenience</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSpecs['comfort'] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Content - Only visible when expanded */}
                  {expandedSpecs['comfort'] && (
                    <div className="px-6 pb-6">
                      {/* Preview specs */}
                      <div className="space-y-4">
                        {showSkeleton ? (
                          /* Skeleton loading */
                          <>
                            {[1, 2].map((index) => (
                              <div key={index} className="flex justify-between items-center py-2">
                                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Show first 2 specs */}
                            {variant?.sunroof && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Sunroof</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.sunroof}</span>
                              </div>
                            )}

                            {variant?.ventilatedSeats && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Ventilated Seats</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.ventilatedSeats}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedSpecs['comfort'] && !showSkeleton && (
                        <div className="mt-4 space-y-4">
                          {variant?.airPurifier && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Air Purifier</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.airPurifier}</span>
                            </div>
                          )}

                          {variant?.headsUpDisplay && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Heads Up Display (HUD)</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.headsUpDisplay}</span>
                            </div>
                          )}

                          {variant?.cruiseControl && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Cruise Control</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.cruiseControl}</span>
                            </div>
                          )}

                          {variant?.rainSensingWipers && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Rain Sensing Wipers</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.rainSensingWipers}</span>
                            </div>
                          )}

                          {variant?.automaticHeadlamp && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Automatic Headlamp</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.automaticHeadlamp}</span>
                            </div>
                          )}

                          {variant?.followMeHomeHeadlights && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Follow Me Home Headlights</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.followMeHomeHeadlights}</span>
                            </div>
                          )}

                          {variant?.ignition && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Ignition</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.ignition}</span>
                            </div>
                          )}

                          {variant?.ambientLighting && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Ambient Lighting</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.ambientLighting}</span>
                            </div>
                          )}

                          {variant?.airConditioning && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Air Conditioning</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.airConditioning}</span>
                            </div>
                          )}

                          {variant?.climateZones && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Climate Zones</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.climateZones}</span>
                            </div>
                          )}

                          {variant?.rearACVents && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Rear A/C Vents</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.rearACVents}</span>
                            </div>
                          )}

                          {variant?.frontArmrest && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Front Armrest</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.frontArmrest}</span>
                            </div>
                          )}

                          {variant?.automaticClimateControl && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Automatic Climate Control</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.automaticClimateControl}</span>
                            </div>
                          )}

                          {variant?.airQualityIndexDisplay && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Air Quality Index Display</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.airQualityIndexDisplay}</span>
                            </div>
                          )}

                          {variant?.remoteEngineStartStop && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Remote Engine Start / Stop</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.remoteEngineStartStop}</span>
                            </div>
                          )}

                          {variant?.remoteClimateControl && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Remote Climate Control</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.remoteClimateControl}</span>
                            </div>
                          )}

                          {variant?.steeringAdjustment && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Steering Adjustment</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.steeringAdjustment}</span>
                            </div>
                          )}

                          {variant?.steeringWheelMaterial && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Steering Wheel Material</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.steeringWheelMaterial}</span>
                            </div>
                          )}

                          {variant?.parkingSensors && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Parking Sensors</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.parkingSensors}</span>
                            </div>
                          )}

                          {variant?.keylessEntry && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Keyless Entry</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.keylessEntry}</span>
                            </div>
                          )}

                          {variant?.engineStartStopButton && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Engine Start Stop Button</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.engineStartStopButton}</span>
                            </div>
                          )}

                          {variant?.gloveCompartment && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Glove Compartment</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.gloveCompartment}</span>
                            </div>
                          )}

                          {variant?.centerConsoleArmrest && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Center Console Armrest</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.centerConsoleArmrest}</span>
                            </div>
                          )}

                          {variant?.rearArmrest && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Rear Armrest</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.rearArmrest}</span>
                            </div>
                          )}

                          {variant?.insideRearViewMirror && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Inside Rear View Mirror</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.insideRearViewMirror}</span>
                            </div>
                          )}

                          {variant?.outsideRearViewMirrors && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Outside Rear View Mirrors</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.outsideRearViewMirrors}</span>
                            </div>
                          )}

                          {variant?.steeringMountedControls && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Steering Mounted Controls</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.steeringMountedControls}</span>
                            </div>
                          )}

                          {variant?.rearWindshieldDefogger && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Rear Windshield Defogger</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.rearWindshieldDefogger}</span>
                            </div>
                          )}

                          {variant?.frontWindshieldDefogger && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Front Windshield Defogger</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.frontWindshieldDefogger}</span>
                            </div>
                          )}

                          {variant?.cooledGlovebox && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Cooled Glovebox</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.cooledGlovebox}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View More/Less Button */}
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => toggleSpecSection('comfort')}
                          className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-red-50"
                        >
                          <span>{expandedSpecs['comfort'] ? 'View less' : 'View more'}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expandedSpecs['comfort'] ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Safety */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleSpecSection('safety')}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900">Safety</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSpecs['safety'] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Content - Only visible when expanded */}
                  {expandedSpecs['safety'] && (
                    <div className="px-6 pb-6">
                      {/* Preview specs */}
                      <div className="space-y-4">
                        {showSkeleton ? (
                          /* Skeleton loading */
                          <>
                            {[1, 2].map((index) => (
                              <div key={index} className="flex justify-between items-center py-2">
                                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Show first 2 specs */}
                            {variant?.globalNCAPRating && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Global NCAP Rating</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.globalNCAPRating}</span>
                              </div>
                            )}

                            {variant?.airbags && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Airbags</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.airbags}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedSpecs['safety'] && !showSkeleton && (
                        <div className="mt-4 space-y-4">
                          {/* Airbags Location - Only show if data exists */}
                          {variant?.airbagsLocation && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Airbags Location</span>
                              <span className="text-gray-900 text-sm">{variant.airbagsLocation}</span>
                            </div>
                          )}

                          {/* ADAS Level - Only show if data exists */}
                          {variant?.adasLevel && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">ADAS Level</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.adasLevel}</span>
                            </div>
                          )}

                          {/* ADAS Features - Only show if data exists */}
                          {variant?.adasFeatures && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">ADAS Features</span>
                              <span className="text-gray-900 text-sm leading-relaxed">{variant.adasFeatures}</span>
                            </div>
                          )}

                          {/* Reverse Camera - Only show if data exists */}
                          {variant?.reverseCamera && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Reverse Camera</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.reverseCamera}</span>
                            </div>
                          )}

                          {/* Reverse Camera Guidelines - Only show if data exists */}
                          {variant?.reverseCameraGuidelines && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Reverse Camera Guidelines</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.reverseCameraGuidelines}</span>
                            </div>
                          )}

                          {/* Tyre Pressure Monitor (TPMS) - Only show if data exists */}
                          {variant?.tyrePressureMonitor && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Tyre Pressure Monitor (TPMS)</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.tyrePressureMonitor}</span>
                            </div>
                          )}

                          {/* Hill Hold Assist - Only show if data exists */}
                          {variant?.hillHoldAssist && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Hill Hold Assist</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.hillHoldAssist}</span>
                            </div>
                          )}

                          {/* Hill Descent Control - Only show if data exists */}
                          {variant?.hillDescentControl && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Hill Descent Control</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.hillDescentControl}</span>
                            </div>
                          )}

                          {/* Roll Over Mitigation - Only show if data exists */}
                          {variant?.rollOverMitigation && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Roll Over Mitigation</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.rollOverMitigation}</span>
                            </div>
                          )}

                          {/* Parking Sensor - Only show if data exists */}
                          {variant?.parkingSensor && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Parking Sensor</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.parkingSensor}</span>
                            </div>
                          )}

                          {/* Disc Brakes - Only show if data exists */}
                          {variant?.discBrakes && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Disc Brakes</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.discBrakes}</span>
                            </div>
                          )}

                          {/* Electronic Stability Program - Only show if data exists */}
                          {variant?.electronicStabilityProgram && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Electronic Stability Program</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.electronicStabilityProgram}</span>
                            </div>
                          )}

                          {/* ABS - Only show if data exists */}
                          {variant?.abs && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">ABS</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.abs}</span>
                            </div>
                          )}

                          {/* EBD - Only show if data exists */}
                          {variant?.ebd && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">EBD</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.ebd}</span>
                            </div>
                          )}

                          {/* Brake Assist (BA) - Only show if data exists */}
                          {variant?.brakeAssist && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Brake Assist (BA)</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.brakeAssist}</span>
                            </div>
                          )}

                          {/* ISOFIX Mounts - Only show if data exists */}
                          {variant?.isofixMounts && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">ISOFIX Mounts</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.isofixMounts}</span>
                            </div>
                          )}

                          {/* Seatbelt Warning - Only show if data exists */}
                          {variant?.seatbeltWarning && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Seatbelt Warning</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.seatbeltWarning}</span>
                            </div>
                          )}

                          {/* Speed Alert System - Only show if data exists */}
                          {variant?.speedAlertSystem && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Speed Alert System</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.speedAlertSystem}</span>
                            </div>
                          )}

                          {/* Speed Sensing Door Locks - Only show if data exists */}
                          {variant?.speedSensingDoorLocks && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Speed Sensing Door Locks</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.speedSensingDoorLocks}</span>
                            </div>
                          )}

                          {/* Immobiliser - Only show if data exists */}
                          {variant?.immobiliser && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Immobiliser</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.immobiliser}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View More/Less Button */}
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => toggleSpecSection('safety')}
                          className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-red-50"
                        >
                          <span>{expandedSpecs['safety'] ? 'View less' : 'View more'}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expandedSpecs['safety'] ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Entertainment & Connectivity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleSpecSection('entertainment')}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900">Entertainment & Connectivity</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSpecs['entertainment'] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Content - Only visible when expanded */}
                  {expandedSpecs['entertainment'] && (
                    <div className="px-6 pb-6">
                      {/* Specs */}
                      <div className="space-y-4">
                        {showSkeleton ? (
                          /* Skeleton loading */
                          <>
                            {[1, 2].map((index) => (
                              <div key={index} className="flex justify-between items-center py-2">
                                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Show first 2 specs */}
                            {variant?.touchScreenInfotainment && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Touch Screen Infotainment</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.touchScreenInfotainment}</span>
                              </div>
                            )}

                            {variant?.androidAppleCarplay && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Android & Apple CarPlay</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.androidAppleCarplay}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedSpecs['entertainment'] && !showSkeleton && (
                        <div className="mt-4 space-y-4">

                          {/* Speakers - Only show if data exists */}
                          {variant?.speakers && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Speakers</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.speakers}</span>
                            </div>
                          )}

                          {/* Tweeters - Only show if data exists */}
                          {variant?.tweeters && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Tweeters</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.tweeters}</span>
                            </div>
                          )}

                          {/* Subwoofers - Only show if data exists */}
                          {variant?.subwoofers && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Subwoofers</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.subwoofers}</span>
                            </div>
                          )}

                          {/* USB-C Charging Ports - Only show if data exists */}
                          {variant?.usbCChargingPorts && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">USB-C Charging Ports</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.usbCChargingPorts}</span>
                            </div>
                          )}

                          {/* USB-A Charging Ports - Only show if data exists */}
                          {variant?.usbAChargingPorts && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">USB-A Charging Ports</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.usbAChargingPorts}</span>
                            </div>
                          )}

                          {/* 12V Charging Ports - Only show if data exists */}
                          {variant?.twelvevChargingPorts && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">12V Charging Ports</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.twelvevChargingPorts}</span>
                            </div>
                          )}

                          {/* Wireless Charging - Only show if data exists */}
                          {variant?.wirelessCharging && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Wireless Charging</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.wirelessCharging}</span>
                            </div>
                          )}

                          {/* Connected Car Tech - Only show if data exists */}
                          {variant?.connectedCarTech && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Connected Car Tech</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.connectedCarTech}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View More/Less Button */}
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => toggleSpecSection('entertainment')}
                          className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                        >
                          <span>{expandedSpecs['entertainment'] ? 'View less' : 'View more'}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['entertainment'] ? 'rotate-270' : 'rotate-90'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Engine & Transmission */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleSpecSection('engine')}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900">Engine & Transmission</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSpecs['engine'] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Content - Only visible when expanded */}
                  {expandedSpecs['engine'] && (
                    <div className="px-6 pb-6">
                      {/* Specs */}
                      <div className="space-y-4">
                        {showSkeleton ? (
                          /* Skeleton loading */
                          <>
                            {[1, 2].map((index) => (
                              <div key={index} className="flex justify-between items-center py-2">
                                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Show first 2 specs */}
                            {variant?.engineNamePage4 && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Engine Name</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.engineNamePage4}</span>
                              </div>
                            )}

                            {variant?.engineCapacity && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Engine Capacity</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.engineCapacity}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedSpecs['engine'] && !showSkeleton && (
                        <div className="mt-4 space-y-4">
                          {/* Fuel - Only show if data exists */}
                          {variant?.fuel && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Fuel</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.fuel}</span>
                            </div>
                          )}

                          {/* Transmission - Only show if data exists */}
                          {variant?.transmission && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Transmission</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.transmission}</span>
                            </div>
                          )}

                          {/* No of Gears - Only show if data exists */}
                          {variant?.noOfGears && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">No of Gears</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.noOfGears}</span>
                            </div>
                          )}

                          {/* Paddle Shifter - Only show if data exists */}
                          {variant?.paddleShifter && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Paddle Shifter</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.paddleShifter}</span>
                            </div>
                          )}

                          {/* Max Power - Only show if data exists */}
                          {variant?.maxPower && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Max Power</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.maxPower}</span>
                            </div>
                          )}

                          {/* Torque - Only show if data exists */}
                          {variant?.torque && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Torque</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.torque}</span>
                            </div>
                          )}

                          {/* 0 to 100 Kmph Time - Only show if data exists */}
                          {variant?.zeroToHundredKmphTime && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">0 to 100 Kmph Time</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.zeroToHundredKmphTime}</span>
                            </div>
                          )}

                          {/* Top Speed - Only show if data exists */}
                          {variant?.topSpeed && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">
                                {isElectric ? 'Driving Range' : 'Top Speed'}
                              </span>
                              <span className="text-gray-900 text-sm font-medium">{variant.topSpeed}</span>
                            </div>
                          )}

                          {/* EV Battery Capacity - Only show if data exists */}
                          {variant?.evBatteryCapacity && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">EV Battery Capacity</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.evBatteryCapacity}</span>
                            </div>
                          )}

                          {/* Hybrid Battery Capacity - Only show if data exists */}
                          {variant?.hybridBatteryCapacity && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Hybrid Battery Capacity</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.hybridBatteryCapacity}</span>
                            </div>
                          )}

                          {/* Battery Type - Only show if data exists */}
                          {variant?.batteryType && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Battery Type</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.batteryType}</span>
                            </div>
                          )}

                          {/* Electric Motor Placement - Only show if data exists */}
                          {variant?.electricMotorPlacement && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Electric Motor Placement</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.electricMotorPlacement}</span>
                            </div>
                          )}

                          {/* EV Range - Only show if data exists */}
                          {variant?.evRange && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">EV Range</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.evRange}</span>
                            </div>
                          )}

                          {/* EV Charging Time - Only show if data exists */}
                          {variant?.evChargingTime && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">EV Charging Time</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.evChargingTime}</span>
                            </div>
                          )}

                          {/* Max Electric Motor Power - Only show if data exists */}
                          {variant?.maxElectricMotorPower && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Max Electric Motor Power</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.maxElectricMotorPower}</span>
                            </div>
                          )}

                          {/* Turbo Charged - Only show if data exists */}
                          {variant?.turboCharged && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Turbo Charged</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.turboCharged}</span>
                            </div>
                          )}

                          {/* Hybrid Type - Only show if data exists */}
                          {variant?.hybridType && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Hybrid Type</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.hybridType}</span>
                            </div>
                          )}

                          {/* Drive Train - Only show if data exists */}
                          {variant?.driveTrain && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Drive Train</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.driveTrain}</span>
                            </div>
                          )}

                          {/* Driving Modes - Only show if data exists */}
                          {variant?.drivingModes && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Driving Modes</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.drivingModes}</span>
                            </div>
                          )}

                          {/* Off Road Modes - Only show if data exists */}
                          {variant?.offRoadModes && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Off Road Modes</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.offRoadModes}</span>
                            </div>
                          )}

                          {/* Differential Lock - Only show if data exists */}
                          {variant?.differentialLock && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Differential Lock</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.differentialLock}</span>
                            </div>
                          )}

                          {/* Limited Slip Differential - Only show if data exists */}
                          {variant?.limitedSlipDifferential && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Limited Slip Differential</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.limitedSlipDifferential}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View More/Less Button */}
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => toggleSpecSection('engine')}
                          className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                        >
                          <span>{expandedSpecs['engine'] ? 'View less' : 'View more'}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['engine'] ? 'rotate-270' : 'rotate-90'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Seating Comfort */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleSpecSection('seating')}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900">Seating Comfort</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSpecs['seating'] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Content - Only visible when expanded */}
                  {expandedSpecs['seating'] && (
                    <div className="px-6 pb-6">
                      {/* Specs */}
                      <div className="space-y-4">
                        {showSkeleton ? (
                          /* Skeleton loading */
                          <>
                            {[1, 2].map((index) => (
                              <div key={index} className="flex justify-between items-center py-2">
                                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Show first 2 specs */}
                            {variant?.seatUpholstery && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Seat Upholstery</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.seatUpholstery}</span>
                              </div>
                            )}

                            {variant?.seatsAdjustment && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Seats Adjustment</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.seatsAdjustment}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedSpecs['seating'] && !showSkeleton && (
                        <div className="mt-4 space-y-4">
                          {variant?.driverSeatAdjustment && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Driver Seat Adjustment</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.driverSeatAdjustment}</span>
                            </div>
                          )}

                          {variant?.passengerSeatAdjustment && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Passenger Seat Adjustment</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.passengerSeatAdjustment}</span>
                            </div>
                          )}

                          {variant?.rearSeatAdjustment && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Rear Seat Adjustment</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.rearSeatAdjustment}</span>
                            </div>
                          )}

                          {variant?.welcomeSeats && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Welcome Seats</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.welcomeSeats}</span>
                            </div>
                          )}

                          {variant?.memorySeats && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Memory Seats</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.memorySeats}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View More/Less Button */}
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => toggleSpecSection('seating')}
                          className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                        >
                          <span>{expandedSpecs['seating'] ? 'View less' : 'View more'}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['seating'] ? 'rotate-270' : 'rotate-90'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Exteriors */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleSpecSection('exteriors')}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900">Exteriors</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSpecs['exteriors'] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Content - Only visible when expanded */}
                  {expandedSpecs['exteriors'] && (
                    <div className="px-6 pb-6">
                      {/* Specs */}
                      <div className="space-y-4">
                        {showSkeleton ? (
                          /* Skeleton loading */
                          <>
                            {[1, 2].map((index) => (
                              <div key={index} className="flex justify-between items-center py-2">
                                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Show first 2 specs */}
                            {variant?.headLights && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Head Lights</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.headLights}</span>
                              </div>
                            )}

                            {variant?.tailLight && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Tail Light</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.tailLight}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedSpecs['exteriors'] && !showSkeleton && (
                        <div className="mt-4 space-y-4">
                          {variant?.frontFogLights && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Front Fog Lights</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.frontFogLights}</span>
                            </div>
                          )}

                          {variant?.roofRails && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Roof Rails</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.roofRails}</span>
                            </div>
                          )}

                          {variant?.radioAntenna && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Radio Antenna</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.radioAntenna}</span>
                            </div>
                          )}

                          {variant?.outsideRearViewMirror && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Outside Rear View Mirror</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.outsideRearViewMirror}</span>
                            </div>
                          )}

                          {variant?.daytimeRunningLights && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Daytime Running Lights</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.daytimeRunningLights}</span>
                            </div>
                          )}

                          {variant?.sideIndicator && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Side Indicator</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.sideIndicator}</span>
                            </div>
                          )}

                          {variant?.rearWindshieldWiper && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Rear Windshield Wiper</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.rearWindshieldWiper}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View More/Less Button */}
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => toggleSpecSection('exteriors')}
                          className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                        >
                          <span>{expandedSpecs['exteriors'] ? 'View less' : 'View more'}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['exteriors'] ? 'rotate-270' : 'rotate-90'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dimensions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleSpecSection('dimensions')}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900">Dimensions</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSpecs['dimensions'] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Content - Only visible when expanded */}
                  {expandedSpecs['dimensions'] && (
                    <div className="px-6 pb-6">
                      {/* Specs */}
                      <div className="space-y-4">
                        {showSkeleton ? (
                          /* Skeleton loading */
                          <>
                            {[1, 2].map((index) => (
                              <div key={index} className="flex justify-between items-center py-2">
                                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Show first 2 specs */}
                            {variant?.groundClearance && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Ground Clearance</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.groundClearance}</span>
                              </div>
                            )}

                            {variant?.length && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Length</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.length}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedSpecs['dimensions'] && !showSkeleton && (
                        <div className="mt-4 space-y-4">
                          {variant?.width && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Width</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.width}</span>
                            </div>
                          )}

                          {variant?.height && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Height</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.height}</span>
                            </div>
                          )}

                          {variant?.wheelbase && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Wheelbase</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.wheelbase}</span>
                            </div>
                          )}

                          {variant?.turningRadius && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Turning Radius</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.turningRadius}</span>
                            </div>
                          )}

                          {variant?.kerbWeight && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Kerb Weight</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.kerbWeight}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View More/Less Button */}
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => toggleSpecSection('dimensions')}
                          className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                        >
                          <span>{expandedSpecs['dimensions'] ? 'View less' : 'View more'}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['dimensions'] ? 'rotate-270' : 'rotate-90'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tyre & Suspension */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleSpecSection('tyre')}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900">Tyre & Suspension</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSpecs['tyre'] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Content - Only visible when expanded */}
                  {expandedSpecs['tyre'] && (
                    <div className="px-6 pb-6">
                      {/* Specs */}
                      <div className="space-y-4">
                        {showSkeleton ? (
                          /* Skeleton loading */
                          <>
                            {[1, 2].map((index) => (
                              <div key={index} className="flex justify-between items-center py-2">
                                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Show first 2 specs */}
                            {variant?.frontTyreProfile && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Front Tyre Profile</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.frontTyreProfile}</span>
                              </div>
                            )}

                            {variant?.rearTyreProfile && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Rear Tyre Profile</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.rearTyreProfile}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedSpecs['tyre'] && !showSkeleton && (
                        <div className="mt-4 space-y-4">
                          {variant?.spareTyreProfile && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Spare Tyre Profile</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.spareTyreProfile}</span>
                            </div>
                          )}

                          {variant?.spareWheelType && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Spare Wheel Type</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.spareWheelType}</span>
                            </div>
                          )}

                          {variant?.frontSuspension && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Front Suspension</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.frontSuspension}</span>
                            </div>
                          )}

                          {variant?.rearSuspension && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Rear Suspension</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.rearSuspension}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View More/Less Button */}
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => toggleSpecSection('tyre')}
                          className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                        >
                          <span>{expandedSpecs['tyre'] ? 'View less' : 'View more'}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['tyre'] ? 'rotate-270' : 'rotate-90'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Storage */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleSpecSection('storage')}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900">Storage</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedSpecs['storage'] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Content - Only visible when expanded */}
                  {expandedSpecs['storage'] && (
                    <div className="px-6 pb-6">
                      {/* Specs */}
                      <div className="space-y-4">
                        {showSkeleton ? (
                          /* Skeleton loading */
                          <>
                            {[1, 2].map((index) => (
                              <div key={index} className="flex justify-between items-center py-2">
                                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Show first 2 specs */}
                            {variant?.cupholders && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Cupholders</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.cupholders}</span>
                              </div>
                            )}

                            {variant?.fuelTankCapacity && (
                              <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Fuel Tank Capacity</span>
                                <span className="text-gray-900 text-sm font-medium">{variant.fuelTankCapacity}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedSpecs['storage'] && !showSkeleton && (
                        <div className="mt-4 space-y-4">
                          {variant?.bootSpace && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Boot Space</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.bootSpace}</span>
                            </div>
                          )}

                          {variant?.bootSpaceAfterFoldingRearRowSeats && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Boot Space After Folding Rear Row Seats</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.bootSpaceAfterFoldingRearRowSeats}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View More/Less Button */}
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => toggleSpecSection('storage')}
                          className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                        >
                          <span>{expandedSpecs['storage'] ? 'View less' : 'View more'}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['storage'] ? 'rotate-270' : 'rotate-90'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Section 4: AD Banner + More Variants */}
        <PageSection background="white" maxWidth="7xl">
          <div id="more-variants" className="space-y-8">
            {/* Ad Banner */}
            <Ad3DCarousel className="mb-6" />

            {/* More Variants Section */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">More {displayModelName} Variants</h2>

              {/* Filter Options - Dynamic based on available variants */}
              <div className="flex flex-wrap gap-3">
                {availableFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterToggle(filter)}
                    className={`px-4 py-2 rounded-lg transition-colors ${selectedFilters.includes(filter)
                      ? 'bg-[#291e6a] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Variant Cards - Dynamic (Show only 8) */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading variants...</p>
                  </div>
                ) : filteredVariants.length > 0 ? (
                  filteredVariants.slice(0, 8).map((variantItem) => (
                    <VariantCard
                      key={variantItem.id}
                      variant={variantItem}
                      onClick={() => {
                        const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                        const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')
                        // Keep original format for variant page URLs
                        const variantSlug = variantItem.name.toLowerCase().replace(/\s+/g, '-')
                        router.push(`/${brandSlug}-cars/${modelSlug}/${variantSlug}`)
                      }}
                      onGetPrice={(e) => {
                        e.stopPropagation()
                        const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                        const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')

                        // Get selected city from localStorage
                        const selectedCityValue = isMounted
                          ? localStorage.getItem('selectedCity') || 'Mumbai, Maharashtra'
                          : 'Mumbai, Maharashtra'
                        const citySlug = selectedCityValue.split(',')[0].toLowerCase().replace(/\s+/g, '-')

                        // Use same normalization as price breakup page for consistent matching
                        const varSlug = variantItem.name
                          ?.toLowerCase()
                          .replace(/\s*\([^)]*\)/g, '-')  // Replace " (O)" with "-"
                          .replace(/[()]/g, '')            // Remove remaining parentheses
                          .replace(/\s+/g, '-')            // Spaces to hyphens
                          .replace(/[^a-z0-9-]/g, '')      // Remove special chars
                          .replace(/-+/g, '-')             // Multiple hyphens to single
                          .replace(/^-|-$/g, '')           // Remove leading/trailing

                        // Navigate directly to price-in route with variant parameter
                        router.push(`/${brandSlug}-cars/${modelSlug}/price-in-${citySlug}?variant=${varSlug}`)
                      }}
                      onCompare={(e) => e.stopPropagation()}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No variants found for the selected filter.</p>
                  </div>
                )}
              </div>

              {/* View All Variants Button - Only show if more than 8 variants */}
              {!loading && transformedVariants.length > 8 && (
                <div className="text-center pt-4">
                  <button
                    className="text-red-600 hover:text-orange-600 font-medium text-lg"
                    onClick={() => {
                      const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                      const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')
                      router.push(`/${brandSlug}-cars/${modelSlug}/variants`)
                    }}
                  >
                    View All {transformedVariants.length} Variants
                  </button>
                </div>
              )}
            </div>
          </div>
        </PageSection>

        {/* Section 5: Variant Summary, AD Banner, Engine & Mileage */}
        <PageSection background="white" maxWidth="7xl">
          <div id="engine-mileage" className="space-y-8">
            {/* Pros & Cons Section - Only show if backend data exists or dynamic data is generated */}
            {(expertReviewData?.pros || expertReviewData?.cons || model?.pros || model?.cons) && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{displayBrandName || 'Car'} {displayModelName || 'Model'} {displayVariantName} Pros and Cons - Should You Buy?</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pros Column */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V4a2 2 0 012-2h2.343M7 12h4m-4 0v8-8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Pros</h3>
                    </div>

                    <ul className="space-y-4">
                      {(() => {
                        const rawPros = expertReviewData?.pros || model?.pros || []
                        const prosList = Array.isArray(rawPros) ? rawPros : []
                        return prosList.slice(0, showAllPros ? undefined : 2).map((pro, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              {pro}
                            </p>
                          </li>
                        ))
                      })()}
                    </ul>

                    <button
                      onClick={() => setShowAllPros(!showAllPros)}
                      className="text-red-500 hover:text-red-600 text-base font-normal mt-4"
                    >
                      {showAllPros ? 'Show less' : '...more'}
                    </button>
                  </div>

                  {/* Cons Column */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Cons</h3>
                    </div>

                    <ul className="space-y-4">
                      {(() => {
                        const rawCons = expertReviewData?.cons || model?.cons || []
                        const consList = Array.isArray(rawCons) ? rawCons : []
                        return consList.slice(0, showAllCons ? undefined : 2).map((con, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              {con}
                            </p>
                          </li>
                        ))
                      })()}
                    </ul>

                    <button
                      onClick={() => setShowAllCons(!showAllCons)}
                      className="text-red-500 hover:text-red-600 text-base font-normal mt-4"
                    >
                      {showAllCons ? 'Show less' : '...more'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Variant Summary Section */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{displayModelName} {displayVariantName} Summary</h2>

              <div className="space-y-6">
                {/* Description - Only show if backend data exists */}
                {(variant?.description || model?.description) && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <h3 className="text-lg font-bold text-gray-900">Description</h3>
                    </div>
                    <div className={`relative ${!showSummaryDescription ? 'max-h-[6rem] overflow-hidden' : ''} transition-all duration-300`}>
                      <ul className="space-y-2">
                        {parseBulletPoints(variant?.description || model?.description || '').map((point: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span className="text-gray-700 text-base leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                      {!showSummaryDescription && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowSummaryDescription(!showSummaryDescription)}
                      className="text-red-500 hover:text-red-600 font-normal text-base transition-colors mt-2 flex items-center gap-1"
                    >
                      {showSummaryDescription ? 'Read Less' : 'Read More'}
                    </button>
                  </div>
                )}

                {/* Exterior Design - Only show if backend data exists */}
                {(variant?.exteriorDesign || model?.exteriorDesign) && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <h3 className="text-lg font-bold text-gray-900">Exterior Design</h3>
                    </div>
                    <div className={`relative ${!showSummaryExterior ? 'max-h-[6rem] overflow-hidden' : ''} transition-all duration-300`}>
                      <ul className="space-y-2">
                        {parseBulletPoints(variant?.exteriorDesign || model?.exteriorDesign || '').map((point: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span className="text-gray-700 text-base leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                      {!showSummaryExterior && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowSummaryExterior(!showSummaryExterior)}
                      className="text-red-500 hover:text-red-600 font-normal text-base transition-colors mt-2 flex items-center gap-1"
                    >
                      {showSummaryExterior ? 'Read Less' : 'Read More'}
                    </button>
                  </div>
                )}

                {/* Comfort & Convenience - Only show if backend data exists */}
                {(variant?.comfortConvenience || model?.comfortConvenience) && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <h3 className="text-lg font-bold text-gray-900">Comfort & Convenience</h3>
                    </div>
                    <div className={`relative ${!showSummaryComfort ? 'max-h-[6rem] overflow-hidden' : ''} transition-all duration-300`}>
                      <ul className="space-y-2">
                        {parseBulletPoints(variant?.comfortConvenience || model?.comfortConvenience || '').map((point: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span className="text-gray-700 text-base leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                      {!showSummaryComfort && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowSummaryComfort(!showSummaryComfort)}
                      className="text-red-500 hover:text-red-600 font-normal text-base transition-colors mt-2 flex items-center gap-1"
                    >
                      {showSummaryComfort ? 'Read Less' : 'Read More'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Ad Banner */}
            <Ad3DCarousel className="mb-6" />

            {/* Engine Section */}
            <div className="space-y-6">
              {/* Dynamic title based on fuel type */}
              {(() => {
                const isEV = currentVariantData?.fuelType?.toLowerCase() === 'electric' || displayModelName?.toLowerCase().includes('ev') || displayModelName?.toLowerCase().includes('electric') || displayVariantName?.toLowerCase().includes('electric')
                return (
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    {displayModelName} {displayVariantName} {isEV ? 'Motor & Battery' : 'Engine'}
                  </h2>
                )
              })()}

              <div className="space-y-3 sm:space-y-4">
                {(() => {
                  const isEV = currentVariantData?.fuelType?.toLowerCase() === 'electric' || displayModelName?.toLowerCase().includes('ev') || displayModelName?.toLowerCase().includes('electric') || displayVariantName?.toLowerCase().includes('electric')

                  return (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {/* Engine Header - Always Visible */}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#291e6a] rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs sm:text-sm">1</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                              {variant?.engineName || currentVariantData?.engine}
                            </h3>
                          </div>
                          <button
                            onClick={() => setExpandedEngine(!expandedEngine)}
                            className="text-red-500 hover:text-red-600 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0"
                          >
                            {expandedEngine ? 'Show Less' : 'Read More'}
                          </button>
                        </div>

                        {/* Collapsed Preview */}
                        {!expandedEngine && variant?.engineSummary && (
                          <ul className="mt-3">
                            {parseBulletPoints(variant.engineSummary).slice(0, 1).map((point: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                                <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {!expandedEngine && !variant?.engineSummary && (
                          <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                            {isEV
                              ? `High-performance electric motor delivering instant torque and smooth acceleration.`
                              : `Suitable for both city driving and highway cruising. The ${variant?.engineName || currentVariantData?.engine} engine offers excellent fuel efficiency with smooth acceleration.`
                            }
                          </p>
                        )}
                      </div>

                      {/* Expanded Content */}
                      {expandedEngine && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                          {/* Backend engine summary with bullet points */}
                          {variant?.engineSummary ? (
                            <>
                              <ul className="space-y-2 mb-4 sm:mb-6">
                                {parseBulletPoints(variant.engineSummary).map((point: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                                    <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Engine Specs from backend - Mobile Optimized */}
                              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                {/* Transmission Label */}
                                <h4 className="font-bold text-gray-900 mb-3 text-center text-sm sm:text-base uppercase tracking-wide">
                                  {(() => {
                                    const trans = variant?.engineTransmission || variant?.transmission || currentVariantData?.transmission
                                    if (isEV) return 'Single Speed Reduction Gear'
                                    return trans?.toLowerCase() === 'manual' ? 'Manual' : trans?.toUpperCase()
                                  })()}
                                </h4>

                                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                                  <div className="p-2 sm:p-0">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Power:</p>
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight">
                                      {variant?.enginePower || currentVariantData?.power}
                                    </p>
                                  </div>
                                  <div className="p-2 sm:p-0">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Torque:</p>
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight">
                                      {isEV ? 'Instant Torque' : (variant?.engineTorque || currentVariantData?.torque)}
                                    </p>
                                  </div>
                                  <div className="p-2 sm:p-0">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">
                                      {isEV ? 'Range:' : 'Top Speed:'}
                                    </p>
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight">
                                      {variant?.engineSpeed || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-gray-700 text-sm leading-relaxed mb-4 sm:mb-6">
                                {isEV
                                  ? `The electric motor provides instant torque delivery for quick acceleration. It offers a perfect balance between performance and efficiency, making it ideal for daily commuting and long-distance travel with zero emissions.`
                                  : `Suitable for both city driving and highway cruising. The ${variant?.engineName || currentVariantData?.engine} engine offers excellent fuel efficiency with smooth acceleration. It provides a perfect balance between performance and economy, making it ideal for daily commuting and long-distance travel.`
                                }
                              </p>

                              {/* Engine Specs */}
                              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                <h4 className="font-bold text-gray-900 mb-3 text-center text-sm sm:text-base uppercase tracking-wide">
                                  {(() => {
                                    const trans = variant?.engineTransmission || variant?.transmission || currentVariantData?.transmission
                                    if (isEV) return 'Single Speed Reduction Gear'
                                    return trans?.toLowerCase() === 'manual' ? 'Manual' : trans?.toUpperCase()
                                  })()}
                                </h4>

                                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                                  <div className="p-2 sm:p-0">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Power:</p>
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">{variant?.enginePower || currentVariantData?.power}</p>
                                  </div>
                                  <div className="p-2 sm:p-0">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Torque:</p>
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                      {isEV ? 'Instant Torque' : (variant?.engineTorque || currentVariantData?.torque)}
                                    </p>
                                  </div>
                                  <div className="p-2 sm:p-0">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">
                                      {isEV ? 'Range:' : 'Top Speed:'}
                                    </p>
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">{variant?.engineSpeed || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Mileage Section - Only show if backend mileage data exists */}
            {(variant?.mileageCompanyClaimed || variant?.mileageCityRealWorld || variant?.mileageHighwayRealWorld) && (
              <div className="space-y-6">
                {(() => {
                  const isEV = currentVariantData?.fuelType?.toLowerCase() === 'electric' || displayModelName?.toLowerCase().includes('ev') || displayModelName?.toLowerCase().includes('electric') || displayVariantName?.toLowerCase().includes('electric')

                  return (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                        {displayModelName} {displayVariantName} {isEV ? 'Driving Range' : 'Mileage'}
                      </h2>

                      <div className="flex justify-center">
                        <div className="w-64 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
                          {/* Engine/Battery Header - Dynamic for EVs */}
                          <div className="text-center mb-4">
                            <h3 className="text-red-500 font-bold text-sm mb-1">
                              {isEV ? 'Battery & Range' : 'Engine & Transmission'}
                            </h3>
                            <h4 className="text-red-500 font-bold text-base mb-1">
                              {variant?.mileageEngineName || variant?.engineName || currentVariantData?.engine}
                            </h4>
                          </div>

                          {/* Mileage/Range Details */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-gray-600 text-sm">
                                {isEV ? 'Range (Claimed)' : 'Company Claimed'}
                              </span>
                              <span className="text-gray-900 font-bold text-sm">
                                {variant?.mileageCompanyClaimed} {isEV ? 'km' : 'Kmpl'}
                              </span>
                            </div>

                            {variant?.mileageCityRealWorld && (
                              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">
                                  {isEV ? 'City Range' : 'City Real World'}
                                </span>
                                <span className="text-gray-900 font-bold text-sm">
                                  {variant?.mileageCityRealWorld} {isEV ? 'km' : 'Kmpl'}
                                </span>
                              </div>
                            )}

                            {variant?.mileageHighwayRealWorld && (
                              <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 text-sm">
                                  {isEV ? 'Highway Range' : 'Highway Real World'}
                                </span>
                                <span className="text-gray-900 font-bold text-sm">
                                  {variant?.mileageHighwayRealWorld} {isEV ? 'km' : 'Kmpl'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}

            {/* Expert Review Section - Integrated after Mileage */}
            {variantForReview && (
              <div id="expert-review" className="scroll-mt-24">
                <ExpertReviewSection model={variantForReview} />
              </div>
            )}
          </div>
        </PageSection>

        {/* Section 6: City On-Road Prices, AD Banner & Upcoming Cars */}
        <PageSection background="white" maxWidth="7xl">
          <div id="price-across-india" className="space-y-8">
            {/* Ad Banner */}
            <Ad3DCarousel className="mb-6" />
          </div>
        </PageSection>

        {/* Section 7: New Launched Cars, AD Banner & Feedback */}
        <PageSection background="white" maxWidth="7xl">
          <div id="similar-cars" className="space-y-12">
            {/* Similar Cars Section - Same as Model Page */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                Similar Cars To {displayModelName || 'model'}
              </h2>

              {/* Cars Horizontal Scroll */}
              <div className="relative">
                {!model ? (
                  <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="h-48 bg-gray-200 animate-pulse"></div>
                        <div className="p-5 space-y-3">
                          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                          <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (model?.similarCars || []).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No similar cars found</p>
                  </div>
                ) : (
                  <div className="relative group">
                    {/* Left Scroll Arrow */}
                    <button
                      onClick={() => {
                        const container = document.getElementById('variant-similar-scroll')
                        container?.scrollBy({ left: -300, behavior: 'smooth' })
                      }}
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                      aria-label="Scroll left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const container = document.getElementById('variant-similar-scroll')
                        container?.scrollBy({ left: 300, behavior: 'smooth' })
                      }}
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                      aria-label="Scroll right"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div
                      id="variant-similar-scroll"
                      className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {(model?.similarCars || []).filter((car: any) => (car.startingPrice || 0) > 100000).map((car: any) => {
                        const transformedCar = {
                          id: car.id,
                          name: car.name,
                          brand: car.brand || car.brandName,
                          brandName: car.brandName,
                          image: car.image || '/placeholder-car.png',
                          startingPrice: car.startingPrice,
                          lowestPriceFuelType: car.fuelTypes?.[0] || 'Petrol',
                          fuelTypes: car.fuelTypes || ['Petrol'],
                          transmissions: car.transmissionTypes || ['Manual'],
                          seating: car.seating || 5,
                          launchDate: car.launchDate || 'Recently Launched',
                          slug: car.slug || car.brandName?.toLowerCase().replace(/\s+/g, '-') + '-' + car.name?.toLowerCase().replace(/\s+/g, '-'),
                          isNew: car.isNew || false,
                          isPopular: car.isPopular || false
                        }

                        return (
                          <CarCard
                            key={car.id}
                            car={transformedCar}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Compare With Similar Cars Section - Same as Model Page */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Compare With Similar Cars</h2>

              {/* Comparison Cards - Horizontal Scroll */}
              <div className="relative">
                {!model ? (
                  <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 p-4">
                        <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (model?.similarCars || []).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No cars available for comparison</p>
                  </div>
                ) : (
                  <div
                    className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4"
                    style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
                  >
                    {(model?.similarCars || []).filter((car: any) => (car.startingPrice || 0) > 100000).map((car: any) => {
                      const modelStartingPrice = model?.startingPrice || variant?.price || 0
                      const currentModelOnRoad = getOnRoadPrice(modelStartingPrice, 'Petrol')
                      const compareCarOnRoad = getOnRoadPrice(car.startingPrice, car.fuelTypes?.[0] || 'Petrol')

                      return (
                        <div key={car.id} className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-300">
                          {/* Side by Side Layout with VS Badge */}
                          <div className="flex items-start gap-2 mb-3">
                            {/* Current Model */}
                            <div className="flex-1">
                              <div className="relative mb-2 h-20">
                                <OptimizedImage
                                  src={model?.heroImage || ''}
                                  alt={displayBrandName + ' ' + displayModelName}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="text-left">
                                <div className="text-xs text-gray-500">{displayBrandName}</div>
                                <div className="font-bold text-sm text-gray-900 mb-1">{displayModelName}</div>
                                <div className="text-red-600 font-bold text-sm">
                                  Rs. {(currentModelOnRoad / 100000).toFixed(2)} Lakh
                                </div>
                                <div className="text-xs text-gray-500">Price</div>
                              </div>
                            </div>

                            {/* VS Badge */}
                            <div className="flex items-center justify-center" style={{ marginTop: '30px' }}>
                              <div className="w-8 h-8 rounded-full bg-[#291e6a] flex items-center justify-center shadow-md">
                                <span className="text-white text-xs font-bold">VS</span>
                              </div>
                            </div>

                            {/* Similar Car */}
                            <div className="flex-1">
                              <div className="relative mb-2 h-20">
                                <OptimizedImage
                                  src={car.image || '/placeholder-car.png'}
                                  alt={car.brandName + ' ' + car.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="text-left">
                                <div className="text-xs text-gray-500">{car.brandName}</div>
                                <div className="font-bold text-sm text-gray-900 mb-1">{car.name}</div>
                                <div className="text-red-600 font-bold text-sm">
                                  Rs. {(compareCarOnRoad / 100000).toFixed(2)} Lakh
                                </div>
                                <div className="text-xs text-gray-500">Price</div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              const currentModelSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-') + '-' + displayModelName?.toLowerCase().replace(/\s+/g, '-')
                              const compareModelSlug = car.brandName.toLowerCase().replace(/\s+/g, '-') + '-' + car.name.toLowerCase().replace(/\s+/g, '-')
                              router.push('/compare/' + currentModelSlug + '-vs-' + compareModelSlug)
                            }}
                            className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-sm"
                          >
                            Compare Now
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Compare Cars of Your Choice Button */}
              <div className="text-center">
                <button className="w-full max-w-md bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 py-3 rounded-lg transition-all duration-200 font-medium">
                  Compare Cars of Your Choice
                </button>
              </div>
            </div>

            {/* Ad Banner */}
            <Ad3DCarousel className="mb-6" />
          </div>
        </PageSection>
      </div >

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

      <Breadcrumb
        items={[
          { label: displayBrandName || 'Brand', href: `/${(displayBrandName?.toLowerCase().replace(/\s+/g, '-') || 'brand')}-cars` },
          { label: displayModelName || 'Model', href: `/${(displayBrandName?.toLowerCase().replace(/\s+/g, '-') || 'brand')}-cars/${displayModelName?.toLowerCase().replace(/\s+/g, '-') || 'model'}` },
          { label: displayVariantName || 'Variant' }
        ]}
      />
      <Footer />

      {/* Image Gallery Modal for Highlights */}
      <ImageGalleryModal
        images={galleryImages}
        initialIndex={galleryInitialIndex}
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        carName={`${displayBrandName || 'Car'} ${displayModelName || 'Model'}`}
      />

      <TestDriveBottomBar onBookTestDrive={() => setIsLeadModalOpen(true)} />
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        carName={`${displayBrandName} ${displayModelName} ${displayVariantName}`}
      />
    </div >
  )
}
