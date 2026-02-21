import Link from 'next/link'
import { Tag, Clock, MapPin, ArrowRight } from 'lucide-react'

export default function FeaturedOffers() {
  const offers = [
    {
      title: 'Festival Bonanza',
      description: 'Get up to ₹2 Lakh off + Exchange Bonus',
      brand: 'Maruti Suzuki',
      validTill: '31st March 2024',
      location: 'Pan India',
      discount: '₹2,00,000',
      type: 'Cash Discount',
      href: '/offers/maruti-festival-bonanza',
      color: 'bg-red-500',
    },
    {
      title: 'Year End Sale',
      description: 'Zero down payment + Free insurance',
      brand: 'Hyundai',
      validTill: '15th April 2024',
      location: 'Delhi NCR',
      discount: '₹1,50,000',
      type: 'Finance Offer',
      href: '/offers/hyundai-year-end',
      color: 'bg-blue-500',
    },
    {
      title: 'Summer Special',
      description: 'Extended warranty + Accessories worth ₹50K',
      brand: 'Tata',
      validTill: '30th April 2024',
      location: 'Mumbai',
      discount: '₹75,000',
      type: 'Value Added',
      href: '/offers/tata-summer-special',
      color: 'bg-green-500',
    },
    {
      title: 'Corporate Discount',
      description: 'Special rates for corporate employees',
      brand: 'Honda',
      validTill: '31st May 2024',
      location: 'Bangalore',
      discount: '₹1,25,000',
      type: 'Corporate',
      href: '/offers/honda-corporate',
      color: 'bg-purple-500',
    },
  ]

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Featured Offers & Deals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on the best deals and offers available on new cars. Save big on your dream car!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className={`${offer.color} p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {offer.type}
                  </span>
                  <Tag className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-1">{offer.title}</h3>
                <p className="text-sm opacity-90">{offer.description}</p>
              </div>

              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Brand</p>
                    <p className="font-semibold text-gray-900">{offer.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Save up to</p>
                    <p className="font-bold text-primary-600 text-lg">{offer.discount}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Valid till {offer.validTill}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{offer.location}</span>
                  </div>
                </div>

                <Link
                  href={offer.href}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>View Offer Details</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 lg:mt-12">
          <Link
            href="/offers"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            View All Offers
          </Link>
        </div>
      </div>
    </section>
  )
}
