/**
 * gadizone Mobile App - Button Component
 * Primary and Secondary buttons with gradient styling
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, shadows, spacing } from '../../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    textStyle,
}: ButtonProps) {
    const sizeStyles = {
        sm: { paddingVertical: spacing[2], paddingHorizontal: spacing[3] },
        md: { paddingVertical: spacing[2.5], paddingHorizontal: spacing[4] },
        lg: { paddingVertical: spacing[3], paddingHorizontal: spacing[6] },
    };

    const textSizes = {
        sm: 14,
        md: 16,
        lg: 18,
    };

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[fullWidth && styles.fullWidth, style]}
            >
                <LinearGradient
                    colors={disabled ? [colors.gray[400], colors.gray[500]] : colors.primary.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.button,
                        sizeStyles[size],
                        shadows.md,
                        disabled && styles.disabled,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.white} size="small" />
                    ) : (
                        <Text style={[styles.primaryText, { fontSize: textSizes[size] }, textStyle]}>
                            {title}
                        </Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    if (variant === 'secondary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.7}
                style={[
                    styles.button,
                    styles.secondaryButton,
                    sizeStyles[size],
                    disabled && styles.disabled,
                    fullWidth && styles.fullWidth,
                    style,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={colors.gray[900]} size="small" />
                ) : (
                    <Text style={[styles.secondaryText, { fontSize: textSizes[size] }, textStyle]}>
                        {title}
                    </Text>
                )}
            </TouchableOpacity>
        );
    }

    // Outline variant
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.button,
                styles.outlineButton,
                sizeStyles[size],
                disabled && styles.disabled,
                fullWidth && styles.fullWidth,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={colors.primary.red} size="small" />
            ) : (
                <Text style={[styles.outlineText, { fontSize: textSizes[size] }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
    },
    primaryText: {
        color: colors.white,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    secondaryText: {
        color: colors.gray[900],
        fontWeight: '500',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary.red,
    },
    outlineText: {
        color: colors.primary.red,
        fontWeight: '600',
    },
});
