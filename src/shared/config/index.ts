// Environment variables with defaults
export const config = {
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  },
  kv: {
    url: process.env.VERCEL_KV_REST_API_URL!,
    token: process.env.VERCEL_KV_REST_API_TOKEN!,
  },
  github: {
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
  },
  ai: {
    googleApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
  },
  payment: {
    dodoApiKey: process.env.DODOPAYMENT_API_KEY || '',
    dodoWebhookSecret: process.env.DODOPAYMENT_WEBHOOK_SECRET || '',
    dodoProPlanId: process.env.DODOPAYMENT_PRO_PLAN_ID || '',
    dodoPublicKey: process.env.NEXT_PUBLIC_DODOPAYMENT_KEY || '',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
} as const;

export type Plan = 'free' | 'pro';

export const pricing = {
  free: {
    entriesPerMonth: 50,
    aiRewritesPerMonth: 50,
    connectedRepos: 1,
    priceINR: 0,
    priceUSD: 0,
  },
  pro: {
    entriesPerMonth: Infinity,
    aiRewritesPerMonth: Infinity,
    connectedRepos: Infinity,
    priceINR: 499,
    priceUSD: 19,
  },
} as const;
