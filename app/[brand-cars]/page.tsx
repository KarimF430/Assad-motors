import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import BrandHeroSection from '@/components/brand/BrandHeroSection'
import BrandUpcomingCars from '@/components/brand/BrandUpcomingCars'
import AlternativeBrands from '@/components/brand/AlternativeBrands'
import BrandNews from '@/components/brand/BrandNews'
import BrandYouTube from '@/components/brand/BrandYouTube'
import BrandFAQ from '@/components/brand/BrandFAQ'

import ConsultancyAd from '@/components/home/ConsultancyAd'
import AdSpaces from '@/components/home/AdSpaces'
import FeedbackBox from '@/components/brand/FeedbackBox'
import CarFilters from '@/components/brand/CarFilters'
import Footer from '@/components/Footer'
import PageSection from '@/components/common/PageSection'
import PageHeader from '@/components/common/PageHeader'
import CarComparison from '@/components/common/CarComparison'

import { generateBrandSEO } from '@/lib/seo'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import Breadcrumb from '@/components/common/Breadcrumb'

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

interface BrandPageProps {
  params: Promise<{
    'brand-cars': string
  }>
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const brandName = brandSlug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return generateBrandSEO(brandName)
}

// Server-side data fetching functions with timeout and better error handling
async function fetchBrandData(brandSlug: string) {
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${backendUrl}/api/brands`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`);
    }

    const brands = await response.json();
    if (!Array.isArray(brands)) {
      throw new Error('Invalid response format');
    }

    const brand = brands.find((b: any) => {
      const normalizedBrandName = b.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const normalizedSlug = brandSlug.toLowerCase();

      return normalizedBrandName === normalizedSlug ||
        b.name.toLowerCase() === normalizedSlug;
    });

    return brand || null;
  } catch (error) {
    console.error('❌ Error fetching brand data:', error);
    return null;
  }
}

