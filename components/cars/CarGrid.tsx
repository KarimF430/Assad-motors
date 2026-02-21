import Link from 'next/link'
import { Heart, GitCompare, Star, Fuel, Users, Zap } from 'lucide-react'

export default function CarGrid() {
  const cars = [
    {
      id: 1,
      name: 'Maruti Suzuki Swift',
      brand: 'Maruti Suzuki',
      priceRange: '₹5.85 - 8.67 Lakh',
      rating: 4.2,
      reviews: 1247,
      fuelType: 'Petrol',
      mileage: '23.20 kmpl',
      engine: '1197 cc',
      transmission: 'Manual',
      seating: 5,
      bodyType: 'Hatchback',
      href: '/cars/maruti-suzuki-swift',
      image: '/cars/swift.jpg',
      offers: ['₹25,000 Cash Discount', 'Free Insurance'],
      isPopular: true,
    },
    {
      id: 2,
      name: 'Hyundai Creta',
      brand: 'Hyundai',
      priceRange: '₹11.00 - 20.15 Lakh',
      rating: 4.4,
      reviews: 2156,
      fuelType: 'Petrol',
      mileage: '17.40 kmpl',
      engine: '1497 cc',
      transmission: 'Automatic',
      seating: 5,
      bodyType: 'SUV',
      href: '/cars/hyundai-creta',
      image: '/cars/creta.jpg',
      offers: ['₹50,000 Exchange Bonus'],
      isPopular: false,
    },
    {
      id: 3,
      name: 'Tata Nexon',
      brand: 'Tata',
      priceRange: '₹7.60 - 14.08 Lakh',
      rating: 4.1,
      reviews: 892,
      fuelType: 'Petrol',
      mileage: '17.57 kmpl',
      engine: '1199 cc',
      transmission: 'Manual',
      seating: 5,
      bodyType: 'Compact SUV',
      href: '/cars/tata-nexon',
      image: '/cars/nexon.jpg',
      offers: ['₹30,000 Cash Discount', '5 Year Warranty'],
      isPopular: true,
    },
    {
      id: 4,
      name: 'Honda City',
      brand: 'Honda',
      priceRange: '₹11.82 - 16.35 Lakh',
      rating: 4.3,
      reviews: 1543,
      fuelType: 'Petrol',
      mileage: '17.80 kmpl',
      engine: '1498 cc',
      transmission: 'CVT',
      seating: 5,
      bodyType: 'Sedan',
      href: '/cars/honda-city',
      image: '/cars/city.jpg',
      offers: ['₹40,000 Cash Discount'],
      isPopular: false,
    },
    {
      id: 5,
      name: 'Mahindra XUV700',
      brand: 'Mahindra',
      priceRange: '₹13.45 - 25.15 Lakh',
      rating: 4.5,
      reviews: 967,
      fuelType: 'Petrol',
      mileage: '13.00 kmpl',
      engine: '1997 cc',
      transmission: 'Automatic',
      seating: 7,
      bodyType: 'SUV',
      href: '/cars/mahindra-xuv700',
      image: '/cars/xuv700.jpg',
      offers: ['₹75,000 Exchange Bonus', 'Free Accessories'],
      isPopular: true,
    },
    {
      id: 6,
      name: 'Kia Seltos',
      brand: 'Kia',
      priceRange: '₹10.90 - 20.35 Lakh',
      rating: 4.2,
      reviews: 1876,
      fuelType: 'Petrol',
      mileage: '16.80 kmpl',
      engine: '1497 cc',
      transmission: 'Manual',
      seating: 5,
      bodyType: 'SUV',
      href: '/cars/kia-seltos',
      image: '/cars/seltos.jpg',
      offers: ['₹60,000 Cash Discount'],
      isPopular: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div
          key={car.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Car Image */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            {car.isPopular && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Popular
              </div>
            )}
            <div className="absolute top-3 right-3 flex space-x-2">
              <button className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
                <GitCompare className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            {/* Placeholder for car image */}
            <div className="flex items-center justify-center h-full">
              <div className="w-24 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">
                  {car.brand.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Car Name and Rating */}
            <div className="mb-3">
              <Link href={car.href} className="block">
                <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 mb-1">
                  {car.name}
                </h3>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{car.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({car.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-3">
              <p className="text-lg font-bold text-primary-600">{car.priceRange}</p>
              <p className="text-xs text-gray-500">Ex-showroom price</p>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="flex items-center space-x-1">
                <Fuel className="h-3 w-3 text-gray-500" />
                <span className="text-gray-700">{car.mileage}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-gray-500" />
                <span className="text-gray-700">{car.engine}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-gray-500" />
                <span className="text-gray-700">{car.seating} Seater</span>
              </div>
              <div className="text-gray-700">{car.transmission}</div>
            </div>

            {/* Offers */}
            {car.offers.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {car.offers.slice(0, 2).map((offer, index) => (
                    <span
                      key={index}
                      className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full"
                    >
                      {offer}
                    </span>
                  ))}
                  {car.offers.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{car.offers.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Link
                href={car.href}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg text-center transition-colors duration-200"
              >
                View Details
              </Link>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
