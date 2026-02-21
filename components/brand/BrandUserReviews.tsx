'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ThumbsUp, ThumbsDown, User, Calendar, Car } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  userLocation: string;
  rating: number;
  reviewDate: string;
  carModel: string;
  reviewTitle: string;
  reviewText: string;
  helpfulVotes: number;
  totalVotes: number;
  verified: boolean;
}

interface BrandUserReviewsProps {
  brandName: string;
}

export default function BrandUserReviews({ brandName }: BrandUserReviewsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'helpful'>('newest');

  // Mock reviews data - brand specific
  const getReviewsForBrand = (brand: string): Review[] => {
    const baseReviews = {
      maruti: [
        {
          id: '1',
          userName: 'Rajesh Kumar',
          userLocation: 'Delhi',
          rating: 5,
          reviewDate: '2024-01-15',
          carModel: 'Swift',
          reviewTitle: 'Excellent fuel efficiency and reliability',
          reviewText: 'I have been driving my Maruti Swift for 2 years now. The fuel efficiency is outstanding - I get around 18-20 kmpl in city conditions. The build quality is solid and maintenance costs are very reasonable. Service network is excellent across India.',
          helpfulVotes: 24,
          totalVotes: 28,
          verified: true
        },
        {
          id: '2',
          userName: 'Priya Sharma',
          userLocation: 'Mumbai',
          rating: 4,
          reviewDate: '2024-01-10',
          carModel: 'Baleno',
          reviewTitle: 'Great features but could be more powerful',
          reviewText: 'The Baleno has amazing features for its price range. The infotainment system is user-friendly and the interior space is good. However, I feel the engine could be more powerful for highway driving. Overall, a good family car.',
          helpfulVotes: 18,
          totalVotes: 22,
          verified: true
        },
        {
          id: '3',
          userName: 'Amit Patel',
          userLocation: 'Ahmedabad',
          rating: 5,
          reviewDate: '2024-01-08',
          carModel: 'Ertiga',
          reviewTitle: 'Perfect family MPV',
          reviewText: 'Bought Ertiga for my family of 6. The 7-seater configuration is very practical. The ride quality is smooth and the car handles well even when fully loaded. Maruti service is always reliable.',
          helpfulVotes: 31,
          totalVotes: 35,
          verified: true
        },
        {
          id: '4',
          userName: 'Sneha Reddy',
          userLocation: 'Bangalore',
          rating: 3,
          reviewDate: '2024-01-05',
          carModel: 'Wagon R',
          reviewTitle: 'Good for city driving but lacks premium feel',
          reviewText: 'The Wagon R is very practical for city driving with good fuel economy. However, the interior feels basic and road noise is noticeable at higher speeds. Good value for money though.',
          helpfulVotes: 12,
          totalVotes: 18,
          verified: false
        }
      ],
      hyundai: [
        {
          id: '1',
          userName: 'Vikram Singh',
          userLocation: 'Pune',
          rating: 5,
          reviewDate: '2024-01-12',
          carModel: 'Creta',
          reviewTitle: 'Premium SUV with excellent features',
          reviewText: 'The Creta is a fantastic SUV with premium features. The build quality feels solid, the ride is comfortable, and the features like wireless charging and panoramic sunroof are impressive. Highly recommended.',
          helpfulVotes: 42,
          totalVotes: 48,
          verified: true
        },
        {
          id: '2',
          userName: 'Kavya Nair',
          userLocation: 'Kochi',
          rating: 4,
          reviewDate: '2024-01-09',
          carModel: 'i20',
          reviewTitle: 'Stylish and feature-rich hatchback',
          reviewText: 'The i20 has a very modern and stylish design. The interior is well-appointed with good quality materials. The driving experience is smooth and the car feels premium. Only concern is the maintenance cost.',
          helpfulVotes: 28,
          totalVotes: 33,
          verified: true
        },
        {
          id: '3',
          userName: 'Rohit Agarwal',
          userLocation: 'Jaipur',
          rating: 5,
          reviewDate: '2024-01-06',
          carModel: 'Venue',
          reviewTitle: 'Best compact SUV in its segment',
          reviewText: 'Venue offers the perfect combination of style, features, and performance. The connected car features are amazing and the build quality is top-notch. Great value for money in the compact SUV segment.',
          helpfulVotes: 36,
          totalVotes: 41,
          verified: true
        }
      ],
      tata: [
        {
          id: '1',
          userName: 'Arjun Mehta',
          userLocation: 'Chennai',
          rating: 5,
          reviewDate: '2024-01-14',
          carModel: 'Nexon',
          reviewTitle: 'Safest car in its segment',
          reviewText: 'The Nexon is an excellent compact SUV with a 5-star safety rating. The build quality is exceptional and the car feels very solid. The turbo engine provides good performance and the features are comprehensive.',
          helpfulVotes: 39,
          totalVotes: 44,
          verified: true
        },
        {
          id: '2',
          userName: 'Deepika Joshi',
          userLocation: 'Indore',
          rating: 4,
          reviewDate: '2024-01-11',
          carModel: 'Harrier',
          reviewTitle: 'Premium SUV with commanding presence',
          reviewText: 'The Harrier has a very imposing road presence and the interior is luxurious. The ride quality is excellent and the car handles well. However, the fuel efficiency could be better for a diesel engine.',
          helpfulVotes: 25,
          totalVotes: 30,
          verified: true
        },
        {
          id: '3',
          userName: 'Manish Kumar',
          userLocation: 'Lucknow',
          rating: 5,
          reviewDate: '2024-01-07',
          carModel: 'Punch',
          reviewTitle: 'Perfect micro SUV for Indian roads',
          reviewText: 'The Punch is an ideal car for Indian road conditions. High ground clearance, good build quality, and excellent safety features. The compact size makes it perfect for city driving while offering SUV-like capabilities.',
          helpfulVotes: 33,
          totalVotes: 37,
          verified: true
        }
      ]
    };

    return baseReviews[brand.toLowerCase() as keyof typeof baseReviews] || [];
  };

  const reviews = getReviewsForBrand(brandName);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

  const filteredReviews = selectedRating
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews;

  // If no reviews found for this brand, show a message
  if (totalReviews === 0) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              {brandName} User Reviews
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              No reviews available for {brandName} yet. Be the first to share your experience!
            </p>
            <Link
              href={`/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/write-review`}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            {brandName} User Reviews
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from {brandName} car owners across India
          </p>
        </div>

        {/* Rating Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-2">
                <span className="text-4xl font-bold text-gray-900 mr-2">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex">
                  {renderStars(Math.round(averageRating))}
                </div>
              </div>
              <p className="text-gray-600">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center">
                  <span className="w-8 text-sm text-gray-600">{rating}★</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="w-8 text-sm text-gray-600">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedRating(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRating === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All Reviews
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRating === rating
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {rating}★
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified Owner
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {review.reviewDate}
                      </span>
                      <span className="flex items-center">
                        <Car className="w-4 h-4 mr-1" />
                        {review.carModel}
                      </span>
                      <span>{review.userLocation}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-2">{review.reviewTitle}</h5>
                <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Helpful ({review.helpfulVotes})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm">Not Helpful</span>
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {review.helpfulVotes} of {review.totalVotes} found this helpful
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Write Review CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              Own a {brandName} car? Share your experience!
            </h3>
            <p className="text-gray-600 mb-6">
              Help other buyers make informed decisions by sharing your honest review
            </p>
            <Link
              href={`/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/write-review`}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
