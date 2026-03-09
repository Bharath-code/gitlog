# GitLog Dashboard UX/UI Design

**Version:** 1.0 (MVP)  
**Last Updated:** 2026-03-08  
**Designer:** Product-minded UX approach

---

## 🎯 Design Principles

1. **Minimum clicks to value** — User should see their first draft in <3 clicks
2. **GitHub-native feel** — Familiar patterns for developers
3. **Draft-first workflow** — Nothing auto-publishes, user stays in control
4. **Progressive disclosure** — Show complexity only when needed
5. **Premium dark theme** — Matches landing page aesthetic

---

## 📱 Screen Inventory (MVP)

| Screen | Route | Priority | Purpose |
| :---- | :---- | :---- | :---- |
| **Auth** | `/sign-in` | P0 | GitHub OAuth entry point |
| **Onboarding** | `/onboarding` | P0 | First-time repo connection |
| **Dashboard** | `/dashboard` | P0 | Main hub, draft management |
| **Draft Detail** | `/dashboard/drafts/[id]` | P0 | Edit + AI rewrite |
| **Published** | `/dashboard/published` | P0 | View published entries |
| **Public Page** | `/changelog/[user]/[repo]` | P0 | User-facing changelog |
| **Settings** | `/dashboard/settings` | P1 | Repo management, billing |
| **Upgrade** | `/dashboard/upgrade` | P0 | Payment flow |

---

## 🎨 Design System

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Top Navigation (global, persistent)                │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  Sidebar     │  Main Content Area                   │
│  (collapsible│  (scrollable, dynamic)               │
│   on mobile) │                                      │
│              │                                      │
│  - Overview  │                                      │
│  - Drafts    │                                      │
│  - Published │                                      │
│  - Settings  │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

### Color Palette (Dark Theme)

```css
--background: #0a0a0b
--surface: #141416
--surface-elevated: #1a1a1d
--accent: #ff6b35
--success: #10b981
--muted: #8a8a92
--line: rgba(255, 255, 255, 0.06)
```

### Typography

| Element | Font | Size | Weight |
| :---- | :---- | :---- | :---- |
| Headings | Display | 24-32px | 600-700 |
| Body | Sans | 14-16px | 400 |
| Mono (metadata) | Mono | 12px | 500 |
| Badges | Mono | 11px | 600 |

---

## 🖥️ Screen-by-Screen Breakdown

### 1. Sign In Page (`/sign-in`)

**Goal:** Get user to authenticate with GitHub in <10 seconds

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     ┌─────────────────────────────────┐            │
│     │                                  │            │
│     │    [GitLog Logo]                 │            │
│     │                                  │            │
│     │    Auto-changelog from GitHub    │            │
│     │                                  │            │
│     │    [Sign in with GitHub]         │            │
│     │                                  │            │
│     │    ✓ Takes 10 seconds            │            │
│     │    ✓ No credit card              │            │
│     │    ✓ Free for OSS                │            │
│     │                                  │            │
│     └─────────────────────────────────┘            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- Centered card (max-width: 400px)
- GitLog logo (gradient mark)
- GitHub OAuth button (primary CTA)
- 3 trust signals below button

**User Flow:**
1. Land on `/sign-in`
2. Click "Sign in with GitHub"
3. GitHub OAuth popup
4. Authorize GitLog
5. Redirect to `/onboarding` (first-time) or `/dashboard` (returning)

**Edge Cases:**
- User declines OAuth → Show "Come back anytime" message
- OAuth error → Show friendly error + retry button

---

### 2. Onboarding Flow (`/onboarding`)

**Goal:** Connect first repo in <60 seconds

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  GitLog                                      [Avatar]│
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 1 of 2: Connect Your Repository               │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Select a repository to get started         │   │
│  │                                             │   │
│  │  [Search repositories...]                   │   │
│  │                                             │   │
│  │  □ acme/mailpilot          [Connect]        │   │
│  │  □ acme/webapp             [Connect]        │   │
│  │  □ acme/api                [Connect]        │   │
│  │  □ acme/docs               [Connect]        │   │
│  │                                             │   │
│  │  Showing 4 of 12 repositories               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Steps:**
1. **Step 1:** Select repo from GitHub list
2. **Step 2:** Configure webhook (automatic)

**Components:**
- Progress indicator (Step 1 of 2)
- Searchable repo list
- Connect button per repo
- Loading state during webhook setup

**User Flow:**
1. Land on `/onboarding` (first-time only)
2. See GitHub repos (fetched via OAuth)
3. Click "Connect" on desired repo
4. System creates GitHub webhook automatically
5. Redirect to `/dashboard`

**Microcopy:**
- "This enables GitLog to watch for merged PRs"
- "We'll create a webhook in your repo settings"

---

