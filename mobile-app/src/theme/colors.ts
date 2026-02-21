/**
 * gadizone Mobile App - Color System
 * EXACT match of web globals.css and Tailwind defaults
 * 
 * Primary gradient: from-red-600 (#DC2626) to-orange-500 (#EA580C)
 * Font: Inter (Google Fonts)
 */

export const colors = {
    // Primary Brand Colors (from web gradient-bg)
    primary: {
        red: '#DC2626',      // red-600 (primary brand color)
        redHover: '#B91C1C', // red-700
        orange: '#EA580C',   // orange-500
        orangeHover: '#C2410C', // orange-600
    },

    // Gradient definitions for LinearGradient
    gradients: {
        primary: ['#DC2626', '#EA580C'] as const, // from-red-600 to-orange-500
        primaryHover: ['#B91C1C', '#C2410C'] as const, // from-red-700 to-orange-600
        newBadge: ['#22C55E', '#059669'] as const, // green-500 to emerald-600
        popularBadge: ['#F97316', '#DC2626'] as const, // orange-500 to red-600
    },

    // Gray Scale (Tailwind defaults)
    gray: {
        50: '#F9FAFB',   // bg-gray-50 (page background)
        100: '#F3F4F6',  // bg-gray-100 (input background)
        200: '#E5E7EB',  // border-gray-200
        300: '#D1D5DB',  // border-gray-300
        400: '#9CA3AF',  // text-gray-400 (icons)
        500: '#6B7280',  // text-gray-500 (secondary text)
        600: '#4B5563',  // text-gray-600 (body text)
        700: '#374151',  // text-gray-700 (menu items)
        800: '#1F2937',  // text-gray-800
        900: '#111827',  // text-gray-900 (headings)
    },

    // Semantic Colors
    white: '#FFFFFF',
    black: '#000000',

    // Text Colors (from web)
    text: {
        primary: '#111827',   // text-gray-900 (headings, important text)
        secondary: '#6B7280', // text-gray-500 (descriptions, labels)
        tertiary: '#9CA3AF',  // text-gray-400 (placeholders)
        body: '#4B5563',      // text-gray-600 (paragraph text)
        muted: '#6B7280',     // text-gray-500
    },

    // Background Colors
    background: {
        primary: '#FFFFFF',   // card backgrounds
        secondary: '#F9FAFB', // page background (bg-gray-50)
        input: '#F3F4F6',     // input fields (bg-gray-100)
    },

    // Border Colors
    border: {
        light: '#E5E7EB',     // border-gray-200
        default: '#D1D5DB',   // border-gray-300
    },

    // Status Colors
    success: {
        light: '#DCFCE7',
        main: '#22C55E',      // green-500
        dark: '#16A34A',
    },
    error: {
        light: '#FEE2E2',
        main: '#EF4444',      // red-500
        dark: '#DC2626',
    },
    warning: {
        light: '#FEF3C7',
        main: '#F59E0B',      // amber-500
        dark: '#D97706',
    },
    info: {
        light: '#DBEAFE',
        main: '#3B82F6',      // blue-500
        dark: '#2563EB',
    },
};

export default colors;
