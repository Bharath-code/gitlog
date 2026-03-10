import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';

const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  let username: string = '';
  let repo: string = '';
  try {
    const body = await request.json();
    username = body.username;
    repo = body.repo;

    if (!username || !repo) {
      return NextResponse.json({ error: 'Username and repo are required' }, { status: 400 });
    }

    if (!githubToken) {
      // Return basic info without API call
      return NextResponse.json({
        name: repo,
        description: '',
        stars: 0,
        forks: 0,
        avatar: `https://github.com/${username}.png`,
        url: `https://github.com/${username}/${repo}`,
        userUrl: `https://github.com/${username}`,
      });
    }

    const octokit = new Octokit({ auth: githubToken });

    // Fetch repo details
    const { data: repoData } = await octokit.rest.repos.get({
      owner: username,
      repo: repo,
    });

    // Fetch user details
    const { data: userData } = await octokit.rest.users.getByUsername({
      username: username,
    });

    return NextResponse.json({
      name: repoData.name,
      description: repoData.description || 'No description',
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      avatar: userData.avatar_url || `https://github.com/${username}.png`,
      url: repoData.html_url,
      userUrl: userData.html_url,
      company: userData.company,
      blog: userData.blog,
      location: userData.location,
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    // Return basic info on error
    return NextResponse.json({
      name: repo,
      description: '',
      stars: 0,
      forks: 0,
      avatar: `https://github.com/${username}.png`,
      url: `https://github.com/${username}/${repo}`,
      userUrl: `https://github.com/${username}`,
    });
  }
}
