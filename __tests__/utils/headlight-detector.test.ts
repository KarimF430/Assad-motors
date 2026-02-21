/**
 * @jest-environment jsdom
 */

import {
    detectHeadlightPositions,
    createHeadlightOverlays,
    triggerHeadlightBlink,
    removeHeadlightOverlays,
    createAndBlinkHeadlights,
    type HeadlightPosition,
    type HeadlightOverlay,
} from '@/utils/headlight-detector'

describe('Headlight Detector', () => {
    describe('detectHeadlightPositions', () => {
        it('should return an array of two headlight positions', () => {
            const mockElement = document.createElement('div')
            const positions = detectHeadlightPositions(mockElement)

            expect(positions).toHaveLength(2)
            expect(positions[0]).toHaveProperty('x')
            expect(positions[0]).toHaveProperty('y')
            expect(positions[1]).toHaveProperty('x')
            expect(positions[1]).toHaveProperty('y')
        })

        it('should return left headlight at approximately 22% from left', () => {
            const mockElement = document.createElement('div')
            const positions = detectHeadlightPositions(mockElement)

            expect(positions[0].x).toBe(22)
            expect(positions[0].y).toBe(68)
        })

        it('should return right headlight at approximately 78% from left', () => {
            const mockElement = document.createElement('div')
            const positions = detectHeadlightPositions(mockElement)

            expect(positions[1].x).toBe(78)
            expect(positions[1].y).toBe(68)
        })
    })

    describe('createHeadlightOverlays', () => {
        let container: HTMLElement
        let positions: HeadlightPosition[]

        beforeEach(() => {
            container = document.createElement('div')
            container.style.width = '800px'
            container.style.height = '600px'
            document.body.appendChild(container)

            positions = [
                { x: 22, y: 68 },
                { x: 78, y: 68 },
            ]
        })

        afterEach(() => {
            document.body.removeChild(container)
        })

        it('should create overlay elements for each position', () => {
            const overlays = createHeadlightOverlays(container, positions)

            expect(overlays).toHaveLength(2)
            expect(container.children).toHaveLength(2)
        })

        it('should create overlays with correct positioning', () => {
            const overlays = createHeadlightOverlays(container, positions)

            expect(overlays[0].element.style.position).toBe('absolute')
            expect(overlays[0].element.style.left).toBe('22%')
            expect(overlays[0].element.style.top).toBe('68%')
        })

        it('should create overlays with glow effect styling', () => {
            const overlays = createHeadlightOverlays(container, positions)

            expect(overlays[0].element.style.borderRadius).toBe('50%')
            expect(overlays[0].element.style.background).toContain('radial-gradient')
            expect(overlays[0].element.style.filter).toBe('blur(3px)')
        })

        it('should create overlays with pointer-events none', () => {
            const overlays = createHeadlightOverlays(container, positions)

            expect(overlays[0].element.style.pointerEvents).toBe('none')
        })

        it('should store position data in overlay objects', () => {
            const overlays = createHeadlightOverlays(container, positions)

            expect(overlays[0].position).toEqual(positions[0])
            expect(overlays[1].position).toEqual(positions[1])
        })
    })

    describe('triggerHeadlightBlink', () => {
        let container: HTMLElement
        let overlays: HeadlightOverlay[]

        beforeEach(() => {
            container = document.createElement('div')
            document.body.appendChild(container)

            const positions: HeadlightPosition[] = [
                { x: 22, y: 68 },
                { x: 78, y: 68 },
            ]
            overlays = createHeadlightOverlays(container, positions)
        })

        afterEach(() => {
            document.body.removeChild(container)
        })

        it('should add headlight-glow class to overlays', () => {
            triggerHeadlightBlink(overlays)

            overlays.forEach((overlay) => {
                expect(overlay.element.classList.contains('headlight-glow')).toBe(true)
            })
        })

        it('should remove headlight-glow class after animation', (done) => {
            triggerHeadlightBlink(overlays)

            setTimeout(() => {
                overlays.forEach((overlay) => {
                    expect(overlay.element.classList.contains('headlight-glow')).toBe(false)
                })
                done()
            }, 1100)
        }, 2000)
    })

    describe('removeHeadlightOverlays', () => {
        let container: HTMLElement
        let overlays: HeadlightOverlay[]

        beforeEach(() => {
            container = document.createElement('div')
            document.body.appendChild(container)

            const positions: HeadlightPosition[] = [
                { x: 22, y: 68 },
                { x: 78, y: 68 },
            ]
            overlays = createHeadlightOverlays(container, positions)
        })

        afterEach(() => {
            if (container.parentNode) {
                document.body.removeChild(container)
            }
        })

        it('should remove all overlay elements from DOM', () => {
            expect(container.children).toHaveLength(2)

            removeHeadlightOverlays(overlays)

            expect(container.children).toHaveLength(0)
        })

        it('should handle overlays with no parent node gracefully', () => {
            removeHeadlightOverlays(overlays)

            // Should not throw error when called again
            expect(() => removeHeadlightOverlays(overlays)).not.toThrow()
        })
    })

    describe('createAndBlinkHeadlights', () => {
        let container: HTMLElement

        beforeEach(() => {
            container = document.createElement('div')
            container.style.width = '800px'
            container.style.height = '600px'
            document.body.appendChild(container)
        })

        afterEach(() => {
            if (container.parentNode) {
                document.body.removeChild(container)
            }
        })

        it('should create overlays and return them', () => {
            const overlays = createAndBlinkHeadlights(container)

            expect(overlays).toHaveLength(2)
            expect(container.children.length).toBeGreaterThan(0)
        })

        it('should automatically clean up overlays after animation', (done) => {
            createAndBlinkHeadlights(container)

            expect(container.children.length).toBeGreaterThan(0)

            setTimeout(() => {
                expect(container.children).toHaveLength(0)
                done()
            }, 1300)
        }, 2000)
    })
})
