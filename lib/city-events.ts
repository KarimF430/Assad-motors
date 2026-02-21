
/**
 * Custom event mechanism for city changes
 * This allows components to react instantly to city changes within the same tab
 * without needing a page reload or context provider.
 */

export const CITY_CHANGE_EVENT = 'city-change'

export function dispatchCityChange(city: string) {
    if (typeof window !== 'undefined') {
        const event = new CustomEvent(CITY_CHANGE_EVENT, { detail: { city } })
        window.dispatchEvent(event)
    }
}

export function subscribeToCityChange(callback: (city: string) => void) {
    if (typeof window !== 'undefined') {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent
            callback(customEvent.detail.city)
        }

        window.addEventListener(CITY_CHANGE_EVENT, handler)

        return () => {
            window.removeEventListener(CITY_CHANGE_EVENT, handler)
        }
    }
    return () => { }
}
