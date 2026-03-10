import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { connectRepo, getConnectedRepos } from '@/shared/lib/db/repo';
import { slugify } from '@/shared/lib/utils';
import { pricing } from '@/shared/config';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repoId, name, private: isPrivate } = await req.json();

    if (!repoId || !name) {
      return NextResponse.json({ error: 'Repository ID and name are required' }, { status: 400 });
    }

    // Check plan limits for connected repos
    const plan = (await kv.get<'free' | 'pro'>(`user:${user.id}:plan`)) || 'free';

    if (plan === 'free') {
      const connectedRepos = await getConnectedRepos(user.id);
      const currentRepoCount = connectedRepos.length;

      if (currentRepoCount >= pricing.free.connectedRepos) {
        return NextResponse.json(
          {
            error: `Free plan limit reached (${pricing.free.connectedRepos} repository). Upgrade to Pro for unlimited repositories.`,
            upgrade: true,
          },
          { status: 403 }
        );
      }
    }

    // Get GitHub token from user's OAuth
    const githubToken = await kv.get<string>(`user:${user.id}:github_token`);
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub account not connected. Please sign in again.' },
        { status: 400 }
      );
    }

    // Create repo connection
    const repo = {
      id: repoId,
      userId: user.id,
      githubRepoId: parseInt(repoId),
      name,
      slug: slugify(name),
      isPrivate,
      connectedAt: new Date().toISOString(),
    };

    await connectRepo(repo);

    // Store GitHub token for future API calls
    await kv.set(`user:${user.id}:github_token`, githubToken);

    return NextResponse.json({
      success: true,
      repo,
      message: `Successfully connected ${name}`,
    });
  } catch (error) {
    console.error('Repo connection error:', error);
    return NextResponse.json({ error: 'Failed to connect repository' }, { status: 500 });
  }
}
