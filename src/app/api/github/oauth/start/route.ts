import { NextResponse } from 'next/server';

/**
 * Start GitHub OAuth flow
 * Redirects user to GitHub for authorization
 */
export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub OAuth not configured' },
      { status: 500 }
    );
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/github/oauth/exchange`;
  const scope = encodeURIComponent('repo user:email read:user');
  
  const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

  return NextResponse.redirect(githubOAuthUrl);
}
