'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { plans } from '@/app/data/plans';

interface Plan {
    id: number;
    title: string;
    price: number;
    description: string;
    detail: string;
    icon?: ReactNode;
    type: string;
    badge?: string;
}

interface UserInfo {
    name: string;
    phone: string;
    email: string;
}

interface CartContextType {
    cartItems: Plan[];
    couponCode: string;
    discount: number;
    userInfo: UserInfo | null;
    addToCart: (plan: Plan) => void;
    removeFromCart: (planId: number) => void;
    clearCart: () => void;
    applyCoupon: (code: string) => boolean;
    clearCoupon: () => void;
    getSubtotal: () => number;
    getTotal: () => number;
    isLoaded: boolean;
    setUserInfo: (info: UserInfo) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Storage keys
const CART_STORAGE_KEY = 'car_consultancy_cart';
const USER_STORAGE_KEY = 'car_consultancy_user';
const COUPON_STORAGE_KEY = 'car_consultancy_coupon';

// Available coupons
const COUPONS: { [key: string]: number } = {
    'SAVE10': 10,
    'EXPERT20': 20,
    'FIRST50': 50,
    'NEWYEAR': 100,
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<Plan[]>([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [userInfo, setUserInfoState] = useState<UserInfo | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // Load cart items
                const savedCart = localStorage.getItem(CART_STORAGE_KEY);
                if (savedCart) {
                    const parsed = JSON.parse(savedCart);
                    // Remove icon field (can't serialize ReactNode)
                    setCartItems(parsed.map((item: Plan) => ({ ...item, icon: undefined })));
                }

                // Load user info
                const savedUser = localStorage.getItem(USER_STORAGE_KEY);
                if (savedUser) {
                    setUserInfoState(JSON.parse(savedUser));
                }

                // Load coupon
                const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
                if (savedCoupon) {
                    const { code, discountValue } = JSON.parse(savedCoupon);
                    setCouponCode(code);
                    setDiscount(discountValue);
                }
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
            setIsLoaded(true);
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined') {
            // Save without icon (can't serialize ReactNode)
            const cartToSave = cartItems.map(({ icon, ...rest }) => rest);
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartToSave));
        }
    }, [cartItems, isLoaded]);

    // Save user info to localStorage
    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined' && userInfo) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo));
        }
    }, [userInfo, isLoaded]);

    // Save coupon to localStorage
    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined') {
            if (couponCode) {
                localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify({
                    code: couponCode,
                    discountValue: discount
                }));
            } else {
                localStorage.removeItem(COUPON_STORAGE_KEY);
            }
        }
    }, [couponCode, discount, isLoaded]);

    const addToCart = (plan: Plan) => {
        const exists = cartItems.some(item => item.id === plan.id);
        if (!exists) {
            setCartItems(prev => [...prev, plan]);
        }
    };

    const removeFromCart = (planId: number) => {
        setCartItems(prev => prev.filter(item => item.id !== planId));
    };

    const clearCart = () => {
        setCartItems([]);
        setCouponCode('');
        setDiscount(0);
        // Also clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CART_STORAGE_KEY);
            localStorage.removeItem(COUPON_STORAGE_KEY);
        }
    };

    const applyCoupon = (code: string): boolean => {
        const upperCode = code.toUpperCase();
        if (COUPONS[upperCode]) {
            setCouponCode(upperCode);
            setDiscount(COUPONS[upperCode]);
            return true;
        }
        return false;
    };

    const clearCoupon = () => {
        setCouponCode('');
        setDiscount(0);
    };

    const getSubtotal = () => {
        return cartItems.reduce((sum, item) => {
            const livePlan = plans.find((p: any) => p.id === item.id);
            return sum + (livePlan?.price || item.price);
        }, 0);
    };

    const getTotal = () => {
        const subtotal = getSubtotal();
        return Math.max(0, subtotal - discount);
    };

    const setUserInfo = (info: UserInfo) => {
        console.log('CartContext: Setting userInfo', info);
        setUserInfoState(info);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            couponCode,
            discount,
            userInfo,
            addToCart,
            removeFromCart,
            clearCart,
            applyCoupon,
            clearCoupon,
            getSubtotal,
            getTotal,
            isLoaded,
            setUserInfo,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
