# GitLog Phase 2 Implementation Plan

**Created:** 2026-03-09  
**Duration:** Month 2-3 (8 weeks)  
**Total Tasks:** 20  
**Total Estimated Time:** 40 hours  

---

## 📊 Phase 2 Overview

Phase 2 focuses on expanding GitLog's value proposition beyond basic changelog generation. These features transform GitLog from a simple auto-changelog tool into a comprehensive release communication platform.

### Feature Areas

| Area | Tasks | Time | Priority |
| :---- | :---- | :---- | :---- |
| **1. Embeddable Widget** | 4 tasks | 8h | High |
| **2. Social Post Drafts** | 4 tasks | 6h | High |
| **3. Email Integrations** | 4 tasks | 10h | Medium |
| **4. Analytics Dashboard** | 4 tasks | 8h | High |
| **5. Roadmap from Issues** | 4 tasks | 8h | Medium |

**Total:** 20 tasks, 40 hours

---

## 🎯 Phase 2 Goals

1. **Increase user engagement** - Users interact with GitLog beyond publishing changelogs
2. **Improve distribution** - Changelogs reach more users via widgets, social, email
3. **Add analytics** - Users can measure changelog impact
4. **Expand roadmap** - Connect GitHub Issues to public roadmap
5. **Drive upgrades** - Premium features incentivize Pro plan adoption

---

## 📋 Task Breakdown

### **1. Embeddable Widget (8 hours)**

**Goal:** Allow users to embed a "What's New" widget on their website/app

#### 1.1 Widget Script Generator (2h)
- **File:** `src/app/(dashboard)/widget/page.tsx`
- **File:** `src/app/(dashboard)/widget/generator.tsx`
- **Tasks:**
  - Create widget settings page in dashboard
  - Generate unique widget ID per connected repo
  - Create script snippet generator (copy-paste ready)
  - Add widget preview before embedding
- **Output:**
  ```html
  <script src="https://gitlog.app/widget.js" data-widget-id="xxx"></script>
  ```
- **Acceptance Criteria:**
  - ✅ User can generate widget script for any connected repo
  - ✅ Script snippet is copy-paste ready
  - ✅ Preview shows how widget will look
  - ✅ Widget ID is unique per repo

#### 1.2 Embeddable iframe Component (2h)
- **File:** `src/app/(public)/widget/[widgetId]/page.tsx`
- **File:** `src/shared/components/widgets/embeddable-widget.tsx`
- **Tasks:**
  - Create lightweight widget endpoint
  - Design compact widget UI (badge + dropdown)
  - Support multiple widget styles (badge, modal, inline)
  - Ensure CORS headers for cross-origin embedding
- **Output:** Widget displays latest changelog entries
- **Acceptance Criteria:**
  - ✅ Widget loads in <1s
  - ✅ Works on any website (CORS configured)
  - ✅ Mobile responsive
  - ✅ Shows latest 3-5 entries

#### 1.3 Widget Customization (2.5h)
- **File:** `src/shared/components/widgets/widget-customizer.tsx`
- **Tasks:**
  - Color customization (primary, background, text)
  - Position selection (bottom-right, bottom-left, top-right, top-left)
  - Size options (small, medium, large)
  - Toggle options (show date, show category, show "New" badge)
  - Save customization to KV store
- **Output:** Customized widget matches site branding
- **Acceptance Criteria:**
  - ✅ 5+ color presets
  - ✅ Custom color picker
  - ✅ 4 position options
  - ✅ Settings persist across embeds

#### 1.4 Widget Analytics (1.5h)
- **File:** `src/app/(dashboard)/analytics/widgets/page.tsx`
- **File:** `src/features/analytics/widget-tracker.ts`
- **Tasks:**
  - Track widget impressions per repo
  - Track widget clicks (opens changelog)
  - Display widget performance in dashboard
  - Add to existing analytics page
- **Output:** Widget engagement metrics
- **Acceptance Criteria:**
  - ✅ Impressions tracked
  - ✅ Clicks tracked
  - ✅ CTR displayed
  - ✅ Top performing widgets shown

---

### **2. Social Post Drafts (6 hours)**

**Goal:** Auto-generate social media posts for each published changelog entry

