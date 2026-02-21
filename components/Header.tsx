'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, MapPin, Phone, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

// Dropdown Links configuration
const BUDGET_RANGES = [
  { label: 'Under ₹10 Lakh', href: '/best-cars-under-10-lakh' },
  { label: '₹10-15 Lakh', href: '/best-cars-under-15-lakh' },
  { label: '₹15-20 Lakh', href: '/best-cars-under-20-lakh' },
  { label: '₹20-25 Lakh', href: '/best-cars-under-25-lakh' },
]

const BODY_TYPES = [
  { label: 'SUV', href: '/top-cars/suv' },
  { label: 'Sedan', href: '/top-cars/sedan' },
  { label: 'Hatchback', href: '/top-cars/hatchback' },
  { label: 'Luxury', href: '/top-cars/luxury' },
]

const POPULAR_BRANDS = [
  { name: 'Maruti Suzuki', href: '/maruti-suzuki-cars' },
  { name: 'Hyundai', href: '/hyundai-cars' },
  { name: 'Tata', href: '/tata-cars' },
  { name: 'Mahindra', href: '/mahindra-cars' },
  { name: 'Kia', href: '/kia-cars' },
]

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { user, isAuthenticated, logout } = useAuth()

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  // Get selected city from localStorage
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const city = localStorage.getItem('selectedCity')
      if (city) {
        setSelectedCity(city)
      }
    }

    // Listen for custom city change events
    const handleCityChange = (e: any) => {
      setSelectedCity(e.detail)
    }
    window.addEventListener('cityChange', handleCityChange)
    return () => window.removeEventListener('cityChange', handleCityChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      <header className={`sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>

        {/* Clean White Navbar */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Desktop Layout */}
            <div className="hidden lg:flex justify-between items-center h-[68px]">

              {/* Left: Logo + Brand Name */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                  <Image
                    src="/am-logo.png"
                    alt="Assad Motors Logo"
                    width={44}
                    height={44}
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-[22px] font-bold text-[#291e6a] tracking-tight">Assad Motors</span>
              </Link>

              {/* Right: Navigation + Icons */}
              <div className="flex items-center space-x-6">
                {/* Desktop Nav Links */}
                <nav className="flex items-center space-x-5">
                  <Link href="/buy" className="text-[15px] font-medium text-gray-700 hover:text-[#291e6a] transition-colors">
                    Buy Car
                  </Link>
                  <Link href="/sell" className="text-[15px] font-medium text-gray-700 hover:text-[#291e6a] transition-colors">
                    Sell Car
                  </Link>
                  <Link href="/service" className="text-[15px] font-medium text-gray-700 hover:text-[#291e6a] transition-colors">
                    Service
                  </Link>
                </nav>

                <div className="w-px h-6 bg-gray-200" />

                {/* Search Icon */}
                <button
                  onClick={() => router.push('/search')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-[22px] w-[22px] text-gray-600" />
                </button>

                {/* Location Icon */}
                <Link
                  href="/location"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Select location"
                >
                  <MapPin className="h-[22px] w-[22px] text-gray-600" />
                </Link>

                {/* Phone */}
                <a
                  href="tel:9945210466"
                  className="hidden xl:flex items-center gap-2 text-sm font-semibold text-[#291e6a] hover:text-[#1c144a] transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  9945210466
                </a>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex lg:hidden justify-between items-center h-[60px]">

              {/* Left: Logo + Brand */}
              <Link href="/" className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                  <Image
                    src="/am-logo.png"
                    alt="Assad Motors Logo"
                    width={36}
                    height={36}
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-lg font-bold text-[#291e6a] tracking-tight">Assad Motors</span>
              </Link>

              {/* Right: Icons */}
              <div className="flex items-center space-x-1">
                {/* Search */}
                <button
                  onClick={() => router.push('/search')}
                  className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-[22px] w-[22px] text-gray-600" />
                </button>

                {/* Location */}
                <Link
                  href="/location"
                  className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Select location"
                >
                  <MapPin className="h-[22px] w-[22px] text-gray-600" />
                </Link>

                {/* Hamburger Menu */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Menu"
                >
                  <Menu className="h-[22px] w-[22px] text-gray-600" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm z-[70] bg-white shadow-2xl lg:hidden flex flex-col animate-in slide-in-from-right duration-300">
            {/* Menu Header */}
            <div className="bg-white p-5 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <Image
                    src="/am-logo.png"
                    alt="Assad Motors Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-[#291e6a] leading-tight">Assad Motors</span>
                  <span className="text-xs text-gray-500">Premium Car Experience</span>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Location Bar in Menu */}
            <Link
              href="/location"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-b border-gray-100"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#291e6a]" />
                <span className="text-sm font-medium text-gray-800">{selectedCity}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Link>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto py-3">
              <div className="space-y-0.5 px-3">
                <Link
                  href="/buy"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-gray-800 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span>Buy a car</span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Link>
                <Link
                  href="/sell"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-gray-800 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span>Sell a car</span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Link>
                <Link
                  href="/service"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-gray-800 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span>Service car</span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Link>

                <div className="h-px bg-gray-100 my-2 mx-4" />

                {/* Browse Section */}
                <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Browse</p>
                {POPULAR_BRANDS.map((brand) => (
                  <Link
                    key={brand.name}
                    href={brand.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {brand.name}
                  </Link>
                ))}

                <div className="h-px bg-gray-100 my-2 mx-4" />

                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Menu Footer */}
            <div className="p-4 bg-white border-t border-gray-100">
              <a
                href="tel:9945210466"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#291e6a] text-white rounded-xl font-semibold text-sm hover:bg-[#1c144a] transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call 9945210466
              </a>
            </div>
          </div>
        </>
      )}
    </>
  )
}
