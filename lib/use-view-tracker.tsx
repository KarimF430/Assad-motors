'use client'

import { useEffect } from 'react'
import { useFavourites } from './favourites-context'

interface Car {
    id: string
    name: string
    brand: string
    brandName: string
    image: string
    startingPrice: number
    fuelTypes: string[]
    transmissions: string[]
    seating: number
    launchDate: string
    slug: string
    isNew: boolean
    isPopular: boolean
}

interface CarView {
    count: number
    lastViewed: number
    firstViewed: number
    carData: Car
}

interface ViewTrackingData {
    [carId: string]: CarView
}

const STORAGE_KEY = 'gadizone_car_views'
const VIEW_THRESHOLD = 3 // Auto-add after 3 views
const TIME_WINDOW_DAYS = 30 // Only count views within last 30 days

export function useViewTracker(car: Car | null) {
    const { addFavourite, isFavourite } = useFavourites()

    useEffect(() => {
        if (!car) return

        // Track the view
        const trackView = () => {
            try {
                // Get existing view data
                const stored = localStorage.getItem(STORAGE_KEY)
                const viewData: ViewTrackingData = stored ? JSON.parse(stored) : {}

                const now = Date.now()
                const thirtyDaysAgo = now - (TIME_WINDOW_DAYS * 24 * 60 * 60 * 1000)

                // Clean up old views (older than 30 days)
                Object.keys(viewData).forEach(carId => {
                    if (viewData[carId].lastViewed < thirtyDaysAgo) {
                        delete viewData[carId]
                    }
                })

                // Update or create view record for this car
                if (viewData[car.id]) {
                    // Increment view count
                    viewData[car.id].count += 1
                    viewData[car.id].lastViewed = now
                    viewData[car.id].carData = car // Update car data in case it changed
                } else {
                    // First view
                    viewData[car.id] = {
                        count: 1,
                        firstViewed: now,
                        lastViewed: now,
                        carData: car
                    }
                }

                // Save updated view data
                localStorage.setItem(STORAGE_KEY, JSON.stringify(viewData))

                console.log(`📊 View tracked for ${car.name}: ${viewData[car.id].count} views`)

                // Check if we should auto-add to favourites
                if (viewData[car.id].count >= VIEW_THRESHOLD && !isFavourite(car.id)) {
                    console.log(`🤖 Auto-adding ${car.name} to favourites (${viewData[car.id].count} views)`)

                    // Add to favourites with auto-add flag
                    const carWithFlag = { ...car, isAutoAdded: true }
                    addFavourite(carWithFlag)

                    // Show notification (you can customize this)
                    if (typeof window !== 'undefined' && 'Notification' in window) {
                        // Could use a toast library here instead
                        console.log(`🔔 ${car.name} added to your favourites based on your interest!`)
                    }
                }
            } catch (error) {
                console.error('Error tracking view:', error)
            }
        }

        // Track view on mount
        trackView()
    }, [car?.id]) // Only re-run if car ID changes

    return null
}

// Utility function to get view count for a specific car
export function getViewCount(carId: string): number {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return 0

        const viewData: ViewTrackingData = JSON.parse(stored)
        return viewData[carId]?.count || 0
    } catch (error) {
        console.error('Error getting view count:', error)
        return 0
    }
}

// Utility function to clear all view tracking data
export function clearViewTracking(): void {
    try {
        localStorage.removeItem(STORAGE_KEY)
        console.log('🗑️ View tracking data cleared')
    } catch (error) {
        console.error('Error clearing view tracking:', error)
    }
}
