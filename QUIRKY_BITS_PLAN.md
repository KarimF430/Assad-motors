# 🤖 Contextual AI Quirky Bits - Implementation Plan

## Concept

Show AI-generated "quirky bits" (interesting facts/news) on Brand, Model, and Variant pages that:
1. Catch user attention with real-time insights
2. Link to AI chat with pre-filled context
3. Encourage engagement and exploration

---

## Visual Design

### Brand Page Example (Hyundai):
```
┌─────────────────────────────────────────────┐
│ 🤖 Did you know?                            │
│                                             │
│ Hyundai is planning to launch 26 new       │
│ cars in India by 2027, including 6 EVs!    │
│                                             │
│ [💬 Tell me more →]                         │
└─────────────────────────────────────────────┘
```

### Model Page Example (Creta):
```
┌─────────────────────────────────────────────┐
│ 🤖 Quirky Bit                               │
│                                             │
│ Creta is India's best-selling compact SUV  │
│ with 2-3 month waiting period. New         │
│ facelift launched Nov 2024!                │
│                                             │
│ [💬 Ask AI about Creta →]                   │
└─────────────────────────────────────────────┘
```

### Variant Page Example (Creta SX):
```
┌─────────────────────────────────────────────┐
│ 🤖 AI Insight                               │
│                                             │
│ This variant offers best value with        │
│ panoramic sunroof, 10.25" screen, and      │
│ ventilated seats at ₹17.42L                │
│                                             │
│ [💬 Compare with other variants →]          │
└─────────────────────────────────────────────┘
```

---

## Implementation Strategy

### 1. **Backend API: Generate Quirky Bits**

Create endpoint: `GET /api/quirky-bit/:type/:id`

```typescript
// backend/server/routes/quirky-bit.ts

export async function getQuirkyBit(req, res) {
    const { type, id } = req.params // type: brand/model/variant
    
    // Fetch relevant data
    let context = ''
    if (type === 'brand') {
        const brand = await Brand.findById(id)
        context = `Brand: ${brand.name}`
    } else if (type === 'model') {
        const model = await Model.findById(id).populate('brand')
        context = `Car: ${model.brand.name} ${model.name}`
    } else if (type === 'variant') {
        const variant = await Variant.findById(id).populate('model brand')
        context = `Variant: ${variant.brand.name} ${variant.model.name} ${variant.name}`
    }
    
    // Generate quirky bit using Groq
    const quirkyBit = await generateQuirkyBit(context, type)
    
    res.json({
        text: quirkyBit.text,
        ctaText: quirkyBit.cta,
        chatContext: quirkyBit.chatContext
    })
}

async function generateQuirkyBit(context: string, type: string) {
    const prompt = `Generate a quirky, interesting fact about ${context}.
    
Requirements:
- 1-2 sentences max
- Include numbers/dates if relevant
- Make it engaging and surprising
- Focus on: launches, waiting periods, popularity, unique features
- Use Indian context

Examples:
- "Hyundai is planning to launch 26 new cars in India by 2027, including 6 EVs!"
- "Creta is India's best-selling compact SUV with 2-3 month waiting period"
- "This variant offers best value with panoramic sunroof at ₹17.42L"

Generate quirky bit:`

    const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
            { role: 'system', content: 'You are a quirky car facts generator.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.8 // Higher for creativity
    })
    
    const text = response.choices[0]?.message?.content || ''
    
    return {
        text,
        cta: type === 'brand' ? 'Tell me more' : 
             type === 'model' ? 'Ask AI about this car' :
             'Compare variants',
        chatContext: `Tell me more about ${context}`
    }
}
```

---

### 2. **Frontend Component: QuirkyBit**

```tsx
// components/QuirkyBit.tsx

interface QuirkyBitProps {
    type: 'brand' | 'model' | 'variant'
    id: string
}

export function QuirkyBit({ type, id }: QuirkyBitProps) {
    const [quirkyBit, setQuirkyBit] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        fetch(`/api/quirky-bit/${type}/${id}`)
            .then(res => res.json())
            .then(data => {
                setQuirkyBit(data)
                setLoading(false)
            })
    }, [type, id])
    
    if (loading) return <QuirkyBitSkeleton />
    if (!quirkyBit) return null
    
    const handleClick = () => {
        // Navigate to AI chat with pre-filled context
        router.push({
            pathname: '/ai-chat',
            query: {
                context: quirkyBit.chatContext,
                autoSend: 'true'
            }
        })
    }
    
    return (
        <div className="quirky-bit-card">
            <div className="quirky-bit-header">
                <span className="ai-icon">🤖</span>
                <span className="label">Did you know?</span>
            </div>
            
            <p className="quirky-text">
                {quirkyBit.text}
            </p>
            
            <button 
                onClick={handleClick}
                className="quirky-cta"
            >
                💬 {quirkyBit.ctaText} →
            </button>
        </div>
    )
}
```

