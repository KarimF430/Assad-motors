import PriceBreakupPage from '@/components/price-breakup/PriceBreakupPage'

interface GetPricePageProps {
  params: Promise<{
    'brand-cars': string
    model: string
  }>
}

import { FloatingAIBot } from '@/components/FloatingAIBot'

export default async function GetPricePage({ params }: GetPricePageProps) {
  const resolvedParams = await params

  // Extract brand from "honda-cars" -> "honda"
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  
  // Default city is Mumbai
  const citySlug = 'mumbai'

  return (
    <>
      <PriceBreakupPage
        brandSlug={brandSlug}
        modelSlug={modelSlug}
        citySlug={citySlug}
      />
      <FloatingAIBot type="price" id={modelSlug} name={modelSlug} />
    </>
  )
}