### 3. Dashboard (`/dashboard`)

**Goal:** Show drafts + enable one-click publish

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  GitLog    [Dashboard] [Drafts] [Published]   [Avatar]│
├────────────┬──────────────────────────────────────────┤
│            │                                          │
│  Sidebar   │  Welcome back, [User]!                   │
│            │                                          │
│  Navigation│  ┌────────────────────────────────────┐ │
│            │  │  📊 This Month                     │ │
│  Overview  │  │  12 drafts · 8 published · 2 left  │ │
│  Drafts    │  └────────────────────────────────────┘ │
│  Published │                                          │
│  Settings  │  Recent Drafts                           │
│            │                                          │
│  ────────  │  ┌────────────────────────────────────┐ │
│            │  │  feat: add dark mode toggle        │ │
│  Connected │  │  acme/mailpilot · 2 hours ago      │ │
│  Repos     │  │  [Rewrite] [Edit] [Publish]        │ │
│  (1)       │  └────────────────────────────────────┘ │
│  mailpilot │                                          │
│            │  ┌────────────────────────────────────┐ │
│  [Upgrade] │  │  fix: email digest not sending     │ │
│            │  │  acme/mailpilot · 5 hours ago      │ │
│            │  │  [Rewrite] [Edit] [Publish]        │ │
│            │  └────────────────────────────────────┘ │
│            │                                          │
│            │  [+ Sync Now]                           │
│            │                                          │
└────────────┴──────────────────────────────────────────┘
```

**Components:**
- **Top Nav:** Logo, section tabs, user avatar dropdown
- **Sidebar:** Navigation + connected repos + upgrade CTA
- **Usage Card:** Monthly limits (free: 50 entries)
- **Draft Cards:** Title, repo, timestamp, action buttons
- **Sync Button:** Manual webhook trigger

**States:**
- **Empty (no drafts):** "No drafts yet! Merge a PR to get started."
- **Loading:** Skeleton cards
- **Error:** "Sync failed. [Retry]"

**User Flow:**
1. Land on `/dashboard`
2. See recent drafts (auto-synced from GitHub)
3. Click "Rewrite" → AI generates plain English
4. Edit if needed
5. Click "Publish" → Entry goes live

**Keyboard Shortcuts:**
- `g d` → Go to Drafts
- `g p` → Go to Published
- `g s` → Go to Settings
- `/` → Search

---

### 4. Draft Detail (`/dashboard/drafts/[id]`)

**Goal:** Edit + rewrite + publish single draft

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Draft Entry                                        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Title: feat: add dark mode toggle          │   │
│  │                                             │   │
│  │  Category: [New ▼]  Status: [Draft ▼]      │   │
│  │                                             │   │
│  │  ─────────────────────────────────────────  │   │
│  │                                             │   │
│  │  AI Rewrite:                                │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │  Added dark mode toggle in settings. │   │   │
│  │  │  Users can now switch between light  │   │   │
│  │  │  and dark themes with one click.     │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │  [✨ Regenerate] [Copy] [Edit]             │   │
│  │                                             │   │
│  │  ─────────────────────────────────────────  │   │
│  │                                             │   │
│  │  Original PR:                               │   │
│  │  "Implemented dark mode using Tailwind     │   │
│  │  dark: classes and localStorage..."        │   │
│  │  [View on GitHub →]                        │   │
│  │                                             │   │
│  │  ─────────────────────────────────────────  │   │
│  │                                             │   │
│  │  [Discard] [Save Draft] [Publish Now]     │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- **Title Field:** Editable, auto-filled from PR title
- **Category Dropdown:** New / Fixed / Improved / Other
- **Status Dropdown:** Draft / Published
- **AI Rewrite Box:** Generated text, editable
- **Original PR Preview:** Collapsible, read-only
- **Action Buttons:** Discard / Save / Publish

**User Flow:**
1. Click draft from dashboard
2. Review AI rewrite (if generated)
3. Click "Regenerate" if not satisfied
4. Edit text directly in textarea
5. Change category if needed
6. Click "Publish Now" → Confirmation toast

**AI States:**
- **Not generated:** "Click Rewrite to generate"
- **Generating:** Spinner + "Writing..."
- **Generated:** Show text + "Regenerate" button
- **Error:** "Failed to generate. [Retry]"

---

### 5. Published Entries (`/dashboard/published`)

**Goal:** View + manage published changelog entries

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  GitLog    [Dashboard] [Drafts] [Published]   [Avatar]│
├────────────┬──────────────────────────────────────────┤
│            │                                          │
│  Sidebar   │  Published Entries                       │
│            │                                          │
│  Navigation│  ┌────────────────────────────────────┐ │
│            │  │  January 2026                      │ │
│  Overview  │  │                                    │ │
│  Drafts    │  │  ✅ Added dark mode toggle         │ │
│  Published │  │     Jan 15 · [View] [Unpublish]   │ │
│  Settings  │  │                                    │ │
│            │  │  ✅ Fixed email digest bug         │ │
│            │  │     Jan 12 · [View] [Unpublish]   │ │
│            │  │                                    │ │
│            │  └────────────────────────────────────┘ │
│            │                                          │
│            │  ┌────────────────────────────────────┐ │
│            │  │  December 2025                     │ │
│            │  │                                    │ │
│            │  │  ✅ Added user settings page       │ │
│            │  │     Dec 28 · [View] [Unpublish]   │ │
│            │  └────────────────────────────────────┘ │
│            │                                          │
│            │  [View Public Page →]                   │
│            │                                          │
└────────────┴──────────────────────────────────────────┘
```

