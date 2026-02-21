import { Metadata } from 'next'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'

export const metadata: Metadata = {
    title: 'Car Insurance - Compare & Buy Online | gadizone',
    description: 'Get the best car insurance quotes. Compare plans, renew policies, and save money on your car insurance.',
}

export default function InsurancePage() {
    return (
        <>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Car Insurance</h1>
                    <p className="text-xl text-gray-600 mb-8">Compare and buy the best car insurance plans. Feature coming soon.</p>
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                        <p className="text-gray-500">We are working hard to bring you the best insurance comparison engine. Stay tuned!</p>
                    </div>
                </div>
            </div>
            <Breadcrumb items={[{ label: 'Insurance' }]} />
            <Footer />
        </>
    )
}
