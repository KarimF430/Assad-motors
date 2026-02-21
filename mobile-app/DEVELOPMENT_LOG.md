# gadizone Mobile App - Development Documentation

## 📱 Overview

This React Native (Expo) mobile app is an **exact pixel-perfect replica** of the gadizone Next.js web frontend. It connects to the same Express.js backend API enabling seamless cross-platform experience.

---

## 🎨 Design System Reference

### Color Palette (from `globals.css`)

| Color Name | Web Class | Hex Code | Usage |
|------------|-----------|----------|-------|
| **Red-600** | `red-600` | `#DC2626` | Primary brand color, buttons |
| **Orange-500** | `orange-500` | `#EA580C` | Gradient end color |
| **Gray-900** | `gray-900` | `#111827` | Headings, important text |
| **Gray-700** | `gray-700` | `#374151` | Menu items |
| **Gray-600** | `gray-600` | `#4B5563` | Body text |
| **Gray-500** | `gray-500` | `#6B7280` | Secondary text, placeholders |
| **Gray-400** | `gray-400` | `#9CA3AF` | Icons |
| **Gray-200** | `gray-200` | `#E5E7EB` | Borders |
| **Gray-100** | `gray-100` | `#F3F4F6` | Input backgrounds |
| **Gray-50** | `gray-50` | `#F9FAFB` | Page background |

### Primary Gradient
```
from-red-600 (#DC2626) → to-orange-500 (#EA580C)
```

### Typography (Inter Font)

| Style | Size | Weight | Color |
|-------|------|--------|-------|
| H1 | 30px | Bold (700) | Gray-900 |
| H2 | 24px | Bold (700) | Gray-900 |
| H3 | 20px | Bold (700) | Gray-900 |
| Body | 16px | Normal (400) | Gray-600 |
| Small | 14px | Normal (400) | Gray-500 |
| Caption | 12px | Normal (400) | Gray-500 |
| Button | 16px | SemiBold (600) | White |

---

## 📦 Section-by-Section Build Log

### ✅ Section 1: Header, Ad Banner, Hero (COMPLETED)

**Date:** 2025-12-05

#### Components Created:

##### 1. Header (`src/components/common/Header.tsx`)

**Web Source:** `components/Header.tsx`

| Feature | Web Implementation | Mobile Implementation |
|---------|-------------------|----------------------|
| Height | `h-16` (64px) | `height: 64` |
| Background | `bg-white shadow-sm` | `backgroundColor: '#FFFFFF'` + shadow |
| Logo | `gadizone-logo.png` + text | Same image + text |
| Search Icon | `lucide-react Search` | `Feather.search` |
| Location Icon | `lucide-react MapPin` | `Feather.map-pin` |
| Menu Icon | `lucide-react Menu` | `Feather.menu` |
| Icon Size | `h-5 w-5` (20px) | `size={20}` |
| Icon Color | `text-gray-500` | `color="#6B7280"` |

##### 2. Ad 3D Carousel (`src/components/ads/Ad3DCarousel.tsx`)

**Web Source:** `components/ads/Ad3DCarousel.tsx`

| Feature | Web Implementation | Mobile Implementation |
|---------|-------------------|----------------------|
| Height | `h-[140px] sm:h-[160px]` | `height: 180` |
| Background | `bg-gradient-to-br from-gray-900` | Dark gradient |
| Auto-rotate | 4000ms interval | `rotateInterval={4000}` |
| Ads Data | 5 premium ads | Same 5 ads |
| Close Button | `X icon top-right` | `Feather.x` top-right |
| Navigation | `ChevronLeft/Right` | Arrow buttons |
| Pagination | Dots with active state | Same dots |

##### 3. Hero Section (`src/components/home/HeroSection.tsx`)

**Web Source:** `components/home/HeroSection.tsx`

