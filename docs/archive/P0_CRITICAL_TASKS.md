# GitLog P0 Critical Tasks - Launch Sprint

**Created:** 2026-03-08  
**Total P0 Tasks:** 70  
**Goal:** Complete all P0 tasks to be launch-ready  
**Timeline:** 2 days (Day 7-8)

---

## 📊 P0 Task Summary

| Category | Count | Status |
| :---- | :---- | :---- |
| Environment Setup | 6 | ⬜ 0% |
| Testing (All Categories) | 60 | ⬜ 0% |
| Bug Fixes | 4 | ⬜ 0% |

**Total:** 70 P0 tasks

---

## 🎯 Day 7: Environment + Core Testing (8 hours)

### **Morning: Environment Setup (1 hour)**

| ID | Task | Time | Status |
| :---- | :---- | :---- | :---- |
| ENV-01 | Create `.env.local` | 10 min | ⬜ |
| ENV-02 | Set up Clerk account + GitHub OAuth | 15 min | ⬜ |
| ENV-03 | Create Vercel KV database | 10 min | ⬜ |
| ENV-04 | Get Google AI API key | 10 min | ⬜ |
| ENV-05 | Set up DodoPayment account + products | 30 min | ⬜ |
| ENV-06 | Configure GitHub webhook secret | 5 min | ⬜ |

**Checklist:**
```bash
# 1. Create .env.local
cp .env.example .env.local

# 2. Fill in these variables:
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
VERCEL_KV_REST_API_URL=redis://...
VERCEL_KV_REST_API_TOKEN=...
GOOGLE_GENERATIVE_AI_API_KEY=...
DODOPAYMENT_API_KEY=live_...
DODOPAYMENT_WEBHOOK_SECRET=whsec_...
DODOPAYMENT_PRO_PLAN_ID_IN=plan_...
DODOPAYMENT_PRO_PLAN_ID=plan_...
NEXT_PUBLIC_DODOPAYMENT_KEY=pk_...
GITHUB_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 3. Start dev server
npm run dev
```

**Account Setup Links:**
- Clerk: https://clerk.com
- Vercel KV: https://vercel.com/docs/storage/vercel-kv
- Google AI: https://aistudio.google.com
- DodoPayment: https://dodopayment.com

---

### **Late Morning: Authentication Testing (1 hour)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| AUTH-01 | Sign in with GitHub | Redirected to dashboard | ⬜ |
| AUTH-02 | Sign up flow | Account created, redirected to onboarding | ⬜ |
| AUTH-03 | Protected routes | Visit `/dashboard` without auth → Redirect to `/sign-in` | ⬜ |
| AUTH-04 | Sign out | Logged out, redirected to home | ⬜ |
| AUTH-05 | Session persistence | Sign in → Refresh page → Still logged in | ⬜ |

**Test Steps:**
1. Visit `http://localhost:3000`
2. Click "Sign in with GitHub"
3. Authorize GitLog
4. Should redirect to `/dashboard`
5. Refresh page → Should stay logged in
6. Click sign out → Should redirect to home
7. Try visiting `/dashboard` → Should redirect to sign-in

---

### **Afternoon: Onboarding + Dashboard (2 hours)**

#### **Onboarding Testing (4 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| ONBOARD-01 | First-time user flow | Repo list displayed | ⬜ |
| ONBOARD-02 | Connect repository | Repo connected, redirected to dashboard | ⬜ |
| ONBOARD-03 | Search repositories | Filtered repo list | ⬜ |
| ONBOARD-04 | No repos empty state | "Create repository" CTA shown | ⬜ |

**Test Steps:**
1. Sign in for first time
2. Should see onboarding page
3. Should see list of GitHub repos
4. Type in search box → Should filter
5. Click "Connect" on a repo
6. Should save and redirect to dashboard

#### **Dashboard Testing (4 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| DASH-01 | Sidebar navigation | Click each nav item → Correct page loads | ⬜ |
| DASH-02 | Responsive design | Resize to mobile → Sidebar collapses | ⬜ |
| DASH-03 | Header displays | Logo, nav, user avatar visible | ⬜ |
| DASH-04 | Upgrade CTA | Upgrade CTA visible in sidebar | ⬜ |

**Test Steps:**
1. Check sidebar navigation works
2. Click Overview → Goes to `/dashboard`
3. Click Drafts → Goes to `/drafts`
4. Resize browser to mobile size
5. Check sidebar collapses appropriately
6. Check header shows logo + avatar

---

### **Late Afternoon: GitHub Integration (2 hours)**

