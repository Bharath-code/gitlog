| ⚡ GitLog Auto-Changelog \+ Release Communication Platform Product Requirements Document • v2.0 • 2026 |
| :----------------------------------------------------------------------------------------------------: |

| Product | Version  | Status             | Owner        | Revenue Goal       |
| :------ | :------- | :----------------- | :----------- | :----------------- |
| GitLog  | v2.0 PRD | Pre-build Planning | Solo Founder | $3k–5k MRR / 12 mo |

| v2.0 Update: This PRD expands GitLog from a changelog tool into a full Release Communication Platform — auto-generating marketing posts, user emails, landing page copy, SEO pages, and investor updates from the same GitHub data. Revised pricing reflects the expanded value: Pro $19/mo, Team $49/mo. |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **1\. Executive Summary**

GitLog is a developer-native release communication platform that auto-generates changelogs, marketing copy, user emails, SEO pages, and investor updates — all powered directly from GitHub commits, pull requests, and issue labels. Zero manual writing required.

| The original insight: every existing changelog tool forces developers to manually copy-paste their own work into a separate interface. Nobody does this consistently. Changelogs rot.The v2.0 expansion: GitLog already knows exactly what shipped. That context is the raw material for every piece of release communication a founder needs to write — social posts, user emails, landing page sections, investor updates. No competitor has this. We own the full stack. |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| Core Product (v1) Auto-changelog from GitHub PRs AI rewrite: commits → plain English Public changelog \+ roadmap page Roadmap from GitHub Issues Embeddable widget (1 script tag) Draft mode — dev reviews before publish | Expansion Layer (v2) Social post drafts (Twitter/LinkedIn) Release email to your users (Resend) Product Story landing page section SEO-optimised release note pages Investor update draft generator Revised pricing: Pro $19, Team $49 |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **2\. Problem Statement**

### **The Core Pain**

- Developers merge PRs all day. Users have no idea what changed.

- Writing changelogs manually requires context-switching into a separate tool.

- Most indie founders start writing changelogs, do it twice, then abandon it.

- GitHub Releases exist but are technical, dev-only, and go nowhere public-facing.

- Even founders who maintain changelogs still manually write tweets, emails, and update pages — the same information, reformatted, three more times.

### **The Expanded Problem — Release Communication is Broken**

Shipping a feature creates a cascade of communication tasks that founders dread:

| Communication Task           | Time Cost | Current Solution        | Reality                     |
| :--------------------------- | :-------- | :---------------------- | :-------------------------- |
| Write changelog entry        | 15–30 min | Canny / Frill / manual  | Abandoned after week 2      |
| Draft announcement tweet     | 20–40 min | Write from scratch      | Never posted or posted late |
| Write LinkedIn post          | 30–60 min | Write from scratch      | Skipped entirely            |
| Send 'what's new' email      | 45–90 min | Mailchimp \+ copy-paste | Sent quarterly at best      |
| Update landing page features | 30–60 min | Edit code manually      | 6 months out of date        |
| Write investor update        | 2–3 hours | Google Docs from memory | Sent late, incomplete       |

| Total time wasted per release: 3–6 hours of repetitive reformatting of the same information the developer already wrote in their PR description. GitLog eliminates this entirely. |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **3\. Solution Overview**

GitLog connects to GitHub once. Every merged PR feeds a pipeline that produces the full suite of release communication — automatically drafted, human-reviewed, one-click published.

### **The GitLog Pipeline**

| GitHub PR merged ↓ GitLog syncs via webhook (\< 30 seconds) ↓ AI categorises \+ rewrites to plain English ↓ Dev reviews draft in dashboard (30 seconds) ↓ One click: Publish ↓ ✓ Public changelog page updated ✓ Social post drafted (Twitter \+ LinkedIn) ✓ 'What's New' email drafted to user list ✓ SEO release note page indexed ✓ Product Story section regenerated ✓ Investor update section updated |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **4\. Ideal Customer Profile (ICP)**