async function fetchBrandModels(brandId: string) {
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${backendUrl}/api/frontend/brands/${brandId}/models`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data || { brand: null, models: [] };
  } catch (error) {
    console.error('❌ Error fetching models:', error);
    return { brand: null, models: [] };
  }
}

// Mock brand data
const brandData = {
  'maruti': {
    name: 'Maruti Suzuki',
    slug: 'maruti',
    logo: '/brands/maruti.png',
    description: 'Maruti car price starts at Rs 3.50 Lakh for the cheapest model which is S-Presso and the price of most expensive model, which is Invicto starts at Rs 24.97 Lakh. Manufacturer 1st car models in India, including 5 cars in SUV category, 2 cars in Sedan category, 7 cars in Hatchback category, 3 cars in MUV/MPV category, 1 car in Minivan category. Maruti has 2 upcoming cars in India, Wagon R and e Vitara.',
    fullDescription: `Maruti Suzuki has been the biggest carmaker in India for decades. In fact, one in every four cars sold every month is a Maruti Suzuki. With 13 models on sale today, all Maruti Suzuki cars are widely known for their affordability and fuel-efficient powertrains. Adding to Maruti's popularity is the highest number of showrooms and service centres across the country with easy availability of spare parts. For numbers, there are 4,564 touch points across 2,304 cities in India. Maruti operates under two types of dealerships which include Maruti Nexa that sells Arena cars. Maruti Suzuki sells its premium cars under the Nexa outlet.

One aspect in which Maruti Suzuki has remained unbeaten is fuel efficiency. Their powertrains are also shared across the model range making them easy to source for parts. Apart from light-on-pocket CNG options, Maruti has two started offering strong hybrid powertrains along with their mild-hybrid powertrains as well. Although there is no diesel powertrain anymore, all petrol engines offered by Maruti Suzuki are RDE compliant. Maruti is also working their way towards electrification. In their future models. One known for bare-basic cabins and lack of features, Maruti Suzuki's new line-up offers everything you could ask for in terms of features and equipment.`,
    priceRange: {
      min: 350000,
      max: 2497000
    },
    totalModels: 13,
    categories: {
      suv: 5,
      sedan: 2,
      hatchback: 7,
      muv: 3,
      minivan: 1
    },
    upcomingCars: 2,
    models: ['Alto', 'Swift', 'Baleno', 'Dzire', 'Vitara Brezza', 'Ertiga', 'Ciaz', 'S-Cross', 'XL6', 'Grand Vitara']
  },
  'hyundai': {
    name: 'Hyundai',
    slug: 'hyundai',
    logo: '/brands/hyundai.png',
    description: 'Hyundai car price starts at Rs 5.69 Lakh for the cheapest model which is Grand i10 Nios and the price of most expensive model, which is Tucson starts at Rs 27.69 Lakh. Hyundai has 9 car models in India, including 3 cars in SUV category, 2 cars in Sedan category, 3 cars in Hatchback category, 1 car in MUV/MPV category.',
    fullDescription: `Hyundai Motor India is the second-largest car manufacturer in India, offering innovative technology, premium features, and stylish designs across various segments from hatchbacks to SUVs. Known for their advanced features, build quality, and after-sales service, Hyundai has established itself as a premium brand in the Indian market.`,
    priceRange: {
      min: 569000,
      max: 2769000
    },
    totalModels: 9,
    categories: {
      suv: 3,
      sedan: 2,
      hatchback: 3,
      muv: 1,
      minivan: 0
    },
    upcomingCars: 1,
    models: ['i10', 'i20', 'Venue', 'Creta', 'Verna', 'Tucson', 'Kona Electric', 'Alcazar']
  },
  'tata': {
    name: 'Tata Motors',
    slug: 'tata',
    logo: '/brands/tata.png',
    description: 'Tata car price starts at Rs 5.65 Lakh for the cheapest model which is Tiago and the price of most expensive model, which is Safari starts at Rs 15.49 Lakh. Tata has 7 car models in India, including 4 cars in SUV category, 1 car in Sedan category, 2 cars in Hatchback category.',
    fullDescription: `Tata Motors is India's leading automotive manufacturer, known for safety, innovation, and robust build quality. From compact cars to luxury SUVs, Tata offers vehicles that combine Indian engineering with global standards. Tata Motors has made significant strides in electric vehicles and safety ratings.`,
    priceRange: {
      min: 565000,
      max: 1549000
    },
    totalModels: 7,
    categories: {
      suv: 4,
      sedan: 1,
      hatchback: 2,
      muv: 0,
      minivan: 0
    },
    upcomingCars: 2,
    models: ['Tiago', 'Tigor', 'Altroz', 'Nexon', 'Harrier', 'Safari', 'Punch']
  },
  'mahindra': {
    name: 'Mahindra',
    slug: 'mahindra',
    logo: '/brands/mahindra.png',
    description: 'Mahindra car price starts at Rs 7.49 Lakh for the cheapest model which is Bolero and the price of most expensive model, which is XUV700 starts at Rs 13.99 Lakh. Mahindra has 10 car models in India, including 8 cars in SUV category, 1 car in MUV category, 1 car in Pickup category.',
    fullDescription: `Mahindra is India's leading SUV manufacturer, known for rugged and reliable vehicles. With a strong focus on utility vehicles, Mahindra has established itself as the go-to brand for customers looking for robust and capable SUVs. The company has been expanding its portfolio with modern SUVs while maintaining its reputation for durability and off-road capability.`,
    priceRange: {
      min: 749000,
      max: 1399000
    },
    totalModels: 10,
    categories: {
      suv: 8,
      sedan: 0,
      hatchback: 0,
      muv: 1,
      minivan: 0
    },
    upcomingCars: 3,
    models: ['Bolero', 'Scorpio', 'XUV300', 'XUV700', 'Thar', 'Scorpio-N', 'XUV400']
  },
  'kia': {
    name: 'Kia',
    slug: 'kia',
    logo: '/brands/kia.png',
    description: 'Kia car price starts at Rs 6.79 Lakh for the cheapest model which is Sonet and the price of most expensive model, which is Carnival starts at Rs 24.95 Lakh. Kia has 6 car models in India, including 4 cars in SUV category, 1 car in Sedan category, 1 car in MUV category.',
    fullDescription: `Kia Motors India has quickly established itself as a premium brand offering feature-rich vehicles with modern design and advanced technology. Known for their bold styling, comprehensive warranty, and value-for-money proposition, Kia cars have gained significant popularity in the Indian market.`,
    priceRange: {
      min: 679000,
      max: 2495000
    },
    totalModels: 6,
    categories: {
      suv: 4,
      sedan: 1,
      hatchback: 0,
      muv: 1,
      minivan: 0
    },
    upcomingCars: 2,
    models: ['Sonet', 'Seltos', 'Carens', 'Carnival', 'EV6']
  },
  'honda': {
    name: 'Honda',
    slug: 'honda',
    logo: '/brands/honda.png',
    description: 'Honda car price starts at Rs 7.31 Lakh for the cheapest model which is Amaze and the price of most expensive model, which is CR-V starts at Rs 32.75 Lakh. Honda has 8 car models in India, including 3 cars in SUV category, 2 cars in Sedan category, 2 cars in Hatchback category, 1 car in MUV category.',
    fullDescription: `Honda Cars India is known for its reliable, fuel-efficient, and well-engineered vehicles. With a reputation for build quality and advanced technology, Honda offers a range of cars from compact sedans to premium SUVs, all backed by excellent after-sales service.`,
    priceRange: {
      min: 731000,
      max: 3275000
    },
    totalModels: 8,
    categories: {
      suv: 3,
      sedan: 2,
      hatchback: 2,
      muv: 1,
      minivan: 0
    },
    upcomingCars: 1,
    models: ['Amaze', 'City', 'Jazz', 'WR-V', 'CR-V', 'Civic']
  }
}

