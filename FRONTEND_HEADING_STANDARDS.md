# Frontend Heading Standards - Sentence Case

**Date:** November 7, 2025  
**Standard:** All h2 headings should use sentence case (only first word capitalized)  
**Current Status:** Mixed - some use title case, some use sentence case  

---

## 📋 **HEADING AUDIT RESULTS**

### ✅ **CORRECT - Already in Sentence Case:**

#### **Home Page Components:**
1. ✅ `Popular Cars` - `/components/home/PopularCars.tsx`
2. ✅ `New Launches` - `/components/home/NewLaunchedCars.tsx`
3. ✅ `Upcoming Cars` - `/components/home/UpcomingCars.tsx`
4. ✅ `Cars by Budget` - `/components/home/CarsByBudget.tsx`
5. ✅ `Popular Brands` - `/components/home/BrandSection.tsx`
6. ✅ `Popular Comparison` - `/components/home/PopularComparisons.tsx`
7. ✅ `Popular Comparison` - `/components/home/ComparisonBox.tsx`
8. ✅ `Latest Car News` - `/components/home/LatestCarNews.tsx`
9. ✅ `Latest Videos` - `/components/home/YouTubeVideoPlayer.tsx`
10. ✅ `Similar cars to {model}` - `/components/car-model/CarModelPage.tsx` (JUST FIXED)

#### **Model Page Components:**
11. ✅ `Key Features` - `/components/variant/VariantPage.tsx`
12. ✅ `Compare With Similar Cars` - `/components/car-model/CarModelPage.tsx`

---

### ⚠️ **NEEDS FIXING - Currently in Title Case:**

#### **Home Page Components:**
1. ❌ `Quick Actions` → Should be: `Quick actions`
   - File: `/components/home/QuickActions.tsx` (line 54)

2. ❌ `Popular Car Brands` → Should be: `Popular car brands`
   - File: `/components/home/PopularBrands.tsx` (line 17)

3. ❌ `Latest Car News & Reviews` → Should be: `Latest car news & reviews`
   - File: `/components/home/LatestNews.tsx` (line 71)

4. ❌ `Featured Offers & Deals` → Should be: `Featured offers & deals`
   - File: `/components/home/FeaturedOffers.tsx` (line 56)

5. ❌ `Advertisement Space` → Should be: `Advertisement space`
   - File: `/components/home/AdBanner.tsx` (line 7)

6. ❌ `Car Buying Consultation` → Should be: `Car buying consultation`
   - File: `/components/home/ConsultancyAd.tsx` (line 38)

#### **Model Page Components:**
7. ❌ `{Brand} {Model} Highlights` → Should be: `{Brand} {Model} highlights`
   - File: `/components/car-model/CarModelPage.tsx` (line 1254)

8. ❌ `{Brand} {Model} Price` → Should be: `{Brand} {Model} price`
   - File: `/components/car-model/CarModelPage.tsx` (line 1438)

9. ❌ `{Brand} {Model} Colours` → Should be: `{Brand} {Model} colours`
   - File: `/components/car-model/CarModelPage.tsx` (line 1547)

10. ❌ `{Brand} {Model} Pros & Cons` → Should be: `{Brand} {Model} pros & cons`
    - File: `/components/car-model/CarModelPage.tsx` (line 1669)

11. ❌ `{Brand} {Model} Summary` → Should be: `{Brand} {Model} summary`
    - File: `/components/car-model/CarModelPage.tsx` (line 1736)

12. ❌ `{Brand} {Model} Engine` → Should be: `{Brand} {Model} engine`
    - File: `/components/car-model/CarModelPage.tsx` (line 1852)

13. ❌ `{Brand} {Model} Mileage` → Should be: `{Brand} {Model} mileage`
    - File: `/components/car-model/CarModelPage.tsx` (line 1990)

#### **Variant Page Components:**
14. ❌ `{Brand} {Model} {Variant} Info` → Should be: `{Brand} {Model} {Variant} info`
    - File: `/components/variant/VariantPage.tsx` (line 986)

15. ❌ `{Brand} {Variant} {Model} Specifications & Features` → Should be: `{Brand} {Variant} {Model} specifications & features`
    - File: `/components/variant/VariantPage.tsx` (line 996)

16. ❌ `More {Brand} {Model} {Variant} Variants` → Should be: `More {Brand} {Model} {Variant} variants`
    - File: `/components/variant/VariantPage.tsx` (line 2373)

17. ❌ `{Brand} {Model} {Variant} Summary` → Should be: `{Brand} {Model} {Variant} summary`
    - File: `/components/variant/VariantPage.tsx` (line 2451)

18. ❌ `{Brand} {Model} {Variant} Engine` → Should be: `{Brand} {Model} {Variant} engine`
    - File: `/components/variant/VariantPage.tsx` (line 2562)

