# ⚡ GitLog Auto-Changelog + Release Communication Platform

## Product Requirements Document • v3.0 (Refined) • 2026

| Product | Version      | Status         | Owner        | Revenue Goal       |
| :------ | :----------- | :------------- | :----------- | :----------------- |
| GitLog  | v3.0 Refined | Ready to Build | Solo Founder | $3k–5k MRR / 12 mo |

---

## 🎯 Scope Decision: MVP Only

**This PRD covers MVP (Phase 1) only.** Phases 2-3 are documented in `GitLog_Roadmap.md`. This prevents scope creep and ensures 8-day launch target.

---

## 1. Executive Summary (Tightened)

GitLog connects to GitHub once and auto-generates a public changelog from merged PRs. Zero manual writing.

**Core insight:** Developers already document their work in PRs. Changelogs rot because copying PR info to another tool is manual work. GitLog eliminates the copy-paste.

**MVP Value Prop:** Merge a PR → see it on your public changelog in under 60 seconds.

---

## 2. Problem Statement (Validated)

### The Core Pain

- Developers merge PRs all day. Users have no idea what changed.
- Writing changelogs manually requires context-switching into a separate tool.
- Most indie founders start writing changelogs, do it twice, then abandon it.
- GitHub Releases exist but are technical, dev-only, and go nowhere public-facing.

### Who Feels This Most

- Solo SaaS founders shipping weekly
- Small teams (2-5 people) without dedicated product marketers
- Open source maintainainers who want users to know what's new

---

## 3. Ideal Customer Profile (ICP)

### Primary ICP — Must Hit ALL Criteria

| Criterion              | Threshold                                           |
| :--------------------- | :-------------------------------------------------- |
| **Product stage**      | Live product with 10–500 users                      |
| **Shipping frequency** | At least 2 PRs/week merged                          |
| **GitHub activity**    | Public repo with 50+ commits                        |
| **Price sensitivity**  | Pays for tools under $20/mo without blinking        |
| **Marketing channel**  | Active on Twitter/X or Indie Hackers                |
| **Pain validation**    | Has tried maintaining a changelog before (and quit) |

### Secondary ICP — Nice to Have

- Open source projects with 100+ GitHub stars
- Recently raised pre-seed/seed (investor pressure to communicate)

### NOT the ICP — Explicitly Exclude

| Segment                | Why Exclude                         |
| :--------------------- | :---------------------------------- |
| Pre-launch founders    | No commits = no value               |
| Enterprise teams       | Use Jira + Confluence, won't switch |
| Non-technical founders | GitHub OAuth will confuse them      |
| Agencies               | No recurring product to maintain    |
| Monorepo teams         | Complex sync logic, edge cases      |

---

## 4. MVP Feature Scope (8 Days)

### P0 — Must Ship (Day 1-8)

