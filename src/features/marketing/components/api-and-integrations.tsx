'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Key, Bell, Code, Slack, Globe, Zap } from 'lucide-react';

import { SectionHeading } from '@/shared/components/ui/section-heading';

gsap.registerPlugin(ScrollTrigger);

export function ApiAndIntegrationsSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('revealed');
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Stagger animation for feature cards
      gsap.fromTo(
        '.api-feature-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.api-features-grid',
            start: 'top 80%',
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Key,
      title: 'Public API',
      description: 'Access your changelog programmatically with secure API keys.',
      useCase: 'Perfect for: External websites, Mobile apps, Integrations',
      color: 'accent',
    },
    {
      icon: Code,
      title: 'API Keys',
      description: 'Generate and manage API keys with fine-grained permissions.',
      useCase: 'Perfect for: Production apps, CI/CD pipelines, Automation',
      color: 'blue',
    },
    {
      icon: Slack,
      title: 'Slack Notifications',
      description: 'Get notified in Slack when changelog entries are published.',
      useCase: 'Perfect for: Team updates, Customer success, DevOps',
      color: 'purple',
    },
    {
      icon: Bell,
      title: 'Discord Notifications',
      description: 'Send updates to Discord channels automatically.',
      useCase: 'Perfect for: Community updates, Open source projects',
      color: 'success',
    },
    {
      icon: Globe,
      title: 'Webhooks Ready',
      description: 'Extend with custom webhooks for any platform.',
      useCase: 'Perfect for: Custom integrations, Enterprise workflows',
      color: 'amber',
    },
    {
      icon: Zap,
      title: 'Real-time Triggers',
      description: 'Instant notifications on publish, schedule, or release.',
      useCase: 'Perfect for: Time-sensitive updates, Team coordination',
      color: 'accent',
    },
  ];

  const colorClasses = {
    accent: 'from-accent to-accent/80 bg-accent/10 text-accent',
    blue: 'from-blue to-blue/80 bg-blue/10 text-blue',
    purple: 'from-purple to-purple/80 bg-purple/10 text-purple',
    success: 'from-success to-success/80 bg-success/10 text-success',
    amber: 'from-amber to-amber/80 bg-amber/10 text-amber',
  };

  return (
    <section
      ref={rootRef}
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      id="api-integrations"
    >
      <div className="max-w-2xl">
        <span className="eyebrow eyebrow-accent">Phase 4: API & Integrations</span>
        <h2 className="display-balance mt-5 font-display text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl text-foreground">
          Developer-Friendly API & Notifications
        </h2>
        <p className="body-balance mt-5 text-lg leading-8 text-muted">
          Access your changelog programmatically and get notified on your favorite platforms.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3 api-features-grid">
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className={`api-feature-card feature-card ${index === 0 ? 'lg:col-span-2' : ''}`}
            data-card="true"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div className={`feature-icon feature-icon-${feature.color}`}>
              <feature.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">{feature.description}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{feature.useCase}</p>
          </article>
        ))}
      </div>

      {/* API Example */}
      <div className="mt-16 rounded-2xl border border-line bg-surface p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
            <Code className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-foreground">📖 API Documentation</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Full REST API with comprehensive documentation. Authenticate with API keys and access
              your changelog from anywhere.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-line bg-surface-highlight p-4">
                <h4 className="font-medium mb-2">Authentication</h4>
                <pre className="text-xs font-mono text-muted overflow-x-auto">
                  Authorization: Bearer YOUR_API_KEY
                </pre>
              </div>
              <div className="rounded-lg border border-line bg-surface-highlight p-4">
                <h4 className="font-medium mb-2">Example Request</h4>
                <pre className="text-xs font-mono text-muted overflow-x-auto">
                  {`curl -X GET https://gitlog.app/api/public/v1/changelog \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </pre>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center rounded-md bg-success/10 px-3 py-1 text-sm text-success">
                ✅ Rate limiting
              </span>
              <span className="inline-flex items-center rounded-md bg-success/10 px-3 py-1 text-sm text-success">
                ✅ Secure authentication
              </span>
              <span className="inline-flex items-center rounded-md bg-success/10 px-3 py-1 text-sm text-success">
                ✅ Full documentation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Platforms */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {/* Slack */}
        <div className="rounded-2xl border border-purple/20 bg-purple/5 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Slack className="h-8 w-8 text-purple" />
            <h3 className="text-2xl font-semibold text-foreground">Slack Integration</h3>
          </div>
          <p className="text-muted mb-4">
            Get notified in your team's Slack channel whenever changelog entries are published.
          </p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Instant notifications on publish
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Scheduled digest notifications
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Release announcements
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Beautiful message formatting
            </li>
          </ul>
          <div className="mt-6">
            <p className="text-xs text-muted mb-2">Setup:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-muted">
              <li>Get webhook URL from Slack</li>
              <li>Add to GitLog Settings → Notifications</li>
              <li>Choose your triggers</li>
              <li>Done!</li>
            </ol>
          </div>
        </div>

        {/* Discord */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-8 w-8 text-accent" />
            <h3 className="text-2xl font-semibold text-foreground">Discord Integration</h3>
          </div>
          <p className="text-muted mb-4">
            Automatically send changelog updates to your Discord community.
          </p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Rich embed formatting
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Community notifications
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Customizable triggers
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              GitLog branding colors
            </li>
          </ul>
          <div className="mt-6">
            <p className="text-xs text-muted mb-2">Setup:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-muted">
              <li>Get webhook URL from Discord</li>
              <li>Add to GitLog Settings → Notifications</li>
              <li>Select notification events</li>
              <li>Done!</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
