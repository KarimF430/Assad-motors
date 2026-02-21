import React from 'react';

export const plans = [
    {
        id: 1,
        title: "Smart WhatsApp Consult",
        price: 499,
        description: "Zero research, total clarity. Our experts analyze your needs and deliver a hand-picked list of top-tier car recommendations directly to your WhatsApp. Fast, precise, and built for your unique lifestyle.",
        detail: "Digital Expert Report • 48h",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#075e54" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        ),
        type: "basic"
    },
    {
        id: 2,
        title: "Expert Choice Session",
        price: 499,
        description: "Stop second-guessing. Unlock a one-on-one session to stress-test your shortlist, decode technical jargon, and finalize the right car with absolute certainty and zero dealership pressure.",
        detail: "15-min Precision Call • 48h",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        ),
        type: "basic"
    },
    {
        id: 3,
        title: "Pro Decision Partner",
        price: 999,
        description: "From shortlisting to final choice. Get a focused strategy call to narrow your options, followed by post-test drive analysis to confirm your variant and secure the best possible deal.",
        detail: "2 Strategy Calls • 15 Days",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M16 3h5v5"></path><path d="M8 21v-5h-5"></path></svg>
        ),
        type: "basic"
    },
    {
        id: 4,
        title: "Buying Concierge Plus",
        price: 1299,
        description: "The gold standard of car buying. We act as your personal advocate from the first spark of interest to taking the keys, handling every confusion and technical detail so you drive home in total triumph.",
        detail: "Full Guidance till Delivery",
        badge: "Most Preferred",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        ),
        type: "preferred"
    },
    {
        id: 5,
        title: "Emergency Expert Call",
        price: 1499,
        description: "When every minute counts. At the dealership and need an instant, neutral verify before signing the check? Get our senior-most advice on your desk within 90 minutes. Don't risk a costly mistake.",
        detail: "90-Min Priority Response",
        badge: "In a Hurry",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        ),
        type: "hurry"
    },
    {
        id: 6,
        title: "Senior Industry Master",
        price: 1999,
        description: "Tap into veteran industry wisdom. Get clinical analysis on build quality, resale value, and long-term reliability from pros who have reviewed hundreds of cars and seen every dealership gimmick.",
        detail: "4+ Year Experienced Pro",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        ),
        type: "basic"
    },
    {
        id: 7,
        title: "Exclusive Audit with Rachit",
        price: 5999,
        description: "Elite consultation with Rachit Hirani. Have an automotive engineer personally evaluate your choices, understand the hidden engineering nuances, and make an investment-grade decision that lasts.",
        detail: "1-on-1 Premium Video Session",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
        ),
        type: "premium"
    },
    {
        id: 8,
        title: "Signature Strategy Suite",
        price: 6999,
        description: "The complete Rachit Hirani experience. Combine engineering expertise with relentless team support. We ensure every question is answered and every detail is perfect until the car is in your driveway.",
        detail: "Rachit's Audit + 2 Team Follow-ups",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        ),
        type: "premium"
    }
];
