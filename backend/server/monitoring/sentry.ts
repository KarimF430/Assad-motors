/**
 * Sentry Backend Configuration
 * Error tracking and performance monitoring for the backend API
 */

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Profiling
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Release tracking
    release: process.env.APP_VERSION || "1.0.0",

    // Environment
    environment: process.env.NODE_ENV || "development",

    // Integrations
    integrations: [
      // Profiling integration
      nodeProfilingIntegration(),
      // HTTP integration for tracing
      Sentry.httpIntegration(),
      // Express integration
      Sentry.expressIntegration(),
    ],

    // Server-specific settings
    // autoSessionTracking: true,

    // Filtering
    beforeSend(event, hint) {
      // Filter out non-error events in development
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Sentry Backend Event:", {
          level: event.level,
          message: event.message,
          error: (hint as any).originalException?.message
        });
        // Still send to Sentry in development for testing
      }

      // Filter out specific errors
      if (event.exception) {
        const error = hint.originalException as any;
        // Filter out MongoDB connection errors during startup
        if (error?.message?.includes("ECONNREFUSED") && error?.message?.includes("27017")) {
          return null;
        }
        // Filter out Redis connection errors
        if (error?.message?.includes("ECONNREFUSED") && error?.message?.includes("6379")) {
          return null;
        }
      }

      return event;
    },

    // Ignore specific errors
    ignoreErrors: [
      // Database connection errors during startup
      "ECONNREFUSED",
      "ENOTFOUND",
      // Rate limiting errors
      "Too Many Requests",
      // Client disconnection errors
      "ECONNRESET",
      "EPIPE",
    ],
  });

  console.log("✅ Sentry backend monitoring initialized");
}

// Export Sentry for use in error handlers
export { Sentry };
