import { Metadata } from 'next'
import { Suspense } from 'react'
import EMICalculatorPage from '@/components/emi/EMICalculatorPage'
import { generateFinancialProductSchema, generateFAQSchema } from '@/lib/structured-data'
import JsonLd from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Car Loan EMI Calculator - Calculate Monthly Payments | assadmotors',
  description: 'Calculate car loan EMI with our interactive calculator. Get instant results for down payment, tenure, and interest rates. Compare loan options for your dream car.',
  keywords: 'car loan EMI calculator, car loan calculator, monthly EMI calculator, car finance, auto loan EMI, car loan interest rate',
  alternates: {
    canonical: '/emi-calculator',
  },
  openGraph: {
    title: 'Car Loan EMI Calculator - Calculate Monthly Payments | assadmotors',
    description: 'Calculate car loan EMI with our interactive calculator. Get instant results for down payment, tenure, and interest rates.',
    type: 'website',
  },
}

export default function EMIPage() {
  const financialSchema = generateFinancialProductSchema()

  const faqs = [
    {
      question: "How is car loan EMI calculated?",
      answer: "Car loan EMI is calculated using the formula: E = P x R x (1+R)^n / ((1+R)^n-1), where E is EMI, P is Principal Loan Amount, R is monthly interest rate, and n is loan tenure in months."
    },
    {
      question: "What is a good CIBIL score for car loan?",
      answer: "A CIBIL score of 750 and above is considered excellent for getting quick car loan approval with lower interest rates."
    },
    {
      question: "Can I prepay my car loan?",
      answer: "Yes, most banks allow prepayment of car loans after a lock-in period (usually 6-12 months), though some may charge a small foreclosure fee."
    }
  ]
  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      <JsonLd data={financialSchema} />
      <JsonLd data={faqSchema} />

      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <h1 className="sr-only">Car Loan EMI Calculator</h1>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading EMI Calculator...</p>
          </div>
        </div>
      }>
        <EMICalculatorPage />



        {/* SEO Content Section (Hidden from main view but visible to bots/users scrolling down) */}
        <div className="max-w-7xl mx-auto px-4 py-8 text-gray-700">
          <section className="prose max-w-none">
            <h2>Frequently Asked Questions</h2>
            <dl className="mt-4 space-y-6">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <dt className="font-semibold text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </Suspense>
    </>
  )
}
