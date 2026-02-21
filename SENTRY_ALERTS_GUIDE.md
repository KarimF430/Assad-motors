# 🔔 Sentry Alert Configuration Guide

## Quick Setup for Real-Time Alerts

This guide helps you configure Sentry alerts to get notified when errors occur in your application.

---

## 1. Access Alert Settings

1. Login to [Sentry.io](https://sentry.io)
2. Select your project (gadizone)
3. Click **Alerts** in the left sidebar
4. Click **Create Alert**

---

## 2. Recommended Alert Rules

### Alert 1: Critical Errors (Immediate Notification)

**Name:** Critical Production Errors  
**When:** An event is seen  
**If:** 
- `level` equals `error` OR `fatal`
- `environment` equals `production`

**Then send a notification to:** 
- Email: your-email@example.com
- Slack: #alerts channel (if configured)

**How often:** Every time

---

### Alert 2: High Error Rate (Performance Degradation)

**Name:** High Error Rate Alert  
**When:** An event is seen  
**If:**
- Event count is `> 10` in `1 minute`
- `environment` equals `production`

**Then send a notification to:**
- Email: your-email@example.com
- Slack: #alerts channel

**How often:** At most once every `5 minutes`

---

### Alert 3: New Error Types (Unknown Issues)

**Name:** New Issue Alert  
**When:** A new issue is created  
**If:**
- `environment` equals `production`
- Issue is `unresolved`

**Then send a notification to:**
- Email: your-email@example.com

**How often:** Every time

---

### Alert 4: Performance Degradation

**Name:** Slow API Response Time  
**When:** A metric alert is triggered  
**If:**
- `transaction.duration` (p95) is `> 1000ms`
- `environment` equals `production`

**Then send a notification to:**
- Email: your-email@example.com

**How often:** At most once every `15 minutes`

---

## 3. Step-by-Step Alert Creation

### Example: Creating "Critical Errors" Alert

1. **Go to Alerts → Create Alert**

2. **Choose Alert Type:**
   - Select "Issues"
   - Click "Set Conditions"

3. **Configure Conditions:**
   ```
   When: an event is seen
   If: ALL of these conditions are met:
     - level equals error
     - environment equals production
   ```

4. **Set Actions:**
   ```
   Then send a notification to:
     - [Your Email]
     - [Slack Channel] (optional)
   ```

5. **Configure Frequency:**
   ```
   How often: Every time
   ```

6. **Name and Save:**
   ```
   Alert name: Critical Production Errors
   Team: Default
   ```

7. Click **Save Rule**

---

## 4. Slack Integration (Optional)

### Setup Slack Notifications:

1. **In Sentry:**
   - Settings → Integrations
   - Find "Slack"
   - Click "Add to Slack"

2. **Authorize:**
   - Select your Slack workspace
   - Choose channel (e.g., #alerts)
   - Click "Allow"

3. **Update Alert Rules:**
   - Edit each alert
   - Add Slack channel to notifications
   - Save

---

## 5. Email Notification Settings

### Configure Email Preferences:

1. **User Settings:**
   - Click your avatar → User Settings
   - Go to "Notifications"

2. **Email Settings:**
   - Enable "Issue Alerts"
   - Enable "Deploy Notifications"
   - Set frequency preferences

3. **Per-Project Settings:**
   - Project Settings → Alerts
   - Configure project-specific preferences

---

## 6. Testing Your Alerts

### Test Backend Alert:

```bash
# Trigger a test error
curl -X POST http://localhost:5001/api/test-error \
  -H "Content-Type: application/json"
```

### Test Frontend Alert:

```javascript
// Add to any page temporarily
throw new Error('Test Sentry Alert');
```

**Expected Result:**
- Alert appears in Sentry dashboard within 1-2 minutes
- Email/Slack notification sent (if configured)

---

## 7. Recommended Alert Matrix

| Alert Type | Severity | Frequency | Channels |
|------------|----------|-----------|----------|
| Critical Errors | 🔴 High | Every time | Email + Slack |
| High Error Rate | 🟠 Medium | Once per 5min | Email + Slack |
| New Issues | 🟡 Low | Every time | Email only |
| Performance | 🟡 Low | Once per 15min | Email only |
| Deploy Notifications | 🟢 Info | Every deploy | Slack only |

---

## 8. Advanced: Custom Alert Conditions

### Filter by Specific Errors:

```
If: ALL of these conditions are met:
  - message contains "Database connection failed"
  - environment equals production
```

### Filter by User Impact:

```
If: ALL of these conditions are met:
  - user.count > 5
  - level equals error
```

### Filter by Endpoint:

```
If: ALL of these conditions are met:
  - transaction equals "/api/auth/login"
  - level equals error
```

---

## 9. Alert Fatigue Prevention

### Best Practices:

1. **Use Thresholds:**
   - Don't alert on every single error
   - Use "more than X in Y minutes"

2. **Group Similar Errors:**
   - Sentry auto-groups similar issues
   - Review grouping settings

3. **Mute Known Issues:**
   - Mark non-critical issues as "Ignored"
   - Set up filters for expected errors

4. **Use Environments:**
   - Only alert on `production`
   - Separate dev/staging alerts

---

## 10. Monitoring Dashboard

### Create Custom Dashboard:

1. **Dashboards → Create Dashboard**

2. **Add Widgets:**
   - Error count by environment
   - Top 10 errors
   - Response time (p95)
   - User-impacted issues

3. **Share with Team:**
   - Set as default dashboard
   - Share link with team

---

## 11. Weekly Digest (Optional)

### Setup Weekly Summary:

1. **User Settings → Notifications**
2. Enable "Weekly Reports"
3. Choose day and time
4. Select projects to include

**You'll receive:**
- Top errors of the week
- Performance trends
- New issues summary

---

## 12. Mobile App Alerts (Optional)

### Get Alerts on Your Phone:

1. **Download Sentry Mobile App:**
   - iOS: App Store
   - Android: Google Play

2. **Login and Configure:**
   - Use same Sentry account
   - Enable push notifications
   - Select critical alerts only

---

## Quick Start Checklist

- [ ] Create "Critical Errors" alert (email)
- [ ] Create "High Error Rate" alert (email)
- [ ] Create "New Issues" alert (email)
- [ ] Test alerts with sample error
- [ ] Configure Slack integration (optional)
- [ ] Set up weekly digest
- [ ] Create monitoring dashboard
- [ ] Share dashboard with team

---

## Example Alert Configuration (Copy-Paste)

```yaml
Alert 1: Critical Production Errors
  Type: Issues
  When: an event is seen
  If:
    - level equals error OR fatal
    - environment equals production
  Then: Email to team@gadizone.com
  Frequency: Every time

Alert 2: High Error Rate
  Type: Issues  
  When: an event is seen
  If:
    - event count > 10 in 1 minute
    - environment equals production
  Then: Email + Slack #alerts
  Frequency: Once per 5 minutes

Alert 3: New Issues
  Type: Issues
  When: a new issue is created
  If:
    - environment equals production
    - status is unresolved
  Then: Email to team@gadizone.com
  Frequency: Every time
```

---

## Support

**Sentry Documentation:** https://docs.sentry.io/product/alerts/  
**Alert Best Practices:** https://docs.sentry.io/product/alerts/best-practices/

---

**Setup Time:** ~15 minutes  
**Next Review:** After first week of monitoring
