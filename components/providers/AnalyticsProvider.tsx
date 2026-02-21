'use client';

/**
 * Analytics Provider
 * Initializes analytics and tracks route changes
 */

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import analytics from '@/lib/analytics';

// Inner component that uses searchParams
function AnalyticsLogic() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Track page views on route change
    useEffect(() => {
        if (pathname) {
            const url = searchParams?.toString()
                ? `${pathname}?${searchParams.toString()}`
                : pathname;

            analytics.trackPageView(url, document.title);
        }
    }, [pathname, searchParams]);

    return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    // Initialize analytics on mount (doesn't depend on params)
    useEffect(() => {
        analytics.init();
    }, []);

    return (
        <>
            <Suspense fallback={null}>
                <AnalyticsLogic />
            </Suspense>
            {children}
        </>
    );
}
