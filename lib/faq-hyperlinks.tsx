import Link from 'next/link'
import React from 'react'

// Common car model names that should be hyperlinked
// This will be expanded with actual model data from the backend
const CAR_MODELS = [
  // Honda models
  'Honda WR-V', 'Honda 0 Alpha', 'Amaze 2nd Gen', 'City Hybrid eHEV', 'Amaze', 'Elevate', 'City',
  'Honda Civic', 'Honda Accord', 'Honda CR-V', 'Honda Jazz', 'Honda BR-V',

  // Maruti Suzuki models
  'Swift', 'Baleno', 'Dzire', 'Vitara Brezza', 'Ertiga', 'Ciaz', 'S-Cross', 'XL6', 'Grand Vitara',
  'Alto K10', 'S-Presso', 'Wagon R',

  // Hyundai models
  'Creta', 'Venue', 'i20', 'Verna', 'Alcazar', 'Tucson', 'Elantra', 'Kona Electric', 'i10 Nios', 'Aura',

  // Tata models
  'Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz', 'Tiago', 'Tigor', 'Curvv', 'Nexon EV', 'Tigor EV', 'Tiago EV',

  // Mahindra models
  'XUV700', 'Scorpio N', 'Thar', 'XUV300', 'Bolero', 'Bolero Neo', 'XUV400', 'Scorpio Classic', 'Marazzo',

  // Toyota models
  'Innova Crysta', 'Fortuner', 'Camry', 'Glanza', 'Urban Cruiser Hyryder', 'Vellfire',

  // Kia models
  'Seltos', 'Sonet', 'Carens', 'EV6',

  // BMW models
  'X1', 'X3', 'X5', 'X7', '3 Series', '5 Series', '7 Series', 'Z4', 'i4', 'iX',

  // Mercedes-Benz models
  'A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'EQS', 'EQC'
]

// Brand to slug mapping for URL generation
const BRAND_SLUGS: { [key: string]: string } = {
  'Honda': 'honda',
  'Maruti': 'maruti-suzuki',
  'Maruti Suzuki': 'maruti-suzuki',
  'Hyundai': 'hyundai',
  'Tata': 'tata',
  'Tata Motors': 'tata',
  'Mahindra': 'mahindra',
  'Toyota': 'toyota',
  'Kia': 'kia',
  'BMW': 'bmw',
  'Mercedes-Benz': 'mercedes-benz',
  'Mercedes': 'mercedes-benz'
}

/**
 * Extracts brand name from a car model name
 * @param modelName - Full model name (e.g., "Honda City", "Maruti Swift")
 * @returns Brand name or null if not found
 */
function extractBrandFromModel(modelName: string): string | null {
  const brands = Object.keys(BRAND_SLUGS)
  for (const brand of brands) {
    if (modelName.toLowerCase().includes(brand.toLowerCase())) {
      return brand
    }
  }
  return null
}

/**
 * Generates URL for a car model page
 * @param modelName - Car model name
 * @param brandName - Brand name (optional, will be extracted if not provided)
 * @returns URL path for the car model page
 */
function generateModelUrl(modelName: string, brandName?: string): string {
  const brand = brandName || extractBrandFromModel(modelName)
  if (!brand) {
    console.warn(`Could not determine brand for model: ${modelName}`)
    return '#'
  }

  const brandSlug = BRAND_SLUGS[brand]
  if (!brandSlug) {
    console.warn(`No slug found for brand: ${brand}`)
    return '#'
  }

  // Clean model name for URL (remove brand prefix, convert to slug)
  let cleanModelName = modelName
    .replace(new RegExp(`^${brand}\\s+`, 'i'), '') // Remove brand prefix
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters

  return `/${brandSlug}-cars/${cleanModelName}`
}

/**
 * Converts text with car model names to JSX with hyperlinks
 * @param text - Text that may contain car model names
 * @param brandContext - Current brand context (optional, for better matching)
 * @returns JSX element with hyperlinked car model names
 */
export function renderTextWithCarLinks(text: string, brandContext?: string): React.ReactNode {
  if (!text) return text

  // Sort models by length (longest first) to avoid partial matches
  const sortedModels = [...CAR_MODELS].sort((a, b) => b.length - a.length)

  let result: React.ReactNode[] = []
  let remainingText = text
  let keyCounter = 0

  while (remainingText.length > 0) {
    let foundMatch = false

    // Look for car model names in the remaining text
    for (const model of sortedModels) {
      const regex = new RegExp(`\\b${model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      const match = remainingText.match(regex)

      if (match) {
        const matchIndex = remainingText.search(regex)

        // Add text before the match
        if (matchIndex > 0) {
          result.push(remainingText.substring(0, matchIndex))
        }

        // Add the hyperlinked model name
        const matchedText = match[0]
        const modelUrl = generateModelUrl(matchedText, brandContext)

        result.push(
          <Link
            key={`link-${keyCounter++}`}
            href={modelUrl}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
          >
            {matchedText}
          </Link>
        )

        // Update remaining text
        remainingText = remainingText.substring(matchIndex + matchedText.length)
        foundMatch = true
        break
      }
    }

    // If no match found, add the rest of the text and break
    if (!foundMatch) {
      if (remainingText.length > 0) {
        result.push(remainingText)
      }
      break
    }
  }

  return result.length === 0 ? text : <>{result}</>
}

/**
 * Updates the car models list dynamically from backend data
 * @param models - Array of model objects from backend
 */
export function updateCarModelsList(models: Array<{ name: string; brandName: string }>): void {
  const newModels = models.map(model => {
    // Add both "Brand Model" and "Model" formats
    return [
      `${model.brandName} ${model.name}`,
      model.name
    ]
  }).flat()

  // Add new models to the existing list (avoid duplicates)
  newModels.forEach(model => {
    if (!CAR_MODELS.includes(model)) {
      CAR_MODELS.push(model)
    }
  })

  // Sort by length again
  CAR_MODELS.sort((a, b) => b.length - a.length)
}

/**
 * Hook to fetch and update car models from backend
 */
export function useCarModelsData() {
  React.useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/models`)
        if (response.ok) {
          const models = await response.json()
          if (Array.isArray(models)) {
            updateCarModelsList(models)
          }
        }
      } catch (error) {
        console.warn('Failed to fetch car models for hyperlink generation:', error)
      }
    }

    fetchModels()
  }, [])
}
