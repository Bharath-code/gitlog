import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface LinkedInPost {
  post: string;
  hashtags: string[];
  cta: string;
}

export async function generateLinkedInPost(
  title: string,
  description: string,
  category: string
): Promise<LinkedInPost> {
  if (!genAI) {
    throw new Error('Google AI API key not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a professional content writer creating a LinkedIn post for a product update.

Rules:
- Write 1000-1300 characters (count carefully!)
- Professional but approachable tone
- Start with a strong hook (first 2 lines are critical)
- Use short paragraphs and white space for readability
- Explain the problem and how this update solves it
- Include business impact and benefits
- Add 3-5 relevant hashtags at the end
- End with a clear call-to-action and link placeholder
- Use 1-2 emojis maximum (professional context)
- Focus on value for users/customers

Changelog Entry:
Title: ${title}
Category: ${category}
Description: ${description || 'No description provided'}

Generate a LinkedIn post as JSON:
{
  "post": "the full post text",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "cta": "Call to action text"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate post length
    const postLength = parsed.post?.length || 0;
    if (postLength < 800 || postLength > 1500) {
      console.warn(`LinkedIn post length (${postLength}) outside optimal range`);
    }

    return {
      post: parsed.post || '',
      hashtags: parsed.hashtags || [],
      cta: parsed.cta || 'Learn more',
    };
  } catch (error) {
    console.error('Error generating LinkedIn post:', error);
    throw new Error('Failed to generate LinkedIn post');
  }
}

export function getEstimatedCharacters(post: string): number {
  return post.length;
}

export function validatePostLength(post: string): boolean {
  const length = post.length;
  return length >= 800 && length <= 1300;
}

export function getPostLengthStatus(post: string): 'too-short' | 'good' | 'too-long' {
  const length = post.length;
  if (length < 800) return 'too-short';
  if (length > 1300) return 'too-long';
  return 'good';
}