#### **Webhook Testing (4 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| WEBHOOK-01 | Merged PR webhook | Draft appears in <30s | ⬜ |
| WEBHOOK-02 | Non-merged PR | No draft created | ⬜ |
| WEBHOOK-03 | Invalid signature | Rejected with 401 | ⬜ |
| WEBHOOK-04 | Multiple users | Draft for each user | ⬜ |

**Test Steps:**
1. Go to GitHub repo → Settings → Webhooks
2. Add webhook:
   - Payload URL: `http://your-ngrok-url.ngrok.io/api/github/sync`
   - Secret: Your `GITHUB_WEBHOOK_SECRET`
   - Events: Pull requests
3. Merge a test PR
4. Check dashboard within 30 seconds
5. Draft should appear

**For local testing, use ngrok:**
```bash
# Install ngrok
npm install -g ngrok

# Expose localhost
ngrok http 3000

# Use the ngrok URL for webhook
# Example: https://abc123.ngrok.io/api/github/sync
```

#### **Manual Sync Testing (3 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| SYNC-01 | Manual sync button | Fetches last 50 merged PRs | ⬜ |
| SYNC-02 | Sync with no token | Error message shown | ⬜ |
| SYNC-03 | Sync with connected repo | New drafts appear | ⬜ |

**Test Steps:**
1. Click "Sync Now" button
2. Should fetch recent merged PRs
3. Should create drafts for new PRs
4. Check drafts appear in dashboard

---

### **Evening: Categorization + Public Page (2 hours)**

#### **Auto-Categorization Testing (5 tasks)**

| ID | Task | Input | Expected | Status |
| :---- | :---- | :---- | :---- | :---- |
| CAT-01 | Feature PR | `feat`, `feature` | New | ⬜ |
| CAT-02 | Bug fix PR | `fix`, `bug` | Fixed | ⬜ |
| CAT-03 | Chore PR | `chore`, `refactor` | Improved | ⬜ |
| CAT-04 | No labels | (none) | Other | ⬜ |
| CAT-05 | Mixed labels | `feat`, `fix` | New (first match) | ⬜ |

**Test Steps:**
1. Create test PRs with different labels
2. Merge them
3. Check drafts are categorized correctly
4. Verify category badges show correct colors

#### **Public Changelog Testing (6 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| PUB-01 | View published entries | Entries grouped by month | ⬜ |
| PUB-02 | No entries | 404 page shown | ⬜ |
| PUB-03 | SEO meta tags | Title, description, OG tags present | ⬜ |
| PUB-04 | JSON-LD | Structured data present | ⬜ |
| PUB-05 | Mobile responsive | Clean layout, readable | ⬜ |
| PUB-06 | "Powered by GitLog" | Badge with link visible | ⬜ |

**Test Steps:**
1. Publish a draft entry
2. Visit `/changelog/[username]/[repo]`
3. Check entries are grouped by month
4. View page source → Check meta tags
5. Check JSON-LD in source
6. Test on mobile device
7. Check footer has "Powered by GitLog"

---

## 🎯 Day 8: Full Testing + Bug Fixes (8 hours)

### **Morning: Draft + AI Testing (3 hours)**

#### **Draft Management Testing (5 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| DRAFT-01 | View drafts list | All drafts shown | ⬜ |
| DRAFT-02 | Search drafts | Filtered results | ⬜ |
| DRAFT-03 | Filter by rewrite | Only drafts with rewrite shown | ⬜ |
| DRAFT-04 | Edit draft | Changes saved | ⬜ |
| DRAFT-05 | Discard draft | Draft deleted | ⬜ |

**Test Steps:**
1. Visit `/drafts`
2. Should see all drafts
3. Type in search box → Should filter
4. Select "With AI Rewrite" filter
5. Click edit on a draft
6. Make changes → Save
7. Click discard → Confirm → Should delete

#### **AI Rewrite Testing (6 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| AI-01 | Generate rewrite | AI output appears in <5s | ⬜ |
| AI-02 | Regenerate | New version generated | ⬜ |
| AI-03 | Different tones | Tone-appropriate output | ⬜ |
| AI-04 | Copy to clipboard | Text copied, toast shown | ⬜ |
| AI-05 | Free plan limit | Error: limit reached | ⬜ |
| AI-06 | Empty PR body | Uses title only | ⬜ |

**Test Steps:**
1. Click "Rewrite" on a draft
2. Should generate in <5 seconds
3. Click "Regenerate" → New version
4. Select different tone → Regenerate
5. Click copy button → Should copy
6. Check toast appears
7. Test with empty PR body

---

### **Late Morning: Publish Flow (2 hours)**

#### **Publish Flow Testing (6 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| PUB-01 | Publish draft | Entry published, toast shown | ⬜ |
| PUB-02 | Publish modal | Modal appears with preview | ⬜ |
| PUB-03 | Cancel publish | Modal closes, no action | ⬜ |
| PUB-04 | Unpublish | Entry reverted to draft | ⬜ |
| PUB-05 | Free plan limit | Error: limit reached | ⬜ |
| PUB-06 | Success toast | Green toast with message | ⬜ |

