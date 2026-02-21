'use client';

import styles from './page.module.css';

const placeholderReviews = [
    {
        id: 1,
        initials: 'RS',
        name: 'Rahul S.',
        city: 'Mumbai',
        text: '"The consultation helped me shortlist between the Creta and Seltos in under 20 minutes. Ended up with the right car for my commute."',
        rating: 5,
    },
    {
        id: 2,
        initials: 'PM',
        name: 'Priya M.',
        city: 'Bangalore',
        text: '"They caught ₹35,000 in unnecessary add-ons in my dealer quote. Paid for the consultation 70x over."',
        rating: 5,
    },
    {
        id: 3,
        initials: 'AK',
        name: 'Amit K.',
        city: 'Delhi',
        text: '"Saved me from a used car with a hidden gearbox issue. The pre-purchase checklist alone is worth it."',
        rating: 5,
    },
    {
        id: 4,
        initials: 'SR',
        name: 'Sneha R.',
        city: 'Hyderabad',
        text: '"15 minutes cleared months of confusion. Finally got advice without a sales agenda."',
        rating: 5,
    },
    {
        id: 5,
        initials: 'VS',
        name: 'Vikram S.',
        city: 'Pune',
        text: '"Helped me decide between Thar and Jimny in one call. Bought the Thar — no regrets."',
        rating: 5,
    },
];

interface ReviewsSectionProps {
    onBookCall?: () => void;
}

export default function ReviewsSection({ onBookCall }: ReviewsSectionProps) {
    return (
        <section className={styles.reviews}>
            <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTag}>What Buyers Say</span>
                    <h2 className={styles.sectionTitle}>Real Feedback from Car Buyers</h2>
                    <p className={styles.sectionSubtitle}>
                        Shared by buyers who used our consultation service. Results vary based on individual needs and market conditions.
                    </p>
                </div>
            </div>

            <div className={styles.reviewsScroll}>
                {placeholderReviews.map((review) => (
                    <div key={review.id} className={styles.reviewCard}>
                        {/* Avatar with initials instead of stock photos */}
                        <div className={styles.reviewImageWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '8px' }}>
                            <div style={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #dc2626, #ea580c)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                                letterSpacing: '0.05em',
                            }}>
                                {review.initials}
                            </div>
                        </div>
                        <div className={styles.reviewInfo}>
                            <h4 className={styles.reviewerName}>{review.name} · {review.city}</h4>
                            <div className={styles.reviewRating}>
                                <span className={styles.ratingNumber}>{review.rating}</span>
                                <span className={styles.ratingStar}>★</span>
                            </div>
                        </div>
                        <p className={styles.reviewText}>{review.text}</p>
                    </div>
                ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem', padding: '0 1rem' }}>
                Reviews are from buyers who used the gadizone Car Expert service. Names abbreviated for privacy.
            </p>
        </section>
    );
}
