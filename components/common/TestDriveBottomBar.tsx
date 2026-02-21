'use client';

import { useState, useEffect } from 'react';
import styles from './TestDriveBottomBar.module.css';
import { Car, Calendar } from 'lucide-react';

interface TestDriveBottomBarProps {
    onBookTestDrive: () => void;
}

export default function TestDriveBottomBar({ onBookTestDrive }: TestDriveBottomBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show after scrolling down 300px
            if (currentScrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    if (!isVisible) return null;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.textElement}>
                    <span className={styles.title}>Interested in this car?</span>
                    <span className={styles.subtitle}>Get the best offers & test drive!</span>
                </div>
                <button className={styles.button} onClick={onBookTestDrive}>
                    <Car className="w-5 h-5" />
                    <span>Book Test Drive</span>
                </button>
            </div>
        </div>
    );
}