**Test Steps:**
1. Click "Publish" on a draft
2. Modal should appear with preview
3. Click "Cancel" → Modal closes
4. Click "Publish" → Confirm
5. Should see green success toast
6. Entry should appear on public page
7. Click "Unpublish" → Should revert to draft

#### **Toast Notifications Testing (5 tasks)**

| ID | Task | Expected Toast | Status |
| :---- | :---- | :---- | :---- |
| TOAST-01 | Success toast | Green, auto-dismiss 5s | ⬜ |
| TOAST-02 | Error toast | Red, manual dismiss | ⬜ |
| TOAST-03 | Info toast | Blue, auto-dismiss | ⬜ |
| TOAST-04 | Warning toast | Amber, auto-dismiss | ⬜ |
| TOAST-05 | Multiple toasts | Stacked, all visible | ⬜ |

**Test Steps:**
1. Trigger success (publish entry)
2. Trigger error (failed API call)
3. Trigger info (some action)
4. Trigger warning (limit warning)
5. Trigger 3 toasts quickly
6. Check they stack properly
7. Check auto-dismiss works

---

### **Afternoon: Payment Testing (3 hours)**

#### **Payment Testing (9 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| PAY-01 | View upgrade page | Plan comparison shown | ⬜ |
| PAY-02 | Start checkout | Redirected to DodoPayment | ⬜ |
| PAY-03 | Complete payment | Success page shown | ⬜ |
| PAY-04 | Cancel payment | Cancel page shown | ⬜ |
| PAY-05 | Free plan user | "Current Plan" badge shown | ⬜ |
| WH-01 | Payment success webhook | User upgraded to Pro | ⬜ |
| WH-02 | Subscription cancelled | User downgraded to Free | ⬜ |
| WH-03 | Invalid signature | Rejected with 401 | ⬜ |
| WH-04 | Missing userId | Error logged | ⬜ |

**Test Steps:**
1. Visit `/upgrade`
2. Check plan comparison shows
3. Click "Upgrade to Pro"
4. Should redirect to DodoPayment
5. Complete test payment (use test card)
6. Should see success page
7. Check user is upgraded to Pro
8. Test cancel flow

**For webhook testing:**
```bash
# Use DodoPayment CLI for local webhook testing
# Or use ngrok to expose your webhook endpoint

ngrok http 3000

# Update webhook URL in DodoPayment dashboard to:
# https://your-ngrok-url.ngrok.io/api/payment/webhook
```

#### **Plan Limits Testing (4 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| LIMIT-01 | Pro user unlimited | No limit error | ⬜ |
| LIMIT-02 | Free user limit | Error: limit reached | ⬜ |
| LIMIT-03 | Upgrade removes limits | No limit error | ⬜ |
| LIMIT-04 | Downgrade restores limits | Limit enforced | ⬜ |

**Test Steps:**
1. As free user, publish 50 entries
2. 51st should fail with limit error
3. Upgrade to Pro
4. Should be able to publish unlimited
5. Cancel subscription
6. Limits should be enforced again

---

### **Late Afternoon: E2E + Performance (2 hours)**

#### **End-to-End User Flows (4 tasks)**

| ID | Task | Time Target | Status |
| :---- | :---- | :---- | :---- |
| E2E-01 | First-time user flow | <5 min | ⬜ |
| E2E-02 | Returning user flow | <3 min | ⬜ |
| E2E-03 | Free → Pro upgrade | <5 min | ⬜ |
| E2E-04 | Public changelog view | <1 min | ⬜ |

**Test Each Flow:**
1. Time yourself
2. Note any friction points
3. Document any bugs
4. Fix immediately

#### **Performance Testing (4 tasks)**

| ID | Task | Target | Status |
| :---- | :---- | :---- | :---- |
| PERF-01 | Page load times | Homepage <1s, Dashboard <1.5s | ⬜ |
| PERF-02 | API response times | <500ms p95 | ⬜ |
| PERF-03 | Lighthouse score | >90 all categories | ⬜ |
| PERF-04 | Load testing | 100 users, 5 min, <2s response | ⬜ |

**Test Tools:**
```bash
# Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Or use Chrome DevTools:
# F12 → Lighthouse → Run audit
```

---

### **Evening: Security + Bug Fixes (2 hours)**

#### **Security Testing (4 tasks)**

| ID | Task | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| SEC-01 | Access protected route without auth | Redirect to sign-in | ⬜ |
| SEC-02 | Access another user's draft | 403 Forbidden | ⬜ |
| SEC-03 | CSRF attack attempt | Rejected | ⬜ |
| SEC-04 | Invalid webhook signature | 401 Unauthorized | ⬜ |

