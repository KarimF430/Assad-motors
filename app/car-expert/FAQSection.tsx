'use client';

import { useState } from 'react';
import styles from './page.module.css';

const faqs = [
    {
        question: "How much can I expect to save?",
        answer: "Our clients typically save between ₹30,000 to ₹1.5 Lakhs. We achieve this by identifying unnecessary dealer add-ons, insurance markups, and leveraging our market data to negotiate the \"real\" best price for you."
    },
    {
        question: "Do you represent any specific car brand?",
        answer: "No. We are 100% independent and work for **you**, not the dealership. Our advice is completely unbiased and based solely on your needs and budget."
    },
    {
        question: "Can you help if I've already booked a car?",
        answer: "Absolutely! We can still help you with the Pre-Delivery Inspection (PDI) to ensure your car is defect-free before registration, and verify if you're getting the best possible deal on insurance and accessories."
    },
    {
        question: "Do you deal with used cars?",
        answer: "Yes. We provide expert evaluation services for used cars, including mechanical inspection, service history verification, and fair price estimation to protect you from buying a lemon."
    },
    {
        question: "What happens on the consultation call?",
        answer: "It's a focused 1-on-1 session where we analyze your requirements, answer all your questions, and create a tailored roadmap for your car purchase. No sales pitches, just pure expert advice."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.faq}>
            <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTag}>FAQ</span>
                    <h2 className={styles.sectionTitle}>Common Questions</h2>
                    <p className={styles.sectionSubtitle}>
                        Everything you need to know about our consultancy service.
                    </p>
                </div>

                <div className={styles.faqContainer}>
                    <div className={styles.faqList}>
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={styles.faqItem}
                                data-state={openIndex === index ? 'open' : 'closed'}
                                onClick={() => toggleFAQ(index)}
                            >
                                <div className={styles.faqQuestionHeader}>
                                    <h4 className={styles.faqQuestion}>{faq.question}</h4>
                                    <div className={styles.faqIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19" className={styles.verticalLine}></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </div>
                                </div>
                                <div
                                    className={styles.faqAnswerWrapper}
                                    style={{
                                        maxHeight: openIndex === index ? '200px' : '0px',
                                        opacity: openIndex === index ? 1 : 0
                                    }}
                                >
                                    <p className={styles.faqAnswer} dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
