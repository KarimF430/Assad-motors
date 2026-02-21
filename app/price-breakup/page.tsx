import { Metadata } from 'next'
import { Suspense } from 'react'
import PriceBreakupPage from '@/components/price-breakup/PriceBreakupPage'

export const metadata: Metadata = {
  title: 'Car Price Breakup - On-Road Price Calculator | gadizone',
  description: 'Calculate detailed on-road price breakup for any car. Get complete cost analysis including ex-showroom price, RTO, insurance, and other charges.',
  keywords: 'car price breakup, on-road price calculator, car cost analysis, RTO charges, insurance cost',
}

export default function PriceBreakup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Price Calculator...</p>
        </div>
      </div>
    }>
      <PriceBreakupPage />
    </Suspense>
  )
}
