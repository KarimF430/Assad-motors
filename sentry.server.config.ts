import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Server Configuration
 * For server-side error tracking and performance monitoring
 */

Sentry.init({
  // DSN will be set in environment variable
  dsn: process.env.SENTRY_DSN || "",

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

  // Environment
  environment: process.env.NODE_ENV || "development",

  // Integrations
  integrations: [
    // HTTP integration for tracing
    Sentry.httpIntegration(),
  ],

  // Filtering
  beforeSend(event, hint) {
    // Filter out non-error events in development
    if (process.env.NODE_ENV === "development") {
      console.log("Sentry Server Event:", event);
      return null; // Don't send to Sentry in dev
    }

    return event;
  },
});

console.log("✅ Sentry server initialized");
