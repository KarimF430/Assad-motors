'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    isAutoAdded?: boolean // Flag for auto-added favourites based on viewing behavior
}

interface FavouritesContextType {
    favourites: Car[]
    addFavourite: (car: Car) => void
    removeFavourite: (carId: string) => void
    isFavourite: (carId: string) => boolean
    toggleFavourite: (car: Car) => void
    clearAllFavourites: () => void
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined)

const STORAGE_KEY = 'gadizone_favourites'

// Helper function to normalize fuel types
const normalizeFuelType = (fuel: string): string => {
    const lower = fuel.toLowerCase()
    if (lower === 'petrol') return 'Petrol'
    if (lower === 'diesel') return 'Diesel'
    if (lower === 'cng') return 'CNG'
    if (lower === 'electric') return 'Electric'
    if (lower === 'hybrid') return 'Hybrid'
    return fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase()
}

// Helper function to normalize transmission types
const normalizeTransmission = (transmission: string): string => {
    const lower = transmission.toLowerCase()
    if (lower === 'manual') return 'Manual'
    if (lower === 'automatic') return 'Automatic'
    if (lower === 'amt') return 'AMT'
    if (lower === 'cvt') return 'CVT'
    if (lower === 'dct') return 'DCT'
    if (lower === 'torque converter') return 'Automatic'
    return transmission.toUpperCase()
}

export function FavouritesProvider({ children }: { children: ReactNode }) {
    const [favourites, setFavourites] = useState<Car[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load favourites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    // Normalize existing favourites data
                    const normalized = parsed.map(car => ({
                        ...car,
                        fuelTypes: car.fuelTypes && car.fuelTypes.length > 0
                            ? car.fuelTypes.map(normalizeFuelType)
                            : ['Petrol'],
                        transmissions: car.transmissions && car.transmissions.length > 0
                            ? car.transmissions.map(normalizeTransmission)
                            : ['Manual']
                    }))
                    setFavourites(normalized)
                } else {
                    setFavourites([])
                }
            }
        } catch (error) {
            console.error('Error loading favourites:', error)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Save to localStorage whenever favourites change
    useEffect(() => {
        if (isLoaded) {
            try {
                console.log('💾 Saving favourites to localStorage:', favourites.length, 'cars')
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
            } catch (error) {
                console.error('Error saving favourites:', error)
            }
        }
    }, [favourites, isLoaded])

    const addFavourite = (car: Car) => {
        // Validate and ensure all required fields exist with normalization
        const validatedCar: Car = {
            id: car.id || `temp-${Date.now()}`,
            name: car.name || 'Unknown Car',
            brand: car.brand || car.brandName || 'Unknown',
            brandName: car.brandName || car.brand || 'Unknown',
            image: car.image || '',
            startingPrice: car.startingPrice || 0,
            fuelTypes: car.fuelTypes && car.fuelTypes.length > 0
                ? car.fuelTypes.map(normalizeFuelType)
                : ['Petrol'],
            transmissions: car.transmissions && car.transmissions.length > 0
                ? car.transmissions.map(normalizeTransmission)
                : ['Manual'],
            seating: car.seating || 5,
            launchDate: car.launchDate || 'Launched',
            slug: car.slug || `${(car.brandName || 'unknown').toLowerCase().replace(/\s+/g, '-')}-${(car.name || 'car').toLowerCase().replace(/\s+/g, '-')}`,
            isNew: car.isNew || false,
            isPopular: car.isPopular || false,
            isAutoAdded: car.isAutoAdded
        }

        console.log('✅ Adding validated car to favourites:', validatedCar)

        setFavourites(prev => {
            if (prev.some(c => c.id === validatedCar.id)) return prev
            return [...prev, validatedCar]
        })
    }

    const removeFavourite = (carId: string) => {
        setFavourites(prev => prev.filter(c => c.id !== carId))
    }

    const isFavourite = (carId: string) => {
        return favourites.some(c => c.id === carId)
    }

    const toggleFavourite = (car: Car) => {
        console.log('🔄 Toggling favourite for car:', car.name)
        if (isFavourite(car.id)) {
            console.log('❌ Removing from favourites')
            removeFavourite(car.id)
        } else {
            console.log('✅ Adding to favourites')
            addFavourite(car)
        }
    }

    const clearAllFavourites = () => {
        setFavourites([])
    }

    const value: FavouritesContextType = {
        favourites,
        addFavourite,
        removeFavourite,
        isFavourite,
        toggleFavourite,
        clearAllFavourites
    }

    return (
        <FavouritesContext.Provider value={value}>
            {children}
        </FavouritesContext.Provider>
    )
}

export function useFavourites() {
    const context = useContext(FavouritesContext)
    if (context === undefined) {
        throw new Error('useFavourites must be used within a FavouritesProvider')
    }
    return context
}
