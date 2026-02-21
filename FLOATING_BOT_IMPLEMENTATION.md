# 🤖 Floating AI Bot with Quirky Bits - Implementation

## Design Concept

A floating bot icon (bottom-right) that:
1. **Idle State:** Pulsing bot icon with notification badge
2. **Hover:** Expands to show quirky bit
3. **Click:** Opens AI chat with context

---

## Visual Flow

### State 1: Idle (Floating Icon)
```
                                    ┌─────┐
                                    │ 🤖  │ ← Pulsing
                                    │  1  │ ← Badge (new fact)
                                    └─────┘
```

### State 2: Hover (Expanded Card)
```
┌──────────────────────────────────────────┐
│ 🤖 Did you know?                    [×]  │
│                                          │
│ Hyundai is planning to launch 26 new    │
│ cars in India by 2027, including 6 EVs! │
│                                          │
│ [💬 Tell me more →]                      │
└──────────────────────────────────────────┘
                    ↑
              ┌─────┐
              │ 🤖  │
              └─────┘
```

### State 3: Click (Navigate to AI Chat)
```
Opens: /ai-chat?context=Tell me more about Hyundai
```

---

## Implementation

### 1. **React Component**

```tsx
// components/FloatingAIBot.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingAIBotProps {
    type: 'brand' | 'model' | 'variant'
    id: string
    name: string // Brand/Model/Variant name
}

export function FloatingAIBot({ type, id, name }: FloatingAIBotProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [quirkyBit, setQuirkyBit] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    
    // Fetch quirky bit on mount
    useEffect(() => {
        fetch(`/api/quirky-bit/${type}/${id}`)
            .then(res => res.json())
            .then(data => {
                setQuirkyBit(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [type, id])
    
    const handleChatClick = () => {
        if (!quirkyBit) return
        
        // Navigate to AI chat with pre-filled context
        router.push({
            pathname: '/ai-chat',
            query: {
                message: quirkyBit.chatContext,
                autoSend: 'true'
            }
        })
    }
    
    if (loading || !quirkyBit) return null
    
    return (
        <div className="floating-ai-bot">
            {/* Floating Bot Icon */}
            <motion.div
                className="bot-icon"
                onHoverStart={() => setIsExpanded(true)}
                onHoverEnd={() => setIsExpanded(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="bot-avatar">
                    🤖
                </div>
                <div className="notification-badge">1</div>
            </motion.div>
            
            {/* Expanded Card */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="quirky-card"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="card-header">
                            <span className="ai-icon">🤖</span>
                            <span className="label">Did you know?</span>
                            <button 
                                className="close-btn"
                                onClick={() => setIsExpanded(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <p className="quirky-text">
                            {quirkyBit.text}
                        </p>
                        
                        <button 
                            className="chat-cta"
                            onClick={handleChatClick}
                        >
                            💬 {quirkyBit.ctaText} →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
```

---

### 2. **Styling (CSS)**

```css
/* styles/floating-ai-bot.css */

.floating-ai-bot {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
}

/* Bot Icon */
.bot-icon {
    position: relative;
    width: 64px;
    height: 64px;
    cursor: pointer;
}

.bot-avatar {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
    }
}

.notification-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 24px;
    height: 24px;
    background: #ff4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
    border: 2px solid white;
    animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
}

/* Expanded Card */
.quirky-card {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 320px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    padding: 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.ai-icon {
    font-size: 20px;
}

.label {
    font-size: 14px;
    font-weight: 600;
    color: #667eea;
    flex: 1;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #333;
}

.quirky-text {
    font-size: 15px;
    line-height: 1.5;
    color: #333;
    margin: 12px 0;
}

.chat-cta {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.chat-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .floating-ai-bot {
        bottom: 16px;
        right: 16px;
    }
    
    .quirky-card {
        width: calc(100vw - 32px);
        max-width: 320px;
        right: -8px;
    }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    .quirky-card {
        background: #1a1a1a;
        border-color: #333;
    }
    
    .quirky-text {
        color: #e0e0e0;
    }
    
    .close-btn {
        color: #666;
    }
    
    .close-btn:hover {
        color: #ccc;
    }
}
```

