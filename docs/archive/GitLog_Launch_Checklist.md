# 🚀 GitLog Launch Checklist — Week 1

**Target:** Ship MVP in 8 days, get 20 signups, 3 paying users.

---

## Pre-Launch (Day 0)

### Infrastructure Setup
- [ ] Create GitHub repo `gitlog-app` (private)
- [ ] Create Vercel project connected to repo
- [ ] Set up Clerk app + GitHub OAuth provider
- [ ] Create Vercel KV database (free tier)
- [ ] Create DodoPayment account + verify business
- [ ] Create DodoPayment products (Free + Pro)
- [ ] Create Google AI Studio account + Gemini API key
- [ ] Set up environment variables in Vercel:
  ```
  CLERK_SECRET_KEY=
  CLERK_PUBLISHABLE_KEY=
  GITHUB_WEBHOOK_SECRET=
  DODOPAYMENT_API_KEY=
  DODOPAYMENT_WEBHOOK_SECRET=
  DODOPAYMENT_PRO_PLAN_ID=
  GOOGLE_GENERATIVE_AI_API_KEY=
  VERCEL_KV_REST_API_URL=
  VERCEL_KV_REST_API_TOKEN=
  NEXT_PUBLIC_APP_URL=https://gitlog.app
  NEXT_PUBLIC_DODOPAYMENT_KEY=
  ```

### Legal & Compliance
- [ ] Generate Terms of Service (use Termly.io free tier)
- [ ] Generate Privacy Policy (use Termly.io free tier)
- [ ] Add `/terms` and `/privacy` pages to app
- [ ] Add cookie consent banner (if required for your region)

---

## Day 1 — Project Setup

### Development Environment
- [ ] `npx create-next-app@latest gitlog-app --typescript --tailwind --app`
- [ ] Install Shadcn/ui: `npx shadcn-ui@latest init`
- [ ] Install core components: `npx shadcn-ui@latest add button card input dialog avatar dropdown-menu`
- [ ] Install Clerk: `npm install @clerk/nextjs`
- [ ] Install Octokit: `npm install octokit`
- [ ] Install Vercel KV: `npm install @vercel/kv`
- [ ] Install DodoPayment SDK: `npm install @dodopayment/node`
- [ ] Install Google AI: `npm install @google/generative-ai`
- [ ] Install Vercel Analytics: `npm install @vercel/analytics`
- [ ] Create GitHub repo + initial commit
- [ ] Deploy to Vercel (even if empty)

### Deliverable
- [ ] Homepage loads at `https://gitlog-app.vercel.app`
- [ ] README.md with project description

---

## Day 2 — Auth + Repo Connection

### Clerk Integration
- [ ] Wrap app with `<ClerkProvider>`
- [ ] Create `/sign-in` and `/sign-up` pages (use Shadcn templates)
- [ ] Configure GitHub OAuth in Clerk dashboard
- [ ] Add middleware for auth protection (`middleware.ts`)
- [ ] Test: Sign in with GitHub → redirected to dashboard

### Repo Connection UI
- [ ] Create `/dashboard` page (protected route)
- [ ] Build "Connect Repository" card with button
- [ ] Create API route `/api/github/repos` (GET)
  - [ ] Use Octokit to list user repos
  - [ ] Return: id, name, private, html_url
- [ ] Build repo selector dropdown
- [ ] On select: save to KV `repo:${userId}:${repoId}`
- [ ] Show connected repos list in dashboard

### Deliverable
- [ ] User can sign in + connect 1+ repos
- [ ] Connected repos persist in KV

---

## Day 3 — GitHub Webhook + PR Sync

### Webhook Receiver
- [ ] Create `/api/github/sync` (POST)
- [ ] Verify webhook signature (use `@octokit/webhooks`)
- [ ] Handle `pull_request.closed` event with `merged=true`
- [ ] Extract: title, body, labels, merged_at, pr_url, author, diff_summary
- [ ] Store in KV as `entry:${userId}:${repoId}:${prId}` with `status: draft`
- [ ] Return 200 OK within 5 seconds (GitHub timeout)

### Manual Sync (Fallback)
- [ ] Add "Sync Now" button in dashboard
- [ ] Fetch last 50 merged PRs via Octokit
- [ ] Bulk insert missing entries to KV

