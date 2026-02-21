'use client';

import styles from './ExitIntentModal.module.css';

interface ExitIntentModalProps {
    isOpen: boolean;
    onStay: () => void;
    onLeave: () => void;
    expertName?: string;
    isExpertView?: boolean;
}

export default function ExitIntentModal({ isOpen, onStay, onLeave, expertName, isExpertView }: ExitIntentModalProps) {
    if (!isOpen) return null;

    const title = isExpertView
        ? `Wait! Before you go... 👋`
        : `Hold on! You're so close! 🌟`;

    const subtitle = isExpertView
        ? `${expertName} is waiting to help you find your perfect car.`
        : `Our experts save car buyers an average of ₹50,000 and hours of stress.`;

    const description = isExpertView
        ? `Slots are filling up fast! Book now to secure your time with ${expertName}.`
        : `Don't miss your chance to get unbiased, expert advice tailored to your needs.`;

    const stayButtonText = isExpertView ? `Book with ${expertName}` : 'See Plans';
    const leaveButtonText = isExpertView ? 'Maybe Later' : 'Leave Anyway';

    return (
        <div className={styles.overlay} onClick={onStay}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.iconWrapper}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8v4"></path>
                        <path d="M12 16h.01"></path>
                    </svg>
                </div>

                <h2 className={styles.title}>{title}</h2>
                <p className={styles.subtitle}>{subtitle}</p>
                <p className={styles.description}>{description}</p>

                <div className={styles.actions}>
                    <button onClick={onStay} className={styles.stayButton}>
                        {stayButtonText}
                    </button>
                    <button onClick={onLeave} className={styles.leaveButton}>
                        {leaveButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