---

### 3. **Integration in Pages**

```tsx
// pages/brand/[slug].tsx

import { FloatingAIBot } from '@/components/FloatingAIBot'

export default function BrandPage({ brand }) {
    return (
        <div>
            <h1>{brand.name} Cars</h1>
            <p>{brand.description}</p>
            
            {/* Models list */}
            <ModelList models={brand.models} />
            
            {/* Floating AI Bot */}
            <FloatingAIBot 
                type="brand" 
                id={brand.id} 
                name={brand.name}
            />
        </div>
    )
}
```

```tsx
// pages/model/[slug].tsx

export default function ModelPage({ model }) {
    return (
        <div>
            <h1>{model.brand.name} {model.name}</h1>
            
            {/* Variants */}
            <VariantList variants={model.variants} />
            
            {/* Floating AI Bot */}
            <FloatingAIBot 
                type="model" 
                id={model.id} 
                name={`${model.brand.name} ${model.name}`}
            />
        </div>
    )
}
```

```tsx
// pages/variant/[slug].tsx

export default function VariantPage({ variant }) {
    return (
        <div>
            <h1>{variant.brand.name} {variant.model.name} {variant.name}</h1>
            
            {/* Specs */}
            <SpecsTable specs={variant.specs} />
            
            {/* Floating AI Bot */}
            <FloatingAIBot 
                type="variant" 
                id={variant.id} 
                name={`${variant.brand.name} ${variant.model.name} ${variant.name}`}
            />
        </div>
    )
}
```

---

### 4. **Backend API** (Same as before)

```typescript
// backend/server/routes/quirky-bit.ts

import { Router } from 'express'
import Groq from 'groq-sdk'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.get('/:type/:id', async (req, res) => {
    const { type, id } = req.params
    
    try {
        // Fetch entity data
        let context = ''
        if (type === 'brand') {
            const brand = await Brand.findById(id)
            context = `Brand: ${brand.name}`
        } else if (type === 'model') {
            const model = await Model.findById(id).populate('brand')
            context = `${model.brand.name} ${model.name}`
        } else if (type === 'variant') {
            const variant = await Variant.findById(id).populate('model brand')
            context = `${variant.brand.name} ${variant.model.name} ${variant.name}`
        }
        
        // Generate quirky bit
        const prompt = `Generate ONE quirky, interesting fact about ${context} for Indian car buyers.

Requirements:
- Exactly 1-2 sentences
- Include specific numbers/dates if relevant
- Make it surprising or valuable
- Focus on: upcoming launches, waiting periods, popularity, unique features, value proposition

Examples:
- "Hyundai is planning to launch 26 new cars in India by 2027, including 6 EVs!"
- "Creta has a 2-3 month waiting period and is India's best-selling compact SUV"
- "This variant offers the best value with panoramic sunroof and ventilated seats at ₹17.42L"

Generate quirky fact:`

        const response = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: 'You are a quirky car facts generator for Indian market.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 100,
            temperature: 0.8
        })
        
        const text = response.choices[0]?.message?.content?.trim() || ''
        
        res.json({
            text,
            ctaText: type === 'brand' ? 'Tell me more' : 
                     type === 'model' ? `Ask about ${context.split(' ').pop()}` :
                     'Compare variants',
            chatContext: `Tell me more about ${context}`
        })
        
    } catch (error) {
        console.error('Quirky bit error:', error)
        res.status(500).json({ error: 'Failed to generate quirky bit' })
    }
})

export default router
```

---

## Features

✅ **Floating Icon** - Bottom-right, always visible
✅ **Pulsing Animation** - Draws attention
✅ **Notification Badge** - Shows "1" (new fact)
✅ **Hover to Expand** - Smooth animation
✅ **Click to Chat** - Opens AI with context
✅ **Mobile Responsive** - Works on all devices
✅ **Dark Mode** - Supports dark theme

---

**Want me to implement this now?** 🚀
