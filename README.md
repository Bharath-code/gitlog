# GitLog - Auto-Changelog from GitHub

**Status:** ✅ **Phase 3 Complete - Enterprise Ready**  
**Launch:** Ready for Production  
**Users:** 100+ beta users  
**Tech Stack:** Next.js 15, Clerk, Vercel KV, Google Gemini, DodoPayment, Resend, Mailchimp

---

## 🎯 What is GitLog?

**GitLog** is the complete release communication platform for developers. Connect to GitHub once and automatically generate public changelogs, embeddable widgets, social media posts, email digests, and public roadmaps. Zero manual writing.

**Value Prop:** Merge a PR → Get a public changelog, social posts, email digest, and roadmap update in under 60 seconds.

---

## 🚀 What's New in Phase 2

### ✅ **20 New Features Shipped** (Month 2-3)

#### **1. Embeddable Widget** (4 tasks) ✅
- 🎨 Widget script generator with customization
- 📱 Embeddable iframe component (CORS-enabled)
- 🎯 Widget customization (colors, position, size)
- 📊 Widget analytics (impressions, clicks, CTR)

#### **2. Social Post Drafts** (4 tasks) ✅
- 🐦 Twitter thread generator (AI-powered, 2-5 tweets)
- 💼 LinkedIn post generator (AI-powered, 1000-1300 chars)
- 👀 Social post preview (looks like real posts)
- 📋 One-click copy to clipboard

#### **3. Email Integrations** (4 tasks) ✅
- 📧 Resend integration (transactional emails)
- 📨 Email template builder (beautiful HTML templates)
- 📬 Mailchimp integration (audience sync)
- 📮 Email digest subscriptions (double opt-in)

#### **4. Analytics Dashboard** (4 tasks) ✅
- 📈 Page views tracking (per entry, daily stats)
- 👥 Unique visitors tracking (new vs returning)
- 🔥 Most viewed entries (leaderboard with trends)
- 👍 Upvoting system (one vote per visitor)

#### **5. Roadmap from Issues** (4 tasks) ✅
- 🔄 GitHub Issues sync (auto-fetch roadmap items)
- 📋 Roadmap cards (Kanban-style board)
- 🗳️ Upvoting functionality (public roadmap)
- ✨ Auto-move to changelog (completed → published)

---

## 🚀 What's New in Phase 3

### ✅ **Flexible Publishing System** (Month 4)

#### **1. Auto-Publish Toggle** ✅
- ⚡ Automatically publish merged PRs
- 🔔 No manual review required
- ⚙️ Configurable per user

#### **2. Batch Publish** ✅
- ✅ Select multiple drafts
- 📦 Publish all at once
- 🎯 Review before publishing

#### **3. Scheduled Publishing** ✅
- 📅 Weekly digest (choose day)
- 📆 Monthly roundup (choose date)
- ⏰ Auto-publish at 9 AM UTC
- 📧 Email digest automation

#### **4. Release Grouping** ✅
- 🏷️ Versioned releases (v1.0.0, v1.1.0)
- 📝 Release notes & highlights
- 🔀 Semantic versioning support
- 📊 Migration guides

#### **5. Advanced Filtering** ✅
- 🎯 Filter by label, author, title, files, size
- 🔍 Regex support
- ⚡ Priority-based rules
- 🎁 Preset filters (exclude chores, tests, etc.)

---

## 🎨 Branding & Discovery Improvements

### ✅ **6 Major Enhancements**

1. **GitHub Metadata Display** - User avatar, repo description, stars, forks, company, location
2. **Social Sharing Buttons** - Twitter, LinkedIn, Copy Link, RSS Feed
3. **RSS Feed** - Auto-generated for each changelog
4. **More from User** - Cross-link to other changelogs
5. **Enhanced Footer CTA** - Gradient button with Sparkles icon
6. **Rich SEO** - Meta tags, Open Graph, Twitter Cards, JSON-LD

---

## 💰 Pricing

| Plan | Price | Entries/Mo | AI Rewrites | Repos | Features |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Free** | ₹0/$0 | 50 | 50 | 1 | All core features |
| **Pro** | ₹499/$19 | ∞ | ∞ | ∞ | All features + Priority support |

**Geo-Pricing:** India ₹499/mo | International $19/mo

**Payment:** DodoPayment (Cards + UPI)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- GitHub account
- Clerk account (free)
- Vercel account (free)
- Vercel KV store (free)
- Google AI Studio API key (free)
- Resend API key (Phase 2, free tier)
- Mailchimp account (Phase 2, free tier)

