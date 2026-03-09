# GitLog Tech Stack Summary

**Last Updated:** 2026-03-08  
**Version:** 3.0 (India-Optimized)

---

## 🎯 Final Stack Decisions

| Layer | Technology | Purpose | Cost (500 users) |
| :---- | :---- | :---- | :---- |
| **Framework** | Next.js 15 | App Router, Server Actions | Free |
| **Hosting** | Vercel | Edge network + Mumbai region | Free |
| **Auth** | Clerk | GitHub OAuth, sessions | Free (10K MAU) |
| **Database** | Vercel KV | Redis key-value store | Free (20K/day) |
| **AI** | Google Gemini Flash | PR rewrites, copy generation | ~$0.075/mo |
| **Payments** | DodoPayment | India + Intl, UPI, INR payouts | 2-3% per transaction |
| **Styling** | Tailwind + Shadcn/ui | Component library | Free |
| **Analytics** | Vercel Analytics | Privacy-first tracking | Free |
| **GitHub** | Octokit | Official GitHub SDK | Free |

---

## 💰 Cost Breakdown

### Fixed Monthly Costs

| Service | Free Tier | Paid Tier (500 users) |
| :---- | :---- | :---- |
| Vercel | Free | Free |
| Vercel KV | 20K commands/day | Free |
| Clerk | 10K MAU | Free |
| Google Gemini | 1M tokens/min | ~$0.075 |
| **Total Fixed** | **$0** | **~$0.075/mo** |

### Variable Costs (Payment Processing)

| Scenario | Revenue | DodoPayment Fee | You Receive |
| :---- | :---- | :---- | :---- |
| **50 India customers** | ₹24,950 | ~₹624 (2.5%) | ₹24,326 |
| **50 US customers** | $950 | ~$33 (3.5%) | $917 |
| **Mixed (50/50)** | ~₹1.2L | ~₹3,100 | ~₹1.17L |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     GitLog Architecture                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐     ┌──────────┐     ┌──────────────┐    │
│  │  GitHub  │────▶│  Clerk   │────▶│  Next.js 15  │    │
│  │  OAuth   │     │   Auth   │     │  (Vercel)    │    │
│  └──────────┘     └──────────┘     └──────┬───────┘    │
│                                           │              │
│                    ┌──────────────────────┼───────┐     │
│                    │                      │       │     │
│                    ▼                      ▼       ▼     │
│             ┌────────────┐         ┌─────────┐ ┌──────┐│
│             │  Vercel KV │         │ Gemini  │ │Dodo  ││
│             │  (Redis)   │         │   AI    │ │Payment││
│             └────────────┘         └─────────┘ └──────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User signs in** → Clerk creates session, stores GitHub token
2. **Connect repo** → Save to Vercel KV (`repo:${userId}:${repoId}`)
3. **Merge PR** → GitHub webhook → `/api/github/sync`
4. **Store draft** → Vercel KV (`entry:${userId}:${repoId}:${prId}`)
5. **AI rewrite** → Google Gemini Flash API → Store result
6. **Publish** → Update status, regenerate public page
7. **Upgrade** → DodoPayment checkout → Webhook → Update plan

---

## 🔐 Environment Variables

```env
# ============ Auth ============
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# ============ Database ============
VERCEL_KV_REST_API_URL=https://...
VERCEL_KV_REST_API_TOKEN=...

# ============ AI ============
GOOGLE_GENERATIVE_AI_API_KEY=...

# ============ Payments ============
DODOPAYMENT_API_KEY=live_...
DODOPAYMENT_WEBHOOK_SECRET=whsec_...
DODOPAYMENT_PRO_PLAN_ID=plan_...
NEXT_PUBLIC_DODOPAYMENT_KEY=pk_live_...

# ============ GitHub ============
GITHUB_WEBHOOK_SECRET=whsec_...

# ============ App ============
NEXT_PUBLIC_APP_URL=https://gitlog.app
```

---

## 💳 DodoPayment Integration

### Setup Steps