**Test Steps:**
1. Sign out
2. Try to visit `/dashboard` → Should redirect
3. Try to access another user's draft → Should fail
4. Send fake webhook → Should reject

#### **Bug Fixes (4 tasks)**

| ID | Task | Priority | Status |
| :---- | :---- | :---- | :---- |
| BUG-01 | Fix P0 bugs found during testing | P0 | ⬜ |
| BUG-02 | Fix P1 bugs found during testing | P1 | ⬜ |
| BUG-03 | Test error boundaries | P1 | ⬜ |
| BUG-04 | Verify all API endpoints | P0 | ⬜ |

**Bug Triage:**
1. List all bugs found
2. Categorize by severity (P0/P1/P2)
3. Fix P0 bugs immediately
4. Document P1 bugs for later

---

## ✅ P0 Completion Checklist

### **Environment (6/6)**
- [ ] ENV-01: `.env.local` created
- [ ] ENV-02: Clerk account set up
- [ ] ENV-03: Vercel KV created
- [ ] ENV-04: Google AI key obtained
- [ ] ENV-05: DodoPayment set up
- [ ] ENV-06: GitHub webhook configured

### **Testing (60/60)**
- [ ] AUTH-01 to AUTH-05 (5 tests)
- [ ] ONBOARD-01 to ONBOARD-04 (4 tests)
- [ ] DASH-01 to DASH-04 (4 tests)
- [ ] WEBHOOK-01 to WEBHOOK-04 (4 tests)
- [ ] SYNC-01 to SYNC-03 (3 tests)
- [ ] CAT-01 to CAT-05 (5 tests)
- [ ] PUB-01 to PUB-06 (6 tests)
- [ ] DRAFT-01 to DRAFT-05 (5 tests)
- [ ] AI-01 to AI-06 (6 tests)
- [ ] PUB_FLOW-01 to PUB_FLOW-06 (6 tests)
- [ ] TOAST-01 to TOAST-05 (5 tests)
- [ ] PAY-01 to PAY-05 (5 tests)
- [ ] WH-01 to WH-04 (4 tests)
- [ ] LIMIT-01 to LIMIT-04 (4 tests)
- [ ] E2E-01 to E2E-04 (4 tests)
- [ ] PERF-01 to PERF-04 (4 tests)
- [ ] SEC-01 to SEC-04 (4 tests)

### **Bug Fixes (4/4)**
- [ ] BUG-01: All P0 bugs fixed
- [ ] BUG-02: All P1 bugs documented
- [ ] BUG-03: Error boundaries tested
- [ ] BUG-04: All APIs verified

---

## 📊 Progress Tracker

### **Day 7 Progress**

| Time | Task | Status |
| :---- | :---- | :---- |
| 9:00 AM - 10:00 AM | Environment Setup (ENV-01 to ENV-06) | ⬜ |
| 10:00 AM - 11:00 AM | Authentication Testing (AUTH-01 to AUTH-05) | ⬜ |
| 11:00 AM - 1:00 PM | Onboarding + Dashboard (ONBOARD, DASH) | ⬜ |
| 2:00 PM - 4:00 PM | GitHub Integration (WEBHOOK, SYNC) | ⬜ |
| 4:00 PM - 6:00 PM | Categorization + Public Page (CAT, PUB) | ⬜ |

### **Day 8 Progress**

| Time | Task | Status |
| :---- | :---- | :---- |
| 9:00 AM - 12:00 PM | Draft + AI Testing (DRAFT, AI) | ⬜ |
| 12:00 PM - 2:00 PM | Publish Flow + Toasts (PUB_FLOW, TOAST) | ⬜ |
| 3:00 PM - 6:00 PM | Payment Testing (PAY, WH, LIMIT) | ⬜ |
| 6:00 PM - 8:00 PM | E2E + Performance + Security | ⬜ |
| 8:00 PM - 9:00 PM | Bug Fixes | ⬜ |

---

## 🎯 Success Criteria

**P0 Complete When:**
- [ ] All 70 P0 tasks completed
- [ ] No P0 bugs remaining
- [ ] All user flows work end-to-end
- [ ] Performance targets met
- [ ] Security tests passed

**After P0 Complete:**
- ✅ Ready for soft launch
- ✅ Can proceed to P1 tasks
- ✅ Can show to users

---

**Start Date:** ___________  
**Target End Date:** 2 days from start  
**Actual End Date:** ___________

**Status:** ⬜ Not Started → 🔄 In Progress → ✅ Complete

---

*Update this file as you complete each task. Move to P1 tasks only after all P0 are complete!*
