# GitHub OAuth Setup Guide

## Step 1: Configure GitHub OAuth in Clerk Dashboard

### 1.1 Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: GitLog
   - **Homepage URL**: `http://localhost:3000` (dev) or `https://gitlog.app` (prod)
   - **Authorization callback URL**: `https://your-clerk-instance.clerk.accounts.com/v1/callback_oauth`
     - Find this URL in Clerk Dashboard → Authentication → SSO → GitHub
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client secret**

### 1.2 Enable GitHub in Clerk

1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to **Authentication** → **SSO** → **Connect account**
4. Find **GitHub** and click to configure
5. Toggle **Enable this connection**
6. Enter:
   - **Client ID**: From GitHub OAuth app
   - **Client Secret**: From GitHub OAuth app
7. Click **Save**

### 1.3 Configure OAuth Scopes

In Clerk, make sure these scopes are requested:

- `repo` (Full control of private repositories)
- `user:email` (Access user emails)
- `read:user` (Read user profile data)

### 1.4 Update Environment Variables

Add to your `.env.local`:

```env
# Clerk OAuth
NEXT_PUBLIC_CLERK_GITHUB_OAUTH=true
```

## Step 2: Test the Flow

1. Go to `/sign-in`
2. You should now see "Continue with GitHub" button
3. Click it and authorize
4. You should be redirected to `/onboarding`
5. Your GitHub repos should load

## Step 3: Production Setup

Repeat the above steps with production URLs:

- Create separate GitHub OAuth app for production
- Update Clerk production instance
- Use production callback URL

## Troubleshooting

### "GitHub account not connected" error

This means the GitHub token wasn't stored properly. Check:

1. Clerk has GitHub OAuth enabled
2. OAuth scopes include `repo`
3. Token is being captured in Clerk webhook

### No repos showing in onboarding

1. Check if GitHub token exists in Vercel KV
2. Verify OAuth scopes include `repo`
3. Try disconnecting and reconnecting GitHub
