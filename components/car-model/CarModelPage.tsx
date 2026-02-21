'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Star, Heart, Share2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ArrowRight, Calendar, Fuel, Users, Settings, IndianRupee, MapPin, Phone, MessageCircle, Zap, Shield, Award, TrendingUp, Clock, CheckCircle, Check, AlertCircle, Info, X, Plus, Minus, Eye, ExternalLink, Play, ThumbsUp, ThumbsDown, Wrench, DollarSign, User, Car, Camera, Landmark } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { renderTextWithCarLinks, useCarModelsData } from '@/lib/faq-hyperlinks'
import PageSection from '../common/PageSection'
import VariantCard from './VariantCard'
import Footer from '../Footer'
import { truncateCarName } from '@/lib/text-utils'
import { formatPrice, formatPriceRange } from '@/utils/priceFormatter'
import Breadcrumbs from '../common/Breadcrumbs'
import { OptimizedImage } from '../common/OptimizedImage'
import TestDriveBottomBar from '../common/TestDriveBottomBar'
import LeadFormModal from '../common/LeadFormModal'
import CarCard from '../home/CarCard'
import { saveVisitedModel } from '../home/CarsYouMightLike'
import { useViewTracker } from '@/lib/use-view-tracker'
import Ad3DCarousel from '../ads/Ad3DCarousel'
import ImageGalleryModal from '../common/ImageGalleryModal'
// Lazy-load heavy components for faster initial page load (CarWale-style optimization)
const ModelYouTube = dynamic(() => import('./ModelYouTube'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false
})
const ModelFAQ = dynamic(() => import('./ModelFAQ'), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false
})


import ModelOwnerReviews from './ModelOwnerReviews'
import ExpertReviewSection from './ExpertReviewSection'


interface ModelData {
  isUpcomingCar?: boolean
  id: string
  slug: string
  brandSlug: string
  brand: string
  name: string
  fuelTypes?: string[]
  reviews?: any[]
  heroImage: string
  gallery: string[]
  rating: number
  reviewCount: number
  seoDescription: string
  startingPrice: number
  endingPrice: number
  bodyType?: string
  subBodyType?: string
  expectedLaunchDate?: string
  formattedLaunchDate?: string
  variants: Array<{
    id: string
    name: string
    price: number
    fuelType: string
    transmission: string
    keyFeatures: string[]
  }>
  cities: Array<{
    name: string
    onRoadPrice: number
  }>
  emi: {
    starting: number
    tenure: number
  }
  keySpecs: {
    engine: string
    groundClearance: string
    power: string
    torque: string
    seatingCapacity: number
    safetyRating: string
  }
  keyFeatureImages?: Array<{ url: string; caption: string }>
  spaceComfortImages?: Array<{ url: string; caption: string }>
  storageConvenienceImages?: Array<{ url: string; caption: string }>
  colorImages?: Array<{ url: string; caption: string }>
  highlights?: {
    keyFeatures: Array<{ title: string; image: string; caption?: string }>
    spaceComfort: Array<{ title: string; image: string; caption?: string }>
    storageConvenience: Array<{ title: string; image: string; caption?: string }>
  }
  colors: Array<{
    name: string
    image: string
    code: string
  }>
  pros: string[] | string
  cons: string[] | string
  summary: string
  description?: string
  exteriorDesign?: string
  comfortConvenience?: string
  engineSummaries?: Array<{
    title: string
    summary: string
    transmission: string
    power: string
    torque: string
    speed: string
  }>
  mileageData?: Array<{
    engineName: string
    companyClaimed: string
    cityRealWorld: string
    highwayRealWorld: string
  }>
  faqs?: Array<{
    question: string
    answer: string
  }>
  engineHighlights: string
  mileage: Array<{
    condition: string
    value: number
    unit: string
  }>
  similarCars?: any[] // Added similarCars to interface
}

interface CarModelPageProps {
  model: ModelData
  initialVariants?: any[] // ✅ Server-rendered variants for AllVariantsClient
  newsSlot?: React.ReactNode
}

// FAQ Data
const faqData = [
  {
    question: "What is the mileage of Maruti Suzuki Swift?",
    answer: "The Maruti Suzuki Swift delivers an impressive fuel efficiency of 23.2 kmpl (combined), with city mileage of 21.2 kmpl and highway mileage of 25.8 kmpl."
  },
  {
    question: "What is the price range of Swift variants?",
    answer: "The Maruti Suzuki Swift is available in multiple variants with prices ranging from ₹5.99 lakh to ₹8.99 lakh (ex-showroom)."
  },
  {
    question: "What are the key safety features in Swift?",
    answer: "The Swift comes with dual airbags, ABS with EBD, reverse parking sensors, central locking, and a 4-star safety rating from Global NCAP."
  },
  {
    question: "What is the engine specification of Swift?",
    answer: "The Swift is powered by a 1.2L K-Series petrol engine that produces 83 PS of power and 113 Nm of torque, available with both manual and AMT transmission options."
  },
  {
    question: "What is the boot space and ground clearance?",
    answer: "The Swift offers 268 liters of boot space and has a ground clearance of 163mm, making it suitable for Indian road conditions."
  }
]

// News Articles Data
const newsArticles = [
  {
    id: 1,
    title: 'Maruti Suzuki Swift 2024: New Features and Updates',
    excerpt: 'The latest Swift gets updated infotainment system and new color options for 2024 model year.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop',
    publishDate: '2024-03-15',
    readTime: '3 min read'
  },
  {
    id: 2,
    title: 'Swift vs i20: Which Premium Hatchback to Choose?',
    excerpt: 'Detailed comparison between two popular premium hatchbacks in the Indian market.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
    publishDate: '2024-03-10',
    readTime: '5 min read'
  },
  {
    id: 3,
    title: 'Top 5 Fuel Efficient Cars Under 10 Lakhs',
    excerpt: 'Swift makes it to the list of most fuel-efficient cars in its segment.',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop',
    publishDate: '2024-03-08',
    readTime: '4 min read'
  }
]

