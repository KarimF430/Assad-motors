'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ReviewComment {
    id: string
    userName: string
    text: string
    createdAt: string
    replies?: ReviewComment[]
}

interface Review {
    id: string
    userName: string
    overallRating: number
    createdAt: string
    reviewTitle: string
    reviewText: string
    likes: number
    dislikes: number
    isVerified: boolean
    images?: string[]
    comments?: ReviewComment[]
    userVote?: 'like' | 'dislike' | null
}

interface ModelOwnerReviewsProps {
    brandName: string
    modelName: string
    modelSlug: string
    brandSlug?: string
}

export default function ModelOwnerReviews({
    brandName,
    modelName,
    modelSlug,
    brandSlug
}: ModelOwnerReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [overallRating, setOverallRating] = useState(0)
    const [totalReviews, setTotalReviews] = useState(0)
    const [ratingBreakdown, setRatingBreakdown] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
    const [filterRating, setFilterRating] = useState('All Ratings')
    const [sortBy, setSortBy] = useState('Most Recent')

    // Fetch reviews from API
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true)
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

                // Build query params
                const params = new URLSearchParams()
                if (filterRating !== 'All Ratings') {
                    const ratingNum = parseInt(filterRating.split(' ')[0])
                    params.set('rating', ratingNum.toString())
                }
                if (sortBy === 'Most Helpful') params.set('sort', 'helpful')
                else if (sortBy === 'Highest Rating') params.set('sort', 'highest')
                else if (sortBy === 'Lowest Rating') params.set('sort', 'lowest')
                else params.set('sort', 'recent')

                const response = await fetch(`${API_URL}/api/reviews/${modelSlug}?${params.toString()}`)
                const data = await response.json()

                if (data.success) {
                    setReviews(data.data.reviews || [])
                    setTotalReviews(data.data.total || 0)
                    setOverallRating(data.data.overallRating || 0)
                    setRatingBreakdown(data.data.ratingBreakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
                } else {
                    setError('Failed to load reviews')
                }
            } catch (err) {
                console.error('Error fetching reviews:', err)
                setError('Failed to load reviews')
            } finally {
                setLoading(false)
            }
        }

        if (modelSlug) {
            fetchReviews()
        }
    }, [modelSlug, filterRating, sortBy])

    const handleVote = async (reviewId: string, type: 'like' | 'dislike') => {
        // Optimistic update
        setReviews(prev => prev.map(review => {
            if (review.id !== reviewId) return review

            const wasLiked = review.userVote === 'like'
            const wasDisliked = review.userVote === 'dislike'

            let newLikes = review.likes
            let newDislikes = review.dislikes
            let newUserVote: 'like' | 'dislike' | null = type

            if (type === 'like') {
                if (wasLiked) {
                    newLikes -= 1
                    newUserVote = null
                } else {
                    newLikes += 1
                    if (wasDisliked) newDislikes -= 1
                }
            } else {
                if (wasDisliked) {
                    newDislikes -= 1
                    newUserVote = null
                } else {
                    newDislikes += 1
                    if (wasLiked) newLikes -= 1
                }
            }

            return { ...review, likes: newLikes, dislikes: newDislikes, userVote: newUserVote }
        }))

        // API call
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            await fetch(`${API_URL}/api/reviews/${reviewId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, userEmail: 'anonymous@user.com' })
            })
        } catch (error) {
            console.error('Vote failed:', error)
        }
    }

    const getRatingPercentage = (count: number) => {
        return totalReviews > 0 ? (count / totalReviews) * 100 : 0
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    // Generate write review URL
    const reviewUrl = `/${brandSlug || brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${modelSlug}/rate-review`

    return (
        <section className="py-6 sm:py-8 bg-gray-50">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                    {brandName} {modelName} Owner Reviews
                </h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading reviews...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{error}</p>
                    </div>
                ) : reviews.length === 0 ? (
                    // No reviews yet - show CTA only
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                            Own a {brandName.toLowerCase()} {modelName.toLowerCase()}? Share your experience!
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                            Be the first to review this car and help other buyers make informed decisions
                        </p>
                        <Link
                            href={reviewUrl}
                            className="inline-block bg-[#291e6a] hover:bg-[#1c144a] text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-all duration-200 shadow-md text-sm sm:text-base"
                        >
                            Write a Review
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Overall Rating - EXACT MATCH */}
                        <div className="flex items-center mb-4 sm:mb-6">
                            <div className="flex items-center flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="ml-1 sm:ml-2 text-xl sm:text-2xl font-bold text-gray-900">{overallRating.toFixed(1)}</span>
                                <span className="text-sm sm:text-base text-gray-600">({totalReviews.toLocaleString()} reviews)</span>
                            </div>
                        </div>

                        {/* Rating Breakdown - EXACT MATCH */}
                        <div className="mb-4 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Rating Breakdown</h3>
                            <div className="space-y-1.5 sm:space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center">
                                        <span className="text-xs sm:text-sm font-medium text-gray-700 w-5 sm:w-6">{rating}★</span>
                                        <div className="flex-1 mx-2 sm:mx-3 bg-gray-200 rounded-full h-1.5 sm:h-2">
                                            <div
                                                className="bg-orange-500 h-1.5 sm:h-2 rounded-full"
                                                style={{ width: `${getRatingPercentage(ratingBreakdown[rating as keyof typeof ratingBreakdown])}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 w-7 sm:w-8 text-right">
                                            {ratingBreakdown[rating as keyof typeof ratingBreakdown]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Filters - EXACT MATCH */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Filter by rating:</label>
                                <select
                                    value={filterRating}
                                    onChange={(e) => setFilterRating(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white text-sm"
                                >
                                    <option>All Ratings</option>
                                    <option>5 Stars</option>
                                    <option>4 Stars</option>
                                    <option>3 Stars</option>
                                    <option>2 Stars</option>
                                    <option>1 Star</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white text-sm"
                                >
                                    <option>Most Recent</option>
                                    <option>Most Helpful</option>
                                    <option>Highest Rating</option>
                                    <option>Lowest Rating</option>
                                </select>
                            </div>
                        </div>

                        {/* Individual Reviews - EXACT MATCH to hardcoded style */}
                        <div className="space-y-4 sm:space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-200 pb-4 sm:pb-6">
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center mr-2 sm:mr-4 flex-shrink-0">
                                            <span className="text-orange-600 font-semibold text-xs sm:text-sm">
                                                {review.userName?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
                                                        {review.userName}
                                                        {review.isVerified && (
                                                            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 ml-1 sm:ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className={`h-3 w-3 sm:h-4 sm:w-4 ${star <= review.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">{review.reviewTitle}</h5>
                                            <p className="text-gray-700 mb-2 sm:mb-3 text-sm">{review.reviewText}</p>

                                            {/* Review Images */}
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                                    {review.images.map((img, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={img}
                                                            alt={`Review image ${idx + 1}`}
                                                            className="flex-shrink-0 w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                                                <button
                                                    onClick={() => handleVote(review.id, 'like')}
                                                    className="flex items-center hover:text-gray-700 min-h-[44px] py-2 sm:py-0"
                                                >
                                                    <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                    </svg>
                                                    {review.likes}
                                                </button>
                                                <button
                                                    onClick={() => handleVote(review.id, 'dislike')}
                                                    className="flex items-center hover:text-gray-700 min-h-[44px] py-2 sm:py-0"
                                                >
                                                    <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                                    </svg>
                                                    {review.dislikes}
                                                </button>
                                                <span className="hidden sm:inline">Helpful</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Read More Button - EXACT MATCH */}
                        {totalReviews > reviews.length && (
                            <div className="text-center mt-4 sm:mt-6">
                                <button className="text-red-600 hover:text-orange-600 font-medium transition-colors min-h-[44px] py-2 text-sm sm:text-base">
                                    Read More
                                </button>
                            </div>
                        )}

                        {/* Write Review CTA - EXACT MATCH */}
                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mt-4 sm:mt-6 text-center">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                Own a {brandName.toLowerCase()} {modelName.toLowerCase()}? Share your experience!
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                Help other buyers make informed decisions by sharing your honest review
                            </p>
                            <Link
                                href={reviewUrl}
                                className="inline-block bg-[#291e6a] hover:bg-[#1c144a] text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-all duration-200 shadow-md text-sm sm:text-base"
                            >
                                Write a Review
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
