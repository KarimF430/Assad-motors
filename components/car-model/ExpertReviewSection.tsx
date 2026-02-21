
import React, { useMemo, useState } from 'react'
import { Star, User } from 'lucide-react'
import { generateExpertReview } from '@/lib/expert-review-logic'

// ---- helpers copied from ModelSummarySEO (no extra import needed) ----
function detectBodyType(model: any): string {
    const raw = (model?.bodyType || model?.subBodyType || model?.segment || '').toLowerCase()
    if (raw.includes('suv') || raw.includes('crossover')) return 'SUV'
    if (raw.includes('sedan')) return 'Sedan'
    if (raw.includes('muv') || raw.includes('mpv') || raw.includes('minivan')) return 'MUV'
    if (raw.includes('hatchback') || raw.includes('hatch')) return 'Hatchback'
    const name = (model?.name || '').toLowerCase()
    if (['fortuner', 'thar', 'scorpio', 'xuv', 'creta', 'seltos', 'nexon', 'brezza', 'ecosport', 'venue', 'sonet', 'punch', 'harrier', 'safari', 'hector', 'compass', 'duster', 'kwid', 'magnite'].some(s => name.includes(s))) return 'SUV'
    if (['city', 'ciaz', 'verna', 'dzire', 'amaze', 'aspire', 'tigor'].some(s => name.includes(s))) return 'Sedan'
    if (['innova', 'ertiga', 'marazzo', 'carnival', 'carens', 'bolero'].some(s => name.includes(s))) return 'MUV'
    return 'Hatchback'
}

function isEV(model: any): boolean {
    if (model?.isEV) return true
    const fuels = (model?.fuelTypes || []).map((f: string) => f.toLowerCase())
    if (fuels.some((f: string) => f.includes('electric') || f === 'ev')) return true
    const name = (model?.name || '').toLowerCase()
    return name.includes(' ev') || name.endsWith('ev') || name.includes('electric')
}

function getBestMileage(model: any): string {
    if (model?.mileageData?.[0]?.companyClaimed) return model.mileageData[0].companyClaimed
    if (model?.mileage) {
        if (Array.isArray(model.mileage) && model.mileage.length > 0) return `${model.mileage[0].value} ${model.mileage[0].unit || 'kmpl'}`
        if (typeof model.mileage === 'string' || typeof model.mileage === 'number') return `${model.mileage} kmpl`
    }
    return ''
}

function getShortSummary(model: any, bodyType: string, ev: boolean): string {
    const fullName = `${model?.brand || ''} ${model?.name || ''}`.trim()
    const seating = model?.seatingCapacity || (bodyType === 'MUV' ? 7 : 5)
    if (bodyType === 'SUV') {
        return `The ${fullName} is a ${seating}-seater SUV that strikes a balance between road presence, practicality, and value. Whether you're navigating city traffic or heading out on a weekend highway run, it's built to handle both without complaint.`
    }
    if (bodyType === 'Sedan') {
        return `The ${fullName} is a proper three-box sedan that offers a step up in refinement, boot space, and highway comfort over most hatchbacks in a similar price range. It's the kind of car that feels right for both office commutes and long weekend drives.`
    }
    if (bodyType === 'MUV') {
        return `The ${fullName} is a ${seating}-seater MUV built for families who need genuine space for everyone — including the third row. It's a practical, no-nonsense people carrier that handles Indian roads and large families with equal ease.`
    }
    // Hatchback
    return `The ${fullName} is one of ${model?.brand || ''}'s most practical city cars — compact enough to squeeze through tight lanes, yet roomy enough for a family of four. It's the kind of car that makes daily commuting genuinely stress-free, especially in Indian traffic conditions.`
}
// -----------------------------------------------------------------------

interface ExpertReviewSectionProps {
    model: any
}

export default function ExpertReviewSection({ model }: ExpertReviewSectionProps) {
    const review = useMemo(() => generateExpertReview(model, model.variants), [model])
    const [isExpanded, setIsExpanded] = useState(false)

    // Overview data
    const bodyType = detectBodyType(model)
    const ev = isEV(model)
    const mileage = getBestMileage(model)
    const seating = model?.seatingCapacity || (bodyType === 'MUV' ? 7 : 5)
    const variantCount = model?.variants?.length || 0
    const shortSummary = getShortSummary(model, bodyType, ev)

    // Helper to render text with bold formatting safely
    const renderFormattedText = (text: string) => {
        if (!text) return null
        const parts = text.split(/(\*\*[\s\S]*?\*\*)/g)
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const content = part.slice(2, -2)
                return <span key={index} className="font-bold text-gray-900">{content}</span>
            }
            return <span key={index}>{part}</span>
        })
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {model?.brand} {model?.name} Expert Review
            </h2>

            {/* ── Overview summary injected from ModelSummarySEO ── */}
            <div className="space-y-3">
                {/* Short summary paragraph */}
                <p className="text-gray-700 leading-relaxed">
                    {shortSummary}
                </p>

                {/* Inline stat chips — matches site's existing key-spec style */}
                <div className="flex flex-wrap gap-2 pt-1">
                    {mileage && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                            <span className="font-semibold text-gray-900">{mileage}</span>
                            <span className="text-gray-400">·</span>
                            <span>{ev ? 'Range' : 'Mileage'}</span>
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                        <span className="font-semibold text-gray-900">{bodyType}{ev ? ' EV' : ''}</span>
                        <span className="text-gray-400">·</span>
                        <span>Body Type</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                        <span className="font-semibold text-gray-900">{seating} Seater</span>
                    </span>
                    {variantCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                            <span className="font-semibold text-gray-900">{variantCount} Variants</span>
                        </span>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ── Expert Review (UI unchanged) ── */}
            <div className="">

                {/* Header Row: Verdict Badge (Left) + Rating Pill (Right) */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-gradient-to-r from-[#291e6a] to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            GADIZONE VERDICT
                        </span>
                        <span className="text-sm text-gray-400 font-medium hidden sm:inline-block">
                            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    {/* Small Rating Pill on Right */}
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">
                        <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                        <span className="text-sm font-bold text-green-700 leading-none pt-0.5">
                            {review.rating} <span className="text-green-600 font-normal text-xs">/ 10</span>
                        </span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                        {review.verdictTitle}
                    </h3>

                    <div className="text-gray-600 text-base leading-relaxed">
                        <p className={`${!isExpanded ? 'line-clamp-4' : ''} whitespace-pre-line`}>
                            {renderFormattedText(review.verdictSummary)}
                        </p>
                    </div>

                    {/* Read More Link */}
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-red-500 hover:text-red-600 font-normal text-base transition-colors flex items-center gap-1"
                        >
                            {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    </div>
                </div>

                {/* Author Footer */}
                <div className="flex items-center gap-3 pt-6 mt-4 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                        <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900">{review.author.name}</span>
                        <span className="text-[10px] text-gray-500">{review.author.role}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
// v6 with overview summary integrated
