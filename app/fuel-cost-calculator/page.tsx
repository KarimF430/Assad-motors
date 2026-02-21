import { Metadata } from 'next'
import FuelCalculatorPage from '@/components/calculators/FuelCalculatorPage'

export const metadata: Metadata = {
    title: 'Fuel Cost Calculator - Calculate Trip Fuel Expenses | gadizone',
    description: 'Calculate your trip fuel cost easily. Enter distance, mileage, and fuel price to get estimated fuel expenses for petrol, diesel or CNG vehicles.',
    keywords: 'fuel cost calculator, trip fuel cost, petrol cost calculator, diesel cost calculator, CNG cost, fuel expense calculator india',
    alternates: {
        canonical: '/fuel-cost-calculator'
    }
}

export default function FuelCalculator() {
    return <FuelCalculatorPage />
}
