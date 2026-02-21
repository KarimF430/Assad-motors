/**
 * gadizone Mobile App - Badge Component
 * NEW and POPULAR badges
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '../../theme';

interface BadgeProps {
    type: 'new' | 'popular';
    size?: 'sm' | 'md';
}

export default function Badge({ type, size = 'md' }: BadgeProps) {
    const gradients = {
        new: ['#22C55E', '#16A34A'] as const,
        popular: ['#F97316', '#DC2626'] as const,
    };

    const labels = {
        new: 'NEW',
        popular: 'POPULAR',
    };

    const sizeStyles = {
        sm: { paddingVertical: 2, paddingHorizontal: 8, fontSize: 10 },
        md: { paddingVertical: 4, paddingHorizontal: 12, fontSize: 12 },
    };

    return (
        <LinearGradient
            colors={gradients[type]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
                styles.badge,
                {
                    paddingVertical: sizeStyles[size].paddingVertical,
                    paddingHorizontal: sizeStyles[size].paddingHorizontal,
                },
            ]}
        >
            <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
                {labels[type]}
            </Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    badge: {
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
    },
    text: {
        color: colors.white,
        fontWeight: '600',
    },
});
