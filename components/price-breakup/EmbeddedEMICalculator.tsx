'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Info } from 'lucide-react'

interface EmbeddedEMICalculatorProps {
    onRoadPrice: number
    carName: string
}

export default function EmbeddedEMICalculator({
    onRoadPrice,
    carName
}: EmbeddedEMICalculatorProps) {
    // State
    const [carPrice, setCarPrice] = useState(onRoadPrice)
    const [downPayment, setDownPayment] = useState(Math.round(onRoadPrice * 0.2))
    const [tenure, setTenure] = useState(7)
    const [tenureMonths, setTenureMonths] = useState(84)
    const [interestRate, setInterestRate] = useState(8)

    // Section visibility
    const [showDownPayment, setShowDownPayment] = useState(true)
    const [showInterest, setShowInterest] = useState(true)

    // Update when onRoadPrice changes
    useEffect(() => {
        setCarPrice(onRoadPrice)
        setDownPayment(Math.round(onRoadPrice * 0.2))
    }, [onRoadPrice])

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Calculate EMI
    const emiCalculation = useMemo(() => {
        const principal = carPrice - downPayment
        const monthlyRate = interestRate / 12 / 100
        const months = tenureMonths

        if (monthlyRate === 0) {
            return { emi: Math.round(principal / months), totalAmount: principal, totalInterest: 0, principal }
        }

        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
        const totalAmount = emi * months
        return { emi: Math.round(emi), totalAmount: Math.round(totalAmount), totalInterest: Math.round(totalAmount - principal), principal }
    }, [carPrice, downPayment, tenureMonths, interestRate])

    // Amortization table
    const amortizationTable = useMemo(() => {
        const monthlyRate = interestRate / 12 / 100
        const table = []
        for (const month of [12, 24, 36, 48, 60, 72, 84]) {
            if (month <= tenureMonths) {
                let tempBalance = emiCalculation.principal
                let totalPrincipal = 0, totalInt = 0
                for (let i = 1; i <= month; i++) {
                    const interest = tempBalance * monthlyRate
                    const principalPaid = emiCalculation.emi - interest
                    tempBalance -= principalPaid
                    totalPrincipal += principalPaid
                    totalInt += interest
                }
                const finalBalance = month === tenureMonths ? 0 : Math.round(Math.max(0, emiCalculation.principal - totalPrincipal))
                table.push({ months: month, principal: Math.round(totalPrincipal), interest: Math.round(totalInt), balance: finalBalance })
            }
        }
        return table
    }, [emiCalculation.principal, emiCalculation.emi, tenureMonths, interestRate])

    // Sync tenure months
    useEffect(() => { setTenureMonths(tenure * 12) }, [tenure])

    const loanAmount = carPrice - downPayment

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="px-5 pt-6 pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {carName} EMI Calculator
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Calculate your monthly EMI with flexible loan options
                </p>
            </div>

            {/* EMI Display Header */}
            <div className="px-5 pb-5 border-b border-gray-100">
                <div className="flex items-baseline justify-between">
                    <div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(emiCalculation.emi)}</p>
                        <p className="text-xs text-gray-500 mt-1">Monthly EMI</p>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e8e6f0] text-[#1c144a] text-sm font-medium">
                            EMI For {tenure} Years
                        </span>
                    </div>
                </div>
            </div>

            {/* Down Payment Section */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-gray-900">
                        Down Payment: <span className="text-[#1c144a] font-bold">{formatCurrency(downPayment)}</span>
                    </label>
                    <button
                        onClick={() => setShowDownPayment(!showDownPayment)}
                        className="text-sm font-medium text-[#1c144a] hover:text-[#1c144a] transition-colors"
                    >
                        {showDownPayment ? 'Hide' : 'Show'}
                    </button>
                </div>

                {showDownPayment && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                            <span>{formatCurrency(Math.round(carPrice * 0.2))}</span>
                            <span>{formatCurrency(carPrice)}</span>
                        </div>
                        <input
                            type="range"
                            min={Math.round(carPrice * 0.2)}
                            max={carPrice}
                            value={downPayment}
                            onChange={(e) => setDownPayment(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#291e6a]"
                        />
                        <input
                            type="text"
                            inputMode="numeric"
                            value={downPayment}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '')
                                setDownPayment(val ? Number(val) : 0)
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291e6a] focus:border-transparent text-sm font-medium bg-gray-50"
                        />
                        <p className="text-sm text-gray-600">
                            Your loan amount will be: <span className="text-[#1c144a] font-semibold">{formatCurrency(loanAmount)}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Tenure & Interest Section */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-gray-900">Tenure</label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">Interest</span>
                        <Info className="w-4 h-4 text-gray-400" />
                        <button
                            onClick={() => setShowInterest(!showInterest)}
                            className="text-sm font-medium text-[#1c144a] hover:text-[#1c144a] transition-colors"
                        >
                            {showInterest ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                {/* Dual Sliders */}
                <div className="grid grid-cols-2 gap-6 mb-5">
                    <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
                            <span>1 year</span>
                            <span>7 years</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={7}
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#291e6a]"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
                            <span>8%</span>
                            <span>20%</span>
                        </div>
                        <input
                            type="range"
                            min={8}
                            max={20}
                            step={0.5}
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#291e6a]"
                        />
                    </div>
                </div>

                {/* Input Boxes */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 font-medium mb-2">Years</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={tenure}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '')
                                const num = val ? Math.min(7, Math.max(1, Number(val))) : 1
                                setTenure(num)
                            }}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291e6a] focus:border-transparent text-sm text-center font-medium bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 font-medium mb-2">Months</label>
                        <div className="px-3 py-2.5 border-2 border-[#6b5fc7] rounded-lg bg-[#f0eef5] text-sm text-center text-[#1c144a] font-bold">
                            {tenureMonths}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 font-medium mb-2">Interest %</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={interestRate}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9.]/g, '')
                                const num = val ? Math.min(20, Math.max(5, Number(val))) : 8
                                setInterestRate(num)
                            }}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291e6a] focus:border-transparent text-sm text-center font-medium bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            {/* Amortization Table */}
            <div className="p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Payment Schedule</h4>
                <div className="overflow-x-auto -mx-5 px-5">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 font-semibold text-gray-700">Months</th>
                                <th className="text-right py-3 font-semibold text-gray-700">Principal</th>
                                <th className="text-right py-3 font-semibold text-gray-700">Interest</th>
                                <th className="text-right py-3 font-semibold text-gray-700">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {amortizationTable.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 text-gray-900 font-medium">{row.months}</td>
                                    <td className="py-3 text-right text-gray-700">{formatCurrency(row.principal)}</td>
                                    <td className="py-3 text-right text-[#1c144a]">{formatCurrency(row.interest)}</td>
                                    <td className="py-3 text-right text-gray-900 font-medium">{formatCurrency(row.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Total Interest:</span>
                        <span className="font-semibold text-[#1c144a]">{formatCurrency(emiCalculation.totalInterest)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Total Amount:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(emiCalculation.totalAmount)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
