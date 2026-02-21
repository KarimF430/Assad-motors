import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-11 h-11 flex-shrink-0 bg-white rounded-full p-1">
                <Image
                  src="/am-logo.png"
                  alt="Assad Motors Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-gray-200 transition-all">Assad Motors</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for buying and selling cars. Explore top brands, compare prices, and find the best deals with Assad Motors.
            </p>

          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/car-expert" className="text-gray-300 hover:text-[#291e6a] transition-colors font-medium">
                  Car Buying Expert
                </Link>
              </li>
              <li>
                <Link href="/top-selling-cars-in-india" className="text-gray-300 hover:text-red-400 transition-colors">
                  New Cars
                </Link>
              </li>

              <li>
                <Link href="/electric-cars" className="text-gray-300 hover:text-red-400 transition-colors">
                  Electric Cars
                </Link>
              </li>
              <li>
                <Link href="/emi-calculator" className="text-gray-300 hover:text-[#291e6a] transition-colors">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-[#291e6a] transition-colors">
                  Car News
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Popular Brands</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/maruti-suzuki-cars" className="text-gray-300 hover:text-red-400 transition-colors">
                  Maruti Suzuki
                </Link>
              </li>
              <li>
                <Link href="/hyundai-cars" className="text-gray-300 hover:text-[#291e6a] transition-colors">
                  Hyundai
                </Link>
              </li>
              <li>
                <Link href="/tata-cars" className="text-gray-300 hover:text-red-400 transition-colors">
                  Tata
                </Link>
              </li>
              <li>
                <Link href="/mahindra-cars" className="text-gray-300 hover:text-[#291e6a] transition-colors">
                  Mahindra
                </Link>
              </li>
              <li>
                <Link href="/kia-cars" className="text-gray-300 hover:text-red-400 transition-colors">
                  Kia
                </Link>
              </li>
              <li>
                <Link href="/toyota-cars" className="text-gray-300 hover:text-[#291e6a] transition-colors">
                  Toyota
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-400" />
                <a href="mailto:Karim0beldaar@gmail.com" className="text-gray-300 hover:text-red-400 transition-colors">
                  Karim0beldaar@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#291e6a]" />
                <a href="tel:+919945210466" className="text-gray-300 hover:text-[#291e6a] transition-colors">
                  +91 99452 10466
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-red-400 mt-0.5" />
                <span className="text-gray-300">
                  Mumbai, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Assad Motors. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-red-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/about-us" className="text-gray-400 hover:text-[#291e6a] transition-colors">
                About Us
              </Link>
              <Link href="/contact-us" className="text-gray-400 hover:text-red-400 transition-colors">
                Contact
              </Link>
              <Link href="/feedback" className="text-gray-400 hover:text-[#291e6a] transition-colors">
                Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer >
  )
}
