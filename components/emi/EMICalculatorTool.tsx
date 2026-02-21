'use client'

import { useState, useEffect } from 'react'
import { Search, Calculator, IndianRupee, TrendingUp, Calendar, Percent, FileText, Download } from 'lucide-react'

interface CarVariant {
  id: number
  name: string
  brand: string
  model: string
  onRoadPrice: number
  exShowroomPrice: number
  fuelType: string
  transmission: string
  engine: string
}

interface EMICalculation {
  emi: number
  totalAmount: number
  totalInterest: number
  loanAmount: number
  downPayment: number
}

interface AmortizationEntry {
  month: number
  emi: number
  principal: number
  interest: number
  balance: number
}

export default function EMICalculatorTool() {
  const [selectedCar, setSelectedCar] = useState<CarVariant | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCarSelector, setShowCarSelector] = useState(false)
  const [loanAmount, setLoanAmount] = useState(0)
  const [downPayment, setDownPayment] = useState(0)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenure, setTenure] = useState(5)
  const [emiCalculation, setEMICalculation] = useState<EMICalculation | null>(null)
  const [amortizationTable, setAmortizationTable] = useState<AmortizationEntry[]>([])
  const [showAmortization, setShowAmortization] = useState(false)

  // Mock car variants data with on-road prices
  const carVariants: CarVariant[] = [
    {
      id: 1,
      name: 'LXI',
      brand: 'Maruti Suzuki',
      model: 'Swift',
      onRoadPrice: 685000,
      exShowroomPrice: 585000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      engine: '1197 cc'
    },
    {
      id: 2,
      name: 'VXI',
      brand: 'Maruti Suzuki',
      model: 'Swift',
      onRoadPrice: 759000,
      exShowroomPrice: 649000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      engine: '1197 cc'
    },
    {
      id: 3,
      name: 'ZXI',
      brand: 'Maruti Suzuki',
      model: 'Swift',
      onRoadPrice: 876000,
      exShowroomPrice: 746000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      engine: '1197 cc'
    },
    {
      id: 4,
      name: 'ZXI+ AMT',
      brand: 'Maruti Suzuki',
      model: 'Swift',
      onRoadPrice: 1017000,
      exShowroomPrice: 867000,
      fuelType: 'Petrol',
      transmission: 'AMT',
      engine: '1197 cc'
    },
    {
      id: 5,
      name: 'Sportz',
      brand: 'Hyundai',
      model: 'i20',
      onRoadPrice: 824000,
      exShowroomPrice: 704000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      engine: '1197 cc'
    },
    {
      id: 6,
      name: 'Asta',
      brand: 'Hyundai',
      model: 'i20',
      onRoadPrice: 1311000,
      exShowroomPrice: 1121000,
      fuelType: 'Petrol',
      transmission: 'CVT',
      engine: '1197 cc'
    }
  ]

  const filteredCars = carVariants.filter(car =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const calculateEMI = (principal: number, rate: number, time: number) => {
    const monthlyRate = rate / 12 / 100
    const months = time * 12
    
    if (monthlyRate === 0) {
      return principal / months
    }
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1)
    
    return emi
  }

  const generateAmortizationTable = (principal: number, rate: number, time: number, emi: number): AmortizationEntry[] => {
    const monthlyRate = rate / 12 / 100
    const months = time * 12
    const table: AmortizationEntry[] = []
    let balance = principal

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = emi - interestPayment
      balance = balance - principalPayment

      table.push({
        month,
        emi: Math.round(emi),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(Math.max(0, balance))
      })
    }

    return table
  }

  useEffect(() => {
    if (selectedCar) {
      const calculatedDownPayment = downPayment || Math.round(selectedCar.onRoadPrice * 0.2) // Default 20%
      const calculatedLoanAmount = loanAmount || (selectedCar.onRoadPrice - calculatedDownPayment)
      
      setDownPayment(calculatedDownPayment)
      setLoanAmount(calculatedLoanAmount)
    }
  }, [selectedCar])

  useEffect(() => {
    if (loanAmount > 0 && interestRate > 0 && tenure > 0) {
      const emi = calculateEMI(loanAmount, interestRate, tenure)
      const totalAmount = emi * tenure * 12
      const totalInterest = totalAmount - loanAmount

      const calculation: EMICalculation = {
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        loanAmount,
        downPayment
      }

      setEMICalculation(calculation)
      
      const table = generateAmortizationTable(loanAmount, interestRate, tenure, emi)
      setAmortizationTable(table)
    }
  }, [loanAmount, interestRate, tenure, downPayment])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatLakh = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)} Lakh`
  }

  const handleCarSelect = (car: CarVariant) => {
    setSelectedCar(car)
    setShowCarSelector(false)
    setSearchQuery('')
    
    // Set default values
    const defaultDownPayment = Math.round(car.onRoadPrice * 0.2)
    const defaultLoanAmount = car.onRoadPrice - defaultDownPayment
    
    setDownPayment(defaultDownPayment)
    setLoanAmount(defaultLoanAmount)
  }

  return (
    <div className="space-y-6">
      {/* Car Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Select Car Variant</h2>
        
        <button
          onClick={() => setShowCarSelector(true)}
          className="w-full p-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors duration-200"
        >
          {selectedCar ? (
            <div>
              <p className="font-semibold text-gray-900">
                {selectedCar.brand} {selectedCar.model} {selectedCar.name}
              </p>
              <p className="text-sm text-gray-600">
                {selectedCar.engine} • {selectedCar.fuelType} • {selectedCar.transmission}
              </p>
              <p className="text-sm text-red-600 font-medium">
                On-road price: {formatLakh(selectedCar.onRoadPrice)}
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-500">
              <Search className="h-5 w-5" />
              <span>Choose a car variant to calculate EMI</span>
            </div>
          )}
        </button>
      </div>

      {/* Car Selector Modal */}
      {showCarSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Car Variant</h3>
                <button
                  onClick={() => setShowCarSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search car variants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {filteredCars.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => handleCarSelect(car)}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">
                        {car.brand} {car.model} {car.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {car.engine} • {car.fuelType} • {car.transmission}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {formatLakh(car.onRoadPrice)}
                      </p>
                      <p className="text-xs text-gray-500">On-road price</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loan Parameters */}
      {selectedCar && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Loan Parameters</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Down Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down Payment (₹)
              </label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => {
                  const dp = Number(e.target.value) || 0
                  setDownPayment(dp)
                  setLoanAmount(selectedCar.onRoadPrice - dp)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Min: {formatCurrency(selectedCar.onRoadPrice * 0.1)}</span>
                <span>{((downPayment / selectedCar.onRoadPrice) * 100).toFixed(1)}% of on-road price</span>
              </div>
            </div>

            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => {
                  const la = Number(e.target.value) || 0
                  setLoanAmount(la)
                  setDownPayment(selectedCar.onRoadPrice - la)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max: {formatCurrency(selectedCar.onRoadPrice * 0.9)}
              </p>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Typical range: 7.5% - 12%
              </p>
            </div>

            {/* Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure (Years)
              </label>
              <select
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value={1}>1 Year</option>
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
                <option value={4}>4 Years</option>
                <option value={5}>5 Years</option>
                <option value={6}>6 Years</option>
                <option value={7}>7 Years</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* EMI Results */}
      {selectedCar && emiCalculation && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">EMI Calculation</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {selectedCar.brand} {selectedCar.model} {selectedCar.name}
                </p>
                <p className="text-sm text-gray-600">{tenure} years @ {interestRate}% p.a.</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* EMI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">Monthly EMI</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(emiCalculation.emi)}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Total Amount</span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(emiCalculation.totalAmount)}
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Percent className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Total Interest</span>
                </div>
                <p className="text-xl font-bold text-yellow-600">
                  {formatCurrency(emiCalculation.totalInterest)}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Principal</span>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(emiCalculation.loanAmount)}
                </p>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Car Price:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formatCurrency(selectedCar.onRoadPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Down Payment:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formatCurrency(emiCalculation.downPayment)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formatCurrency(emiCalculation.loanAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="flex-1 bg-[#291e6a] hover:bg-[#1c144a] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>{showAmortization ? 'Hide' : 'Show'} Amortization Table</span>
              </button>
              <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Get Loan Quote</span>
              </button>
              <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Amortization Table */}
            {showAmortization && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Amortization Schedule</h3>
                  <p className="text-sm text-gray-600">Month-wise payment breakdown</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {amortizationTable.slice(0, 12).map((entry) => (
                        <tr key={entry.month} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.month}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(entry.emi)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(entry.principal)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(entry.interest)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(entry.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {amortizationTable.length > 12 && (
                  <div className="p-4 bg-gray-50 text-center">
                    <p className="text-sm text-gray-600">
                      Showing first 12 months. Total {amortizationTable.length} months.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> EMI calculations are indicative and may vary based on bank policies, 
                processing fees, and other charges. Interest rates are subject to change. 
                Please consult with banks/financial institutions for exact loan terms and conditions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedCar && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select a Car Variant
            </h3>
            <p className="text-gray-600 mb-6">
              Choose a car variant to calculate EMI and explore different loan options
            </p>
            <button
              onClick={() => setShowCarSelector(true)}
              className="bg-[#291e6a] hover:bg-[#1c144a] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Choose Car Variant
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