| Feature | Web Implementation | Mobile Implementation |
|---------|-------------------|----------------------|
| Gradient | `from-red-600 to-orange-500` | `['#DC2626', '#EA580C']` |
| Title | `text-3xl font-bold white` | `fontSize: 28, fontWeight: 700` |
| Search Card | `bg-white rounded-2xl shadow-2xl` | Same styling |
| Input BG | `bg-gray-100 rounded-xl` | `backgroundColor: '#F3F4F6'` |
| Placeholder | "Best car for family under 15 lakhs" | Same text |
| Mic Icon | `lucide-react Mic` | `Feather.mic` |
| Button | Gradient + `Sparkles` icon | Gradient + `shimmer` icon |
| Button Text | "Start AI Search" | Same text |

---

### 🚧 Section 2: Cars by Budget (IN PROGRESS)

**Components:**
- Budget filter tabs
- Horizontal car carousel
- CarCard component

---

### ✅ Section 2: Cars by Budget (COMPLETED)

**Date:** 2025-12-05

#### Component Created: `src/components/home/CarsByBudget.tsx`

**Web Source:** `components/home/CarsByBudget.tsx`

| Feature | Web Implementation | Mobile Implementation |
|---------|-------------------|----------------------|
| Title | `text-xl sm:text-2xl font-bold` | `fontSize: 22, fontWeight: 700` |
| Title Color | `text-gray-900` | `color: '#111827'` |
| Tab Layout | `flex flex-wrap gap-2` | `flexWrap: 'wrap', gap: 8` |
| Active Tab | `bg-gradient-to-r from-red-600 to-orange-500` | `LinearGradient ['#DC2626', '#EA580C']` |
| Inactive Tab | `bg-gray-100 text-gray-700` | `backgroundColor: '#F3F4F6'` |
| Tab Shape | `rounded-full px-6 py-3` | `borderRadius: 9999, padding: 12/24` |
| Tab Font | `text-sm font-medium` | `fontSize: 14, fontWeight: 500` |

**Budget Ranges (matching web exactly):**
- Under ₹8 Lakh: `0 - 800000`
- Under ₹15 Lakh: `800000 - 1500000`
- Under ₹25 Lakh: `1500000 - 2500000`
- Under ₹50 Lakh: `2500000 - 5000000`
- Above ₹50 Lakh: `> 5000000`

#### Updated: `src/components/home/CarCard.tsx`

| Feature | Web Implementation | Mobile Implementation |
|---------|-------------------|----------------------|
| Card Width | `w-[260px] sm:w-72` | `SCREEN_WIDTH * 0.7` |
| Card Border | `border border-gray-200` | `borderWidth: 1, borderColor: '#E5E7EB'` |
| Image Height | `h-40 sm:h-48` | `height: 170` |
| NEW Badge | `bg-gradient-to-r from-green-500 to-emerald-600` | `['#22C55E', '#059669']` |
| POPULAR Badge | `bg-gradient-to-r from-orange-500 to-red-600` | `['#F97316', '#DC2626']` |
| Heart Button | Red filled circle | `backgroundColor: '#EF4444'` |
| Price | `text-red-600 font-bold` | `color: '#DC2626', fontWeight: 700` |
| Price Label | "On-Road Price" | Same text |
| Fuel Icon | `lucide-react Fuel` | `MaterialCommunityIcons.fuel` |
| Trans Icon | `lucide-react Gauge` | `MaterialCommunityIcons.car-shift-pattern` |
| Button | Gradient + "View Details" | Same gradient + text |

---

### ⏳ Section 3: Popular Cars (PENDING)

---

### ⏳ Section 4: Popular Brands (PENDING)

---

### ⏳ Section 5: Upcoming Cars (PENDING)

---

### ⏳ Section 6: Latest News (PENDING)

---

### ⏳ Section 7: Popular Comparisons (PENDING)

---

## 📁 File Structure

