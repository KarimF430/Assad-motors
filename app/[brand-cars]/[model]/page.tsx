import { Metadata } from 'next'
import CarModelPage from '@/components/car-model/CarModelPage'
import { notFound } from 'next/navigation'
import { generateModelSEO } from '@/lib/seo'
import BrandNews from '@/components/brand/BrandNews'
import { generateCarProductSchema, generateFAQSchema } from '@/lib/structured-data'

interface ModelPageProps {
  params: Promise<{
    'brand-cars': string
    model: string
  }>
}

// Enable ISR with 1-hour revalidation (matches home page pattern)
const resolveAssetUrl = (path: string, backendUrl: string) => {
  if (!path) return ''
  const r2Url = process.env.R2_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || ''
  const legacyR2 = 'https://pub-a4a4bb84fc2d41cba103f4e2a8b5d185.r2.dev'

  if (path.includes(legacyR2) && r2Url) {
    return path.replace(legacyR2, r2Url)
  }

  if (path.startsWith('http')) return path

  if (path.startsWith('/uploads/') && r2Url) return `${r2Url}${path}`
  if (path.startsWith('/uploads/')) return `${backendUrl}${path}`
  return path
}

export const revalidate = 3600


export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  // Ignore Chrome DevTools /.well-known probes
  if (brandSlug.startsWith('.well-known') || brandSlug === 'well-known') {
    return {}
  }

  // Convert slugs to display names
  const brandName = brandSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const modelName = modelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return generateModelSEO(brandName, modelName)
}

