'use client';

import styles from './AddMoreModal.module.css';
import { useCart } from '../../context/CartContext';
import { ReactNode } from 'react';

interface Plan {
    id: number;
    title: string;
    price: number;
    description: string;
    detail: string;
    icon?: ReactNode; // Made optional to match context type, but component will render specific icons
    type: string;
    badge?: string;
}

// Renderable icons need to be defined here since they can't be stored in context
const getPlanIcon = (id: number) => {
    switch (id) {
        case 1: return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#16a34a' }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
        case 2: return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
        case 3: return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0891b2' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M16 3h5v5"></path><path d="M8 21v-5h-5"></path></svg>;
        case 4: return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d97706' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
        case 5: return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#db2777' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
        case 6: return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4f46e5' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
        case 7: return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9333ea' }}><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>;
        case 8: return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#7c3aed' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
        default: return null;
    }
};

// Same plans as Plans page
const allPlans: Plan[] = [
    {
        id: 1,
        title: "WhatsApp Consultation",
        price: 499,
        description: "Get personalized car recommendations via WhatsApp. Send us your requirements, and we'll analyze them to suggest the perfect vehicle—fast, reliable, and tailored just for you.",
        detail: "1 message within 2 working days",
        type: "basic"
    },
    {
        id: 2,
        title: "Call with an Auto-Expert",
        price: 699,
        description: "Connect one-on-one with our experts to discuss your needs, daily usage, and preferences—so you can choose the perfect car with complete confidence.",
        detail: "15-min call within 48 working hrs",
        type: "basic"
    },
    {
        id: 3,
        title: "2 Phone Calls",
        price: 999,
        description: "Perfect for first-time buyers or those without a shortlist. The first call helps you narrow down options, followed by test drives, and a second call to finalize your car and variant.",
        detail: "Two expert calls within 15 days",
        type: "basic"
    },
    {
        id: 4,
        title: "4 Phone Calls",
        price: 1299,
        description: "From shortlisting the right car to final delivery, get expert support at every step. Includes up to 4 phone calls with our auto experts.",
        detail: "Complete guidance till delivery",
        badge: "Most Preferred",
        type: "preferred"
    },
    {
        id: 5,
        title: "Express Call",
        price: 1499,
        description: "Get expert advice within 90 minutes of booking—no waiting 24-48 hours! Ideal for those making a same-day car purchase decision.",
        detail: "Urgent 1-on-1 advice within 90 mins",
        badge: "In a Hurry",
        type: "hurry"
    },
    {
        id: 6,
        title: "Senior Consultant",
        price: 1999,
        description: "Get expert car advice from professionals with 4+ years of industry experience. Benefit from in-depth knowledge and real-world insights.",
        detail: "Advice from 4+ years experienced Pros",
        type: "basic"
    },
    {
        id: 7,
        title: "Video Call with Rachit",
        price: 5999,
        description: "Get direct expert advice from Rachit Hirani, an automotive engineer and industry expert, to simplify your car-buying decision.",
        detail: "15-min exclusive video consultation",
        type: "premium"
    },
    {
        id: 8,
        title: "Video Call & Team",
        price: 6999,
        description: "15-min exclusive Video Call with Rachit and Two follow-ups with his team for comprehensive support.",
        detail: "Rachit's guidance + 2 Team follow-ups",
        type: "premium"
    }
];

interface AddMoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddMoreModal({ isOpen, onClose }: AddMoreModalProps) {
    const { cartItems, addToCart, removeFromCart } = useCart();

    if (!isOpen) return null;

    const isInCart = (planId: number) => {
        return cartItems.some(item => item.id === planId);
    };

    const handleToggle = (plan: Plan) => {
        if (isInCart(plan.id)) {
            removeFromCart(plan.id);
        } else {
            addToCart(plan);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Add More Plans</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Summary */}
                <div className={styles.cartSummary}>
                    <span className={styles.cartIcon}>🛒</span>
                    <span className={styles.cartText}>
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
                    </span>
                </div>

                {/* Plans List */}
                <div className={styles.plansList}>
                    {allPlans.map((plan) => {
                        const inCart = isInCart(plan.id);
                        return (
                            <div
                                key={plan.id}
                                className={`${styles.planCard} ${inCart ? styles.planCardAdded : ''}`}
                            >
                                {plan.badge && (
                                    <span className={`${styles.badge} ${plan.type === 'hurry' ? styles.badgeHurry : ''} ${plan.type === 'preferred' ? styles.badgePreferred : ''}`}>
                                        {plan.badge}
                                    </span>
                                )}

                                <div className={styles.planHeader}>
                                    <div className={styles.planIcon}>{getPlanIcon(plan.id)}</div>
                                    <span className={styles.planPrice}>₹{plan.price}</span>
                                </div>

                                <h3 className={styles.planTitle}>{plan.title}</h3>
                                <div className={styles.detailBox}>{plan.detail}</div>
                                <p className={styles.planDesc}>{plan.description}</p>

                                <button
                                    onClick={() => handleToggle(plan)}
                                    className={`${styles.actionBtn} ${inCart ? styles.removeBtn : styles.addBtn}`}
                                >
                                    {inCart ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Added
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Done Button */}
                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.doneBtn}>
                        Done
                        <span className={styles.doneAmount}>
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • ₹{cartItems.reduce((sum, item) => sum + item.price, 0)}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