| ID      | Feature                   | Acceptance Criteria                                                                                                                                                                                                                                            | Priority |
| :------ | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| **F1**  | **GitHub OAuth Login**    | - User clicks "Sign in with GitHub"<br>- Clerk handles OAuth flow<br>- User lands on dashboard after auth<br>- GitHub token stored securely<br>- **Time: 4 hours**                                                                                             | P0       |
| **F2**  | **Repo Connection**       | - Dashboard shows "Connect Repo" button<br>- User selects repo from GitHub list<br>- Repo saved to user profile<br>- Supports public + private repos<br>- **Time: 3 hours**                                                                                    | P0       |
| **F3**  | **PR Auto-Sync**          | - Webhook receiver at `/api/github/sync`<br>- Fires on `pull_request.closed` + `merged=true`<br>- Extracts: title, body, labels, merged_at, pr_url, author<br>- Stores entry as `status: draft`<br>- Sync completes in <30 seconds<br>- **Time: 6 hours**      | P0       |
| **F4**  | **Auto-Categorisation**   | - Reads PR labels: `feat` → "New", `fix` → "Fixed", `chore` → "Improved"<br>- Falls back to "Other" if no matching label<br>- Category editable in dashboard<br>- **Time: 2 hours**                                                                            | P0       |
| **F5**  | **AI Rewrite**            | - Dashboard shows "Rewrite with AI" button per draft<br>- Calls Claude Haiku with PR title + body + diff summary<br>- Returns plain English summary (2-3 sentences)<br>- User can edit before publishing<br>- Cost: <$0.005 per rewrite<br>- **Time: 4 hours** | P0       |
| **F6**  | **Draft Mode**            | - All synced PRs start as `status: draft`<br>- Nothing auto-publishes<br>- Dashboard shows draft/published filter<br>- **Time: 2 hours**                                                                                                                       | P0       |
| **F7**  | **Publish Flow**          | - "Publish" button on draft card<br>- Sets `status: published`, `published_at: now`<br>- Appears on public changelog page instantly<br>- Can unpublish (reverts to draft)<br>- **Time: 3 hours**                                                               | P0       |
| **F8**  | **Public Changelog Page** | - Live at `gitlog.app/[username]/[repo]`<br>- Shows published entries, newest first<br>- Groups by month (e.g., "January 2026")<br>- Groups by category within each entry<br>- Mobile responsive (Tailwind)<br>- Loads in <2 seconds<br>- **Time: 8 hours**    | P0       |
| **F9**  | **SEO Meta Tags**         | - Each entry has unique `<title>` and `<meta description>`<br>- Title format: "What's New in [Repo] — [Month Year] \| GitLog"<br>- Description: AI-generated, 150-160 chars<br>- Open Graph tags for social sharing<br>- **Time: 3 hours**                     | P0       |
| **F10** | **DodoPayment**           | - Free plan: 50 entries/month, 1 repo, GitLog branding<br>- Pro plan: ₹499/mo (India) or $19/mo (Intl)<br>- Upgrade prompt when free limit hit<br>- DodoPayment checkout for subscription<br>- Webhook handles payment success/failure<br>- **Time: 6 hours**  | P0       |

### P1 — Ship Week 2-3 (Post-MVP)

| ID      | Feature                    | Why Not MVP                                    |
| :------ | :------------------------- | :--------------------------------------------- |
| **F11** | Roadmap from GitHub Issues | Nice-to-have, not core to changelog value      |
| **F12** | Embeddable Widget          | Requires testing across sites, can ship Week 2 |
| **F13** | Social Post Drafts         | Build after core loop is validated             |
| **F14** | Custom Slug                | Infrastructure work, not user-facing value     |
| **F15** | Analytics                  | Need traffic first, can add Week 3-4           |

### Explicitly Out of Scope (Do Not Build Yet)

| Feature                                | Why Exclude                             |
| :------------------------------------- | :-------------------------------------- |
| Custom domains                         | Complex DNS, 2+ weeks of edge cases     |
| Auto-posting to Twitter/LinkedIn       | OAuth complexity, API costs, abuse risk |
| Email integrations (Resend, Mailchimp) | Phase 2, requires email infrastructure  |
| Investor update generator              | Phase 3, narrow ICP                     |
| Team accounts                          | Phase 3, adds permission complexity     |
| Mobile app                             | Web is sufficient                       |
| Import from other tools                | Zero demand at launch                   |

---

## 5. Technical Specifications

### 5.1 Tech Stack (Final)

| Layer      | Technology               | Version           | Why                                  |
| :--------- | :----------------------- | :---------------- | :----------------------------------- |
| Framework  | Next.js                  | 15.x (App Router) | Server Actions + API routes          |
| Auth       | Clerk                    | Latest            | GitHub OAuth, sessions, webhooks     |
| GitHub SDK | Octokit                  | Latest            | Official, handles pagination         |
| AI         | Google Gemini API        | gemini-2.0-flash  | 70% cheaper than Claude, fast        |
| Database   | Vercel KV (Redis)        | Latest            | Zero config, free tier               |
| Payments   | DodoPayment              | Latest            | India + Intl cards, UPI, INR payouts |
| Styling    | Tailwind CSS + Shadcn/ui | Latest            | Fast UI development                  |
| Hosting    | Vercel                   | Latest            | One-click deploy, Mumbai edge        |
| Analytics  | Vercel Analytics         | Latest            | Privacy-friendly, zero config        |

