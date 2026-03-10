# GitLog Database Schema - Complete Reference

**Database:** Vercel KV (Redis)  
**Last Updated:** 2026-03-09  
**Status:** Complete Schema Documentation

---

## 📊 Database Tables Overview

### Total Tables: 15+ Collections

| #   | Table/Collection   | Prefix                | Purpose                    | Phase   |
| :-- | :----------------- | :-------------------- | :------------------------- | :------ |
| 1   | Users              | `user:`               | User configuration & plans | MVP     |
| 2   | Repositories       | `repo:`               | Connected GitHub repos     | MVP     |
| 3   | Changelog Entries  | `entry:`              | Draft & published entries  | MVP     |
| 4   | Usage Tracking     | `usage:`              | Monthly usage limits       | MVP     |
| 5   | Payment Info       | `user:*:dodo_*`       | Payment subscriptions      | MVP     |
| 6   | Social Posts       | `social:`             | Generated social posts     | Phase 2 |
| 7   | Widget Config      | `widget:`             | Widget settings            | Phase 2 |
| 8   | Widget Analytics   | `widget:*:`           | Widget impressions/clicks  | Phase 2 |
| 9   | Email Subscribers  | `subscriber:`         | Email digest subscribers   | Phase 2 |
| 10  | Analytics Views    | `analytics:views:`    | Page view tracking         | Phase 2 |
| 11  | Analytics Visitors | `analytics:visitor:`  | Unique visitor tracking    | Phase 2 |
| 12  | Analytics Upvotes  | `analytics:upvotes:`  | Entry upvotes              | Phase 2 |
| 13  | Roadmap Items      | `roadmap:`            | GitHub Issues roadmap      | Phase 2 |
| 14  | Roadmap Upvotes    | `roadmap:upvotes:`    | Roadmap item upvotes       | Phase 2 |
| 15  | GitHub Tokens      | `user:*:github_token` | GitHub OAuth tokens        | MVP     |

---

## 📋 Detailed Schema

### 1. Users (`user:`)

**Purpose:** Store user configuration and subscription info

**Key Format:** `user:{userId}`

**Schema:**

```typescript
interface UserConfig {
  id: string; // Clerk user ID
  email: string; // User's email
  plan: 'free' | 'pro'; // Subscription plan
  dodoCustomerId?: string; // DodoPayment customer ID
  githubToken?: string; // GitHub OAuth token
  createdAt: string; // ISO timestamp
  location?: 'in' | 'intl'; // India or International
}
```

**Operations:**

- ✅ SET on user signup
- ✅ GET on every authenticated request
- ✅ UPDATE on plan change
- ✅ DELETE on account deletion

**Used By:**

- Dashboard page
- Settings page
- Payment webhook
- All authenticated API routes

---

### 2. Repositories (`repo:`)

**Purpose:** Store connected GitHub repositories

**Key Formats:**

- `repo:{userId}:{repoId}` - User's repos
- `repo:{repoName}:users:{userId}` - Repo-to-user mapping

**Schema:**

```typescript
interface ConnectedRepo {
  id: string; // Unique repo ID
  userId: string; // Owner user ID
  githubRepoId: number; // GitHub repo ID
  name: string; // "owner/repo" format
  slug: string; // URL-safe version
  isPrivate: boolean; // Public or private
  connectedAt: string; // ISO timestamp
  webhookId?: number; // GitHub webhook ID
}
```

**Operations:**

- ✅ SET on repo connect
- ✅ GET to list connected repos
- ✅ DELETE on disconnect
- ✅ SCAN to find repos by user

**Used By:**

- Settings page
- Onboarding flow
- GitHub sync
- Webhook receiver

---

### 3. Changelog Entries (`entry:`)

**Purpose:** Store draft and published changelog entries

**Key Format:** `entry:{userId}:{repoId}:{prId}`

**Schema:**

```typescript
interface ChangelogEntry {
  id: string; // Unique entry ID
  userId: string; // Owner user ID
  repoId: string; // "owner/repo" format
  prId: number; // GitHub PR number
  title: string; // PR title
  body: string; // PR description
  category: 'New' | 'Fixed' | 'Improved' | 'Other';
  status: 'draft' | 'published';
  mergedAt: string; // ISO timestamp
  publishedAt?: string; // ISO timestamp (if published)
  prUrl: string; // GitHub PR URL
  author: string; // PR author
  aiRewrite?: string | null; // AI-generated summary
  labels: string[]; // GitHub labels
}
```