**Components:**
- **Month Grouping:** Entries grouped by publish month
- **Entry Row:** Title, date, View + Unpublish actions
- **Public Page Link:** Opens changelog in new tab

**Actions:**
- **View:** Opens public changelog page
- **Unpublish:** Reverts to draft (with confirmation)

---

### 6. Public Changelog Page (`/changelog/[user]/[repo]`)

**Goal:** Beautiful, shareable changelog for users

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           [GitLog Logo]                             │
│                                                     │
│  Changelog for Mailpilot                            │
│                                                     │
│  Stay updated with the latest improvements          │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  January 2026                               │   │
│  │                                             │   │
│  │  🎉 New: Added dark mode toggle             │   │
│  │  January 15, 2026                           │   │
│  │                                             │   │
│  │  Added dark mode toggle in settings.        │   │
│  │  Users can now switch between light         │   │
│  │  and dark themes with one click.            │   │
│  │  The preference is saved automatically      │   │
│  │  and persists across sessions.              │   │
│  │                                             │   │
│  │  ─────────────────────────────────────────  │   │
│  │                                             │   │
│  │  🐛 Fixed: Email digest not sending         │   │
│  │  January 12, 2026                           │   │
│  │                                             │   │
│  │  Fixed a bug where email digests were       │   │
│  │  not being sent to users with daily         │   │
│  │  preferences set.                           │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  December 2025                              │   │
│  │  ...                                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Powered by GitLog                                  │
│  [Create your changelog →]                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- **Header:** Product name, description
- **Entry Cards:** Grouped by month, categorized
- **Footer:** "Powered by GitLog" (removed for Pro)

**Design Notes:**
- Clean, minimal, focused on content
- Mobile responsive (stack on small screens)
- SEO optimized (meta tags, structured data)
- Fast loading (<2 seconds)

**States:**
- **No entries:** "No changelog entries yet. Check back soon!"
- **Private repo:** 404 if not authorized

---

### 7. Settings (`/dashboard/settings`)