// Error boundary component
function SafeComponent({ children, name }: { children: React.ReactNode, name: string }) {
  try {
    return <>{children}</>
  } catch (error) {
    console.error(`Error in ${name}:`, error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <p className="text-red-600">Error loading {name} component</p>
      </div>
    )
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { 'brand-cars': brandCarsSlug } = await params

  // Extract brand name by removing '-cars' suffix
  const brandSlug = brandCarsSlug.replace(/-cars$/, '')

  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  // ✅ OPTIMIZATION: Fetch brands data once (removed duplicate call)
  try {
    // Fetch brands first to get brand ID
    const brandsRes = await fetch(`${backendUrl}/api/brands`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!brandsRes.ok) {
      console.error('Failed to fetch brands')
      notFound()
    }

    const brands = await brandsRes.json()

    if (!Array.isArray(brands)) {
      console.error('Invalid brands response')
      notFound()
    }

    // Find the brand
    const backendBrand = brands.find((b: any) => {
      const normalizedBrandName = b.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const normalizedSlug = brandSlug.toLowerCase()
      return normalizedBrandName === normalizedSlug || b.name.toLowerCase() === normalizedSlug
    })

    if (!backendBrand) {
      // Fallback to static data
      const staticBrand = brandData[brandSlug as keyof typeof brandData]
      if (!staticBrand) {
        notFound()
      }

      const breadcrumbs = [
        { label: staticBrand.name }
      ]

      return (
        <div className="min-h-screen bg-gray-50">
          <main>
            <SafeComponent name="BrandHeroSection">
              <BrandHeroSection brand={staticBrand} brands={brands} models={[]} />
            </SafeComponent>
          </main>
          <Breadcrumb items={breadcrumbs} />
          <Footer />
        </div>
      )
    }

    // ✅ OPTIMIZATION: Now fetch models data in parallel with brand-specific data
    const [modelsResponse, brandModelsResponse] = await Promise.all([
      fetch(
        `${backendUrl}/api/models-with-pricing?brandId=${backendBrand.id}`,
        {
          next: { revalidate: 1800 }, // Cache for 30 minutes
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      ),
      fetch(
        `${backendUrl}/api/frontend/brands/${backendBrand.id}/models`,
        {
          next: { revalidate: 1800 },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
    ])

    let models = []
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json()
      models = modelsData.data || modelsData || []
    }

    // Map backend brand data to expected format
    const brand = {
      name: backendBrand.name,
      slug: backendBrand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      logo: backendBrand.logo ? `${backendUrl}${backendBrand.logo}` : '/brands/default.png',
      description: backendBrand.summary || `${backendBrand.name} offers a wide range of vehicles with excellent features and competitive pricing.`,
      fullDescription: backendBrand.summary || `${backendBrand.name} is a leading automotive manufacturer known for quality, innovation, and customer satisfaction.`,
      priceRange: {
        min: models.length > 0 ? Math.min(...models.map((m: any) => m.lowestPrice || 0)) : 350000,
        max: models.length > 0 ? Math.max(...models.map((m: any) => m.lowestPrice || 0)) : 2500000
      },
      totalModels: models.length,
      categories: {
        suv: 0,
        sedan: 0,
        hatchback: 0,
        muv: 0,
        minivan: 0
      },
      upcomingCars: 0
    }

    const breadcrumbs = [
      { label: brand.name }
    ]

    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs.map((b: { label: string; href?: string }) => ({
      name: b.label,
      item: b.href || ''
    })))

    return (
      <div className="min-h-screen bg-gray-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        {/* Brand Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Brand",
              "name": brand.name,
              "description": brand.description,
              "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gadizone.com'}/${brand.slug}-cars`,
              "logo": brand.logo,
              "image": brand.logo
            })
          }}
        />
        {/* FAQPage Schema */}
        {backendBrand.faqs && backendBrand.faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": backendBrand.faqs.map((faq: any) => ({
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
        )}
        <main>
          {/* Section 1: Brand Hero Section - Pass all data as props */}
          <SafeComponent name="BrandHeroSection">
            <BrandHeroSection
              brand={brand}
              brands={brands}
              models={models}
              brandId={backendBrand.id}
              backendBrand={backendBrand}
              newsSlot={<BrandNews brandSlug={brandSlug} brandName={brand.name} />}
            />
          </SafeComponent>
        </main>



        <Breadcrumb items={breadcrumbs} />
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Error fetching brand page data:', error)
    notFound()
  }
}
