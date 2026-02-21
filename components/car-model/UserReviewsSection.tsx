'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, User, ChevronDown, ChevronUp, MessageCircle, Send, ImageIcon } from 'lucide-react'

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
  userAvatar: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  notHelpful: number
  verified: boolean
  images?: string[]
  comments?: ReviewComment[]
  userVote?: 'like' | 'dislike' | null
}

interface UserReviewsSectionProps {
  carName: string
  modelSlug?: string
  overallRating: number
  totalReviews: number
  ratingBreakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  reviews: Review[]
}

export default function UserReviewsSection({
  carName,
  modelSlug,
  overallRating,
  totalReviews,
  ratingBreakdown,
  reviews: initialReviews
}: UserReviewsSectionProps) {
  const [filterRating, setFilterRating] = useState('All Ratings')
  const [sortBy, setSortBy] = useState('Most Recent')
  const [reviews, setReviews] = useState(initialReviews)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    )
  }

  const getRatingPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0
  }

  const handleVote = async (reviewId: string, type: 'like' | 'dislike') => {
    // Optimistic update
    setReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review

      const wasLiked = review.userVote === 'like'
      const wasDisliked = review.userVote === 'dislike'

      let newHelpful = review.helpful
      let newNotHelpful = review.notHelpful
      let newUserVote: 'like' | 'dislike' | null = type

      if (type === 'like') {
        if (wasLiked) {
          newHelpful -= 1
          newUserVote = null
        } else {
          newHelpful += 1
          if (wasDisliked) newNotHelpful -= 1
        }
      } else {
        if (wasDisliked) {
          newNotHelpful -= 1
          newUserVote = null
        } else {
          newNotHelpful += 1
          if (wasLiked) newHelpful -= 1
        }
      }

      return {
        ...review,
        helpful: newHelpful,
        notHelpful: newNotHelpful,
        userVote: newUserVote
      }
    }))

    // API call (background)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      await fetch(`${API_URL}/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          userEmail: 'anonymous@user.com' // In production, get from auth context
        })
      })
    } catch (error) {
      console.error('Vote failed:', error)
    }
  }

  const toggleComments = (reviewId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return

    // Add comment optimistically
    setReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review
      const newComment: ReviewComment = {
        id: `temp-${Date.now()}`,
        userName: 'You',
        text: replyText,
        createdAt: new Date().toLocaleDateString()
      }
      return {
        ...review,
        comments: [...(review.comments || []), newComment]
      }
    }))

    setReplyText('')
    setReplyingTo(null)

    // API call
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      await fetch(`${API_URL}/api/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: 'Anonymous',
          userEmail: 'anonymous@user.com',
          text: replyText
        })
      })
    } catch (error) {
      console.error('Comment failed:', error)
    }
  }

  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          {carName} User Reviews
        </h2>

        {/* Rating Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            {renderStars(Math.floor(overallRating), 'md')}
            <span className="ml-2 text-lg font-bold text-gray-900">{overallRating}</span>
            <span className="ml-2 text-sm text-gray-600">({totalReviews.toLocaleString()} reviews)</span>
          </div>

          {/* Rating Breakdown */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Rating Breakdown</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center text-sm">
                  <span className="w-4 text-gray-700">{rating}★</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-400 h-2 rounded-full"
                      style={{ width: `${getRatingPercentage(ratingBreakdown[rating as keyof typeof ratingBreakdown])}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-gray-600 text-right">
                    {ratingBreakdown[rating as keyof typeof ratingBreakdown]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by rating:</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Ratings</option>
                <option>5 Stars</option>
                <option>4 Stars</option>
                <option>3 Stars</option>
                <option>2 Stars</option>
                <option>1 Star</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Most Recent</option>
                <option>Highest Rating</option>
                <option>Lowest Rating</option>
                <option>Most Helpful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 text-sm mr-2">{review.userName}</span>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">✓</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {/* Review Content */}
              <h4 className="font-medium text-gray-900 text-sm mb-2">{review.title}</h4>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.content}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {review.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-orange-400 transition-colors"
                    >
                      <img src={img} alt={`Review image ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(review.id, 'like')}
                    className={`flex items-center text-xs transition-colors ${review.userVote === 'like'
                        ? 'text-green-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <ThumbsUp className={`w-4 h-4 mr-1 ${review.userVote === 'like' ? 'fill-current' : ''}`} />
                    {review.helpful}
                  </button>
                  <button
                    onClick={() => handleVote(review.id, 'dislike')}
                    className={`flex items-center text-xs transition-colors ${review.userVote === 'dislike'
                        ? 'text-red-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <ThumbsDown className={`w-4 h-4 mr-1 ${review.userVote === 'dislike' ? 'fill-current' : ''}`} />
                    {review.notHelpful}
                  </button>
                  <button
                    onClick={() => toggleComments(review.id)}
                    className="flex items-center text-xs text-gray-500 hover:text-gray-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {review.comments?.length || 0} Comments
                    {expandedComments.has(review.id) ? (
                      <ChevronUp className="w-3 h-3 ml-1" />
                    ) : (
                      <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {expandedComments.has(review.id) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Existing Comments */}
                  {review.comments && review.comments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {review.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-xs text-gray-900">{comment.userName}</span>
                            <span className="text-xs text-gray-400 ml-2">{comment.createdAt}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyingTo === review.id ? replyText : ''}
                      onChange={(e) => {
                        setReplyingTo(review.id)
                        setReplyText(e.target.value)
                      }}
                      onFocus={() => setReplyingTo(review.id)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={!replyText.trim()}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Read More Button */}
        <div className="text-center mt-6">
          <button className="text-red-500 hover:text-red-600 font-medium text-sm">
            Read More
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Review image"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </section>
  )
}
