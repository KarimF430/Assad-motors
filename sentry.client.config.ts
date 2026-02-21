import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Client Configuration
 * For browser-side error tracking and performance monitoring
 */

Sentry.init({
  // DSN will be set in environment variable
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

  // Environment
  environment: process.env.NODE_ENV || "development",

  // Integrations
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filtering
  beforeSend(event, hint) {
    // Filter out non-error events in development
    if (process.env.NODE_ENV === "development") {
      console.log("Sentry Event:", event);
      return null; // Don't send to Sentry in dev
    }

    // Filter out specific errors
    if (event.exception) {
      const error = hint.originalException as any;
      // Filter out network errors
      if (error?.message?.includes("Network request failed")) {
        return null;
      }
      // Filter out canceled requests
      if (error?.message?.includes("AbortError")) {
        return null;
      }
    }

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    // Facebook errors
    "fb_xd_fragment",
    // Chrome extensions
    "ResizeObserver loop limit exceeded",
    // Network errors
    "Network request failed",
    "NetworkError",
    "Failed to fetch",
  ],

  // Allowed URLs for error tracking
  allowUrls: [
    /https?:\/\/(www\.)?gadizone\.com/,
    /https?:\/\/localhost:\d+/,
  ],
});

console.log("✅ Sentry client initialized");
