import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface TwitterThread {
  tweets: string[];
  hashtags: string[];
  tone: 'professional' | 'casual' | 'exciting';
}

const toneInstructions = {
  professional: 'Use a professional, authoritative tone. Focus on business value and impact.',
  casual: 'Use a friendly, conversational tone. Like you\'re talking to a friend.',
  exciting: 'Use an enthusiastic, energetic tone. Build excitement and hype.',
};

export async function generateTwitterThread(
  title: string,
  description: string,
  category: string,
  tone: TwitterThread['tone'] = 'professional'
): Promise<TwitterThread> {
  if (!genAI) {
    throw new Error('Google AI API key not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a social media manager creating a Twitter thread for a product changelog.

Rules:
- Create 2-5 tweets that tell a compelling story
- Each tweet must be ≤280 characters (count carefully!)
- Use engaging language with 2-3 emojis total
- Include 2-3 relevant hashtags at the end of the last tweet
- ${toneInstructions[tone]}
- Focus on what changed for the USER, not technical details
- Start with a hook that grabs attention
- End with a call-to-action

Changelog Entry:
Title: ${title}
Category: ${category}
Description: ${description || 'No description provided'}

Generate a Twitter thread as JSON:
{
  "tweets": ["tweet 1", "tweet 2", ...],
  "hashtags": ["#hashtag1", "#hashtag2"]
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
    
    // Validate tweets are under 280 characters
    const validTweets = parsed.tweets.filter((tweet: string) => tweet.length <= 280);
    
    return {
      tweets: validTweets,
      hashtags: parsed.hashtags || [],
      tone,
    };
  } catch (error) {
    console.error('Error generating Twitter thread:', error);
    throw new Error('Failed to generate Twitter thread');
  }
}

export function getEstimatedCharacters(tweets: string[]): number {
  return tweets.reduce((sum, tweet) => sum + tweet.length, 0);
}

export function validateTweetLength(tweet: string): boolean {
  return tweet.length <= 280;
}

export function getRemainingCharacters(tweet: string): number {
  return 280 - tweet.length;
}
