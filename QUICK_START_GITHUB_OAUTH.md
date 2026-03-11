# 🚀 Quick Start: Enable GitHub Sign-in

## ⚡ 5-Minute Setup

### Step 1: Create GitHub OAuth App (2 minutes)

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `GitLog`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**:
     - Go to Clerk Dashboard → Authentication → SSO → GitHub
     - Copy the callback URL shown there (looks like: `https://your-instance.clerk.accounts.com/v1/callback_oauth`)
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it

### Step 2: Enable GitHub in Clerk (2 minutes)

1. Go to https://dashboard.clerk.com
2. Select your GitLog application
3. Click **"Authentication"** in left sidebar
4. Click **"SSO"** → **"Connect account"**
5. Find **GitHub** in the list and click it
6. Toggle **"Enable this connection"**
7. Paste:
   - **Client ID**: From GitHub app
   - **Client Secret**: From GitHub app
8. Click **"Save"**

### Step 3: Add Environment Variables (1 minute)

Create or update `.env.local`:

```bash
# GitHub OAuth (from Step 1)
GITHUB_CLIENT_ID=Ov23li...your_client_id
GITHUB_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GITHUB_CLIENT_ID=Ov23li...your_client_id

# Clerk Webhook (optional but recommended)
# Get this from Clerk Dashboard → Webhooks → Create webhook
CLERK_WEBHOOK_SECRET=whsec_xxx

# Keep your existing vars
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

### Step 4: Install Dependencies

```bash
npm install svix
```

### Step 5: Configure Clerk Webhook (Optional but Recommended)

1. In Clerk Dashboard, go to **Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-domain.com/api/webhooks/clerk`
   - For local dev: Use ngrok or skip for now
4. Select events:
   - ✅ `user.created`
   - ✅ `user.oauthAccountLinked`
5. Click **"Create"**
6. Copy the webhook secret to `.env.local`

### Step 6: Test It! 🎉

```bash
npm run dev
```

1. Go to `http://localhost:3000/sign-in`
2. You should see:
   - GitHub callout box explaining the requirement
   - "Continue with GitHub" button
3. Click it
4. Authorize on GitHub
5. You should be redirected to `/onboarding` with your repos loaded!

## 🎯 What You Get

### ✅ Sign-in Pages

- GitHub OAuth prominently featured
- Clear explanation of why GitHub is needed
- Beautiful UI callout with GitHub icon

### ✅ Token Storage

- Automatic GitHub token storage on OAuth
- Stored securely in Vercel KV
- Token available for GitHub API calls

### ✅ Settings Page

- New "GitHub Integration" section
- Connect/disconnect GitHub account
- View all connected repositories
- Manual sync button
- Add more repositories anytime

### ✅ Repository Management

- Works in onboarding flow
- Works in settings page
- Supports private and public repos
- Shows connection status

## 🐛 Troubleshooting

### "GitHub account not connected" error

**Fix**: Make sure GitHub OAuth is enabled in Clerk and you've authorized the app.

### No repos showing in onboarding

**Fix**:

1. Check GitHub OAuth scopes include `repo`
2. Try disconnecting and reconnecting GitHub in Settings
3. Click "Sync Repos" button in settings

### "Invalid redirect_uri" error

**Fix**: Make sure the callback URL in GitHub OAuth app matches exactly what Clerk shows.

### Build succeeded but OAuth not showing

**Fix**:

1. Clear browser cache
2. Check Clerk dashboard → GitHub connection is enabled
3. Verify environment variables are loaded

## 📚 What Was Changed

### Files Created

- `src/app/api/github/oauth/callback/route.ts` - OAuth callback handler
- `src/app/api/webhooks/clerk/route.ts` - Clerk webhook handler
- `src/app/api/user/github/status/route.ts` - GitHub status endpoint
- `src/app/api/user/github/disconnect/route.ts` - Disconnect endpoint
- `src/app/api/user/repos/[repoId]/route.ts` - Repo management endpoint
- `src/features/settings/github-settings.tsx` - Settings UI component
- `GITHUB_OAUTH_SETUP.md` - Detailed setup guide
- `GITHUB_OAUTH_IMPLEMENTATION.md` - Implementation docs
- `QUICK_START_GITHUB_OAUTH.md` - This file

### Files Modified

- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Added GitHub callout
- `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Added GitHub callout
- `src/app/(dashboard)/settings/page.tsx` - Integrated GitHub settings
- `README.md` - Updated env vars section
- `package.json` - Added svix dependency

## 🎨 UI Preview

### Sign-in Page

```
┌─────────────────────────────────────┐
│   [GitLog Logo]                     │
│   Welcome to GitLog                 │
│   Auto-generate changelogs...       │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ [GitHub Icon]               │   │
│  │ Sign in with GitHub         │   │
│  │ GitHub sign-in is required  │   │
│  │ to access your repositories │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Continue with GitHub]            │
│  [Continue with Email]             │
└─────────────────────────────────────┘
```

### Settings Page

```
┌─────────────────────────────────────┐
│ GitHub Integration                  │
├─────────────────────────────────────┤
│ [GitHub Icon] GitHub Account        │
│ Connected as @username              │
│ ✓ Connected since Jan 1, 2026       │
│                      [Disconnect]   │
├─────────────────────────────────────┤
│ Connected Repositories (2)          │
│ [Sync Repos] [Add More]             │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ [Icon] owner/repo  [Private]│    │
│ │ Connected Jan 1, 2026       │    │
│ │              [View] [X]     │    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## ✅ Success Checklist

- [ ] GitHub OAuth app created
- [ ] GitHub enabled in Clerk
- [ ] Environment variables added
- [ ] svix installed
- [ ] Dev server running
- [ ] Can sign in with GitHub
- [ ] Repos load in onboarding
- [ ] Settings shows GitHub integration
- [ ] Can manage repos in settings

## 🚀 Next Steps

1. **Test the complete flow** - Sign in, connect repo, merge PR
2. **Configure production** - Repeat steps with production URLs
3. **Add webhook** - Set up Clerk webhook for automatic events
4. **Customize UI** - Adjust styling to match your brand

## 📞 Need Help?

- **Detailed Guide**: See `GITHUB_OAUTH_SETUP.md`
- **Implementation Details**: See `GITHUB_OAUTH_IMPLEMENTATION.md`
- **Clerk Docs**: https://clerk.com/docs
- **GitHub OAuth Docs**: https://docs.github.com/en/developers/apps

---

**Ready to go! 🎉**

Your users can now sign in with GitHub and access their repositories!
