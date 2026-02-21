import { Metadata } from 'next'
import { Suspense } from 'react'
import SearchClient from './SearchClient'

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Search Cars - Find Your Perfect Car | gadizone',
  description: 'Search for cars by name, brand, or model. Find detailed specifications, prices, reviews, and comparisons for all car models in India.',
  keywords: 'car search, find cars, search cars India, car models, car brands',
  openGraph: {
    title: 'Search Cars | gadizone',
    description: 'Search and find your perfect car from thousands of models',
    type: 'website'
  }
}

// Trending searches - server-side data
const trendingSearches = [
  { term: 'Hyundai Creta', url: '/hyundai-cars/creta' },
  { term: 'Maruti Suzuki Victoris', url: '/maruti-suzuki-cars/victoris' },
  { term: 'Mahindra XUV9e', url: '/mahindra-cars/xuv9e' },
  { term: 'Hyundai Venue', url: '/hyundai-cars/venue' }
]

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const initialQuery = params.q || ''

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <SearchClient
        trendingSearches={trendingSearches}
        initialQuery={initialQuery}
      />
    </Suspense>
  )
}
