'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { renderTextWithCarLinks, useCarModelsData } from '@/lib/faq-hyperlinks'

interface FAQ {
  question: string
  answer: string
}

interface BrandFAQProps {
  brandName: string
  brandId?: string
  initialBrand?: any
}

export default function BrandFAQ({ brandName, brandId, initialBrand }: BrandFAQProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  // Load car models for hyperlink generation
  useCarModelsData()

  // Use FAQs from initial brand or empty array
  const faqs: FAQ[] = initialBrand?.faqs || []

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section className="py-3 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="mb-8">
          <h2 className="text-[20px] sm:text-[24px] font-extrabold text-[#1c144a] mb-2">
            {brandName} FAQ
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            {faqs.length > 0 ? `${faqs.length} questions about ${brandName} cars` : 'No FAQs available'}
          </p>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-3 sm:py-6">
            <p className="text-sm sm:text-base text-gray-500">
              No FAQs available for {brandName} yet. Check back soon for answers to common questions!
            </p>
          </div>
        ) : (
          <div className="border-t border-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-5 text-left flex items-center justify-between transition-colors group"
                >
                  <span className="font-semibold text-[#1e1e1e] pr-4 text-sm sm:text-base group-hover:text-[#1c144a]">{faq.question}</span>
                  <div className="bg-gray-50 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-100 flex-shrink-0 transition-colors group-hover:bg-gray-100">
                    {openFAQ === index ? (
                      <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#291e6a]" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#291e6a]" />
                    )}
                  </div>
                </button>

                {openFAQ === index && (
                  <div className="pb-5 pr-12">
                    <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {renderTextWithCarLinks(faq.answer, brandName)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