### GitHub App Setup
- [ ] Create GitHub OAuth App (or use Clerk's)
- [ ] Configure webhook in repo settings
- [ ] Webhook URL: `https://gitlog.app/api/github/sync`
- [ ] Secret: generate + store in env vars
- [ ] Test: Merge PR → check KV for entry

### Deliverable
- [ ] Merged PR appears as draft in dashboard within 30s
- [ ] Manual sync works if webhook fails

---

## Day 4 — AI Rewrite + Categorisation

### Auto-Categorisation
- [ ] On PR sync, read labels: `feat`, `fix`, `chore`, `bug`, `enhancement`
- [ ] Map to categories:
  - `feat` → "New"
  - `fix`, `bug` → "Fixed"
  - `chore`, `enhancement` → "Improved"
  - No match → "Other"
- [ ] Store `category` field on entry

### AI Rewrite Endpoint
- [ ] Create `/api/ai/rewrite` (POST)
- [ ] Accept: `entryId`
- [ ] Fetch entry from KV
- [ ] Build prompt (see PRD Appendix for template)
- [ ] Call Google Gemini Flash API
- [ ] Return: rewritten text (2-3 sentences)
- [ ] Rate limit: 50 requests/month (free), unlimited (Pro)

### Dashboard Draft UI
- [ ] Build draft entry card component
  - [ ] Show: title, category badge, merged date
  - [ ] "Rewrite with AI" button
  - [ ] Editable textarea for AI output
  - [ ] "Publish" button
  - [ ] "Discard" button
- [ ] Filter tabs: All | Draft | Published
- [ ] Empty state: "No drafts yet — merge a PR!"

### Deliverable
- [ ] Click "Rewrite" → AI output appears in <5s
- [ ] Categories auto-assigned correctly
- [ ] Draft cards are editable

---

## Day 5 — Publish Flow + Public Page

### Publish Endpoint
- [ ] Create `/api/entries/publish` (POST)
- [ ] Set `status: published`, `publishedAt: now`
- [ ] Trigger: regenerate public page cache (if using)

### Unpublish Endpoint
- [ ] Create `/api/entries/unpublish` (POST)
- [ ] Set `status: draft`, clear `publishedAt`

### Public Changelog Page
- [ ] Create `/changelog/[username]/[repo]` page
- [ ] Query KV for published entries (filter `status: published`)
- [ ] Group by month (e.g., "January 2026")
- [ ] Within each entry, group by category
- [ ] Show: entry title, date, categorized items
- [ ] Add "Subscribe" button (placeholder for Phase 2)
- [ ] Mobile responsive: test on iPhone SE, Pixel 5

### Username/Repo Routing
- [ ] Store user GitHub username on auth
- [ ] Map repo to slug: `owner/repo` → url-safe version
- [ ] Handle 404: repo not found or no published entries

### Deliverable
- [ ] Published entry visible at public URL instantly
- [ ] Page loads in <2 seconds
- [ ] Mobile layout is clean

---

## Day 6 — DodoPayment Integration

### DodoPayment Product Setup
- [ ] Create products in DodoPayment Dashboard:
  - **Free**: ₹0/$0, 50 entries/month, 1 repo
  - **Pro**: ₹499/mo (India) or $19/mo (Intl)
- [ ] Copy Plan IDs to env vars
- [ ] Configure geo-pricing (India → INR, Intl → USD)

### Checkout Flow
- [ ] Create `/api/payment/checkout` (POST)
  - [ ] Create DodoPayment checkout session
  - [ ] Return session URL
- [ ] Add "Upgrade to Pro" button in dashboard
- [ ] Redirect to DodoPayment checkout
- [ ] Handle success/cancel pages

### Webhook Handler
- [ ] Create `/api/payment/webhook` (POST)
- [ ] Verify DodoPayment signature
- [ ] Handle events:
  - `payment.success` → set `plan: pro`
  - `subscription.renewed` → extend access
  - `subscription.cancelled` → set `plan: free`
- [ ] Update KV `user:${userId}.plan`

### Free Plan Limits
- [ ] Count entries published this month
- [ ] At 50 entries: show upgrade modal
- [ ] Modal: "You've hit the free limit. Upgrade to Pro for unlimited."

### Deliverable
- [ ] Upgrade flow works end-to-end
- [ ] Pro features unlock after payment
- [ ] Downgrade works on cancellation
- [ ] INR pricing shows for Indian cards, USD for intl

---

## Day 7 — Polish + SEO

### SEO Meta Tags
- [ ] Dynamic `<title>` per page:
  - Public page: "What's New in [Repo] — [Month Year] | GitLog"
  - Entry: "[Entry Title] | [Repo] Changelog"
- [ ] `<meta description>`: AI-generated, 150-160 chars
- [ ] Open Graph tags for social sharing:
  - `og:title`, `og:description`, `og:image`, `og:url`
- [ ] Twitter Card tags
- [ ] JSON-LD structured data (SoftwareApplication)

### Performance
- [ ] Run Lighthouse audit
- [ ] Target: Performance >90, Accessibility >90
- [ ] Optimize images (use Next.js `<Image>`)
- [ ] Add loading states for async actions
- [ ] Add error boundaries

### Error Handling
- [ ] All API errors show user-friendly toast
- [ ] 404 page for missing repos
- [ ] 500 page for server errors
- [ ] Retry logic for failed webhooks

### Branding
- [ ] Add GitLog logo (use Shadcn + Lucide icons if no design)
- [ ] Choose color scheme (Tailwind default is fine)
- [ ] "Powered by GitLog" badge on free tier public pages
- [ ] Remove badge for Pro users

### Deliverable
- [ ] Lighthouse score >90
- [ ] All errors handled gracefully
- [ ] Branding consistent

---

## Day 8 — Dogfood + Launch Prep

### Dogfood GitLog on GitLog
- [ ] Connect GitLog repo to GitLog
- [ ] Merge a test PR → appears as draft
- [ ] Rewrite with AI → publish
- [ ] Verify public page: `gitlog.app/gitlog/gitlog-app`
- [ ] Test all flows as a user would

### Bug Fixes
- [ ] Fix all critical bugs (P0 features broken)
- [ ] Document known issues in README
- [ ] Add error logging (Vercel Logs or Axiom)

### Launch Assets
- [ ] Write Indie Hackers post draft
- [ ] Write Twitter/X thread draft
- [ ] Write Reddit posts (r/SaaS, r/indiehackers, r/nextjs)
- [ ] Prepare Product Hunt page (schedule for Day 10-14)
- [ ] Create demo GIF/video (Loom or ScreenStudio)
- [ ] Screenshot: dashboard, public page, AI rewrite

### Waitlist (If Building Pre-Launch)
- [ ] Add email capture to homepage
- [ ] Send "We're live!" email to waitlist
- [ ] Offer lifetime discount for first 20 users

### Deliverable
- [ ] MVP is stable, no critical bugs
- [ ] Launch posts ready to publish
- [ ] Demo video ready

---

## Post-Launch (Days 9-14)

### Distribution
- [ ] Post on Indie Hackers: "I built X, here's how"
- [ ] Post on Twitter/X with demo video
- [ ] Post on Reddit (follow community rules, lead with value)
- [ ] DM 20 indie founders on Twitter: "Thought you'd like this"
- [ ] Share in 2-3 founder Slack/Discord communities
- [ ] Submit to Product Hunt (Day 10-14)
- [ ] Submit to Hacker News "Show HN"

### Support + Feedback
- [ ] Add "Feedback" button in dashboard (Typeform or Tally)
- [ ] Add Intercom/Chatwoot for support (free tier)
- [ ] Respond to all user emails within 24 hours
- [ ] Track feature requests in GitHub Issues

### Metrics Setup
- [ ] Vercel Analytics: track page views, conversions
- [ ] Stripe Dashboard: monitor MRR, churn
- [ ] Simple spreadsheet: Daily signups, active users, paying users
- [ ] Set up weekly review: Every Monday, check metrics

### Week 1 Success Criteria
| Metric | Target | Actual |
| :---- | :---- | :---- |
| Signups | 20+ | ___ |
| Connected repos | 10+ | ___ |
| Published entries | 50+ | ___ |
| Paying users | 3+ | ___ |
| MRR | $57+ | ___ |

---

## Tools & Resources

### Development
- **Code Editor:** VS Code + Tailwind CSS extension
- **Database GUI:** Vercel KV CLI or Redis Insight
- **API Testing:** Insomnia or Postman
- **Local DodoPayment:** DodoPayment CLI for webhook forwarding
- **GitHub Webhook Test:** smee.io (if needed)
- **AI Testing:** Google AI Studio for prompt testing

### Launch
- **Landing Page:** Vercel + Next.js
- **Email:** Resend (free tier) or ConvertKit
- **Analytics:** Vercel Analytics + Simple Analytics (optional)
- **Support:** Chatwoot (open source, self-host) or Crisp (free tier)
- **Feedback:** Tally.so (free, unlimited responses)

### Marketing
- **Demo Video:** ScreenStudio ($99) or Loom (free)
- **Social Graphics:** Canva (free)
- **Link Tracking:** Bitly (free) or Plausible (paid)

---

## Emergency Rollback Plan

If critical bug found post-launch:

1. **Stop traffic:** Pause Product Hunt, edit social posts
2. **Fix:** Deploy hotfix within 4 hours
3. **Communicate:** Tweet/Update: "Fixed [issue], back online!"
4. **Compensate:** Offer 1 month free to affected users

**Critical bugs =** Data loss, auth broken, payments broken, public 500 errors.

---

*Last updated: 2026-03-08 | Owner: Founder*
