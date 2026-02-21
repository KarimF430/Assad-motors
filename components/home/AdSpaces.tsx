'use client'

import { ExternalLink, Zap, Gift, Percent, Car } from 'lucide-react'

interface AdSpace {
  id: number
  title: string
  description: string
  buttonText: string
  buttonLink: string
  backgroundColor: string
  textColor: string
  icon: React.ReactNode
  size: 'small' | 'medium'
}

export default function AdSpaces() {
  const adSpaces: AdSpace[] = [
    {
      id: 1,
      title: 'Car Insurance',
      description: 'Get instant quotes from top insurers. Save up to 85% on premiums.',
      buttonText: 'Get Quote',
      buttonLink: '/insurance',
      backgroundColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
      textColor: 'text-white',
      icon: <Car className="h-6 w-6" />,
      size: 'medium'
    },
    {
      id: 2,
      title: 'Car Loans',
      description: 'Lowest interest rates starting from 7.5% per annum.',
      buttonText: 'Apply Now',
      buttonLink: '/loans',
      backgroundColor: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      textColor: 'text-white',
      icon: <Percent className="h-6 w-6" />,
      size: 'small'
    },
    {
      id: 3,
      title: 'Extended Warranty',
      description: 'Protect your car with comprehensive extended warranty plans.',
      buttonText: 'Learn More',
      buttonLink: '/warranty',
      backgroundColor: 'bg-gradient-to-r from-purple-500 to-pink-600',
      textColor: 'text-white',
      icon: <Zap className="h-6 w-6" />,
      size: 'small'
    },
    {
      id: 4,
      title: 'Accessories',
      description: 'Premium car accessories and customization options available.',
      buttonText: 'Shop Now',
      buttonLink: '/accessories',
      backgroundColor: 'bg-gradient-to-r from-orange-500 to-red-600',
      textColor: 'text-white',
      icon: <Gift className="h-6 w-6" />,
      size: 'medium'
    }
  ]

  const handleAdClick = (link: string) => {
    // In a real implementation, this would track ad clicks and navigate
    window.open(link, '_blank')
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adSpaces.map((ad) => (
            <div
              key={ad.id}
              className={`${ad.backgroundColor} ${ad.textColor} rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform duration-200 ${
                ad.size === 'medium' ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
              onClick={() => handleAdClick(ad.buttonLink)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-lg p-2 mr-3">
                    {ad.icon}
                  </div>
                  <h3 className="font-bold text-lg">{ad.title}</h3>
                </div>
                <ExternalLink className="h-4 w-4 opacity-70" />
              </div>
              
              <p className="text-sm opacity-90 mb-4 line-clamp-2">
                {ad.description}
              </p>
              
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
                {ad.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Banner Ad Space */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Partner with gadizone</h3>
            <p className="text-gray-300 mb-4">
              Advertise your automotive business to millions of car buyers across India
            </p>
            <button 
              onClick={() => handleAdClick('/advertise')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Advertise With Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
