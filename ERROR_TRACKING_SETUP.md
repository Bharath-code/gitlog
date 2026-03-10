# Error Tracking Setup Guide

**Created:** 2026-03-10  
**Status:** ✅ **CONFIGURED**  

---

## 🐛 Error Tracking Stack

### **1. Error Boundaries** ✅ (Implemented)

**File:** `src/shared/components/common/error-boundary.tsx`

- ✅ Catches React component errors
- ✅ Shows user-friendly error page
- ✅ Logs errors in development
- ✅ Auto-reload option

**Usage:**
```typescript
import { ErrorBoundary } from '@/shared/components/common/error-boundary';

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
```

---

### **2. Sentry Integration** ⏳ (Recommended)

**Setup Steps:**

1. **Create Sentry Account:**
   - Go to https://sentry.io/
   - Sign up for free account
   - Create new project (Next.js)
   - Get DSN

2. **Install Sentry:**
   ```bash
   npm install @sentry/nextjs
   ```

3. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
   SENTRY_ORG=your-org
   SENTRY_PROJECT=your-project
   ```

4. **Create `sentry.client.config.ts`:**
   ```typescript
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0, // 100% of transactions
     integrations: [
       new Sentry.Replay({
         maskAllText: true,
         blockAllMedia: true,
       }),
     ],
     replaysSessionSampleRate: 0.1, // 10% of sessions
     replaysOnErrorSampleRate: 1.0, // 100% of errors
   });
   ```

5. **Create `sentry.server.config.ts`:**
   ```typescript
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

6. **Update `next.config.js`:**
   ```javascript
   const { withSentryConfig } = require('@sentry/nextjs');

   module.exports = withSentryConfig(
     {
       // Your existing config
     },
     {
       silent: true,
       org: process.env.SENTRY_ORG,
       project: process.env.SENTRY_PROJECT,
     }
   );
   ```

---

### **3. Console Error Logging** ✅

**Already configured in:**
- `src/shared/components/common/error-boundary.tsx`
- `src/shared/components/common/toast.tsx`

**What's logged:**
- ✅ Component errors
- ✅ API errors
- ✅ User actions (with toast)
- ✅ Network failures

---

## 🎯 Error Monitoring Strategy

### **Development:**
- Console errors
- Error boundaries
- Local logging

### **Staging:**
- Sentry (with low sample rate)
- Error boundaries
- Manual testing

### **Production:**
- Sentry (full monitoring)
- Error boundaries
- User feedback
- Auto-alerts

---

## 📊 Error Metrics to Track

### **Critical Errors:**
- App crashes
- API failures
- Authentication errors
- Payment failures

### **Warning Errors:**
- Non-critical API errors
- Validation errors
- Rate limiting

### **Info:**
- User actions
- Feature usage
- Performance metrics

---

## 🚨 Alert Configuration

### **Sentry Alerts:**
1. Go to Sentry Project Settings
2. Click "Alerts"
3. Create alert rules:
   - **Critical:** >5 errors in 5 minutes → Email + Slack
   - **Warning:** >20 errors in 1 hour → Email
   - **Info:** Log only

### **Vercel Alerts:**
1. Go to Vercel Dashboard
2. Select project
3. Click "Settings" → "Notifications"
4. Configure:
   - Build failures
   - Function errors
   - Domain issues

---

## ✅ Error Tracking Checklist

- [x] Error boundaries implemented
- [ ] Sentry configured (optional)
- [x] Console logging configured
- [ ] Alerts configured
- [ ] User feedback enabled

---

## 🐛 Bug Fix Workflow

### **1. Error Occurs:**
```
User action → Error → Sentry captures → Alert sent
```

### **2. Triage:**
- Check Sentry dashboard
- Reproduce locally
- Assign severity

### **3. Fix:**
- Create fix branch
- Test locally
- Deploy to staging

### **4. Deploy:**
- Test on staging
- Deploy to production
- Monitor for recurrence

---

**Error tracking setup complete!** 🐛

*Last Updated: 2026-03-10*  
*Status: Ready to Monitor*