| Primary ICP Solo-to-Small SaaS Founder Active product with 10–500 users GitHub repo with regular commits Tried changelog manually, abandoned it Pays for dev tools under $20/mo without blinking Active on Twitter/X, Indie Hackers, r/SaaS Wants to market their product but hates writing copy Acquisition channels: Indie Hackers, r/SaaS, r/indiehackers Twitter/X build-in-public community Product Hunt launch SEO: 'auto changelog from github' | Secondary ICP Early-Stage Funded Startup (new in v2) Seed to Series A, 2–8 person team Has investors who expect monthly updates Ships weekly, investor updates take 3 hours Willing to pay $49/mo without procurement High retention: investor updates are recurring Acquisition channels: YC/Techstars alumni networks Founder Slack communities Cold outreach: 'saw you just raised, built this' Content: 'how to write investor updates faster' |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **Tertiary ICP — Open Source Maintainers**

Maintain public GitHub repos with 50–5000 stars. Free plan users. Highly viral — their public changelog page links back to GitLog. Convert to Pro when they launch a paid product on top of the OSS project.

### **Who is NOT the ICP**

- Enterprise teams — use Jira \+ Confluence, won't switch

- Pre-launch founders — no commits, no product value

- Agencies — no recurring product to maintain

- Non-technical founders — GitHub OAuth will confuse them

# **5\. Full Feature Suite**

## **5.1 Core Changelog Engine (v1 — MVP)**

| 🔄 PR Auto-Sync Merged PRs pulled via GitHub webhook in under 30 seconds. Extracts title, body, labels, diff summary, linked issues. |
| :----------------------------------------------------------------------------------------------------------------------------------- |

| 🧠 AI Categorisation \+ Rewrite feat/fix/chore labels → New / Fixed / Improved. Raw commit message rewritten to plain English via Claude Haiku. One-click, editable, always a draft first. |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| 📄 Public Changelog Page Live at gitlog.app/\[username\]/\[repo\]. Mobile responsive. Clean default theme. Zero config. |
| :---------------------------------------------------------------------------------------------------------------------- |

| 🗺️ Roadmap from GitHub Issues Issues tagged 'roadmap' auto-appear as roadmap cards with upvoting. PR merge closes issue → auto-moves to changelog. |
| :------------------------------------------------------------------------------------------------------------------------------------------------- |

| 🧩 Embeddable Widget One script tag. 'What's New' badge inside user's own product. Best retention hook — once embedded, churn drops to near zero. |
| :------------------------------------------------------------------------------------------------------------------------------------------------ |

## **5.2 Release Communication Suite (v2 — Expansion)**

| This is the moat. Every feature below uses data GitLog already has. No competitor at the $12–49/mo tier offers any of this. This is what turns GitLog from a changelog tool into a release communication platform. |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| 🐦 Social Post Drafts — Twitter/X \+ LinkedIn On publish, GitLog auto-drafts a tweet thread and LinkedIn post announcing the release. Before/after format: 'We just shipped X. Here's what changed.' Dev reviews and copies to their platform. No auto-posting (avoids OAuth complexity for MVP). |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

### **Social Post: Pros & Cons**

| ✅ Pros                                                          | ⚠️ Cons                                                        |
| :--------------------------------------------------------------- | :------------------------------------------------------------- |
| Zero extra data — uses existing changelog entry                  | AI posts can feel generic without good prompt engineering      |
| Removes biggest friction between shipping and promoting          | Dev still needs to manually post (no OAuth to Twitter for MVP) |
| Directly justifies Pro upgrade — 'your changelog markets itself' | Some founders don't do content marketing at all                |
| Incredibly sticky — opens GitLog every week                      | Quality depends on quality of PR descriptions                  |

**Build verdict:** Ship in Week 3–4. Two extra API calls on infrastructure already built. High impact, low effort.

