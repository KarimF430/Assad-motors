'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'

interface CarDetailTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function CarDetailTabs({ activeTab, onTabChange }: CarDetailTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: '360-view', label: '360° View' },
    { id: 'variants', label: 'Variants' },
    { id: 'offers', label: 'Offers' },
    { id: 'expert-review', label: 'Expert Review' }
  ]

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex space-x-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-6 border-b-3 font-medium text-sm whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 bg-teal-50/50'
                    : 'border-transparent text-gray-600 hover:text-teal-600 hover:border-teal-300 hover:bg-gray-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              const shareData = {
                title: document.title || 'gadizone',
                text: 'Check out this car on gadizone!',
                url: window.location.href
              };

              if (navigator.share) {
                navigator.share(shareData).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
