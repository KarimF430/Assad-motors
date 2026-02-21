'use client'

import { Star, Phone, MessageCircle, Calendar } from 'lucide-react'

export default function ConsultancyAdSection() {
  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Consultancy Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-full"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold mr-3">
                FREE
              </div>
              <h2 className="text-xl font-bold">Car Buying Consultation</h2>
            </div>

            {/* Description */}
            <p className="text-blue-100 mb-4 text-sm">
              Confused about which car to buy? Get expert advice from our certified car consultants
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Personalized Recommendations</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Budget Planning</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Loan Assistance</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Best Deal Negotiation</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="ml-2 text-sm">50,000+</span>
              <span className="ml-1 text-sm text-blue-100">Happy Customers</span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg text-sm transition-colors flex items-center justify-center">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </button>
              <button className="w-full bg-green-400 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-lg text-sm transition-colors flex items-center justify-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </button>
              <button className="w-full bg-white text-blue-600 font-medium py-3 px-4 rounded-lg text-sm transition-colors hover:bg-gray-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2" />
                Book Consultation
              </button>
            </div>
          </div>

          {/* Expert Consultants Section */}
          <div className="mt-6 pt-6 border-t border-white border-opacity-20">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">👥</span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Expert Consultants</h3>
              <p className="text-blue-100 text-sm mb-3">
                Our certified automotive experts have helped thousands of customers find their perfect car
              </p>
              <p className="text-xs text-blue-200">
                <strong>Limited Time:</strong> Get free consultation worth ₹2,000 absolutely FREE!
              </p>
              <p className="text-xs text-blue-200 mt-1">
                Average Savings: ₹50,000 | 5 Min & FREE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