```
mobile-app/
├── App.tsx                    # Entry point with navigation
├── package.json               # Dependencies (Expo SDK 54)
├── app.json                   # Expo configuration
├── tsconfig.json              # TypeScript config
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx     ✅ DONE
│   │   │   ├── Button.tsx     ✅ DONE
│   │   │   ├── Card.tsx       ✅ DONE
│   │   │   └── Badge.tsx      ✅ DONE
│   │   ├── ads/
│   │   │   └── Ad3DCarousel.tsx ✅ DONE
│   │   └── home/
│   │       ├── HeroSection.tsx  ✅ DONE
│   │       └── CarCard.tsx      ✅ DONE
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx     ✅ Section 1 Complete
│   │   └── (placeholder screens)
│   │
│   ├── navigation/
│   │   └── index.tsx          ✅ Bottom tabs + stacks
│   │
│   ├── services/
│   │   └── api.ts             ✅ Backend API integration
│   │
│   └── theme/
│       ├── colors.ts          ✅ Color system
│       ├── typography.ts      ✅ Font system
│       ├── spacing.ts         ✅ Spacing/radius/shadows
│       └── index.ts           ✅ Barrel export
```

---

## 🔧 Icon Mapping

| Web (Lucide) | Mobile (@expo/vector-icons) | Usage |
|--------------|---------------------------|-------|
| `Search` | `Feather.search` | Header search |
| `MapPin` | `Feather.map-pin` | Header location |
| `Menu` | `Feather.menu` | Header menu |
| `X` | `Feather.x` | Close buttons |
| `Mic` | `Feather.mic` | Voice search |
| `Sparkles` | `MaterialCommunityIcons.shimmer` | AI Search button |
| `Heart` | `Feather.heart` | Wishlist |
| `Fuel` | `MaterialCommunityIcons.fuel` | Car fuel type |
| `Gauge` | `MaterialCommunityIcons.speedometer` | Transmission |
| `ChevronLeft` | `Feather.chevron-left` | Navigation |
| `ChevronRight` | `Feather.chevron-right` | Navigation |

---

## 🚀 Running the App

```bash
# Navigate to mobile app
cd mobile-app

# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code with Expo Go app
```

---

## 📝 Version Info

| Package | Version |
|---------|---------|
| Expo SDK | 54.0.27 |
| React | 19.1.0 |
| React Native | 0.81.5 |
| @expo/vector-icons | (bundled) |
| expo-linear-gradient | 15.0.8 |

---

## 🔗 Backend API

Base URL: `https://killerwhale-backend.onrender.com`

All endpoints match the web frontend exactly - see `src/services/api.ts`

---

### ✅ Section 3: Popular Brands (COMPLETED)

**Date:** 2025-12-05

#### Component Created: `src/components/home/BrandSection.tsx`

**Web Source:** `components/home/BrandSection.tsx`

| Feature | Web Implementation | Mobile Implementation |
|---------|-------------------|----------------------|
| Title | `text-xl sm:text-2xl font-bold` | `fontSize: 20, fontWeight: 700` |
| Grid | `grid-cols-3 gap-4` | `flexWrap: 'wrap'`, 3 columns |
| Card BG | `bg-white rounded-lg border-gray-200` | `backgroundColor: '#FFFFFF'` |
| Card Padding | `p-4` | `padding: 16` |
| Logo Container | `h-16` (64px) | `height: 64` |
| Logo Size | `w-12 h-12` (48px) | `width: 48, height: 48` |
| Fallback | Gradient square with initials | `LinearGradient` + initials |
| Name | `text-sm font-medium gray-900` | `fontSize: 14, fontWeight: 500` |
| Show All Button | Gradient `px-5 py-2.5` | `paddingHorizontal: 20` |
| Button Icon | `ChevronDown/Up h-4 w-4` | `Feather chevron-down/up size={16}` |

**Features:**
- ✅ Shows 6 brands initially, expands to show all
- ✅ Logo fallback with brand initials
- ✅ "Show All X Brands" gradient button
- ✅ Collapsible with "Show Less"
