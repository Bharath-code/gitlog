# GitLog - Auto-Changelog from GitHub

**Status:** 🚧 Building MVP (8-Day Sprint)  
**Target Launch:** Day 8  
**Tech Stack:** Next.js 15, Clerk, Vercel KV, Google Gemini, DodoPayment

---

## 🎯 What is GitLog?

GitLog connects to GitHub once and auto-generates a public changelog from merged PRs. Zero manual writing.

**MVP Value Prop:** Merge a PR → see it on your public changelog in under 60 seconds.

---

## 🗺️ Roadmap

### ✅ Phase 1 (MVP) - Days 1-8
Core changelog automation: GitHub sync, AI rewrite, publish flow, payments

### 🚀 Phase 2 (Month 2-3) - 20 New Features
- **Embeddable Widget** - "What's New" badge for your website
- **Social Post Drafts** - Auto-generate Twitter threads + LinkedIn posts
- **Email Integrations** - Resend + Mailchimp for release digests
- **Analytics Dashboard** - Page views, unique visitors, upvotes
- **Roadmap from Issues** - GitHub Issues → public roadmap

**See:** [`PHASE2_IMPLEMENTATION_PLAN.md`](./PHASE2_IMPLEMENTATION_PLAN.md) | [`PHASE2_PROGRESS.md`](./PHASE2_PROGRESS.md)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- GitHub account
- Clerk account (free)
- Vercel account (free)
- Vercel KV store (free)
- Google AI Studio API key (free)

### 1. Clone & Install

```bash
cd gitlog-app
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Clerk (from https://clerk.com)
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...

# Vercel KV (from Vercel dashboard)
VERCEL_KV_REST_API_URL=https://...
VERCEL_KV_REST_API_TOKEN=...

# Google AI (from https://aistudio.google.com)
GOOGLE_GENERATIVE_AI_API_KEY=...

# GitHub Webhook (generate random secret)
GITHUB_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configure Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application
3. Enable **GitHub OAuth** in Authentication → Social
4. Copy keys to `.env.local`
5. Set **After Sign-In URL** to `/onboarding`
6. Set **After Sign-Up URL** to `/onboarding`

### 4. Create Vercel KV Store

1. Go to Vercel Dashboard
2. Create new project
3. Add Storage → Vercel KV (free tier)
4. Copy credentials to `.env.local`

### 5. Get Google AI Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create API key
3. Copy to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
gitlog-app/
├── app/
│   ├── (auth)/              # Sign in/up pages
│   ├── (dashboard)/         # Dashboard pages (protected)
│   │   ├── dashboard/       # Overview
│   │   ├── drafts/          # Draft management
│   │   ├── published/       # Published entries
│   │   └── settings/        # Settings
│   ├── (public)/            # Public changelog pages
│   │   └── changelog/       # /changelog/[user]/[repo]
│   ├── (marketing)/         # Landing page
│   ├── api/                 # API routes
│   │   ├── github/          # GitHub webhooks + sync
│   │   ├── ai/              # AI rewrite endpoint
│   │   └── entries/         # Publish/unpublish
│   └── layout.tsx           # Root layout + Clerk
├── features/
│   ├── dashboard/           # Dashboard components
│   ├── drafts/              # Draft components + logic
│   ├── published/           # Published components
│   └── settings/            # Settings components
├── shared/
│   ├── components/
│   │   ├── ui/              # Shadcn components
│   │   └── layout/          # Header, sidebar
│   ├── lib/
│   │   ├── db/              # Database helpers
│   │   ├── github/          # GitHub API helpers
│   │   ├── ai/              # AI helpers
│   │   └── utils/           # Utilities
│   └── config/              # App config
└── middleware.ts            # Clerk auth middleware
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
--muted: #8a8a92
--line: rgba(255, 255, 255, 0.06)
```

### Components

- **Button:** `primary`, `secondary`, `outline`, `ghost`, `destructive`
- **Badge:** `default`, `secondary`, `outline`, `success`
- **Card:** Standard card with header, content, footer

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
1. Sign in with GitHub
2. Connect repository
3. Webhook auto-configured
4. Merge PR on GitHub
5. Draft appears in dashboard (<30s)
6. Click "Rewrite" → AI generates
7. Click "Publish" → Live on public page
```

### Returning User

```
1. Open dashboard
2. See new drafts (auto-synced)
3. Review + publish
```

---

## 📊 Database Schema (Vercel KV)

```typescript
// User
kv.set(`user:${userId}`, {
  id, email, plan: 'free' | 'pro',
  githubToken, dodoCustomerId, createdAt
});

// Repo
kv.set(`repo:${userId}:${repoId}`, {
  id, userId, githubRepoId, name, slug, private
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

---

## 💳 Pricing

| Plan | Price | Entries/Mo | AI Rewrites | Repos |
| :---- | :---- | :---- | :---- | :---- |
| **Free** | ₹0/$0 | 50 | 50 | 1 |
| **Pro** | ₹499/$19 | ∞ | ∞ | ∞ |

DodoPayment handles geo-pricing automatically (INR for India, USD for intl).

---

## 🛠️ Development

### Commands

```bash
npm run dev      # Development
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

### API Routes

| Endpoint | Method | Auth | Description |
| :---- | :---- | :---- | :---- |
| `/api/github/repos` | GET | User | List GitHub repos |
| `/api/github/sync` | POST | Webhook | Receive PR merges |
| `/api/ai/rewrite` | POST | User | Generate AI rewrite |
| `/api/entries/publish` | POST | User | Publish draft |
| `/api/entries/unpublish` | POST | User | Revert to draft |

---

## 🚧 Current Status

### ✅ Completed (Day 1-2)

- [x] Project structure
- [x] Clerk authentication
- [x] Dashboard layout + components
- [x] Utility functions
- [x] Database helpers (user, repo, entry)
- [x] GitHub API client
- [x] AI rewrite helper (Gemini)
- [x] Sign in/up pages
- [x] Dashboard overview page
- [x] Draft card component
- [x] Usage card component

### 🔄 In Progress

- [ ] GitHub webhook receiver
- [ ] Manual sync endpoint
- [ ] Onboarding flow
- [ ] Public changelog page

### ⏳ Pending

- [ ] DodoPayment integration
- [ ] Usage limits enforcement
- [ ] SEO optimization
- [ ] Error handling + 404/500 pages
- [ ] Testing + dogfooding

---

## 📈 Success Metrics

| Metric | Target (Week 1) |
| :---- | :---- |
| Signups | 20+ |
| Connected repos | 10+ |
| Published entries | 50+ |
| Paying users | 3+ |

---

## 🐛 Known Issues

_None yet (fresh project)_

---

## 📝 Todo

- [ ] Add DodoPayment SDK (when available)
- [ ] Implement rate limiting
- [ ] Add error logging (Axiom/Sentry)
- [ ] Create demo video
- [ ] Write launch posts

---

## 📄 License

MIT © 2026 GitLog

---

**Built with:** Next.js 15 · Clerk · Vercel KV · Google Gemini · Tailwind CSS · Shadcn/ui
