import React from 'react'
import { Star, MapPin, Calendar, CheckCircle2, XCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OwnerReview {
    id: string
    authorName: string
    city: string
    ownershipDuration: string
    variant: string
    kilometersDriven: string
    image?: string
    rating: number
    title: string
    review: string
    pros: string[]
    cons: string[]
    mileage: {
        city: string
        highway: string
    }
}

interface OwnerReviewCardProps {
    review: OwnerReview
    className?: string
}

export default function OwnerReviewCard({ review, className }: OwnerReviewCardProps) {
    return (
        <div className={cn("bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden", className)}>
            <div className="p-6">
                {/* Header: Author & Rating */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {review.image ? (
                                <img src={review.image} alt={review.authorName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-6 h-6 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">{review.authorName}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {review.city} • {review.variant}
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 px-2 py-1 rounded-lg border border-green-100 flex items-center gap-1">
                        <span className="font-bold text-green-700">{review.rating}</span>
                        <Star className="w-3 h-3 fill-current text-green-700" />
                    </div>
                </div>

                {/* Review Title & Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{review.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                    "{review.review}"
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500 block">Mileage (City)</span>
                        <span className="font-semibold">{review.mileage.city}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500 block">Driven</span>
                        <span className="font-semibold">{review.kilometersDriven}</span>
                    </div>
                </div>

                {/* Pros & Cons */}
                <div className="space-y-2">
                    {review.pros.slice(0, 1).map((pro, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{pro}</span>
                        </div>
                    ))}
                    {review.cons.slice(0, 1).map((con, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{con}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                <span>Owned for {review.ownershipDuration}</span>
                <button className="text-red-600 font-semibold hover:underline">Read Full Review</button>
            </div>
        </div>
    )
}
