'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, User, Calendar, Verified } from 'lucide-react'
import Link from 'next/link'

interface CarReviewsProps {
  carData: {
    fullName: string
    brand: string
    model: string
    rating: number
    reviewCount: number
  }
}

export default function CarReviews({ carData }: CarReviewsProps) {
  const [selectedRating, setSelectedRating] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const reviews = [
    {
      id: 1,
      userName: 'Rajesh Kumar',
      rating: 5,
      date: '2024-01-15',
      verified: true,
      title: 'Excellent car with great mileage',
      review: 'I have been using this car for 6 months now. The mileage is excellent in city conditions. Build quality is good and maintenance cost is reasonable.',
      likes: 24,
      dislikes: 2,
      helpful: true
    },
    {
      id: 2,
      userName: 'Priya Sharma',
      rating: 4,
      date: '2024-01-10',
      verified: true,
      title: 'Good family car',
      review: 'Perfect for family use. Spacious interior and comfortable seats. Only issue is the road noise at high speeds.',
      likes: 18,
      dislikes: 1,
      helpful: false
    },
    {
      id: 3,
      userName: 'Amit Patel',
      rating: 5,
      date: '2024-01-08',
      verified: false,
      title: 'Value for money',
      review: 'Great value for money. Features are good for this price range. Recommend for first-time buyers.',
      likes: 15,
      dislikes: 3,
      helpful: true
    }
  ]

  const ratingDistribution = [
    { stars: 5, count: 856, percentage: 65 },
    { stars: 4, count: 324, percentage: 25 },
    { stars: 3, count: 89, percentage: 7 },
    { stars: 2, count: 26, percentage: 2 },
    { stars: 1, count: 13, percentage: 1 }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          {carData.fullName} User Reviews
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.floor(carData.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{carData.rating}</span>
            <span className="text-gray-600">({carData.reviewCount.toLocaleString()} reviews)</span>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <h3 className="font-semibold mb-4">Rating Breakdown</h3>
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 text-sm">
                <span className="w-8">{item.stars}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-12 text-gray-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <label className="text-sm font-medium">Filter by rating:</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="flex gap-2">
              <label className="text-sm font-medium">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <Verified className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-4">{review.review}</p>

                <div className="flex items-center gap-4 text-sm">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-green-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-red-600">
                    <ThumbsDown className="h-4 w-4" />
                    <span>{review.dislikes}</span>
                  </button>
                  <span className="text-gray-500">Helpful</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
              Load More Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Write Review CTA */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Own a {carData.fullName}? Share your experience!</h3>
        <p className="text-gray-600 mb-4">Help other buyers make informed decisions by sharing your honest review</p>
        <Link
          href={`/${carData.brand}-cars/${carData.model}/rate-review`}
          className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
        >
          Write a Review
        </Link>
      </div>
    </div>
  )
}
