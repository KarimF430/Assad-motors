# gadizone Mobile App - AI Agent Development Guidelines

## 🤖 Purpose

This document provides guidelines for AI agents (Claude, GPT, etc.) to maintain consistency when developing the gadizone React Native mobile app. **Follow these rules exactly** to ensure pixel-perfect replication of the web frontend.

---

## 📋 Pre-Development Checklist

Before implementing any new section:

1. **Study the web component** - Always view the corresponding Next.js component
2. **Extract exact values** - Get hex colors, font sizes, spacing from Tailwind classes
3. **Map icons** - Convert Lucide icons to @expo/vector-icons equivalents
4. **Test in Expo Go** - Verify on actual device before marking complete

---

## 🎨 Design System Reference

### Colors (ALWAYS use these exact values)

```typescript
// Primary Gradient
gradient: ['#DC2626', '#EA580C']  // from-red-600 to-orange-500

// Text Colors
textPrimary: '#111827'    // gray-900 (headings)
textSecondary: '#6B7280'  // gray-500 (labels, descriptions)
textBody: '#4B5563'       // gray-600 (body text)
textMuted: '#9CA3AF'      // gray-400 (placeholders, icons)

// Backgrounds
bgWhite: '#FFFFFF'
bgGray50: '#F9FAFB'       // page backgrounds
bgGray100: '#F3F4F6'      // input fields

// Borders
borderLight: '#E5E7EB'    // gray-200
borderDefault: '#D1D5DB'  // gray-300

// Badges
newBadge: ['#22C55E', '#059669']      // green-500 to emerald-600
popularBadge: ['#F97316', '#DC2626']  // orange-500 to red-600
```

### Typography

| Style | Font Size | Weight | Color |
|-------|-----------|--------|-------|
| H1 | 30px | 700 | #111827 |
| H2 | 24px | 700 | #111827 |
| H3 | 20px | 700 | #111827 |
| Section Title | 22px | 700 | #111827 |
| Body | 16px | 400 | #4B5563 |
| Small | 14px | 400 | #6B7280 |
| Caption | 12px | 400 | #6B7280 |
| Button | 14-16px | 600 | #FFFFFF |
| Price | 18px | 700 | #DC2626 |

### Spacing (Tailwind to React Native)

| Tailwind | RN Value |
|----------|----------|
| p-2 | 8 |
| p-3 | 12 |
| p-4 | 16 |
| p-5 | 20 |
| p-6 | 24 |
| p-8 | 32 |
| gap-2 | 8 |
| gap-3 | 12 |
| gap-4 | 16 |

### Border Radius

| Tailwind | RN Value |
|----------|----------|
| rounded-lg | 8 |
| rounded-xl | 12 |
| rounded-2xl | 16 |
| rounded-3xl | 24 |
| rounded-full | 9999 |

---

## 🔧 Icon Mapping

**ALWAYS use these mappings from Lucide to @expo/vector-icons:**

```typescript
// Feather icons (same design as Lucide)
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Header icons
Search → Feather.search
MapPin → Feather.map-pin
Menu → Feather.menu
X → Feather.x

// Hero section
Mic → Feather.mic
Sparkles → MaterialCommunityIcons.shimmer

// Car details
Heart → Feather.heart
Fuel → MaterialCommunityIcons.fuel
Gauge → MaterialCommunityIcons.speedometer
ChevronLeft → Feather.chevron-left
ChevronRight → Feather.chevron-right

// Navigation
ArrowLeft → Feather.arrow-left
ArrowRight → Feather.arrow-right
Home → Feather.home
User → Feather.user
```

---

## 📁 File Structure Convention

```
mobile-app/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── home/            # HomePage-specific components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CarsByBudget.tsx
│   │   │   ├── CarCard.tsx
│   │   │   └── PopularCars.tsx
│   │   └── ads/             # Advertisement components
│   │       └── Ad3DCarousel.tsx
│   ├── screens/             # Full page screens
│   │   ├── HomeScreen.tsx
│   │   ├── ModelScreen.tsx
│   │   └── SearchScreen.tsx
│   ├── navigation/          # React Navigation setup
│   ├── services/            # API calls
│   └── theme/               # Design tokens
```

---

## 🚀 Implementation Steps (For Each Section)

### Step 1: Analyze Web Component
```bash
# View the web component
cat /Applications/WEBSITE-23092025-101/components/home/[ComponentName].tsx
```

### Step 2: Extract Design Values
- Note all Tailwind classes
- Convert to exact hex/pixel values
- Document in component header comment

### Step 3: Create RN Component
```typescript
/**
 * gadizone Mobile App - [Component Name]
 * EXACT replica of web components/[path]/[ComponentName].tsx
 * 
 * Web specs:
 * - [list all key specs from Tailwind classes]
 */
```

### Step 4: Update Documentation
After completing each section, update:
1. `DEVELOPMENT_LOG.md` - Add to Section-by-Section Build Log
2. Mark component as ✅ DONE in file structure

---

## 🧪 Testing Checklist

Before marking any section complete:

- [ ] Colors match web exactly
- [ ] Typography sizes/weights match
- [ ] Spacing/padding matches
- [ ] Icons render correctly
- [ ] Shadows appear properly
- [ ] Gradient directions are correct
- [ ] Touch feedback works
- [ ] Data loads from API
- [ ] No TypeScript errors
- [ ] Works on iOS and Android

---

## ⚠️ Common Pitfalls to Avoid

1. **Don't use emoji icons** - Always use @expo/vector-icons
2. **Don't guess colors** - Extract exact hex from Tailwind
3. **Don't skip shadows** - RN shadows need explicit iOS/Android values
4. **Don't hardcode data** - Always fetch from API
5. **Don't forget SafeAreaView** - Wrap screens properly
6. **Don't use wrong gradient direction** - Check start/end points

---

## 📝 Component Documentation Template

```typescript
/**
 * gadizone Mobile App - [Component Name]
 * EXACT replica of web [web file path]
 * 
 * Web specs:
 * - Height: [value] (Tailwind class)
 * - Background: [color] (Tailwind class)
 * - [other specs]
 * 
 * Icon mapping:
 * - Web: [Lucide icon] → Mobile: [Expo icon]
 * 
 * @author AI Agent
 * @date [date]
 */
```

---

## 🔗 Resources

- Web Frontend: `/Applications/WEBSITE-23092025-101/`
- Backend API: `https://killerwhale-backend.onrender.com`
- Color Reference: `src/theme/colors.ts`
- Typography: `src/theme/typography.ts`

---

**Last Updated:** 2025-12-05
**Maintained By:** AI Development Agents
