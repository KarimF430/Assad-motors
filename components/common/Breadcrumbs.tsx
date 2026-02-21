'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Generate Schema.org BreadcrumbList structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.gadizone.com"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href && { "item": `https://www.gadizone.com${item.href}` })
      }))
    ]
  }

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Visual breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`bg-gray-50 border-t border-gray-100 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            {/* Home link */}
            <li className="flex items-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-1"
                aria-label="Home"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </li>

            {/* Breadcrumb items */}
            {items.map((item, index) => {
              const isLast = index === items.length - 1

              return (
                <li key={index} className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-orange-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={`font-medium ${isLast ? 'text-gray-900' : 'text-gray-500'}`}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}

/**
 * Usage Examples:
 * 
 * // Brand page
 * <Breadcrumbs items={[
 *   { label: 'Brands', href: '/brands' },
 *   { label: 'Maruti Suzuki' }
 * ]} />
 * 
 * // Model page
 * <Breadcrumbs items={[
 *   { label: 'Brands', href: '/brands' },
 *   { label: 'Maruti Suzuki', href: '/maruti-suzuki-cars' },
 *   { label: 'Swift' }
 * ]} />
 * 
 * // Variant page
 * <Breadcrumbs items={[
 *   { label: 'Brands', href: '/brands' },
 *   { label: 'Maruti Suzuki', href: '/maruti-suzuki-cars' },
 *   { label: 'Swift', href: '/maruti-suzuki-cars/swift' },
 *   { label: 'VXI AMT' }
 * ]} />
 */
