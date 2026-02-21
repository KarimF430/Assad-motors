'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PageContainer, { PageSection } from '../layout/PageContainer'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'

const FUEL_TYPES = [
    { id: 'petrol', label: 'Petrol', price: 104.21 },
    { id: 'diesel', label: 'Diesel', price: 90.76 },
    { id: 'cng', label: 'CNG (kg)', price: 76.59 },
]

export default function FuelCalculatorPage() {
    const [distance, setDistance] = useState('')
    const [mileage, setMileage] = useState('')
    const [fuelPrice, setFuelPrice] = useState('104.21')
    const [fuelType, setFuelType] = useState('petrol')
    const [result, setResult] = useState<{ fuelNeeded: number; totalCost: number } | null>(null)

    useEffect(() => { window.scrollTo(0, 0) }, [])

    useEffect(() => {
        const fuel = FUEL_TYPES.find(f => f.id === fuelType)
        if (fuel) setFuelPrice(fuel.price.toString())
    }, [fuelType])

    const calculate = () => {
        const d = parseFloat(distance), m = parseFloat(mileage), p = parseFloat(fuelPrice)
        if (d > 0 && m > 0 && p > 0) {
            const fuelNeeded = d / m
            setResult({ fuelNeeded, totalCost: fuelNeeded * p })
        }
    }

    const reset = () => {
        setDistance('')
        setMileage('')
        setFuelType('petrol')
        setFuelPrice('104.21')
        setResult(null)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageContainer maxWidth="md">
                <PageSection spacing="normal">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

                        {/* Header */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h1 className="text-base font-semibold text-gray-900">Fuel Cost Calculator</h1>
                                <Link href="/" className="text-gray-400 hover:text-gray-600">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Calculate your trip fuel expenses</p>
                        </div>

                        {/* Fuel Type */}
                        <div className="p-4 border-b border-gray-200">
                            <label className="block text-sm font-medium text-gray-900 mb-3">Fuel Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {FUEL_TYPES.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFuelType(f.id)}
                                        className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${fuelType === f.id
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="p-4 space-y-4 border-b border-gray-200">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">DISTANCE (km)</label>
                                <input
                                    type="number"
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                    placeholder="Enter distance in kilometers"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    MILEAGE ({fuelType === 'cng' ? 'km/kg' : 'km/l'})
                                </label>
                                <input
                                    type="number"
                                    value={mileage}
                                    onChange={(e) => setMileage(e.target.value)}
                                    placeholder="Enter your vehicle's mileage"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    FUEL PRICE (₹/{fuelType === 'cng' ? 'kg' : 'litre'})
                                </label>
                                <input
                                    type="number"
                                    value={fuelPrice}
                                    onChange={(e) => setFuelPrice(e.target.value)}
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Price auto-filled based on current rates. You can edit if needed.</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 flex gap-3">
                            <button
                                onClick={calculate}
                                disabled={!distance || !mileage || !fuelPrice}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded transition-colors"
                            >
                                Calculate
                            </button>
                            <button onClick={reset} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded">
                                Reset
                            </button>
                        </div>

                        {/* Result */}
                        {result && (
                            <div className="p-4 bg-orange-50 border-t border-orange-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Estimated Fuel Cost</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                        <p className="text-xs text-gray-500">Fuel Needed</p>
                                        <p className="text-lg font-bold text-gray-900">{result.fuelNeeded.toFixed(2)} {fuelType === 'cng' ? 'kg' : 'L'}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                        <p className="text-xs text-gray-500">Total Cost</p>
                                        <p className="text-lg font-bold text-orange-600">₹{result.totalCost.toFixed(0)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SEO Content */}
                    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Guide to Fuel Cost Calculation</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Planning a road trip or budgeting for your daily commute? Understanding your fuel expenses is crucial for managing your monthly budget.
                                The gadizone Fuel Cost Calculator is a simple yet powerful tool designed to help you estimate exactly how much you'll spend on fuel for any given trip.
                                Whether you drive a petrol, diesel, or CNG vehicle, our calculator uses the latest fuel prices to provide accurate estimates.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Simply enter your trip distance, your vehicle's mileage (fuel efficiency), and the current fuel price in your city.
                                The calculator will instantly show you the total fuel required and the estimated cost, helping you plan your journey better.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">How to Calculate Fuel Cost Manually?</h3>
                            <p className="text-gray-700 mb-3">The formula to calculate fuel cost is straightforward:</p>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
                                <p className="font-mono text-orange-800 font-medium">Fuel Cost = (Distance / Mileage) × Fuel Price</p>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                                <li><strong>Distance:</strong> The total kilometers you plan to travel.</li>
                                <li><strong>Mileage:</strong> Your vehicle's fuel efficiency (km/l or km/kg).</li>
                                <li><strong>Fuel Price:</strong> The current cost of fuel per litre or kg.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">5 Smart Tips to Save Fuel</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">1. Maintain Steady Speed</h4>
                                    <p className="text-sm text-gray-600">Avoid sudden acceleration and braking. Driving at a constant speed of 45-55 km/h is often the most fuel-efficient for city driving.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">2. Check Tyre Pressure</h4>
                                    <p className="text-sm text-gray-600">Under-inflated tyres increase rolling resistance, forcing the engine to work harder. Keeping tyres properly inflated can improve mileage by up to 3%.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">3. Reduce AC Usage</h4>
                                    <p className="text-sm text-gray-600">The air conditioner puts a significant load on the engine. On pleasant days, consider turning off the AC to save fuel.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">4. Plan Your Route</h4>
                                    <p className="text-sm text-gray-600">Use navigation apps to avoid traffic jams. Idling in traffic consumes fuel without covering any distance (0 km/l).</p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Petrol vs Diesel vs CNG: Cost Comparison</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-gray-50 text-gray-700">
                                        <tr>
                                            <th className="p-3 border">Fuel Type</th>
                                            <th className="p-3 border">Avg. Price (₹)</th>
                                            <th className="p-3 border">Avg. Mileage</th>
                                            <th className="p-3 border">Cost per KM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-3 border font-medium">Petrol</td>
                                            <td className="p-3 border">₹100 - ₹110</td>
                                            <td className="p-3 border">12 - 18 km/l</td>
                                            <td className="p-3 border">~₹6 - ₹9</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border font-medium">Diesel</td>
                                            <td className="p-3 border">₹90 - ₹100</td>
                                            <td className="p-3 border">18 - 24 km/l</td>
                                            <td className="p-3 border">~₹4 - ₹5.5</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border font-medium">CNG</td>
                                            <td className="p-3 border">₹75 - ₹85</td>
                                            <td className="p-3 border">24 - 32 km/kg</td>
                                            <td className="p-3 border text-green-600 font-bold">~₹2.5 - ₹3.5</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">*Estimates based on average hatchback performance in 2024.</p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <details className="group border-b border-gray-100 pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-orange-600">
                                        <span>Does using AC affect fuel consumption?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-gray-600 mt-3 text-sm">Yes, using the air conditioner can increase fuel consumption by 10% to 20%, especially in city traffic. However, at highway speeds, open windows can create drag that might use more fuel than the AC.</p>
                                </details>
                                <details className="group border-b border-gray-100 pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-orange-600">
                                        <span>Which speed is most fuel efficient?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-gray-600 mt-3 text-sm">For most cars, the sweet spot for fuel efficiency is between 50 km/h and 80 km/h in top gear. Driving significantly faster increases wind resistance, while driving slower usually requires lower gears, consuming more fuel.</p>
                                </details>
                                <details className="group border-b border-gray-100 pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-orange-600">
                                        <span>How to calculate mileage manually?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-gray-600 mt-3 text-sm">The "Tank-to-Tank" method is most accurate: Fill your tank to the brim and reset the trip meter. Drive for a few hundred km. Refill the tank to the brim again. Divide the kilometers driven by the litres of fuel needed to refill. Result = Actual Mileage.</p>
                                </details>
                            </div>
                        </section>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Explore More Tools</h3>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/emi-calculator" className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
                                    Car EMI Calculator <ArrowLeft className="w-3 h-3 rotate-180" />
                                </Link>
                                <Link href="/compare" className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
                                    Compare Cars <ArrowLeft className="w-3 h-3 rotate-180" />
                                </Link>
                                <Link href="/location" className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
                                    Check On-Road Price <ArrowLeft className="w-3 h-3 rotate-180" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </PageSection>
            </PageContainer>

            <Breadcrumb items={[{ label: 'Fuel Cost Calculator' }]} />
            <Footer />
        </div>
    )
}
