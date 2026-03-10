# GitLog Support Kit

**Version:** 1.0  
**Last Updated:** 2026-03-08  
**Status:** Ready for Launch

---

## 📋 Table of Contents

1. [Support Channels](#support-channels)
2. [Response Templates](#response-templates)
3. [FAQ](#faq)
4. [Troubleshooting Guide](#troubleshooting-guide)
5. [Bug Triage](#bug-triage)
6. [Feedback Collection](#feedback-collection)
7. [Documentation](#documentation)

---

## 📞 Support Channels

### **Primary Channels**

| Channel           | URL                         | Response Time |
| :---------------- | :-------------------------- | :------------ |
| **Email**         | hello@gitlog.app            | <24 hours     |
| **Twitter**       | @gitlogapp                  | <4 hours      |
| **GitHub Issues** | github.com/gitlogapp/gitlog | <48 hours     |

### **Secondary Channels**

| Channel                  | Purpose           | Monitoring        |
| :----------------------- | :---------------- | :---------------- |
| **Discord** (future)     | Community support | Community-managed |
| **Intercom** (future)    | In-app chat       | <1 hour           |
| **Status Page** (future) | System status     | Real-time         |

### **Support Hours**

- **Standard:** Mon-Fri, 9 AM - 6 PM IST
- **Emergency:** 24/7 for critical issues (payment, data loss)
- **Weekend:** Limited monitoring

---

## 📧 Response Templates

### **General Inquiry**

**Subject:** Re: [Their subject]

```
Hi [Name],

Thanks for reaching out to GitLog!

[Answer their question]

Let me know if you have any other questions!

Best,
[Your Name]
Founder, GitLog
```

---

### **Technical Issue**

**Subject:** Re: [Issue description]

```
Hi [Name],

Thanks for reporting this! I'm sorry you're running into this issue.

To help me investigate, could you share:

1. Your browser and version
2. Any error messages you see
3. Steps to reproduce the issue

In the meantime, you can try:
- Clearing your browser cache
- Trying in an incognito window
- Checking if you're on the latest version

I'll keep an eye out for your reply and get this fixed ASAP!

Best,
[Your Name]
Founder, GitLog
```

---

### **Bug Confirmation**

**Subject:** Re: [Bug description]

```
Hi [Name],

Thanks for the detailed report! I was able to reproduce this issue.

This is a bug on our end, and I'm working on a fix now. I'll update you as soon as it's resolved.

As a thank you for reporting this, I've added a free month of Pro to your account.

Best,
[Your Name]
Founder, GitLog
```

---

### **Feature Request**

**Subject:** Re: [Feature request]

```
Hi [Name],

Thanks for the suggestion! I love this idea.

I've added it to our feature request board here: [Link]

You can track progress and upvote it here: [Link]

While I can't commit to a timeline yet, this is exactly the kind of feedback that helps shape GitLog's roadmap.

Best,
[Your Name]
Founder, GitLog
```

---

### **Billing Issue**

**Subject:** Re: [Billing question]

```
Hi [Name],

Thanks for reaching out about your billing.

[Answer their specific question]

If you need anything else, just reply to this email!

Best,
[Your Name]
Founder, GitLog
```

---

### **Refund Request**

**Subject:** Re: Refund request

```
Hi [Name],

I'm sorry to hear GitLog isn't working out for you.

I've processed your refund. You should see it in your account within 5-10 business days.

If you're open to sharing, what led to your decision to cancel? Any feedback helps me improve GitLog for other users.

Either way, I wish you the best with your projects!

Best,
[Your Name]
Founder, GitLog
```

---

### **Downtime/Apology**

**Subject:** Re: [Issue report]

```
Hi [Name],

I'm so sorry for the disruption you experienced with GitLog today.

[Explain what happened in simple terms]

Here's what I'm doing to prevent this from happening again:

[Steps being taken]

As an apology, I've added a free month of Pro to your account.

Thanks for your patience and understanding!

Best,
[Your Name]
Founder, GitLog
```

---

## ❓ FAQ

### **General**

**Q: What is GitLog?**

A: GitLog auto-generates changelogs from your GitHub PRs. Merge a PR, and it appears on your public changelog in 30 seconds. Zero manual writing required.

---

**Q: Is GitLog free?**

A: Yes! GitLog has a generous free plan:

- 50 changelog entries per month
- 1 connected repository
- 50 AI rewrites per month
- Public changelog page

Pro plan (₹499/mo or $19/mo) includes:

- Unlimited entries
- Unlimited repositories
- Unlimited AI rewrites
- Remove GitLog branding
- Priority support

---

**Q: How does the AI rewrite work?**

A: GitLog reads your PR title, description, and labels, then uses Google's Gemini AI to rewrite it into plain English that non-technical users can understand.

Example:

- **PR:** "feat: add dark mode toggle using Tailwind dark: classes"
- **Rewrite:** "Added dark mode toggle in settings. Users can now switch between light and dark themes with one click."

---

**Q: Can I edit the AI output?**

A: Absolutely! Every entry starts as a draft. You can edit the AI rewrite, change the category, or write from scratch before publishing.

---

### **Technical**

**Q: Does GitLog work with private repositories?**

A: Yes! GitLog supports both public and private GitHub repositories. Only entries you choose to publish become public.

---

**Q: How do I connect my GitHub repo?**

A: After signing in:

1. Click "Connect Repository"
2. Select your repo from the list
3. GitLog will automatically create a webhook
4. That's it! Merged PRs will appear as drafts

---

**Q: What GitHub permissions does GitLog need?**

A: GitLog requests:

- **Read access** to your repositories (to fetch PRs)
- **Write access** to webhooks (to auto-sync merges)

We never modify your code or repositories.

---

**Q: My PRs aren't syncing. What should I do?**

A: Try these steps:

1. Check that the webhook was created in your repo settings
2. Click "Sync Now" in your dashboard
3. Make sure the PR was actually merged (not just closed)
4. Check that labels match our supported categories (feat, fix, chore, etc.)

If still not working, email hello@gitlog.app with your repo name.

---

**Q: Can I use GitLog with multiple repos?**

A: Yes! Pro users can connect unlimited repositories. Free users can connect 1 repository.

---

### **Billing**

**Q: What payment methods do you accept?**

A: We accept:

- All major credit/debit cards (Visa, Mastercard, Amex)
- UPI (for Indian users)
- International cards

Payments are processed securely by DodoPayment.

---

**Q: Can I cancel anytime?**

A: Yes! You can cancel your subscription anytime from your dashboard. You'll continue to have Pro access until the end of your billing period.

---

**Q: Do you offer refunds?**

A: Yes! We offer a 14-day money-back guarantee. If you're not satisfied, email hello@gitlog.app within 14 days of purchase.

---

**Q: Is there a discount for open source projects?**

A: Yes! Popular open source projects (100+ stars) get Pro for free. Email hello@gitlog.app with your repo link.

---

**Q: What happens if I hit the free plan limit?**

A: You'll see an upgrade prompt. Your existing entries stay published, but you can't publish new entries until:

- You upgrade to Pro, or
- The next month begins (limits reset monthly)

---

### **Security**

**Q: Is my code secure with GitLog?**

A: Yes! We take security seriously:

- GitHub tokens are encrypted at rest
- We never store your actual code, only PR metadata
- All data is transmitted over HTTPS
- We never sell or share your data

---

**Q: Where is my data stored?**

A: All data is stored on Vercel's infrastructure (SOC 2 compliant) with Vercel KV (Redis). Servers are located in [region].

---

**Q: Do you back up my data?**

A: Yes! We perform daily backups of all user data. In the unlikely event of data loss, we can restore from backups.

---

## 🔧 Troubleshooting Guide

### **Authentication Issues**

**Problem:** Can't sign in with GitHub

**Solutions:**

1. Clear browser cache and cookies
2. Try in an incognito window
3. Make sure pop-ups aren't blocked
4. Check that your GitHub account is in good standing
5. Try a different browser

**Still not working?** Email hello@gitlog.app

---

**Problem:** Signed in but redirected to sign-in page

**Solutions:**

1. Check that cookies are enabled
2. Try a different browser
3. Disable ad blockers temporarily
4. Check browser console for errors (F12)

---

### **GitHub Integration Issues**

**Problem:** Can't connect repository

**Solutions:**

1. Make sure you're the repo owner or have admin access
2. Check that the repo isn't archived
3. Try disconnecting and reconnecting your GitHub account in Clerk settings
4. Make sure you have at least one repo on GitHub

---

**Problem:** PRs not appearing after merge

**Solutions:**

1. Check webhook was created: Repo Settings → Webhooks
2. Click "Sync Now" in dashboard
3. Make sure PR was merged (not just closed)
4. Check webhook delivery logs in GitHub settings
5. Try disconnecting and reconnecting the repo

---

**Problem:** Webhook errors in GitHub

**Solutions:**

1. Check webhook URL is correct: `https://gitlog.app/api/github/sync`
2. Verify webhook secret matches in your env vars
3. Check webhook delivery logs for error codes
4. Try deleting and recreating the webhook

---

### **AI Rewrite Issues**

**Problem:** AI rewrite not generating

**Solutions:**

1. Check that your PR has a title (required)
2. Try clicking "Regenerate"
3. Check if you've hit free plan limit (50 rewrites/month)
4. Try with a different PR

---

**Problem:** AI output is gibberish

**Solutions:**

1. This is rare—usually caused by very technical PR descriptions
2. Try editing the PR description to be more user-focused
3. Use the "Regenerate" button with a different tone
4. Edit the output manually before publishing

---

### **Publishing Issues**

**Problem:** Can't publish entry

**Solutions:**

1. Check if you've hit free plan limit (50 entries/month)
2. Make sure the entry has a title
3. Try refreshing the page
4. Try in a different browser

---

**Problem:** Published entry not showing on public page

**Solutions:**

1. Refresh the public page (Ctrl/Cmd + Shift + R for hard refresh)
2. Check that the entry status is "published" (not draft)
3. Wait 30 seconds (cache may take a moment to update)
4. Check the public URL is correct: `gitlog.app/[username]/[repo]`

---

### **Payment Issues**

**Problem:** Payment failed

**Solutions:**

1. Check card details are correct
2. Verify card has sufficient funds
3. Try a different card
4. Contact your bank (some banks block international transactions)
5. Try UPI if you're in India

---

**Problem:** Upgraded but still showing Free plan

**Solutions:**

1. Sign out and sign back in
2. Check your email for payment confirmation
3. Wait 5 minutes (webhook may be delayed)
4. Email hello@gitlog.app with payment receipt

---

**Problem:** Want to cancel subscription

**Solutions:**

1. Go to Dashboard → Settings → Billing
2. Click "Cancel Subscription"
3. Confirm cancellation
4. You'll retain Pro access until end of billing period

Can't find the cancel button? Email hello@gitlog.app and I'll cancel it for you.

---

## 🐛 Bug Triage

### **Severity Levels**

| Level        | Definition                                  | Response Time | Examples                                    |
| :----------- | :------------------------------------------ | :------------ | :------------------------------------------ |
| **Critical** | Data loss, security breach, complete outage | Immediate     | All users can't sign in, data deleted       |
| **High**     | Major feature broken, no workaround         | 4 hours       | Can't publish entries, webhooks not working |
| **Medium**   | Minor feature broken, workaround exists     | 24 hours      | AI rewrite slow, UI glitch                  |
| **Low**      | Cosmetic, enhancement                       | 1 week        | Typos, color issues, feature request        |

### **Bug Response Workflow**

```
1. User reports bug
   ↓
2. Acknowledge receipt (<1 hour)
   ↓
3. Reproduce bug
   ↓
4. Assign severity level
   ↓
5. Fix or workaround
   ↓
6. Deploy fix
   ↓
7. Follow up with user
   ↓
8. Document in changelog
```

### **Bug Report Template**

```markdown
## Bug Description

[Clear description]

## Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3

## Expected Result

[What should happen]

## Actual Result

[What actually happens]

## Environment

- Browser: [Chrome/Firefox/Safari]
- OS: [macOS/Windows/Linux]
- URL: [https://...]

## Screenshots/Logs

[Attach if applicable]
```

---

## 💬 Feedback Collection

### **In-App Feedback**

**Trigger:** After publishing first entry

```
 Loving GitLog so far?

 [⭐⭐⭐⭐⭐] Yes, love it!
 [⭐⭐⭐] It's okay
 [⭐] Not happy

[Optional] What could be better?
[_____________________________]

[Submit] [No thanks]
```

### **Post-Cancellation Survey**

**Email:** Sent 1 day after cancellation

```
Subject: Quick question about your cancellation

Hi [Name],

I noticed you cancelled your GitLog subscription. I'm always looking to improve, so I'd love to know:

What was the main reason you cancelled?

[ ] Too expensive
[ ] Didn't use it enough
[ ] Missing features I needed
[ ] Found a better alternative
[ ] Other: [_______]

Any other feedback?
[_____________________]

[Submit]

Thanks for giving GitLog a try!

— [Your Name]
```

### **NPS Survey**

**Trigger:** 30 days after signup

```
How likely are you to recommend GitLog to a friend or colleague?

[0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
Not at all likely ← → Extremely likely

[Submit]
```

---

## 📚 Documentation

### **User Documentation**

| Guide              | URL                   | Status     |
| :----------------- | :-------------------- | :--------- |
| Getting Started    | /docs/getting-started | ✅         |
| Connecting GitHub  | /docs/github-setup    | ✅         |
| Writing Changelogs | /docs/best-practices  | ✅         |
| Billing & Plans    | /docs/billing         | ✅         |
| API Reference      | /docs/api             | ⏳ Phase 2 |

### **Developer Documentation**

| Guide              | URL              | Status     |
| :----------------- | :--------------- | :--------- |
| Webhook Events     | /docs/webhooks   | ✅         |
| API Authentication | /docs/api/auth   | ⏳         |
| Rate Limits        | /docs/api/limits | ⏳         |
| SDK/Libraries      | /docs/sdks       | ⏳ Phase 2 |

### **Internal Documentation**

| Document              | Location | Status |
| :-------------------- | :------- | :----- |
| On-call rotation      | Notion   | ⏳     |
| Escalation procedures | Notion   | ⏳     |
| Known issues          | Notion   | ✅     |
| Feature roadmap       | Notion   | ✅     |

---

## 📊 Support Metrics

### **Response Time Targets**

| Channel       | Target    | Actual (Week 1) |
| :------------ | :-------- | :-------------- |
| Email         | <24 hours | \_\_\_          |
| Twitter       | <4 hours  | \_\_\_          |
| GitHub Issues | <48 hours | \_\_\_          |

### **Satisfaction Targets**

| Metric              | Target    | Actual |
| :------------------ | :-------- | :----- |
| CSAT                | >90%      | \_\_\_ |
| NPS                 | >50       | \_\_\_ |
| First Response Time | <4 hours  | \_\_\_ |
| Resolution Time     | <24 hours | \_\_\_ |

---

## 🎯 Support Team Goals

### **Week 1**

- [ ] Respond to all inquiries within 24 hours
- [ ] Document top 5 issues in FAQ
- [ ] Set up email templates
- [ ] Create GitHub Issues template

### **Month 1**

- [ ] Achieve 90%+ CSAT
- [ ] Reduce response time to <12 hours
- [ ] Create video tutorials (3 videos)
- [ ] Hire first support contractor (if needed)

### **Month 3**

- [ ] Implement Intercom for in-app chat
- [ ] Create community forum
- [ ] Achieve <4 hour response time
- [ ] Self-service knowledge base (20+ articles)

---

_Last Updated: 2026-03-08_  
_Version: 1.0_
