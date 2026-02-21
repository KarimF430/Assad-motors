'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'

interface CarData {
  fullName: string
  brand: string
  model: string
  bodyType?: string
  startingPrice?: number
  endingPrice?: number
  mileage?: any
  variants?: any[]
  seatingCapacity?: number
  fuelTypes?: string[]
  keySpecs?: any
  isEV?: boolean
  segment?: string
}

interface ModelSummarySEOProps {
  carData: CarData
}

// Detect body type from various data sources
function detectBodyType(carData: CarData): string {
  const raw = (carData.bodyType || carData.segment || '').toLowerCase()
  if (raw.includes('suv') || raw.includes('crossover')) return 'suv'
  if (raw.includes('sedan')) return 'sedan'
  if (raw.includes('muv') || raw.includes('mpv') || raw.includes('minivan')) return 'muv'
  if (raw.includes('hatchback') || raw.includes('hatch')) return 'hatchback'
  if (raw.includes('coupe') || raw.includes('convertible')) return 'coupe'
  if (raw.includes('pickup') || raw.includes('truck')) return 'pickup'
  // Fallback: guess from model name patterns
  const model = carData.model.toLowerCase()
  if (['fortuner', 'thar', 'scorpio', 'xuv', 'creta', 'seltos', 'nexon', 'brezza', 'ecosport', 'venue', 'sonet', 'punch', 'harrier', 'safari', 'hector', 'compass', 'duster', 'kwid', 'magnite'].some(s => model.includes(s))) return 'suv'
  if (['city', 'ciaz', 'verna', 'dzire', 'amaze', 'aspire', 'tigor'].some(s => model.includes(s))) return 'sedan'
  if (['innova', 'ertiga', 'marazzo', 'carnival', 'carens', 'bolero'].some(s => model.includes(s))) return 'muv'
  return 'hatchback'
}

function isElectric(carData: CarData): boolean {
  if (carData.isEV) return true
  const fuelTypes = (carData.fuelTypes || []).map(f => f.toLowerCase())
  if (fuelTypes.some(f => f.includes('electric') || f === 'ev')) return true
  const model = carData.model.toLowerCase()
  return model.includes(' ev') || model.endsWith('ev') || model.includes('electric') || model.includes('e-') || model.includes('nexon ev') || model.includes('zs ev')
}