**Operations:**

- ✅ SET on PR merge (webhook)
- ✅ GET to list drafts/published
- ✅ UPDATE on edit
- ✅ DELETE on discard
- ✅ SCAN by user and repo

**Used By:**

- Dashboard page
- Drafts page
- Published page
- Public changelog
- AI rewrite

---

### 4. Usage Tracking (`usage:`)

**Purpose:** Track monthly usage for plan limits

**Key Format:** `usage:{userId}:{YYYY-MM}`

**Schema:**

```typescript
interface Usage {
  entriesPublished: number; // Count this month
  aiRewrites: number; // AI rewrites this month
}
```

**Operations:**

- ✅ SET on publish/rewrite
- ✅ GET to check limits
- ✅ INCR on each usage
- ✅ RESET on new month

**Used By:**

- Dashboard (usage card)
- Publish API
- AI rewrite API
- Upgrade prompts

---

### 5. Payment Info (`user:*:dodo_*`)

**Purpose:** Store payment subscription info

**Key Formats:**

- `user:{userId}:dodo_customer_id` - Customer ID
- `user:{userId}:dodo_subscription_id` - Subscription ID

**Schema:**

```typescript
string; // DodoPayment ID
```

**Operations:**

- ✅ SET on subscription create
- ✅ GET to check subscription
- ✅ DELETE on cancel
- ✅ UPDATE on renewal

**Used By:**

- Payment webhook
- Settings page
- Upgrade page
- Plan check middleware

---

### 6. Social Posts (`social:`) - Phase 2

**Purpose:** Store generated social media posts

**Key Format:** `social:{userId}:{entryId}:{platform}`

**Schema:**

```typescript
interface TwitterDraft {
  id: string; // Unique draft ID
  entryId: string; // Changelog entry ID
  userId: string; // Owner user ID
  platform: 'twitter' | 'linkedin';
  tweets?: string[]; // Array of tweets (Twitter)
  post?: string; // Full post (LinkedIn)
  hashtags: string[]; // Hashtags
  tone?: string; // Tone used
  createdAt: string; // ISO timestamp
}
```

**Operations:**

- ✅ SET on generate
- ✅ GET to retrieve drafts
- ✅ DELETE on discard

**Used By:**

- Social posts page
- Generate API
- Preview components

---

### 7. Widget Config (`widget:`) - Phase 2

**Purpose:** Store widget configuration

**Key Format:** `widget:{userId}:{repoId}`

**Schema:**

```typescript
interface WidgetConfig {
  id: string; // Widget ID
  userId: string; // Owner user ID
  repoId: string; // "owner/repo" format
  colors: {
    primary: string; // Hex color
    background: string; // Hex color
    text: string; // Hex color
  };
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
  options: {
    showDate: boolean;
    showCategory: boolean;
    showNewBadge: boolean;
  };
  impressions: number; // Total impressions
  clicks: number; // Total clicks
  createdAt: Date;
  updatedAt: Date;
}
```

**Operations:**

- ✅ SET on generate/customize
- ✅ GET to retrieve config
- ✅ UPDATE on customize
- ✅ INCR on impression/click

**Used By:**

- Widget page
- Widget customizer
- Public widget endpoint
- Analytics

---

### 8. Widget Analytics (`widget:*:`) - Phase 2

**Purpose:** Track widget performance

**Key Formats:**

- `widget:impressions:{widgetId}` - Total impressions
- `widget:clicks:{widgetId}` - Total clicks
- `widget:entry:{widgetId}:{entryId}:clicks` - Entry clicks

**Schema:**

```typescript
number; // Count
```

**Operations:**

- ✅ INCR on impression
- ✅ INCR on click
- ✅ GET for analytics

**Used By:**

- Widget analytics page
- Widget track API
- Public widget endpoint

---

### 9. Email Subscribers (`subscriber:`) - Phase 2

**Purpose:** Store email digest subscribers

**Key Format:** `subscriber:{repoId}:{email}`

**Schema:**

```typescript
interface EmailSubscriber {
  email: string; // Subscriber email
  repoId: string; // "owner/repo" format
  subscribedAt: string; // ISO timestamp
  confirmed: boolean; // Double opt-in status
  confirmToken: string; // Confirmation token
  preferences: {
    digest: boolean;
    majorReleases: boolean;
    allUpdates: boolean;
  };
}
```

**Operations:**

