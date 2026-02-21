'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { renderTextWithCarLinks, useCarModelsData } from '@/lib/faq-hyperlinks'

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQSectionProps {
  carName: string
  faqs: FAQItem[]
}

export default function FAQSection({ carName, faqs }: FAQSectionProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  // Load car models for hyperlink generation
  useCarModelsData()

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {carName} FAQ
        </h2>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 text-sm">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {expandedFAQ === faq.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="text-gray-700 text-sm leading-relaxed pt-3">
                    {renderTextWithCarLinks(faq.answer, carName.split(' ')[0])}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
