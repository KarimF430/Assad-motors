# 📋 Placeholder Sections List

This document lists all placeholder sections, mock data, and static content across all pages in the application.

---

## 🏠 **Homepage** (`app/page.tsx`)

### Placeholder Sections:
- ✅ All sections are functional (no placeholders found)

---

## 🚗 **Car Model Page** (`components/car-model/CarModelPage.tsx`)

### AD Banner Placeholders (6 total):
1. **Section 2** - EMI Calculator + AD Banner + Model Highlights
   - Line ~1201: AD Banner placeholder
   
2. **Section 4** - AD Banner + Color Options
   - Line ~1512: AD Banner placeholder
   
3. **Section 6** - AD Banner (after Variants section)
   - Line ~1836: AD Banner placeholder
   
4. **Section 8** - AD Banner (after Similar Cars section)
   - Line ~2053: AD Banner placeholder
   
5. **Section 9** - AD Banner (after Compare section)
   - Line ~2323: AD Banner placeholder
   
6. **Section 11** - AD Banner + Feedback
   - Line ~2748: AD Banner placeholder

### Image Placeholders:
- Line ~1284: Fallback placeholder for highlight images
- Line ~1336, 1360, 1384: Sample captions for highlight images

### Form Placeholders:
- Line ~2772: Feedback textarea placeholder: "Tell us what you think about this car page..."
- Line ~2785: Name input placeholder: "Enter your name"
- Line ~2798: Email input placeholder: "Enter your email"

---

## 🔧 **Variant Page** (`components/variant/VariantPage.tsx`)

### Mock Data:
- Line ~50-88: Complete `mockVariantData` object with placeholder images
  - Images: `/api/placeholder/800/600` (4 instances)

### AD Banner Placeholders (5 total):
1. **Section 2** - AD Banner + Variant Highlights
   - Line ~888: AD Banner placeholder
   
2. **Section 4** - AD Banner + More Variants
   - Line ~2399: AD Banner placeholder
   
3. **Section 5** - Variant Summary, AD Banner, Engine & Mileage
   - Line ~2588: AD Banner placeholder
   
4. **Section 6** - City On-Road Prices, AD Banner & Upcoming Cars
   - Line ~2798: AD Banner placeholder
   
5. **Section 7** - New Launched Cars, AD Banner & Feedback
   - Line ~2814: AD Banner placeholder

### Image Placeholders:
- Line ~932: Fallback placeholder for highlight images

### Mock Variants Data:
- Line ~464-465: Mock variants array for "More Variants" section

### Form Placeholders:
- Line ~2837: Feedback textarea placeholder: "Tell us what you think about this car page..."
- Line ~2850: Name input placeholder: "Enter your name"
- Line ~2863: Email input placeholder: "Enter your email"

---

## 💰 **Price Breakup Page** (`components/price-breakup/PriceBreakupPage.tsx`)

### AD Banner Placeholders (5 total):
1. **Section 2** - AD Banner & EMI Calculator
   - Line ~947: AD Banner placeholder
   
2. **Section 4** - AD Banner, Similar Cars & Popular Cars
   - Line ~1068: AD Banner placeholder
   
3. **Section 5** - AD Banner & Owner Reviews
   - Line ~1199: AD Banner placeholder
   
4. **Section 6** - AD Banner, FAQ & Brand Dealers
   - Line ~1431: AD Banner placeholder
   
5. **Section 7** - Price across India, AD Banner & Share Feedback
   - Line ~1554: AD Banner placeholder

### Form Placeholders:
- Line ~1576: Feedback textarea placeholder: "Tell us what you think about this car page..."
- Line ~1591: Name input placeholder: "Enter your name"
- Line ~1605: Email input placeholder: "Enter your email"

---

## 🔄 **Compare Page** (`app/compare/[slug]/page.tsx`)

