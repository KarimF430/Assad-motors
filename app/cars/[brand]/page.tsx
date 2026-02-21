import { Metadata } from 'next'
import BrandCarsListing from '@/components/brand/BrandCarsListing'

interface BrandPageProps {
  params: Promise<{
    brand: string
  }>
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand } = await params
  const brandName = brand.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  return {
    title: `${brandName} Cars - New Models, Prices & Reviews | gadizone`,
    description: `Explore all ${brandName} car models with detailed specifications, prices, reviews, and comparisons. Find the perfect ${brandName} car for your needs.`,
    keywords: `${brandName} cars, ${brandName} models, ${brandName} prices, new ${brandName} cars, ${brandName} reviews`,
    openGraph: {
      title: `${brandName} Cars - New Models, Prices & Reviews | gadizone`,
      description: `Explore all ${brandName} car models with detailed specifications, prices, reviews, and comparisons.`,
      type: 'website',
    },
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params
  return (
    <div className="min-h-screen bg-gray-50">
      <BrandCarsListing brand={brand} />
    </div>
  )
}
