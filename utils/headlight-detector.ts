/**
 * Dynamic Headlight Detection and Overlay System
 * Automatically detects and creates overlay elements at headlight positions
 */

export interface HeadlightPosition {
    x: number // percentage from left (0-100)
    y: number // percentage from top (0-100)
}

export interface HeadlightOverlay {
    element: HTMLDivElement
    position: HeadlightPosition
}

/**
 * Detect headlight positions using heuristic algorithm
 * Assumes front-facing car view with standard automotive proportions
 */
export function detectHeadlightPositions(imageElement: HTMLElement): HeadlightPosition[] {
    // For most front-facing car images, headlights are positioned at:
    // - Horizontally: ~20-25% from each edge (left: 22%, right: 78%)
    // - Vertically: ~65-70% from top (at 68%)

    const positions: HeadlightPosition[] = [
        { x: 22, y: 68 },  // Left headlight
        { x: 78, y: 68 }   // Right headlight
    ]

    return positions
}

/**
 * Create headlight overlay elements with glow effect
 */
export function createHeadlightOverlays(
    container: HTMLElement,
    positions: HeadlightPosition[]
): HeadlightOverlay[] {
    const overlays: HeadlightOverlay[] = []

    // Get actual dimensions for sizing
    const rect = container.getBoundingClientRect()
    const overlaySize = Math.min(rect.width, rect.height) * 0.08 // 8% of smaller dimension

    positions.forEach((position) => {
        // Create overlay div
        const overlay = document.createElement('div')
        overlay.className = 'headlight-overlay'

        // Position using percentages for responsiveness
        overlay.style.position = 'absolute'
        overlay.style.left = `${position.x}%`
        overlay.style.top = `${position.y}%`
        overlay.style.transform = 'translate(-50%, -50%)' // Center the overlay
        overlay.style.width = `${overlaySize}px`
        overlay.style.height = `${overlaySize}px`
        overlay.style.pointerEvents = 'none' // Don't interfere with clicks
        overlay.style.zIndex = '10'

        // Radial gradient for realistic headlight glow
        overlay.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 231, 122, 0.8) 30%, rgba(255, 231, 122, 0.4) 60%, transparent 100%)'
        overlay.style.borderRadius = '50%'
        overlay.style.filter = 'blur(3px)'
        overlay.style.opacity = '0'

        // Add to container
        container.appendChild(overlay)

        overlays.push({
            element: overlay,
            position
        })
    })

    return overlays
}

/**
 * Trigger headlight blink animation
 */
export function triggerHeadlightBlink(overlays: HeadlightOverlay[]): void {
    overlays.forEach((overlay) => {
        // Remove any existing animation
        overlay.element.classList.remove('headlight-glow')

        // Force reflow to restart animation
        void overlay.element.offsetWidth

        // Add animation class
        overlay.element.classList.add('headlight-glow')
    })

    // Remove animation class after completion (1 second)
    setTimeout(() => {
        overlays.forEach((overlay) => {
            overlay.element.classList.remove('headlight-glow')
        })
    }, 1000)
}

/**
 * Remove headlight overlays from DOM
 */
export function removeHeadlightOverlays(overlays: HeadlightOverlay[]): void {
    overlays.forEach((overlay) => {
        if (overlay.element && overlay.element.parentNode) {
            overlay.element.parentNode.removeChild(overlay.element)
        }
    })
}

/**
 * Main function: Create overlays and trigger blink effect
 * Returns overlays for later cleanup if needed
 */
export function createAndBlinkHeadlights(imageContainer: HTMLElement): HeadlightOverlay[] {
    // Detect positions
    const positions = detectHeadlightPositions(imageContainer)

    // Create overlays
    const overlays = createHeadlightOverlays(imageContainer, positions)

    // Trigger blink animation
    triggerHeadlightBlink(overlays)

    // Auto-cleanup after animation completes
    setTimeout(() => {
        removeHeadlightOverlays(overlays)
    }, 1200) // Give extra 200ms buffer after 1s animation

    return overlays
}