function formatPrice(price: number): string {
  const lakhs = price / 100000
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`
  return `₹${lakhs.toFixed(2)} Lakh`
}

function getBestMileage(carData: CarData): string {
  // Try variants first
  if (carData.variants && carData.variants.length > 0) {
    let best = 0
    carData.variants.forEach((v: any) => {
      const m = parseFloat((v.mileage || v.claimedMileage || v.fuelEfficiency || '0').toString())
      if (m > best) best = m
    })
    if (best > 0) return `${best} kmpl`
  }
  // Try mileage field
  if (carData.mileage) {
    if (Array.isArray(carData.mileage) && carData.mileage.length > 0) {
      return `${carData.mileage[0].value} ${carData.mileage[0].unit || 'kmpl'}`
    }
    if (typeof carData.mileage === 'string' || typeof carData.mileage === 'number') {
      return `${carData.mileage} kmpl`
    }
  }
  return ''
}

function getSeating(carData: CarData): number {
  if (carData.seatingCapacity && carData.seatingCapacity > 0) return carData.seatingCapacity
  const bodyType = detectBodyType(carData)
  if (bodyType === 'muv') return 7
  if (bodyType === 'suv') return 5
  return 5
}

function getVariantCount(carData: CarData): number {
  if (carData.variants && carData.variants.length > 0) return carData.variants.length
  return 0
}

// -----------------------------------------------------------------------
// CONTENT GENERATORS — one per body type, all use real carData
// -----------------------------------------------------------------------

function generateHatchbackContent(carData: CarData, ev: boolean) {
  const { fullName, brand, model } = carData
  const mileage = getBestMileage(carData)
  const priceMin = carData.startingPrice ? formatPrice(carData.startingPrice) : ''
  const priceMax = carData.endingPrice ? formatPrice(carData.endingPrice) : ''
  const priceStr = priceMin && priceMax && priceMin !== priceMax
    ? `${priceMin} to ${priceMax}`
    : priceMin || 'competitive pricing'

  const short = `The ${fullName} is one of ${brand}'s most practical city cars — compact enough to squeeze through tight lanes, yet roomy enough for a family of four. It's the kind of car that makes daily commuting genuinely stress-free, especially in Indian traffic conditions.`

  const full = `The ${fullName} sits in one of the most hotly contested segments in India — the compact hatchback space — and it holds its own with a sensible mix of features, efficiency, and everyday usability.

**Who Is This Car For?**
If you're a first-time buyer, a young professional navigating city traffic, or a family looking for a reliable second car, the ${fullName} deserves a serious look. It's priced at ${priceStr}, which puts it squarely in the sweet spot for buyers who want modern features without stretching their budget.

**Design and Cabin**
The ${model} has a clean, contemporary look that doesn't try too hard. The cabin is well laid out — controls fall naturally to hand, the seats are supportive for long drives, and there's enough headroom for taller passengers in the front. Boot space is adequate for weekend trips, though you'll want to pack light if you're carrying four adults.

**Performance and Efficiency**
${ev ? `As an electric hatchback, the ${model} offers instant torque that makes it surprisingly peppy in city conditions. Charging infrastructure is still growing in India, so plan your routes accordingly.` : `The engine is tuned more for efficiency than outright punch, which is exactly what most city buyers need. ${mileage ? `With a claimed mileage of ${mileage}, running costs stay low.` : 'Fuel efficiency is a strong point.'} The manual gearbox is slick, and the AMT option (if available) makes stop-and-go traffic much less tiring.`}

**Features and Technology**
Higher variants get a touchscreen infotainment system with Android Auto and Apple CarPlay — standard expectations in this segment now. You also get rear parking sensors, automatic climate control, and in some variants, a sunroof. The safety kit includes dual airbags and ABS as standard.

**The Bottom Line**
The ${fullName} is a sensible, well-rounded city car. It won't set your pulse racing on a mountain road, but that's not what it's built for. For daily commuting, school runs, and weekend errands, it's genuinely hard to fault.`

  return { short, full }
}

function generateSUVContent(carData: CarData, ev: boolean) {
  const { fullName, brand, model } = carData
  const mileage = getBestMileage(carData)
  const priceMin = carData.startingPrice ? formatPrice(carData.startingPrice) : ''
  const priceMax = carData.endingPrice ? formatPrice(carData.endingPrice) : ''
  const priceStr = priceMin && priceMax && priceMin !== priceMax
    ? `${priceMin} to ${priceMax}`
    : priceMin || 'competitive pricing'
  const seating = getSeating(carData)

  const short = `The ${fullName} is a ${seating}-seater SUV that strikes a balance between road presence, practicality, and value. Whether you're navigating city traffic or heading out on a weekend highway run, it's built to handle both without complaint.`

  const full = `The ${fullName} competes in one of the fastest-growing segments in India — the SUV space — where buyers expect a commanding driving position, generous space, and enough features to justify the premium over a hatchback or sedan.

**Who Is This Car For?**
The ${model} is aimed at buyers who want the high seating position and road presence of an SUV without necessarily going off-road. It's a strong choice for families, highway travellers, and anyone who regularly deals with bad roads or waterlogged streets during monsoon season. Priced at ${priceStr}, it targets the heart of the SUV market.

**Design and Road Presence**
The ${model} has a bold, upright stance that commands attention. The front fascia is assertive, and the overall proportions give it a sense of solidity. Inside, the cabin feels airy thanks to the tall roofline, and the elevated seating position gives you a clear view of traffic ahead — a genuine advantage on Indian roads.

**Performance and Capability**
${ev ? `The ${model} EV delivers strong, instant torque that makes it feel effortlessly quick in city conditions. The battery range is well-suited for most urban and semi-urban use cases, though long highway trips will require some charging planning.` : `The engine lineup typically includes petrol and diesel options, each tuned for a different kind of buyer. The diesel is the better choice for highway driving and long distances, while the petrol suits city use. ${mileage ? `Claimed mileage of ${mileage} is competitive for this class.` : ''} Ground clearance is generous enough to handle broken roads and speed breakers with ease.`}

**Cabin Space and Practicality**
${seating >= 7 ? `With ${seating} seats, the ${model} can carry the whole family — though the third row is best suited for children or short trips. The boot space with all rows up is limited, so plan accordingly.` : `The ${model} is a 5-seater, which means the boot space is generous. Rear passengers get good legroom, and the wide doors make getting in and out easy, even for older family members.`}

**Features and Safety**
Top variants come well-equipped with a large touchscreen, connected car features, panoramic sunroof, ventilated seats, and multiple airbags. Safety ratings are an important consideration — check the Global NCAP score for the specific variant you're considering.

**The Bottom Line**
The ${fullName} is a capable, well-rounded SUV that makes a strong case for itself in a crowded market. It's not the cheapest option, but it offers genuine value when you factor in the space, features, and the confidence that comes with a higher driving position.`

  return { short, full }
}

