# Model Page & Brand Page Header Alignment Report

**Generated**: November 27, 2025  
**Status**: ✅ All headers are properly aligned

---

## Header Alignment Analysis

### Standard Header Pattern
```tsx
className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8"
```

---

## Brand Page Headers (BrandHeroSection.tsx)

| Section | Line | Header Class | Status |
|---------|------|--------------|--------|
| **Upcoming Cars** | 183 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **News** | 335 | `text-xl sm:text-2xl font-bold text-gray-900` | ✅ Correct (in flex container with mb-6 sm:mb-8) |
| **Owner Reviews** | 501 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **Rating (4.2)** | 512 | `text-xl sm:text-2xl font-bold text-gray-900` | ✅ Correct (inline element) |

**Brand Page FAQ**: Handled by standalone `BrandFAQ.tsx` component
- Header: `text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2` ✅

---

## Model Page Headers (CarModelPage.tsx)

| Section | Line | Header Class | Status |
|---------|------|--------------|--------|
| **Highlights** | 1202 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **Price** | 1401 | `text-xl sm:text-2xl font-bold text-gray-900 mb-4` | ✅ Intentionally different |
| **Colours** | 1507 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **Pros & Cons** | 1646 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **Summary** | 1713 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **Engine** | 1827 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **Mileage** | 1965 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **Similar Cars** | 2091 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **News** | 2210 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **Owner Reviews** | 2325 | `text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8` | ✅ Perfect |
| **Rating (4.2)** | 2335 | `text-xl sm:text-2xl font-bold text-gray-900` | ✅ Correct (inline element) |
| **Feedback** | 2547 | `text-xl sm:text-2xl font-bold text-gray-900 mb-2` | ✅ Intentionally different |

**Model Page FAQ**: Handled by standalone `ModelFAQ.tsx` component
- Header: `text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2` ✅

---

## Text Size Consistency

### Headers (h2)
- **Mobile**: `text-xl` (20px / 1.25rem)
- **Desktop**: `sm:text-2xl` (24px / 1.5rem)
- **Weight**: `font-bold` (700)
- **Color**: `text-gray-900`

### Body Text
- **Mobile**: `text-sm` (14px / 0.875rem)
- **Desktop**: `sm:text-base` (16px / 1rem)
- **Color**: `text-gray-600` or `text-gray-700`

### Small Text
- **Mobile**: `text-xs` (12px / 0.75rem)
- **Desktop**: `sm:text-sm` (14px / 0.875rem)
- **Color**: `text-gray-500` or `text-gray-600`

---

## Spacing Consistency

### Section Spacing
```tsx
className="py-6 sm:py-8"  // Standard section padding
```

### Container Spacing
```tsx
className="px-3 sm:px-4 lg:px-6 xl:px-8"  // Standard container padding
```

### Header Bottom Margin
```tsx
className="mb-6 sm:mb-8"  // Standard header margin (24px mobile, 32px desktop)
```

**Exceptions**:
- FAQ headers: `mb-1.5 sm:mb-2` (tighter spacing for FAQ subtitle)
- Price section: `mb-4` (tighter spacing for table)
- Feedback section: `mb-2` (tighter spacing for form)

---

## Special Cases

### 1. News Section Headers
Both Brand and Model pages have News headers inside flex containers:
```tsx
<div className="flex items-center justify-between mb-6 sm:mb-8">
  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
  <div>View All</div>
</div>
```
The margin is on the parent flex container, not the h2 element. ✅ Correct

### 2. Rating Numbers (4.2)
Inline span elements don't need bottom margin:
```tsx
<span className="text-xl sm:text-2xl font-bold text-gray-900">4.2</span>
```
✅ Correct

### 3. FAQ Headers
FAQ sections use tighter spacing for better visual hierarchy:
```tsx
<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
  FAQ
</h2>
<p className="text-sm sm:text-base text-gray-600">
  {count} questions
</p>
```
✅ Correct - Matches across both pages

---

## Alignment Summary

### ✅ **Perfect Alignment Achieved**

**Brand Page**:
- 3 main section headers ✅
- 1 FAQ header (standalone component) ✅
- 1 inline rating element ✅

**Model Page**:
- 10 main section headers ✅
- 1 FAQ header (standalone component) ✅
- 1 inline rating element ✅
- 1 feedback header (intentionally different) ✅

**Total**: 18 headers checked, **100% aligned** ✅

---

## Consistency Checklist

- [x] All section headers use `text-xl sm:text-2xl font-bold text-gray-900`
- [x] Standard headers use `mb-6 sm:mb-8`
- [x] FAQ headers use `mb-1.5 sm:mb-2` (both pages)
- [x] Body text uses `text-sm sm:text-base`
- [x] Small text uses `text-xs sm:text-sm`
- [x] Section padding uses `py-6 sm:py-8`
- [x] Container padding uses `px-3 sm:px-4 lg:px-6 xl:px-8`
- [x] Inline elements don't have bottom margin
- [x] Flex container headers have margin on parent

---

## Recommendations

### ✅ No Changes Needed
All headers and text are properly aligned across Model Page and Brand Page. The implementation follows a consistent design system with intentional variations for specific use cases (FAQ, Price table, Feedback form).

### Future Maintenance
1. **Use the standard pattern** for new sections:
   ```tsx
   <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
     Section Title
   </h2>
   ```

2. **For FAQ-style sections**, use the tighter spacing:
   ```tsx
   <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
     FAQ Title
   </h2>
   ```

3. **For flex containers**, apply margin to parent:
   ```tsx
   <div className="flex items-center justify-between mb-6 sm:mb-8">
     <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Title</h2>
   </div>
   ```

---

## Conclusion

**Status**: ✅ **All headers and text are perfectly aligned**

The Model Page and Brand Page maintain excellent consistency in typography, spacing, and layout. The design system is well-implemented with clear patterns and intentional exceptions where needed.

**Last Verified**: November 27, 2025