| 📧 Release Email to Your Users Founders connect their Resend account. On publish, GitLog auto-drafts a 'What's New' email to their subscriber list. Subject line, intro, feature highlights, and CTA all auto-generated. Dev reviews and sends with one click. |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **Release Email: Pros & Cons**

| ✅ Pros                                                  | ⚠️ Cons                                                        |
| :------------------------------------------------------- | :------------------------------------------------------------- |
| Huge value — writing release emails is genuinely painful | Integration complexity — multiple email providers              |
| Directly reduces churn for the founder's own product     | Requires existing email list (early founders may not have one) |
| Justifies Team plan increase to $49/mo                   | Deliverability risk if misused — needs usage monitoring        |
| No competitor in $12–49/mo tier does this                | Resend-first limits reach (add Mailchimp in Month 3\)          |

**Build verdict:** Build Resend integration first (devs already use it). Ship in Month 2\. Add Mailchimp/ConvertKit as Month 3 expansion.

| 🌐 Product Story Landing Page Section Takes last 90 days of changelog entries → generates a 'What We've Built' section founders can embed on their landing page. Shows product velocity to potential customers and investors. Auto-updates monthly. |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **Product Story: Pros & Cons**

| ✅ Pros                                              | ⚠️ Cons                                                       |
| :--------------------------------------------------- | :------------------------------------------------------------ |
| Unique differentiator — nobody else offers this      | Niche use case — most early founders don't need it yet        |
| Great for fundraising — shows product velocity       | Output quality depends on changelog consistency               |
| Very shareable — high viral potential                | Hard to monetise directly — more 'wow' than conversion driver |
| Low engineering effort — filtered view \+ AI summary | Requires 3+ months of data to look impressive                 |

**Build verdict:** Easy win as a free feature in Week 4–5. Great for virality and top-of-funnel word-of-mouth.

| 🔍 SEO-Optimised Release Note Pages Each changelog entry gets its own SEO-friendly URL (gitlog.app/changelog/your-repo/v2.3-dark-mode) with proper meta tags, structured data, and AI-generated descriptions. Every entry becomes a Google-indexed page automatically. |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **SEO Pages: Pros & Cons**

| ✅ Pros                                                      | ⚠️ Cons                                                      |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| Completely passive — zero extra work for founder             | SEO takes 3–6 months to show results                         |
| Every entry becomes a Google-indexed page                    | Only valuable for products with existing brand search volume |
| Backlinks from sites referencing releases compound over time | Requires clean URL slugs and meta descriptions from AI       |
| Long-term distribution moat for GitLog itself                | Founders want instant gratification — hard to demo the value |

**Build verdict:** Build quietly in Week 2 as infrastructure. It's a long-term moat, not a launch feature. Don't market it — just ship it.

| 📊 Investor Update Draft Generator Monthly: pulls all published changelog entries → drafts a 'Product Updates' section for investor update email. Includes shipped features, roadmap items in progress, and metric placeholders. Founders fill in numbers and send. |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

### **Investor Update: Pros & Cons**

| ✅ Pros                                                      | ⚠️ Cons                                                       |
| :----------------------------------------------------------- | :------------------------------------------------------------ |
| Huge pain point for funded founders — updates take 2–3 hours | Requires investors (narrows ICP to funded startups)           |
| High perceived value — justifies $49–99/mo tier              | Output needs heavy editing — investor updates are personal    |
| Nobody else does this at any price point                     | Scope creep risk if over-built before core is solid           |
| Opens higher-paying customer segment (funded startups)       | Funded founders are harder to reach via indie hacker channels |

**Build verdict:** Team/Growth tier feature. Build in Month 4–6 after core is proven. Opens a new ICP segment willing to pay $49+/mo.

# **6\. MVP Scope — Tight & Zero to Finish**

| Principle: Ship the smallest thing that delivers the core magic. The magic is: merge a PR → see it on your public changelog in under 60 seconds. Everything else is sequenced by value-to-effort ratio. |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

