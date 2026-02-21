'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './cart.module.css';
import { useCart } from '@/app/context/CartContext';
import { plans } from '@/app/data/plans';
import ExitIntentModal from '../car-expert/components/ExitIntentModal';

import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'), {
    loading: () => <div className="h-96 bg-gray-900 animate-pulse" />
});

export default function CartPage() {
    const router = useRouter();
    const { cartItems, couponCode, discount, applyCoupon, clearCoupon, getSubtotal, getTotal, removeFromCart, isLoaded } = useCart();
    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(false);



    // Exit Intent
    const [showExitModal, setShowExitModal] = useState(false);
    const hasInitializedHistory = useRef(false);
    const isLeavingIntentionally = useRef(false);

    // Initialize history state
    useEffect(() => {
        if (!hasInitializedHistory.current && typeof window !== 'undefined') {
            window.history.pushState({ page: 'cart' }, '');
            hasInitializedHistory.current = true;
        }
    }, []);

    // Handle back button
    useEffect(() => {
        const handlePopState = () => {
            if (isLeavingIntentionally.current) {
                isLeavingIntentionally.current = false;
                return;
            }
            setShowExitModal(true);
            window.history.pushState({ page: 'cart' }, '');
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleExitStay = () => {
        setShowExitModal(false);
    };

    const handleExitLeave = () => {
        setShowExitModal(false);
        isLeavingIntentionally.current = true;
        router.push('/car-expert');
    };

    const handleApplyCoupon = () => {
        setCouponError('');
        setCouponSuccess(false);
        if (applyCoupon(couponInput)) {
            setCouponSuccess(true);
            setCouponInput('');
        } else {
            setCouponError('Invalid coupon code');
        }
    };

    const handleRemoveCoupon = () => {
        clearCoupon();
        setCouponSuccess(false);
    };

    // Redirect to plans if cart is empty
    if (isLoaded && cartItems.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <div className={styles.emptyIcon}>📂</div>
                <h2>Your selection is empty</h2>
                <p>Expert guidance is just a click away. Select a service to start your journey with absolute confidence.</p>
                <Link href="/car-expert" className={styles.browseBtn}>
                    Explore Expert Services
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <button onClick={() => setShowExitModal(true)} className={styles.backBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className={styles.title}>Secure Your Consultation</h1>
                    <span className={styles.cartCount}>{cartItems.length} {cartItems.length === 1 ? 'Service Selected' : 'Services Selected'}</span>
                </div>

                {/* Savings Banner */}
                {discount > 0 && (
                    <div className={styles.savingsBanner}>
                        <span className={styles.savingsIcon}>⚡</span>
                        <span><strong>Priority Discount UNLOCKED:</strong> You've saved ₹{discount} on this booking!</span>
                    </div>
                )}

                {/* Plan Cards - Multiple */}
                {cartItems.map((item) => {
                    // Look up full plan data to get the non-serialized icon
                    const fullPlan = plans.find(p => p.id === item.id) || item;

                    return (
                        <div key={item.id} className={styles.planCard}>
                            <div className={styles.planCardTop}>
                                <div className={styles.planIconWrapper}>
                                    {fullPlan.icon}
                                </div>
                                <div className={styles.planPriceWrapper}>
                                    <span className={styles.currency}>₹</span>
                                    {fullPlan.price}
                                </div>
                            </div>

                            <h3 className={styles.planTitle}>{item.title}</h3>

                            {item.detail && (
                                <div className={styles.planBadge}>
                                    {item.detail}
                                </div>
                            )}

                            <p className={styles.planDesc}>{item.description}</p>

                            <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>
                                Remove Selection
                            </button>
                        </div>
                    );
                })}



                {/* Coupon Section */}
                <div className={styles.couponSection}>
                    <h3 className={styles.sectionTitle}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        Apply Exclusive Coupon
                    </h3>

                    {couponCode ? (
                        <div className={styles.appliedCoupon}>
                            <div className={styles.appliedCouponInfo}>
                                <span className={styles.couponBadge}>{couponCode}</span>
                                <span className={styles.couponSaving}>₹{discount} OFF (Savings Applied)</span>
                            </div>
                            <button onClick={handleRemoveCoupon} className={styles.removeCouponBtn}>
                                Change
                            </button>
                        </div>
                    ) : (
                        <div className={styles.couponInputWrapper}>
                            <input
                                type="text"
                                placeholder="PROMO CODE"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                className={styles.couponInput}
                            />
                            <button onClick={handleApplyCoupon} className={styles.applyBtn}>
                                Verify
                            </button>
                        </div>
                    )}

                    {couponError && <p className={styles.couponError}>{couponError}</p>}
                    {couponSuccess && <p className={styles.couponSuccessMsg}>Offer successfully activated!</p>}

                    <div className={styles.availableCoupons}>
                        <p className={styles.availableTitle}>Exclusive Offers for You:</p>
                        <div className={styles.couponList}>
                            <button onClick={() => setCouponInput('SAVE10')} className={styles.couponTag}>SAVE10</button>
                            <button onClick={() => setCouponInput('EXPERT20')} className={styles.couponTag}>EXPERT20</button>
                            <button onClick={() => setCouponInput('FIRST50')} className={styles.couponTag}>FIRST50</button>
                        </div>
                    </div>
                </div>

                {/* Bill Summary */}
                <div className={styles.billSummary}>
                    <h3 className={styles.sectionTitle}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        Order Breakdown
                    </h3>

                    <div className={styles.billRow}>
                        <span>Consultation Value</span>
                        <span>₹{getSubtotal()}</span>
                    </div>

                    {discount > 0 && (
                        <div className={`${styles.billRow} ${styles.discountRow}`}>
                            <span>Expert Privilege Discount</span>
                            <span className={styles.discountAmount}>-₹{discount}</span>
                        </div>
                    )}

                    <div className={styles.billDivider}></div>

                    <div className={`${styles.billRow} ${styles.totalRow}`}>
                        <span>Grand Total</span>
                        <span className={styles.totalAmount}>₹{getTotal()}</span>
                    </div>

                    <div className={styles.billDivider}></div>

                    <Link href="/checkout" className={styles.proceedBtn}>
                        Confirm & Schedule Now
                        <span className={styles.proceedAmount}>₹{getTotal()}</span>
                    </Link>
                </div>

            </div>

            <Footer />

            <ExitIntentModal
                isOpen={showExitModal}
                onStay={handleExitStay}
                onLeave={handleExitLeave}
                isExpertView={false}
            />


        </>
    );
}
