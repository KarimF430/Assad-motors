import { createAndBlinkHeadlights } from './headlight-detector'

/**
 * Car honking sound generator using Web Audio API
 * Generates a realistic car horn sound without external files
 */
export function playCarHonk() {
    // Check if AudioContext is supported
    if (typeof window === 'undefined' || !window.AudioContext) {
        console.warn('AudioContext not supported')
        return
    }

    const audioContext = new AudioContext()
    const duration = 0.4 // Horn duration in seconds

    // Create oscillators for a realistic horn sound (two-tone)
    const oscillator1 = audioContext.createOscillator()
    const oscillator2 = audioContext.createOscillator()

    // Create gain nodes for volume control
    const gainNode1 = audioContext.createGain()
    const gainNode2 = audioContext.createGain()
    const masterGain = audioContext.createGain()

    // Set horn frequencies (typical car horn is around 400-500 Hz)
    oscillator1.frequency.value = 420
    oscillator2.frequency.value = 480

    // Use square wave for more horn-like sound
    oscillator1.type = 'square'
    oscillator2.type = 'square'

    // Connect the audio graph
    oscillator1.connect(gainNode1)
    oscillator2.connect(gainNode2)
    gainNode1.connect(masterGain)
    gainNode2.connect(masterGain)
    masterGain.connect(audioContext.destination)

    // Set initial volume
    const now = audioContext.currentTime
    const volume = 0.15 // Lower volume to not be too loud

    // Create envelope (attack-sustain-release)
    masterGain.gain.setValueAtTime(0, now)
    masterGain.gain.linearRampToValueAtTime(volume, now + 0.05) // Quick attack
    masterGain.gain.setValueAtTime(volume, now + duration - 0.1) // Sustain
    masterGain.gain.linearRampToValueAtTime(0, now + duration) // Release

    // Start and stop oscillators
    oscillator1.start(now)
    oscillator2.start(now)
    oscillator1.stop(now + duration)
    oscillator2.stop(now + duration)

    // Clean up
    setTimeout(() => {
        oscillator1.disconnect()
        oscillator2.disconnect()
        gainNode1.disconnect()
        gainNode2.disconnect()
        masterGain.disconnect()
        audioContext.close()
    }, duration * 1000 + 100)
}

/**
 * Combined car interaction: honk + headlight blink
 * This is the main function to call on heart click
 * Now uses dynamic headlight detection and overlay system
 */
export function triggerCarInteraction(imageContainer: HTMLElement | null) {
    if (!imageContainer) return

    // Play honking sound
    playCarHonk()

    // Create and animate headlight overlays
    createAndBlinkHeadlights(imageContainer)
}

/**
 * Preload audio context on user interaction (for better performance)
 * Call this on page load after user gesture
 */
export function initializeAudioContext() {
    if (typeof window === 'undefined') return

    // Create a dummy audio context to unlock it
    // This is necessary for some browsers that require user interaction
    const dummyContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    dummyContext.resume().then(() => {
        dummyContext.close()
    })
}