### **✅ Phase 1 — MVP (Days 1–8)**

| Feature               | Description                                                      | Priority |
| :-------------------- | :--------------------------------------------------------------- | :------- |
| GitHub OAuth Login    | Sign in with GitHub via Clerk. One click.                        | P0       |
| Repo Connect          | Connect any public or private repo via Octokit                   | P0       |
| PR Auto-Sync          | Pull merged PRs, extract title, body, labels, merged date        | P0       |
| Auto-Categorise       | feat/fix/chore labels → New / Fixed / Improved                   | P0       |
| AI Rewrite            | Claude Haiku rewrites raw commit to plain English. One-click.    | P0       |
| Draft Mode            | All entries start as drafts. Nothing auto-publishes.             | P0       |
| Public Changelog Page | Live at gitlog.app/\[user\]/\[repo\]. Mobile responsive.         | P0       |
| Roadmap from Issues   | Issues tagged 'roadmap' → roadmap cards with upvoting            | P0       |
| Stripe Payments       | Free \+ Pro plan. Upgrade prompt when free limits hit.           | P0       |
| SEO Meta Tags         | Auto-generated meta description per entry. Quiet infrastructure. | P0       |

### **🔜 Phase 2 — Release Communication (Weeks 3–6)**

| Feature                       | Why It Matters                                                       | When     |
| :---------------------------- | :------------------------------------------------------------------- | :------- |
| Embeddable Widget             | 1 script tag. Best retention hook. Once embedded \= near-zero churn. | Week 3   |
| Social Post Drafts            | Tweet \+ LinkedIn auto-drafted on publish. Removes biggest friction. | Week 3–4 |
| Remove Branding / Custom Slug | gitlog.app/your-brand. No 'Powered by GitLog' for Pro users.         | Week 4   |
| Product Story Page Section    | 90-day 'what we built' summary. Free feature for virality.           | Week 4–5 |
| Multiple Repos                | Unlimited repos per account (Pro feature).                           | Week 5   |
| Analytics                     | Page views, unique visitors, most upvoted roadmap items.             | Week 6   |

### **📅 Phase 3 — Retention \+ New ICP (Month 2–4)**

| Feature                    | Why It Matters                                                   | When      |
| :------------------------- | :--------------------------------------------------------------- | :-------- |
| Release Email (Resend)     | Auto-draft 'What's New' email to user list. Justifies Team plan. | Month 2   |
| Email Digest Subscriptions | Users subscribe to changelog. Emailed on publish.                | Month 2   |
| Release Email (Mailchimp)  | Expand beyond Resend to reach Mailchimp users.                   | Month 3   |
| Investor Update Generator  | Monthly draft from changelog. Opens funded startup ICP.          | Month 4   |
| Custom Domains             | yourproduct.com/changelog. Complex DNS — don't rush this.        | Month 4–5 |
| Team Accounts              | Multi-user, private repos, role permissions.                     | Month 3–4 |

### **❌ Explicitly Out of Scope for MVP**

- Custom domains — complex DNS setup, adds 2+ weeks

- Auto-posting to Twitter/LinkedIn — OAuth complexity, API costs, abuse risk

- Slack/Discord notifications — nice to have, not core

- Import from other changelog tools — zero demand at launch

- Mobile app — web is sufficient for this audience

# **7\. Tech Stack**

