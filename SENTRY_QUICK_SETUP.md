# 🎯 Sentry Alert Setup - Quick Guide

## Your Sentry Project
**DSN:** `https://b620d142ffd1fbc63c423777b77e3301@o4510345482797056.ingest.us.sentry.io/4510436913446912`

---

## Step 1: Access Sentry Dashboard

1. Go to: https://sentry.io
2. Login with your account
3. Select your project

---

## Step 2: Create Alert #1 - Critical Errors

1. Click **Alerts** (left sidebar)
2. Click **Create Alert**
3. Select **Issues**

**Configure:**
```
Alert Name: Critical Production Errors

When: an event is seen

If: ALL of these conditions are met
  - level equals error
  - environment equals production

Then send a notification to:
  - [Your Email Address]

How often: Every time
```

4. Click **Save Rule**

---

## Step 3: Create Alert #2 - High Error Rate

1. Click **Create Alert** again
2. Select **Issues**

**Configure:**
```
Alert Name: High Error Rate

When: an event is seen

If: ALL of these conditions are met
  - event count > 10 in 1 minute
  - environment equals production

Then send a notification to:
  - [Your Email Address]

How often: At most once every 5 minutes
```

3. Click **Save Rule**

---

## Step 4: Create Alert #3 - New Issues

1. Click **Create Alert** again
2. Select **Issues**

**Configure:**
```
Alert Name: New Issue Detected

When: a new issue is created

If: ALL of these conditions are met
  - environment equals production

Then send a notification to:
  - [Your Email Address]

How often: Every time
```

3. Click **Save Rule**

---

## Step 5: Test Your Alerts

### Backend Test:
```bash
# Trigger a test error
curl -X POST http://localhost:5001/api/test-error
```

### Frontend Test:
Open browser console on http://localhost:3000 and run:
```javascript
throw new Error('Test Sentry Alert');
```

**Expected Result:**
- Error appears in Sentry dashboard within 1-2 minutes
- You receive email notification

---

## Step 6: Optional - Slack Integration

1. **Settings → Integrations**
2. Find **Slack**
3. Click **Add to Slack**
4. Authorize and select channel (e.g., #alerts)
5. Edit your alerts to include Slack notifications

---

## ✅ Verification Checklist

- [ ] Created "Critical Errors" alert
- [ ] Created "High Error Rate" alert  
- [ ] Created "New Issues" alert
- [ ] Tested with sample error
- [ ] Received email notification
- [ ] (Optional) Configured Slack

---

## Quick Reference

**Sentry Dashboard:** https://sentry.io  
**Your Project:** gadizone  
**Alerts Page:** https://sentry.io/alerts/

**Need Help?** See full guide: `SENTRY_ALERTS_GUIDE.md`