19. ❌ `{Brand} {Model} {Variant} Mileage` → Should be: `{Brand} {Model} {Variant} mileage`
    - File: `/components/variant/VariantPage.tsx` (line 2682)

20. ❌ `{Brand} {Model} {Variant} Price across India` → Should be: `{Brand} {Model} {Variant} price across India`
    - File: `/components/variant/VariantPage.tsx` (line 2728)

21. ❌ `Share Your Feedback` → Should be: `Share your feedback`
    - File: `/components/variant/VariantPage.tsx` (line 2789)
    - File: `/components/car-model/FeedbackSection.tsx` (line 22)

#### **Other Components:**
22. ❌ `Similar cars to {carName}` → Already correct but check consistency
    - File: `/components/car-model/SimilarCarsSection.tsx` (line 28)

23. ❌ `{carName} Colours` → Should be: `{carName} colours`
    - File: `/components/car-model/ColorOptions.tsx` (line 38)

---

## 📊 **SUMMARY**

### **Total Headings Audited:** 33
- ✅ **Correct (Sentence case):** 12 (36%)
- ❌ **Needs fixing (Title case):** 21 (64%)

---

## 🎯 **SENTENCE CASE RULES**

### **Standard Format:**
```
Capitalize only:
1. First word of the heading
2. Proper nouns (brand names, model names, city names)
3. Acronyms (SUV, MPV, etc.)
```

### **Examples:**

#### ✅ **Correct:**
- `Popular cars`
- `New launches`
- `Hyundai Creta highlights`
- `Similar cars to Creta`
- `Latest car news`

#### ❌ **Incorrect:**
- `Popular Cars` (unnecessary capitalization)
- `New Launches` (unnecessary capitalization)
- `Hyundai Creta Highlights` (unnecessary capitalization)
- `Similar Cars to Creta` (unnecessary capitalization)
- `Latest Car News` (unnecessary capitalization)

---

## 🔧 **FIXES NEEDED**

### **Priority 1: Model Page (High Traffic)**
Files to update:
1. `/components/car-model/CarModelPage.tsx` - 6 headings
2. `/components/variant/VariantPage.tsx` - 8 headings

### **Priority 2: Home Page (High Visibility)**
Files to update:
1. `/components/home/QuickActions.tsx`
2. `/components/home/PopularBrands.tsx`
3. `/components/home/LatestNews.tsx`
4. `/components/home/FeaturedOffers.tsx`
5. `/components/home/AdBanner.tsx`
6. `/components/home/ConsultancyAd.tsx`

### **Priority 3: Other Components**
Files to update:
1. `/components/car-model/FeedbackSection.tsx`
2. `/components/car-model/ColorOptions.tsx`

---

## 📝 **IMPLEMENTATION PLAN**

### **Phase 1: Model & Variant Pages** ✅ (In Progress)
- [x] Fix "Similar cars to {model}" - DONE
- [ ] Fix all CarModelPage.tsx headings (6 remaining)
- [ ] Fix all VariantPage.tsx headings (8 remaining)

### **Phase 2: Home Page Components**
- [ ] Fix QuickActions.tsx
- [ ] Fix PopularBrands.tsx
- [ ] Fix LatestNews.tsx
- [ ] Fix FeaturedOffers.tsx
- [ ] Fix AdBanner.tsx
- [ ] Fix ConsultancyAd.tsx

### **Phase 3: Other Components**
- [ ] Fix FeedbackSection.tsx
- [ ] Fix ColorOptions.tsx

---

## 🎨 **DESIGN CONSISTENCY**

### **Typography Standards:**

#### **H2 Headings (Section Titles):**
```tsx
<h2 className="text-2xl font-bold text-gray-900">
  Heading in sentence case
</h2>
```

#### **H3 Headings (Subsections):**
```tsx
<h3 className="text-xl font-semibold text-gray-800">
  Subheading in sentence case
</h3>
```

#### **H4 Headings (Minor Sections):**
```tsx
<h4 className="text-lg font-medium text-gray-700">
  Minor heading in sentence case
</h4>
```

---

## ✅ **BENEFITS OF SENTENCE CASE**

1. **Modern & Clean:** Sentence case looks more contemporary and less formal
2. **Better Readability:** Easier to scan and read quickly
3. **Industry Standard:** Most modern websites use sentence case
4. **SEO Friendly:** More natural for search engines
5. **Consistent UX:** Creates uniform experience across the site

---

## 🚀 **NEXT STEPS**

1. **Review this document** - Confirm the standard
2. **Approve changes** - Get sign-off on sentence case standard
3. **Implement fixes** - Update all 21 headings
4. **Test thoroughly** - Verify no broken layouts
5. **Document standard** - Add to style guide

---

**Status:** 📋 **AUDIT COMPLETE**  
**Next Action:** Implement fixes for all 21 headings