| Layer              | Technology                              | Why                                                                       |
| :----------------- | :-------------------------------------- | :------------------------------------------------------------------------ |
| Framework          | Next.js 15 (App Router)                 | Server Actions \+ API routes. No separate backend needed.                 |
| Auth               | Clerk                                   | GitHub OAuth in 10 mins. JWT, sessions, webhooks. Generous free tier.     |
| GitHub Integration | Octokit (official GitHub SDK)           | Official, well-documented, handles pagination and rate limits.            |
| AI Rewrite \+ Copy | Anthropic Claude API (claude-haiku-4-5) | Cheapest \+ fastest. \~$0.001 per rewrite. Scales to all copy generation. |
| Storage            | Vercel KV (Redis)                       | Free for MVP. Stores entries, votes, settings. No DB setup needed.        |
| Payments           | Stripe                                  | Industry standard. Billing portal handles upgrades/cancellations.         |
| Styling            | Tailwind CSS \+ Shadcn/ui               | Beautiful UI in hours. Shadcn components are copy-paste.                  |
| Hosting            | Vercel                                  | One-click deploy. Free tier handles first 200 users easily.               |
| Email Sending      | Resend                                  | Dev-friendly API. Free tier: 3k emails/mo. Phase 2 release emails.        |
| Analytics          | Vercel Analytics                        | Zero config, built-in. No cookie banner needed.                           |

# **8\. Architecture**

### **Project Structure**

| gitlog/ ├── app/ │ ├── (auth)/ \# Clerk auth pages │ ├── dashboard/ \# Repo list, draft entries, social drafts │ ├── changelog/\[user\]/\[repo\]/ \# Public changelog page │ ├── roadmap/\[user\]/\[repo\]/ \# Public roadmap \+ upvotes │ ├── story/\[user\]/ \# Product story page (v2) │ └── api/ │ ├── github/sync/ \# Webhook receiver \+ manual sync │ ├── ai/rewrite/ \# Claude rewrite proxy │ ├── ai/social/ \# Social post draft generator (v2) │ ├── ai/email/ \# Release email draft generator (v2) │ ├── ai/investor/ \# Investor update generator (v2) │ ├── votes/ \# Roadmap upvote endpoint │ └── stripe/webhook/ \# Payment events ├── components/ui/ \# Shadcn components ├── lib/ │ ├── github.ts \# Octokit helpers │ ├── kv.ts \# Vercel KV wrappers │ ├── ai.ts \# Claude helpers (rewrite \+ copy) │ ├── email.ts \# Resend integration │ └── stripe.ts \# Billing helpers └── public/widget.js \# Embeddable changelog widget |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **Data Flow — Full Pipeline**

1. User merges PR on GitHub

2. GitHub webhook fires → POST /api/github/sync

3. Octokit fetches PR data (title, body, labels, diff)

4. Entry saved to Vercel KV as status: 'draft'

5. Dashboard shows new draft → dev clicks 'AI Rewrite' (optional)

6. Dev hits Publish → triggers communication pipeline:
   - Public changelog page updated instantly

   - POST /api/ai/social → tweet \+ LinkedIn draft saved to KV

   - If email enabled: POST /api/ai/email → email draft queued in Resend

   - SEO meta tags written to page, entry indexed

   - Product Story page regenerated (debounced, runs once/day)

7. If issue was tagged 'roadmap' and PR closes it → auto-moves to changelog

### **KV Data Schema**

| // Changelog Entry kv.set(\`entry:${userId}:${repoId}:${prId}\`, { id, title, body, category, // New | Fixed | Improved status, // draft | published mergedAt, publishedAt, prUrl, socialDraft: { tweet, linkedin }, // v2: auto-generated on publish emailDraft: { subject, body }, // v2: auto-generated on publish }) // Roadmap Item kv.set(\`roadmap:${userId}:${repoId}:${issueId}\`, {   id, title, body, votes, voters\[\], githubIssueUrl }) // User Config kv.set(\`user:${userId}\`, { plan, repos\[\], slug, theme, githubToken, resendApiKey, // v2: email integration investorEmails\[\], // v2: investor update recipients }) |
| :--------------------------------------------------------------------------------------------------- | ----- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **9\. Revised Pricing Strategy**

