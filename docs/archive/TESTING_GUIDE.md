# GitLog MVP Testing Guide & Final Checklist

**Version:** 1.0  
**Last Updated:** 2026-03-08  
**Status:** Ready for Testing

---

## 📋 Table of Contents

1. [Pre-Testing Setup](#pre-testing-setup)
2. [Day 1-2: Foundation Testing](#day-1-2-foundation-testing)
3. [Day 3: Core Features Testing](#day-3-core-features-testing)
4. [Day 4-5: Dashboard Testing](#day-4-5-dashboard-testing)
5. [Day 6: Payment Testing](#day-6-payment-testing)
6. [End-to-End User Flows](#end-to-end-user-flows)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)
9. [Bug Tracking Template](#bug-tracking-template)
10. [Launch Readiness Checklist](#launch-readiness-checklist)

---

## 🛠️ Pre-Testing Setup

### **Environment Variables**

Create `.env.local` with all required variables:

```env
# ============ Clerk Auth ============
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# ============ Database ============
VERCEL_KV_REST_API_URL=redis://...
VERCEL_KV_REST_API_TOKEN=...

# ============ AI ============
GOOGLE_GENERATIVE_AI_API_KEY=...

# ============ Payments ============
DODOPAYMENT_API_KEY=live_...
DODOPAYMENT_WEBHOOK_SECRET=whsec_...
DODOPAYMENT_PRO_PLAN_ID_IN=plan_...
DODOPAYMENT_PRO_PLAN_ID=plan_...
NEXT_PUBLIC_DODOPAYMENT_KEY=pk_...

# ============ GitHub ============
GITHUB_WEBHOOK_SECRET=whsec_...

# ============ App ============
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Test Accounts Setup**

1. **Clerk:**
   - Create test user: `test@gitlog.app`
   - Enable GitHub OAuth

2. **GitHub:**
   - Create test repo: `gitlog-test/test-app`
   - Add sample PRs (merged)

3. **DodoPayment:**
   - Create test products (Free/Pro)
   - Enable test mode
   - Get test card details

4. **Google AI:**
   - Verify API key works
   - Test rate limits

### **Testing Tools**

```bash
# Install testing tools
npm install -D @playwright/test  # E2E testing
npm install -D axe-core          # Accessibility testing
npm install -D lighthouse        # Performance testing
```

---

## Day 1-2: Foundation Testing

### **Authentication**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| AUTH-01 | Sign in with GitHub | Click "Sign in" → Authorize GitHub | Redirected to dashboard | ⬜ |
| AUTH-02 | Sign up flow | Click "Sign up" → Complete flow | Account created, redirected to onboarding | ⬜ |
| AUTH-03 | Protected routes | Visit `/dashboard` without auth | Redirected to `/sign-in` | ⬜ |
| AUTH-04 | Sign out | Click sign out → Confirm | Logged out, redirected to home | ⬜ |
| AUTH-05 | Session persistence | Sign in → Refresh page | Still logged in | ⬜ |

### **Onboarding**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| ONBOARD-01 | First-time user flow | Sign in → See onboarding | Repo list displayed | ⬜ |
| ONBOARD-02 | Connect repo | Click "Connect" on repo | Repo connected, redirected to dashboard | ⬜ |
| ONBOARD-03 | Search repos | Type in search box | Filtered repo list | ⬜ |
| ONBOARD-04 | No repos | User with no repos | "Create repository" CTA shown | ⬜ |

### **Dashboard Layout**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| LAYOUT-01 | Sidebar navigation | Click each nav item | Correct page loads | ⬜ |
| LAYOUT-02 | Responsive design | Resize browser to mobile | Sidebar collapses, bottom nav shows | ⬜ |
| LAYOUT-03 | Header displays | Check header | Logo, nav, user avatar visible | ⬜ |
| LAYOUT-04 | Upgrade CTA | Check sidebar | Upgrade CTA visible | ⬜ |

---

## Day 3: Core Features Testing

### **GitHub Webhook**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| WEBHOOK-01 | Merged PR webhook | Merge PR on GitHub → Check dashboard | Draft appears in <30s | ⬜ |
| WEBHOOK-02 | Non-merged PR | Close PR without merge | No draft created | ⬜ |
| WEBHOOK-03 | Invalid signature | Send fake webhook | Rejected with 401 | ⬜ |
| WEBHOOK-04 | Multiple users | Same repo, multiple users | Draft for each user | ⬜ |

### **Manual Sync**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| SYNC-01 | Manual sync button | Click "Sync Now" | Fetches last 50 merged PRs | ⬜ |
| SYNC-02 | Sync with no token | No GitHub token connected | Error message shown | ⬜ |
| SYNC-03 | Sync with connected repo | Click sync → Check drafts | New drafts appear | ⬜ |

### **Auto-Categorization**

| Test ID | Test Case | Input Labels | Expected Category | Status |
| :---- | :---- | :---- | :---- | :---- |
| CAT-01 | Feature PR | `feat`, `feature` | New | ⬜ |
| CAT-02 | Bug fix PR | `fix`, `bug` | Fixed | ⬜ |
| CAT-03 | Chore PR | `chore`, `refactor` | Improved | ⬜ |
| CAT-04 | No labels | (none) | Other | ⬜ |
| CAT-05 | Mixed labels | `feat`, `fix` | New (first match) | ⬜ |

### **Public Changelog**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| PUB-01 | View published entries | Visit `/changelog/user/repo` | Entries grouped by month | ⬜ |
| PUB-02 | No entries | Visit empty changelog | 404 page shown | ⬜ |
| PUB-03 | SEO meta tags | View page source | Title, description, OG tags present | ⬜ |
| PUB-04 | JSON-LD | View page source | Structured data present | ⬜ |
| PUB-05 | Mobile responsive | View on mobile | Clean layout, readable | ⬜ |
| PUB-06 | "Powered by GitLog" | Check footer | Badge with link visible | ⬜ |

---

## Day 4-5: Dashboard Testing

### **Draft Management**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| DRAFT-01 | View drafts list | Visit `/drafts` | All drafts shown | ⬜ |
| DRAFT-02 | Search drafts | Type in search box | Filtered results | ⬜ |
| DRAFT-03 | Filter by rewrite | Select "With AI Rewrite" | Only drafts with rewrite shown | ⬜ |
| DRAFT-04 | Edit draft | Click draft → Edit → Save | Changes saved | ⬜ |
| DRAFT-05 | Discard draft | Click discard → Confirm | Draft deleted | ⬜ |

### **AI Rewrite**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| AI-01 | Generate rewrite | Click "Rewrite" on draft | AI output appears in <5s | ⬜ |
| AI-02 | Regenerate | Click "Regenerate" | New version generated | ⬜ |
| AI-03 | Different tones | Select "professional" tone | Tone-appropriate output | ⬜ |
| AI-04 | Copy to clipboard | Click copy button | Text copied, toast shown | ⬜ |
| AI-05 | Free plan limit | 51st rewrite attempt | Error: limit reached | ⬜ |
| AI-06 | Empty PR body | PR with no description | Uses title only | ⬜ |

### **Publish Flow**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| PUB-01 | Publish draft | Click publish → Confirm | Entry published, toast shown | ⬜ |
| PUB-02 | Publish modal | Click publish | Modal appears with preview | ⬜ |
| PUB-03 | Cancel publish | Click cancel in modal | Modal closes, no action | ⬜ |
| PUB-04 | Unpublish | Click unpublish → Confirm | Entry reverted to draft | ⬜ |
| PUB-05 | Free plan limit | 51st publish attempt | Error: limit reached | ⬜ |
| PUB-06 | Success toast | After publish | Green toast with message | ⬜ |

### **Toast Notifications**

| Test ID | Test Case | Trigger | Expected Toast | Status |
| :---- | :---- | :---- | :---- | :---- |
| TOAST-01 | Success toast | Publish entry | Green, auto-dismiss 5s | ⬜ |
| TOAST-02 | Error toast | Failed API call | Red, manual dismiss | ⬜ |
| TOAST-03 | Info toast | Info action | Blue, auto-dismiss | ⬜ |
| TOAST-04 | Warning toast | Limit warning | Amber, auto-dismiss | ⬜ |
| TOAST-05 | Multiple toasts | Trigger 3 toasts | Stacked, all visible | ⬜ |

---

## Day 6: Payment Testing

### **Checkout Flow**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| PAY-01 | View upgrade page | Visit `/upgrade` | Plan comparison shown | ⬜ |
| PAY-02 | Start checkout | Click "Upgrade to Pro" | Redirected to DodoPayment | ⬜ |
| PAY-03 | Complete payment | Enter test card → Pay | Success page shown | ⬜ |
| PAY-04 | Cancel payment | Click cancel on Dodo | Cancel page shown | ⬜ |
| PAY-05 | Free plan user | Check current plan | "Current Plan" badge shown | ⬜ |

### **Webhook Testing**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| WH-01 | Payment success webhook | Trigger via CLI | User upgraded to Pro | ⬜ |
| WH-02 | Subscription cancelled | Trigger via CLI | User downgraded to Free | ⬜ |
| WH-03 | Invalid signature | Send fake webhook | Rejected with 401 | ⬜ |
| WH-04 | Missing userId | Webhook without metadata | Error logged | ⬜ |

### **Plan Limits**

| Test ID | Test Case | Steps | Expected Result | Status |
| :---- | :---- | :---- | :---- | :---- |
| LIMIT-01 | Pro user unlimited | Publish 100 entries | No limit error | ⬜ |
| LIMIT-02 | Free user limit | Publish 51st entry | Error: limit reached | ⬜ |
| LIMIT-03 | Upgrade removes limits | Upgrade to Pro → Publish | No limit error | ⬜ |
| LIMIT-04 | Downgrade restores limits | Cancel → Try to publish | Limit enforced | ⬜ |

---

## End-to-End User Flows

### **Flow 1: First-Time User (Happy Path)**

```
1. Visit gitlog.app
2. Click "Sign in with GitHub"
3. Authorize GitLog
4. Complete onboarding (connect repo)
5. Merge PR on GitHub
6. Wait 30 seconds
7. See draft in dashboard
8. Click "Rewrite with AI"
9. Review AI output
10. Click "Publish"
11. Confirm in modal
12. See success toast
13. Visit public changelog
14. Verify entry visible
```

**Expected Time:** <5 minutes  
**Success Criteria:** Entry published and visible on public changelog

---

### **Flow 2: Returning User (Regular Use)**

```
1. Visit gitlog.app (auto-login)
2. See 3 new drafts on dashboard
3. Click first draft
4. Click "Regenerate" (professional tone)
5. Edit AI output slightly
6. Click "Publish"
7. Repeat for other 2 drafts
8. Visit `/drafts` to verify all published
```

**Expected Time:** <3 minutes  
**Success Criteria:** All 3 drafts published successfully

---

### **Flow 3: Free → Pro Upgrade**

```
1. Hit free plan limit (50 entries)
2. See upgrade modal
3. Click "Upgrade to Pro"
4. Complete DodoPayment checkout
5. See success page
6. Return to dashboard
7. Verify Pro features unlocked
8. Publish 51st entry (no limit error)
```

**Expected Time:** <5 minutes  
**Success Criteria:** User upgraded, can publish unlimited

---

### **Flow 4: Public Changelog View**

```
1. User shares changelog URL
2. Visitor opens link
3. Sees beautiful changelog page
4. Entries grouped by month
5. Category badges visible
6. Click PR link → Opens GitHub
7. Scroll to bottom → See "Powered by GitLog"
```

**Expected Time:** <1 minute  
**Success Criteria:** Clean, professional changelog visible

---

## Performance Testing

### **Page Load Times**

| Page | Target | Acceptable | Critical |
| :---- | :---- | :---- | :---- |
| Homepage | <1s | <2s | <3s |
| Dashboard | <1.5s | <2.5s | <4s |
| Drafts list | <1s | <2s | <3s |
| Public changelog | <2s | <3s | <5s |
| Upgrade page | <1s | <2s | <3s |

### **API Response Times**

| Endpoint | Target | Acceptable | Critical |
| :---- | :---- | :---- | :---- |
| POST /api/github/sync | <5s | <10s | <30s |
| POST /api/ai/rewrite | <5s | <10s | <30s |
| POST /api/entries/publish | <1s | <2s | <5s |
| GET /api/drafts | <500ms | <1s | <2s |

### **Lighthouse Targets**

| Metric | Target | Pass |
| :---- | :---- | :---- |
| Performance | >90 | >80 |
| Accessibility | >90 | >80 |
| Best Practices | >90 | >80 |
| SEO | >90 | >80 |
| PWA | N/A | N/A |

### **Load Testing**

| Test | Users | Duration | Target |
| :---- | :---- | :---- | :---- |
| Smoke test | 10 | 1 min | No errors |
| Load test | 100 | 5 min | <2s response |
| Stress test | 500 | 10 min | No crashes |

---

## Security Testing

### **Authentication**

| Test ID | Test Case | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| SEC-01 | Access protected route without auth | Redirect to sign-in | ⬜ |
| SEC-02 | Access another user's draft | 403 Forbidden | ⬜ |
| SEC-03 | CSRF attack attempt | Rejected | ⬜ |
| SEC-04 | Session hijacking attempt | Invalid session | ⬜ |

### **API Security**

| Test ID | Test Case | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| API-01 | SQL injection in API | Rejected, logged | ⬜ |
| API-02 | XSS in draft title | Sanitized | ⬜ |
| API-03 | Rate limit exceeded | 429 Too Many Requests | ⬜ |
| API-04 | Invalid webhook signature | 401 Unauthorized | ⬜ |

### **Data Protection**

| Test ID | Test Case | Expected Result | Status |
| :---- | :---- | :---- | :---- |
| DATA-01 | GitHub token in logs | Not logged | ⬜ |
| DATA-02 | Token in client code | Not exposed | ⬜ |
| DATA-03 | Database encryption | Encrypted at rest | ⬜ |
| DATA-04 | HTTPS enforced | All traffic HTTPS | ⬜ |

---

## Bug Tracking Template

### **Bug Report Template**

```markdown
## Bug Title

**ID:** BUG-001  
**Severity:** Critical / High / Medium / Low  
**Priority:** P0 / P1 / P2 / P3  

### Description
Clear description of the bug

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Result
What should happen

### Actual Result
What actually happens

### Environment
- OS: macOS / Windows / Linux
- Browser: Chrome / Firefox / Safari
- URL: https://...

### Screenshots/Logs
Attach if applicable

### Proposed Fix
If known
```

### **Bug Priority Definitions**

| Priority | Definition | Response Time |
| :---- | :---- | :---- |
| **P0** | Critical, blocks launch | Immediate |
| **P1** | High, major feature broken | 24 hours |
| **P2** | Medium, minor feature broken | 1 week |
| **P3** | Low, cosmetic/enhancement | Next sprint |

---

## Launch Readiness Checklist

### **Must Have (P0)**

- [ ] All P0 bugs fixed
- [ ] Authentication working
- [ ] GitHub webhook working
- [ ] AI rewrite working
- [ ] Publish flow working
- [ ] Public changelog working
- [ ] Payment flow working
- [ ] Webhooks processing correctly
- [ ] No critical security issues
- [ ] No data loss scenarios

### **Should Have (P1)**

- [ ] All P1 bugs fixed
- [ ] Toast notifications working
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] JSON-LD structured data
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured

### **Nice to Have (P2/P3)**

- [ ] 80%+ P2 bugs fixed
- [ ] Analytics configured
- [ ] Error logging configured
- [ ] Performance >90 Lighthouse
- [ ] Accessibility >90
- [ ] Documentation complete
- [ ] Launch posts drafted

### **Pre-Launch**

- [ ] Domain configured (gitlog.app)
- [ ] SSL certificate active
- [ ] Environment variables set in Vercel
- [ ] Database backups configured
- [ ] Error monitoring configured (Axiom/Sentry)
- [ ] Email configured (Resend)
- [ ] Social media accounts created
- [ ] Privacy policy published
- [ ] Terms of service published

### **Launch Day**

- [ ] Final smoke test passed
- [ ] Team notified
- [ ] Social posts scheduled
- [ ] Product Hunt submission ready
- [ ] Indie Hackers post ready
- [ ] Reddit posts ready
- [ ] Twitter thread drafted
- [ ] Demo video recorded
- [ ] Support email monitored

---

## Testing Tools & Resources

### **Manual Testing**
- Chrome DevTools
- Firefox Developer Edition
- Safari Web Inspector
- Mobile devices (iPhone, Android)

### **Automated Testing**
```bash
# Install Playwright for E2E
npm install -D @playwright/test

# Install Lighthouse for performance
npm install -D lighthouse

# Install axe-core for accessibility
npm install -D axe-core
```

### **Performance Testing**
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

### **Security Testing**
- [OWASP ZAP](https://www.zaproxy.org/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

---

## Sign-Off

### **Testing Completed By**

| Role | Name | Date | Signature |
| :---- | :---- | :---- | :---- |
| **QA Lead** | | | |
| **Developer** | | | |
| **Product Owner** | | | |

### **Launch Approval**

- [ ] All P0 bugs fixed
- [ ] All P1 bugs fixed or documented
- [ ] Performance targets met
- [ ] Security review passed
- [ ] Ready to launch

**Launch Date:** _______________  
**Approved By:** _______________

---

*Last Updated: 2026-03-08*  
*Version: 1.0*
