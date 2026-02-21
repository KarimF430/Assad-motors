import { Metadata } from 'next'
import PageContainer, { PageSection } from '@/components/layout/PageContainer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Visitor Agreement | gadizone',
    description: 'Visitor Agreement for gadizone - Your trusted automotive platform for car research, reviews, and pricing.',
}

export default function VisitorAgreementPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageContainer maxWidth="lg">
                <PageSection spacing="normal">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Agreement</h1>
                        <p className="text-sm text-gray-500 mb-8">Last Updated: December 2024</p>

                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-6">
                                Welcome to gadizone! By accessing and using our website, you agree to be bound by this Visitor Agreement.
                                Please read this agreement carefully before using our services.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                By visiting, browsing, or using gadizone (the "Website"), you acknowledge that you have read, understood,
                                and agree to be bound by this Visitor Agreement, our Privacy Policy, and our Terms and Conditions.
                                If you do not agree to these terms, please do not use our Website.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Website Purpose</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                gadizone is an automotive information platform that provides:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>Comprehensive car research and specifications</li>
                                <li>Car prices, variants, and on-road pricing information</li>
                                <li>User reviews and ratings</li>
                                <li>EMI and loan calculators</li>
                                <li>Car comparison tools</li>
                                <li>Automotive news and updates</li>
                                <li>Dealer information and contact details</li>
                            </ul>

                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. User Conduct</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                While using gadizone, you agree to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>Provide accurate information when submitting reviews or inquiries</li>
                                <li>Not engage in any fraudulent, abusive, or illegal activities</li>
                                <li>Not attempt to gain unauthorized access to any part of the Website</li>
                                <li>Not use automated tools to scrape or collect data without permission</li>
                                <li>Respect other users and maintain civil discourse in reviews and comments</li>
                            </ul>

                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Information Accuracy</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                While we strive to provide accurate and up-to-date information, gadizone does not guarantee the
                                accuracy, completeness, or timeliness of the information on our Website. Car prices, specifications,
                                and features are subject to change by manufacturers without notice. We recommend verifying all
                                information with official dealers before making purchase decisions.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Third-Party Links</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Our Website may contain links to third-party websites, including dealer websites, manufacturer sites,
                                and financial institutions. gadizone is not responsible for the content, privacy practices, or
                                services of these external sites.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                All content on gadizone, including text, graphics, logos, images, and software, is the property
                                of gadizone or its content suppliers and is protected by intellectual property laws. You may not
                                reproduce, distribute, or create derivative works without our express written permission.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                gadizone shall not be liable for any direct, indirect, incidental, special, or consequential
                                damages resulting from your use of or inability to use our Website, or from any decisions made
                                based on information provided on our platform.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Changes to Agreement</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We reserve the right to modify this Visitor Agreement at any time. Changes will be effective
                                immediately upon posting. Your continued use of the Website after changes are posted constitutes
                                your acceptance of the modified agreement.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have any questions about this Visitor Agreement, please contact us at:
                            </p>
                            <p className="text-gray-700 mb-4">
                                <strong>Email:</strong> support@gadizone.com<br />
                                <strong>Website:</strong> www.gadizone.com
                            </p>
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                By using gadizone, you confirm that you have read and agree to this Visitor Agreement.
                            </p>
                        </div>
                    </div>
                </PageSection>
            </PageContainer>
        </div>
    )
}