| The v2 expansion fundamentally changes the pricing story. We're no longer selling a changelog tool. We're selling a release communication platform — the thing that turns shipped code into marketing, retention, and investor confidence. This commands higher pricing. |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| Plan   | Price             | Who It's For                   | Key Features                                                                                                                  |
| :----- | :---------------- | :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| Free   | $0/mo             | OSS maintainers, trying it out | 1 repo, changelog page, roadmap, 50 entries/mo, GitLog branding, SEO pages                                                    |
| Pro    | $19/mo            | Solo SaaS founders             | Unlimited repos, remove branding, custom slug, embeddable widget, social post drafts, product story section, email digest     |
| Team   | $49/mo            | Small teams \+ funded startups | Everything Pro \+ release emails (Resend), investor update drafts, private repos, 5 team members, analytics, priority support |
| Growth | $99/mo (Month 6+) | Growing SaaS with email list   | Everything Team \+ Mailchimp/ConvertKit, custom domains, unlimited team members, white-label                                  |

### **Pricing Justification Per Plan**

| Free → Pro upgrade trigger: Hit 50 entry limit Want to remove GitLog branding See social post drafts in dashboard (locked behind Pro — visible but not usable) Want embeddable widget Why $19 not $12: Social post drafts alone are worth $19/mo to a founder who ships weekly. The expanded value suite makes the price increase obvious and easy to justify without a sales call. | Pro → Team upgrade trigger: Want to send release emails to users Need private repo support Have investors asking for updates Adding team members Why $49 not $29: Investor update drafts alone save 2–3 hours/month. At any reasonable founder hourly rate, $49/mo is a trivial ROI. The email integration also directly reduces churn for the founder's own product. |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **10\. Risk Mitigation**

| Risk                                     | Severity | Mitigation                                                                                                                                                                                       |
| :--------------------------------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Messy commit history → garbage AI output | High     | Draft mode by default. AI rewrites using PR diff context, not just message title. Frame as 'saves 90% of work' not 'fully automatic'. Quality gate: dev always reviews.                          |
| AI social posts feel generic             | Medium   | Invest in prompt engineering. Use PR body \+ diff context, not just title. Allow tone customisation (casual / professional / technical). Ship with 3 preset tones.                               |
| 'I'll just use GitHub Releases'          | Medium   | GitHub Releases \= for developers. GitLog \= for users \+ marketing \+ investors. Completely different audience and output format. The social \+ email features make this comparison irrelevant. |
| Featurebase copies GitHub auto-import    | Medium   | Ship fast. Own SEO. Price at $19 — they can't compete without cannibalising $49/mo plan. First mover \+ distribution moat.                                                                       |
| Auto-posting abuse (spam)                | Low      | No auto-posting for MVP. Dev always reviews and manually copies post. Add rate limits and content moderation before enabling any direct posting.                                                 |
| Resend/email deliverability issues       | Low      | GitLog never sends directly — it drafts, founder sends from their own Resend account. We're a drafter, not a sender. Zero reputational risk.                                                     |
| TAM is too small                         | Low      | Need 250 paying users for $3k MRR at $12. At $19 avg that's 160 users. Even smaller target. TAM is not the constraint — distribution is.                                                         |
| GitHub API rate limits                   | Low      | Webhook-driven sync (not polling). Cache in KV. 5000 req/hr per user token — more than enough for any indie founder's commit frequency.                                                          |

# **11\. Go-to-Market Strategy**

### **Phase 1 — Launch Week (Days 1–7)**

8. Deploy MVP. Use GitLog on GitLog's own GitHub repo immediately. Dogfood from day one.

9. Post on Indie Hackers: 'I built a changelog tool that also writes your tweets and emails. Here's how.'

10. Twitter/X thread: Show raw commit → clean changelog entry → auto-drafted tweet. The before/after demo is the marketing.

11. Reddit: r/SaaS, r/indiehackers, r/nextjs — lead with the demo, not the pitch.

12. Offer first 20 users lifetime Pro at $9/mo. These become your feedback loop and marketing army.

### **Phase 2 — Content \+ SEO (Weeks 2–8)**

