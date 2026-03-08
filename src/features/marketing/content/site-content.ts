import {
  ArrowRight,
  Bot,
  GitPullRequestArrow,
  LayoutPanelTop,
  ShieldCheck,
} from "lucide-react";

export const heroStats = [
  { label: "Draft in", value: "< 30s" },
  { label: "Manual writing", value: "0 steps" },
  { label: "Free plan", value: "50 entries" },
] as const;

export const trustSignals = [
  "Built for SaaS founders shipping weekly",
  "Private and public GitHub repos",
  "Review before publish, always",
] as const;

export const proofStrip = [
  "Merged PRs become structured drafts",
  "AI rewrites technical detail into user language",
  "A public changelog page is included out of the box",
] as const;

export const steps = [
  {
    number: "01",
    title: "Connect your repo",
    description:
      "GitLog watches merged pull requests and captures the release context your team already writes in GitHub.",
  },
  {
    number: "02",
    title: "Review the draft",
    description:
      "Titles, labels, descriptions, and merge metadata become a clean draft instead of another task in your backlog.",
  },
  {
    number: "03",
    title: "Publish the update",
    description:
      "AI translates the change into plain English. You approve it once and your public changelog stays current.",
  },
] as const;

export const featureCards = [
  {
    icon: GitPullRequestArrow,
    title: "GitHub-native input",
    description:
      "Use the source material you already have: PR titles, labels, body content, merge date, author, and link back to the original change.",
  },
  {
    icon: Bot,
    title: "Plain-English rewrites",
    description:
      "Turn implementation language into user-facing updates without sounding robotic or overly technical.",
  },
  {
    icon: LayoutPanelTop,
    title: "Public changelog included",
    description:
      "Every repo gets a polished changelog page that feels like part of the product, not an afterthought.",
  },
  {
    icon: ShieldCheck,
    title: "Draft-first control",
    description:
      "Nothing goes live automatically. Edit, re-categorize, or hold a draft until the timing is right.",
  },
] as const;

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    cadence: "/mo",
    description: "Best for open source projects, beta products, and testing the workflow.",
    features: [
      "50 changelog entries per month",
      "1 connected repo",
      "Public changelog page",
      "50 AI rewrites per month",
    ],
    cta: "Start free",
    emphasis: false,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/mo",
    description: "For products shipping often enough that release communication cannot slip.",
    features: [
      "Unlimited changelog entries",
      "Unlimited repos",
      "Remove GitLog branding",
      "Early access to future features",
    ],
    cta: "Start 14-day free trial",
    emphasis: true,
  },
] as const;

export const faqs = [
  {
    question: "Does GitLog work with private repositories?",
    answer:
      "Yes. Private and public GitHub repos are both supported. Only the entries you choose to publish become public.",
  },
  {
    question: "Can I edit the copy before publishing?",
    answer:
      "Yes. Every synced update starts as a draft, so you can adjust the wording, category, and publish timing before anything goes live.",
  },
  {
    question: "How is this different from GitHub Releases?",
    answer:
      "GitHub Releases are technical release notes for developers. GitLog is a user-facing communication layer for customers and prospects.",
  },
] as const;

export const footerLinks = {
  product: [
    { label: "Workflow", href: "#workflow" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ],
  company: [
    { label: "FAQ", href: "#faq" },
    { label: "Join beta", href: "#waitlist" },
    { label: "Email", href: "mailto:hello@gitlog.app" },
  ],
} as const;

export const heroCtas = [
  { label: "Join the beta", href: "#waitlist", icon: ArrowRight },
  { label: "See how it works", href: "#workflow" },
] as const;

export const founderQuote = {
  quote:
    "The problem was never motivation. The problem was asking founders to write the same release twice.",
  author: "GitLog founder",
  role: "Building release communication for product teams",
} as const;
