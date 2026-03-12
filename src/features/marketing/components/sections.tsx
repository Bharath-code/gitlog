'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronRight, GitMerge, Sparkles, Moon, Sun } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Button } from '@/shared/components/ui/button';
import { SectionHeading } from '@/shared/components/ui/section-heading';
import { siteConfig } from '@/shared/config/site';

import {
  faqs,
  featureCards,
  footerLinks,
  founderQuote,
  heroCtas,
  heroStats,
  pricingPlans,
  proofStrip,
  steps,
  trustSignals,
} from '../content/site-content';

gsap.registerPlugin(ScrollTrigger);

export function SiteHeader() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="premium-nav">
        <Link className="flex items-center gap-3" href="/">
          <div className="logo-mark">
            <GitMerge className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-foreground">GitLog</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted lg:flex">
          <Link className="transition-colors" href="#workflow">
            Workflow
          </Link>
          <Link className="transition-colors" href="#features">
            Features
          </Link>
          <Link className="transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="transition-colors" href="#faq">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="theme-toggle hidden sm:flex"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link href="#waitlist">
            <Button className="hidden sm:inline-flex">Get beta access</Button>
            <Button className="sm:hidden" variant="secondary">
              Beta
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // Hero copy animation
      gsap.fromTo(
        '[data-hero-copy] > *',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );

      // Hero card animation
      gsap.fromTo(
        '[data-hero-card]',
        { opacity: 0, y: 60, scale: 0.95, rotateX: 10 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.3,
        }
      );

      // Proof strip animation
      gsap.fromTo(
        '[data-proof-item]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          delay: 0.8,
        }
      );

      // Floating elements
      gsap.to('.hero-glow-1', {
        x: 20,
        y: -20,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.hero-glow-2', {
        x: -20,
        y: 20,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse tracking for glow effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <section
      ref={heroRef}
      className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24"
    >
      {/* Animated background glows */}
      <div className="hero-glow-1 absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent-glow blur-3xl opacity-30" />
      <div className="hero-glow-2 absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-glow blur-3xl opacity-20" />

      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="space-y-8" data-hero-copy>
          <div className="space-y-6">
            <span className="eyebrow eyebrow-accent inline-flex">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Trusted by 100+ founders
            </span>

            <h1 className="font-display text-5xl leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Your Changelog Writes Itself
              <span className="block gradient-text-accent">Zero Manual Writing. Zero BS.</span>
            </h1>

            <p className="body-balance max-w-xl text-lg leading-relaxed text-muted">
              Merge a PR. GitLog handles the rest. Auto-generate changelogs, social posts, email
              digests, and roadmap updates. Save 5 hours every week.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {heroCtas.map((cta) => (
              <Link href={cta.href} key={cta.label}>
                <Button
                  className="w-full sm:w-auto hover-lift"
                  size="lg"
                  variant={
                    cta.label.includes('Join') || cta.label.includes('beta')
                      ? 'primary'
                      : 'secondary'
                  }
                >
                  {cta.label}
                  {'icon' in cta && cta.icon ? <cta.icon className="h-4 w-4" /> : null}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {trustSignals.map((signal) => (
              <span className="pill pill-soft hover-lift" key={signal}>
                {signal}
              </span>
            ))}
          </div>

          <dl className="grid grid-cols-3 gap-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-xl bg-surface p-4 border border-line transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent-glow/10 hover:-translate-y-1"
              >
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-2xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Hero Visual */}
        <div className="relative" data-hero-card onMouseMove={handleMouseMove}>
          {/* Main card */}
          <div
            className="feature-card glow-on-hover"
            style={{ padding: 0, border: '1px solid var(--line-strong)' }}
          >
            {/* Browser bar */}
            <div className="flex items-center justify-between border-b border-line bg-surface-highlight px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500 hover:scale-125 transition-transform cursor-pointer" />
                <span className="h-3 w-3 rounded-full bg-yellow-500 hover:scale-125 transition-transform cursor-pointer" />
                <span className="h-3 w-3 rounded-full bg-green-500 hover:scale-125 transition-transform cursor-pointer" />
              </div>
              <div className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
                gitlog.app/acme/mailpilot
              </div>
            </div>

            {/* Content */}
            <div className="grid gap-4 p-6 lg:grid-cols-[180px_1fr]">
              {/* Sidebar */}
              <div className="space-y-3">
                <div className="rounded-xl border border-line bg-surface-highlight p-4 hover:border-accent/50 transition-colors">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    Incoming draft
                  </div>
                  <div className="mt-2 text-sm font-semibold text-foreground">
                    feat: add weekly digest controls
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="pill pill-accent">New</span>
                    <span className="pill pill-success">AI ready</span>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface-highlight p-4 hover:border-purple/50 transition-colors">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    Why it works
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Technical detail stays in GitHub. Public update focuses on user value.
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-line bg-surface-elevated p-5 hover:border-success/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      Public changelog
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">
                      Added weekly digest controls
                    </h3>
                  </div>
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success animate-pulse">
                    Live
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Users can now switch digest delivery to daily, weekly, or paused from settings.
                  Preferences save instantly and apply to future updates.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="pill pill-accent hover-lift">New</span>
                  <span className="pill pill-soft hover-lift">Published from draft</span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-line bg-surface p-3 hover:border-accent/50 transition-colors">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-muted">
                      Source
                    </div>
                    <div className="mt-1.5 text-xs font-medium text-foreground">
                      pull_request.closed
                    </div>
                  </div>
                  <div className="rounded-lg border border-line bg-surface p-3 hover:border-blue/50 transition-colors">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-muted">
                      Captured
                    </div>
                    <div className="mt-1.5 text-xs font-medium text-foreground">
                      title, labels, body
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-full border border-line bg-surface-elevated px-4 py-2.5 shadow-lg hover:scale-105 transition-transform cursor-default">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              <span className="text-xs font-semibold text-foreground">AI rewrite ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proof strip */}
      <div className="mt-12 grid gap-3 md:grid-cols-3" data-proof-row>
        {proofStrip.map((item, index) => (
          <div
            className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 hover:border-accent/50 hover:bg-surface-elevated transition-all duration-300 hover:-translate-y-1"
            data-proof-item
            key={item}
          >
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span className="text-sm text-muted">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.workflow-step',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      id="workflow"
    >
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Workflow"
            title="One tight loop from merged PR to published update."
            description="GitLog removes the extra writing pass that makes changelog pages go stale."
          />
          <div className="rounded-xl border border-line bg-surface p-5 hover:border-accent/50 transition-colors">
            <p className="text-base leading-relaxed text-foreground">"{founderQuote.quote}"</p>
            <div className="mt-3 text-sm text-muted">
              {founderQuote.author} · {founderQuote.role}
            </div>
          </div>
        </div>

        <div className="workflow-grid">
          {steps.map((step, index) => (
            <article
              className="workflow-step"
              key={step.number}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="workflow-number">{step.number}</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      id="features"
    >
      <SectionHeading
        eyebrow="Features"
        title="Everything needed for high-quality changelog workflow."
        description="No bloated feature list. Just the core pieces to capture, rewrite, review, and publish."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {featureCards.map((feature, index) => (
          <article
            className={`feature-card ${index === 0 ? 'feature-card-primary' : ''}`}
            data-card
            key={feature.title}
            onMouseMove={handleMouseMove}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div
              className={`feature-icon ${
                index === 0
                  ? ''
                  : feature.title.includes('GitHub')
                    ? ''
                    : feature.title.includes('Plain')
                      ? 'feature-icon-purple'
                      : feature.title.includes('Public')
                        ? 'feature-icon-blue'
                        : 'feature-icon-success'
              }`}
            >
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pricing-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      id="pricing"
    >
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple pricing for teams that ship often."
            description="Start free. Upgrade when release communication becomes part of your rhythm."
          />
          <div className="rounded-xl border border-line bg-surface p-5 hover:border-purple/50 transition-colors">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Positioning
            </div>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              No enterprise tier, no sales call, no complicated seat model. Built for small product
              teams and indie founders.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {pricingPlans.map((plan, index) => (
            <article
              className={`pricing-card ${plan.emphasis ? 'pricing-card-pro' : ''}`}
              data-card
              key={plan.name}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              {plan.emphasis && <span className="pricing-badge">Recommended</span>}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    {plan.emphasis ? 'Best Value' : 'Plan'}
                  </div>
                  <h3 className="mt-3 text-3xl font-semibold text-foreground">{plan.name}</h3>
                </div>
                {plan.emphasis && (
                  <span className="pill pill-accent hover-lift">For weekly shippers</span>
                )}
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="font-display text-6xl leading-none tracking-tight text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted pb-2 text-sm">{plan.cadence}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <li
                    className="flex items-start gap-3 text-sm leading-relaxed text-muted"
                    key={feature}
                    style={{ transitionDelay: `${index * 0.1 + i * 0.05}s` }}
                  >
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.emphasis ? 'text-accent' : 'text-success'}`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link href="#waitlist">
                  <Button
                    className={`w-full hover-lift ${plan.emphasis ? '' : 'bg-surface-highlight hover:bg-surface-elevated'}`}
                    size="lg"
                    variant={plan.emphasis ? 'primary' : 'secondary'}
                  >
                    {plan.cta}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      id="faq"
    >
      <SectionHeading
        align="center"
        eyebrow="FAQ"
        title="A few answers before you try it."
        description="Private repos work. Drafts stay under your control. Built for users, not just devs."
      />

      <div className="mx-auto mt-12 grid max-w-3xl gap-3">
        {faqs.map((item, index) => (
          <details
            className="faq-item"
            data-card
            key={item.question}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <summary>
              {item.question}
              <span className="faq-icon">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      // Show immediately if motion reduced
      gsap.set('.cta-shell', { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-shell',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      id="waitlist"
    >
      <div className="cta-shell opacity-100">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="eyebrow">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Get started free
            </span>
            <h2 className="font-display text-5xl leading-tight tracking-tight text-foreground sm:text-6xl">
              Stop writing the same release twice.
            </h2>
            <p className="body-balance max-w-xl text-lg leading-relaxed text-muted">
              Join founders using GitLog to turn merged PRs into a public
              changelog that stays current without extra work.
            </p>
          </div>

          <div className="cta-card hover-lift">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Free to start
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">
              Your changelog in 2 minutes.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Sign up, connect a GitHub repo, and publish your first changelog entry. No credit card required.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/sign-up">
                <Button className="w-full hover-lift" size="lg">
                  Sign up free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  className="w-full"
                  size="lg"
                  variant="secondary"
                >
                  Already have an account? Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ email }: { email: string }) {
  return (
    <footer className="mx-auto mt-8 max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="footer-shell">
        <div>
          <div className="font-display text-4xl font-bold tracking-tight text-foreground">
            GitLog
          </div>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
            Auto-changelog infrastructure for teams shipping through GitHub.
          </p>
          <Link
            className="mt-4 inline-flex text-sm font-semibold text-foreground underline decoration-accent/40 underline-offset-4 hover:text-accent transition-colors"
            href={email}
          >
            hello@gitlog.app
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Product
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    className="hover:text-accent transition-colors hover:translate-x-1 inline-block transform"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Company
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    className="hover:text-accent transition-colors hover:translate-x-1 inline-block transform"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
