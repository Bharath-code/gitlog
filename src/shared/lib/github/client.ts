import { Octokit } from 'octokit';

export function createGitHubClient(token: string) {
  return new Octokit({
    auth: token,
    userAgent: 'gitlog-app/1.0',
  });
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  has_issues: boolean;
}

export async function getUserRepos(token: string): Promise<GitHubRepo[]> {
  const octokit = createGitHubClient(token);
  
  try {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      visibility: 'all',
      affiliation: 'owner,collaborator',
      sort: 'updated',
      per_page: 100,
    });
    
    return data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name!,
      private: repo.private,
      html_url: repo.html_url,
      has_issues: repo.has_issues,
    }));
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    throw new Error('Failed to fetch GitHub repositories');
  }
}

export async function getPRDetails(token: string, owner: string, repo: string, prNumber: number) {
  const octokit = createGitHubClient(token);
  
  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });
  
  return {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    body: pr.body || '',
    labels: pr.labels.map(label => ({ name: typeof label === 'string' ? label : label.name })),
    merged_at: pr.merged_at,
    html_url: pr.html_url,
    user: { login: pr.user?.login || 'unknown' },
    base: { repo: { full_name: pr.base.repo.full_name } },
  };
}
