# GitLog Dashboard Build Plan

**Version:** 1.0  
**Last Updated:** 2026-03-08  
**Status:** Ready to Build  
**Target:** 8 Days to MVP

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Phase 1: Foundation (Day 1-2)](#phase-1-foundation)
3. [Phase 2: Core Features (Day 3-5)](#phase-2-core-features)
4. [Phase 3: Payments + Polish (Day 6-8)](#phase-3-payments--polish)
5. [Task Status Tracker](#task-status-tracker)
6. [Code Standards](#code-standards)

---

## 🏗️ Project Structure

```
gitlog-app/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── drafts/
│   │   ├── published/
│   │   └── settings/
│   ├── (public)/
│   │   └── changelog/
│   ├── (marketing)/
│   │   └── page.tsx (landing page)
│   ├── api/
│   │   ├── github/
│   │   ├── ai/
│   │   ├── entries/
│   │   └── payment/
│   ├── layout.tsx
│   └── globals.css
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── drafts/
│   ├── published/
│   ├── settings/
│   ├── changelog/
│   └── payment/
├── shared/
│   ├── components/
│   │   ├── ui/ (shadcn)
│   │   ├── layout/
│   │   └── common/
│   ├── lib/
│   │   ├── db/
│   │   ├── github/
│   │   ├── ai/
│   │   └── utils/
│   ├── hooks/
│   └── config/
├── middleware.ts
└── types/
```

---

## 📅 Phase 1: Foundation (Day 1-2)

### Day 1: Project Setup

#### Task 1.1: Initialize Next.js Project

```bash
npx create-next-app@latest gitlog-app --typescript --tailwind --app
cd gitlog-app
```

**Acceptance Criteria:**

- [ ] Next.js 15 with App Router
- [ ] TypeScript configured
- [ ] Tailwind CSS setup
- [ ] ESLint + Prettier configured

**Files to Create:**

- [ ] `tsconfig.json` (verify paths)
- [ ] `tailwind.config.ts` (extend theme)
- [ ] `.eslintrc.json`
- [ ] `.prettierrc`

---

#### Task 1.2: Install Shadcn/ui

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog avatar dropdown-menu badge tabs separator skeleton toast
```

**Acceptance Criteria:**

- [ ] Shadcn components in `shared/components/ui/`
- [ ] Theme configured (dark mode default)
- [ ] Components exportable via `index.ts`

**Files to Create:**

- [ ] `shared/components/ui/index.ts` (barrel exports)
- [ ] `shared/components/ui/button.tsx`
- [ ] `shared/components/ui/card.tsx`
- [ ] ... (all installed components)

---

#### Task 1.3: Install Core Dependencies

```bash
# Auth
npm install @clerk/nextjs

# GitHub
npm install octokit @octokit/webhooks

# Database
npm install @vercel/kv

# AI
npm install @google/generative-ai

# Payments
npm install @dodopayment/node

# Utilities
npm install lucide-react clsx tailwind-merge
npm install -D @types/node
```

**Acceptance Criteria:**

- [ ] All packages installed
- [ ] `package.json` updated
- [ ] Dependencies documented in README

---

#### Task 1.4: Set Up Project Structure

**Folders to Create:**

```bash
mkdir -p app/\(auth\)/sign-in
mkdir -p app/\(auth\)/sign-up
mkdir -p app/\(dashboard\)/dashboard
mkdir -p app/\(dashboard\)/drafts/\[id\]
mkdir -p app/\(dashboard\)/published
mkdir -p app/\(dashboard\)/settings
mkdir -p app/\(public\)/changelog/\[username\]/\[repo\]
mkdir -p app/api/github/sync
mkdir -p app/api/github/repos
mkdir -p app/api/ai/rewrite
mkdir -p app/api/entries/publish
mkdir -p app/api/entries/unpublish
mkdir -p app/api/payment/checkout
mkdir -p app/api/payment/webhook
mkdir -p features/auth
mkdir -p features/dashboard
mkdir -p features/drafts
mkdir -p features/published
mkdir -p features/settings
mkdir -p features/changelog
mkdir -p features/payment
mkdir -p shared/components/layout
mkdir -p shared/components/common
mkdir -p shared/lib/db
mkdir -p shared/lib/github
mkdir -p shared/lib/ai
mkdir -p shared/lib/utils
mkdir -p shared/hooks
mkdir -p shared/config
mkdir -p types
```

**Acceptance Criteria:**

- [ ] All folders created
- [ ] `.gitkeep` files added
- [ ] Structure matches architecture doc

---

#### Task 1.5: Configure Environment Variables

**File:** `.env.example`

```env
# Auth
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

# Database
VERCEL_KV_REST_API_URL=
VERCEL_KV_REST_API_TOKEN=

# AI
GOOGLE_GENERATIVE_AI_API_KEY=

# Payments
DODOPAYMENT_API_KEY=
DODOPAYMENT_WEBHOOK_SECRET=
DODOPAYMENT_PRO_PLAN_ID=
NEXT_PUBLIC_DODOPAYMENT_KEY=

# GitHub
GITHUB_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Acceptance Criteria:**

- [ ] `.env.example` created
- [ ] `.env.local` created (gitignored)
- [ ] Vercel environment variables documented

---

#### Task 1.6: Create Base Layout Components

**File:** `shared/components/layout/site-header.tsx`

```typescript
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

export async function SiteHeader() {
  const user = await currentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur">
      {/* Header content */}
    </header>
  );
}
```

**File:** `shared/components/layout/site-sidebar.tsx`

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Drafts', href: '/dashboard/drafts', icon: FileText },
  { label: 'Published', href: '/dashboard/published', icon: CheckCircle },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-line bg-surface">
      {/* Navigation */}
    </aside>
  );
}
```

**Acceptance Criteria:**

- [ ] Components follow atomic design
- [ ] TypeScript types defined
- [ ] Responsive behavior documented

---

#### Task 1.7: Create Utility Functions

**File:** `shared/lib/utils/index.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
```

**Acceptance Criteria:**

- [ ] All utility functions tested
- [ ] JSDoc comments added
- [ ] Exported via barrel file

---

### Day 2: Authentication + Repo Connection

#### Task 2.1: Configure Clerk Auth

**File:** `middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/changelog/(.*)',
  '/api/github/sync',
  '/api/payment/webhook',
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

**Acceptance Criteria:**

- [ ] Middleware protects dashboard routes
- [ ] Public routes accessible without auth
- [ ] API webhooks bypass auth

---

#### Task 2.2: Create Sign In Page

**File:** `app/(auth)/sign-in/[[...sign-in]]/page.tsx`

```typescript
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-surface border border-line shadow-xl',
          },
        }}
      />
    </div>
  );
}
```

**Acceptance Criteria:**

- [ ] GitHub OAuth button visible
- [ ] Custom styling applied
- [ ] Redirects to `/onboarding` after first sign-in

---

#### Task 2.3: Create Root Layout

**File:** `app/layout.tsx`

```typescript
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GitLog - Auto-changelog from GitHub',
  description: 'Turn merged PRs into polished changelogs automatically',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

**Acceptance Criteria:**

- [ ] Clerk provider wraps app
- [ ] Global styles applied
- [ ] Metadata configured

---

#### Task 2.4: Create Dashboard Layout

**File:** `app/(dashboard)/layout.tsx`

```typescript
import { SiteHeader } from '@/shared/components/layout/site-header';
import { SiteSidebar } from '@/shared/components/layout/site-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SiteSidebar />
      <div className="flex-1 flex flex-col">
        <SiteHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**

- [ ] Sidebar persistent
- [ ] Header sticky
- [ ] Content scrollable

---

#### Task 2.5: Create GitHub API Helper

**File:** `shared/lib/github/client.ts`

```typescript
import { Octokit } from 'octokit';

export function createGitHubClient(token: string) {
  return new Octokit({
    auth: token,
    userAgent: 'gitlog-app/1.0',
  });
}

export async function getUserRepos(token: string) {
  const octokit = createGitHubClient(token);

  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    visibility: 'all',
    affiliation: 'owner,collaborator',
    sort: 'updated',
    per_page: 100,
  });

  return data.map((repo) => ({
    id: repo.id,
    name: repo.full_name!,
    private: repo.private,
    html_url: repo.html_url,
    has_issues: repo.has_issues,
  }));
}
```

**Acceptance Criteria:**

- [ ] TypeScript types defined
- [ ] Error handling implemented
- [ ] Rate limit handling included

---

#### Task 2.6: Create Repo Connection API

**File:** `app/api/github/repos/route.ts`

```typescript
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserRepos } from '@/shared/lib/github/client';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const githubToken = await kv.get<string>(`user:${user.id}:github_token`);
    if (!githubToken) {
      return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });
    }

    const repos = await getUserRepos(githubToken);
    return NextResponse.json({ repos });
  } catch (error) {
    console.error('Error fetching repos:', error);
    return NextResponse.json({ error: 'Failed to fetch repos' }, { status: 500 });
  }
}
```

**Acceptance Criteria:**

- [ ] Returns user's GitHub repos
- [ ] Error handling for all cases
- [ ] Response typed correctly

---

#### Task 2.7: Create Onboarding Page

**File:** `app/(dashboard)/onboarding/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch repos on mount
  // Handle repo connection
  // Redirect to dashboard

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold">Connect Your Repository</h1>
      <p className="text-muted mt-2">
        Select a repository to start auto-generating changelogs.
      </p>
      {/* Repo list */}
    </div>
  );
}
```

**Acceptance Criteria:**

- [ ] Fetches repos on mount
- [ ] Shows loading state
- [ ] Handles connection success/error
- [ ] Redirects to dashboard after connect

---

## 📅 Phase 2: Core Features (Day 3-5)

### Day 3: GitHub Webhook + PR Sync

#### Task 3.1: Create Webhook Receiver

**File:** `app/api/github/sync/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/shared/lib/github/webhooks';
import { handleMergedPR } from '@/features/drafts/lib/sync';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('x-hub-signature-256') || '';

    // Verify signature
    const isValid = await verifyWebhookSignature(payload, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = req.headers.get('x-github-event');
    if (event !== 'pull_request') {
      return NextResponse.json({ error: 'Unsupported event' }, { status: 400 });
    }

    const data = JSON.parse(payload);

    // Only handle merged PRs
    if (data.action !== 'closed' || !data.pull_request.merged) {
      return NextResponse.json({ skipped: 'Not a merged PR' });
    }

    // Process merged PR
    await handleMergedPR(data.pull_request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

**Acceptance Criteria:**

- [ ] Signature verification works
- [ ] Only merged PRs processed
- [ ] Response within 5 seconds
- [ ] Errors logged properly

---

#### Task 3.2: Create Webhook Signature Verification

**File:** `shared/lib/github/webhooks.ts`

```typescript
import { createHmac } from 'crypto';

export async function verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('GITHUB_WEBHOOK_SECRET not configured');
  }

  const expected = createHmac('sha256', secret).update(payload).digest('hex');

  const expectedSignature = `sha256=${expected}`;

  return timingSafeEqual(signature, expectedSignature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
```

**Acceptance Criteria:**

- [ ] Constant-time comparison
- [ ] Handles missing secret
- [ ] Returns boolean

---

#### Task 3.3: Create PR Sync Handler

**File:** `features/drafts/lib/sync.ts`

```typescript
import { kv } from '@vercel/kv';
import { categorizePR } from './categorization';

interface PullRequest {
  id: number;
  title: string;
  body: string;
  labels: { name: string }[];
  merged_at: string;
  html_url: string;
  user: { login: string };
  base: { repo: { full_name: string } };
}

export async function handleMergedPR(pr: PullRequest) {
  const repoName = pr.base.repo.full_name;

  // Find user by repo connection
  const userConnections = await kv.get<Record<string, string>>(`repo:${repoName}:users`);
  if (!userConnections) {
    console.log('No users connected to repo:', repoName);
    return;
  }

  const userId = Object.values(userConnections)[0];

  // Categorize PR
  const category = categorizePR(pr.labels);

  // Create draft entry
  const entry = {
    id: `entry:${userId}:${repoName}:${pr.id}`,
    userId,
    repoId: repoName,
    prId: pr.id,
    title: pr.title,
    body: pr.body || '',
    category,
    status: 'draft' as const,
    mergedAt: pr.merged_at,
    prUrl: pr.html_url,
    author: pr.user.login,
    labels: pr.labels.map((l) => l.name),
    aiRewrite: null,
  };

  await kv.set(entry.id, entry);

  // Update user's draft count
  await incrementMonthlyUsage(userId, 'entriesPublished');
}

export async function incrementMonthlyUsage(
  userId: string,
  type: 'entriesPublished' | 'aiRewrites'
) {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const key = `usage:${userId}:${month}`;

  const current = (await kv.get<{ entriesPublished: number; aiRewrites: number }>(key)) || {
    entriesPublished: 0,
    aiRewrites: 0,
  };

  await kv.set(key, {
    ...current,
    [type]: current[type] + 1,
  });
}
```

**Acceptance Criteria:**

- [ ] Stores entry in KV
- [ ] Auto-categorizes by labels
- [ ] Updates usage counter
- [ ] Handles multiple users per repo

---

#### Task 3.4: Create PR Categorization Logic

**File:** `features/drafts/lib/categorization.ts`

```typescript
type Category = 'New' | 'Fixed' | 'Improved' | 'Other';

export function categorizePR(labels: { name: string }[]): Category {
  const labelNames = labels.map((l) => l.name.toLowerCase());

  if (labelNames.some((l) => l.includes('feat') || l.includes('feature'))) {
    return 'New';
  }

  if (labelNames.some((l) => l.includes('fix') || l.includes('bug'))) {
    return 'Fixed';
  }

  if (labelNames.some((l) => l.includes('chore') || l.includes('enhancement'))) {
    return 'Improved';
  }

  return 'Other';
}
```

**Acceptance Criteria:**

- [ ] Maps labels to categories
- [ ] Falls back to 'Other'
- [ ] Case-insensitive matching

---

#### Task 3.5: Create Manual Sync Button

**File:** `features/dashboard/components/sync-button.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/github/sync/manual', { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed');
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button onClick={handleSync} disabled={syncing}>
      <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
      {syncing ? 'Syncing...' : 'Sync Now'}
    </Button>
  );
}
```

**Acceptance Criteria:**

- [ ] Shows loading state
- [ ] Triggers manual sync
- [ ] Shows success/error feedback

---

### Day 4: AI Rewrite + Dashboard UI

#### Task 4.1: Create AI Rewrite Helper

**File:** `shared/lib/ai/gemini.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function rewritePR(params: {
  title: string;
  body: string;
  labels: string[];
}): Promise<string> {
  const prompt = `
You are rewriting a GitHub PR description into plain English for a changelog.

Rules:
- Use 2-3 sentences maximum
- Write for non-technical users
- Focus on what changed for the USER, not the code
- Use active voice: "Added X" not "X was added"
- Omit technical details (dependencies, refactors, tests)
- If PR body is empty, use title only

PR Title: ${params.title}
PR Labels: ${params.labels.join(', ')}
PR Body: ${params.body || 'No description'}

Rewrite:
  `;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
```

**Acceptance Criteria:**

- [ ] Returns 2-3 sentences
- [ ] Handles empty PR body
- [ ] Error handling included

---

#### Task 4.2: Create AI Rewrite API

**File:** `app/api/ai/rewrite/route.ts`

```typescript
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { rewritePR } from '@/shared/lib/ai/gemini';
import { checkUsageLimit } from '@/features/payment/lib/usage';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { entryId } = await req.json();
    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }

    // Check usage limits
    const plan = (await kv.get<string>(`user:${user.id}:plan`)) || 'free';
    if (plan === 'free') {
      const withinLimit = await checkUsageLimit(user.id, 'aiRewrites');
      if (!withinLimit) {
        return NextResponse.json({ error: 'Free plan limit reached (50/month)' }, { status: 403 });
      }
    }

    // Fetch entry
    const entry = await kv.get<Record<string, any>>(entryId);
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Generate rewrite
    const aiRewrite = await rewritePR({
      title: entry.title,
      body: entry.body,
      labels: entry.labels || [],
    });

    // Update entry
    await kv.set(`${entryId}:aiRewrite`, aiRewrite);
    await kv.hset(entryId, { aiRewrite });

    // Increment usage
    await incrementMonthlyUsage(user.id, 'aiRewrites');

    return NextResponse.json({ aiRewrite });
  } catch (error) {
    console.error('AI rewrite error:', error);
    return NextResponse.json({ error: 'Failed to generate rewrite' }, { status: 500 });
  }
}
```

**Acceptance Criteria:**

- [ ] Checks usage limits
- [ ] Stores rewrite in KV
- [ ] Returns generated text

---

#### Task 4.3: Create Dashboard Overview Page

**File:** `app/(dashboard)/dashboard/page.tsx`

```typescript
import { currentUser } from '@clerk/nextjs/server';
import { kv } from '@vercel/kv';
import { DraftCard } from '@/features/drafts/components/draft-card';
import { UsageCard } from '@/features/dashboard/components/usage-card';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  // Fetch recent drafts
  const drafts = await kv.get<any[]>(`user:${user.id}:drafts`) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}!</h1>
      </div>

      <UsageCard userId={user.id} />

      {drafts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {drafts.slice(0, 5).map((draft) => (
            <DraftCard key={draft.id} draft={draft} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Acceptance Criteria:**

- [ ] Shows welcome message
- [ ] Displays usage card
- [ ] Lists recent drafts
- [ ] Empty state when no drafts

---

#### Task 4.4: Create Draft Card Component

**File:** `features/drafts/components/draft-card.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Sparkles, Edit, Check, Trash } from 'lucide-react';

interface DraftCardProps {
  draft: {
    id: string;
    title: string;
    category: string;
    mergedAt: string;
    aiRewrite?: string | null;
  };
}

export function DraftCard({ draft }: DraftCardProps) {
  const [rewriting, setRewriting] = useState(false);

  const handleRewrite = async () => {
    setRewriting(true);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        body: JSON.stringify({ entryId: draft.id }),
      });
      const data = await res.json();
      // Update UI with rewrite
    } catch (error) {
      // Show error
    } finally {
      setRewriting(false);
    }
  };

  return (
    <Card className="p-4 hover-lift">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge>{draft.category}</Badge>
            <h3 className="font-semibold">{draft.title}</h3>
          </div>
          {draft.aiRewrite && (
            <p className="text-muted text-sm">{draft.aiRewrite}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRewrite}
            disabled={rewriting}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {rewriting ? 'Writing...' : 'Rewrite'}
          </Button>
          <Button variant="secondary" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm">
            <Check className="h-4 w-4 mr-1" />
            Publish
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

**Acceptance Criteria:**

- [ ] Shows draft info
- [ ] Rewrite button works
- [ ] Edit button present
- [ ] Publish button present
- [ ] Hover effects

---

### Day 5: Publish Flow + Public Page

#### Task 5.1: Create Publish Endpoint

**File:** `app/api/entries/publish/route.ts`

```typescript
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { entryId } = await req.json();

    const entry = await kv.get<any>(entryId);
    if (!entry || entry.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Update status
    await kv.hset(entryId, {
      status: 'published',
      publishedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
  }
}
```

**Acceptance Criteria:**

- [ ] Updates entry status
- [ ] Sets published timestamp
- [ ] Validates ownership

---

#### Task 5.2: Create Public Changelog Page

**File:** `app/(public)/changelog/[username]/[repo]/page.tsx`

```typescript
import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: { username: string; repo: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `What's New in ${params.repo} | GitLog`,
    description: `Latest updates and changelog for ${params.repo}`,
  };
}

export default async function ChangelogPage({ params }: PageProps) {
  const repoSlug = `${params.username}/${params.repo}`;

  // Fetch published entries
  const entries = await kv.get<any[]>(`repo:${repoSlug}:published`) || [];

  if (entries.length === 0) {
    notFound();
  }

  // Group by month
  const grouped = groupByMonth(entries);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Changelog for {params.repo}
          </h1>
          <p className="text-muted">
            Stay updated with the latest improvements
          </p>
        </header>

        {Object.entries(grouped).map(([month, entries]) => (
          <section key={month} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{month}</h2>
            <div className="space-y-6">
              {entries.map((entry) => (
                <ChangelogEntry key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        ))}

        <footer className="mt-12 pt-8 border-t border-line">
          <p className="text-muted text-sm">
            Powered by{' '}
            <a href="https://gitlog.app" className="text-accent hover:underline">
              GitLog
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

function groupByMonth(entries: any[]) {
  // Group entries by month
  return entries.reduce((acc, entry) => {
    const month = new Date(entry.publishedAt).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    acc[month] = acc[month] || [];
    acc[month].push(entry);
    return acc;
  }, {} as Record<string, any[]>);
}
```

**Acceptance Criteria:**

- [ ] Groups by month
- [ ] Shows published entries
- [ ] SEO metadata set
- [ ] 404 if no entries
- [ ] Mobile responsive

---

## 📅 Phase 3: Payments + Polish (Day 6-8)

### Day 6: DodoPayment Integration

#### Task 6.1: Create Checkout API

#### Task 6.2: Create Webhook Handler

#### Task 6.3: Create Upgrade Modal

#### Task 6.4: Implement Usage Limits

### Day 7: Polish + SEO

#### Task 7.1: Add SEO Meta Tags

#### Task 7.2: Optimize Performance

#### Task 7.3: Add Error Boundaries

#### Task 7.4: Create 404/500 Pages

### Day 8: Dogfood + Launch

#### Task 8.1: Connect GitLog Repo

#### Task 8.2: Test All Flows

#### Task 8.3: Fix Critical Bugs

#### Task 8.4: Prepare Launch Assets

---

## ✅ Task Status Tracker

| Task ID | Task Name                  | Priority | Status     | Assigned | Due   |
| :------ | :------------------------- | :------- | :--------- | :------- | :---- |
| 1.1     | Initialize Next.js Project | P0       | ⬜ Pending |          | Day 1 |
| 1.2     | Install Shadcn/ui          | P0       | ⬜ Pending |          | Day 1 |
| 1.3     | Install Dependencies       | P0       | ⬜ Pending |          | Day 1 |
| 1.4     | Project Structure          | P0       | ⬜ Pending |          | Day 1 |
| 1.5     | Environment Variables      | P0       | ⬜ Pending |          | Day 1 |
| 1.6     | Base Layout Components     | P0       | ⬜ Pending |          | Day 1 |
| 1.7     | Utility Functions          | P1       | ⬜ Pending |          | Day 1 |
| 2.1     | Configure Clerk Auth       | P0       | ⬜ Pending |          | Day 2 |
| 2.2     | Sign In Page               | P0       | ⬜ Pending |          | Day 2 |
| 2.3     | Root Layout                | P0       | ⬜ Pending |          | Day 2 |
| 2.4     | Dashboard Layout           | P0       | ⬜ Pending |          | Day 2 |
| 2.5     | GitHub API Helper          | P0       | ⬜ Pending |          | Day 2 |
| 2.6     | Repo Connection API        | P0       | ⬜ Pending |          | Day 2 |
| 2.7     | Onboarding Page            | P0       | ⬜ Pending |          | Day 2 |
| 3.1     | Webhook Receiver           | P0       | ⬜ Pending |          | Day 3 |
| 3.2     | Webhook Verification       | P0       | ⬜ Pending |          | Day 3 |
| 3.3     | PR Sync Handler            | P0       | ⬜ Pending |          | Day 3 |
| 3.4     | Categorization Logic       | P0       | ⬜ Pending |          | Day 3 |
| 3.5     | Manual Sync Button         | P1       | ⬜ Pending |          | Day 3 |
| 4.1     | AI Rewrite Helper          | P0       | ⬜ Pending |          | Day 4 |
| 4.2     | AI Rewrite API             | P0       | ⬜ Pending |          | Day 4 |
| 4.3     | Dashboard Page             | P0       | ⬜ Pending |          | Day 4 |
| 4.4     | Draft Card Component       | P0       | ⬜ Pending |          | Day 4 |
| 5.1     | Publish Endpoint           | P0       | ⬜ Pending |          | Day 5 |
| 5.2     | Public Changelog Page      | P0       | ⬜ Pending |          | Day 5 |
| 6.1     | Checkout API               | P0       | ⬜ Pending |          | Day 6 |
| 6.2     | Payment Webhook            | P0       | ⬜ Pending |          | Day 6 |
| 6.3     | Upgrade Modal              | P0       | ⬜ Pending |          | Day 6 |
| 6.4     | Usage Limits               | P0       | ⬜ Pending |          | Day 6 |
| 7.1     | SEO Meta Tags              | P1       | ⬜ Pending |          | Day 7 |
| 7.2     | Performance Optimize       | P1       | ⬜ Pending |          | Day 7 |
| 7.3     | Error Boundaries           | P1       | ⬜ Pending |          | Day 7 |
| 7.4     | 404/500 Pages              | P1       | ⬜ Pending |          | Day 7 |
| 8.1     | Dogfood Setup              | P0       | ⬜ Pending |          | Day 8 |
| 8.2     | Full Flow Testing          | P0       | ⬜ Pending |          | Day 8 |
| 8.3     | Bug Fixes                  | P0       | ⬜ Pending |          | Day 8 |
| 8.4     | Launch Assets              | P1       | ⬜ Pending |          | Day 8 |

**Status Legend:**

- ⬜ Pending
- 🔄 In Progress
- ✅ Completed
- ⏸️ Blocked

---

## 📐 Code Standards

### File Naming

```typescript
// Components: PascalCase
DraftCard.tsx;
SiteHeader.tsx;

// Utilities: camelCase
cn.ts;
formatDate.ts;

// API routes: kebab-case in folder, route.ts file
api / github / sync / route.ts;

// Hooks: use prefix
useDrafts.ts;
useUsage.ts;
```

### Component Structure

```typescript
'use client'; // If client component

import { } from 'react';
import { } from '@/shared';

interface Props {
  // Typed props
}

export function Component({ }: Props) {
  // Component logic

  return (
    // JSX
  );
}
```

### Error Handling

```typescript
try {
  // Operation
} catch (error) {
  console.error('Context:', error);
  // User-friendly message
  // Log to service (Axiom/Sentry)
}
```

### TypeScript

- No `any` types (use `unknown` if needed)
- All props typed
- All API responses typed
- Use `as const` for literals

---

**Last Updated:** 2026-03-08  
**Next Review:** After Day 1 completion
