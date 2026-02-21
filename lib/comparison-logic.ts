
interface Variant {
    id: string
    name: string
    price: number
    fuelType: string
    transmission: string
    mileageCompanyClaimed?: string
    mileageCity?: string
    maxPower?: string
    maxTorque?: string
    engineCapacity?: string
    airbags?: string
    groundClearance?: string
    bootSpace?: string
    [key: string]: any
}

interface Model {
    id: string
    name: string
    brandName: string
}

interface ComparisonItem {
    model: Model
    variant: Variant | null // Updated to reflect reality
}

/**
 * Helper to parse numbers from strings like "18.5 kmpl" or "1197 cc"
 */
function parseNumber(val: string | number | undefined): number {
    if (typeof val === 'number') return val
    if (!val) return 0
    const match = val.match(/([\d.]+)/)
    return match ? parseFloat(match[1]) : 0
}

export function getCheaperCar(item1: ComparisonItem, item2: ComparisonItem): ComparisonItem | null {
    if (!item1?.variant?.price || !item2?.variant?.price) return null
    return item1.variant.price < item2.variant.price ? item1 : item2
}

export function getBetterMileage(item1: ComparisonItem, item2: ComparisonItem): ComparisonItem | null {
    if (!item1?.variant || !item2?.variant) return null

    const m1 = parseNumber(item1.variant.mileageCompanyClaimed || item1.variant.mileageCity)
    const m2 = parseNumber(item2.variant.mileageCompanyClaimed || item2.variant.mileageCity)
    if (m1 === 0 && m2 === 0) return null
    return m1 > m2 ? item1 : item2
}

export function getPowerWinner(item1: ComparisonItem, item2: ComparisonItem): ComparisonItem | null {
    if (!item1?.variant || !item2?.variant) return null

    const p1 = parseNumber(item1.variant.maxPower)
    const p2 = parseNumber(item2.variant.maxPower)
    if (p1 === 0 && p2 === 0) return null
    return p1 > p2 ? item1 : item2
}

export function getSpaceWinner(item1: ComparisonItem, item2: ComparisonItem): ComparisonItem | null {
    if (!item1?.variant || !item2?.variant) return null

    // Simple heuristic based on wheelbase and boot space
    const wb1 = parseNumber(item1.variant.wheelbase)
    const wb2 = parseNumber(item2.variant.wheelbase)
    const bs1 = parseNumber(item1.variant.bootSpace)
    const bs2 = parseNumber(item2.variant.bootSpace)

    const score1 = wb1 + bs1
    const score2 = wb2 + bs2

    if (score1 === 0 && score2 === 0) return null
    return score1 > score2 ? item1 : item2
}

export function generateVerdict(item1: ComparisonItem, item2: ComparisonItem): string {
    if (!item1?.variant || !item2?.variant) {
        return `Compare ${item1.model.brandName} ${item1.model.name} and ${item2.model.brandName} ${item2.model.name} to see which suits you best.`
    }

    const cheaper = getCheaperCar(item1, item2)
    const mileage = getBetterMileage(item1, item2)
    const power = getPowerWinner(item1, item2)

    const winner = cheaper // Default to value for money often being the deciding factor for mass market

    if (!winner) return `Compare ${item1.model.brandName} ${item1.model.name} and ${item2.model.brandName} ${item2.model.name} to see which suits you best.`

    let verdict = ""

    // Logic for Verdict Construction
    const priceDiff = Math.abs(item1.variant.price - item2.variant.price)
    const priceDiffLakhs = (priceDiff / 100000).toFixed(2)

    if (cheaper.model.id === item1.model.id) {
        verdict += `${item1.model.brandName} ${item1.model.name} is the more affordable option, saving you around ₹${priceDiffLakhs} Lakhs. `
    } else {
        verdict += `${item2.model.brandName} ${item2.model.name} makes a strong case despite being ₹${priceDiffLakhs} Lakhs more expensive. `
    }

    if (mileage && mileage.model.id !== winner.model.id) {
        verdict += `However, if fuel efficiency is your priority, the ${mileage.model.name} delivers better mileage. `
    } else if (mileage) {
        verdict += `It also offers superior fuel efficiency, making it a great daily driver. `
    }

    if (power && power.model.id !== winner.model.id) {
        verdict += `Enthusiasts might prefer the ${power.model.name} for its more powerful engine.`
    }

    return verdict
}

export function generateWhyBuy(item: ComparisonItem, opponent: ComparisonItem): string[] {
    const reasons: string[] = []

    if (!item?.variant || !opponent?.variant) return reasons

    // Price
    if (item.variant.price < opponent.variant.price) {
        const diff = ((opponent.variant.price - item.variant.price) / 100000).toFixed(2)
        reasons.push(`More affordable by ₹${diff} Lakhs`)
    }

    // Mileage
    const m1 = parseNumber(item.variant.mileageCompanyClaimed)
    const m2 = parseNumber(opponent.variant.mileageCompanyClaimed)
    if (m1 > m2) {
        reasons.push(`Better Mileage: ${item.variant.mileageCompanyClaimed} vs ${opponent.variant.mileageCompanyClaimed}`)
    }

    // Power
    const p1 = parseNumber(item.variant.maxPower)
    const p2 = parseNumber(opponent.variant.maxPower)
    if (p1 > p2) {
        reasons.push(`More Powerful Engine: ${item.variant.maxPower}`)
    }

    // Safety
    const s1 = parseNumber(item.variant.airbags)
    const s2 = parseNumber(opponent.variant.airbags)
    if (s1 > s2) {
        reasons.push(`More Airbags: ${s1} vs ${s2}`)
    }

    // Boot Space
    const b1 = parseNumber(item.variant.bootSpace)
    const b2 = parseNumber(opponent.variant.bootSpace)
    if (b1 > b2) {
        reasons.push(`Larger Boot: ${b1} Litres`)
    }

    // Ground Clearance
    const g1 = parseNumber(item.variant.groundClearance)
    const g2 = parseNumber(opponent.variant.groundClearance)
    if (g1 > g2) {
        reasons.push(`Higher Ground Clearance: ${g1} mm`)
    }

    return reasons
}