// User Reviews Data
const userReviews = [
  {
    id: 1,
    userName: 'Rajesh Kumar',
    userLocation: 'Delhi',
    rating: 4.5,
    reviewDate: '2024-03-12',
    carModel: 'VXI AMT',
    reviewTitle: 'Perfect City Car',
    reviewText: 'Excellent car for city driving. Great fuel economy and reliable performance. The AMT variant is perfect for traffic conditions.',
    helpfulVotes: 45,
    totalVotes: 50,
    verified: true
  },
  {
    id: 2,
    userName: 'Priya Sharma',
    userLocation: 'Mumbai',
    rating: 4.0,
    reviewDate: '2024-03-10',
    carModel: 'ZXI',
    reviewTitle: 'Good Features but Limited Space',
    reviewText: 'Good build quality and features. The infotainment system is user-friendly. Only complaint is the rear seat space.',
    helpfulVotes: 32,
    totalVotes: 35,
    verified: true
  },
  {
    id: 3,
    userName: 'Amit Singh',
    userLocation: 'Bangalore',
    rating: 4.2,
    reviewDate: '2024-03-08',
    carModel: 'VXI',
    reviewTitle: 'Value for Money',
    reviewText: 'Value for money car with good after-sales service. The K-Series engine is proven and reliable.',
    helpfulVotes: 28,
    totalVotes: 30,
    verified: false
  }
]