1. **Create Account**
   - Go to [dodopayment.com](https://dodopayment.com)
   - Complete KYC (PAN, Aadhaar, Business proof)
   - Wait for verification (1-2 days)

2. **Create Products**
   ```
   Free Plan:
   - Name: GitLog Free
   - Price: ₹0 / $0
   - Type: Free tier

   Pro Plan (India):
   - Name: GitLog Pro
   - Price: ₹499/month
   - Type: Subscription

   Pro Plan (International):
   - Name: GitLog Pro International
   - Price: $19/month
   - Type: Subscription
   ```

3. **Configure Geo-Pricing**
   - Enable multi-currency
   - Set India → INR (₹499)
   - Set International → USD ($19)
   - DodoPayment auto-detects card origin

4. **Webhook Events to Listen**
   - `payment.success`
   - `subscription.renewed`
   - `subscription.cancelled`
   - `subscription.failed`

### Webhook Handler Example

```typescript
// /api/payment/webhook
import { DodoPayment } from '@dodopayment/node';
import { kv } from '@vercel/kv';

const dodo = new DodoPayment(process.env.DODOPAYMENT_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('dodo-signature');

  // Verify webhook signature
  const event = dodo.webhooks.constructEvent(body, signature);

  switch (event.type) {
    case 'payment.success':
      const userId = event.data.metadata.userId;
      await kv.set(`user:${userId}:plan`, 'pro');
      break;

    case 'subscription.cancelled':
      const cancelledUserId = event.data.metadata.userId;
      await kv.set(`user:${cancelledUserId}:plan`, 'free');
      break;
  }

  return new Response('OK', { status: 200 });
}
```

---

## 🤖 Google Gemini Integration

### Setup Steps

1. **Get API Key**
   - Go to [Google AI Studio](https://aistudio.google.com)
   - Sign in with Google account
   - Create new API key
   - Copy to env vars

2. **Install SDK**
   ```bash
   npm install @google/generative-ai
   ```

3. **Create AI Helper**
   ```typescript
   // lib/gemini.ts
   import { GoogleGenerativeAI } from '@google/generative-ai';

   const genAI = new GoogleGenerativeAI(
     process.env.GOOGLE_GENERATIVE_AI_API_KEY
   );

   const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

   export async function rewritePR(title: string, body: string, labels: string[]) {
     const prompt = `
       You are rewriting a GitHub PR description into plain English for a changelog.

       Rules:
       - Use 2-3 sentences maximum
       - Write for non-technical users
       - Focus on what changed for the USER, not the code
       - Use active voice: "Added X" not "X was added"
       - Omit technical details (dependencies, refactors, tests)
       - If PR body is empty, use title only

       PR Title: ${title}
       PR Labels: ${labels.join(', ')}
       PR Body: ${body || 'No description'}

       Rewrite:
     `;

     const result = await model.generateContent(prompt);
     return result.response.text().trim();
   }
   ```

### Cost Calculation

**Assumptions:**
- 500 active users
- 10 rewrites/user/month
- 200 tokens/rewrite (input + output)

**Total:** 500 × 10 × 200 = 1,000,000 tokens/month

**Gemini Flash Pricing:**
- Input: $0.075 / 1M tokens
- Output: $0.30 / 1M tokens
- **Estimated:** ~$0.15/mo for 1M tokens

---

## 📊 Database Schema (Vercel KV)

```typescript
// User Configuration
kv.set(`user:${userId}`, {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  dodoCustomerId?: string;
  githubToken: string;
  createdAt: Date;
  location: 'in' | 'intl'; // For pricing
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

// Monthly Usage Counter (for free plan limits)
kv.set(`usage:${userId}:${YYYY-MM}`, {
  entriesPublished: number;
  aiRewrites: number;
  month: string; // "2026-03"
});
```

---

## 🚀 API Endpoints

| Endpoint | Method | Auth | Description |
| :---- | :---- | :---- | :---- |
| `/api/github/sync` | POST | GitHub webhook | Receives PR merge events |
| `/api/github/repos` | GET | User session | Lists user's GitHub repos |
| `/api/ai/rewrite` | POST | User session | Calls Gemini, returns rewrite |
| `/api/entries/publish` | POST | User session | Publishes a draft entry |
| `/api/entries/unpublish` | POST | User session | Reverts published to draft |
| `/api/payment/checkout` | POST | User session | Creates DodoPayment session |
| `/api/payment/webhook` | POST | Dodo signature | Handles payment events |
| `/api/usage/check` | GET | User session | Checks monthly usage limits |

---

## 🎨 Pricing Strategy

### Geo-Based Pricing

| Country | Free Plan | Pro Plan |
| :---- | :---- | :---- |
| **India** | ₹0/mo | ₹499/mo |
| **USA** | $0/mo | $19/mo |
| **UK** | £0/mo | £15/mo |
| **EU** | €0/mo | €17/mo |
| **Others** | $0/mo | $19/mo |

**Implementation:**
- DodoPayment detects card country
- Shows appropriate currency automatically
- Store user location in KV for future checkouts

### Free Plan Limits

| Feature | Free | Pro |
| :---- | :---- | :---- |
| Entries/month | 50 | Unlimited |
| Connected repos | 1 | Unlimited |
| AI rewrites/month | 50 | Unlimited |
| Public changelog | ✅ | ✅ |
| Remove branding | ❌ | ✅ |
| Priority support | ❌ | ✅ |

---

## 📈 Scaling Plan

### At 500 Users
- **Vercel KV:** Still free (20K commands/day)
- **Gemini:** ~$0.15/mo
- **Total:** ~$0.15/mo fixed + payment fees

### At 2,000 Users
- **Vercel KV:** Upgrade to paid ($15/mo)
- **Clerk:** Still free (10K MAU)
- **Gemini:** ~$0.60/mo
- **Total:** ~$16/mo fixed + payment fees

### At 10,000 Users
- **Migrate KV → Supabase** (better querying)
- **Clerk:** Paid plan ($25/mo)
- **Add caching layer** (Redis Cloud)
- **Total:** ~$100/mo fixed + payment fees

---

## 🔒 Security Checklist

- [ ] GitHub tokens encrypted at rest
- [ ] DodoPayment webhook signature verification
- [ ] Clerk session validation on all protected routes
- [ ] Rate limiting on AI endpoint (50/month free)
- [ ] No sensitive data in client-side logs
- [ ] CORS configured for production domain only
- [ ] HTTPS enforced (Vercel default)

---

## 🛠️ Development Workflow

### Local Setup
```bash
# Clone repo
git clone https://github.com/your-org/gitlog-app

# Install dependencies
npm install

# Copy env vars
cp .env.example .env.local

# Run dev server
npm run dev

# Forward webhooks (for local testing)
dodo listen --forward localhost:3000/api/payment/webhook
```

### Deployment
```bash
# Push to main
git push origin main

# Vercel auto-deploys
# Check deployment status at vercel.com/dashboard
```

---

## 📞 Support Resources

| Service | Docs | Support |
| :---- | :---- | :---- |
| **Next.js** | nextjs.org/docs | GitHub Issues |
| **Vercel** | vercel.com/docs | support@vercel.com |
| **Clerk** | clerk.com/docs | Discord community |
| **DodoPayment** | dodopayment.com/docs | support@dodopayment.com |
| **Google AI** | ai.google.dev | Stack Overflow |
| **Vercel KV** | vercel.com/docs/kv | GitHub Issues |

---

*This document is living. Update as stack evolves.*