async function getUpcomingCarData(brandSlug: string, modelSlug: string) {
  try {
    const brandName = brandSlug.replace('-cars', '')
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    // Guard against invalid routes - reject literal bracket params
    if (brandSlug.includes('[') || brandSlug.includes(']') ||
      modelSlug.includes('[') || modelSlug.includes(']')) {
      return null
    }

    if (brandSlug.startsWith('.well-known') || brandSlug === 'well-known') {
      throw new Error('Ignore well-known probe')
    }

    console.log('🔍 Trying to fetch as upcoming car...')

    // OPTIMIZED: Parallel fetch of brands and upcoming cars
    const [brandsResponse, upcomingCarsResponse] = await Promise.all([
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/upcoming-cars`, { next: { revalidate: 3600 } })
    ])

    if (!brandsResponse.ok) throw new Error('Failed to fetch brands')
    if (!upcomingCarsResponse.ok) throw new Error('Failed to fetch upcoming cars')

    const brands = await brandsResponse.json()
    const upcomingCars = await upcomingCarsResponse.json()

    const brandData = brands.find((brand: any) => {
      const slug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return slug === brandName
    })

    if (!brandData) throw new Error('Brand not found')

    // upcomingCars already fetched in parallel above
    const upcomingCarData = upcomingCars.find((car: any) => {
      const carSlug = car.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return carSlug === modelSlug && car.brandId === brandData.id
    })

    if (!upcomingCarData) throw new Error('Upcoming car not found')

    console.log('✅ Found upcoming car:', upcomingCarData.name)

    // Format expected launch date
    const formatExpectedLaunchDate = (dateString: string): string => {
      if (!dateString) return 'Expected Soon'
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      try {
        const parts = dateString.split('-')
        if (parts.length === 2) {
          const year = parts[0]
          const monthIndex = parseInt(parts[1]) - 1
          if (monthIndex >= 0 && monthIndex < 12) {
            return `Expected ${months[monthIndex]} ${year}`
          }
        }
        return `Expected ${dateString}`
      } catch (e) {
        return `Expected ${dateString}`
      }
    }

    // Build gallery array
    const galleryImages: string[] = []
    const heroImageUrl = upcomingCarData.heroImage
    if (heroImageUrl) {
      galleryImages.push(resolveAssetUrl(heroImageUrl, backendUrl))
    }

    if (upcomingCarData.galleryImages && Array.isArray(upcomingCarData.galleryImages)) {
      upcomingCarData.galleryImages.forEach((img: any) => {
        if (img?.url) {
          const fullUrl = resolveAssetUrl(img.url, backendUrl)
          if (!galleryImages.includes(fullUrl)) {
            galleryImages.push(fullUrl)
          }
        }
      })
    }

    // Fetch actual variants for this upcoming car
    const variantsResponse = await fetch(`${backendUrl}/api/variants?modelId=${upcomingCarData.id}`, { next: { revalidate: 3600 } });
    let variants = [];

    if (variantsResponse.ok) {
      variants = await variantsResponse.json();
      console.log(`✅ Fetched ${variants.length} variants for upcoming car: ${upcomingCarData.name}`);
    } else {
      console.warn(`⚠️ Failed to fetch variants for upcoming car: ${upcomingCarData.name}`);
    }

    // If no variants found, create dummy variants as fallback
    if (!variants || variants.length === 0) {
      console.log('⚠️ No variants found, using fallback dummy variants');
      variants = upcomingCarData.fuelTypes && upcomingCarData.fuelTypes.length > 0
        ? upcomingCarData.fuelTypes.map((fuelType: string, index: number) => ({
          id: `upcoming-${index}`,
          name: `${upcomingCarData.name} ${fuelType}`,
          price: index === 0 ? upcomingCarData.expectedPriceMin : upcomingCarData.expectedPriceMax,
          fuelType: fuelType,
          transmission: 'Automatic',
          keyFeatures: []
        }))
        : [{
          id: 'upcoming-default',
          name: upcomingCarData.name,
          price: upcomingCarData.expectedPriceMin,
          fuelType: upcomingCarData.fuelTypes?.[0] || 'Electric',
          transmission: 'Automatic',
          keyFeatures: []
        }];
    }

    // Return data in model page format
    return {
      isUpcomingCar: true,
      id: upcomingCarData.id,
      slug: modelSlug,
      brandSlug: brandSlug.replace('-cars', ''),
      brand: brandData.name,
      name: upcomingCarData.name,
      heroImage: galleryImages[0] || '',
      gallery: galleryImages,
      rating: 0,
      reviewCount: 0,
      seoDescription: upcomingCarData.headerSeo || `The upcoming ${brandData.name} ${upcomingCarData.name} is set to launch ${formatExpectedLaunchDate(upcomingCarData.expectedLaunchDate)}.`,
      startingPrice: upcomingCarData.expectedPriceMin,
      endingPrice: upcomingCarData.expectedPriceMax,
      bodyType: upcomingCarData.bodyType,
      subBodyType: upcomingCarData.subBodyType,
      expectedLaunchDate: upcomingCarData.expectedLaunchDate,
      formattedLaunchDate: formatExpectedLaunchDate(upcomingCarData.expectedLaunchDate),
      variants: variants,
      cities: [
        { name: 'Delhi', onRoadPrice: upcomingCarData.expectedPriceMin * 1.1 },
        { name: 'Mumbai', onRoadPrice: upcomingCarData.expectedPriceMin * 1.15 },
        { name: 'Bangalore', onRoadPrice: upcomingCarData.expectedPriceMin * 1.12 },
        { name: 'Chennai', onRoadPrice: upcomingCarData.expectedPriceMin * 1.13 }
      ],
      emi: {
        starting: Math.round((upcomingCarData.expectedPriceMin / 100000) * 1000),
        tenure: 60
      },
      keySpecs: {
        engine: '1199 cc',
        groundClearance: '165 mm',
        power: '85 PS',
        torque: '110 Nm',
        seatingCapacity: 5,
        safetyRating: '4 Star'
      },
      keyFeatureImages: upcomingCarData.keyFeatureImages || [],
      spaceComfortImages: upcomingCarData.spaceComfortImages || [],
      storageConvenienceImages: upcomingCarData.storageConvenienceImages || [],
      colorImages: upcomingCarData.colorImages || [],
      pros: upcomingCarData.pros || [],
      cons: upcomingCarData.cons || [],
      description: upcomingCarData.description,
      exteriorDesign: upcomingCarData.exteriorDesign,
      comfortConvenience: upcomingCarData.comfortConvenience,
      engineSummaries: upcomingCarData.engineSummaries || [],
      mileageData: upcomingCarData.mileageData || [],
      faqs: upcomingCarData.faqs || [],
      highlights: {
        keyFeatures: [] as any[],
        spaceComfort: [] as any[],
        storageConvenience: [] as any[]
      },
      colors: [] as any[],
      summary: upcomingCarData.summary || `The ${brandData.name} ${upcomingCarData.name} is an exciting upcoming vehicle.`,
      engineHighlights: 'Engine details will be announced closer to launch.',
      mileage: [] as any[],
      similarCars: [] as any[],
      reviews: [] as any[]
    }
  } catch (error) {
    console.log('Not an upcoming car:', error)
    return null
  }
}

async function getModelData(brandSlug: string, modelSlug: string) {
  try {
    // Remove '-cars' suffix from brand slug to get actual brand name
    const brandName = brandSlug.replace('-cars', '')

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    // Guard against invalid routes - reject literal bracket params like [brand-cars] or [model]
    if (brandSlug.includes('[') || brandSlug.includes(']') ||
      modelSlug.includes('[') || modelSlug.includes(']')) {
      console.log('Invalid route params detected (literal brackets), returning null')
      return null
    }

    // Guard against /.well-known devtools requests being treated as dynamic routes
    if (brandSlug.startsWith('.well-known') || brandSlug === 'well-known') {
      throw new Error('Ignore well-known probe')
    }



    // OPTIMIZATION: Parallel data fetching where possible
    console.log('🚀 Starting optimized parallel data fetch...')
    const startTime = Date.now()

    // Step 1: Fetch brands (required first to get brandId) - ISR cached
    const brandsResponse = await fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
    if (!brandsResponse.ok) throw new Error('Failed to fetch brands')

    const brands = await brandsResponse.json()

    // Find the brand by matching slug
    const brandData = brands.find((brand: any) => {
      const slug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return slug === brandName
    })

    if (!brandData) throw new Error('Brand not found')

    // Step 2: Fetch models for this brand to get modelId - ISR cached
    const modelsResponse = await fetch(`${backendUrl}/api/frontend/brands/${brandData.id}/models`, { next: { revalidate: 3600 } })
    if (!modelsResponse.ok) throw new Error('Failed to fetch models')

    const modelsData = await modelsResponse.json()
    const modelData = modelsData.models.find((m: any) => m.slug === modelSlug)
    if (!modelData) throw new Error('Model not found')

    // Step 3: PARALLEL FETCH - Get detailed model data, variants, and similar cars data simultaneously
    // ✅ OPTIMIZED: Only fetch 8 variants (visible on page) + removed 200-variant fetch
    const [detailedModelData, variantsData, similarModelsRes, reviewsRes] = await Promise.all([
      fetch(`${backendUrl}/api/models/${modelData.id}`, { next: { revalidate: 3600 } })
        .then(res => res.ok ? res.json() : null)
        .catch(err => {
          console.log('❌ Error fetching detailed model data:', err)
          return null
        }),
      // Fetch ALL variants for accurate price calculation and View All features
      fetch(`${backendUrl}/api/variants?modelId=${modelData.id}`, { next: { revalidate: 3600 } })
        .then(res => res.ok ? res.json() : [])
        .catch(err => {
          console.log('❌ Error fetching variants:', err)
          return []
        }),
      // ✅ Uses models-with-pricing endpoint (has lowestPrice already)
      // ✅ OPTIMIZATION: Increased limit to 500 to ensure we find similar body types effectively
      fetch(`${backendUrl}/api/models-with-pricing?limit=500`, { next: { revalidate: 3600 } })
        .then(res => res.ok ? res.json() : { data: [] })
        .catch(() => ({ data: [] })),
      // ✅ Fetch approved reviews for SSR
      fetch(`${backendUrl}/api/reviews/${modelSlug}?limit=50`, { next: { revalidate: 3600 } })
        .then(res => res.ok ? res.json() : { success: false, data: { reviews: [], total: 0, overallRating: 0 } })
        .catch(err => {
          console.log('❌ Error fetching reviews:', err)
          return { success: false, data: { reviews: [], total: 0, overallRating: 0 } }
        })
    ])

    const similarModelsData = similarModelsRes?.data || similarModelsRes || []

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

    // Calculate model's starting price from variants (for filtering parity with variant page)
    const variantPrices = variantsData.map((v: any) => v.price).filter((p: number) => p > 0)
    const modelStartingPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0

    // Process Similar Cars (Server-Side) - EXACT LOGIC FROM Variant Page
    const currentPrice = modelStartingPrice || modelData.price || modelData.lowestPrice || 0
    const currentBodyType = (modelData.bodyType || '').toLowerCase()

    const brandMap = brands.reduce((acc: any, brand: any) => {
      acc[brand.id] = brand.name
      if (brand._id) acc[brand._id] = brand.name
      return acc
    }, {})

    // Set price range limits (+/- 40%)
    const minPrice = currentPrice * 0.6
    const maxPrice = currentPrice * 1.4

    // First try: Match by body type AND price range
    let filteredCars = similarModelsData.filter((m: any) => {
      if (m.id === modelData.id) return false

      const price = m.lowestPrice || m.price || 0
      if (price <= 100000) return false

      const matchesBodyType = currentBodyType && m.bodyType &&
        m.bodyType.toLowerCase() === currentBodyType

      const inPriceRange = currentPrice <= 0 || (price >= minPrice && price <= maxPrice)

      return matchesBodyType && inPriceRange
    })

    // Second try: If less than 3 matches, try just body type
    if (filteredCars.length < 3 && currentBodyType) {
      filteredCars = similarModelsData.filter((m: any) => {
        if (m.id === modelData.id) return false
        const price = m.lowestPrice || m.price || 0
        if (price <= 100000) return false
        return m.bodyType && m.bodyType.toLowerCase() === currentBodyType
      })
    }

    // Third try: If still less than 3 matches, show popular cars
    if (filteredCars.length < 3) {
      filteredCars = similarModelsData.filter((m: any) => {
        if (m.id === modelData.id) return false
        const price = m.lowestPrice || m.price || 0
        return price > 100000
      })
    }

    // Sort by popularity then by price proximity
    filteredCars.sort((a: any, b: any) => {
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1

      if (currentPrice > 0) {
        const aPrice = a.lowestPrice || a.price || 0
        const bPrice = b.lowestPrice || b.price || 0
        const aDiff = Math.abs(aPrice - currentPrice)
        const bDiff = Math.abs(bPrice - currentPrice)
        return aDiff - bDiff
      }
      return 0
    })

    const similarCars = filteredCars
      .slice(0, 6)
      .map((m: any) => {
        const lowestPrice = m.lowestPrice || m.price || 0
        const fuelTypes = m.fuelTypes && m.fuelTypes.length > 0
          ? m.fuelTypes
          : ['Petrol']
        const transmissions = m.transmissions && m.transmissions.length > 0
          ? m.transmissions
          : ['Manual']

        return {
          id: m.id,
          brandName: brandMap[m.brandId] || 'Unknown',
          name: m.name,
          image: m.heroImage || m.image,
          startingPrice: lowestPrice,
          fuelTypes,
          transmissions,
          launchDate: m.launchDate,
          isNew: m.isNew || false,
          isPopular: m.isPopular || false
        }
      })

    const fetchTime = Date.now() - startTime
    console.log(`✅ Parallel fetch completed in ${fetchTime}ms`)

    console.log('Model ID:', modelData.id)
    console.log('Detailed model data:', detailedModelData)
    console.log('Header SEO:', detailedModelData?.headerSeo)




    // Build gallery array from backend data
    const galleryImages: string[] = []

    // Add hero image first
    const heroImageUrl = detailedModelData?.heroImage || modelData.image
    if (heroImageUrl) {
      galleryImages.push(resolveAssetUrl(heroImageUrl, backendUrl))
    }

    // Add gallery images from backend
    if (detailedModelData?.galleryImages && Array.isArray(detailedModelData.galleryImages)) {
      detailedModelData.galleryImages.forEach((img: any) => {
        if (img?.url) {
          const fullUrl = resolveAssetUrl(img.url, backendUrl)
          if (!galleryImages.includes(fullUrl)) {
            galleryImages.push(fullUrl)
          }
        }
      })
    }

    console.log('Gallery images from backend:', detailedModelData?.galleryImages)
    console.log('Final gallery array:', galleryImages)

    // Calculate lowest and highest prices from actual variants
    let lowestPrice = 0
    let highestPrice = 0

    if (variantsData.length > 0) {
      const prices = variantsData.map((v: any) => v.price).filter((p: number) => p > 0)
      if (prices.length > 0) {
        lowestPrice = Math.min(...prices)
        highestPrice = Math.max(...prices)
      }

      console.log('✅ Fetched variants:', variantsData.length)
      console.log('💰 Price range:', lowestPrice, '-', highestPrice)
    }

    // Fallback to model price if no variants found
    if (lowestPrice === 0) {
      lowestPrice = parseFloat(modelData.price.replace('₹', '')) * 100000
      highestPrice = lowestPrice * 1.5
    }

    // Transform variants data
    const transformedVariants = variantsData.length > 0
      ? variantsData.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        price: variant.price,
        fuelType: variant.fuelType || modelData.fuelType,
        transmission: variant.transmission || modelData.transmission,
        // Use actual keyFeatures from database, not constructed array
        keyFeatures: variant.keyFeatures || variant.headerSummary || "Standard features included",
        isValueForMoney: variant.isValueForMoney || false,
        engine: variant.engine,
        power: variant.power || variant.maxPower || variant.enginePower,
        maxPower: variant.maxPower || variant.power,
        enginePower: variant.enginePower,
        headerSummary: variant.headerSummary,
        mileage: variant.mileage || variant.mileageCompanyClaimed,
        mileageCompanyClaimed: variant.mileageCompanyClaimed,
        fuel: variant.fuel || variant.fuelType || modelData.fuelType // Ensure fuel property exists for CarModelPage
      }))
      : [
        {
          id: '1',
          name: `${modelData.name} Base`,
          price: lowestPrice,
          fuelType: modelData.fuelType,
          transmission: modelData.transmission,
          keyFeatures: ['Dual Airbags', 'ABS with EBD', 'Power Steering', 'Central Locking']
        },
        {
          id: '2',
          name: `${modelData.name} Mid`,
          price: lowestPrice * 1.2,
          fuelType: modelData.fuelType,
          transmission: modelData.transmission,
          keyFeatures: ['All Base features', 'Touchscreen Infotainment', 'Steering Controls', 'Rear Parking Sensors']
        },
        {
          id: '3',
          name: `${modelData.name} Top`,
          price: highestPrice,
          fuelType: modelData.fuelType,
          transmission: modelData.transmission,
          keyFeatures: ['All Mid features', 'Sunroof', 'Cruise Control', 'Auto Climate Control']
        }
      ]

    // Process reviews data
    const reviewsData = reviewsRes?.success ? reviewsRes.data : { reviews: [], total: 0, overallRating: 0 }

    const enhancedModelData = {
      isUpcomingCar: false,
      id: modelData.id,
      slug: modelData.slug,
      brandSlug: brandSlug.replace('-cars', ''),
      brand: modelData.brandName,
      name: modelData.name,
      heroImage: galleryImages[0] || resolveAssetUrl(modelData.image, backendUrl),
      gallery: galleryImages,
      rating: reviewsData.overallRating || modelData.rating || 0,
      reviewCount: reviewsData.total || modelData.reviews || 0,
      reviews: reviewsData.reviews || [], // Pass SSR reviews
      seoDescription: detailedModelData?.headerSeo || `${modelData.brandName} ${modelData.name} is a premium vehicle that offers excellent performance, modern features, and great value for money. Starting at ${(lowestPrice / 100000).toFixed(2)} Lakh.`,
      startingPrice: lowestPrice,
      endingPrice: highestPrice,
      bodyType: detailedModelData?.bodyType || modelData.bodyType,
      subBodyType: detailedModelData?.subBodyType || modelData.subBodyType,
      expectedLaunchDate: '',
      formattedLaunchDate: '',
      variants: transformedVariants,
      cities: [
        { name: 'Delhi', onRoadPrice: lowestPrice * 1.1 },
        { name: 'Mumbai', onRoadPrice: lowestPrice * 1.15 },
        { name: 'Bangalore', onRoadPrice: lowestPrice * 1.12 },
        { name: 'Chennai', onRoadPrice: lowestPrice * 1.13 }
      ],
      emi: {
        starting: Math.round((lowestPrice / 100000) * 1000),
        tenure: 60
      },
      keySpecs: {
        engine: '1199 cc',
        groundClearance: '165 mm',
        power: modelData.power,
        torque: '110 Nm',
        seatingCapacity: parseInt(modelData.seating.split(' ')[0]),
        safetyRating: '4 Star'
      },
      // Backend highlight images
      keyFeatureImages: detailedModelData?.keyFeatureImages || [],
      spaceComfortImages: detailedModelData?.spaceComfortImages || [],
      storageConvenienceImages: detailedModelData?.storageConvenienceImages || [],
      // Backend color images
      colorImages: detailedModelData?.colorImages || [],
      // Backend pros, cons, and summary data
      pros: detailedModelData?.pros || [],
      cons: detailedModelData?.cons || [],
      description: detailedModelData?.description,
      exteriorDesign: detailedModelData?.exteriorDesign,
      comfortConvenience: detailedModelData?.comfortConvenience,
      // Backend engine summaries
      engineSummaries: detailedModelData?.engineSummaries || [],
      // Backend mileage data
      mileageData: detailedModelData?.mileageData || [],
      // Backend FAQs
      faqs: detailedModelData?.faqs || [],
      // Fallback highlights for compatibility
      highlights: {
        keyFeatures: [
          { title: 'Spacious Interior', image: '/highlights/spacious-interior.jpg' },
          { title: 'Advanced Safety', image: '/highlights/safety.jpg' },
          { title: 'Fuel Efficient Engine', image: '/highlights/engine.jpg' }
        ],
        spaceComfort: [
          { title: 'Rear Seat Space', image: '/highlights/rear-seat.jpg' },
          { title: 'Boot Space', image: '/highlights/boot.jpg' }
        ],
        storageConvenience: [
          { title: 'Glove Box', image: '/highlights/glove-box.jpg' },
          { title: 'Door Pockets', image: '/highlights/door-pockets.jpg' }
        ]
      },
      colors: [
        { name: 'Platinum White Pearl', image: '/colors/white.jpg', code: '#FFFFFF' },
        { name: 'Metallic Midnight Blue', image: '/colors/blue.jpg', code: '#1E3A8A' },
        { name: 'Radiant Red Metallic', image: '/colors/red.jpg', code: '#DC2626' },
        { name: 'Modern Steel Metallic', image: '/colors/silver.jpg', code: '#6B7280' }
      ],
      summary: `The ${modelData.brandName} ${modelData.name} is a well-rounded vehicle that offers excellent value for money with its efficient engine, spacious interior, and reliable performance.`,
      engineHighlights: `The engine delivers smooth performance with excellent fuel efficiency of ${modelData.mileage}, making it perfect for both city and highway driving.`,
      mileage: [
        { condition: 'City', value: 18.6, unit: 'kmpl' },
        { condition: 'Highway', value: 24.2, unit: 'kmpl' },
        { condition: 'Combined', value: parseFloat(modelData.mileage.split(' ')[0]), unit: 'kmpl' }
      ],
      similarCars: similarCars // Pass the server-fetched similar cars
    }

    return enhancedModelData
  } catch (error) {
    console.error('Error fetching model data:', error)

    // Return fallback data instead of null to prevent errors
    const fallbackBrand = brandSlug.replace('-cars', '').split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    const fallbackModel = modelSlug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    return {
      isUpcomingCar: false,
      id: 'fallback-id',
      slug: modelSlug,
      brandSlug: brandSlug.replace('-cars', ''),
      brand: fallbackBrand,
      name: fallbackModel,
      heroImage: 'https://images.unsplash.com/photo-1549399084-d56e05c50b8d?w=800&h=600&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1549399084-d56e05c50b8d?w=800&h=600&fit=crop'],
      rating: 0,
      reviewCount: 0,
      seoDescription: `${fallbackBrand} ${fallbackModel} - Premium vehicle with excellent features.`,
      startingPrice: 500000,
      endingPrice: 800000,
      bodyType: 'SUV', // Default Fallback
      subBodyType: 'Compact SUV',
      expectedLaunchDate: '',
      formattedLaunchDate: '',
      variants: [],
      cities: [
        { name: 'Delhi', onRoadPrice: 550000 },
        { name: 'Mumbai', onRoadPrice: 575000 },
        { name: 'Bangalore', onRoadPrice: 560000 },
        { name: 'Chennai', onRoadPrice: 565000 }
      ],
      emi: { starting: 5000, tenure: 60 },
      keySpecs: {
        engine: '1199 cc',
        groundClearance: '165 mm',
        power: '85 PS',
        torque: '110 Nm',
        seatingCapacity: 5,
        safetyRating: '4 Star'
      },
      keyFeatureImages: [] as any[],
      spaceComfortImages: [] as any[],
      storageConvenienceImages: [] as any[],
      colorImages: [] as any[],
      pros: [] as any[],
      cons: [] as any[],
      description: `The ${fallbackBrand} ${fallbackModel} offers excellent value with modern features.`,
      exteriorDesign: undefined,
      comfortConvenience: undefined,
      engineSummaries: [] as any[],
      mileageData: [] as any[],
      faqs: [] as any[],
      // Fallback highlights for compatibility
      highlights: {
        keyFeatures: [] as any[],
        spaceComfort: [] as any[],
        storageConvenience: [] as any[]
      },
      colors: [] as any[],
      summary: `The ${fallbackBrand} ${fallbackModel} is a well-rounded vehicle.`,
      engineHighlights: 'Efficient engine with smooth performance.',
      mileage: [
        { condition: 'City', value: 18.6, unit: 'kmpl' },
        { condition: 'Highway', value: 24.2, unit: 'kmpl' },
        { condition: 'Combined', value: 21.0, unit: 'kmpl' }
      ],
      similarCars: [] as any[],
      reviews: [] as any[]
    }
  }
}

import { FloatingAIBot } from '@/components/FloatingAIBot'

export default async function ModelPage({ params }: ModelPageProps) {
  const resolvedParams = await params
  if (resolvedParams['brand-cars'].startsWith('.well-known') || resolvedParams['brand-cars'] === 'well-known') {
    return null as any
  }

  // Try fetching as regular model first (most common case)
  let modelData = await getModelData(resolvedParams['brand-cars'], resolvedParams.model)

  // If not found as regular model, try as upcoming car
  if (!modelData) {
    modelData = await getUpcomingCarData(resolvedParams['brand-cars'], resolvedParams.model)
  }

  if (!modelData) {
    notFound()
  }

  // Generate structured data
  // Generate structured data
  const productSchema = generateCarProductSchema({
    name: `${modelData.brand} ${modelData.name}`,
    brand: modelData.brand,
    image: modelData.heroImage,
    description: modelData.seoDescription || modelData.summary,
    lowPrice: modelData.startingPrice,
    highPrice: modelData.endingPrice,
    rating: modelData.rating,
    reviewCount: modelData.reviewCount,
    reviews: modelData.reviews,
    bodyType: modelData.bodyType,
    fuelType: (modelData as any).fuelTypes?.[0] || 'Petrol', // Default to first available
    transmission: (modelData as any).transmissions?.[0] || 'Manual',
    seatingCapacity: (modelData as any).keySpecs?.seatingCapacity || 5,
    modelDate: new Date().getFullYear().toString() // Current year model
  })

  // Format FAQs for schema if they exist
  // Handles both array of objects or simple strings if that was the case (checking structure)
  const formattedFaqs = modelData.faqs?.map((faq: any) => ({
    question: faq.question || faq.q || '',
    answer: faq.answer || faq.a || ''
  })).filter((f: any) => f.question && f.answer) || []

  const faqSchema = formattedFaqs.length > 0 ? generateFAQSchema(formattedFaqs) : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <CarModelPage
        model={modelData as any}
        initialVariants={modelData.variants}
        newsSlot={<BrandNews brandSlug={modelData.slug} brandName={modelData.name} />}
      />
      <FloatingAIBot type="model" id={modelData.id} name={modelData.name} hasStickyBottomBar={true} />
    </>
  )
}
