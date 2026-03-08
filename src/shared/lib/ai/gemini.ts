import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
);

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function rewritePR(params: {
  title: string;
  body: string;
  labels: string[];
}): Promise<string> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured');
  }

  const prompt = `
You are rewriting a GitHub PR description into plain English for a changelog.

Rules:
- Use 2-3 sentences maximum
- Write for non-technical users
- Focus on what changed for the USER, not the code
- Use active voice: "Added X" not "X was added"
- Omit technical details (dependencies, refactors, tests)
- If PR body is empty, use title only
- Be specific about the user benefit

PR Title: ${params.title}
PR Labels: ${params.labels.join(', ')}
PR Body: ${params.body || 'No description'}

Rewrite:
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('AI rewrite error:', error);
    throw new Error('Failed to generate AI rewrite');
  }
}

export async function generateSEODescription(params: {
  title: string;
  rewrite: string;
  repo: string;
}): Promise<string> {
  const prompt = `
Write a 150-160 character SEO meta description for a changelog entry.

Product: ${params.repo}
Feature: ${params.title}
Description: ${params.rewrite}

SEO Description (150-160 chars):
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text.slice(0, 160);
  } catch (error) {
    console.error('SEO description error:', error);
    return `${params.title} - ${params.rewrite.slice(0, 100)}`;
  }
}