// Navigation sections for sticky ribbon
const navigationSections = [
  { id: 'hero', label: 'Overview' },
  { id: 'specifications', label: 'Key Specs' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'variants', label: 'Variants' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'colors', label: 'Colors' },
  { id: 'pros-cons', label: 'Pros & Cons' },
  { id: 'engine', label: 'Engine' },
  { id: 'mileage', label: 'Mileage' },
  { id: 'expert-review', label: 'Expert Review' }, // Moved after Mileage
  { id: 'similar-cars', label: 'Similar Cars' },
  { id: 'news', label: 'News' },
  { id: 'videos', label: 'Videos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'reviews', label: 'User Reviews' }
]

export default function CarModelPage({ model, initialVariants = [], newsSlot }: CarModelPageProps) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']) // Multi-select filters
  const [selectedMileageEngine, setSelectedMileageEngine] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(false)
  const [showAllPros, setShowAllPros] = useState(false)
  const [showAllCons, setShowAllCons] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0)
  const [selectedKeyFeatureIndex, setSelectedKeyFeatureIndex] = useState(0)
  const [selectedSpaceComfortIndex, setSelectedSpaceComfortIndex] = useState(0)
  const [selectedStorageIndex, setSelectedStorageIndex] = useState(0)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  // Image Gallery Modal state for highlights and colors
  const [showDescription, setShowDescription] = useState(false)
  const [showExterior, setShowExterior] = useState(false)
  const [showComfort, setShowComfort] = useState(false)
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<Array<{ src: string; alt: string; caption?: string }>>([])
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [showAllFAQs, setShowAllFAQs] = useState(false)
  const [showAllSimilarCars, setShowAllSimilarCars] = useState(false)

  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'helpful'>('newest')
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  // Active section tracking for sticky navigation
  const [activeSection, setActiveSection] = useState('hero')
  const navRef = useRef<HTMLDivElement>(null)

  // Load car models for hyperlink generation
  useCarModelsData()

  // Load saved city from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    console.log('[CarModelPage] useEffect running, model:', model?.name, 'brand:', model?.brand)
    if (typeof window !== 'undefined') {
      // Track visited model for "Cars You Might Like" recommendations
      if (model?.id && model?.name && model?.brand) {
        console.log('[CarModelPage] Calling saveVisitedModel for:', model.name)
        saveVisitedModel({
          id: model.id,
          name: model.name,
          brandName: model.brand,
          bodyType: model.bodyType
        })
      }
    }
  }, [model?.id, model?.name, model?.brand, model?.bodyType])
  const [selectedVariant, setSelectedVariant] = useState(model?.variants?.[0]?.name || 'Base Variant')

  // Use variants from server-side props (no client-side fetch needed)
  const [modelVariants] = useState<any[]>(model.variants || [])
  const loadingVariants = false


  // Track page view for smart favourites algorithm
  const carDataForTracking = model ? {
    id: model.id,
    name: model.name,
    brand: model.brand,
    brandName: model.brand,
    image: model.heroImage,
    startingPrice: model.startingPrice,
    fuelTypes: model.variants?.map(v => v.fuelType).filter((v, i, a) => a.indexOf(v) === i) || ['Petrol'],
    transmissions: model.variants?.map(v => v.transmission).filter((v, i, a) => a.indexOf(v) === i) || ['Manual'],
    seating: model.keySpecs?.seatingCapacity || 5,
    launchDate: new Date().toISOString(),
    slug: model.slug,
    isNew: false,
    isPopular: false
  } : null

  // Review Logic
  const reviews = useMemo(() => model.reviews || userReviews, [model.reviews])

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    // Use reviews for distribution if available, otherwise just show empty or mock
    reviews.forEach((review: any) => {
      const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5
      if (distribution[rating as keyof typeof distribution] !== undefined) {
        distribution[rating as keyof typeof distribution]++
      }
    })
    return distribution
  }, [reviews])

  // Use model stats if available (from backend), otherwise calculate from reviews (or mock)
  const totalReviews = model.reviewCount !== undefined ? model.reviewCount : reviews.length
  const averageRating = model.rating !== undefined ? model.rating : (totalReviews > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews : 0)

  const filteredReviews = useMemo(() => {
    let result = [...reviews]

    // Filter by rating
    if (selectedRating) {
      result = result.filter((r: any) => Math.round(r.rating) === selectedRating)
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'helpful') {
      // Mock helpful sort as we don't have helpful count in all data
      result.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
    }

    return result
  }, [reviews, selectedRating, sortBy])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
      />
    ))
  }

  useViewTracker(carDataForTracking)

  // ✅ Calculate actual starting and ending prices from modelVariants (not allVariants to avoid initialization error)
  const actualStartingPrice = modelVariants.length > 0
    ? Math.min(...modelVariants.map(v => v.price || 0)) // Already in paise from database
    : model.startingPrice

  const actualEndingPrice = modelVariants.length > 0
    ? Math.max(...modelVariants.map(v => v.price || 0)) // Already in paise from database
    : model.endingPrice

  // Find fuel type of the lowest priced variant
  // For upcoming cars, get fuel type from model data since they don't have variants
  const lowestPriceVariant = modelVariants.length > 0
    ? modelVariants.find(v => v.price === actualStartingPrice)
    : null

  // Get fuel types from variants or from model data for upcoming cars
  const getModelFuelTypes = (): string[] => {
    if (modelVariants.length > 0) {
      return modelVariants.map(v => v.fuelType || v.fuel).filter(Boolean)
    }
    // For upcoming cars, try to get from model.variants or return default
    if (model.variants && model.variants.length > 0) {
      return model.variants.map(v => v.fuelType).filter(Boolean)
    }
    return ['Electric'] // Default for upcoming cars like e-Vitara
  }

  const modelFuelTypes = getModelFuelTypes()
  const lowestPriceFuelType = lowestPriceVariant?.fuelType || lowestPriceVariant?.fuel || modelFuelTypes[0] || 'Petrol'

  // Find fuel type of the highest priced variant
  const highestPriceVariant = modelVariants.length > 0
    ? modelVariants.find(v => v.price === actualEndingPrice)
    : null
  const highestPriceFuelType = highestPriceVariant?.fuelType || highestPriceVariant?.fuel || modelFuelTypes[0] || 'Petrol'

  const displayStartPrice = actualStartingPrice

  const displayEndPrice = actualEndingPrice


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

  const displayEMI = calculateDisplayEMI(displayStartPrice)
  const mileageScrollRef = useRef<HTMLDivElement>(null)

  // Function to handle tab switching and reset scroll position
  const handleHighlightTabChange = (tab: 'keyFeatures' | 'spaceComfort' | 'storageConvenience') => {
    setActiveHighlightTab(tab)
    // Reset scroll position to start from first image
    const scrollContainer = document.querySelector('.highlights-scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollLeft = 0
    }
  }

  // Mileage scroll functions
  const scrollMileageLeft = () => {
    if (mileageScrollRef.current) {
      mileageScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollMileageRight = () => {
    if (mileageScrollRef.current) {
      mileageScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // Function to truncate caption text
  const truncateCaption = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Function to parse bullet points from backend string
  const parseBulletPoints = (text: string | string[]): string[] => {
    if (Array.isArray(text)) return text
    if (!text) return []
    // Split by newlines and filter out empty lines, remove bullet points
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[•\-\*]\s*/, '')) // Remove bullet point characters
  }
  const [showModelPriceText, setShowModelPriceText] = useState(false)
  const [selectedComparisonCars, setSelectedComparisonCars] = useState<string[]>([])
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', message: '' })
  const [showSummaryDescription, setShowSummaryDescription] = useState(false)
  const [showSummaryExterior, setShowSummaryExterior] = useState(false)
  const [showSummaryComfort, setShowSummaryComfort] = useState(false)
  const [expandedEngine, setExpandedEngine] = useState<string | null>(null)
  const [activeHighlightTab, setActiveHighlightTab] = useState<'keyFeatures' | 'spaceComfort' | 'storageConvenience'>('keyFeatures')


  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const mainCarImageRef = useRef<HTMLImageElement>(null)



  // Initialize selectedColor with first color when model loads
  useEffect(() => {
    if (model?.colorImages && model.colorImages.length > 0 && !selectedColor) {
      setSelectedColor(model.colorImages[0].caption || '')
    }
  }, [model?.colorImages, selectedColor])

  // Intersection Observer for sticky navigation highlighting
  useEffect(() => {
    // Section IDs for navigation
    const sectionIds = ['overview', 'emi-highlights', 'variants', 'colors', 'pros-cons', 'engine', 'mileage', 'expert-review', 'similar-cars', 'news-videos', 'faq-reviews']

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

  const variantDropdownRef = useRef<HTMLDivElement>(null)
  const cityDropdownRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLDivElement>(null)

  // Transform backend variant data to match component structure
  const allVariants = modelVariants.map(variant => ({
    id: variant.id,
    name: variant.name,
    price: variant.price ? (variant.price / 100000) : 0, // Convert to lakhs
    fuel: (variant as any).fuel || variant.fuelType || "Petrol", // Use fuel from Page 4 Engine & Transmission specifications
    transmission: (variant as any).transmission || "Manual", // Use transmission from Page 4 specifications
    power: (variant as any).power || (variant as any).maxPower || variant.enginePower || "N/A", // Check power, maxPower, then enginePower
    features: variant.keyFeatures || variant.headerSummary || "Standard features included",
    isValueForMoney: variant.isValueForMoney || false
  })).sort((a, b) => a.price - b.price) // Sort by price in ascending order (lowest to highest)

  // Helper function to check if transmission is automatic type
  const isAutomaticTransmission = (transmission: string) => {
    const automaticTypes = ['automatic', 'cvt', 'amt', 'dct', 'torque converter', 'dual clutch']
    return automaticTypes.some(type => transmission.toLowerCase().includes(type))
  }

  // Generate dynamic filters based on available variants
  const getDynamicFilters = () => {
    const filters = ['All']
    const fuelTypes = new Set<string>()
    const transmissionTypes = new Set<string>()
    let hasValueVariants = false

    allVariants.forEach(variant => {
      if (variant.fuel) fuelTypes.add(variant.fuel)
      if (variant.transmission) {
        if (isAutomaticTransmission(variant.transmission)) {
          transmissionTypes.add('Automatic')
        } else {
          transmissionTypes.add('Manual')
        }
      }
      if (variant.isValueForMoney === true) {
        hasValueVariants = true
      }
    })

    fuelTypes.forEach(fuel => filters.push(fuel))
    transmissionTypes.forEach(trans => filters.push(trans))
    if (hasValueVariants) filters.push('Value for Money')

    return filters
  }

  const availableFilters = useMemo(() => getDynamicFilters(), [allVariants])

  // Handle filter toggle (multi-select)
  const handleFilterToggle = (filter: string) => {
    if (filter === 'All') {
      setSelectedFilters(['All'])
    } else {
      setSelectedFilters(prev => {
        const withoutAll = prev.filter(f => f !== 'All')
        if (withoutAll.includes(filter)) {
          const newFilters = withoutAll.filter(f => f !== filter)
          return newFilters.length === 0 ? ['All'] : newFilters
        } else {
          return [...withoutAll, filter]
        }
      })
    }
  }

  // Filter variants based on selected filters (multi-select logic) - Memoized for performance
  const filteredVariants = useMemo(() => {
    if (selectedFilters.includes('All')) {
      return allVariants
    }

    return allVariants.filter(variant => {
      const fuelFilters = selectedFilters.filter(f => ['Petrol', 'Diesel', 'CNG', 'Electric'].includes(f))
      const transmissionFilters = selectedFilters.filter(f => ['Manual', 'Automatic'].includes(f))
      const specialFilters = selectedFilters.filter(f => f === 'Value for Money')

      let matchesFuel = fuelFilters.length === 0 || fuelFilters.includes(variant.fuel)
      let matchesTransmission = transmissionFilters.length === 0

      if (transmissionFilters.length > 0) {
        if (transmissionFilters.includes('Automatic')) {
          matchesTransmission = matchesTransmission || isAutomaticTransmission(variant.transmission)
        }
        if (transmissionFilters.includes('Manual')) {
          matchesTransmission = matchesTransmission || !isAutomaticTransmission(variant.transmission)
        }
      }

      let matchesSpecial = specialFilters.length === 0 || (specialFilters.includes('Value for Money') && variant.isValueForMoney)

      return matchesFuel && matchesTransmission && matchesSpecial
    })
  }, [allVariants, selectedFilters])




  // Extended Pros and Cons data - Use backend data or fallback
  const allPros = parseBulletPoints(model?.pros || [
    "The safety is top notch with five-star BNCAP safety rating, six airbags as standard and ISOFIX anchors.",
    "The interior and exterior design is modern and features such as panoramic sunroof, JBL sound system and touchscreen infotainment.",
    "Excellent fuel efficiency with impressive mileage figures for city and highway driving.",
    "Spacious cabin with comfortable seating for five adults and ample legroom.",
    "Advanced connectivity features including Android Auto and Apple CarPlay integration.",
    "Reliable build quality with proven engine performance and low maintenance costs."
  ])

  const allCons = parseBulletPoints(model?.cons || [
    "The diesel engine can do with more refinement and the throttle response feels delayed up to 2,000 rpm.",
    "The CNG is limited to a manual transmission which may deter city drivers seeking easy shifting.",
    "Road noise can be noticeable at higher speeds, affecting cabin quietness.",
    "Limited boot space compared to some competitors in the same segment.",
    "Rear seat comfort could be improved for longer journeys.",
    "Some interior materials feel basic and could benefit from premium finishes."
  ])

  // Engine options data
  const engineOptions = [
    {
      id: '1.2-turbo-petrol',
      name: '1.2 Liter Turbo Petrol',
      description: 'Suitable For Both City Driving And Highway Cruising. The 1.2 Liter Engine Of The Tata Altroz Offers Adequate Power For City And Highway Driving. The Engine Provides Smooth Acceleration Without Compromising On Fuel Efficiency',
      variants: [
        {
          type: 'Manual',
          power: '87 Bhp',
          torque: '113 Nm',
          transmission: '6 Speed'
        },
        {
          type: 'Automatic',
          power: '87 Bhp',
          torque: '113 Nm',
          transmission: '6 Speed'
        },
        {
          type: 'iMT',
          power: '87 Bhp',
          torque: '113 Nm',
          transmission: '6 Speed'
        }
      ]
    },
    {
      id: '2.5-diesel',
      name: '2.5 Liter Diesel',
      description: 'Suitable For Both City Driving And Highway Cruising. The 1.5 Liter Engine Of The Tata Altroz Offers Adequate Power For City And Highway Driving. The Engine Provides Smooth Acceleration Without Compromising On Fuel Efficiency',
      variants: [
        {
          type: 'Manual',
          power: '87 Bhp',
          torque: '113 Nm',
          transmission: '6 Speed'
        },
        {
          type: 'iMT',
          power: '87 Bhp',
          torque: '113 Nm',
          transmission: '6 Speed'
        }
      ]
    },
    {
      id: '1.5-diesel',
      name: '1.5 Liter Diesel',
      description: 'Suitable For Both City Driving And Highway Cruising. The 1.5 Liter Engine Of The Tata Altroz Offers Adequate Power For City And Highway Driving. The Engine Provides Smooth Acceleration Without Compromising On Fuel Efficiency',
      variants: [
        {
          type: 'iMT',
          power: '87 Bhp',
          torque: '113 Nm',
          transmission: '6 Speed'
        }
      ]
    }
  ]

  // Mileage data for different engines
  const mileageData = [
    {
      id: 1,
      engine: '1.5 Litre Turbo Petrol',
      transmission: 'DCT',
      companyClaimed: '56.2 Km/l',
      cityRealWorld: '56.2 Km/l',
      highwayRealWorld: '56.2 Km/l'
    },
    {
      id: 2,
      engine: '1.2 Litre Petrol',
      transmission: 'Manual',
      companyClaimed: '22.3 Km/l',
      cityRealWorld: '18.5 Km/l',
      highwayRealWorld: '24.1 Km/l'
    },
    {
      id: 3,
      engine: '1.0 Litre Turbo Petrol',
      transmission: 'AMT',
      companyClaimed: '20.5 Km/l',
      cityRealWorld: '16.8 Km/l',
      highwayRealWorld: '22.3 Km/l'
    }
  ]


  const getOnRoadPrice = (exShowroomPrice: number, fuelType: string): number => {
    // Simplified on-road estimation (approx 15% overhead for RTO & Insurance)
    return Math.round(exShowroomPrice * 1.15)
  }

  // Similar cars are now passed from server - filter out invalid prices
  const similarCars = (model.similarCars || []).filter((car: any) => (car.startingPrice || 0) > 100000)
  const loadingSimilarCars = false

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

  // News articles data (copied from LatestCarNews)
  const newsArticles = [
    {
      id: 1,
      title: 'Maruti Suzuki Grand Vitara Hybrid Review: Best Fuel Economy in Segment',
      excerpt: 'We test drive the new Grand Vitara hybrid to see if it lives up to the fuel efficiency claims.',
      category: 'Review',
      author: 'Rajesh Kumar',
      publishDate: '2024-03-15',
      readTime: '5 min read',
      views: 12500,
      comments: 45,
      image: '/news/grand-vitara-review.jpg',
      slug: 'maruti-suzuki-grand-vitara-hybrid-review',
      featured: true
    },
    {
      id: 2,
      title: 'Upcoming Electric Cars in India 2024: Complete List with Expected Prices',
      excerpt: 'From Tata to Mahindra, here are all the electric cars launching in India this year.',
      category: 'News',
      author: 'Priya Sharma',
      publishDate: '2024-03-14',
      readTime: '8 min read',
      views: 18200,
      comments: 67,
      image: '/news/electric-cars-2024.jpg',
      slug: 'upcoming-electric-cars-india-2024',
      featured: true
    },
    {
      id: 3,
      title: 'Hyundai Creta vs Kia Seltos 2024: Which Compact SUV Should You Buy?',
      excerpt: 'Detailed comparison of two popular compact SUVs with latest updates and pricing.',
      category: 'Comparison',
      author: 'Amit Singh',
      publishDate: '2024-03-13',
      readTime: '6 min read',
      views: 9800,
      comments: 32,
      image: '/news/creta-vs-seltos.jpg',
      slug: 'hyundai-creta-vs-kia-seltos-2024-comparison',
      featured: false
    }
  ]

  // Videos data (copied from YouTubeVideoPlayer)
  const featuredVideo = {
    id: 'dQw4w9WgXcQ',
    title: 'Maruti Suzuki Grand Vitara Detailed Review | Hybrid vs Petrol | Which One to Buy?',
    thumbnail: '/youtube/grand-vitara-review.jpg',
    duration: '12:45',
    views: '2.5M',
    likes: '45K',
    publishedAt: '2 days ago',
    channelName: 'gadizone'
  }

  const relatedVideos = [
    {
      id: 'abc123',
      title: 'Top 5 Cars Under 10 Lakhs in 2024',
      thumbnail: '/youtube/top-5-cars.jpg',
      duration: '8:30',
      views: '1.2M',
      likes: '28K',
      publishedAt: '1 week ago',
      channelName: 'gadizone'
    },
    {
      id: 'def456',
      title: 'Electric vs Petrol Cars: Complete Cost Analysis',
      thumbnail: '/youtube/electric-vs-petrol.jpg',
      duration: '15:20',
      views: '890K',
      likes: '19K',
      publishedAt: '3 days ago',
      channelName: 'gadizone'
    },
    {
      id: 'ghi789',
      title: 'Hyundai Creta 2024 First Drive Review',
      thumbnail: '/youtube/creta-review.jpg',
      duration: '10:15',
      views: '1.8M',
      likes: '35K',
      publishedAt: '5 days ago',
      channelName: 'gadizone'
    }
  ]

  // Helper functions
  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('model-news-scroll')
    if (container) {
      const scrollAmount = 350
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  // Consultancy helper functions
  const handleCallClick = () => {
    window.location.href = 'tel:+919876543210'
  }

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919876543210?text=Hi, I need help choosing the right car', '_blank')
  }

  const handleBookConsultationClick = () => {
    window.location.href = '/consultation/book'
  }

  // Section navigation data
  const sections = [
    { id: 'overview', name: 'Overview' },
    { id: 'emi-highlights', name: 'EMI & Highlights' },
    { id: 'variants', name: 'Variants' },
    { id: 'colors', name: 'Colors' },
    { id: 'pros-cons', name: 'Pros & Cons' },
    { id: 'engine', name: 'Engine' },
    { id: 'mileage', name: 'Mileage' },
    { id: 'expert-review', name: 'Expert Review' },
    { id: 'similar-cars', name: 'Similar Cars' },
    { id: 'news-videos', name: 'News & Videos' },
    { id: 'faq-reviews', name: 'FAQ & Reviews' }
  ]



  // Car color options
  const carColors = [
    {
      id: 1,
      name: 'Desert Myst',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=500&fit=crop&auto=format',
      hexCode: '#C4A484'
    },
    {
      id: 2,
      name: 'Pearl White',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop&auto=format',
      hexCode: '#FFFFFF'
    },
    {
      id: 3,
      name: 'Metallic Silver',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop&auto=format',
      hexCode: '#C0C0C0'
    },
    {
      id: 4,
      name: 'Deep Black',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=500&fit=crop&auto=format',
      hexCode: '#000000'
    },
    {
      id: 5,
      name: 'Royal Blue',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=500&fit=crop&auto=format',
      hexCode: '#0066CC'
    }
  ]

  // Removed click outside logic since dropdowns are deleted

  // Handle variant card click to navigate to variant page
  const handleVariantClick = (variant: any) => {
    const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-')
    const variantUrl = `/${model.brandSlug}-cars/${model.slug}/${variantSlug}`
    console.log('Navigating to variant page:', variantUrl)
    router.push(variantUrl)
  }

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80 // Account for main header
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  // Open gallery modal with images
  const openGalleryModal = (images: Array<{ src: string; alt: string; caption?: string }>, initialIndex: number = 0) => {
    setGalleryImages(images)
    setGalleryInitialIndex(initialIndex)
    setGalleryModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top spacing element since sticky navigation is removed */}
      <div className="h-4 sm:h-8"></div>

      {/* Main Content */}
      <div>
        {/* Section 1: Overview - New Design */}
        <PageSection background="white" maxWidth="7xl">
          <div id="overview" className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column: Images (Desktop: col-span-7) */}
            <div className="md:col-span-7">
              {/* Hero Car Image with Gallery - Scrollable */}
              <div className="relative group cursor-pointer" onClick={() => router.push(`/${model.brandSlug}-cars/${model.slug}/images`)}>
                <div id="model-gallery" className="aspect-[16/10] bg-gray-100 rounded-2xl overflow-x-auto snap-x snap-mandatory scrollbar-hide flex" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                  {/* Hero Image */}
                  {model?.heroImage && (
                    <div className="w-full h-full flex-shrink-0 snap-center relative">
                      <OptimizedImage
                        ref={mainCarImageRef as any}
                        src={model.heroImage}
                        alt={`${model?.brand || 'Car'} ${model?.name || 'Model'}`}
                        fill
                        className="object-contain rounded-2xl"
                        priority={true}
                      />
                    </div>
                  )}
                  {/* Gallery Images */}
                  {model?.gallery?.map((imgUrl: string, index: number) => (
                    <div key={index} className="w-full h-full flex-shrink-0 snap-center relative">
                      <OptimizedImage
                        src={imgUrl}
                        alt={`${model?.name} gallery ${index + 1}`}
                        fill
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>
                  ))}
                </div>



                {/* Image Count Badge */}
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>{1 + (model?.gallery?.length || 0) + (model?.colorImages?.length || 0)} Images</span>
                </div>

                {/* Gallery Navigation Arrow */}
                {model?.gallery && model.gallery.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent gallery page navigation
                      const gallery = document.getElementById('model-gallery');
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
            <div className="md:col-span-5 space-y-4">
              {/* Car Title Phase: Year + Brand + Model + Variant */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl sm:text-[28px] font-bold text-[#1e1e1e] leading-tight">
                    {model?.brand || 'Car Brand'} {model?.name || 'Car Model'} {selectedVariant ? selectedVariant.replace(model?.name || '', '').trim() : ''}
                  </h1>
                  {/* Share and Heart Icons */}
                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => {
                        const shareData = {
                          title: `${model?.brand || 'Car'} ${model?.name || 'Model'} - Check it out!`,
                          text: `Check out the ${model?.brand || ''} ${model?.name || ''} on gadizone!`,
                          url: window.location.href
                        };

                        if (navigator.share) {
                          navigator.share(shareData).catch(console.error);
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard!');
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 transition-colors bg-gray-50 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex flex-col gap-1.5 mt-[-4px]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-[#1c144a] leading-none mb-2 mt-1">
                      {formatPrice(displayStartPrice / 100000)}
                    </span>
                  </div>
                </div>

                {/* Call To Action Button placed right after price */}
                <button
                  onClick={() => {
                    const brandSlug = model.brand?.toLowerCase().replace(/\s+/g, '-') || ''
                    const modelSlug = model.name?.toLowerCase().replace(/\s+/g, '-') || ''
                    const citySlug = "andheri-mumbai".replace(/\s+/g, '-')
                    router.push(`/${brandSlug}-cars/${modelSlug}/price-in-${citySlug}`)
                  }}
                  className="w-full bg-[#e21a22] text-white hover:bg-[#c9151e] focus:ring-2 focus:ring-offset-2 focus:ring-[#e21a22] font-bold text-[15px] sm:text-[16px] py-3.5 rounded-[12px] transition-all flex justify-center items-center gap-2 shadow-sm mt-1 mb-2"
                >
                  Book This Car
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Key Specs Row (Fuel, Transmission, Km driven) */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1 items-center justify-center py-3 bg-[#f8f9fa] border border-gray-100 rounded-[14px]">
                    <Fuel className="w-5 h-5 text-[#291e6a] mb-0.5" />
                    <span className="text-[13px] font-bold text-[#1c144a] text-center px-1 truncate w-full">
                      {modelFuelTypes.length > 0 ? modelFuelTypes[0] : 'Petrol'}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium tracking-wide pb-0.5">FUEL</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center justify-center py-3 bg-[#f8f9fa] border border-gray-100 rounded-[14px]">
                    <Settings className="w-5 h-5 text-[#291e6a] mb-0.5" />
                    <span className="text-[13px] font-bold text-[#1c144a] text-center px-1 truncate w-full">
                      {allVariants.find(v => v.name === selectedVariant)?.transmission || 'Manual'}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium tracking-wide pb-0.5">DRIVE</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center justify-center py-3 bg-[#f8f9fa] border border-gray-100 rounded-[14px]">
                    <TrendingUp className="w-5 h-5 text-[#291e6a] mb-0.5" />
                    <span className="text-[13px] font-bold text-[#1c144a] text-center px-1 truncate w-full">
                      60K km
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium tracking-wide pb-0.5">DRIVEN</span>
                  </div>
                </div>

                {/* Detailed Info Grid (Ownership, Reg Year, Insurance etc) */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-4 pt-4 mt-2 border-t border-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-gray-500 font-medium flex items-center gap-1.5">
                      Ownership
                    </span>
                    <span className="text-[14px] font-bold text-[#1e1e1e]">1st Owner</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-gray-500 font-medium flex items-center gap-1.5">
                      Reg Year
                    </span>
                    <span className="text-[14px] font-bold text-[#1e1e1e]">
                      {model?.formattedLaunchDate ? model.formattedLaunchDate.replace('Expected ', '') : 'Oct 2021'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-gray-500 font-medium flex items-center gap-1.5">
                      Insurance Validity
                    </span>
                    <span className="text-[14px] font-bold text-[#1e1e1e]">Feb 2027</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-gray-500 font-medium flex items-center gap-1.5">
                      Insurance Type
                    </span>
                    <span className="text-[14px] font-bold text-[#1e1e1e]">Third Party</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-gray-500 font-medium flex items-center gap-1.5">
                      Location
                    </span>
                    <span className="flex items-center gap-1 text-[14px] font-bold text-[#1e1e1e] cursor-pointer hover:text-[#291e6a]">
                      <MapPin className="w-3.5 h-3.5 text-[#e21a22]" />
                      Andheri, Mumbai
                    </span>
                  </div>
                </div>
              </div>

              {/* Launch Date Section - Only for Upcoming Cars */}
              {model?.isUpcomingCar && model?.formattedLaunchDate && (
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {model.brand} {model.name} Launch Date
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                      <p className="text-gray-700">
                        <span className="font-semibold">Launches on</span> {model.formattedLaunchDate.replace('Expected ', '')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // WhatsApp alert functionality
                      window.open(`https://wa.me/?text=I want to get launch alerts for ${model.brand} ${model.name}`, '_blank')
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Get Launch Alert on WhatsApp
                  </button>
                </div>
              )}
              {/* Legacy Dropdowns Removed */}
            </div>
          </div>
        </PageSection>



        {/* Section 2: EMI Calculator + AD Banner + Model Highlights */}
        <PageSection background="white" maxWidth="7xl">
          <div id="emi-highlights" className="space-y-8">
            {/* EMI Calculator */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#291e6a] rounded-full flex items-center justify-center">
                    {/* Generic Bank Icon */}
                    <Landmark className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Bank</h3>
                    <p className="text-sm text-gray-600">Partner</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Starting EMI</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(displayEMI)}
                  </p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>

              <Link
                href={`/emi-calculator?brand=${encodeURIComponent(model.brand)}&model=${encodeURIComponent(model.name)}&variant=${encodeURIComponent(model.variants?.[0]?.name || 'Base')}&price=${displayStartPrice}`}
                className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center"
              >
                <span>Calculate EMI</span>
              </Link>
            </div>
            {/* Ad Banner */}
            <Ad3DCarousel className="mb-6" />

            {/* Model Highlights */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{model?.brand || 'Car'} {model?.name || 'Model'} Key Features & Highlights</h2>

              {/* Tab Navigation - Clickable Headers */}
              <div className="flex space-x-4 sm:space-x-8 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => handleHighlightTabChange('keyFeatures')}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${activeHighlightTab === 'keyFeatures'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Key & Features
                </button>
                <button
                  onClick={() => handleHighlightTabChange('spaceComfort')}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${activeHighlightTab === 'spaceComfort'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Space & Comfort
                </button>
                <button
                  onClick={() => handleHighlightTabChange('storageConvenience')}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${activeHighlightTab === 'storageConvenience'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Storage & Convenience
                </button>
              </div>

              {/* Highlights Grid - Horizontal Scroll */}
              <div className="relative">
                <div className="highlights-scroll-container flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {/* Dynamic Highlight Cards from Backend - Show Based on Active Tab */}
                  {(() => {
                    let currentHighlights: any[] = [];
                    if (activeHighlightTab === 'keyFeatures') {
                      currentHighlights = model?.keyFeatureImages || model?.highlights?.keyFeatures || [];
                    } else if (activeHighlightTab === 'spaceComfort') {
                      currentHighlights = model?.spaceComfortImages || model?.highlights?.spaceComfort || [];
                    } else if (activeHighlightTab === 'storageConvenience') {
                      currentHighlights = model?.storageConvenienceImages || model?.highlights?.storageConvenience || [];
                    }

                    return currentHighlights.length > 0 ? (
                      currentHighlights.map((highlight: any, index: number) => {
                        // Build image URL
                        const imageUrl = highlight.url ? (
                          highlight.url.startsWith('http://') || highlight.url.startsWith('https://') ? highlight.url :
                            highlight.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${highlight.url}` :
                              highlight.url
                        ) : highlight.image ? (
                          highlight.image.startsWith('http://') || highlight.image.startsWith('https://') ? highlight.image :
                            highlight.image.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${highlight.image}` :
                              highlight.image
                        ) : `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center`;

                        const caption = highlight.caption || highlight.title || `${model?.brand} ${model?.name} ${activeHighlightTab === 'keyFeatures' ? 'Feature' : activeHighlightTab === 'spaceComfort' ? 'Space' : 'Storage'} ${index + 1}`;

                        return (
                          <div
                            key={index}
                            className="flex-shrink-0 w-64 cursor-pointer"
                            onClick={() => {
                              // Build gallery images array from current highlights
                              const galleryImgs = currentHighlights.map((h: any, idx: number) => ({
                                src: h.url ? (
                                  h.url.startsWith('http://') || h.url.startsWith('https://') ? h.url :
                                    h.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${h.url}` :
                                      h.url
                                ) : h.image ? (
                                  h.image.startsWith('http://') || h.image.startsWith('https://') ? h.image :
                                    h.image.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${h.image}` :
                                      h.image
                                ) : `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center`,
                                alt: h.caption || h.title || `Feature ${idx + 1}`,
                                caption: h.caption || h.title || `${model?.brand} ${model?.name} Feature ${idx + 1}`
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
                                  onError={(e) => {
                                    e.currentTarget.src = `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center`
                                  }}
                                />
                                {/* Image Caption Overlay - Backend Caption */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                  <p className="text-sm font-medium text-center">
                                    {truncateCaption(caption)}
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
                              {/* Sample Caption */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                <p className="text-sm font-medium text-center">
                                  {model?.brand} {model?.name} Feature 1
                                </p>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="w-12 h-1 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>

                        {/* Highlight Card 2 */}
                        <div className="flex-shrink-0 w-64">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200 relative">
                              <OptimizedImage
                                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center"
                                alt="Premium Interior"
                                fill
                                className="object-cover rounded-lg"
                              />
                              {/* Sample Caption */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                <p className="text-sm font-medium text-center">
                                  {model?.brand} {model?.name} Feature 2
                                </p>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="w-12 h-1 bg-gray-300 rounded"></div>
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
                              {/* Sample Caption */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                <p className="text-sm font-medium text-center">
                                  {model?.brand} {model?.name} Feature 3
                                </p>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="w-12 h-1 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>

                        {/* Highlight Card 4 */}
                        <div className="flex-shrink-0 w-64">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200 relative">
                              <OptimizedImage
                                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop&crop=center"
                                alt="Smart Technology"
                                fill
                                className="object-cover rounded-lg"
                              />
                              {/* Sample Caption */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                <p className="text-sm font-medium text-center">
                                  {model?.brand} {model?.name} Feature 4
                                </p>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="w-12 h-1 bg-gray-300 rounded"></div>
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

        {/* Section 3: Key Features Spec Sheet */}
        <PageSection background="white" maxWidth="7xl">
          {/* Section 3: Key Features Spec Sheet */}
          <div id="features" className="py-2">

            <div className="sm:mx-2 lg:mx-0">
              <h2 className="text-[20px] sm:text-[24px] font-extrabold text-[#1c144a] mb-8">Key Features</h2>

              <div className="space-y-8 sm:space-y-10">
                {/* Comfort & Convenience (Always Visible) */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-500 uppercase tracking-[0.1em] whitespace-nowrap">Comfort & Convenience</h3>
                    <div className="h-px bg-gray-200 flex-grow"></div>
                  </div>
                  <ul className="space-y-4">
                    {["Ambient interior lighting", "Cruise control", "Ventilated seats", "Keyless start", "Wireless phone charging"].map((feature, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-[14px] sm:text-[15px] font-semibold text-[#1e1e1e]">{feature}</span>
                        </div>
                        <div className="bg-gray-50 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-100 flex-shrink-0">
                          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#291e6a]" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Collapsible Features */}
                {isFeaturesExpanded && (
                  <>
                    {/* Exterior */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-500 uppercase tracking-[0.1em] whitespace-nowrap">Exterior</h3>
                        <div className="h-px bg-gray-200 flex-grow"></div>
                      </div>
                      <ul className="space-y-4">
                        {["Panoramic Sunroof", "R17 Diamond Cut Alloy Wheels", "LED Projector Headlamps"].map((feature, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-[14px] sm:text-[15px] font-semibold text-[#1e1e1e]">{feature}</span>
                            </div>
                            <div className="bg-gray-50 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-100 flex-shrink-0">
                              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#291e6a]" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Safety */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-500 uppercase tracking-[0.1em] whitespace-nowrap">Safety</h3>
                        <div className="h-px bg-gray-200 flex-grow"></div>
                      </div>
                      <ul className="space-y-4">
                        {["6 Airbags", "ABS with EBD & ESC", "Tire Pressure Monitoring System (TPMS)"].map((feature, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-[14px] sm:text-[15px] font-semibold text-[#1e1e1e]">{feature}</span>
                            </div>
                            <div className="bg-gray-50 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-100 flex-shrink-0">
                              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#291e6a]" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Entertainment & Communication */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-500 uppercase tracking-[0.1em] whitespace-nowrap">Entertainment & Communication</h3>
                        <div className="h-px bg-gray-200 flex-grow"></div>
                      </div>
                      <ul className="space-y-4">
                        {["10.25-inch Touchscreen Infotainment", "Premium Bose Sound System", "Apple CarPlay & Android Auto"].map((feature, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-[14px] sm:text-[15px] font-semibold text-[#1e1e1e]">{feature}</span>
                            </div>
                            <div className="bg-gray-50 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-100 flex-shrink-0">
                              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#291e6a]" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* View All Features CTA */}
              <div className="mt-8 sm:mt-10">
                <button
                  onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#1c144a] text-[#1c144a] hover:bg-gray-50 transition-colors rounded-[12px] font-bold text-[15px] sm:text-[16px] text-center flex justify-center items-center mx-auto"
                >
                  {isFeaturesExpanded ? 'View less features' : 'View all features'}
                </button>
              </div>
            </div>

          </div>
        </PageSection>

        {/* Section 4: Similar Cars You Might Like */}
        <PageSection background="white" maxWidth="7xl">
          {/* Section 4: Similar Cars You Might Like */}
          {
            (model?.similarCars && model.similarCars.length > 0) ? (

              <div id="similar-cars" className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                    Similar Cars You Might Like
                  </h2>
                  <div className="relative group">
                    <button
                      onClick={() => {
                        const container = document.getElementById('model-similar-scroll')
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
                        const container = document.getElementById('model-similar-scroll')
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
                      id="model-similar-scroll"
                      className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {model.similarCars.filter((car: any) => (car.startingPrice || 0) > 100000).map((car: any) => {
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
                          slug: car.slug || (car.brandName?.toLowerCase().replace(/s+/g, '-') + '-' + car.name?.toLowerCase().replace(/s+/g, '-')),
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
                </div>
              </div>

            ) : null
          }
        </PageSection>

        {/* Section 5: FAQ & Reviews */}
        <PageSection background="white" maxWidth="7xl">
          {/* Section 5: FAQ & Reviews */}

          <div className="space-y-12">
            <div id="faq" className="scroll-mt-24">
              <ModelFAQ
                brandName={model?.brand || ''}
                modelName={model?.name || ''}
                faqs={model?.faqs || []}
              />
            </div>
          </div>
        </PageSection>

        {/* Section 11: AD Banner */}
        <PageSection background="white" maxWidth="7xl">
          <div className="space-y-8">
            {/* Ad Banner */}
            <Ad3DCarousel className="mb-6" />
          </div>
        </PageSection>
      </div>

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
      </section >

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: model?.brand || 'Brand', href: `/${(model?.brandSlug || model?.brand?.toLowerCase().replace(/\s+/g, '-') || 'brand')}-cars` },
          { label: model?.name || 'Model' }
        ]}
      />
      <Footer />

      {/* Image Gallery Modal for Highlights and Colors */}
      <ImageGalleryModal
        images={galleryImages}
        initialIndex={galleryInitialIndex}
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        carName={`${model?.brand || 'Car'} ${model?.name || 'Model'}`}
      />
      <TestDriveBottomBar onBookTestDrive={() => setIsLeadModalOpen(true)} />
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        carName={model.name}
      />
    </div >
  )
}
