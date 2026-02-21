import React from 'react'
import { Star, ThumbsUp, Fuel, Wrench, Banknote } from 'lucide-react'

interface RatingBreakdown {
    aspect: string
    score: number
    icon: React.ReactNode
}

interface OwnerReviewSummaryProps {
    overallRating: number
    totalReviews: number
    breakdown: RatingBreakdown[]
    recommendationPercentage: number
}

export default function OwnerReviewSummary({ overallRating, totalReviews, breakdown, recommendationPercentage }: OwnerReviewSummaryProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Overall Score */}
                <div className="text-center md:text-left flex-shrink-0">
                    <div className="text-5xl font-extrabold text-gray-900 mb-2">{overallRating.toFixed(1)}</div>
                    <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(overallRating / 2) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <p className="text-gray-500 text-sm">Based on {totalReviews} Owner Reviews</p>
                </div>

                {/* Divider */}
                <div className="w-full h-px md:w-px md:h-24 bg-gray-200"></div>

                {/* Aspects */}
                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    {breakdown.map((item) => (
                        <div key={item.aspect} className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700">{item.aspect}</span>
                                    <span className="text-sm font-bold text-gray-900">{item.score}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="bg-green-500 h-1.5 rounded-full"
                                        style={{ width: `${item.score * 10}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recommendation */}
                <div className="bg-green-50 p-4 rounded-xl text-center min-w-[140px]">
                    <ThumbsUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700">{recommendationPercentage}%</div>
                    <div className="text-xs text-green-800 font-medium leading-tight">Owners Recommend This Car</div>
                </div>
            </div>
        </div>
    )
}
