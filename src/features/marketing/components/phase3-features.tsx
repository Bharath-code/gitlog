"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Package, Calendar, Tag, Filter } from "lucide-react";

import { SectionHeading } from "@/shared/components/ui/section-heading";

gsap.registerPlugin(ScrollTrigger);

export function Phase3FeaturesSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        el.classList.add("revealed");
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Stagger animation for feature cards
      gsap.fromTo(
        ".phase3-feature-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".phase3-features-grid",
            start: "top 80%",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Auto-Publish",
      description: "Merge → Published automatically. No manual review needed.",
      useCase: "Perfect for: Continuous deployment, Solo founders",
      color: "accent",
    },
    {
      icon: Package,
      title: "Batch Publish",
      description: "Select multiple drafts. Publish all at once.",
      useCase: "Perfect for: Weekly roundups, Team review",
      color: "blue",
    },
    {
      icon: Calendar,
      title: "Scheduled Publishing",
      description: "Weekly or monthly digests. Auto-publish at 9 AM UTC.",
      useCase: "Perfect for: 'This Week in [Product]', Monthly reports",
      color: "purple",
    },
    {
      icon: Tag,
      title: "Release Grouping",
      description: "Group PRs into v1.0.0, v1.1.0. Semantic versioning.",
      useCase: "Perfect for: Mobile apps, Enterprise software",
      color: "success",
      badge: "Coming Q2 2026",
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Exclude chores, tests, refactors. Include only user-facing changes.",
      useCase: "Perfect for: Clean changelogs, Professional appearance",
      color: "amber",
    },
  ];

  const colorClasses = {
    accent: "from-accent to-accent/80 bg-accent/10 text-accent",
    blue: "from-blue to-blue/80 bg-blue/10 text-blue",
    purple: "from-purple to-purple/80 bg-purple/10 text-purple",
    success: "from-success to-success/80 bg-success/10 text-success",
    amber: "from-amber to-amber/80 bg-amber/10 text-amber",
  };

  return (
    <section ref={rootRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24" id="flexible-publishing">
      <div className="max-w-2xl">
        <span className="eyebrow eyebrow-accent">Phase 3: Flexible Publishing</span>
        <h2 className="display-balance mt-5 font-display text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl text-foreground">
          Your Way, On Your Schedule
        </h2>
        <p className="body-balance mt-5 text-lg leading-8 text-muted">
          Choose how and when to publish. From per-PR to monthly digests, GitLog adapts to your workflow.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3 phase3-features-grid">
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className={`phase3-feature-card feature-card ${index === 0 ? 'lg:col-span-2' : ''}`}
            data-card="true"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div className={`feature-icon feature-icon-${feature.color}`}>
              <feature.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">{feature.description}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{feature.useCase}</p>
            {feature.badge && (
              <span className="mt-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {feature.badge}
              </span>
            )}
          </article>
        ))}
      </div>

      {/* Email Automation Highlight */}
      <div className="mt-16 rounded-2xl border border-line bg-surface p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
            <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-foreground">📧 Email Digest Automation</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Beautiful emails sent automatically. When you publish, subscribers are notified. Professional HTML templates, grouped by category, with "View Online" links and unsubscribe handling.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center rounded-md bg-surface-highlight px-3 py-1 text-sm text-muted">
                ✅ Professional templates
              </span>
              <span className="inline-flex items-center rounded-md bg-surface-highlight px-3 py-1 text-sm text-muted">
                ✅ Auto-send on publish
              </span>
              <span className="inline-flex items-center rounded-md bg-surface-highlight px-3 py-1 text-sm text-muted">
                ✅ Manual trigger available
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
