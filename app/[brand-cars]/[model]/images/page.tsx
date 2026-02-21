import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ModelGalleryClient from './ModelGalleryClient'

interface GalleryPageProps {
    params: Promise<{
        'brand-cars': string
        model: string
    }>
}

export const revalidate = 3600

// Generate SEO metadata
export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const brandSlugRaw = resolvedParams['brand-cars']
    const modelSlugRaw = resolvedParams.model

    // Clean up slugs
    const brandSlug = brandSlugRaw.replace('-cars', '').toLowerCase()
    const modelSlug = modelSlugRaw.toLowerCase()

    // Format names for display
    const brandName = brandSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const modelName = modelSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

    return {
        title: `${brandName} ${modelName} Images & Photo Gallery - All Angles, Colours & Features | gadizone`,
        description: `View the complete photo gallery of ${brandName} ${modelName}. Browse exterior, interior, key features, and colour images. Download and share high-quality photos.`,
        keywords: `${brandName} ${modelName} images, ${brandName} ${modelName} photos, ${brandName} ${modelName} gallery, ${modelName} colours, ${modelName} interior images`,
        openGraph: {
            title: `${brandName} ${modelName} Images & Photo Gallery`,
            description: `Explore all images of ${brandName} ${modelName} - exterior, interior, colours and key features.`,
            type: 'website'
        }
    }
}

// Fetch model data (using same approach as model page)
async function getModelGalleryData(brandSlug: string, modelSlug: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

        // Step 1: Fetch brands to get brand ID
        const brandsResponse = await fetch(`${baseUrl}/api/brands`, { next: { revalidate: 3600 } })
        if (!brandsResponse.ok) throw new Error('Failed to fetch brands')

        const brands = await brandsResponse.json()

        // Find brand by slug
        const brandData = brands.find((brand: any) => {
            const slug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            return slug === brandSlug
        })

        if (!brandData) throw new Error('Brand not found')

        // Step 2: Fetch models for this brand
        const modelsResponse = await fetch(`${baseUrl}/api/frontend/brands/${brandData.id}/models`, { next: { revalidate: 3600 } })
        if (!modelsResponse.ok) throw new Error('Failed to fetch models')

        const modelsData = await modelsResponse.json()
        const modelData = modelsData.models.find((m: any) => m.slug === modelSlug)
        if (!modelData) throw new Error('Model not found')

        // Step 3: Fetch detailed model data
        const detailedModelRes = await fetch(`${baseUrl}/api/models/${modelData.id}`, { next: { revalidate: 3600 } })
        const detailedModelData = detailedModelRes.ok ? await detailedModelRes.json() : null

        // Build gallery array from backend data
        const galleryImages: string[] = []

        // Add hero image first
        const heroImageUrl = detailedModelData?.heroImage || modelData.image
        if (heroImageUrl) {
            galleryImages.push(heroImageUrl.startsWith('/uploads/') ? `${baseUrl}${heroImageUrl}` : heroImageUrl)
        }

        // Add gallery images from backend
        if (detailedModelData?.galleryImages && Array.isArray(detailedModelData.galleryImages)) {
            detailedModelData.galleryImages.forEach((img: any) => {
                if (img?.url) {
                    const fullUrl = img.url.startsWith('/uploads/') ? `${baseUrl}${img.url}` : img.url
                    if (!galleryImages.includes(fullUrl)) {
                        galleryImages.push(fullUrl)
                    }
                }
            })
        }

        // Format color images - handle different data structures
        const colorImages = (detailedModelData?.colorImages || []).map((color: any) => {
            // Handle different image URL formats
            let imageUrl = ''
            if (color.imageUrl) {
                imageUrl = color.imageUrl.startsWith('/uploads/') ? `${baseUrl}${color.imageUrl}` : color.imageUrl
            } else if (color.url) {
                imageUrl = color.url.startsWith('/uploads/') ? `${baseUrl}${color.url}` : color.url
            } else if (color.image) {
                imageUrl = color.image.startsWith('/uploads/') ? `${baseUrl}${color.image}` : color.image
            }

            return {
                caption: color.name || color.caption || color.colorName || 'Color',
                imageUrl: imageUrl,
                hexCode: color.hexCode || color.code || color.hex
            }
        }).filter((c: any) => c.imageUrl) // Only include colors with valid images

        // Format key feature images
        const keyFeaturesImages = (detailedModelData?.keyFeatureImages || []).map((img: any) => ({
            caption: img.caption || img.title || 'Feature',
            imageUrl: img.url?.startsWith('/uploads/') ? `${baseUrl}${img.url}` : (img.url || img.image || '')
        }))

        // Format data for gallery
        const galleryData = {
            brand: brandData.name,
            brandSlug: brandSlug,
            model: modelData.name,
            modelSlug: modelSlug,
            heroImage: galleryImages[0] || '',
            gallery: galleryImages.slice(1),
            colorImages: colorImages,
            keyFeaturesImages: keyFeaturesImages,
            interiorImages: detailedModelData?.interiorImages || [],
            exteriorImages: detailedModelData?.exteriorImages || [],
            seoDescription: detailedModelData?.headerSeo || `Explore the complete image gallery of ${brandData.name} ${modelData.name}.`,
            rating: modelData.rating || 4.2,
            reviewCount: modelData.reviews || 0
        }

        return galleryData
    } catch (error) {
        console.error('Error fetching gallery data:', error)
        return null
    }
}

export default async function ModelGalleryPage({ params }: GalleryPageProps) {
    const resolvedParams = await params
    const brandSlugRaw = resolvedParams['brand-cars']
    const modelSlugRaw = resolvedParams.model

    // Clean up slugs
    const brandSlug = brandSlugRaw.replace('-cars', '').toLowerCase()
    const modelSlug = modelSlugRaw.toLowerCase()

    const galleryData = await getModelGalleryData(brandSlug, modelSlug)

    if (!galleryData) {
        notFound()
    }

    return <ModelGalleryClient galleryData={galleryData} />
}
