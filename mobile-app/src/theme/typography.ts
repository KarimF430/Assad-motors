/**
 * gadizone Mobile App - Typography System
 * EXACT match of web globals.css
 * 
 * Font: Inter (Google Fonts)
 * Weights: 300 (light), 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
 */

// Font family - matches web: font-family: 'Inter', system-ui, sans-serif
export const fontFamily = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    // Fallback to system fonts if Inter not loaded
    system: 'System',
};

// Font sizes matching Tailwind defaults
export const fontSize = {
    xs: 12,      // text-xs
    sm: 14,      // text-sm
    base: 16,    // text-base
    lg: 18,      // text-lg
    xl: 20,      // text-xl
    '2xl': 24,   // text-2xl
    '3xl': 30,   // text-3xl
    '4xl': 36,   // text-4xl
    '5xl': 48,   // text-5xl
};

// Font weights
export const fontWeight = {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
};

// Line heights matching Tailwind
export const lineHeight = {
    tight: 1.25,   // leading-tight
    snug: 1.375,   // leading-snug
    normal: 1.5,   // leading-normal
    relaxed: 1.625, // leading-relaxed
    loose: 2,      // leading-loose
};

// Letter spacing
export const letterSpacing = {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
};

// Pre-defined text styles matching web
export const textStyles = {
    // Headings
    h1: {
        fontSize: fontSize['3xl'],  // 30px
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.tight,
        color: '#111827', // gray-900
    },
    h2: {
        fontSize: fontSize['2xl'],  // 24px
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.tight,
        color: '#111827',
    },
    h3: {
        fontSize: fontSize.xl,      // 20px
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.snug,
        color: '#111827',
    },
    h4: {
        fontSize: fontSize.lg,      // 18px
        fontWeight: fontWeight.semibold,
        lineHeight: lineHeight.snug,
        color: '#111827',
    },

    // Body text
    body: {
        fontSize: fontSize.base,    // 16px
        fontWeight: fontWeight.normal,
        lineHeight: lineHeight.normal,
        color: '#4B5563', // gray-600
    },
    bodySmall: {
        fontSize: fontSize.sm,      // 14px
        fontWeight: fontWeight.normal,
        lineHeight: lineHeight.normal,
        color: '#6B7280', // gray-500
    },

    // Labels and captions
    label: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: '#374151', // gray-700
    },
    caption: {
        fontSize: fontSize.xs,      // 12px
        fontWeight: fontWeight.normal,
        color: '#6B7280', // gray-500
    },

    // Button text
    button: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.semibold,
        color: '#FFFFFF',
    },
    buttonSmall: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: '#FFFFFF',
    },

    // Price styles
    price: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: '#DC2626', // red-600
    },
    priceSmall: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: '#DC2626',
    },
};

export default {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    textStyles,
};