- ✅ SET on subscribe
- ✅ GET to check status
- ✅ DELETE on unsubscribe
- ✅ UPDATE on confirm

**Used By:**

- Subscribe form
- Email confirmation
- Send digest API
- Mailchimp sync

---

### 10. Analytics Views (`analytics:views:`) - Phase 2

**Purpose:** Track daily page views

**Key Format:** `analytics:views:{entryId}:{YYYY-MM-DD}`

**Schema:**

```typescript
interface PageView {
  entryId: string; // Entry ID
  date: string; // YYYY-MM-DD
  views: number; // Total views today
  uniqueVisitors: number; // Unique visitors today
  visitorIds: string[]; // Anonymous visitor IDs
}
```

**Operations:**

- ✅ SET on page view
- ✅ GET for analytics
- ✅ INCR on each view
- ✅ SCAN by entry

**Used By:**

- Analytics track API
- Most viewed page
- Public changelog (tracking)

---

### 11. Analytics Visitors (`analytics:visitor:`) - Phase 2

**Purpose:** Track unique visitors

**Key Format:** `analytics:visitor:{visitorId}`

**Schema:**

```typescript
interface Visitor {
  id: string; // Visitor ID
  fingerprint: string; // Browser fingerprint
  firstVisit: string; // ISO date
  lastVisit: string; // ISO date
  pageViews: number; // Total page views
  entries: string[]; // Entries viewed
}
```

**Operations:**

- ✅ SET on first visit
- ✅ UPDATE on return visit
- ✅ GET for analytics
- ✅ SCAN by entry

**Used By:**

- Analytics track API
- Visitor stats

---

### 12. Analytics Upvotes (`analytics:upvotes:`) - Phase 2

**Purpose:** Track entry upvotes

**Key Formats:**

- `analytics:upvotes:{entryId}` - Vote count
- `analytics:upvotes:{entryId}:voters` - Voter IDs (set)

**Schema:**

```typescript
number  // Vote count (for count key)
string[]  // Voter IDs (for voters set)
```

**Operations:**

- ✅ INCR on upvote
- ✅ SADD to add voter
- ✅ SISMEMBER to check if voted
- ✅ GET for count

**Used By:**

- Upvote button
- Upvote API
- Public changelog

---

### 13. Roadmap Items (`roadmap:`) - Phase 2

**Purpose:** Store roadmap items from GitHub Issues

**Key Format:** `roadmap:{userId}:{repoId}:{issueId}`

**Schema:**

```typescript
interface RoadmapItem {
  id: string; // Unique ID
  userId: string; // Owner user ID
  repoId: string; // "owner/repo" format
  issueId: number; // GitHub issue number
  title: string; // Issue title
  body: string; // Issue description
  status: 'planned' | 'in-progress' | 'completed';
  upvotes: number; // Upvote count
  voterIds: string[]; // Upvoter IDs
  githubIssueUrl: string; // GitHub issue URL
  labels: string[]; // GitHub labels
  linkedEntryId?: string; // Linked changelog entry
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

**Operations:**

- ✅ SET on sync
- ✅ GET to list roadmap
- ✅ UPDATE on status change
- ✅ SCAN by user/repo

**Used By:**

- Roadmap page
- Public roadmap
- GitHub sync API
- Auto-move to changelog

---

### 14. Roadmap Upvotes (`roadmap:upvotes:`) - Phase 2

**Purpose:** Track roadmap item upvotes

**Key Formats:**

- `roadmap:upvotes:{roadmapId}` - Vote count
- `roadmap:upvotes:{roadmapId}:voters` - Voter IDs (set)

**Schema:**

```typescript
number  // Vote count
string[]  // Voter IDs
```

**Operations:**

- ✅ INCR on upvote
- ✅ SADD to add voter
- ✅ SISMEMBER to check if voted

**Used By:**

- Roadmap upvote API
- Public roadmap

---

### 15. GitHub Tokens (`user:*:github_token`) - MVP

**Purpose:** Store GitHub OAuth tokens

**Key Format:** `user:{userId}:github_token`

**Schema:**

```typescript
string; // GitHub OAuth token
```

**Operations:**

- ✅ SET on OAuth connect
- ✅ GET for GitHub API calls
- ✅ DELETE on disconnect

**Used By:**

- GitHub sync
- Repo connect
- Issues sync

---

## 🔄 Data Flow Diagrams

### New User Signup Flow

```
1. User signs in with GitHub
        ↓