### Pricing Strategy (India + Global)

| Market            | Free Plan | Pro Plan                     |
| :---------------- | :-------- | :--------------------------- |
| **India**         | ₹0/mo     | ₹499/mo (or ₹1,599 one-time) |
| **International** | $0/mo     | $19/mo                       |

DodoPayment auto-detects customer location and shows appropriate currency.

### 5.2 Data Schema (Vercel KV)

```typescript
// User Configuration
kv.set(`user:${userId}`, {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  stripeCustomerId?: string;
  githubToken: string;
  createdAt: Date;
});

// Connected Repos
kv.set(`repo:${userId}:${repoId}`, {
  id: string;
  userId: string;
  githubRepoId: number;
  name: string; // "owner/repo"
  slug: string; // url-friendly version
  isPrivate: boolean;
  connectedAt: Date;
});

// Changelog Entry
kv.set(`entry:${userId}:${repoId}:${prId}`, {
  id: string;
  userId: string;
  repoId: string;
  prId: number;
  title: string;
  body: string;
  category: 'New' | 'Fixed' | 'Improved' | 'Other';
  status: 'draft' | 'published';
  mergedAt: Date;
  publishedAt?: Date;
  prUrl: string;
  author: string;
  aiRewrite?: string;
  labels: string[];
});

// Roadmap Item (Phase 2)
kv.set(`roadmap:${userId}:${repoId}:${issueId}`, {
  id: string;
  userId: string;
  repoId: string;
  issueId: number;
  title: string;
  body: string;
  votes: number;
  voters: string[]; // userIds
  githubIssueUrl: string;
  status: 'open' | 'closed';
});
```

### 5.3 API Endpoints

| Endpoint                 | Method | Auth             | Description                   |
| :----------------------- | :----- | :--------------- | :---------------------------- |
| `/api/github/sync`       | POST   | GitHub webhook   | Receives PR merge events      |
| `/api/github/repos`      | GET    | User session     | Lists user's GitHub repos     |
| `/api/ai/rewrite`        | POST   | User session     | Calls Claude, returns rewrite |
| `/api/entries/publish`   | POST   | User session     | Publishes a draft entry       |
| `/api/entries/unpublish` | POST   | User session     | Reverts published to draft    |
| `/api/stripe/webhook`    | POST   | Stripe signature | Handles subscription events   |
| `/api/votes/roadmap`     | POST   | None             | Public upvote endpoint        |

### 5.4 AI Prompt Specification

**AI Rewrite Prompt (Google Gemini Flash):**

```
You are rewriting a GitHub PR description into plain English for a changelog.

Rules:
- Use 2-3 sentences maximum
- Write for non-technical users
- Focus on what changed for the USER, not the code
- Use active voice: "Added X" not "X was added"
- Omit technical details (dependencies, refactors, tests)
- If PR body is empty, use title only

PR Title: {{title}}
PR Labels: {{labels}}
PR Body: {{body}}
Files Changed: {{diff_summary}}

Rewrite:
```

**Expected Output:**

```
Added dark mode toggle in settings. Users can now switch between light and dark themes with one click. The preference is saved automatically and persists across sessions.
```

**Cost per Rewrite:** ~$0.0001 (10x cheaper than Claude Haiku)

---

## 6. Acceptance Criteria (MVP Definition of Done)

### Functional Requirements

