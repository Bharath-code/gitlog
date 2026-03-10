import {
  ArrowRight,
  Bot,
  GitPullRequestArrow,
  LayoutPanelTop,
  ShieldCheck,
  Globe,
  Share2,
  Mail,
  BarChart3,
  Map,
  Github,
  Rss,
  Users,
  Sparkles,
} from 'lucide-react';

export const heroStats = [
  { label: 'Draft in', value: '< 30s' },
  { label: 'Manual writing', value: '0 steps' },
  { label: 'Free plan', value: '50 entries' },
  { label: 'Phase 2 features', value: '20+' },
] as const;

export const trustSignals = [
  'Built for SaaS founders shipping weekly',
  'Private and public GitHub repos',
  'Review before publish, always',
  '100+ beta users trust GitLog',
] as const;

export const proofStrip = [
  'Merged PRs become structured drafts',
  'AI rewrites technical detail into user language',
  'A public changelog page is included out of the box',
  'Auto-generate social posts + email digests',
  'Embeddable widget for your website',
] as const;

export const steps = [
  {
    number: '01',
    title: 'Connect your repo',
    description:
      'GitLog watches merged pull requests and captures the release context your team already writes in GitHub.',
  },
  {
    number: '02',
    title: 'Review the draft',
    description:
      'Titles, labels, descriptions, and merge metadata become a clean draft instead of another task in your backlog.',
  },
  {
    number: '03',
    title: 'AI rewrite (optional)',
    description:
      'AI translates technical PR descriptions into plain English. Choose tone: Professional, Casual, or Exciting.',
  },
  {
    number: '04',
    title: 'Publish everywhere',
    description:
      'One click publishes to your changelog, generates social posts, sends email digests, and updates your roadmap.',
  },
  {
    number: '05',
    title: 'Track & engage',
    description:
      "Analytics show who's reading. Users can upvote entries. Roadmap shows what's coming next.",
  },
] as const;

export const featureCards = [
  {
    icon: GitPullRequestArrow,
    title: 'GitHub-native input',
    description:
      'Use the source material you already have: PR titles, labels, body content, merge date, author, and link back to the original change.',
  },
  {
    icon: Bot,
    title: 'Plain-English rewrites',
    description:
      'Turn implementation language into user-facing updates without sounding robotic or overly technical.',
  },
  {
    icon: Globe,
    title: 'Embeddable widget',
    description:
      "Add a 'What's New' badge to your website in 1 line of code. Customizable colors, position, and size.",
    phase2: true,
  },
  {
    icon: Share2,
    title: 'Social post drafts',
    description:
      'Auto-generate Twitter threads and LinkedIn posts from changelog entries. AI-powered, ready to post.',
    phase2: true,
  },
  {
    icon: Mail,
    title: 'Email digests',
    description:
      'Users subscribe to your changelog. Beautiful HTML emails sent automatically when you publish.',
    phase2: true,
  },
  {
    icon: BarChart3,
    title: 'Analytics dashboard',
    description:
      'Track page views, unique visitors, most viewed entries, and upvotes. See what users care about.',
    phase2: true,
  },
  {
    icon: Map,
    title: 'Public roadmap',
    description:
      'GitHub Issues become roadmap cards. Users vote on features. Auto-publish when completed.',
    phase2: true,
  },
  {
    icon: Github,
    title: 'Enhanced changelog pages',
    description:
      'GitHub metadata (avatar, stars, forks), social sharing buttons, RSS feeds, and SEO optimized.',
    phase2: true,
  },
] as const;

export const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    priceUsd: '$0',
    cadence: '/mo',
    description: 'Best for open source projects, beta products, and testing the workflow.',
    features: [
      '50 changelog entries per month',
      '1 connected repo',
      'Public changelog page',
      '50 AI rewrites per month',
      'All Phase 2 features included',
      'Embeddable widget',
      'Social post drafts',
      'Email digests',
      'Analytics dashboard',
      'Public roadmap',
    ],
    cta: 'Start free',
    emphasis: false,
  },
  {
    name: 'Pro',
    price: '₹499',
    priceUsd: '$19',
    cadence: '/mo',
    description: 'For products shipping often enough that release communication cannot slip.',
    features: [
      'Unlimited changelog entries',
      'Unlimited repos',
      'Unlimited AI rewrites',
      'Remove GitLog branding',
      'Priority support',
      'Early access to new features',
      'Custom domains (coming soon)',
      'Team seats (coming soon)',
    ],
    cta: 'Start Pro trial',
    emphasis: true,
    badge: 'Most Popular',
  },
] as const;

export const faqs = [
  {
    question: 'Does GitLog work with private repositories?',
    answer:
      'Yes. Private and public GitHub repos are both supported. Only the entries you choose to publish become public.',
  },
  {
    question: 'Can I edit the copy before publishing?',
    answer:
      'Yes. Every synced update starts as a draft, so you can adjust the wording, category, and publish timing before anything goes live.',
  },
  {
    question: 'How is this different from GitHub Releases?',
    answer:
      'GitHub Releases are technical release notes for developers. GitLog is a user-facing communication layer for customers and prospects.',
  },
  {
    question: "What's included in Phase 2?",
    answer:
      'Phase 2 adds 20 new features: embeddable widget, social post drafts (Twitter + LinkedIn), email digests, analytics dashboard, and public roadmap from GitHub Issues. All included in Free and Pro plans.',
  },
  {
    question: 'Can I embed the widget on my website?',
    answer:
      'Yes! Generate a widget in your dashboard, copy 1 line of code, and paste it before your </body> tag. Fully customizable colors, position, and size.',
  },
  {
    question: 'Do you support email digests?',
    answer:
      'Yes. Users can subscribe to your changelog. When you publish, beautiful HTML emails are sent automatically. Resend + Mailchimp integration included.',
  },
  {
    question: 'Is there an analytics dashboard?',
    answer:
      'Yes. Track page views, unique visitors, most viewed entries, and upvotes. See what your users care about most.',
  },
] as const;

export const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Widget', href: '/widget' },
    { label: 'Analytics', href: '/analytics/widgets' },
    { label: 'Roadmap', href: '/roadmap' },
  ],
  resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'Status', href: '/status' },
    { label: 'Blog', href: '/blog' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: 'mailto:hello@gitlog.app' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
  social: [
    { label: 'Twitter/X', href: 'https://twitter.com/gitlogapp' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/gitlog' },
    { label: 'GitHub', href: 'https://github.com/gitlog-app' },
    { label: 'Discord', href: 'https://discord.gg/gitlog' },
  ],
} as const;

export const heroCtas = [
  { label: 'Start free - No credit card', href: '/sign-up', icon: ArrowRight },
  { label: 'Watch 2-min demo', href: '#workflow' },
] as const;

export const founderQuote = {
  quote:
    'The problem was never motivation. The problem was asking founders to write the same release twice.',
  author: 'GitLog founder',
  role: 'Building release communication for product teams',
} as const;
