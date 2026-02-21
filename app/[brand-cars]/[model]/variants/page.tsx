import AllVariantsClient from '@/components/car-model/AllVariantsClient'
import { notFound } from 'next/navigation'

interface VariantsPageProps {
  params: Promise<{
    'brand-cars': string
    model: string
  }>
}

// Enable ISR with 1-hour revalidation (matches Model Page)
export const revalidate = 3600

async function getModelData(brandSlug: string, modelSlug: string) {
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    const brandsResponse = await fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
    if (!brandsResponse.ok) throw new Error('Failed to fetch brands')

    const brands = await brandsResponse.json()

    const brandData = brands.find((brand: any) => {
      const slug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return slug === brandSlug
    })

    if (!brandData) throw new Error('Brand not found')

    const modelsResponse = await fetch(`${backendUrl}/api/frontend/brands/${brandData.id}/models`, { next: { revalidate: 3600 } })
    if (!modelsResponse.ok) throw new Error('Failed to fetch models')

    const modelsData = await modelsResponse.json()
    const modelData = modelsData.models.find((m: any) => m.slug === modelSlug)
    if (!modelData) throw new Error('Model not found')

    // ✅ Fetch ALL variants for View All page (no limit)
    const variantsResponse = await fetch(`${backendUrl}/api/variants?modelId=${modelData.id}&fields=minimal`, {
      next: { revalidate: 3600 }
    })
    const variants = variantsResponse.ok ? await variantsResponse.json() : []

    return {
      ...modelData,
      variants // ✅ Include all variants
    }
  } catch (error) {
    console.error('Error fetching model data:', error)
    return null
  }
}

export default async function VariantsPage({ params }: VariantsPageProps) {
  const resolvedParams = await params

  // Extract brand from "honda-cars" -> "honda"
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model

  const modelData = await getModelData(brandSlug, modelSlug)

  if (!modelData) {
    notFound()
  }

  return <AllVariantsClient
    model={modelData}
    brandSlug={resolvedParams['brand-cars']}
    modelSlug={modelSlug}
    initialVariants={modelData.variants || []}
  />
}
