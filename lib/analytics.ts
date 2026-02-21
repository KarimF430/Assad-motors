/**
 * Unified Analytics Library
 * Integrates Google Analytics 4, Microsoft Clarity, and Amplitude
 */

import * as amplitude from '@amplitude/analytics-browser';
import {
    AnalyticsEvent,
    AnalyticsEventProperties,
    UserProperties,
    AnalyticsConfig,
} from '@/types/analytics';

// Global type declarations for analytics scripts
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
        clarity?: (...args: any[]) => void;
    }
}

class Analytics {
    private config: AnalyticsConfig;
    private initialized = false;

    constructor() {
        this.config = {
            googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
            clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
            amplitudeApiKey: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
            debug: process.env.NODE_ENV === 'development',
            enabled: process.env.NODE_ENV === 'production',
        };
    }

    /**
     * Initialize all analytics platforms
     */
    init(): void {
        if (this.initialized) {
            this.log('Analytics already initialized');
            return;
        }

        try {
            // Initialize Amplitude
            if (this.config.amplitudeApiKey) {
                amplitude.init(this.config.amplitudeApiKey, undefined, {
                    defaultTracking: {
                        sessions: true,
                        pageViews: true,
                        formInteractions: false,
                        fileDownloads: false,
                    },
                    logLevel: amplitude.Types.LogLevel.None,
                });
                // Only log our own wrapper message if debug is on
                this.log('Amplitude initialized');
            }

            // Google Analytics is initialized via script tag in layout.tsx
            if (this.config.googleAnalyticsId && typeof window.gtag === 'function') {
                this.log('Google Analytics detected');
            }

            // Microsoft Clarity is initialized via script tag in layout.tsx
            if (this.config.clarityId && typeof window.clarity === 'function') {
                this.log('Microsoft Clarity detected');
            }

            this.initialized = true;
            this.log('Analytics initialization complete');
        } catch (error) {
            console.error('Analytics initialization error:', error);
        }
    }

    /**
     * Track page view across all platforms
     */
    trackPageView(url: string, title?: string): void {
        if (!this.shouldTrack()) return;

        try {
            // Google Analytics
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'page_view', {
                    page_path: url,
                    page_title: title,
                });
            }

            // Amplitude (handled automatically by defaultTracking.pageViews)
            // But we can add custom properties
            amplitude.track('page_view', {
                page_url: url,
                page_title: title,
            });

            // Clarity (handled automatically)

            this.log('Page view tracked:', url);
        } catch (error) {
            console.error('Error tracking page view:', error);
        }
    }

    /**
     * Track custom event across all platforms
     */
    trackEvent(
        eventName: AnalyticsEvent | string,
        properties?: AnalyticsEventProperties
    ): void {
        if (!this.shouldTrack()) return;

        try {
            const eventProps = {
                ...properties,
                timestamp: Date.now(),
            };

            // Google Analytics
            if (typeof window.gtag === 'function') {
                window.gtag('event', eventName, eventProps);
            }

            // Amplitude
            amplitude.track(eventName, eventProps);

            // Clarity (events tracked via custom tags)
            if (typeof window.clarity === 'function') {
                window.clarity('set', eventName, JSON.stringify(eventProps));
            }

            this.log('Event tracked:', eventName, eventProps);
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    /**
     * Identify user across all platforms
     */
    identifyUser(userId: string, properties?: UserProperties): void {
        if (!this.shouldTrack()) return;

        try {
            // Google Analytics
            if (typeof window.gtag === 'function') {
                window.gtag('config', this.config.googleAnalyticsId!, {
                    user_id: userId,
                });
                if (properties) {
                    window.gtag('set', 'user_properties', properties);
                }
            }

            // Amplitude
            amplitude.setUserId(userId);
            if (properties) {
                const identify = new amplitude.Identify();
                Object.entries(properties).forEach(([key, value]) => {
                    identify.set(key, value);
                });
                amplitude.identify(identify);
            }

            // Clarity
            if (typeof window.clarity === 'function') {
                window.clarity('identify', userId, properties);
            }

            this.log('User identified:', userId);
        } catch (error) {
            console.error('Error identifying user:', error);
        }
    }

    /**
     * Reset user identity (on logout)
     */
    resetUser(): void {
        try {
            // Amplitude
            amplitude.reset();

            this.log('User identity reset');
        } catch (error) {
            console.error('Error resetting user:', error);
        }
    }

    /**
     * Feature-specific tracking methods
     */

    trackCarView(carData: {
        carId: string;
        brand: string;
        model: string;
        variant?: string;
        price?: number;
    }): void {
        this.trackEvent(AnalyticsEvent.MODEL_PAGE_VIEWED, {
            car_id: carData.carId,
            brand: carData.brand,
            model: carData.model,
            variant: carData.variant,
            price: carData.price,
        });
    }

    trackComparison(cars: Array<{ id: string; brand: string; model: string }>): void {
        this.trackEvent(AnalyticsEvent.COMPARISON_STARTED, {
            car_ids: cars.map(c => c.id),
            brands: cars.map(c => c.brand),
            models: cars.map(c => c.model),
        });
    }

    trackSearch(query: string, resultsCount?: number, searchType: 'text' | 'ai' | 'filter' = 'text'): void {
        this.trackEvent(AnalyticsEvent.SEARCH_PERFORMED, {
            search_query: query,
            search_type: searchType,
            results_count: resultsCount,
        });
    }

    trackPriceCalculation(data: {
        carId: string;
        variantId?: string;
        location: string;
        onRoadPrice?: number;
        exShowroomPrice?: number;
    }): void {
        this.trackEvent(AnalyticsEvent.PRICE_BREAKUP_CALCULATED, {
            car_id: data.carId,
            variant_id: data.variantId,
            location: data.location,
            on_road_price: data.onRoadPrice,
            ex_showroom_price: data.exShowroomPrice,
        });
    }

    trackAIInteraction(action: 'opened' | 'message_sent' | 'closed', message?: string): void {
        const eventMap = {
            opened: AnalyticsEvent.AI_CHAT_OPENED,
            message_sent: AnalyticsEvent.AI_CHAT_MESSAGE_SENT,
            closed: AnalyticsEvent.AI_CHAT_CLOSED,
        };

        this.trackEvent(eventMap[action], {
            message,
            timestamp: Date.now(),
        });
    }

    trackFilter(filterType: string, filterValue: string | number): void {
        this.trackEvent(AnalyticsEvent.FILTER_APPLIED, {
            filter_type: filterType,
            filter_value: filterValue,
        });
    }

    trackEngagement(type: 'scroll' | 'time_on_page' | 'external_link', data?: any): void {
        const eventMap = {
            scroll: AnalyticsEvent.SCROLL_DEPTH,
            time_on_page: AnalyticsEvent.TIME_ON_PAGE,
            external_link: AnalyticsEvent.EXTERNAL_LINK_CLICKED,
        };

        this.trackEvent(eventMap[type], data);
    }

    /**
     * Helper methods
     */

    private shouldTrack(): boolean {
        // Always track in production, only track in development if debug is enabled
        return this.config.enabled || this.config.debug || false;
    }

    private log(...args: any[]): void {
        if (this.config.debug) {
            console.log('[Analytics]', ...args);
        }
    }
}

// Export singleton instance
export const analytics = new Analytics();

// Export for use in components
export default analytics;
