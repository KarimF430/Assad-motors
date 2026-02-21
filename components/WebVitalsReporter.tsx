
"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
    useReportWebVitals((metric) => {
        // Navigator.sendBeacon is more reliable for sending data when page unloads
        // but check for availability first.
        const body = JSON.stringify({ name: metric.name, value: metric.value });
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const url = `${backendUrl}/api/monitoring/vitals`;

        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
        } else {
            fetch(url, {
                method: 'POST',
                body,
                keepalive: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    });

    return null;
}
