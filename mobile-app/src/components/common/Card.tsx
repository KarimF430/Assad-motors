/**
 * gadizone Mobile App - Card Component
 * Reusable card wrapper with shadow
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../../theme';

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
    children,
    style,
    padding = 'md',
    shadow = 'sm',
}: CardProps) {
    const paddingStyles = {
        none: 0,
        sm: spacing[3],
        md: spacing[4],
        lg: spacing[6],
    };

    const shadowStyles = {
        none: {},
        sm: shadows.sm,
        md: shadows.md,
        lg: shadows.lg,
    };

    return (
        <View
            style={[
                styles.card,
                { padding: paddingStyles[padding] },
                shadowStyles[shadow],
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
});