### 1. Clone & Install

```bash
cd gitlog
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# ============ Clerk Auth ============
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...

# ============ Database ============
VERCEL_KV_REST_API_URL=https://...
VERCEL_KV_REST_API_TOKEN=...

# ============ AI ============
GOOGLE_GENERATIVE_AI_API_KEY=...

# ============ Payments (DodoPayment) ============
DODOPAYMENT_API_KEY=...
DODOPAYMENT_WEBHOOK_SECRET=...
DODOPAYMENT_PRO_PLAN_ID=...
NEXT_PUBLIC_DODOPAYMENT_KEY=...

# ============ GitHub ============
GITHUB_WEBHOOK_SECRET=whsec_...
GITHUB_TOKEN=ghp_...

# ============ Email (Phase 2) ============
RESEND_API_KEY=re_...
MAILCHIMP_API_KEY=...
MAILCHIMP_AUDIENCE_ID=...
MAILCHIMP_SERVER_PREFIX=...

# ============ App ============
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GITLOG_ANALYTICS=true
```

### 3. Configure Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application
3. Enable **GitHub OAuth** in Authentication → Social
4. Copy keys to `.env.local`
5. Set **After Sign-In/Up URL** to `/onboarding`

### 4. Create Vercel KV Store

1. Go to Vercel Dashboard
2. Create new project
3. Add Storage → Vercel KV (free tier)
4. Copy credentials to `.env.local`

### 5. Get API Keys

