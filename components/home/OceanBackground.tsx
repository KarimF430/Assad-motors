'use client'

import { useEffect, useRef, useState } from 'react'

interface Fish {
  id: number
  x: number
  y: number
  speedX: number
  speedY: number
  size: number
  direction: 'left' | 'right'
  type: 'small' | 'medium' | 'large'
}

export default function OceanBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  // const fishesRef = useRef<Fish[]>([]) // Unused
  // const animationFrameRef = useRef<number>() // Unused
  const [mounted, setMounted] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [bubbles, setBubbles] = useState<Array<{ size: number, left: number, top: number, duration: number, delay: number }>>([])

  useEffect(() => {
    setMounted(true)

    // Wait for page to fully load before starting animations
    const handleLoad = () => {
      setPageLoaded(true)
    }

    if (document.readyState === 'complete') {
      // Page already loaded
      setPageLoaded(true)
    } else {
      // Wait for load event
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  useEffect(() => {
    if (!pageLoaded || !containerRef.current) return

    // Initialize bubbles on client side only after page load
    setBubbles(Array.from({ length: 15 }, () => ({
      size: Math.random() * 10 + 5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    })))
  }, [pageLoaded])

  if (!mounted) return null

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-[1]"
      style={{ background: 'transparent', minHeight: '100%' }}
    >
      {/* Small decorative bubbles */}
      <div className="absolute inset-0">
        {bubbles.map((bubble, i) => (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-blue-200/10"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              animation: `float ${bubble.duration}s ease-in-out infinite`,
              animationDelay: `${bubble.delay}s`
            }}
          />
        ))}
      </div>



      <style jsx>{`
        @keyframes whale-hunt {
          0% {
            transform: translate(-200px, 15vh) rotate(0deg);
          }
          15% {
            transform: translate(30vw, 25vh) rotate(-5deg);
          }
          30% {
            transform: translate(60vw, 45vh) rotate(5deg);
          }
          45% {
            transform: translate(85vw, 35vh) rotate(-3deg);
          }
          50% {
            transform: translate(calc(100vw + 200px), 50vh) scaleX(-1) rotate(0deg);
          }
          65% {
            transform: translate(70vw, 60vh) scaleX(-1) rotate(5deg);
          }
          80% {
            transform: translate(40vw, 40vh) scaleX(-1) rotate(-5deg);
          }
          95% {
            transform: translate(10vw, 20vh) scaleX(-1) rotate(3deg);
          }
          100% {
            transform: translate(-200px, 15vh) rotate(0deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }
      `}</style>
    </div>
  )
}
