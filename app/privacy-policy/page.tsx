import { Metadata } from 'next'
import PageContainer, { PageSection } from '@/components/layout/PageContainer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'

export const metadata: Metadata = {
    title: 'Privacy Policy | gadizone',
    description: 'Privacy Policy for gadizone - Learn how we collect, use, and protect your personal information, including how we use Google AdSense for advertising.',
}

export default function PrivacyPolicyPage() {
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

                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                            <p className="text-sm text-gray-500 mb-8">Last Updated: February 2026</p>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    At gadizone, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
                                    use, disclose, and safeguard your information when you visit our website.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>

                                <h2 className="text-lg font-medium text-gray-900 mt-6 mb-3">1.1 Personal Information</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We may collect personal information that you voluntarily provide to us when you:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Register for an account</li>
                                    <li>Submit a car review or rating</li>
                                    <li>Request a dealer callback or price quote</li>
                                    <li>Use our EMI calculator or loan eligibility checker</li>
                                    <li>Subscribe to our newsletter</li>
                                    <li>Contact us for support</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    This information may include your name, email address, phone number, and location.
                                </p>

                                <h2 className="text-lg font-medium text-gray-900 mt-6 mb-3">1.2 Automatically Collected Information</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    When you visit gadizone, we automatically collect certain information, including:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>IP address and browser type</li>
                                    <li>Device information and operating system</li>
                                    <li>Pages viewed and time spent on pages</li>
                                    <li>Referring website and search terms</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Provide and improve our services</li>
                                    <li>Personalize your experience on gadizone</li>
                                    <li>Connect you with car dealers and financial institutions</li>
                                    <li>Send you relevant car recommendations and updates</li>
                                    <li>Process your inquiries and requests</li>
                                    <li>Analyze website usage and improve functionality</li>
                                    <li>Prevent fraud and ensure security</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We may share your information with:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li><strong>Car Dealers:</strong> When you request a callback or price quote</li>
                                    <li><strong>Financial Partners:</strong> When you apply for loan eligibility</li>
                                    <li><strong>Service Providers:</strong> Who assist in website operations and analytics</li>
                                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We do not sell your personal information to third parties.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Cookies and Tracking</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    gadizone uses cookies and similar technologies to enhance your browsing experience.
                                    Cookies help us remember your preferences, understand how you use our site, and serve
                                    relevant advertisements. You can manage cookie preferences through your browser settings.
                                </p>

                                <h2 className="text-lg font-medium text-gray-900 mt-6 mb-3">4.1 Advertising — Google AdSense</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    gadizone uses <strong>Google AdSense</strong> to display advertisements. Google AdSense uses cookies
                                    to serve ads based on your prior visits to this website and other websites on the internet.
                                    Google's use of advertising cookies enables it and its partners to serve ads to you based on
                                    your visit to gadizone and/or other sites on the internet.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You may opt out of personalized advertising by visiting{' '}
                                    <a
                                        href="https://www.google.com/settings/ads"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-600 hover:underline"
                                    >
                                        Google Ads Settings
                                    </a>
                                    {' '}or by visiting{' '}
                                    <a
                                        href="https://www.aboutads.info"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-600 hover:underline"
                                    >
                                        aboutads.info
                                    </a>
                                    . For more information on how Google uses data when you use our site, visit{' '}
                                    <a
                                        href="https://policies.google.com/technologies/partner-sites"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-600 hover:underline"
                                    >
                                        Google's Privacy & Terms
                                    </a>
                                    .
                                </p>

                                <h2 className="text-lg font-medium text-gray-900 mt-6 mb-3">4.2 Analytics</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We use <strong>Google Analytics</strong> and <strong>Microsoft Clarity</strong> to understand how visitors
                                    interact with our website. These services collect anonymized usage data including pages visited,
                                    time on page, and general location. This data helps us improve the site experience.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Data Security</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We implement appropriate technical and organizational security measures to protect your
                                    personal information from unauthorized access, alteration, disclosure, or destruction.
                                    However, no method of transmission over the Internet is 100% secure.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You have the right to:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Access and receive a copy of your personal data</li>
                                    <li>Request correction of inaccurate information</li>
                                    <li>Request deletion of your personal data</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Withdraw consent where applicable</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Third-Party Links</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Our website may contain links to third-party websites. We are not responsible for the
                                    privacy practices of these external sites. We encourage you to read their privacy policies.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    gadizone is not intended for children under 18 years of age. We do not knowingly collect
                                    personal information from children.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We may update this Privacy Policy from time to time. Changes will be posted on this page
                                    with an updated revision date.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    If you have questions about this Privacy Policy or your personal data, please contact us:
                                </p>
                                <p className="text-gray-700 mb-4">
                                    <strong>Email:</strong> Karim0beldaar@gmail.com<br />
                                    <strong>Website:</strong> www.gadizone.com
                                </p>
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    By using gadizone, you consent to our Privacy Policy and agree to its terms.
                                </p>
                            </div>
                        </div>
                    </PageSection>
                </PageContainer>
            </div>
            <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
            <Footer />
        </>
    )
}