| Service | Purpose | Get Key |
| :---- | :---- | :---- |
| **Google AI Studio** | AI rewrites | [Get Key](https://aistudio.google.com) |
| **Resend** | Email digests | [Get Key](https://resend.com) |
| **Mailchimp** | Audience sync | [Get Key](https://mailchimp.com) |
| **DodoPayment** | Payments | [Get Key](https://dodopayment.com) |

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
gitlog/
├── app/
│   ├── (auth)/                    # Sign in/up pages
│   ├── (dashboard)/               # Dashboard pages (protected)
│   │   ├── dashboard/             # Overview
│   │   ├── drafts/                # Draft management
│   │   ├── published/             # Published entries
│   │   ├── settings/              # Settings
│   │   ├── social/                # Social post drafts (Phase 2)
│   │   ├── roadmap/               # Roadmap from Issues (Phase 2)
│   │   ├── widget/                # Widget generator (Phase 2)
│   │   ├── analytics/             # Analytics dashboard (Phase 2)
│   │   │   ├── widgets/           # Widget analytics
│   │   │   └── most-viewed/       # Most viewed entries
│   │   ├── billing/               # Billing & subscription (Phase 2)
│   │   └── search/                # Global search
│   ├── (public)/                  # Public pages
│   │   ├── changelog/             # /changelog/[user]/[repo]
│   │   │   └── [user]/[repo]/
│   │   │       ├── page.tsx       # Main changelog (enhanced)
│   │   │       └── subscribe/     # Email subscriptions
│   │   ├── widget/                # /widget/[widgetId] (Phase 2)
│   │   └── roadmap/               # /roadmap/[user]/[repo] (Phase 2)
│   ├── (marketing)/               # Landing page
│   ├── api/                       # API routes (20+ endpoints)
│   │   ├── github/                # GitHub webhooks + sync
│   │   ├── ai/                    # AI rewrite endpoint
│   │   ├── entries/               # Publish/unpublish
│   │   ├── social/                # Social post generation (Phase 2)
│   │   ├── email/                 # Email subscriptions (Phase 2)
│   │   ├── analytics/             # Analytics tracking (Phase 2)
│   │   ├── roadmap/               # Roadmap sync (Phase 2)
│   │   ├── widget/                # Widget endpoints (Phase 2)
│   │   ├── payment/               # Payment processing
│   │   └── user/                  # User management
│   └── layout.tsx                 # Root layout + Clerk
├── features/
│   ├── dashboard/                 # Dashboard components
│   ├── drafts/                    # Draft components + logic
│   ├── published/                 # Published components
│   ├── settings/                  # Settings components
│   ├── social/                    # Social post generators (Phase 2)
│   ├── email/                     # Email integrations (Phase 2)
│   ├── analytics/                 # Analytics tracking (Phase 2)
│   ├── roadmap/                   # Roadmap from Issues (Phase 2)
│   └── widget/                    # Widget components (Phase 2)
├── shared/
│   ├── components/
│   │   ├── ui/                    # Shadcn components
│   │   ├── layout/                # Header, sidebar
│   │   ├── common/                # Common components (tooltip, search)
│   │   ├── widgets/               # Widget components (Phase 2)
│   │   ├── social/                # Social post previews (Phase 2)
│   │   ├── analytics/             # Analytics components (Phase 2)
│   │   └── email/                 # Email components (Phase 2)
│   ├── lib/
│   │   ├── db/                    # Database helpers
│   │   ├── github/                # GitHub API helpers
│   │   ├── ai/                    # AI helpers (Gemini)
│   │   ├── payment/               # Payment helpers (Dodo)
│   │   ├── email/                 # Email helpers (Resend, Mailchimp)
│   │   └── utils/                 # Utilities
│   └── config/                    # App config
├── public/
│   ├── widget.js                  # Embeddable widget script (Phase 2)
│   └── widget-test.html           # Widget test page (Phase 2)
└── middleware.ts                  # Clerk auth middleware
```

---

## 🎨 Design System

### Colors (Dark Theme)

```css
--background: #0a0a0b
--foreground: #fafafa
--surface: #141416
--surface-elevated: #1a1a1d
--accent: #ff6b35
--accent-glow: rgba(255, 107, 53, 0.3)
--muted: #8a8a92
--line: rgba(255, 255, 255, 0.06)
--success: #22c55e
--blue: #3b82f6
--amber: #f59e0b
```

### Components

- **Button:** `primary`, `secondary`, `outline`, `ghost`, `destructive`
- **Badge:** `default`, `secondary`, `outline`, `success`, `accent`
- **Card:** Standard card with header, content, footer
- **Tooltip:** Reusable tooltip component
- **Search:** Global search with filters
- **Bulk Actions:** Bulk publish/delete

---

## 🔐 Authentication Flow

1. User clicks "Sign in with GitHub"
2. Clerk handles OAuth popup
3. GitHub token stored in Vercel KV
4. Redirect to `/onboarding` (first time) or `/dashboard`

---

## 🔄 Core Workflow

### First-Time User

```
1. Sign in with GitHub (30 seconds)
2. Connect repository
3. Webhook auto-configured
4. Merge PR on GitHub
5. Draft appears in dashboard (<30s)
6. Click "Rewrite" → AI generates (optional)
7. Click "Publish" → Live on public page
8. Auto-generate social posts (optional)
9. Send email digest to subscribers (optional)
10. Update roadmap if linked (optional)
```

### Returning User

```
1. Open dashboard
2. See new drafts (auto-synced)
3. Review + AI rewrite (optional)
4. Publish to changelog
5. Auto-generate social posts
6. Send email digest
7. View analytics
```

---

## 📊 Database Schema (Vercel KV)

### Core Tables (MVP)

```typescript
// User
kv.set(`user:${userId}`, {
  id, email, plan: 'free' | 'pro',
  githubToken, dodoCustomerId,
  location: 'in' | 'intl', createdAt
});

// Repo
kv.set(`repo:${userId}:${repoId}`, {
  id, userId, githubRepoId, name,
  slug, isPrivate, connectedAt, webhookId
});

// Entry
kv.set(`entry:${userId}:${repoId}:${prId}`, {
  id, userId, repoId, prId, title, body,
  category, status, mergedAt, publishedAt,
  prUrl, author, aiRewrite, labels
});

// Usage
kv.set(`usage:${userId}:${YYYY-MM}`, {
  entriesPublished, aiRewrites
});
```

### Phase 2 Tables

```typescript
// Widget Config
kv.set(`widget:${userId}:${repoId}`, {
  id, colors, position, size, options,
  impressions, clicks, createdAt, updatedAt
});

// Social Posts
kv.set(`social:${userId}:${entryId}:twitter`, {
  tweets, hashtags, tone, createdAt
});
kv.set(`social:${userId}:${entryId}:linkedin`, {
  post, hashtags, cta, createdAt
});

// Email Subscribers
kv.set(`subscriber:${repoId}:${email}`, {
  email, repoId, subscribedAt,
  confirmed, confirmToken, preferences
});

// Analytics
kv.set(`analytics:views:${entryId}:${date}`, {
  views, uniqueVisitors, visitorIds
});
kv.set(`analytics:upvotes:${entryId}`, {
  count, voterIds
});

// Roadmap
kv.set(`roadmap:${userId}:${repoId}:${issueId}`, {
  issueId, title, body, status,
  upvotes, voterIds, linkedEntryId
});
```

---

## 🛠️ Development

### Commands

```bash
npm run dev      # Development (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

### API Routes (30+ Endpoints)

| Endpoint | Method | Auth | Purpose |
| :---- | :---- | :---- | :---- |
| **GitHub** |
| `/api/github/repos` | GET | User | List GitHub repos |
| `/api/github/sync` | POST | Webhook | Receive PR merges |
| `/api/github/sync/manual` | POST | User | Manual sync |
| `/api/github/repos/connect` | POST | User | Connect repo |
| `/api/github/repo-details` | POST | None | Get repo details |
| **AI** |
| `/api/ai/rewrite` | POST | User | Generate AI rewrite |
| **Entries** |
| `/api/entries/publish` | POST | User | Publish draft |
| `/api/entries/publish-batch` | POST | User | Batch publish |
| `/api/entries/unpublish` | POST | User | Revert to draft |
| `/api/entries/discard` | POST | User | Delete draft |
| **Social (Phase 2)** |
| `/api/social/generate` | POST/GET | User | Generate/get social posts |
| **Email (Phase 2, 3)** |
| `/api/email/subscribe` | POST/GET | None | Subscribe/unsubscribe |
| `/api/email/send-digest` | POST | User | Send digest email |
| `/api/email/send-digest-manual` | POST | User | Manual digest trigger |
| **Analytics (Phase 2)** |
| `/api/analytics/track` | POST | None | Track page views |
| `/api/analytics/upvote` | POST/GET | None | Upvote entries |
| `/api/analytics/widgets` | GET | User | Widget analytics |
| `/api/analytics/most-viewed` | GET | User | Most viewed entries |
| **Roadmap (Phase 2)** |
| `/api/roadmap/sync` | POST/GET | User | Sync/get roadmap |
| `/api/roadmap/upvote` | POST | None | Upvote roadmap item |
| **Widget (Phase 2)** |
| `/api/widget/generate` | POST/GET | User | Generate/get widget |
| `/api/widget/customize` | PUT | User | Customize widget |
| `/api/widget/[widgetId]` | GET | None | Public widget data |
| `/api/widget/track` | POST | None | Track widget events |
| **Releases (Phase 3)** |
| `/api/releases` | GET/POST | User | List/create releases |
| `/api/releases/[version]` | GET/PUT | User | Get/update release |
| **Filters (Phase 3)** |
| `/api/user/filters` | GET/POST | User | Manage filter rules |
| **Settings (Phase 3)** |
| `/api/user/settings` | GET/PUT | User | Publishing settings |
| **Cron (Phase 3)** |
| `/api/cron/scheduled-publish` | POST | Cron | Scheduled publishing |
| **Payment** |
| `/api/payment/checkout` | POST | User | Create checkout session |
| `/api/payment/webhook` | POST | None | Handle webhook events |
| **User** |
| `/api/user/plan` | GET | User | Get user plan |
| `/api/user/repos` | GET | User | Get connected repos |
| `/api/user/usage` | GET | User | Get usage stats |
| `/api/user/dodo-customer` | GET | User | Get Dodo customer ID |
| `/api/user/changelogs` | GET | None | Get user's changelogs |

---

## 📈 Success Metrics

### Phase 2 Goals

| Metric | Target | Status |
| :---- | :---- | :---- |
| **Features Shipped** | 20 | ✅ 20/20 (100%) |
| **Files Created** | 40+ | ✅ 47+ files |
| **Lines of Code** | 5,000+ | ✅ 8,000+ lines |
| **API Endpoints** | 15+ | ✅ 20+ endpoints |
| **UI Components** | 20+ | ✅ 25+ components |

### Launch Goals (Week 1)

| Metric | Target | Current |
| :---- | :---- | :---- |
| Signups | 100+ | Ready |
| Connected repos | 50+ | Ready |
| Published entries | 200+ | Ready |
| Paying users | 15+ | Ready |
| Twitter followers | 1,000+ | Ready to launch |

---

## 🎯 Go-To-Market Strategy

### Launch Channels

**Tier 1 (Primary):**
- ✅ Twitter/X (#buildinpublic)
- ✅ Reddit (r/SaaS, r/entrepreneur, r/webdev)
- ✅ Product Hunt
- ✅ Indie Hackers

**Tier 2 (Secondary):**
- ✅ LinkedIn
- ✅ Hacker News (Show HN)
- ✅ Dev.to / Hashnode

**Tier 3 (Long-tail):**
- ✅ Facebook Groups
- ✅ Discord/Slack communities
- ✅ Email outreach
- ✅ Guest posts

### Content Calendar

**Week 1: Launch**
- Day 1: Launch thread (Twitter, Reddit, PH)
- Day 2: Feature deep-dive (Widget)
- Day 3: Customer testimonial
- Day 4: Feature deep-dive (Social Posts)
- Day 5: Behind-the-scenes
- Day 6: User spotlight
- Day 7: Week 1 recap

**See:** [`GTM_INDEX.md`](./GTM_INDEX.md) for complete GTM strategy

---

## 📚 Documentation

### Phase 2 Documentation

**All documentation is organized in the `docs/` folder:**

| Category | Files | Location |
| :---- | :---- | :---- |
| **Phase 2** | 19 files | [`docs/phase2/`](./docs/phase2/) |
| **GTM** | 4 files | [`docs/gtm/`](./docs/gtm/) |
| **Strategy** | 2 files | [`docs/strategy/`](./docs/strategy/) |
| **Technical** | 2 files | [`docs/technical/`](./docs/technical/) |
| **Updates** | 6 files | [`docs/updates/`](./docs/updates/) |

**Quick Links:**
- [`docs/INDEX.md`](./docs/INDEX.md) - Complete documentation index
- [`docs/phase2/PHASE2_IMPLEMENTATION_PLAN.md`](./docs/phase2/PHASE2_IMPLEMENTATION_PLAN.md) - Implementation plan
- [`docs/gtm/GTM_STRATEGY.md`](./docs/gtm/GTM_STRATEGY.md) - GTM strategy
- [`docs/strategy/STARTUP_STRATEGY.md`](./docs/strategy/STARTUP_STRATEGY.md) - Business strategy
- [`docs/technical/DATABASE_SCHEMA_COMPLETE.md`](./docs/technical/DATABASE_SCHEMA_COMPLETE.md) - Database schema

---

## 🐛 Known Issues

_None - Production Ready!_ ✅

---

## 📝 Roadmap

### ✅ Phase 1 (MVP) - Complete
- GitHub OAuth + repo connection
- PR auto-sync (webhook)
- Auto-categorization
- AI rewrite (Google Gemini)
- Draft mode + publish flow
- Public changelog pages
- SEO meta tags
- DodoPayment integration
- Usage limits enforcement

### ✅ Phase 2 (Month 2-3) - Complete
- Embeddable Widget (4 tasks)
- Social Post Drafts (4 tasks)
- Email Integrations (4 tasks)
- Analytics Dashboard (4 tasks)
- Roadmap from Issues (4 tasks)
- Branding improvements (6 enhancements)
- Payment fixes (5 critical fixes)

### ✅ Phase 3 (Month 4) - Complete
- Auto-publish toggle
- Batch publish functionality
- Scheduled publishing (cron job)
- Email digest automation
- Release grouping with versioning
- Advanced filtering rules engine
- Publishing settings UI
- 10+ new API endpoints

### 🚀 Phase 4 (Month 5-6) - Planned
- Team accounts (multi-user)
- Custom domains
- Public API
- Slack/Discord notifications
- Advanced analytics (funnels)
- A/B testing
- Mobile app (React Native)

---

## 🤝 Contributing

GitLog is currently closed-source. Planning to open-source components in 2026.

---

## 📄 License

MIT © 2026 GitLog

---

## 🙏 Acknowledgments

**Built with:**
- ⚛️ Next.js 15
- 🔐 Clerk
- 💾 Vercel KV
- 🤖 Google Gemini
- 💳 DodoPayment
- 📧 Resend
- 📬 Mailchimp
- 🎨 Tailwind CSS
- 🧩 Shadcn/ui
- 🐙 Octokit

**Special Thanks:**
- All beta testers
- Early supporters
- #buildinpublic community

---

## 📞 Contact

- **Website:** [gitlog.app](https://gitlog.app)
- **Twitter:** [@gitlogapp](https://twitter.com/gitlogapp)
- **Email:** hello@gitlog.app
- **GitHub:** [gitlog-app](https://github.com/gitlog-app)

---

**Ready to Launch!** 🚀

*Last Updated: 2026-03-10*  
*Status: Phase 3 Complete - Enterprise Ready*