#### 2.1 Twitter Thread Generator (2h)
- **File:** `src/features/social/twitter-thread-generator.ts`
- **File:** `src/app/(dashboard)/social/twitter/page.tsx`
- **Tasks:**
  - Create AI prompt for Twitter thread (280 chars per tweet)
  - Generate 2-5 tweet thread per changelog entry
  - Include emojis, hashtags, and link to changelog
  - Support multiple tones (professional, casual, exciting)
- **Output:** Ready-to-post Twitter thread
- **Acceptance Criteria:**
  - ✅ Each tweet ≤280 characters
  - ✅ Thread flows logically
  - ✅ Includes changelog link
  - ✅ 3 tone options

#### 2.2 LinkedIn Post Generator (1.5h)
- **File:** `src/features/social/linkedin-post-generator.ts`
- **File:** `src/app/(dashboard)/social/linkedin/page.tsx`
- **Tasks:**
  - Create AI prompt for LinkedIn post (1000-1300 chars)
  - Generate single post with professional tone
  - Include relevant hashtags (3-5)
  - Add changelog link and CTA
- **Output:** Ready-to-post LinkedIn update
- **Acceptance Criteria:**
  - ✅ Post length 1000-1300 chars
  - ✅ Professional tone
  - ✅ 3-5 relevant hashtags
  - ✅ Clear CTA

#### 2.3 Social Post Preview (1.5h)
- **File:** `src/shared/components/social/post-preview.tsx`
- **Tasks:**
  - Create Twitter preview card (looks like actual tweet)
  - Create LinkedIn preview card (looks like actual post)
  - Show character count
  - Show link preview card
- **Output:** Visual preview of social posts
- **Acceptance Criteria:**
  - ✅ Twitter preview matches Twitter UI
  - ✅ LinkedIn preview matches LinkedIn UI
  - ✅ Character count visible
  - ✅ Link preview shown

#### 2.4 One-click Copy (1h)
- **File:** `src/shared/components/social/copy-button.tsx`
- **Tasks:**
  - Add copy button to each post
  - Copy entire thread (for Twitter) or single post (for LinkedIn)
  - Show toast notification on copy
  - Track copy events for analytics
- **Output:** One-click copy to clipboard
- **Acceptance Criteria:**
  - ✅ Copies full text
  - ✅ Toast shows "Copied!"
  - ✅ Works on mobile
  - ✅ Analytics tracked

---

### **3. Email Integrations (10 hours)**

**Goal:** Enable email-based release communication

#### 3.1 Resend Integration (3h)
- **File:** `src/lib/resend.ts`
- **File:** `src/app/api/email/send/route.ts`
- **Tasks:**
  - Install `resend` package
  - Configure Resend API key in env
  - Create email sending utility
  - Create API endpoint for sending emails
  - Test with transactional email
- **Output:** Working email sending infrastructure
- **Acceptance Criteria:**
  - ✅ Resend package installed
  - ✅ API key configured
  - ✅ Can send test email
  - ✅ Error handling in place

#### 3.2 Email Template Builder (3h)
- **File:** `src/features/email/template-builder.tsx`
- **File:** `src/features/email/templates/release-email.tsx`
- **Tasks:**
  - Create HTML email template for release announcements
  - Include changelog entries with categories
  - Add "View Online" link
  - Make template mobile responsive
  - Support custom branding (logo, colors)
- **Output:** Beautiful release email template
- **Acceptance Criteria:**
  - ✅ Template renders in all major email clients
  - ✅ Mobile responsive
  - ✅ Custom branding supported
  - ✅ "View Online" link included

#### 3.3 Mailchimp Integration (2.5h)
- **File:** `src/lib/mailchimp.ts`
- **File:** `src/app/api/integrations/mailchimp/sync/route.ts`
- **Tasks:**
  - Install `@mailchimp/mailchimp-marketing` package
  - Create Mailchimp API client
  - Sync changelog subscribers to Mailchimp audience
  - Create Mailchimp campaign for release
  - Handle webhook for subscription changes
- **Output:** Mailchimp audience sync + campaign creation
- **Acceptance Criteria:**
  - ✅ Subscribers sync to Mailchimp
  - ✅ Campaign created on publish
  - ✅ Unsubscribe handled
  - ✅ Errors logged

#### 3.4 Email Digest Subscriptions (1.5h)
- **File:** `src/app/(public)/changelog/[user]/[repo]/subscribe/page.tsx`
- **File:** `src/features/email/subscription-manager.ts`
- **Tasks:**
  - Create subscription form on public changelog page
  - Store subscriber emails in KV
  - Send digest email when entries published
  - Add unsubscribe link
  - Manage subscription preferences
