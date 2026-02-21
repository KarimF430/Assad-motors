'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ConsultationModal.module.css';
import { useCart } from '@/app/context/CartContext';
import { plans } from '@/app/data/plans';

interface ShortlistEntry {
    product: string;
    whyThis: string;
    whyNot: string;
    comments: string;
}

interface FormData {
    fullName: string;
    email: string;
    whatsapp: string;
    city: string;
    budget: string;
    familySize: string;
    topPriority: string;
    car1: string;
    car2: string;
    car3: string;
    comments: string;
}

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const emptyShortlist = { product: '', whyThis: '', whyNot: '', comments: '' };

const STORAGE_KEY = 'consultationFormData';

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
    const router = useRouter();
    const { addToCart, setUserInfo } = useCart();
    const [step, setStep] = useState(1);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        fullName: '', email: '', whatsapp: '', city: '',
        budget: '', familySize: '', topPriority: '',
        car1: '', car2: '', car3: '',
        comments: ''
    });

    // Load saved form data from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && !isInitialized) {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setFormData(parsed);
                } catch (e) {
                    console.error('Failed to parse saved form data:', e);
                }
            }
            setIsInitialized(true);
        }
    }, [isInitialized]);

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, isInitialized]);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.whatsapp) {
                alert('Please fill in at least your Name and WhatsApp number.');
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            // Map the granular form data to the ConsultationLead schema
            // Schema: name, phone, email, city, budget, carInterest, plannedPurchaseDate, message

            const carShortlist = [formData.car1, formData.car2, formData.car3]
                .filter(Boolean)
                .join(', ');

            const message = `
Budget: ${formData.budget}
Family Size: ${formData.familySize}
Top Priority: ${formData.topPriority}
Shortlisted Cars: ${carShortlist}
Comments: ${formData.comments}
            `.trim();

            const payload = {
                name: formData.fullName,
                phone: formData.whatsapp,
                email: formData.email,
                city: formData.city,
                budget: formData.budget,
                carInterest: carShortlist || 'Not specified',
                plannedPurchaseDate: new Date().toISOString(),
                message: message
            };

            const response = await fetch('/api/consultation-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to submit consultation request');
            }

            // Success handling
            console.log('ConsultationModal: Submitting user info to context', {
                name: formData.fullName,
                phone: formData.whatsapp,
                email: formData.email
            });
            setUserInfo({
                name: formData.fullName,
                phone: formData.whatsapp,
                email: formData.email
            });

            localStorage.removeItem(STORAGE_KEY);
            onClose();
            // alert('Request Received! We will call you shortly.'); // Removed alert

            // Add standard plan (ID 2) to cart
            const standardPlan = plans.find(p => p.id === 2);
            if (standardPlan) {
                addToCart(standardPlan);
            }

            // Redirect to cart page
            router.push('/cart');
        } catch (error) {
            console.error('Submission failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const budgetOptions = ['Under 10 Lakhs', '10-15 Lakhs', '15-20 Lakhs', '20-30 Lakhs', '30 Lakhs+', 'Flexible'];
    const familyOptions = ['1-2 People', '3-4 People', '5+ People'];
    const priorities = ['', 'Safety', 'Mileage', 'Performance', 'Comfort', 'Features', 'Resale Value', 'Brand Image', 'After Sales'];

    const progress = (step / 3) * 100;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn} title="Close" aria-label="Close modal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Let's find your perfect car</h2>
                    <p className={styles.subtitle}>
                        {step === 1 && "Start with your details so we can reach you."}
                        {step === 2 && "Tell us your budget and what matters most."}
                        {step === 3 && "Which cars are you currently considering?"}
                    </p>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className={styles.content}>
                    {step === 1 && (
                        <div>
                            <h3 className={styles.stepTitle}>Your Details</h3>
                            <div className={styles.gridTwoCol}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Full Name <span className={styles.required}>*</span></label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <input
                                            className={styles.input}
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={e => handleChange('fullName', e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>WhatsApp Number <span className={styles.required}>*</span></label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        <input
                                            className={styles.input}
                                            placeholder="+91 98765 43210"
                                            value={formData.whatsapp}
                                            onChange={e => handleChange('whatsapp', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    <input
                                        className={styles.input}
                                        placeholder="john@example.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>City</label>
                                <div className={styles.inputWrapper}>
                                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    <input
                                        className={styles.input}
                                        placeholder="Mumbai"
                                        value={formData.city}
                                        onChange={e => handleChange('city', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} style={{ marginBottom: '12px', display: 'block' }}>Car Buying Budget</label>
                                <div className={styles.chipGrid}>
                                    {budgetOptions.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            className={`${styles.chip} ${formData.budget === opt ? styles.chipSelected : ''}`}
                                            onClick={() => handleChange('budget', opt)}
                                            aria-label={`Select budget ${opt}`}
                                            aria-pressed={formData.budget === opt}
                                        >
                                            {/* Icon could go here if needed */}
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label} style={{ marginBottom: '12px', display: 'block' }}>Family Size</label>
                                <div className={styles.chipGrid}>
                                    {familyOptions.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            className={`${styles.chip} ${formData.familySize === opt ? styles.chipSelected : ''}`}
                                            onClick={() => handleChange('familySize', opt)}
                                            aria-label={`Select family size ${opt}`}
                                            aria-pressed={formData.familySize === opt}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <h3 className={styles.stepTitle} style={{ marginTop: '30px' }}>Your Priorities</h3>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>What's your top priority? (Select one)</label>
                                <div className={styles.chipGrid}>
                                    {priorities.filter(Boolean).map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            className={`${styles.chip} ${formData.topPriority === p ? styles.chipSelected : ''}`}
                                            onClick={() => handleChange('topPriority', p)}
                                            aria-label={`Select priority ${p}`}
                                            aria-pressed={formData.topPriority === p}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className={styles.stepTitle}>Your Shortlist</h3>
                            <p className={styles.subtitle} style={{ marginBottom: '20px' }}>Name up to 3 cars you are currently considering.</p>

                            <div className={styles.shortlistCompact}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Car Choice 1</label>
                                    <input className={styles.input} style={{ paddingLeft: '14px' }} placeholder="e.g. Creta" value={formData.car1} onChange={e => handleChange('car1', e.target.value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Car Choice 2</label>
                                    <input className={styles.input} style={{ paddingLeft: '14px' }} placeholder="e.g. Nexon" value={formData.car2} onChange={e => handleChange('car2', e.target.value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Car Choice 3</label>
                                    <input className={styles.input} style={{ paddingLeft: '14px' }} placeholder="e.g. Seltos" value={formData.car3} onChange={e => handleChange('car3', e.target.value)} />
                                </div>
                            </div>

                            <div className={styles.inputGroup} style={{ marginTop: '20px' }}>
                                <label className={styles.label}>Any specific doubts or questions?</label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Write your message here..."
                                    value={formData.comments}
                                    onChange={e => handleChange('comments', e.target.value)}
                                />
                            </div>

                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    {step > 1 && (
                        <button onClick={handleBack} className={styles.backBtn}>Back</button>
                    )}
                    {step < 3 ? (
                        <button onClick={handleNext} className={styles.nextBtn}>
                            Next Step
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className={styles.submitBtn} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'See Plans & Pricing'}
                            {!isSubmitting && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