- Blog post: 'How to auto-generate a changelog from GitHub commits' — targets exact search term with weak competition.

- Blog post: 'How I cut my release communication time from 3 hours to 10 minutes' — targets founder pain directly.

- Build in public on Twitter/X: use your own social post drafts feature to announce GitLog updates. Meta story is extremely shareable.

- Reach out to 20 OSS repos with 200–2000 stars: free Pro for a testimonial and README mention.

- Product Hunt launch in Week 3–4 after gathering initial user feedback.

- Show HN on Hacker News. Dev tools perform well if the demo is technically interesting.

### **Phase 3 — Compound Growth (Month 2–6)**

- Every public GitLog page is a backlink and a live product demo. OSS users are free distribution at scale.

- SEO compounds on 'changelog from github', 'auto release notes', 'indie saas changelog tools'.

- Add one feature per week based on paying user requests. Tweet each feature using your own social post drafts.

- Raise price: $19 → $22 at 100 paying users. Test $25 at 200\. The expanded feature suite justifies it.

- Target YC/Techstars alumni networks for Team plan with investor update feature.

# **12\. Revenue Projections**

Revised upward from v1 PRD due to higher pricing ($19 avg vs $12) and expanded feature suite improving conversion and retention.

| Month | Free Users | Paying | ARPU | MRR    | Milestone                           |
| :---- | :--------- | :----- | :--- | :----- | :---------------------------------- |
| 1     | 50         | 3      | $19  | $57    | Launch — friends \+ first posts     |
| 2     | 150        | 12     | $19  | $228   | Reddit/IH traction                  |
| 3     | 300        | 28     | $21  | $588   | Word of mouth \+ some Team upgrades |
| 4     | 500        | 55     | $21  | $1,155 | SEO \+ Product Hunt traffic         |
| 5     | 800        | 88     | $22  | $1,936 | 🎯 $2k/mo milestone                 |
| 6     | 1,200      | 130    | $23  | $2,990 | 🎯 $3k/mo milestone                 |
| 9     | 2,000      | 210    | $24  | $5,040 | 🎯 $5k/mo milestone                 |
| 12    | 3,000      | 300    | $25  | $7,500 | Sustainable solo business           |

| Assumptions: blended ARPU rising as Team plan ($49) adoption grows, 10–15% free-to-paid conversion, \<3% monthly churn (embeddable widget drives retention), zero paid ads. What accelerates this: one viral tweet or HN front page can compress 3 months of growth into 2 weeks. |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **13\. Build Plan — Zero to Launch**

| Day   | Task                                                                                         | Deliverable                        |
| :---- | :------------------------------------------------------------------------------------------- | :--------------------------------- |
| 1     | npx create-next-app. Install Clerk, Tailwind, Shadcn, Octokit. Set up Vercel \+ GitHub repo. | Deployable skeleton on Vercel      |
| 2     | GitHub OAuth via Clerk. Repo connect flow. Octokit PR fetch \+ store in KV.                  | User can log in and connect a repo |
| 3     | PR sync pipeline. Auto-categorise by labels. Draft entry UI in dashboard.                    | PRs appear as draft cards          |
| 4     | Claude Haiku AI rewrite integration. Publish flow. Entry list with status.                   | Full draft → publish loop works    |
| 5     | Public changelog page /changelog/\[user\]/\[repo\]. SEO meta tags. Mobile responsive.        | Public page live and shareable     |
| 6     | Roadmap from GitHub Issues. Upvoting endpoint. Auto-move on PR merge.                        | Full changelog \+ roadmap flow     |
| 7     | Stripe: Free \+ Pro plan. Upgrade flow. Webhook handler. Feature gating.                     | Payments working end-to-end        |
| 8     | Landing page. Onboarding. Empty states. Error handling. Production deploy.                   | 🚀 MVP live on Vercel              |
| 9–11  | Embeddable widget (vanilla JS). Social post draft generator. Custom slug.                    | Phase 2 core features              |
| 12–14 | Remove branding for Pro. Product Story page. Analytics dashboard.                            | Phase 2 complete                   |
| 15–21 | Resend release email integration. Email digest subscriptions. Multiple repo support.         | Phase 3 begins                     |
| 22–28 | Polish, bug fixes, onboarding improvements based on first user feedback.                     | Ready for Product Hunt             |

