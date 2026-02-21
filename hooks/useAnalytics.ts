'use client';

/**
 * Analytics Hook
 * Provides easy access to analytics tracking methods
 */

import { useCallback } from 'react';
import analytics from '@/lib/analytics';
import {
    AnalyticsEvent,
    AnalyticsEventProperties,
    UserProperties,
} from '@/types/analytics';

export function useAnalytics() {
    const trackEvent = useCallback(
        (eventName: AnalyticsEvent | string, properties?: AnalyticsEventProperties) => {
            analytics.trackEvent(eventName, properties);
        },
        []
    );

    const trackCarView = useCallback(
        (carData: {
            carId: string;
            brand: string;
            model: string;
            variant?: string;
            price?: number;
        }) => {
            analytics.trackCarView(carData);
        },
        []
    );

    const trackComparison = useCallback(
        (cars: Array<{ id: string; brand: string; model: string }>) => {
            analytics.trackComparison(cars);
        },
        []
    );

    const trackSearch = useCallback(
        (query: string, resultsCount?: number, searchType: 'text' | 'ai' | 'filter' = 'text') => {
            analytics.trackSearch(query, resultsCount, searchType);
        },
        []
    );

    const trackPriceCalculation = useCallback(
        (data: {
            carId: string;
            variantId?: string;
            location: string;
            onRoadPrice?: number;
            exShowroomPrice?: number;
        }) => {
            analytics.trackPriceCalculation(data);
        },
        []
    );

    const trackAIInteraction = useCallback(
        (action: 'opened' | 'message_sent' | 'closed', message?: string) => {
            analytics.trackAIInteraction(action, message);
        },
        []
    );

    const trackFilter = useCallback(
        (filterType: string, filterValue: string | number) => {
            analytics.trackFilter(filterType, filterValue);
        },
        []
    );

    const trackEngagement = useCallback(
        (type: 'scroll' | 'time_on_page' | 'external_link', data?: any) => {
            analytics.trackEngagement(type, data);
        },
        []
    );

    const identifyUser = useCallback(
        (userId: string, properties?: UserProperties) => {
            analytics.identifyUser(userId, properties);
        },
        []
    );

    const resetUser = useCallback(() => {
        analytics.resetUser();
    }, []);

    return {
        trackEvent,
        trackCarView,
        trackComparison,
        trackSearch,
        trackPriceCalculation,
        trackAIInteraction,
        trackFilter,
        trackEngagement,
        identifyUser,
        resetUser,
    };
}
