import Link from 'next/link'
import { Calculator, Tag, FileText, MapPin, TrendingUp } from 'lucide-react'

export default function QuickActions() {
  const actions = [
    {
      icon: Calculator,
      title: 'EMI Calculator',
      description: 'Calculate monthly EMI',
      href: '/emi-calculator',
      color: 'bg-blue-500',
    },

    {
      icon: Tag,
      title: 'Best Offers',
      description: 'Latest deals & discounts',
      href: '/offers',
      color: 'bg-red-500',
    },
    {
      icon: FileText,
      title: 'Car Reviews',
      description: 'Expert reviews & ratings',
      href: '/reviews',
      color: 'bg-purple-500',
    },
    {
      icon: MapPin,
      title: 'Find Dealers',
      description: 'Locate nearby dealers',
      href: '/dealers',
      color: 'bg-[#291e6a]',
    },
    {
      icon: TrendingUp,
      title: 'Price Trends',
      description: 'Track price changes',
      href: '/price-trends',
      color: 'bg-indigo-500',
    },
  ]

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Quick Actions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access our most popular tools and features to help you make the right car buying decision
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {actions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <Link
                key={index}
                href={action.href}
                className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 lg:p-6 text-center transition-all duration-200 hover:shadow-md hover:border-primary-200"
              >
                <div className={`${action.color} w-12 h-12 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1 lg:mb-2">
                  {action.title}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  {action.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
