# GitLog Phase 2 - Technical Specifications

**Created:** 2026-03-09  
**Version:** 1.0  
**Status:** Ready to Implement

---

## 1. Architecture Overview

### 1.1 System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     GitLog Phase 2                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Widget     │  │    Social    │  │    Email     │      │
│  │  Generator   │  │  Generator   │  │  Integrations│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           │                                 │
│                  ┌────────▼────────┐                        │
│                  │  AI Service     │                        │
│                  │  (Gemini)       │                        │
│                  └────────┬────────┘                        │
│                           │                                 │
│  ┌──────────────┐  ┌─────▼──────┐  ┌──────────────┐        │
│  │   Analytics  │  │   Vercel   │  │   Roadmap    │        │
│  │   Tracker    │  │     KV     │  │   Sync       │        │
│  └──────────────┘  └────────────┘  └──────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow

#### Widget Flow

```
User Dashboard → Generate Widget ID → Save Config → Embed Script
                                              ↓
Visitor Site → Load widget.js → Fetch Entries → Display Widget
                                              ↓
                                      Track Impression/Click
```

#### Social Post Flow

```
Published Entry → Trigger AI → Generate Tweets/LinkedIn → Save Draft
                                                        ↓
                                              User Reviews → Copies
```

#### Email Flow

```
Entry Published → Get Subscribers → Build Template → Send via Resend
                                                    ↓
                                          Sync to Mailchimp
```

#### Analytics Flow

```
Page Load → Generate Visitor ID → Track View → Store in KV
                                              ↓
                                      Aggregate → Display
```

#### Roadmap Flow

```
GitHub Issue (labeled) → Webhook → Sync to KV → Display Card
                                                    ↓
                                          User Upvotes → Sort
                                                    ↓
                                          Issue Closed → Changelog
```

---

## 2. Database Schema (Vercel KV)

### 2.1 Widget Configuration

```typescript
interface WidgetConfig {
  id: string; // Unique widget ID
  userId: string; // Owner user ID
  repoId: string; // Repository ID
  colors: {
    primary: string; // Primary brand color (hex)
    background: string; // Background color (hex)
    text: string; // Text color (hex)
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

// KV Key: widget:${userId}:${repoId}
```

### 2.2 Social Post Drafts

```typescript
interface TwitterDraft {
  id: string;
  entryId: string;
  userId: string;
  platform: 'twitter';
  tweets: string[]; // Array of tweet texts (≤280 chars each)
  tone: 'professional' | 'casual' | 'exciting';
  hashtags: string[];
  changelogLink: string;
  createdAt: Date;
}

interface LinkedInDraft {
  id: string;
  entryId: string;
  userId: string;
  platform: 'linkedin';
  post: string; // 1000-1300 characters
  hashtags: string[];
  changelogLink: string;
  cta: string;
  createdAt: Date;
}

// KV Keys:
// - social:${userId}:${entryId}:twitter
// - social:${userId}:${entryId}:linkedin
```

### 2.3 Email Subscribers

```typescript
interface EmailSubscriber {
  repoId: string;
  emails: Array<{
    email: string;
    subscribedAt: Date;
    confirmed: boolean;
    confirmToken: string;
    preferences: {
      digest: boolean;
      majorReleases: boolean;
      allUpdates: boolean;
    };
  }>;
  totalSubscribers: number;
}

// KV Key: subscribers:${repoId}
```

### 2.4 Analytics Data

```typescript
interface PageView {
  entryId: string;
  date: string; // YYYY-MM-DD
  views: number;
  uniqueVisitors: number;
  visitorIds: string[]; // Anonymous IDs
}

interface Upvotes {
  entryId: string;
  count: number;
  voterIds: string[]; // Anonymous visitor IDs
}

// KV Keys:
// - analytics:views:${entryId}:${date}
// - analytics:upvotes:${entryId}
```

### 2.5 Roadmap Items

```typescript
interface RoadmapItem {
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
  labels: string[];
  linkedEntryId?: string; // When moved to changelog
  createdAt: Date;
  updatedAt: Date;
}

// KV Key: roadmap:${userId}:${repoId}:${issueId}
```

---

## 3. API Endpoints

### 3.1 Widget Endpoints

| Endpoint                 | Method | Auth | Description              |
| :----------------------- | :----- | :--- | :----------------------- |
| `/api/widget/generate`   | POST   | User | Generate widget for repo |
| `/api/widget/config`     | GET    | User | Get widget config        |
| `/api/widget/config`     | PUT    | User | Update widget config     |
| `/api/widget/[widgetId]` | GET    | None | Public widget data       |
| `/api/widget/track`      | POST   | None | Track impression/click   |