2. Clerk creates user account
        ↓
3. Create user record in KV
   → SET user:{userId} = {
       id, email, plan: 'free',
       createdAt, location
     }
        ↓
4. Redirect to onboarding
        ↓
5. Connect repository
   → SET repo:{userId}:{repoId}
   → SET user:{userId}:github_token
        ↓
6. Dashboard ready
```

---

### PR Merge Flow (Webhook)

```
1. PR merged on GitHub
        ↓
2. GitHub sends webhook
   → POST /api/github/sync
        ↓
3. Verify webhook signature
        ↓
4. Extract PR data
        ↓
5. Create draft entry
   → SET entry:{userId}:{repoId}:{prId} = {
       title, body, category,
       status: 'draft', mergedAt, ...
     }
        ↓
6. Draft appears in dashboard
```

---

### Publish Entry Flow

```
1. User clicks "Publish" on draft
        ↓
2. Check plan limits
   → GET usage:{userId}:{YYYY-MM}
        ↓
3. If under limit:
   → UPDATE entry:{id} = { status: 'published', publishedAt }
   → INCR usage:{userId}:{YYYY-MM}.entriesPublished
        ↓
4. If Phase 2 enabled:
   → Check for email subscribers
   → GET subscriber:{repoId}:*
   → Send digest email (if any)
        ↓
5. Entry live on public changelog
```

---

### Widget Embed Flow

```
1. User generates widget
        ↓
2. SET widget:{userId}:{repoId} = { config }
        ↓
3. User embeds script on website
        ↓
4. Visitor loads page
        ↓
5. Widget script loads
   → GET /api/widget/{widgetId}
        ↓
6. Track impression
   → INCR widget:impressions:{widgetId}
        ↓
7. Display changelog entries
```

---

### Email Subscription Flow

```
1. User visits public changelog
        ↓
2. Clicks "Subscribe to updates"
        ↓
3. Enters email
        ↓
4. SET subscriber:{repoId}:{email} = {
       email, repoId, subscribedAt,
       confirmed: false, confirmToken
     }
        ↓
5. Send confirmation email
        ↓
6. User clicks confirmation link
        ↓
7. UPDATE subscriber = { confirmed: true }
        ↓
8. Subscribed to digest
```

---

## 📊 Data Storage Summary

### MVP Tables (5 tables)

1. ✅ Users (`user:`)
2. ✅ Repositories (`repo:`)
3. ✅ Changelog Entries (`entry:`)
4. ✅ Usage Tracking (`usage:`)
5. ✅ Payment Info (`user:*:dodo_*`)

### Phase 2 Tables (10 tables)

6. ✅ Social Posts (`social:`)
7. ✅ Widget Config (`widget:`)
8. ✅ Widget Analytics (`widget:*:`)
9. ✅ Email Subscribers (`subscriber:`)
10. ✅ Analytics Views (`analytics:views:`)
11. ✅ Analytics Visitors (`analytics:visitor:`)
12. ✅ Analytics Upvotes (`analytics:upvotes:`)
13. ✅ Roadmap Items (`roadmap:`)
14. ✅ Roadmap Upvotes (`roadmap:upvotes:`)
15. ✅ GitHub Tokens (`user:*:github_token`)

---

## 🔐 Security & Privacy

### Data Encryption

- ✅ GitHub tokens encrypted at rest
- ✅ No sensitive data in logs
- ✅ Clerk handles auth securely

### Privacy Compliance

- ✅ Anonymous visitor IDs (no PII)
- ✅ Email double opt-in
- ✅ Unsubscribe functionality
- ✅ GDPR-compliant analytics

### Access Control

- ✅ User ID verification on all requests
- ✅ Repo ownership verification
- ✅ Webhook signature verification
- ✅ Rate limiting per user

---

## 📈 Database Performance

### Key Optimization Strategies

1. **Key Naming:** Consistent prefixes for easy scanning
2. **Batch Operations:** Promise.all for parallel fetches
3. **Caching:** Client-side where appropriate
4. **Indexing:** Maintain reverse mappings for lookups
5. **Cleanup:** Delete orphaned records

### Estimated Storage (per user)

- **Free user:** ~100-500 KB
- **Pro user:** ~1-5 MB
- **Average:** ~500 KB per user

---

**All data properly stored and connected!** ✅

---

_Last Updated: 2026-03-09_  
_Status: Complete Database Schema Documentation_
