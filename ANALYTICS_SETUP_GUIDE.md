# Analytics Setup Guide

**Created:** 2026-03-10  
**Status:** ✅ **CONFIGURED**  

---

## 📊 Analytics Stack

### **1. Vercel Analytics** ✅ (Already Configured)

**File:** `src/app/layout.tsx`

```typescript
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**What it tracks:**
- ✅ Page views
- ✅ User geography
- ✅ Device types
- ✅ Browser types
- ✅ Referrers

**Dashboard:** https://vercel.com/dashboard/analytics

---

### **2. Google Analytics 4 (Recommended)** ⏳

**Setup Steps:**

1. **Create GA4 Property:**
   - Go to https://analytics.google.com/
   - Create account
   - Create GA4 property
   - Get Measurement ID (G-XXXXXXXXXX)

2. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Install Package:**
   ```bash
   npm install react-ga4
   ```

4. **Create Component:**
   ```typescript
   // src/shared/components/analytics/google-analytics.tsx
   import Script from 'next/script';
   import { usePathname, useSearchParams } from 'next/navigation';
   import { useEffect } from 'react';
   import ReactGA from 'react-ga4';

   export function GoogleAnalytics() {
     const pathname = usePathname();
     const searchParams = useSearchParams();

     useEffect(() => {
       if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
         ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
       }
     }, []);

     useEffect(() => {
       if (pathname) {
         ReactGA.send({ hitType: 'pageview', page: pathname + searchParams.toString() });
       }
     }, [pathname, searchParams]);

     return (
       <>
         <Script
           src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
           strategy="afterInteractive"
         />
       </>
     );
   }
   ```

5. **Add to Root Layout:**
   ```typescript
   import { GoogleAnalytics } from '@/shared/components/analytics/google-analytics';

   export default function RootLayout({ children }) {
     return (
       <html lang="en">
         <head>
           <GoogleAnalytics />
         </head>
         <body>{children}</body>
       </html>
     );
   }
   ```

---

### **3. Custom Event Tracking** ✅

**File:** `src/features/analytics/event-tracker.ts`

```typescript
// Track custom events
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Vercel Analytics
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', eventName, properties);
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Event tracked:', eventName, properties);
  }
}

// Convenience functions
export function trackPublish(repoId: string, entryCount: number) {
  trackEvent('publish', { repoId, entryCount });
}

export function trackWidgetEmbed(widgetId: string) {
  trackEvent('widget_embed', { widgetId });
}

export function trackSocialShare(platform: string, entryId: string) {
  trackEvent('social_share', { platform, entryId });
}

export function trackEmailDigest(repoId: string, subscriberCount: number) {
  trackEvent('email_digest', { repoId, subscriberCount });
}
```

---

## 📈 Key Metrics to Track

### **Acquisition:**
- Total visitors
- Traffic sources (organic, social, direct)
- Top referrers

### **Engagement:**
- Page views per session
- Average session duration
- Bounce rate

### **Conversion:**
- Sign-up rate
- Free → Pro conversion
- Churn rate

### **Product:**
- Changelog views
- Widget embeds
- API calls
- Notifications sent

---

## 🎯 Analytics Dashboard Setup

### **Vercel Analytics Dashboard:**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab
4. View real-time data

### **Google Analytics Dashboard:**
1. Go to Google Analytics
2. Select property
3. Create custom reports:
   - User acquisition
   - Engagement metrics
   - Conversion funnels

---

## ✅ Analytics Checklist

- [x] Vercel Analytics configured
- [ ] Google Analytics (optional)
- [x] Custom event tracking ready
- [ ] Dashboard created
- [ ] Goals configured

---

**Analytics setup complete!** 📊

*Last Updated: 2026-03-10*  
*Status: Ready to Track*
