import { Metadata } from 'next'
import { getPopularCities } from '@/lib/cities-data'
import LocationSelector from './LocationSelector'

export const metadata: Metadata = {
  title: 'Select Your City - Get Accurate Car Prices | gadizone',
  description: 'Select your city to get accurate on-road car prices, including RTO charges, insurance, and local taxes for your area.',
  keywords: 'city selection, car prices by city, on-road price, RTO charges by city',
}

// Server-side: Pre-fetch popular cities
export default function LocationPage() {
  const popularCities = getPopularCities()

  return <LocationSelector popularCities={popularCities} />
}