---

### 3. **Styling: Modern & Eye-Catching**

```css
/* styles/quirky-bit.css */

.quirky-bit-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 20px;
    color: white;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    margin: 24px 0;
    position: relative;
    overflow: hidden;
}

.quirky-bit-card::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
}

.quirky-bit-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.ai-icon {
    font-size: 24px;
    animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
}

.label {
    font-size: 14px;
    font-weight: 600;
    opacity: 0.9;
}

.quirky-text {
    font-size: 16px;
    line-height: 1.5;
    margin: 12px 0;
    font-weight: 500;
}

.quirky-cta {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.quirky-cta:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

---

### 4. **Integration in Pages**

#### Brand Page:
```tsx
// pages/brand/[slug].tsx

export default function BrandPage({ brand }) {
    return (
        <div>
            <h1>{brand.name} Cars</h1>
            <p>{brand.description}</p>
            
            {/* Quirky Bit */}
            <QuirkyBit type="brand" id={brand.id} />
            
            {/* Rest of content */}
            <ModelList models={brand.models} />
        </div>
    )
}
```

#### Model Page:
```tsx
// pages/model/[slug].tsx

export default function ModelPage({ model }) {
    return (
        <div>
            <h1>{model.brand.name} {model.name}</h1>
            
            {/* Quirky Bit */}
            <QuirkyBit type="model" id={model.id} />
            
            {/* Variants */}
            <VariantList variants={model.variants} />
        </div>
    )
}
```

#### Variant Page:
```tsx
// pages/variant/[slug].tsx

export default function VariantPage({ variant }) {
    return (
        <div>
            <h1>{variant.brand.name} {variant.model.name} {variant.name}</h1>
            
            {/* Quirky Bit */}
            <QuirkyBit type="variant" id={variant.id} />
            
            {/* Specs */}
            <SpecsTable specs={variant.specs} />
        </div>
    )
}
```

---

### 5. **AI Chat Integration**

When user clicks "Tell me more":

```tsx
// pages/ai-chat.tsx

export default function AIChat() {
    const router = useRouter()
    const { context, autoSend } = router.query
    
    useEffect(() => {
        if (context && autoSend === 'true') {
            // Auto-send the context message
            sendMessage(context as string)
        }
    }, [context, autoSend])
    
    return (
        <div>
            <ChatInterface 
                initialMessage={context as string}
                autoSend={autoSend === 'true'}
            />
        </div>
    )
}
```

---

## Advanced Features

### 1. **Caching for Performance**
```typescript
// Cache quirky bits for 1 hour
const cache = new Map()

async function getQuirkyBit(type, id) {
    const cacheKey = `${type}-${id}`
    
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)
        if (Date.now() - cached.timestamp < 3600000) { // 1 hour
            return cached.data
        }
    }
    
    const data = await generateQuirkyBit(...)
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
}
```

### 2. **A/B Testing Different Styles**
```typescript
const styles = ['gradient', 'minimal', 'playful']
const randomStyle = styles[Math.floor(Math.random() * styles.length)]
```

### 3. **Analytics Tracking**
```typescript
onClick={() => {
    trackEvent('quirky_bit_click', {
        type,
        id,
        text: quirkyBit.text
    })
    handleClick()
}}
```

---

## Example Quirky Bits

### Brand Level:
- "Hyundai is planning to launch 26 new cars in India by 2027, including 6 EVs!"
- "Tata has the most 5-star NCAP rated cars in India (5 models)"
- "Maruti has 50% market share in India with 15,000+ service centers"

### Model Level:
- "Creta is India's best-selling compact SUV with 2-3 month waiting period"
- "Nexon is India's first 5-star NCAP rated car, launched in 2017"
- "City has been India's favorite sedan for 25+ years"

### Variant Level:
- "This SX variant offers best value with panoramic sunroof at ₹17.42L"
- "Top variant includes 10 airbags, ADAS, and 360° camera"
- "Most popular variant - 40% buyers choose this one!"

---

## Implementation Timeline

**Week 1:**
- ✅ Backend API for quirky bits
- ✅ Groq integration for generation
- ✅ Caching system

**Week 2:**
- ✅ Frontend component
- ✅ Styling and animations
- ✅ Integration in Brand/Model/Variant pages

**Week 3:**
- ✅ AI chat pre-fill logic
- ✅ Analytics tracking
- ✅ A/B testing setup

---

**Want me to start implementing this?** 🚀