- **Output:** Users can subscribe to email digests
- **Acceptance Criteria:**
  - ✅ Email subscription form works
  - ✅ Double opt-in (optional)
  - ✅ Digest sent on publish
  - ✅ Unsubscribe works

---

### **4. Analytics Dashboard (8 hours)**

**Goal:** Provide insights into changelog performance

#### 4.1 Page Views Tracking (2h)
- **File:** `src/features/analytics/page-view-tracker.ts`
- **File:** `src/app/api/analytics/track/route.ts`
- **Tasks:**
  - Create page view tracking utility
  - Track views per changelog entry
  - Store view data in KV (date, entryId, uniqueId)
  - Add tracking script to public changelog pages
  - Respect privacy (no PII)
- **Output:** Page view metrics per entry
- **Acceptance Criteria:**
  - ✅ Views tracked accurately
  - ✅ Data stored in KV
  - ✅ Privacy-compliant
  - ✅ Low latency (<100ms)

#### 4.2 Unique Visitors Tracking (2h)
- **File:** `src/features/analytics/visitor-tracker.ts`
- **Tasks:**
  - Generate anonymous visitor ID (fingerprint or cookie)
  - Track unique visitors per entry
  - Track returning visitors
  - Aggregate daily/weekly/monthly stats
- **Output:** Unique visitor metrics
- **Acceptance Criteria:**
  - ✅ Unique visitors counted
  - ✅ Returning visitors identified
  - ✅ Stats aggregated by period
  - ✅ Privacy-compliant

#### 4.3 Most Viewed Entries (2h)
- **File:** `src/app/(dashboard)/analytics/most-viewed/page.tsx`
- **Tasks:**
  - Create "Most Viewed" leaderboard
  - Show top 10 entries by views
  - Filter by time period (week, month, all-time)
  - Show view count trend (up/down arrow)
- **Output:** Leaderboard of popular entries
- **Acceptance Criteria:**
  - ✅ Top 10 entries shown
  - ✅ Time period filter works
  - ✅ Trend indicators visible
  - ✅ Sorted correctly

#### 4.4 Upvoting System (2h)
- **File:** `src/features/analytics/upvote-system.ts`
- **File:** `src/shared/components/analytics/upvote-button.tsx`
- **Tasks:**
  - Add upvote button to public changelog entries
  - Store upvotes in KV (prevent duplicate votes)
  - Display upvote count on entries
  - Show most upvoted entries in dashboard
  - Track upvote analytics
- **Output:** Users can upvote entries
- **Acceptance Criteria:**
  - ✅ One upvote per visitor
  - ✅ Count displayed
  - ✅ Most upvoted shown in dashboard
  - ✅ Analytics tracked

---

### **5. Roadmap from Issues (8 hours)**

**Goal:** Transform GitHub Issues into public roadmap

#### 5.1 GitHub Issues Sync (2.5h)
- **File:** `src/features/roadmap/issues-sync.ts`
- **File:** `src/app/api/github/issues/sync/route.ts`
- **Tasks:**
  - Create API endpoint to fetch GitHub Issues
  - Filter issues by label (e.g., `roadmap`, `enhancement`)
  - Sync issue data to KV (title, body, labels, URL)
  - Add manual sync button in dashboard
  - Auto-sync on webhook trigger (issues.opened)
- **Output:** Issues synced to GitLog
- **Acceptance Criteria:**
  - ✅ Issues fetched from GitHub
  - ✅ Filtered by label
  - ✅ Data stored in KV
  - ✅ Manual + auto sync work

#### 5.2 Roadmap Cards (2.5h)
- **File:** `src/app/(dashboard)/roadmap/page.tsx`
- **File:** `src/features/roadmap/roadmap-cards.tsx`
- **Tasks:**
  - Create roadmap page in dashboard
  - Display synced issues as cards
  - Show card status (planned, in progress, completed)
  - Allow manual status changes
  - Group by status or milestone
- **Output:** Visual roadmap from issues
- **Acceptance Criteria:**
  - ✅ Cards display issue info
  - ✅ Status editable
  - ✅ Grouped view available
  - ✅ Mobile responsive