### 3.2 Social Endpoints

| Endpoint                        | Method | Auth | Description             |
| :------------------------------ | :----- | :--- | :---------------------- |
| `/api/social/generate/twitter`  | POST   | User | Generate Twitter thread |
| `/api/social/generate/linkedin` | POST   | User | Generate LinkedIn post  |
| `/api/social/drafts`            | GET    | User | Get all social drafts   |
| `/api/social/draft/[id]`        | DELETE | User | Delete draft            |

### 3.3 Email Endpoints

| Endpoint                    | Method | Auth | Description          |
| :-------------------------- | :----- | :--- | :------------------- |
| `/api/email/subscribe`      | POST   | None | Subscribe to digest  |
| `/api/email/unsubscribe`    | POST   | None | Unsubscribe          |
| `/api/email/confirm`        | GET    | None | Confirm subscription |
| `/api/email/send`           | POST   | User | Send release email   |
| `/api/email/sync-mailchimp` | POST   | User | Sync to Mailchimp    |

### 3.4 Analytics Endpoints

| Endpoint                     | Method | Auth | Description     |
| :--------------------------- | :----- | :--- | :-------------- |
| `/api/analytics/track`       | POST   | None | Track page view |
| `/api/analytics/upvote`      | POST   | None | Upvote entry    |
| `/api/analytics/views`       | GET    | User | Get view stats  |
| `/api/analytics/leaderboard` | GET    | User | Get most viewed |

### 3.5 Roadmap Endpoints

| Endpoint              | Method | Auth        | Description         |
| :-------------------- | :----- | :---------- | :------------------ |
| `/api/roadmap/sync`   | POST   | User        | Sync GitHub Issues  |
| `/api/roadmap/items`  | GET    | User/Public | Get roadmap items   |
| `/api/roadmap/upvote` | POST   | None        | Upvote roadmap item |
| `/api/roadmap/status` | PUT    | User        | Update item status  |

---

## 4. AI Prompts

### 4.1 Twitter Thread Generator

```typescript
const twitterPrompt = `
You are a social media manager creating a Twitter thread for a product changelog.

Rules:
- Create 2-5 tweets
- Each tweet must be ≤280 characters
- Use engaging language with emojis
- Include 2-3 relevant hashtags
- Last tweet includes link to changelog
- Thread should tell a story: problem → solution → impact

Changelog Entry:
Title: {{title}}
Category: {{category}}
AI Rewrite: {{aiRewrite}}
Labels: {{labels}}

Generate Twitter thread (JSON array of tweets):
`;
```

### 4.2 LinkedIn Post Generator

```typescript
const linkedinPrompt = `
You are a professional content writer creating a LinkedIn post for a product update.

Rules:
- Write 1000-1300 characters
- Professional but approachable tone
- Start with a hook
- Explain the problem and solution
- Include business impact
- Add 3-5 relevant hashtags
- End with clear CTA and link

Changelog Entry:
Title: {{title}}
Category: {{category}}
AI Rewrite: {{aiRewrite}}
Labels: {{labels}}

Generate LinkedIn post:
`;
```

---

## 5. Component Specifications

### 5.1 Widget Component

```typescript
// src/shared/components/widgets/embeddable-widget.tsx

interface EmbeddableWidgetProps {
  widgetId: string;
  config: WidgetConfig;
  entries: ChangelogEntry[];
}

// Features:
// - Displays badge with "What's New" + count
// - Dropdown shows latest 3-5 entries
// - Click entry → opens full changelog
// - Tracks impressions on load
// - Tracks clicks on entry selection
// - Responsive design
// - Customizable via config
```

### 5.2 Social Post Preview

```typescript
// src/shared/components/social/post-preview.tsx

interface TwitterPreviewProps {
  tweets: string[];
  authorName: string;
  authorHandle: string;
  authorImage: string;
}

interface LinkedInPreviewProps {
  post: string;
  authorName: string;
  authorTitle: string;
  authorImage: string;
}

// Features:
// - Mimics actual platform UI
// - Shows character count
// - Displays link preview card
// - Copy button per post/thread
```

### 5.3 Email Template

```typescript
// src/features/email/templates/release-email.tsx

interface ReleaseEmailTemplateProps {
  repoName: string;
  entries: ChangelogEntry[];
  publishedAt: string;
  viewOnlineLink: string;
  unsubscribeLink: string;
  branding: {
    logo?: string;
    primaryColor: string;
  };
}

// Features:
// - HTML email (table-based for compatibility)
// - Mobile responsive
// - Works in Gmail, Outlook, Apple Mail
// - Includes all entries by category
// - "View Online" link
// - Unsubscribe link (required)
```

