# 🤖 Floating AI Bot - Integration Guide

## How to Use

### 1. **Brand Page Integration**

```tsx
// app/brand/[slug]/page.tsx

import { FloatingAIBot } from '@/components/FloatingAIBot'

export default async function BrandPage({ params }: { params: { slug: string } }) {
    // Fetch brand data
    const brand = await getBrand(params.slug)
    
    return (
        <div>
            <h1>{brand.name} Cars</h1>
            <p>{brand.description}</p>
            
            {/* Brand content */}
            <BrandModels models={brand.models} />
            
            {/* Floating AI Bot */}
            <FloatingAIBot 
                type="brand" 
                id={brand._id} 
                name={brand.name}
            />
        </div>
    )
}
```

### 2. **Model Page Integration**

```tsx
// app/model/[slug]/page.tsx

import { FloatingAIBot } from '@/components/FloatingAIBot'

export default async function ModelPage({ params }: { params: { slug: string } }) {
    // Fetch model data
    const model = await getModel(params.slug)
    
    return (
        <div>
            <h1>{model.brand.name} {model.name}</h1>
            
            {/* Model content */}
            <ModelVariants variants={model.variants} />
            <ModelSpecs specs={model.specs} />
            
            {/* Floating AI Bot */}
            <FloatingAIBot 
                type="model" 
                id={model._id} 
                name={`${model.brand.name} ${model.name}`}
            />
        </div>
    )
}
```

### 3. **Variant Page Integration**

```tsx
// app/variant/[slug]/page.tsx

import { FloatingAIBot } from '@/components/FloatingAIBot'

export default async function VariantPage({ params }: { params: { slug: string } }) {
    // Fetch variant data
    const variant = await getVariant(params.slug)
    
    return (
        <div>
            <h1>{variant.brand.name} {variant.model.name} {variant.name}</h1>
            
            {/* Variant content */}
            <VariantSpecs specs={variant.specs} />
            <VariantPricing pricing={variant.pricing} />
            
            {/* Floating AI Bot */}
            <FloatingAIBot 
                type="variant" 
                id={variant._id} 
                name={`${variant.brand.name} ${variant.model.name} ${variant.name}`}
            />
        </div>
    )
}
```

---

## Component Props

```typescript
interface FloatingAIBotProps {
    type: 'brand' | 'model' | 'variant'  // Type of entity
    id: string                            // MongoDB ObjectId
    name: string                          // Display name (for fallback)
}
```

---

## Features

### ✅ **Automatic Behavior:**
1. **On Mount:** Fetches quirky bit from API
2. **On Hover:** Expands to show card
3. **On Click (Icon):** Toggles expansion
4. **On Click (CTA):** Navigates to AI chat with context

### ✅ **Responsive:**
- Desktop: 320px wide card
- Tablet: Adjusts to screen width
- Mobile: Full width with padding

### ✅ **Accessible:**
- Keyboard navigation
- Focus indicators
- ARIA labels
- Reduced motion support

### ✅ **Performance:**
- Lazy loads on mount
- Cached API responses (1 hour)
- Framer Motion animations
- Error handling

---

## API Response Format

The component expects this response from `/api/quirky-bit/:type/:id`:

```json
{
  "text": "Hyundai is planning to launch 26 new cars in India by 2027, including 6 EVs!",
  "ctaText": "Tell me more",
  "chatContext": "Tell me more about Hyundai's upcoming cars",
  "type": "brand",
  "entityName": "Hyundai"
}
```

---

## Customization

### Change Colors:

```css
/* FloatingAIBot.css */

.bot-avatar {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

.chat-cta {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Change Position:

```css
.floating-ai-bot {
    bottom: 24px;  /* Change this */
    right: 24px;   /* Change this */
    /* Or use left: 24px for left side */
}
```

### Change Size:

```css
.bot-icon,
.bot-avatar {
    width: 72px;   /* Larger */
    height: 72px;  /* Larger */
}

.bot-emoji {
    font-size: 36px;  /* Larger emoji */
}
```

---

## Troubleshooting

### Bot not showing?
1. Check if API is running: `curl http://localhost:5001/api/quirky-bit/brand/[id]`
2. Check browser console for errors
3. Verify `id` is a valid MongoDB ObjectId

### Card not expanding?
1. Check if Framer Motion is installed: `npm install framer-motion`
2. Verify CSS is imported in component
3. Check browser console for animation errors

### Navigation not working?
1. Verify AI chat page exists at `/ai-chat`
2. Check if `useRouter` is from `next/navigation` (App Router)
3. Ensure query params are handled in AI chat page

---

## Dependencies

Make sure these are installed:

```bash
npm install framer-motion
```

```json
{
  "dependencies": {
    "framer-motion": "^10.0.0",
    "next": "^14.0.0",
    "react": "^18.0.0"
  }
}
```

---

## Example: Full Brand Page

```tsx
// app/brand/[slug]/page.tsx

import { FloatingAIBot } from '@/components/FloatingAIBot'
import { getBrandBySlug } from '@/lib/api'

export default async function BrandPage({ 
    params 
}: { 
    params: { slug: string } 
}) {
    const brand = await getBrandBySlug(params.slug)
    
    if (!brand) {
        return <div>Brand not found</div>
    }
    
    return (
        <main className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    {brand.name} Cars
                </h1>
                <p className="text-lg text-gray-600">
                    {brand.description}
                </p>
            </div>
            
            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brand.models.map(model => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>
            
            {/* Floating AI Bot */}
            <FloatingAIBot 
                type="brand" 
                id={brand._id} 
                name={brand.name}
            />
        </main>
    )
}
```

---

## Testing

### Manual Test:
1. Navigate to a brand/model/variant page
2. Look for floating bot icon (bottom-right)
3. Hover over icon → Card should expand
4. Click "Tell me more" → Should navigate to AI chat

### Automated Test:
```tsx
// __tests__/FloatingAIBot.test.tsx

import { render, screen, waitFor } from '@testing-library/react'
import { FloatingAIBot } from '@/components/FloatingAIBot'

test('renders bot icon', async () => {
    render(<FloatingAIBot type="brand" id="123" name="Hyundai" />)
    
    await waitFor(() => {
        expect(screen.getByText('🤖')).toBeInTheDocument()
    })
})
```

---

**Status:** ✅ **READY TO USE**

Just import and add to your pages!