function generateSedanContent(carData: CarData, ev: boolean) {
  const { fullName, brand, model } = carData
  const mileage = getBestMileage(carData)
  const priceMin = carData.startingPrice ? formatPrice(carData.startingPrice) : ''
  const priceMax = carData.endingPrice ? formatPrice(carData.endingPrice) : ''
  const priceStr = priceMin && priceMax && priceMin !== priceMax
    ? `${priceMin} to ${priceMax}`
    : priceMin || 'competitive pricing'

  const short = `The ${fullName} is a proper three-box sedan that offers a step up in refinement, boot space, and highway comfort over most hatchbacks in a similar price range. It's the kind of car that feels right for both office commutes and long weekend drives.`

  const full = `Sedans have always had a loyal following in India, and the ${fullName} understands exactly what that buyer wants — a refined, comfortable car that looks professional, drives smoothly, and doesn't cost a fortune to maintain.

**Who Is This Car For?**
The ${model} is ideal for buyers who prioritise a quiet, composed driving experience and need a proper boot for luggage. It's a popular choice among corporate buyers, senior professionals, and families who do regular intercity travel. At ${priceStr}, it competes directly with some well-established names in the segment.

**Design and Presence**
The ${model} has a clean, mature design — not flashy, but polished. The three-box silhouette gives it a formal look that works well in business contexts. The cabin is typically quieter than an equivalent hatchback, with better NVH (noise, vibration, harshness) insulation that makes highway driving noticeably more relaxed.

**Performance and Efficiency**
${ev ? `The electric powertrain delivers smooth, silent acceleration — a natural fit for the sedan's refined character. The range is well-suited for urban and suburban use.` : `The engine options are tuned for refinement over raw performance. The petrol is smooth and responsive in city conditions, while the diesel (if available) makes more sense for buyers who clock high monthly kilometres. ${mileage ? `Claimed mileage of ${mileage} is solid for this class.` : ''}`}

**Boot Space and Practicality**
This is where sedans genuinely shine. The ${model} offers a proper boot that can swallow multiple large suitcases — a real advantage over hatchbacks when you're travelling with family. Rear seat space is generous, with good legroom and a flat floor that makes the middle seat usable.

**Features and Comfort**
Higher variants come with ventilated front seats, a large touchscreen with wireless connectivity, automatic climate control, and cruise control — features that make long drives significantly more comfortable. Safety equipment has improved across the segment, with multiple airbags and stability control now more widely available.

**The Bottom Line**
The ${fullName} is a well-executed sedan that delivers on the core promises of the body style — refinement, space, and highway comfort. If you've been considering a sedan over an SUV, this is a strong contender worth a test drive.`

  return { short, full }
}

function generateMUVContent(carData: CarData, ev: boolean) {
  const { fullName, brand, model } = carData
  const mileage = getBestMileage(carData)
  const priceMin = carData.startingPrice ? formatPrice(carData.startingPrice) : ''
  const priceMax = carData.endingPrice ? formatPrice(carData.endingPrice) : ''
  const priceStr = priceMin && priceMax && priceMin !== priceMax
    ? `${priceMin} to ${priceMax}`
    : priceMin || 'competitive pricing'
  const seating = getSeating(carData)

  const short = `The ${fullName} is a ${seating}-seater MUV built for families who need genuine space for everyone — including the third row. It's a practical, no-nonsense people carrier that handles Indian roads and large families with equal ease.`

  const full = `In a market dominated by SUVs, the ${fullName} makes a quiet but compelling case for the MUV format — more interior space, better third-row access, and a driving experience tuned for comfort over sportiness.

**Who Is This Car For?**
The ${model} is purpose-built for large families, school runs with multiple kids, and anyone who regularly needs to seat ${seating} people in genuine comfort. It's also popular with businesses that use it for staff transport. At ${priceStr}, it offers more usable space per rupee than most SUVs in the same price bracket.

**Design and Practicality**
The ${model} prioritises function over form — it's tall, boxy, and designed to maximise interior volume. The sliding rear doors (if equipped) make getting in and out easy, even in tight parking spots. The cabin layout is thoughtfully designed, with multiple storage pockets, USB charging points, and enough headroom for adults in all three rows.

**Performance and Efficiency**
${ev ? `The electric powertrain suits the MUV's character well — smooth, quiet, and effortless in city conditions.` : `The diesel engine is the heart of the ${model} lineup — it has the torque needed to haul a full load of passengers without feeling strained. ${mileage ? `Claimed mileage of ${mileage} is reasonable given the vehicle's size.` : ''} The petrol option is smoother but better suited for buyers with lower monthly mileage.`}

**Third Row and Boot Space**
The third row is genuinely usable for adults on shorter trips — a claim few SUVs can honestly make. Boot space with all rows up is limited, so if you're travelling with seven people and luggage, you'll need to pack smart. Fold the third row and you get a cavernous cargo area.

