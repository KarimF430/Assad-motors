import { redirect, notFound } from 'next/navigation'

interface ModelPageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Smart Redirector for Legacy Links
 * This page handles:
 * 1. Legacy numeric IDs (e.g. /models/2909414098)
 * 2. Legacy slugs (e.g. /models/hyundai-creta)
 * It resolves them to the new production format: /{brand}-cars/{model}
 */
export default async function ModelRedirectPage({ params }: ModelPageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  let redirectPath: string | null = null

  try {
    // 1. Try to fetch as a direct model ID (numeric)
    if (/^\d+$/.test(slug)) {
      const modelRes = await fetch(`${backendUrl}/api/models/${slug}`, { next: { revalidate: 3600 } })
      if (modelRes.ok) {
        const model = await modelRes.json()
        const brandsRes = await fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        const brands = await brandsRes.json()
        const brand = brands.find((b: any) => b.id === model.brandId)

        if (brand) {
          const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          const modelSlug = model.slug || model.name.toLowerCase().replace(/\s+/g, '-')
          redirectPath = `/${brandSlug}-cars/${modelSlug}`
        }
      }
    }

    if (!redirectPath) {
      // 2. Try to resolve as a legacy slug (e.g. "maruti-suzuki-grand-vitara")
      const brandsRes = await fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
      const brands = await brandsRes.json()

      let brandData = null
      let modelSlugPart = null

      // Try to find which brand this slug starts with
      for (const brand of brands) {
        const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        if (slug.startsWith(brandSlug + '-')) {
          brandData = brand
          modelSlugPart = slug.substring(brandSlug.length + 1)
          break
        }
      }

      if (brandData && modelSlugPart) {
        const modelsRes = await fetch(`${backendUrl}/api/frontend/brands/${brandData.id}/models`, { next: { revalidate: 3600 } })
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json()
          const model = modelsData.models.find((m: any) => m.slug === modelSlugPart || m.name.toLowerCase().replace(/\s+/g, '-') === modelSlugPart)

          if (model) {
            const brandSlug = brandData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            redirectPath = `/${brandSlug}-cars/${model.slug || model.name.toLowerCase().replace(/\s+/g, '-')}`
          }
        }
      }

      if (!redirectPath) {
        // 3. Fallback: Search all models for a slug match if the brand prefix didn't work
        const allModelsRes = await fetch(`${backendUrl}/api/models-with-pricing?limit=1000`, { next: { revalidate: 3600 } })
        if (allModelsRes.ok) {
          const modelsData = await allModelsRes.json()
          const models = modelsData.data || modelsData
          const foundModel = models.find((m: any) => m.slug === slug || m.name.toLowerCase().replace(/\s+/g, '-') === slug)

          if (foundModel) {
            const brandName = foundModel.brandName || brands.find((b: any) => b.id === foundModel.brandId)?.name
            if (brandName) {
              const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
              const modelSlug = foundModel.slug || foundModel.name.toLowerCase().replace(/\s+/g, '-')
              redirectPath = `/${brandSlug}-cars/${modelSlug}`
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Redirect calculation error:', error)
  }

  if (redirectPath) {
    redirect(redirectPath)
  }

  notFound()
}
