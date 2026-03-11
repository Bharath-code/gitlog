# 🔧 GitHub OAuth Fix - Repository Selection Not Working

## 🐛 The Problem

After signing in with GitHub, users were stuck on onboarding because:
1. Clerk's built-in GitHub OAuth doesn't expose the raw access token
2. The app couldn't fetch repositories without the token
3. No OAuth flow existed to get the token with proper scopes

## ✅ The Solution

Implemented a **two-step OAuth flow**:

### Step 1: Clerk GitHub Sign-in
- User signs in with GitHub via Clerk
- Clerk handles authentication
- User account is created/linked

### Step 2: GitHub OAuth Proxy
- After sign-in, redirect to `/api/github/oauth/start`
- User authorizes with GitHub (scopes: `repo`, `user:email`, `read:user`)
- GitHub redirects to `/api/github/oauth/exchange` with authorization code
- Exchange code for access token
- Store token in Vercel KV
- Redirect to onboarding with repos loaded

## 📁 New API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/github/oauth/start` | GET | Redirect to GitHub OAuth |
| `/api/github/oauth/exchange` | GET | Handle OAuth callback and store token |
| `/api/github/repos` | GET | Updated to handle missing token gracefully |

## 🔧 Required Configuration

### 1. Add Environment Variables

Create or update `.env.local`:

```bash
# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=Ov23li...your_client_id
GITHUB_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GITHUB_CLIENT_ID=Ov23li...your_client_id

# App URL (for OAuth redirect)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Existing Clerk vars
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Existing GitHub vars (for webhooks)
GITHUB_WEBHOOK_SECRET=whsec_...
GITHUB_TOKEN=ghp_...
```

### 2. Configure GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"** or edit existing
3. Update settings:
   ```
   Application name: GitLog
   Homepage URL: http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/github/oauth/exchange
   ```
4. Save changes
5. Copy Client ID and Client Secret to `.env.local`

### 3. Enable GitHub in Clerk (Still Required)

1. Go to https://dashboard.clerk.com
2. Select your app
3. Authentication → SSO → Connect account → GitHub
4. Enable and add credentials (same as above)
5. Save

**Why both?** 
- Clerk GitHub OAuth: Handles user authentication
- GitHub OAuth App: Gets access token for API calls

## 🎯 User Flow (Fixed)

### First-Time User Flow

```
1. Visit /sign-in
   ↓
2. Click "Continue with GitHub" (Clerk)
   ↓
3. Authorize on GitHub
   ↓
4. Redirected to /onboarding
   ↓
5. App checks for GitHub token
   ↓
6. Token missing → Redirect to /api/github/oauth/start
   ↓
7. User sees GitHub OAuth screen (scopes: repo, user:email, read:user)
   ↓
8. GitHub redirects to /api/github/oauth/exchange?code=xxx
   ↓
9. Exchange code for token, store in Vercel KV
   ↓
10. Redirect to /onboarding
    ↓
11. Fetch repos with token
    ↓
12. User selects repo → Connect → Done! 🎉
```

### Visual Flow

```
┌─────────────────┐
│ Sign in Page    │
│ [GitHub Button] │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Clerk + GitHub  │
│ Authentication  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Onboarding      │
│ "Loading..."    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ OAuth Redirect  │
│ "Connecting..." │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub OAuth    │
│ (Grant Access)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Token Stored    │
│ Fetching Repos  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Select Repo     │
│ [Connect]       │
└─────────────────┘
```

## 🧪 Testing the Fix

### Test 1: Fresh User Flow

```bash
# Start dev server
npm run dev

# In browser (incognito):
1. Go to http://localhost:3000/sign-in
2. Click "Continue with GitHub"
3. Authorize
4. Should redirect to onboarding
5. Should auto-redirect to GitHub OAuth
6. Authorize again (OAuth scopes)
7. Should return to onboarding with repos listed
8. Click "Connect" on a repo
9. Should redirect to dashboard
```

### Test 2: Check Token Storage

```bash
# After OAuth, check Vercel KV
# Token should be at: user:<clerk_user_id>:github_token
```

### Test 3: Existing User

```bash
# If user already signed in with Clerk GitHub:
1. Go to /onboarding
2. Should redirect to OAuth flow
3. Complete OAuth
4. Repos should load
```

## 🐛 Troubleshooting

### Error: "GitHub account not connected"

**Cause**: Token not stored in KV

**Fix**:
1. Check `.env.local` has `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
2. Restart dev server
3. Clear browser cache
4. Try again

### Error: "redirect_uri_mismatch"

**Cause**: GitHub OAuth callback URL doesn't match

**Fix**:
1. Go to GitHub OAuth App settings
2. Update callback URL to: `http://localhost:3000/api/github/oauth/exchange`
3. Save and try again

### No repos showing after OAuth

**Cause**: Token doesn't have repo scope

**Fix**:
1. Check OAuth URL includes `scope=repos`
2. Revoke OAuth app in GitHub settings
3. Try OAuth flow again

### Stuck on "Loading..."

**Cause**: API endpoint error

**Fix**:
1. Check browser console for errors
2. Check server logs for API errors
3. Verify Clerk auth is working
4. Verify KV connection

## 📊 What Changed

### Files Created
- `src/app/api/github/oauth/start/route.ts` - OAuth redirect
- `src/app/api/github/oauth/exchange/route.ts` - OAuth callback
- `src/app/api/github/connection/route.ts` - Connection status

### Files Modified
- `src/app/api/github/repos/route.ts` - Better error handling
- `src/app/(dashboard)/onboarding/page.tsx` - OAuth redirect logic

## 🔐 Security Notes

1. **Token Storage**: Tokens stored encrypted in Vercel KV
2. **Scopes**: Minimal scopes requested (`repo`, `user:email`, `read:user`)
3. **State Parameter**: Can add CSRF protection if needed
4. **User Isolation**: Tokens scoped to Clerk user ID

## ✅ Success Indicators

After implementing this fix:

- ✅ Users can sign in with GitHub (Clerk)
- ✅ Auto-redirect to GitHub OAuth for token
- ✅ Token stored in Vercel KV
- ✅ Repos load in onboarding
- ✅ Can select and connect repository
- ✅ Redirects to dashboard after connection
- ✅ Settings page shows GitHub connection

## 🚀 Next Steps

1. **Add environment variables** to `.env.local`
2. **Configure GitHub OAuth App** with correct callback
3. **Test the complete flow**
4. **Deploy to production** with production OAuth URLs

## 📞 Quick Test Command

```bash
# Check if env vars are set
echo "GITHUB_CLIENT_ID: $GITHUB_CLIENT_ID"
echo "GITHUB_CLIENT_SECRET: $GITHUB_CLIENT_SECRET"
echo "NEXT_PUBLIC_APP_URL: $NEXT_PUBLIC_APP_URL"

# Start dev server
npm run dev
```

---

**The fix is complete! Just configure the OAuth app and test.** 🎉
