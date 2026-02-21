import { Metadata } from 'next'
import PageContainer, { PageSection } from '@/components/layout/PageContainer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'

export const metadata: Metadata = {
    title: 'Terms and Conditions | gadizone',
    description: 'Terms and Conditions for using gadizone - Your comprehensive automotive research platform.',
}

export default function TermsAndConditionsPage() {
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <PageContainer maxWidth="lg">
                    <PageSection spacing="normal">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-10">
                            <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Link>

                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
                            <p className="text-sm text-gray-500 mb-8">Last Updated: December 2024</p>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    These Terms and Conditions ("Terms") govern your use of the gadizone website and services.
                                    By accessing or using gadizone, you agree to be bound by these Terms.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Definitions</h2>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li><strong>"gadizone"</strong> refers to the website, its owners, and operators</li>
                                    <li><strong>"User"</strong> refers to any person who accesses or uses our website</li>
                                    <li><strong>"Services"</strong> refers to all features and content provided by gadizone</li>
                                    <li><strong>"Content"</strong> refers to all information, data, text, images, and materials on the website</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Services Description</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    gadizone provides an online automotive information platform offering:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Car research, specifications, and pricing information</li>
                                    <li>On-road price calculations and EMI calculators</li>
                                    <li>User reviews and ratings platform</li>
                                    <li>Car comparison tools</li>
                                    <li>Dealer contact facilitation</li>
                                    <li>Loan eligibility and financing information</li>
                                    <li>Automotive news and updates</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    By using gadizone, you agree to:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Provide accurate and truthful information</li>
                                    <li>Use the services only for lawful purposes</li>
                                    <li>Not impersonate any person or entity</li>
                                    <li>Not post false, misleading, or defamatory reviews</li>
                                    <li>Not interfere with the proper working of the website</li>
                                    <li>Not attempt to access restricted areas or systems</li>
                                    <li>Comply with all applicable laws and regulations</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Information Disclaimer</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    The information provided on gadizone is for general informational purposes only:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Car prices and specifications are indicative and may vary</li>
                                    <li>On-road prices depend on location, taxes, and dealer charges</li>
                                    <li>EMI calculations are estimates and actual terms depend on lenders</li>
                                    <li>Features and availability may change without notice</li>
                                    <li>Always verify information with authorized dealers before purchase</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. User Content and Reviews</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    When you submit reviews or content:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>You retain ownership of your content</li>
                                    <li>You grant gadizone a non-exclusive license to use, display, and distribute your content</li>
                                    <li>You are solely responsible for the accuracy and legality of your content</li>
                                    <li>gadizone reserves the right to remove content that violates these Terms</li>
                                    <li>Reviews must be based on genuine ownership or experience</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    All content on gadizone, including but not limited to text, graphics, logos, icons, images,
                                    audio clips, digital downloads, and software, is the property of gadizone or its content
                                    suppliers and is protected by intellectual property laws.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You may not reproduce, distribute, modify, or create derivative works from any content
                                    without express written permission.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Third-Party Services</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    gadizone may connect you with third-party services including:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Car dealers and showrooms</li>
                                    <li>Banks and financial institutions for loans</li>
                                    <li>Insurance providers</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    gadizone is not responsible for the services, products, or practices of these third parties.
                                    Your dealings with them are solely between you and the third party.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    To the fullest extent permitted by law, gadizone shall not be liable for:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Any indirect, incidental, special, or consequential damages</li>
                                    <li>Loss of profits, data, or business opportunities</li>
                                    <li>Decisions made based on information on our website</li>
                                    <li>Actions or omissions of third parties, including dealers and lenders</li>
                                    <li>Service interruptions or technical issues</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Indemnification</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You agree to indemnify and hold harmless gadizone in its directors, officers, employees,
                                    and agents from any claims, damages, losses, or expenses arising from your use of the
                                    website or violation of these Terms.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Termination</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    gadizone reserves the right to suspend or terminate your access to the website at any time,
                                    without notice, for any reason, including violation of these Terms.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Governing Law</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    These Terms shall be governed by and construed in accordance with the laws of India.
                                    Any disputes arising from these Terms shall be subject to the exclusive jurisdiction
                                    of the courts in India.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Changes to Terms</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    gadizone reserves the right to modify these Terms at any time. Changes will be effective
                                    upon posting. Your continued use of the website after changes constitutes acceptance of
                                    the modified Terms.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    For questions about these Terms, please contact us:
                                </p>
                                <p className="text-gray-700 mb-4">
                                    <strong>Email:</strong> legal@gadizone.com<br />
                                    <strong>Website:</strong> www.gadizone.com
                                </p>
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    By using gadizone, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
                                </p>
                            </div>
                        </div>
                    </PageSection>
                </PageContainer>
            </div>
            <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />
            <Footer />
        </>
    )
}
