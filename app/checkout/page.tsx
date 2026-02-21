'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './checkout.module.css';
import { useCart } from '@/app/context/CartContext';
import { plans } from '@/app/data/plans';
import { useAuth } from '@/lib/auth-context';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const Footer = dynamic(() => import('@/components/Footer'), {
    loading: () => <div className="h-96 bg-gray-900 animate-pulse" />
});

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { cartItems, getTotal, userInfo, setUserInfo, isLoaded, clearCart } = useCart();
    const [isRazorpaySDKLoaded, setIsRazorpaySDKLoaded] = useState(false);

    const loadRazorpay = () => {
        return new Promise<boolean>((resolve) => {
            if (typeof window !== 'undefined' && (window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                console.log('Razorpay SDK loaded via dynamic fallback');
                resolve(true);
            };
            script.onerror = () => {
                console.error('Razorpay SDK failed to load via dynamic fallback');
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    // Load Razorpay SDK on mount
    useEffect(() => {
        const loadScript = async () => {
            const ready = await loadRazorpay();
            if (ready) setIsRazorpaySDKLoaded(true);
        };
        loadScript();
    }, []);

    const [formData, setFormData] = useState({
        name: userInfo?.name || (user ? `${user.firstName} ${user.lastName}` : '') || '',
        phone: userInfo?.phone || user?.phone || '',
        email: userInfo?.email || user?.email || ''
    });

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('online');


    // Redirect if cart is empty after loading
    useEffect(() => {
        if (isLoaded && cartItems.length === 0) {
            router.push('/car-expert');
        }
    }, [isLoaded, cartItems, router]);

    // Update form data if userInfo or user changes
    useEffect(() => {
        if (userInfo || user) {
            setFormData(prev => ({
                name: prev.name || userInfo?.name || (user ? `${user.firstName} ${user.lastName}` : ''),
                phone: prev.phone || userInfo?.phone || user?.phone || '',
                email: prev.email || userInfo?.email || user?.email || ''
            }));
        }
    }, [userInfo, user]);

    if (!isLoaded) {
        return <div className={styles.container}><div className="animate-pulse h-64 bg-gray-100 rounded-xl" /></div>;
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Basic Validation
            if (!formData.name || !formData.phone || !formData.email) {
                alert('Please fill in all details');
                setLoading(false);
                return;
            }

            // 2. Save User Info to Context
            setUserInfo(formData);

            // 3. Razorpay Disabled (Temporary)
            alert('Online payments are currently disabled. Please try again later or contact support.');
            setLoading(false);
            return;

            /* RAZORPAY DISABLED
            const amount = getTotal();
            const orderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });

            const orderData = await orderResponse.json();
            if (!orderData.success) {
                throw new Error(orderData.error || 'Failed to create Razorpay order');
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'gadizone',
                description: cartItems.map(item => item.title).join(', '),
                image: '/new-gz-logo.png',
                order_id: orderData.order_id,
                // Standard integration: Payment methods are controlled by Razorpay Dashboard settings
                // Ensure UPI is enabled in Razorpay Dashboard > Settings > Payment Methods
                handler: async function (response: any) {
                    try {
                        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                leadData: {
                                    name: formData.name,
                                    phone: formData.phone,
                                    email: formData.email,
                                    source: 'checkout'
                                },
                                planDetails: cartItems.map(item => ({
                                    id: item.id,
                                    title: item.title,
                                    price: item.price
                                })),
                                amount: amount
                            })
                        });

                        const verifyData = await verifyResponse.json();
                        if (verifyData.success) {
                            // Clear cart and redirect to success
                            try {
                                clearCart();
                            } catch (e) {
                                console.error('Error clearing cart:', e);
                            }
                            router.push('/checkout/success');
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        alert('Error verifying payment.');
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#f97316', // Primary Orange
                },
            };
            */


            // 3. Ensure Razorpay is loaded (Robust check)
            /* 
            if (!(window as any).Razorpay && !isRazorpaySDKLoaded) {
                const retryLoad = await loadRazorpay();
                if (!retryLoad) {
                    alert('CRITICAL: Razorpay SDK could not be loaded. Please check your internet and try again.');
                    setLoading(false);
                    return;
                }
            }

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert(response.error.description);
                console.error('Payment failed:', response.error);
                setLoading(false);
            });
            rzp.on('modal.dismiss', function () {
                console.log('Razorpay modal dismissed');
                setLoading(false);
            });
            rzp.open();
            setLoading(false);
            */

        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <button onClick={() => router.back()} className={styles.backBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className={styles.title}>Secure Checkout</h1>
                </div>

                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    {/* Left Column: Form & Slot */}
                    <div className={styles.leftColumn}>
                        {/* User Details */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.stepNum}>1</span>
                                Your Details
                            </h2>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputField}>
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className={styles.inputField}>
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="98765 43210"
                                        pattern="[0-9]{10}"
                                        title="10 digit mobile number"
                                        required
                                    />
                                </div>
                                <div className={styles.inputField}>
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Payment Method */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.stepNum}>2</span>
                                Payment Method
                            </h2>
                            <div className={styles.paymentMethods}>
                                <label className={`${styles.paymentOption} ${paymentMethod === 'online' ? styles.active : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={() => setPaymentMethod('online')}
                                    />
                                    <span className={styles.radioCustom}></span>
                                    <div className={styles.paymentContent}>
                                        <span className={styles.methodName}>Pay Online</span>
                                        <span className={styles.methodDesc}>UPI, Credit/Debit Card, Netbanking</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (Shows last on mobile naturally) */}
                    <div className={styles.rightColumn}>
                        <div className={styles.section}>
                            <h3 className={styles.summaryTitle}>Order Summary</h3>

                            <div className={styles.cartItemsList}>
                                {cartItems.map((item) => {
                                    const livePlan = plans.find((p: any) => p.id === item.id);
                                    return (
                                        <div key={item.id} className={styles.summaryItem}>
                                            <div className={styles.itemName}>{item.title}</div>
                                            <div className={styles.itemDetail}>{item.detail}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.totalRow}>
                                <span>Total Amount</span>
                                <span className={styles.totalAmount}>₹{getTotal()}</span>
                            </div>

                            <button type="submit" className={styles.payBtn} disabled={loading}>
                                {loading ? 'Processing...' : `Pay ₹${getTotal()}`}
                            </button>

                            <p className={styles.trustText}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                Secure Payment via Razorpay
                            </p>
                        </div>
                    </div>
                </form>

            </div>
            <Footer />
        </>
    );
}
