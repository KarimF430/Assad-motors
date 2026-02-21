'use client'

import { Calculator, ChevronRight, Shield, TrendingUp, Landmark } from 'lucide-react'

interface CarEMISectionProps {
  startingPrice: number
  carName: string
}

export default function CarEMISection({ startingPrice, carName }: CarEMISectionProps) {
  // Calculate EMI (simplified calculation)
  const calculateEMI = (principal: number, rate: number = 8.5, tenure: number = 5) => {
    const monthlyRate = rate / (12 * 100)
    const months = tenure * 12
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    return Math.round(emi)
  }

  const emiAmount = calculateEMI(startingPrice)

  return (
    <div className="bg-gradient-to-r bg-blue-50 border-y border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="bg-[#291e6a] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Kotak Mahindra Bank Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    {/* Generic Bank Icon */}
                    <Landmark className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-lg">Bank</div>
                    <div className="text-sm opacity-90">Partner</div>
                  </div>
                </div>

                <div className="border-l border-white/30 pl-4">
                  <div className="text-white/80 text-sm">Starting EMI</div>
                  <div className="text-3xl font-bold text-white">
                    ₹{emiAmount.toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm">per month</div>
                </div>
              </div>

              <button className="bg-white text-red-600 hover:bg-gray-50 font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                <Calculator className="h-5 w-5" />
                <span>Calculate EMI</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-800">Instant Approval</div>
                  <div className="text-xs text-green-600">Within 30 minutes</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-blue-800">Low Interest</div>
                  <div className="text-xs text-blue-600">Starting 8.5% p.a.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Calculator className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-sm font-medium text-purple-800">Flexible Tenure</div>
                  <div className="text-xs text-purple-600">Up to 7 years</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-wrap gap-4">
                <span>*EMI calculated at 8.5% for 5 years on ex-showroom price</span>
                <button className="text-red-600 hover:text-red-700 underline font-medium">
                  Terms & Conditions
                </button>
                <button className="text-blue-600 hover:text-blue-700 underline font-medium">
                  Eligibility Criteria
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
