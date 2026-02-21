'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, MapPin, Heart, Smile, ChevronDown, Phone } from 'lucide-react'
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

        {/* TOP BAR (Desktop & Mobile) - Dark Indigo Theme */}
        <div className="bg-[#291e6a] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Desktop Layout */}
            <div className="hidden lg:flex justify-between items-center h-[72px]">

              {/* Logo & Location & Search */}
              <div className="flex items-center space-x-6 flex-1">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                    <img src="/logo.png?v=3" alt="Assad Motors Logo" className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  <span className="text-2xl font-bold text-white tracking-tight">Assad Motors</span>
                </Link>

                {/* Location Dropdown */}
                <Link href="/location" className="flex items-center space-x-1 border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors">
                  <span className="text-sm font-medium">{selectedCity}</span>
                  <ChevronDown className="h-4 w-4" />
                </Link>
              </div>

              {/* Right Side Links & Actions */}
              <div className="flex items-center justify-end space-x-8 lg:ml-8">
                <nav className="flex items-center space-x-6 shrink-0">
                  <button className="flex items-center space-x-1 text-sm font-medium text-white/90 hover:text-white group">
                    <span>Buy car</span>
                    <ChevronDown className="h-4 w-4 text-white/60 group-hover:text-white" />
                  </button>
                  <button className="flex items-center space-x-1 text-sm font-medium text-white/90 hover:text-white group">
                    <span>Sell car</span>
                    <ChevronDown className="h-4 w-4 text-white/60 group-hover:text-white" />
                  </button>
                </nav>

                <div className="flex items-center space-x-6 shrink-0 border-l border-white/20 pl-6">
                  <div className="flex flex-col items-start hidden xl:flex">
                    <span className="text-[10px] text-white/70">Call us at</span>
                    <a href="tel:727-727-7275" className="text-sm font-bold tracking-wide">727-727-7275</a>
                  </div>
                </div>
              </div>

            </div>

            {/* Mobile Layout (Top Bar) */}
            <div className="flex lg:hidden justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 -ml-1 text-white hover:bg-white/10 rounded-lg">
                  <Menu className="h-7 w-7" />
                </button>
                <div className="flex flex-col">
                  <Link href="/location" className="flex items-center space-x-1 text-white group">
                    <span className="font-semibold text-lg">{selectedCity}</span>
                    <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-2">
              </div>
            </div>

          </div>
        </div>

      </header >

      {/* Mobile Menu Overlay */}
      {
        isMenuOpen && (
          <>
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200" onClick={() => setIsMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm z-[70] bg-white shadow-2xl lg:hidden flex flex-col animate-in slide-in-from-left duration-300">
              {/* Menu Header */}
              <div className="bg-[#291e6a] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <img src="/logo.png?v=3" alt="Assad Motors Logo" className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg leading-tight">Assad Motors</span>
                    <span className="text-xs text-white/70">Welcome to Assad Motors</span>
                  </div>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-white/80 hover:text-white bg-white/10 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto py-4 bg-gray-50">
                <div className="space-y-1 px-3">
                  <Link href="/buy" className="block px-4 py-3 text-gray-800 font-medium hover:bg-gray-100 rounded-lg">Buy a car</Link>
                  <Link href="/sell" className="block px-4 py-3 text-gray-800 font-medium hover:bg-gray-100 rounded-lg">Sell a car</Link>
                  <Link href="/service" className="block px-4 py-3 text-gray-800 font-medium hover:bg-gray-100 rounded-lg">Service car</Link>
                  <div className="h-px bg-gray-200 my-2 mx-4" />
                  <Link href="/about" className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">About Us</Link>
                  <Link href="/faq" className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">FAQ</Link>
                  <Link href="/contact" className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">Contact Us</Link>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="p-4 bg-white border-t border-gray-100">
                <a href="tel:727-727-7275" className="flex items-center justify-center gap-2 w-full py-3 bg-[#291e6a]/5 text-[#291e6a] rounded-xl font-semibold">
                  <Phone className="h-4 w-4" />
                  Call 727-727-7275
                </a>
              </div>
            </div>
          </>
        )
      }
    </>
  )
}

