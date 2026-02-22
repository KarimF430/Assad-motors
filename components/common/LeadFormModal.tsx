'use client';

import { useState } from 'react';
import styles from './LeadFormModal.module.css';
import { X, Check } from 'lucide-react';

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    carName: string;
}

export default function LeadFormModal({ isOpen, onClose, carName }: LeadFormModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/consultation-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    city: formData.city,
                    carInterest: carName,
                    message: `Interested in Test Drive for ${carName}`,
                    source: 'test-drive-popup'
                })
            });

            if (!response.ok) throw new Error('Failed to submit');

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({ name: '', phone: '', city: '' });
            }, 3000);
        } catch (error) {
            console.error('Error submitting lead:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn}>
                    <X className="w-6 h-6" />
                </button>

                {isSuccess ? (
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3>Thank You!</h3>
                        <p>We have received your request. Our team will contact you shortly to schedule your test drive.</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.header}>
                            <h2>Book a Test Drive</h2>
                            <p>Get behind the wheel of the {carName}</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+91 98765 43210"
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit phone number"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>City</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your city"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>

                            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                                {isSubmitting ? 'Submitting...' : 'Book Now'}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3 leading-tight">
                                By proceeding ahead you agree to Gadizone <a href="/visitor-agreement" target="_blank" className="text-[#1c144a] hover:underline">Visitor Agreement</a>.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