# **14\. Success Metrics**

| North Star Metric Weekly Active Publishers Developers who publish at least one changelog entry per week. Proves the core loop is working — not just sign-ups. Activation Metrics GitHub repos connected (Day 1\) First entry published (Day 1–3) Widget embedded in product (Week 1–2) First social post drafted (Week 1\) | Revenue Metrics MRR and MoM growth rate Free-to-paid conversion (target: 12%) Monthly churn (target: \<3%) ARPU growth over time Communication Feature Metrics Social drafts generated per publisher Email drafts sent vs drafted (quality signal) Investor updates generated per Team user Widget embed rate per Pro user (target: \>70%) |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **15\. Competitive Positioning**

| Tool        | Price    | Auto GitHub? | Social Drafts? | Release Email? | Investor Update? | Verdict         |
| :---------- | :------- | :----------- | :------------- | :------------- | :--------------- | :-------------- |
| Canny       | $400+/mo | ❌           | ❌             | ❌             | ❌               | Enterprise only |
| Featurebase | $49/mo   | ❌           | ❌             | ❌             | ❌               | Good but manual |
| Frill       | $25/mo   | ❌           | ❌             | ❌             | ❌               | Simple, dumb    |
| Headway     | $29/mo   | ❌           | ❌             | ❌             | ❌               | Stagnant        |
| Changelogfy | $19/mo   | ❌           | ❌             | ❌             | ❌               | Poor UX         |
| GitLog Pro  | $19/mo   | ✅           | ✅             | —              | —                | Your tool       |
| GitLog Team | $49/mo   | ✅           | ✅             | ✅             | ✅               | Your tool       |

| GitLog is the only tool in the entire $0–$100/mo range that auto-generates from GitHub AND handles the downstream release communication. The positioning is not 'cheaper Canny' — it's 'the release communication platform built for developers who live in GitHub.' |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **16\. Founder Operating Principles**

| You are a solo full-stack JS dev targeting developers. You ARE the customer. Every feature you build should pass the test: 'Would I pay $19/mo for this right now?' If yes, ship it. If no, cut it. |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| Principle                          | What It Means in Practice                                                                                                                                         |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ship on Day 8, not Day 30          | 10 P0 features. Nothing else. Scope creep is the enemy of momentum.                                                                                               |
| Use your own product from Day 1    | GitLog's own changelog must be powered by GitLog. Dogfood everything. You'll find bugs and UX issues faster than any user will.                                   |
| Build in public from Day 1         | Tweet every milestone. Use your own social draft feature to announce GitLog updates. The meta story — a changelog tool marketing itself — is extremely shareable. |
| 10 paying users \> 1000 free users | Free users give opinions. Paying users give signal. Optimise for conversion, not signup numbers.                                                                  |
| One feature per week after launch  | Ask your 10 paying users what's missing. Build the most-requested thing. Tweet it using your own tool.                                                            |
| The widget is your retention moat  | Get the embeddable widget live in Week 2\. Once it's inside someone's product, they never churn. Prioritise this above everything post-MVP.                       |
| Never compete on features          | You'll lose to Featurebase on features eventually. Win on: GitHub-native automation \+ price \+ simplicity \+ the communication suite they'll never build.        |
| Raise prices with confidence       | The expanded feature suite makes $19 and $49 easy to justify. Cheap pricing signals low value. Raise at every milestone.                                          |

| GitLog — PRD v2.0 • Confidential • 2026 • Ship it. |
| :------------------------------------------------: |
