"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { siteConfig } from "@/shared/config/site";

import {
  FaqSection,
  FeatureSection,
  FinalCtaSection,
  HeroSection,
  PricingSection,
  SiteFooter,
  SiteHeader,
  WorkflowSection,
} from "./sections";

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // Add revealed class immediately if motion is reduced
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        el.classList.add("revealed");
      });
      return;
    }

    const context = gsap.context(() => {
      // Parallax effect for hero glows
      gsap.to(".hero-glow-1", {
        yPercent: 20,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-glow-2", {
        yPercent: -20,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Stagger animation for feature cards on hover
      gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card, index) => {
        card.addEventListener("mouseenter", () => {
          gsap.utils.toArray<HTMLElement>(".feature-card").forEach((otherCard, otherIndex) => {
            if (otherCard !== card) {
              gsap.to(otherCard, {
                scale: 0.98,
                opacity: 0.7,
                duration: 0.3,
              });
            }
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.utils.toArray<HTMLElement>(".feature-card").forEach((otherCard) => {
            gsap.to(otherCard, {
              scale: 1,
              opacity: 1,
              duration: 0.3,
            });
          });
        });
      });

      // Progress indicator for pricing cards
      gsap.utils.toArray<HTMLElement>(".pricing-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <main className="overflow-hidden pb-10 text-foreground" ref={rootRef}>
      <SiteHeader />
      <HeroSection />
      <WorkflowSection />
      <FeatureSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
      <SiteFooter email={siteConfig.links.contact} />
    </main>
  );
}