**Features and Comfort**
Higher variants come well-equipped with captain seats in the second row, a large infotainment screen, automatic climate control with rear vents, and multiple airbags. The ride quality is tuned for comfort, which is exactly what you want when carrying a full complement of passengers.

**The Bottom Line**
The ${fullName} is the right choice if space is your primary requirement. It's not the most exciting car to drive, but it does its core job — moving people comfortably — better than almost anything else at this price point.`

  return { short, full }
}

// -----------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------

export default function ModelSummarySEO({ carData }: ModelSummarySEOProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const bodyType = detectBodyType(carData)
  const ev = isElectric(carData)
  const variantCount = getVariantCount(carData)
  const seating = getSeating(carData)
  const mileage = getBestMileage(carData)

  let summaryContent: { short: string; full: string }
  if (bodyType === 'suv') {
    summaryContent = generateSUVContent(carData, ev)
  } else if (bodyType === 'sedan') {
    summaryContent = generateSedanContent(carData, ev)
  } else if (bodyType === 'muv') {
    summaryContent = generateMUVContent(carData, ev)
  } else {
    summaryContent = generateHatchbackContent(carData, ev)
  }

  // Body-type-specific keyword tags
  const bodyTypeLabel = bodyType === 'suv' ? 'SUV' : bodyType === 'sedan' ? 'Sedan' : bodyType === 'muv' ? 'MUV' : 'Hatchback'
  const keywords = [
    `${carData.brand} ${carData.model}`,
    `${carData.model} price`,
    `${carData.model} mileage`,
    `${carData.model} review`,
    `${carData.model} on road price`,
    `${carData.model} variants`,
    `${carData.model} specifications`,
    `${carData.model} features`,
    `best ${bodyTypeLabel.toLowerCase()} in India`,
    ev ? 'electric car India' : 'fuel efficient cars',
    `${carData.brand} cars India`,
    `${carData.model} vs competitors`,
  ]

  // Render full content with proper section headers
  const renderFullContent = () => {
    const sections = summaryContent.full.split('\n\n')
    return sections.map((section, index) => {
      if (section.startsWith('**') && section.endsWith('**')) {
        return (
          <h4 key={index} className="text-base font-semibold text-gray-900 mt-5 mb-2">
            {section.replace(/\*\*/g, '')}
          </h4>
        )
      }
      // Handle inline bold
      const parts = section.split(/(\*\*[\s\S]*?\*\*)/g)
      return (
        <p key={index} className="mb-3 text-gray-700 leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>
            }
            return <span key={i}>{part}</span>
          })}
        </p>
      )
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {carData.fullName} — Overview & Review
          </h2>
          <p className="text-gray-500 text-sm">
            {bodyTypeLabel}{ev ? ' (Electric)' : ''} · {seating} Seater{variantCount > 0 ? ` · ${variantCount} Variants` : ''}
          </p>
        </div>
      </div>

      {/* Short Summary */}
      <div className="prose prose-gray max-w-none mb-6">
        <p className="text-gray-700 leading-relaxed text-base">
          {summaryContent.short}
        </p>
      </div>

      {/* Expandable Full Summary */}
      <div className="border-t border-gray-200 pt-5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left mb-4 hover:bg-gray-50 p-3 rounded-lg transition-colors"
        >
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Full Review & Detailed Analysis
            </h3>
            <p className="text-sm text-gray-500">
              Who should buy it, performance, space, features, and verdict
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
          )}
        </button>

        {isExpanded && (
          <div className="prose prose-gray max-w-none">
            <div className="text-gray-700 leading-relaxed">
              {renderFullContent()}
            </div>
          </div>
        )}
      </div>

      {/* Key Highlights — use real data */}
      <div className="mt-6 pt-5 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-3">At a Glance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mileage && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
              <p className="text-lg font-bold text-blue-600">{mileage}</p>
              <p className="text-xs text-blue-700">{ev ? 'Range' : 'Claimed Mileage'}</p>
            </div>
          )}
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100 text-center">
            <p className="text-lg font-bold text-orange-600">{bodyTypeLabel}</p>
            <p className="text-xs text-orange-700">Body Type</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 text-center">
            <p className="text-lg font-bold text-purple-600">{seating}</p>
            <p className="text-xs text-purple-700">Seating</p>
          </div>
          {variantCount > 0 && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-center">
              <p className="text-lg font-bold text-green-600">{variantCount}</p>
              <p className="text-xs text-green-700">Variants</p>
            </div>
          )}
        </div>
      </div>

      {/* SEO keyword tags */}
      <div className="mt-5 bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-500 font-medium mb-2">Related searches</p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