| ID       | Requirement                            | Test                                              |
| :------- | :------------------------------------- | :------------------------------------------------ |
| **FR1**  | User can sign in with GitHub           | Click OAuth → redirected to dashboard             |
| **FR2**  | User can connect a repo                | Select repo → appears in dashboard                |
| **FR3**  | Merged PR appears as draft within 30s  | Merge PR → refresh dashboard → draft card visible |
| **FR4**  | AI rewrite produces readable output    | Click rewrite → 2-3 sentence summary appears      |
| **FR5**  | Published entry appears on public page | Click publish → visit public URL → entry visible  |
| **FR6**  | Free plan limits at 50 entries/month   | Publish 50th entry → prompt to upgrade            |
| **FR7**  | Stripe upgrade works end-to-end        | Click upgrade → checkout → Pro features unlocked  |
| **FR8**  | Public page is mobile responsive       | Test on iPhone SE, Pixel 5, desktop               |
| **FR9**  | Page loads in <2 seconds               | Lighthouse performance score >90                  |
| **FR10** | SEO meta tags present                  | View source → title, description, OG tags exist   |

### Non-Functional Requirements

| ID       | Requirement            | Target                                      |
| :------- | :--------------------- | :------------------------------------------ |
| **NFR1** | Uptime                 | 99% (Vercel SLA)                            |
| **NFR2** | API response time      | <500ms p95                                  |
| **NFR3** | GitHub webhook latency | <30s from merge to draft                    |
| **NFR4** | AI rewrite latency     | <5s per request                             |
| **NFR5** | Mobile support         | iOS Safari, Chrome Android                  |
| **NFR6** | Browser support        | Chrome, Firefox, Safari (latest 2 versions) |
| **NFR7** | Rate limiting          | 100 requests/minute per user                |
| **NFR8** | Error handling         | All errors show user-friendly message       |

### Security Requirements

| ID      | Requirement               | Implementation                          |
| :------ | :------------------------ | :-------------------------------------- |
| **SR1** | GitHub token encryption   | Encrypt at rest, never expose to client |
| **SR2** | AuthZ on all endpoints    | Verify user owns repo before operations |
| **SR3** | Stripe webhook signature  | Verify signature before processing      |
| **SR4** | GitHub webhook secret     | Verify webhook signature                |
| **SR5** | No sensitive data in logs | Strip tokens from log output            |

---

## 7. Build Plan (8 Days)

| Day       | Tasks                                                                                                           | Deliverable                                    | Definition of Done                        |
| :-------- | :-------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- | :---------------------------------------- |
| **Day 1** | - `npx create-next-app`<br>- Install Clerk, Tailwind, Shadcn<br>- Set up Vercel project<br>- Create GitHub repo | Deployable skeleton on Vercel                  | `vercel deploy` succeeds, homepage loads  |
| **Day 2** | - Clerk GitHub OAuth<br>- Repo connection UI<br>- Octokit repo list                                             | User can log in + connect repo                 | Connected repo saved to KV                |
| **Day 3** | - GitHub webhook receiver<br>- PR sync logic<br>- Draft entry storage                                           | Merged PR → draft in KV                        | Webhook fires, entry visible in dashboard |
| **Day 4** | - Auto-categorisation logic<br>- AI rewrite endpoint<br>- Draft card UI                                         | Drafts categorized, AI rewrite works           | Click rewrite → Claude output appears     |
| **Day 5** | - Publish flow<br>- Public changelog page<br>- Entry grouping by month                                          | Public page live at `/changelog/[user]/[repo]` | Published entry visible on public URL     |
| **Day 6** | - Stripe integration<br>- Free/Pro plans<br>- Upgrade prompts                                                   | Payments work end-to-end                       | Upgrade → Pro features unlocked           |
| **Day 7** | - SEO meta tags<br>- Mobile responsive polish<br>- Error handling                                               | Production-ready UI                            | Lighthouse score >90                      |
| **Day 8** | - Dogfood on GitLog repo<br>- Bug fixes<br>- Launch prep                                                        | MVP ready to ship                              | All P0 features work, no critical bugs    |

---

## 8. Risk Mitigation (Updated)

