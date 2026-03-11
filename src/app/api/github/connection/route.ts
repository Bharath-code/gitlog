import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Octokit } from 'octokit';

/**
 * Get GitHub token from Clerk user's external account
 * and store it in Vercel KV for API usage
 */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has GitHub connected
    const externalAccounts = user.externalAccounts || [];
    const githubAccount = externalAccounts.find(
      (account) => account.provider === 'oauth_github'
    );

    if (!githubAccount) {
      return NextResponse.json(
        { 
          error: 'GitHub not connected',
          message: 'Please connect your GitHub account first'
        }, 
        { status: 400 }
      );
    }

    // Note: Clerk doesn't expose the raw OAuth token for security reasons
    // We need to use Clerk's token or implement a separate OAuth flow
    // For now, we'll use a server-side GitHub app token or personal token
    
    // Alternative: Use the GitHub user ID from Clerk
    const githubUserId = githubAccount.providerUserId;
    
    // Store GitHub connection info
    await kv.set(`user:${user.id}:github_connected`, true);
    await kv.set(`user:${user.id}:github_info`, {
      username: githubAccount.username || githubAccount.emailAddress,
      githubUserId,
      connectedAt: new Date().toISOString(),
    });

    // For repo access, we need to implement OAuth proxy or use GitHub App
    // Let's check if we have a server token
    const serverToken = process.env.GITHUB_TOKEN;
    
    if (!serverToken) {
      return NextResponse.json({
        connected: true,
        needsToken: true,
        message: 'GitHub connected but token not available. Please use OAuth proxy.',
        oauthUrl: `/api/github/oauth/start`
      });
    }

    // Use server token to fetch repos (limited scope)
    const octokit = new Octokit({ auth: serverToken });
    
    try {
      const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
        visibility: 'all',
        affiliation: 'owner,collaborator',
        sort: 'updated',
        per_page: 100,
      });

      return NextResponse.json({
        connected: true,
        repos: repos.map((repo) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name!,
          private: repo.private,
          html_url: repo.html_url,
          has_issues: repo.has_issues,
        })),
      });
    } catch (error) {
      // Server token doesn't have repo access
      return NextResponse.json({
        connected: true,
        needsToken: true,
        message: 'Server token lacks permissions. Please use OAuth proxy.',
        oauthUrl: `/api/github/oauth/start`
      });
    }
  } catch (error) {
    console.error('Error fetching GitHub connection:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub connection' }, { status: 500 });
  }
}