#### 5.3 Upvoting Functionality (1.5h)
- **File:** `src/features/roadmap/roadmap-upvotes.ts`
- **File:** `src/app/(public)/roadmap/[user]/[repo]/page.tsx`
- **Tasks:**
  - Create public roadmap page
  - Add upvote button to each roadmap item
  - Store upvotes in KV
  - Sort roadmap by upvotes (most requested first)
  - Show upvote count publicly
- **Output:** Public roadmap with upvotes
- **Acceptance Criteria:**
  - ✅ Public roadmap page exists
  - ✅ Upvotes work
  - ✅ Sorted by popularity
  - ✅ One vote per visitor

#### 5.4 Auto-move to Changelog (1.5h)
- **File:** `src/features/roadmap/roadmap-to-changelog.ts`
- **Tasks:**
  - Detect when roadmap item completed (issue closed)
  - Auto-create changelog entry from completed roadmap item
  - Move to "published" section in roadmap
  - Notify users who upvoted (email optional)
  - Link roadmap item to changelog entry
- **Output:** Completed roadmap items become changelog entries
- **Acceptance Criteria:**
  - ✅ Closed issues → changelog
  - ✅ Status updated automatically
  - ✅ Link between roadmap/changelog
  - ✅ Optional email notification

---

## 📅 Implementation Timeline

### **Week 1-2: Embeddable Widget + Social Post Drafts (14h)**

| Day | Task | Hours | Deliverable |
| :---- | :---- | :---- | :---- |
| Day 1 | Widget Script Generator | 2h | Widget settings page |
| Day 2 | Embeddable iframe Component | 2h | Widget endpoint + UI |
| Day 3 | Widget Customization | 2.5h | Customization options |
| Day 4 | Widget Analytics | 1.5h | Analytics tracking |
| Day 5 | Twitter Thread Generator | 2h | Twitter drafts |
| Day 6 | LinkedIn Post Generator | 1.5h | LinkedIn drafts |
| Day 7 | Social Post Preview + Copy | 2.5h | Preview + one-click copy |

**Milestone:** Widget + Social features live

---

### **Week 3-4: Email Integrations (10h)**

| Day | Task | Hours | Deliverable |
| :---- | :---- | :---- | :---- |
| Day 8 | Resend Integration | 3h | Email infrastructure |
| Day 9 | Email Template Builder | 3h | Release email template |
| Day 10 | Mailchimp Integration | 2.5h | Audience sync |
| Day 11 | Email Digest Subscriptions | 1.5h | Subscription system |

**Milestone:** Email digests working

---

### **Week 5-6: Analytics Dashboard (8h)**

| Day | Task | Hours | Deliverable |
| :---- | :---- | :---- | :---- |
| Day 12 | Page Views Tracking | 2h | View tracking |
| Day 13 | Unique Visitors Tracking | 2h | Visitor analytics |
| Day 14 | Most Viewed Entries | 2h | Leaderboard |
| Day 15 | Upvoting System | 2h | Upvote functionality |

**Milestone:** Analytics dashboard complete

---

### **Week 7-8: Roadmap from Issues (8h)**

| Day | Task | Hours | Deliverable |
| :---- | :---- | :---- | :---- |
| Day 16 | GitHub Issues Sync | 2.5h | Issues → GitLog |
| Day 17 | Roadmap Cards | 2.5h | Roadmap UI |
| Day 18 | Roadmap Upvoting | 1.5h | Public upvotes |
| Day 19 | Auto-move to Changelog | 1.5h | Roadmap → changelog |

**Milestone:** Phase 2 complete

---

## 🔧 Technical Requirements

### New Dependencies

```json
{
  "dependencies": {
    "resend": "^4.0.0",
    "@mailchimp/mailchimp-marketing": "^3.0.80",
    "@react-email/components": "^0.0.25",
    "@react-email/html": "^0.0.11"
  }
}
```

### Environment Variables (Add to `.env.local`)

```bash
# ============ Email (Resend) ============
RESEND_API_KEY=

# ============ Mailchimp ============
MAILCHIMP_API_KEY=
MAILCHIMP_AUDIENCE_ID=
MAILCHIMP_SERVER_PREFIX=

# ============ Analytics ============
NEXT_PUBLIC_GITLOG_ANALYTICS=true
```

### Database Schema Additions (Vercel KV)

