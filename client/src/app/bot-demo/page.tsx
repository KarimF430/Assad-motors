'use client'

import { FloatingAIBot } from '@/components/FloatingAIBot'

export default function BotDemoPage() {
    // Example: Using a fake brand ID for demo
    const demoBrandId = '507f1f77bcf86cd799439011' // Replace with real ID

    return (
        <div style={{ padding: '40px', minHeight: '100vh' }}>
            <h1>Floating AI Bot Demo</h1>
            <p>Look at the bottom-right corner! 👉</p>

            <div style={{ marginTop: '40px' }}>
                <h2>About Hyundai</h2>
                <p>Hyundai Motor India Limited (HMIL) is the second-largest car manufacturer in India...</p>

                <h3>Popular Models:</h3>
                <ul>
                    <li>Creta - ₹10.87L - ₹20.15L</li>
                    <li>Venue - ₹7.94L - ₹13.48L</li>
                    <li>Verna - ₹11.00L - ₹17.42L</li>
                    <li>i20 - ₹7.04L - ₹11.21L</li>
                </ul>
            </div>

            {/* Floating AI Bot - Check bottom-right! */}
            <FloatingAIBot
                type="brand"
                id={demoBrandId}
                name="Hyundai"
            />
        </div>
    )
}
