# ⚡ Quick Fix: GitHub OAuth Not Working

## The Issue
You signed in with GitHub but can't select repos in onboarding. Here's why:

**Clerk's GitHub OAuth ≠ GitHub API Token**

- Clerk handles **authentication** (who you are)
- We need a separate **OAuth token** to access your repos

## 🔧 3-Minute Fix

### Step 1: Add to `.env.local` (1 minute)

```bash
# Add these lines:
GITHUB_CLIENT_ID=paste_your_client_id_here
GITHUB_CLIENT_SECRET=paste_your_client_secret_here
NEXT_PUBLIC_GITHUB_CLIENT_ID=paste_your_client_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Update GitHub OAuth App (1 minute)

1. Go to https://github.com/settings/developers
2. Click your GitLog app (or create new)
3. Update **Authorization callback URL**:
   ```
   http://localhost:3000/api/github/oauth/exchange
   ```
4. Save changes

### Step 3: Restart & Test (1 minute)

```bash
# Stop dev server (Ctrl+C)
# Start again
npm run dev

# Go to http://localhost:3000/sign-in
# Sign in with GitHub
# You'll be redirected to OAuth → Authorize → See repos!
```

## 🎯 What Happens Now

```
Sign In → Clerk GitHub Auth → Onboarding → 
GitHub OAuth (for token) → Fetch Repos → Select Repo → Done!
```

## ✅ That's It!

The code is already deployed. Just add the env vars and update the OAuth callback URL.

## 🆘 Still Not Working?

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Check console** for errors (F12)
3. **Verify env vars** are loaded
4. **Check GitHub OAuth app** callback URL is exact

---

**Need the full guide?** See `GITHUB_OAUTH_FIX.md`
