import { Metadata } from 'next'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'

export const metadata: Metadata = {
    title: 'Car Service & Maintenance | gadizone',
    description: 'Book car service appointment online. Find authorized service centers and garages near you.',
}

export default function ServicePage() {
    return (
        <>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Car Service</h1>
                    <p className="text-xl text-gray-600 mb-8">Book your car service and maintenance online. Coming soon.</p>
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                        <p className="text-gray-500">We are partnering with authorized service centers to give you the best experience.</p>
                    </div>
                </div>
            </div>
            <Breadcrumb items={[{ label: 'Service' }]} />
            <Footer />
        </>
    )
}