### Static/Mock Data:
- Line ~181-182: Static upcoming cars data (fallback when backend doesn't have `isUpcoming` flag)
- Line ~256: TODO comment: "Implement modal to select car and variant"

### AD Banner Placeholders (4 total):
1. **Top Section** - Large AD Banner
   - Line ~676: AD Banner placeholder (large size: `text-5xl`)
   
2. **After Comparison Table**
   - Line ~745: AD Banner placeholder
   
3. **After Popular Comparisons**
   - Line ~841: AD Banner placeholder
   
4. **After Popular Cars**
   - Line ~856: AD Banner placeholder

---

## 📰 **News Article Page** (`app/news/[id]/page.tsx`)

### Image Placeholders:
- Line ~76: Author image placeholder: `/api/placeholder/50/50`
- Line ~87: Featured image fallback: `/api/placeholder/600/400`
- Line ~99, 126: Content block image placeholders: `/api/placeholder/600/400`

### AD Banner Placeholders (2 total):
1. **After Article Content**
   - Line ~219: AD Banner placeholder
   
2. **Bottom Section**
   - Line ~235: AD Banner placeholder

---

## 🏢 **Brand Page** (`app/brands/[brand]/page.tsx`)

### Mock/Static Data:
- Line ~97: Mock brand data (commented as fallback)
- Line ~273: Fallback to static data

---

## 🚙 **Brand Cars Page** (`app/[brand-cars]/page.tsx`)

### Mock/Static Data:
- Line ~106: Mock brand data (commented as fallback)
- Line ~285: Fallback to static data

---

## 🔍 **Search Page** (`app/search/page.tsx`)

### Form Placeholders:
- Line ~119: Search input placeholder: "Search for cars..."

---

## 🤖 **AI Search Page** (`app/ai-search/page.tsx`)

### Mock/Sample Data:
- Line ~8-106: Complete `carDatabase` array with 6 sample cars
  - All images: `/api/placeholder/300/200`
  - Static car data for demonstration

### Form Placeholders:
- Line ~159: Search textarea placeholder: "Describe your perfect car..."

---

## 📍 **Location Page** (`app/location/page.tsx`)

### Form Placeholders:
- Line ~229: Search input placeholder: "Search for city or area..."

---

## 📊 **Compare Selection Page** (`app/compare/page.tsx`)

### Form Placeholders:
- Line ~194: Search input placeholder: "Search cars..."

---

## 📰 **News Listing Page** (`components/news/NewsListing.tsx`)

### Mock News Articles:
- Line ~73-175: `mockArticles` array with 8 sample news articles
  - All images: `/api/placeholder/400/250`
  - Used as fallback when no real data

### AD Banner Placeholders:
- Line ~407-410: AD Banner after every 2 articles in grid view

### Form Placeholders:
- Line ~228: Car search input placeholder: "Type to select car name"

---

## 🎥 **YouTube Video Player** (`components/home/YouTubeVideoPlayer.tsx`)

### Placeholder Data:
- Line ~158-192: Fallback placeholder video data
  - Video ID: 'placeholder'
  - 3 placeholder related videos

---

## 🚗 **Upcoming Cars Component** (`components/car-model/UpcomingCars.tsx`)

### Mock Data:
- Line ~20-56: 4 mock upcoming cars with placeholder images
  - All images: `/api/placeholder/300/200`

### Form Placeholders:
- Line ~207: Email input placeholder: "Enter your email"

---

## 🔄 **Similar Cars Component** (`components/car-model/SimilarCars.tsx`)

### Mock Data:
- Line ~27-99: 5 mock similar cars with placeholder images
  - All images: `/api/placeholder/300/200`

---

## 🎥 **Brand YouTube Component** (`components/brand/BrandYouTube.tsx`)

### Placeholder Data:
- Multiple placeholder video sections (lines ~66-319)
  - Multiple video IDs: 'placeholder'
  - Multiple placeholder related videos arrays

---

## 🖼️ **Hero Section** (`components/car-model/HeroSection.tsx`)

### Image Placeholders:
- Line ~82: Main image fallback: `/api/placeholder/800/600`
- Line ~134: Thumbnail fallback: `/api/placeholder/80/60`
- Line ~179: Mobile image fallback: `/api/placeholder/800/600`

---

## 💳 **EMI Calculator Page** (`components/emi/EMICalculatorPage.tsx`)

### Form Placeholders:
- Line ~199: Down payment input placeholder: "₹ 3,73,815"
- Line ~264: Loan amount input placeholder: "5"
- Line ~277: Tenure input placeholder: "60 months"
- Line ~291: Interest rate input placeholder: "10"
- Line ~352: Name input placeholder: "Full Name as per PAN card"
- Line ~367: Mobile input placeholder: "Mobile Number"

### AD Banner Placeholders:
- Line ~297-300: AD Banner placeholder

---

## 💳 **EMI Calculator Modal** (`components/emi/EMICalculatorModal.tsx`)

### Form Placeholders:
- Line ~235: Down payment input placeholder: "Enter down payment"
- Line ~281: Tenure input placeholder: "months"
- Line ~322: Interest rate input placeholder: "Enter interest rate"
- Line ~361: Name input placeholder: "Full Name as per PAN card"
- Line ~378: Mobile input placeholder: "Mobile Number"

### AD Banner Placeholders:
- Line ~328-330: AD Banner placeholder

---

## 🏢 **Brand Hero Section** (`components/brand/BrandHeroSection.tsx`)

### AD Banner Placeholders (3 total):
1. **Section 3** - AD Banner
   - Line ~168: AD Banner section
   
2. **Section 4** - AD Banner + Alternative Brands
   - Line ~308: AD Banner section
   
3. **Section 7** - AD Banner + Brand FAQ
   - Line ~469: AD Banner section

---

## 📝 **Feedback Components**

### Feedback Section (`components/car-model/FeedbackSection.tsx`):
- Line ~43: Textarea placeholder: "Tell us what you think about this car page..."
- Line ~59: Name input placeholder: "Enter your name"
- Line ~75: Email input placeholder: "Enter your email"

### Feedback Box (`components/brand/FeedbackBox.tsx`):
- Line ~112: Name input placeholder: "Enter your full name"
- Line ~131: Email input placeholder: "Enter your email address"
- Line ~163: Textarea placeholder: "Share your thoughts about our {brandName} brand page..."

---

## 🎨 **Other Components**

### Car Comparison Section (`components/car-model/CarComparisonSection.tsx`):
- Line ~38-97: Mock comparison cars data
  - Images: `/api/placeholder/300/200`

### Latest Car News (`components/home/LatestCarNews.tsx`):
- Line ~59, 63: Image fallback: `/api/placeholder/400/300`
- Line ~146: Conditional rendering check for placeholder images

### Article Renderer (`components/news/ArticleRenderer.tsx`):
- Line ~95: Image fallback: `/api/placeholder/800/600`
- Line ~103-104: Error fallback to placeholder

### Brand Cars List (`components/brand/BrandCarsList.tsx`):
- Line ~153: Car image fallback: `/car-placeholder.jpg`

### City Selector (`components/common/CitySelector.tsx`):
- Line ~111: Input placeholder: "Type your Pincode or City"

### Car Filters (`components/cars/CarFilters.tsx`):
- Line ~195: Min price input placeholder: "Min"
- Line ~203: Max price input placeholder: "Max"

### Color Section (`components/home/ColorSection.tsx`):
- Line ~79: Comment: "Placeholder car silhouette"

### Hero Section (`components/home/HeroSection.tsx`):
- Line ~36: Search input placeholder: "Search for cars by brand, model, or features..."

---

## 📊 **Summary Statistics**

### Total AD Banner Placeholders: **~30+**
- Car Model Page: 6
- Variant Page: 5
- Price Breakup Page: 5
- Compare Page: 4
- News Article Page: 2
- Brand Hero Section: 3
- News Listing: 1
- EMI Calculator: 2
- Other: Multiple

### Total Mock/Static Data Sections: **~15+**
- Variant Page: Complete mock variant data
- AI Search: Complete car database
- News Listing: Mock articles array
- Upcoming Cars: Mock cars array
- Similar Cars: Mock cars array
- Car Comparison: Mock comparison data
- YouTube Videos: Placeholder video data
- Brand YouTube: Multiple placeholder sections

### Total Image Placeholders: **~50+**
- `/api/placeholder/800/600` - Large images
- `/api/placeholder/400/300` - Medium images
- `/api/placeholder/300/200` - Small images
- `/api/placeholder/50/50` - Thumbnails
- `/api/placeholder/80/60` - Small thumbnails
- `/car-placeholder.jpg` - Car placeholders

### Total Form Placeholders: **~25+**
- Search inputs
- Feedback forms
- EMI calculator forms
- Contact forms

---

## 🎯 **Priority Recommendations**

### High Priority (User-Facing):
1. **AD Banners** - Replace all 30+ AD banner placeholders with actual ad integration
2. **Mock Car Data** - Replace AI Search and Similar Cars mock data with real API calls
3. **Image Placeholders** - Ensure all images have proper fallbacks or remove placeholder references

### Medium Priority:
1. **News Mock Data** - Replace mock news articles with real data
2. **YouTube Placeholders** - Replace placeholder video data with real YouTube integration
3. **Upcoming Cars** - Replace mock data with real upcoming cars API

### Low Priority (Internal):
1. **Form Placeholders** - These are fine as they guide user input
2. **Error Fallbacks** - Image error fallbacks are acceptable

---

**Last Updated:** $(date)
**Total Placeholder Sections Found:** 100+