**Goal:** Manage repos, billing, account

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  GitLog    [Dashboard] [Drafts] [Published]   [Avatar]│
├────────────┬──────────────────────────────────────────┤
│            │                                          │
│  Sidebar   │  Settings                                │
│            │                                          │
│  Navigation│  ┌────────────────────────────────────┐ │
│            │  │  Connected Repositories            │ │
│  Overview  │  │                                    │ │
│  Drafts    │  │  ✓ acme/mailpilot                  │ │
│  Published │  │    Private · Webhook active        │ │
│  Settings  │ │    [Disconnect]                     │ │
│            │  │                                    │ │
│            │  │  [+ Connect Another Repo]          │ │
│            │  └────────────────────────────────────┘ │
│            │                                          │
│            │  ┌────────────────────────────────────┐ │
│            │  │  Current Plan: Free                │ │
│            │  │                                    │ │
│            │  │  38/50 entries used this month     │ │
│            │  │                                    │ │
│            │  │  [Upgrade to Pro — ₹499/mo]       │ │
│            │  │                                    │ │
│            │  │  Pro includes:                    │ │
│            │  │  · Unlimited entries              │ │
│            │  │  · Unlimited repos                │ │
│            │  │  · Remove branding                │ │
│            │  │  · Priority support               │ │
│            │  └────────────────────────────────────┘ │
│            │                                          │
│            │  ┌────────────────────────────────────┐ │
│            │  │  Account                           │ │
│            │  │                                    │ │
│            │  │  Email: user@example.com          │ │
│            │  │  Member since: March 2026         │ │
│            │  │                                    │ │
│            │  │  [Sign Out]                       │ │
│            │  └────────────────────────────────────┘ │
│            │                                          │
└────────────┴──────────────────────────────────────────┘
```

**Sections:**
1. **Connected Repos:** List + disconnect + add new
2. **Billing:** Current plan, usage, upgrade CTA
3. **Account:** Email, member since, sign out

---

### 8. Upgrade Flow (`/dashboard/upgrade`)

**Goal:** Convert free user to paid

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Upgrade to Pro                                     │
│                                                     │
│  Unlock unlimited changelogs and remove branding    │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │                 │  │                 │          │
│  │  Free           │  │  Pro            │  ⭐      │
│  │                 │  │                 │          │
│  │  ₹0/mo          │  │  ₹499/mo        │          │
│  │                 │  │                 │          │
│  │  ✓ 50 entries   │  │  ✓ Unlimited    │          │
│  │  ✓ 1 repo       │  │  ✓ Unlimited    │          │
│  │  ✓ Public page  │  │  ✓ No branding  │          │
│  │  ✗ GitLog logo  │  │  ✓ Priority sup │          │
│  │                 │  │                 │          │
│  │  [Current]      │  │  [Upgrade Now]  │          │
│  │                 │  │                 │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  International pricing: $19/mo (USD)                │
│  Accepts all cards + UPI                            │
│                                                     │
│  [Cancel]                                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Flow:**
1. Click "Upgrade to Pro"
2. See pricing comparison
3. Click "Upgrade Now"
4. Redirect to DodoPayment checkout
5. Complete payment
6. Redirect back to `/dashboard?upgraded=true`
7. Show success toast: "Welcome to Pro! 🎉"

---

## 🔄 Complete User Journeys

### Journey 1: First-Time User (Day 1)

```
1. Land on gitlog.app
2. Click "Sign in with GitHub"
3. Authorize GitLog
4. Onboarding: Select repo (acme/mailpilot)
5. Webhook auto-configured
6. Redirect to /dashboard
7. See empty state: "No drafts yet"
8. Merge test PR on GitHub
9. Wait 30 seconds, refresh
10. See draft appear!
11. Click "Rewrite" → AI generates
12. Click "Publish" → Done!
13. View public page
14. Share with team
```

**Time to value:** <5 minutes

---

### Journey 2: Returning User (Day 5)

```
1. Open gitlog.app
2. Auto-redirect to /dashboard
3. See 3 new drafts (auto-synced)
4. Click first draft
5. Review AI rewrite
6. Edit slightly
7. Click "Publish"
8. Repeat for other 2 drafts
9. Done! (2 minutes total)
```

**Time to value:** <3 minutes

---

### Journey 3: Free → Paid Conversion (Day 12)

```
1. Land on /dashboard
2. See modal: "You've hit the free limit (50/50)"
3. Click "Upgrade to Pro"
4. See pricing page
5. Click "Upgrade Now — ₹499/mo"
6. DodoPayment checkout opens
7. Enter UPI/card details
8. Payment successful
9. Redirect back to dashboard
10. See "Welcome to Pro!" toast
11. Unlimited entries unlocked
```

**Conversion trigger:** Usage limit reached

---

## 🎨 Component Library

### Buttons

| Type | Use Case | Style |
| :---- | :---- | :---- |
| Primary | Publish, Upgrade, Connect | Accent background |
| Secondary | Edit, Save Draft, Sync | Surface highlight |
| Tertiary | View, Cancel | Text only |
| Danger | Discard, Disconnect | Red accent |

### Cards

| Type | Use Case | Style |
| :---- | :---- | :---- |
| Draft Card | Dashboard list | Surface, hover lift |
| Entry Card | Published list | Surface, static |
| Settings Card | Grouped options | Surface, bordered |

### Badges

| Type | Use Case | Color |
| :---- | :---- | :---- |
| Category | New/Fixed/Improved | Accent bg |
| Status | Draft/Published | Green/Gray |
| Plan | Free/Pro | Gray/Accent |

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Full sidebar navigation
- 2-column layout
- Hover states enabled

### Tablet (768-1023px)
- Collapsible sidebar
- 2-column layout
- Touch-friendly buttons

### Mobile (<768px)
- Bottom navigation bar
- Single column layout
- Larger touch targets
- Simplified actions

---

## ⚡ Micro-Interactions

| Action | Feedback |
| :---- | :---- |
| Click "Rewrite" | Spinner → Text appears |
| Click "Publish" | Success toast → Card fades |
| Click "Disconnect" | Confirmation modal |
| Upgrade success | Confetti animation |
| Sync complete | "Updated!" badge |

---

## 🎯 Success Metrics (UX)

| Metric | Target | Measurement |
| :---- | :---- | :---- |
| Time to first draft | <30s | Analytics |
| Time to first publish | <2min | Analytics |
| Draft → Publish rate | >80% | Analytics |
| Free → Paid conversion | >10% | Analytics |
| Weekly active users | >30% | Analytics |

---

*This document guides MVP dashboard development. Phase 2 features (analytics, social drafts, embeddable widget) will be added post-launch.*
