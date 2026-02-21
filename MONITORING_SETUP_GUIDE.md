# ==========================================
# MONITORING & OBSERVABILITY SETUP GUIDE
# ==========================================
#
# This document provides instructions for configuring Sentry
# for error tracking and performance monitoring.
#
# ==========================
# 1. SENTRY CONFIGURATION
# ==========================
#
# BACKEND SENTRY:
# - Add to backend/.env:
#   SENTRY_DSN=https://your-key@sentry.io/your-backend-project-id
#
# FRONTEND SENTRY:
# - Add to root .env.local:
#   NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-frontend-project-id
#   NEXT_PUBLIC_APP_VERSION=1.0.0
#
# Getting your Sentry DSN:
# 1. Create account at https://sentry.io
# 2. Create two projects:
#    - "gadizone-backend" (Node.js / Express)
#    - "gadizone-frontend" (Next.js)
# 3. Copy the DSN from each project's settings
# 4. Add to respective .env files
#
# ==========================
# 2. SAMPLE RATES (PRODUCTION)
# ==========================
#
# Reduce sample rates in production to control costs:
#
# Backend (backend/.env):
# SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% of transactions
# SENTRY_PROFILES_SAMPLE_RATE=0.1 # 10% profiling
#
# Frontend (.env.local):
# NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
# NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
# NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0
#
# ==========================
# 3. IP WHITELISTING
# ==========================
#
# Configure allowed IPs in:
# backend/server/middleware/security.ts
#
# Add your admin/office IPs to the ALLOWED_IPS array.
#
# ==========================
# 4. MONGODB READ REPLICAS
# ==========================
#
# If using MongoDB Atlas or replica sets:
#
# Add to MONGODB_URI connection string:
# ?readPreference=secondaryPreferred&maxPoolSize=100
#
# Example:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gadizone?readPreference=secondaryPreferred&maxPoolSize=100
#
# ==========================
# 5. VERIFICATION
# ==========================
#
# After configuration:
# 1. Restart backend: npm run dev
# 2. Check Sentry dashboard for events
# 3. Verify rate limiting: curl http://localhost:5001/api/brands (try 101 times)
# 4. Check MongoDB indexes: db.variants.getIndexes()
#
# For detailed setup instructions, see:
# implementation_plan.md in the artifacts directory
