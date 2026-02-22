'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function FloatingWhatsApp() {
    const [isVisible, setIsVisible] = useState(true)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [hasMoved, setHasMoved] = useState(false)

    const phoneNumber = '919945210466'
    const message = encodeURIComponent('Hi Assad Motors! I would like to know more about your cars.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    useEffect(() => {
        // Initialize position on right side
        if (typeof window !== 'undefined') {
            const savedPos = localStorage.getItem('whatsapp-position')
            if (savedPos) {
                try {
                    const parsed = JSON.parse(savedPos)
                    setPosition(parsed)
                } catch (e) {
                    setPosition({
                        x: window.innerWidth - 80,
                        y: window.innerHeight - 150
                    })
                }
            } else {
                setPosition({
                    x: window.innerWidth - 80,
                    y: window.innerHeight - 150
                })
            }
        }
    }, [])

    const handleStart = (clientX: number, clientY: number) => {
        setIsDragging(true)
        setHasMoved(false)
        setDragStart({
            x: clientX - position.x,
            y: clientY - position.y
        })
    }

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging) return

        setHasMoved(true)
        let newX = clientX - dragStart.x
        let newY = clientY - dragStart.y

        // Boundary checks
        if (typeof window !== 'undefined') {
            const margin = 10
            newX = Math.max(margin, Math.min(newX, window.innerWidth - 70))
            newY = Math.max(margin, Math.min(newY, window.innerHeight - 70))
        }

        setPosition({ x: newX, y: newY })
    }

    const handleEnd = () => {
        if (isDragging) {
            localStorage.setItem('whatsapp-position', JSON.stringify(position))
            setIsDragging(false)
        }
    }

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY)
        const onEnd = () => handleEnd()

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('mouseup', onEnd)
            window.addEventListener('touchmove', onTouchMove)
            window.addEventListener('touchend', onEnd)
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onEnd)
            window.removeEventListener('touchmove', onTouchMove)
            window.removeEventListener('touchend', onEnd)
        }
    }, [isDragging, position])

    if (!isVisible) return null

    return (
        <div
            className={`fixed z-[100] group select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                touchAction: 'none'
            }}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        >
            <div className="relative">
                {/* Highlight Glow Effect */}
                <div className="absolute inset-0 bg-[#25D366] rounded-full blur-md opacity-40 animate-pulse"></div>

                {/* Close Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setIsVisible(false)
                    }}
                    className="absolute -top-1 -right-1 bg-white text-gray-500 hover:text-red-600 rounded-full p-1 shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200 z-[101] hover:scale-110"
                    title="Remove"
                >
                    <X size={14} strokeWidth={3} />
                </button>

                {/* WhatsApp Icon */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                        if (hasMoved) e.preventDefault()
                    }}
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white/20 transition-all duration-300 ${isDragging ? 'scale-110 shadow-emerald-500/50' : 'hover:scale-115'}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className="w-8 h-8 fill-current"
                    >
                        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.906 15.906 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.014-3.168 2.28-.846.18-1.95.324-5.67-1.218-4.762-1.972-7.824-6.81-8.062-7.126-.228-.316-1.918-2.556-1.918-4.876s1.214-3.458 1.644-3.932c.43-.474.94-.592 1.252-.592.312 0 .624.002.898.016.288.014.674-.11 1.054.804.39.94 1.328 3.244 1.444 3.478.118.234.196.508.04.818-.156.312-.234.508-.468.782-.234.274-.492.612-.702.82-.234.234-.478.488-.206.958.274.468 1.216 2.006 2.612 3.25 1.794 1.598 3.306 2.094 3.774 2.328.468.234.742.196 1.016-.118.274-.312 1.174-1.37 1.488-1.838.312-.468.626-.39 1.056-.234.43.156 2.734 1.29 3.202 1.526.468.234.78.352.898.546.118.196.118 1.126-.274 2.228z" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