### 5.4 Analytics Dashboard

```typescript
// src/app/(dashboard)/analytics/page.tsx

// Features:
// - Overview cards (total views, unique visitors, upvotes)
// - Most viewed entries leaderboard
// - Time period filter (7d, 30d, all-time)
// - Trend indicators (↑ ↓)
// - Chart of views over time (optional)
// - Export to CSV (optional)
```

### 5.5 Roadmap Cards

```typescript
// src/features/roadmap/roadmap-cards.tsx

interface RoadmapCardProps {
  item: RoadmapItem;
  onStatusChange: (status: RoadmapItem['status']) => void;
  onMoveToChangelog: () => void;
}

// Features:
// - Displays issue title + description
// - Shows upvote count + button
// - Status badge (planned/in progress/completed)
// - GitHub link
// - Move to changelog action (when completed)
```

---

## 6. Security Considerations

### 6.1 Authentication

- All user-specific endpoints require authentication
- Public endpoints (widget, upvotes, subscriptions) are rate-limited
- CSRF protection on all POST endpoints

### 6.2 Rate Limiting

```typescript
const rateLimits = {
  // Widget tracking
  widgetTrack: { limit: 1000, window: '1h' },

  // Upvotes
  upvote: { limit: 10, window: '1h' },

  // Email subscriptions
  subscribe: { limit: 5, window: '1h' },

  // Social generation
  generateSocial: { limit: 20, window: '1h' },
};
```

### 6.3 Privacy Compliance

- No PII stored for analytics
- Anonymous visitor IDs (fingerprint or cookie-based)
- GDPR-compliant data retention (90 days for analytics)
- Unsubscribe links in all emails
- Double opt-in for email subscriptions (optional)

---

## 7. Performance Targets

| Metric            | Target | Measurement       |
| :---------------- | :----- | :---------------- |
| Widget load time  | <1s    | Lighthouse        |
| Social generation | <5s    | API response time |
| Email send        | <10s   | End-to-end        |
| Analytics track   | <100ms | API response time |
| Roadmap sync      | <30s   | GitHub API → KV   |

---

## 8. Error Handling

### 8.1 Error Codes

```typescript
enum Phase2ErrorCodes {
  // Widget
  WIDGET_NOT_FOUND = 'WIDGET_NOT_FOUND',
  WIDGET_CONFIG_INVALID = 'WIDGET_CONFIG_INVALID',

  // Social
  SOCIAL_GENERATION_FAILED = 'SOCIAL_GENERATION_FAILED',
  SOCIAL_RATE_LIMITED = 'SOCIAL_RATE_LIMITED',

  // Email
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  EMAIL_INVALID_RECIPIENT = 'EMAIL_INVALID_RECIPIENT',
  EMAIL_SUBSCRIBER_EXISTS = 'EMAIL_SUBSCRIBER_EXISTS',

  // Analytics
  ANALYTICS_TRACK_FAILED = 'ANALYTICS_TRACK_FAILED',

  // Roadmap
  ROADMAP_SYNC_FAILED = 'ROADMAP_SYNC_FAILED',
  ROADMAP_ISSUE_NOT_FOUND = 'ROADMAP_ISSUE_NOT_FOUND',
}
```

### 8.2 Error Responses

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
```

---

## 9. Testing Strategy

### 9.1 Unit Tests

- Widget config generation
- Social post character limits
- Email template rendering
- Analytics aggregation
- Roadmap status transitions

### 9.2 Integration Tests

- Widget embed on external site
- Social generation → preview → copy
- Email subscription → confirmation → send
- Analytics tracking → aggregation → display
- GitHub Issues → roadmap → changelog

### 9.3 E2E Tests

- Full widget flow (generate → embed → track)
- Full social flow (generate → preview → copy)
- Full email flow (subscribe → send → unsubscribe)
- Full analytics flow (track → aggregate → display)
- Full roadmap flow (sync → upvote → complete → changelog)

---

## 10. Deployment Checklist

### Pre-Deployment

- [ ] All environment variables set
- [ ] Resend API key configured
- [ ] Mailchimp credentials set
- [ ] Feature flags configured (if using)
- [ ] Rate limiting enabled
- [ ] Error logging configured

### Post-Deployment

- [ ] Widget loads correctly
- [ ] Social generation works
- [ ] Email sends successfully
- [ ] Analytics tracking works
- [ ] Roadmap sync works
- [ ] No console errors
- [ ] Performance targets met

---

**Last Updated:** 2026-03-09  
**Version:** 1.0  
**Status:** Ready to Implement
