import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
);

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export type Tone = 'casual' | 'professional' | 'technical' | 'exciting';

const toneInstructions: Record<Tone, string> = {
  casual: 'Use a friendly, conversational tone. Write like you\'re talking to a friend.',
  professional: 'Use a professional, business-appropriate tone. Be clear and concise.',
  technical: 'Include relevant technical details. Assume the audience has some technical knowledge.',
  exciting: 'Use enthusiastic, energetic language. Highlight the impact and benefits.',
};

export async function rewritePR(params: {
  title: string;
  body: string;
  labels: string[];
  tone?: Tone;
}): Promise<string> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured');
  }

  const tone = params.tone || 'casual';

  const prompt = `
You are rewriting a GitHub PR description into plain English for a changelog.

Rules:
- Use 2-3 sentences maximum
- Write for non-technical users (unless tone is 'technical')
- Focus on what changed for the USER, not the code
- Use active voice: "Added X" not "X was added"
- Omit technical details like dependencies, refactors, tests (unless tone is 'technical')
- If PR body is empty, use title only
- Be specific about the user benefit

Tone: ${toneInstructions[tone]}

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

export async function generateMultipleVersions(params: {
  title: string;
  body: string;
  labels: string[];
  count?: number;
}): Promise<string[]> {
  const tones: Tone[] = ['casual', 'professional', 'technical', 'exciting'];
  const count = params.count || 3;
  const versions: string[] = [];

  for (let i = 0; i < Math.min(count, tones.length); i++) {
    try {
      const rewrite = await rewritePR({
        ...params,
        tone: tones[i],
      });
      versions.push(rewrite);
    } catch (error) {
      console.error(`Failed to generate version ${i + 1}:`, error);
      versions.push('Failed to generate');
    }
  }

  return versions;
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

Requirements:
- Exactly 150-160 characters
- Include primary keyword naturally
- Make it compelling and clickable
- Don't use quotes or special characters

SEO Description:
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

export async function generateSocialPost(params: {
  title: string;
  rewrite: string;
  platform?: 'twitter' | 'linkedin';
}): Promise<string> {
  const platform = params.platform || 'twitter';
  
  const prompt = platform === 'twitter'
    ? `
Write a Twitter thread (2-3 tweets) announcing this feature.

Feature: ${params.title}
Description: ${params.rewrite}

Requirements:
- Each tweet max 280 characters
- Use emojis appropriately
- Include a hook in the first tweet
- Add relevant hashtags
- Format with line breaks for readability

Twitter Thread:
    `
    : `
Write a LinkedIn post announcing this feature.

Feature: ${params.title}
Description: ${params.rewrite}

Requirements:
- Professional tone
- 3-4 short paragraphs
- Start with a hook
- Include the user benefit
- Add a call-to-action
- Use 3-5 relevant hashtags

LinkedIn Post:
    `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Social post error:', error);
    throw new Error('Failed to generate social post');
  }
}

export async function improveWriting(params: {
  text: string;
  goal?: 'clearer' | 'shorter' | 'more-detailed' | 'more-persuasive';
}): Promise<string> {
  const goals: Record<string, string> = {
    clearer: 'Make this clearer and easier to understand',
    shorter: 'Make this more concise while keeping key information',
    'more-detailed': 'Add more specific details and examples',
    'more-persuasive': 'Make this more compelling and benefit-focused',
  };

  const goal = params.goal || 'clearer';

  const prompt = `
${goals[goal]}.

Original text:
${params.text}

Improved version:
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Writing improvement error:', error);
    throw new Error('Failed to improve writing');
  }
}
