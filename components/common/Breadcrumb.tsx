'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
    return (
        <nav
            className={`bg-gray-50 border-t border-gray-100 ${className}`}
            aria-label="Breadcrumb"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <ol
                    className="flex items-center flex-wrap gap-1 text-sm"
                    itemScope
                    itemType="https://schema.org/BreadcrumbList"
                >
                    {/* Home Link */}
                    <li
                        className="flex items-center"
                        itemProp="itemListElement"
                        itemScope
                        itemType="https://schema.org/ListItem"
                    >
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-1"
                            itemProp="item"
                        >
                            <Home className="w-3.5 h-3.5" />
                            <span itemProp="name">Home</span>
                        </Link>
                        <meta itemProp="position" content="1" />
                    </li>

                    {/* Breadcrumb Items */}
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center"
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="text-gray-500 hover:text-orange-600 transition-colors"
                                    itemProp="item"
                                >
                                    <span itemProp="name">{item.label}</span>
                                </Link>
                            ) : (
                                <span className="text-gray-700 font-medium" itemProp="name">{item.label}</span>
                            )}
                            <meta itemProp="position" content={(index + 2).toString()} />
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    )
}