```typescript
// Widget Configuration
kv.set(`widget:${userId}:${repoId}`, {
  id: string;
  userId: string;
  repoId: string;
  colors: { primary: string; background: string; text: string };
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
  options: { showDate: boolean; showCategory: boolean; showNewBadge: boolean };
  impressions: number;
  clicks: number;
});

// Social Post Drafts
kv.set(`social:${userId}:${entryId}:twitter`, {
  id: string;
  entryId: string;
  platform: 'twitter';
  tweets: string[]; // Array of tweet texts
  tone: string;
  createdAt: Date;
});

kv.set(`social:${userId}:${entryId}:linkedin`, {
  id: string;
  entryId: string;
  platform: 'linkedin';
  post: string;
  hashtags: string[];
  createdAt: Date;
});

// Email Subscribers
kv.set(`subscribers:${repoId}`, {
  emails: string[];
  subscribedAt: Date;
  confirmed: boolean;
});

// Analytics
kv.set(`analytics:views:${entryId}:${date}`, {
  entryId: string;
  date: string; // YYYY-MM-DD
  views: number;
  uniqueVisitors: number;
});

kv.set(`analytics:upvotes:${entryId}`, {
  entryId: string;
  count: number;
  voterIds: string[]; // Anonymous visitor IDs
});

// Roadmap
kv.set(`roadmap:${userId}:${repoId}:${issueId}`, {
  id: string;
  userId: string;
  repoId: string;
  issueId: number;
  title: string;
  body: string;
  status: 'planned' | 'in-progress' | 'completed';
  upvotes: number;
  voterIds: string[];
  githubIssueUrl: string;
  linkedEntryId?: string;
});
```

---

## 🧪 Testing Plan

### Widget Testing
- [ ] Embed widget on test website
- [ ] Verify widget loads correctly
- [ ] Test all customization options
- [ ] Check analytics tracking
- [ ] Test on mobile devices
- [ ] Verify CORS headers

### Social Posts Testing
- [ ] Generate Twitter threads for 5 entries
- [ ] Generate LinkedIn posts for 5 entries
- [ ] Verify character limits
- [ ] Test copy functionality
- [ ] Check preview accuracy

### Email Testing
- [ ] Send test email via Resend
- [ ] Verify email renders in Gmail, Outlook, Apple Mail
- [ ] Test Mailchimp sync
- [ ] Subscribe/unsubscribe flow
- [ ] Digest email on publish

### Analytics Testing
- [ ] Verify page views tracked
- [ ] Check unique visitor counting
- [ ] Test upvote functionality
- [ ] Verify leaderboard accuracy
- [ ] Check privacy compliance

### Roadmap Testing
- [ ] Sync GitHub Issues
- [ ] Verify roadmap cards display
- [ ] Test upvoting on public roadmap
- [ ] Auto-move to changelog on close
- [ ] Check notification system

---

## 📊 Success Metrics

| Metric | Target | Measurement |
| :---- | :---- | :---- |
| Widget embeds | 50+ sites | Widget analytics |
| Social posts generated | 100+ | Social draft count |
| Email subscribers | 200+ | Subscription count |
| Changelog views tracked | 1000+/month | Analytics dashboard |
| Roadmap upvotes | 500+ | Roadmap engagement |
| Phase 2 adoption rate | 40% of Pro users | Feature usage |

---

## 🚨 Risks & Mitigation

| Risk | Severity | Mitigation |
| :---- | :---- | :---- |
| Email deliverability issues | High | Use Resend (trusted provider), add SPF/DKIM |
| Widget slows down host sites | Medium | Lightweight script, async loading |
| Analytics privacy concerns | High | No PII, anonymous IDs, GDPR-compliant |
| Mailchimp API rate limits | Low | Batch sync, cache data |
| Roadmap spam via Issues | Medium | Filter by label, manual approval option |

---

## 🎉 Phase 2 Definition of Done

- [ ] All 20 tasks complete
- [ ] All acceptance criteria met
- [ ] Testing plan executed
- [ ] Documentation updated
- [ ] Features behind feature flags (optional)
- [ ] Analytics tracking working
- [ ] No critical bugs
- [ ] Performance targets met

---

**Next Steps:**
1. Review and approve this plan
2. Set up new API keys (Resend, Mailchimp)
3. Begin Week 1 implementation (Widget features)
4. Update progress daily in this document

---

*Last Updated: 2026-03-09*  
*Status: Ready to Start*
