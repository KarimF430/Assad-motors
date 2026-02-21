'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import ReviewsBlock from './ReviewsSection';
import FAQSection from './FAQSection';
import ConsultationModal from './ConsultationModal';
import FeedbackForm from './components/FeedbackForm';
import ExitIntentModal from './components/ExitIntentModal';

import dynamic from 'next/dynamic';
const Footer = dynamic(() => import('@/components/Footer'), {
    loading: () => <div className="h-96 bg-gray-900 animate-pulse" />
});
import CarsByBudget from '@/components/home/CarsByBudget';
import BrandSection from '@/components/home/BrandSection';
import PageSection from '@/components/common/PageSection';

// Define Prop Types for the data passed from Server Component
interface CarExpertClientProps {
    allCars: any[];
    brands: any[];
}

export default function CarExpertClient({ allCars, brands }: CarExpertClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [hasShownExitModal, setHasShownExitModal] = useState(false);

    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShownExitModal && !isModalOpen) {
                setShowExitModal(true);
                setHasShownExitModal(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasShownExitModal, isModalOpen]);

    return (
        <main className={styles.page}>
            {/* HERO SECTION */}
            <section className={styles.hero}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroContent}>
                        <div className={styles.trustIndicators}>
                            <div className={styles.ratingBadge}>
                                <div className={styles.ratingStars}>
                                    <span className={styles.ratingValue}>2024</span>
                                </div>
                                <span className={styles.ratingLabel}>Helping Indian<br />buyers since</span>
                            </div>
                            <div className={styles.trustBadge}>
                                <div className={styles.trustIcon}>✓</div>
                                <span className={styles.trustLabel}>Independent,<br />unbiased advice</span>
                            </div>
                        </div>

                        <h1 className={styles.heroTitle}>
                            Best Car Buying Consultant in India
                        </h1>
                        <p className={styles.heroSubtitle}>
                            <strong>Stop guessing. Start driving with confidence.</strong> Get expert, unbiased car buying advice for new and used cars.
                            We save you money, time, and future regrets by finding the perfect car for your needs and budget.
                        </p>

                        <button onClick={openModal} className={styles.ctaPrimary}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                            </svg>
                            Talk to Our Experts
                        </button>
                    </div>



                </div>
            </section>

            {/* SECTION 2: WHAT WE OFFER (Ditto Style Layout) */}
            <section className={styles.offers}>
                <div className={styles.sectionContainer}>
                    <div className={styles.offersLayout}>
                        {/* Sidebar Header */}
                        <div className={styles.offersHeader}>
                            <span className={styles.offersLabel}>Why Choose Us</span>
                            <h2 className={styles.offersTitle}>What YouTube Reviews Won&apos;t Tell You About Buying Cars</h2>
                            <p className={styles.offersSubtitle}>
                                Dealerships push inventory. Influencers get paid. We give you honest, zero-commission car buying advice for new and used cars.
                            </p>
                        </div>

                        {/* Grid */}
                        <div className={styles.offerGrid}>
                            <div className={styles.offerCard}>
                                <div className={styles.offerIconWrapper}>
                                    <div className={`${styles.offerIcon} ${styles.iconBlue}`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={styles.offerTitle}>Smart Analysis</h3>
                                <p className={styles.offerDesc}>We deep dive into your usage patterns, family needs, and budget to shortlist the absolute best options for you.</p>
                            </div>
                            <div className={styles.offerCard}>
                                <div className={styles.offerIconWrapper}>
                                    <div className={`${styles.offerIcon} ${styles.iconGreen}`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                            <circle cx="7" cy="17" r="2" />
                                            <path d="M9 17h6" />
                                            <circle cx="17" cy="17" r="2" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={styles.offerTitle}>Expert Test Drives</h3>
                                <p className={styles.offerDesc}>We tell you exactly what to check during a test drive so you don't miss critical flaws or comfort issues.</p>
                            </div>
                            <div className={styles.offerCard}>
                                <div className={styles.offerIconWrapper}>
                                    <div className={`${styles.offerIcon} ${styles.iconAmber}`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={styles.offerTitle}>Right Variant Guarantee</h3>
                                <p className={styles.offerDesc}>Don't overpay for features you won't use. We help you pick the true 'Value for Money' variant.</p>
                            </div>
                            <div className={styles.offerCard}>
                                <div className={styles.offerIconWrapper}>
                                    <div className={`${styles.offerIcon} ${styles.iconRed}`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="1" x2="12" y2="23"></line>
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={styles.offerTitle}>Best Price Check</h3>
                                <p className={styles.offerDesc}>We audit dealer quotes to spot hidden charges, insurance markups, and help you get the fair OTR price.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: WHAT WE RESOLVE (Problems vs Solutions) */}
            <section className={styles.resolve}>
                <div className={styles.resolveGrid}>
                    {/* Left: Problems */}
                    <div className={styles.resolveContent}>
                        <h2>Why do 70% of car buyers regret their purchase?</h2>
                        <p>The car buying process is overwhelming. Dealerships often prioritize their inventory over your actual needs.</p>

                        <ul className={styles.problemList}>
                            <li>
                                <div className={styles.problemIcon}>✖</div>
                                Confused by too many options & variants
                            </li>
                            <li>
                                <div className={styles.problemIcon}>✖</div>
                                Mislead by biased YouTube reviews
                            </li>
                            <li>
                                <div className={styles.problemIcon}>✖</div>
                                Overpaying for unnecessary accessories
                            </li>
                        </ul>

                        <div className={styles.solutionHeading}>
                            <span style={{ fontSize: '20px' }}>💡</span> The Solution:
                        </div>
                        <ul className={styles.solutionList}>
                            <li>
                                <div className={styles.solutionIcon}>✓</div>
                                Unbiased, engineering-backed advice
                            </li>
                            <li>
                                <div className={styles.solutionIcon}>✓</div>
                                Clear clarity on "Need vs Want" features
                            </li>
                        </ul>
                    </div>

                    {/* Right: Steps / Process */}
                    <div className={styles.stepsCard}>
                        <div className={styles.stepsTitle}>How It Works</div>

                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <div className={styles.stepContent}>
                                <h4>Book Consultation</h4>
                                <p>Select a plan that suits your needs.</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <div className={styles.stepContent}>
                                <h4>Discuss Requirements</h4>
                                <p>Connect with our expert to discuss your needs.</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <div className={styles.stepContent}>
                                <h4>Get Recommendation</h4>
                                <p>Receive a tailored list of cars & variants.</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>4</div>
                            <div className={styles.stepContent}>
                                <h4>Purchase with Confidence</h4>
                                <p>Buy the right car at the right price.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.resolveCta}>
                    <button onClick={openModal} className={styles.ctaPrimary}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                        </svg>
                        Talk to Our Experts
                    </button>
                </div>
            </section>



            {/* Cars By Budget Section */}
            <PageSection background="gray">
                <CarsByBudget allCars={allCars} />
            </PageSection>

            {/* Popular Brands Section */}
            <PageSection background="white">
                <BrandSection initialBrands={brands} />
            </PageSection>

            {/* REVIEWS */}
            <section className={styles.reviews}>
                <ReviewsBlock onBookCall={openModal} />
            </section>

            {/* FAQ */}
            <FAQSection />

            {/* Feedback Form */}
            <FeedbackForm />

            {/* Sticky Bottom Bar */}



            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <ExitIntentModal
                isOpen={showExitModal}
                onStay={() => setShowExitModal(false)}
                onLeave={() => setShowExitModal(false)}
                isExpertView={false}
            />

            {/* Global Footer */}
            <Footer />
        </main>
    );
}
