'use client'

import { Phone, MessageCircle, Calendar, CheckCircle, Star, Users } from 'lucide-react'

export default function ConsultancyAd() {
  const handleCallClick = () => {
    window.location.href = 'tel:+919876543210'
  }

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919876543210?text=Hi, I need help choosing the right car', '_blank')
  }

  const handleBookConsultationClick = () => {
    // In a real implementation, this would open a booking modal or navigate to booking page
    window.location.href = '/consultation/book'
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Content */}
              <div>
                <div className="flex items-center mb-3">
                  <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold mr-3">
                    FREE
                  </div>
                  <h2 className="text-2xl font-bold">Car Buying Consultation</h2>
                </div>
                
                <p className="text-blue-100 mb-4 text-lg">
                  Confused about which car to buy? Get expert advice from our certified car consultants.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-sm">Personalized Recommendations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-sm">Budget Planning</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-sm">Loan Assistance</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-sm">Best Deal Negotiation</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="flex items-center text-yellow-400 mb-1">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <div className="text-xs text-blue-100">4.9/5 Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center text-white mb-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="font-bold">50,000+</span>
                    </div>
                    <div className="text-xs text-blue-100">Happy Customers</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCallClick}
                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </button>
                  
                  <button
                    onClick={handleWhatsAppClick}
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={handleBookConsultationClick}
                    className="flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Consultation
                  </button>
                </div>
              </div>

              {/* Consultant Image/Illustration */}
              <div className="text-center lg:text-right">
                <div className="inline-block bg-white/10 rounded-lg p-6">
                  <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-16 w-16 text-white/80" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Expert Consultants</h3>
                  <p className="text-blue-100 text-sm">
                    Our certified automotive experts have helped thousands of customers find their perfect car.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 pt-6 border-t border-white/20 text-center">
              <p className="text-blue-100 text-sm mb-2">
                <strong>Limited Time:</strong> Get free consultation worth ₹2,000 absolutely FREE!
              </p>
              <p className="text-xs text-blue-200">
                Available Monday to Saturday, 9 AM to 8 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
