import { Metadata } from 'next'
import VariantPage from '@/components/variant/VariantPage'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const [brandName = 'Renault', modelName = 'Kwid', variantName = 'LXI'] = slug.split('-')
  
  return {
    title: `${brandName} ${modelName} ${variantName} - Price, Specs & Features | gadizone`,
    description: `Get detailed information about ${brandName} ${modelName} ${variantName} variant including price, specifications, features, and expert reviews.`,
    keywords: `${brandName} ${modelName} ${variantName}, variant price, car specifications, features, reviews`,
  }
}

export default async function VariantDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [brandName = 'Renault', modelName = 'Kwid', variantName = 'LXI'] = slug.split('-')
  
  console.log('VariantDetailPage: URL slug:', slug)
  console.log('VariantDetailPage: Parsed params:', { brandName, modelName, variantName })

  // Fallback mock data for when backend is unavailable
  const mockVariantData = {
    brand: brandName,
    model: modelName,
    variant: variantName,
    fullName: `${brandName} ${modelName} ${variantName}`,
    price: 8.00,
    originalPrice: 9.50,
    savings: 1.50,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seating: 5,
    mileage: 22.3,
    engine: '1.0L',
    power: '68 PS',
    torque: '91 Nm',
    rating: 4.5,
    reviewCount: 1250,
    launchYear: 2023,
    description: `The ${brandName} ${modelName} ${variantName} offers exceptional value with modern features and reliable performance.`,
    images: [
      'https://images.unsplash.com/photo-1549399084-d56e05c50b8d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop&crop=center'
    ],
    highlights: [
      'Best-in-class fuel efficiency',
      'Spacious cabin design',
      'Advanced safety features',
      'Modern infotainment system'
    ],
    cities: [
      { id: 1, name: "Delhi" },
      { id: 2, name: "Mumbai" },
      { id: 3, name: "Bangalore" },
      { id: 4, name: "Chennai" }
    ]
  }

  return (
    <VariantPage 
      variantData={mockVariantData}
      brandName={brandName}
      modelName={modelName}
      variantName={variantName}
    />
  )
}
