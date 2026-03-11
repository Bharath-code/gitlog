import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Octokit } from 'octokit';

/**
 * Exchange OAuth code for GitHub token
 * This endpoint is called after GitHub OAuth redirect
 */
export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        state,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json(
        { error: tokenData.error_description || tokenData.error },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token received' }, { status: 400 });
    }

    // Store GitHub token in Vercel KV
    await kv.set(`user:${user.id}:github_token`, accessToken);
    await kv.set(`user:${user.id}:github_connected`, true);

    // Verify token works by fetching user info
    const octokit = new Octokit({ auth: accessToken });
    const { data: githubUser } = await octokit.rest.users.getAuthenticated();

    // Store additional GitHub info
    await kv.set(`user:${user.id}:github_info`, {
      username: githubUser.login,
      avatar: githubUser.avatar_url,
      email: githubUser.email,
      connectedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      username: githubUser.login,
    });
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.json({ error: 'Failed to process GitHub OAuth' }, { status: 500 });
  }
}