| Risk                               | Severity | Mitigation                                                                    | Owner   |
| :--------------------------------- | :------- | :---------------------------------------------------------------------------- | :------ |
| Messy commits → garbage AI output  | High     | Draft mode + human review. Frame as "saves 90% of work" not "fully automatic" | Founder |
| GitHub webhook fails silently      | Medium   | Add manual sync button. Log all webhook events. Alert on failures             | Founder |
| Vercel KV costs spike              | Medium   | Monitor usage weekly. Plan Supabase migration at 500 users                    | Founder |
| Free users abuse AI rewrites       | Low      | Rate limit: 50 rewrites/month on free plan                                    | Founder |
| DodoPayment webhook misses events  | Medium   | Use DodoPayment CLI for local testing. Add retry logic                        | Founder |
| Public page looks broken on mobile | High     | Test on 3 devices before launch. Use Tailwind responsive utilities            | Founder |
| No users sign up Week 1            | High     | Pre-build waitlist. DM 50 founders before launch                              | Founder |

---

## 9. Metrics & Success Criteria

### Week 1 Success Metrics

| Metric            | Target | Why                                   |
| :---------------- | :----- | :------------------------------------ |
| Signups           | 20+    | Validates landing page + launch posts |
| Connected repos   | 10+    | Validates OAuth + connection flow     |
| Published entries | 50+    | Validates core loop works             |
| Paying users      | 3+     | Validates willingness to pay          |

### Month 1 Success Metrics

| Metric                 | Target         | Why                                 |
| :--------------------- | :------------- | :---------------------------------- |
| Active users (weekly)  | 30% of signups | Validates retention                 |
| Entries published/user | 5+             | Validates ongoing usage             |
| MRR                    | $100+          | Validates pricing                   |
| Churn                  | <5%            | Validates product-market fit signal |

### Kill/Pivot Criteria

| Signal                          | Action                                                  |
| :------------------------------ | :------------------------------------------------------ |
| <10 signups Week 1              | Revisit landing page + distribution channels            |
| 0 paying users Month 1          | Test price drop to $9, or add Pro features              |
| >20% churn Month 2              | Interview churned users, fix top 3 issues               |
| <2 entries published/user/month | Product not sticky — consider pivot to investor updates |

---

## 10. Launch Checklist Reference

See `GitLog_Launch_Checklist.md` for detailed Week 1 launch tasks.

---

## Appendix A: Competitive Landscape

| Competitor          | Price  | GitHub Sync      | AI Rewrite | Social Drafts | Why We Win                      |
| :------------------ | :----- | :--------------- | :--------- | :------------ | :------------------------------ |
| **Canny**           | $49/mo | ❌ Manual        | ❌         | ❌            | We're 4x cheaper + auto-sync    |
| **Featurebase**     | $29/mo | ⚠️ Import only   | ❌         | ❌            | We're native GitHub integration |
| **Frill**           | $49/mo | ❌ Manual        | ❌         | ❌            | We're developer-first           |
| **GitHub Releases** | Free   | ✅ Native        | ❌         | ❌            | We're user-facing + marketing   |
| **Changelog.com**   | $39/mo | ⚠️ Manual import | ❌         | ❌            | We're auto-sync + AI            |

**Our moat:** No competitor at ₹499/$19/mo offers GitHub auto-sync + AI rewrite. We own the "set and forget" positioning.

**Pricing advantage:** Indian founders pay ₹499/mo (60% less than $19) while US customers pay $19/mo. DodoPayment handles geo-pricing automatically.

---

## Appendix B: Open Questions

| Question                                       | Decision Needed By | Owner   |
| :--------------------------------------------- | :----------------- | :------ |
| What's the default slug format for repos?      | Day 2              | Founder |
| Do we allow editing categories post-publish?   | Day 4              | Founder |
| Should AI rewrite be auto-triggered or manual? | Day 4              | Founder |
| What happens when user disconnects GitHub?     | Day 5              | Founder |
| Do we show "Powered by GitLog" on free tier?   | Day 6              | Founder |

---

_This PRD is locked for MVP. Feature requests go to `GitLog_Roadmap.md` for Phase 2-3 consideration._
