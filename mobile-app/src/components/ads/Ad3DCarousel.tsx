/**
 * gadizone Mobile App - Ad 3D Carousel
 * EXACT replica of web components/ads/Ad3DCarousel.tsx
 * 
 * Design specs from web:
 * - Height: h-[140px] sm:h-[160px]
 * - 3D perspective carousel with left/right peek
 * - Pagination dots at bottom
 * - Close button top-right
 * - Auto-rotate every 4 seconds
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

interface Ad3DCarouselProps {
    autoRotate?: boolean;
    rotateInterval?: number;
    onClose?: () => void;
}

// Premium ad data matching web exactly
const ads = [
    {
        id: 1,
        title: 'Monsoon Service Camp',
        subtitle: 'Free 40-Point Checkup',
        description: 'Ensure your car is monsoon ready. 20% off on labor.',
        image: 'https://images.unsplash.com/photo-1632823471565-1ec2a1ad4015?w=600&h=300&fit=crop',
        gradient: ['#2563EB', '#0891B2', '#0D9488'] as const, // blue-600 via cyan-600 to teal-600
        cta: 'Book Service',
        badge: 'LIMITED',
    },
    {
        id: 2,
        title: 'New Tata Nexon',
        subtitle: 'Way Ahead',
        description: 'Book now and get priority delivery + accessories worth ₹15k',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=300&fit=crop',
        gradient: ['#9333EA', '#D946EF', '#EC4899'] as const, // purple-600 via fuchsia-600 to pink-600
        cta: 'Check Offers',
        badge: 'LAUNCH',
    },
    {
        id: 3,
        title: 'Zero Dep Insurance',
        subtitle: 'Starting @ ₹2099',
        description: 'Protect your car with comprehensive coverage. Cashless claims.',
        image: 'https://images.unsplash.com/photo-1450101499121-e5b934472494?w=600&h=300&fit=crop',
        gradient: ['#EA580C', '#D97706', '#EAB308'] as const, // orange-600 via amber-600 to yellow-600
        cta: 'Get Quote',
        badge: 'SAVE 40%',
    },
    {
        id: 4,
        title: 'Sell Your Car',
        subtitle: 'Best Price Guarantee',
        description: 'Get instant valuation and payment in 1 hour. Free RC transfer.',
        image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&h=300&fit=crop',
        gradient: ['#059669', '#16A34A', '#84CC16'] as const, // emerald-600 via green-600 to lime-600
        cta: 'Get Value',
        badge: 'INSTANT',
    },
    {
        id: 5,
        title: 'Premium Tyres',
        subtitle: 'Buy 3 Get 1 Free',
        description: 'Upgrade your ride with premium tyres. Michelin, Bridgestone & more.',
        image: 'https://images.unsplash.com/photo-1578844251758-2f71da645217?w=600&h=300&fit=crop',
        gradient: ['#DC2626', '#E11D48', '#EC4899'] as const, // red-600 via rose-600 to pink-600
        cta: 'Shop Now',
        badge: 'OFFER',
    },
];

export default function Ad3DCarousel({
    autoRotate = true,
    rotateInterval = 4000,
    onClose,
}: Ad3DCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    // Auto-rotate
    useEffect(() => {
        if (!autoRotate || !isVisible) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % ads.length;
                scrollViewRef.current?.scrollTo({
                    x: next * CARD_WIDTH,
                    animated: true,
                });
                return next;
            });
        }, rotateInterval);

        return () => clearInterval(interval);
    }, [autoRotate, isVisible, rotateInterval]);

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / CARD_WIDTH);
        setCurrentIndex(index);
    };

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
            {/* Close Button */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.8}
            >
                <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Carousel */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH}
                contentContainerStyle={styles.scrollContent}
            >
                {ads.map((ad, index) => (
                    <View key={ad.id} style={styles.cardWrapper}>
                        <LinearGradient
                            colors={ad.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.card}
                        >
                            {/* Badge */}
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{ad.badge}</Text>
                            </View>

                            {/* Content */}
                            <View style={styles.cardContent}>
                                {/* Text Section */}
                                <View style={styles.textSection}>
                                    <Text style={styles.subtitle}>{ad.subtitle}</Text>
                                    <Text style={styles.title} numberOfLines={1}>{ad.title}</Text>
                                    <Text style={styles.description} numberOfLines={2}>
                                        {ad.description}
                                    </Text>
                                    <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
                                        <Text style={styles.ctaText}>{ad.cta}</Text>
                                        <Text style={styles.ctaArrow}>›</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Image Section */}
                                <View style={styles.imageSection}>
                                    <Image
                                        source={{ uri: ad.image }}
                                        style={styles.adImage}
                                        resizeMode="cover"
                                    />
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                ))}
            </ScrollView>

            {/* Navigation Arrows */}
            <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={() => {
                    const prev = (currentIndex - 1 + ads.length) % ads.length;
                    scrollViewRef.current?.scrollTo({ x: prev * CARD_WIDTH, animated: true });
                    setCurrentIndex(prev);
                }}
                activeOpacity={0.9}
            >
                <Text style={styles.navButtonText}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={() => {
                    const next = (currentIndex + 1) % ads.length;
                    scrollViewRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
                    setCurrentIndex(next);
                }}
                activeOpacity={0.9}
            >
                <Text style={styles.navButtonText}>›</Text>
            </TouchableOpacity>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {ads.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex && styles.dotActive,
                        ]}
                        onPress={() => {
                            scrollViewRef.current?.scrollTo({ x: index * CARD_WIDTH, animated: true });
                            setCurrentIndex(index);
                        }}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 180,
        backgroundColor: '#111827', // gray-900
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 50,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    closeButtonText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 - 16,
    },
    cardWrapper: {
        width: CARD_WIDTH,
        paddingHorizontal: 6,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 12,
        zIndex: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 9999,
    },
    badgeText: {
        fontSize: 8,
        fontWeight: '700',
        color: '#111827',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingTop: 28, // Account for badge
    },
    textSection: {
        flex: 1,
        paddingRight: 8,
    },
    subtitle: {
        fontSize: 9,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 2,
    },
    description: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
        lineHeight: 15,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    ctaText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#111827',
    },
    ctaArrow: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 2,
    },
    imageSection: {
        width: 130,
        height: 110,
        borderRadius: 8,
        overflow: 'hidden',
    },
    adImage: {
        width: '100%',
        height: '100%',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        marginTop: -20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    navButtonLeft: {
        left: 8,
    },
    navButtonRight: {
        right: 8,
    },
    navButtonText: {
        fontSize: 24,
        color: '#111827',
        fontWeight: '300',
        marginTop: -2,
    },
    pagination: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        zIndex: 40,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    dotActive: {
        width: 24,
        backgroundColor: '#FFFFFF',
    },
});
