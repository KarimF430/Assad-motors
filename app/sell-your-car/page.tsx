import { Metadata } from 'next'
import PageContainer from '@/components/layout/PageContainer'
import SellCarForm from '@/components/sell-car/SellCarForm'
import { ShieldCheck, Trophy, BadgeCheck, Sparkles, Zap } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Sell Your Car | Assad Motors - Get the Best Value for Your Premium Car',
    description: 'Sell your premium used car to Assad Motors. Transparent valuation, expert inspection, and instant payment. Trusted by thousands of luxury car owners.',
}

export default function SellYourCarPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Premium Branding Header */}
            <div className="bg-[#1c144a] pt-20 pb-40 px-6 overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -mr-48 -mt-48 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -ml-40 -mb-40 opacity-60"></div>

                <PageContainer maxWidth="lg">
                    <div className="relative z-10 text-center">
                        <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                            Sell Your Car With <br />
                            <span className="text-red-500">Zero Hassle.</span>
                        </h1>
                        <p className="text-blue-100/70 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed font-medium mb-0">
                            Professional valuation and seamless transactions for your premium vehicle.
                        </p>
                    </div>
                </PageContainer>
            </div>

            <PageContainer maxWidth="md">
                <SellCarForm />
            </PageContainer>
        </div>
    )
}
