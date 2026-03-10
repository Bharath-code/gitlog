# GitLog Design System Documentation

## Overview

Premium dark/light theme landing page with sophisticated micro-interactions, scroll animations, and a polished user experience inspired by Linear, Raycast, and Arc Browser.

---

## 🎨 Design Tokens

### Color Palette

#### Dark Theme (Default)

```css
--background: #0a0a0b --foreground: #fafafa --surface: #141416 --surface-elevated: #1a1a1d
  --surface-highlight: #222226 --muted: #8a8a92 --muted-strong: #a1a1aa
  --line: rgba(255, 255, 255, 0.06) --line-strong: rgba(255, 255, 255, 0.12) --accent: #ff6b35
  --accent-glow: rgba(255, 107, 53, 0.4) --success: #10b981 --purple: #8b5cf6 --blue: #3b82f6;
```

#### Light Theme

```css
--background: #ffffff --foreground: #0a0a0b --surface: #f7f7f8 --surface-elevated: #ffffff
  --surface-highlight: #f0f0f2 --muted: #71717a --muted-strong: #52525b --line: rgba(0, 0, 0, 0.08)
  --line-strong: rgba(0, 0, 0, 0.15);
```

### Typography

- **Display**: Large headlines (5xl-7xl) with tight tracking
- **Body**: Base size with relaxed leading
- **Mono**: Technical elements, badges, metadata

### Shadows

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3) --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4) --shadow-lg: 0
  16px 48px rgba(0, 0, 0, 0.5) --shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.6) --glow-accent: 0 0 80px
  rgba(255, 107, 53, 0.15);
```

---

## ✨ Micro-Interactions

### 1. **Logo Mark**

- **Effect**: Scale + rotate on hover
- **Animation**: `transform: scale(1.1) rotate(-5deg)`
- **Shadow**: Intensifies on hover
- **Duration**: 300ms cubic-bezier

### 2. **Navigation Bar**

- **Effect**: Lift + shadow intensify
- **Animation**: `translateY(-1px)` on hover
- **Backdrop**: Glassmorphic blur effect

### 3. **Eyebrow Badge**

- **Effect**: Scale + border color change
- **Animation**: `scale(1.02)` + accent border
- **Pulse**: Animated dot indicator

### 4. **Pill Badges**

- **Effect**: Background + border transition
- **States**: Default, hover, accent, success
- **Animation**: 200ms ease

### 5. **Feature Cards**

- **Effect**: Multi-layer interaction
  - Lift: `translateY(-6px) scale(1.01)`
  - Top border gradient appears
  - Mouse-tracking glow follows cursor
  - Icon scales + rotates
- **Duration**: 400ms cubic-bezier
- **Stagger**: Adjacent cards dim on hover

### 6. **Workflow Steps**

- **Effect**: Slide right + accent bar grows
- **Animation**:
  - Card: `translateX(8px)`
  - Number: Scale + rotate + gradient background
  - Left border: Height 0% → 100%
- **Duration**: 400ms cubic-bezier

### 7. **Pricing Cards**

- **Effect**: Lift + shimmer sweep
- **Animation**:
  - Card: `translateY(-8px) scale(1.02)`
  - Shimmer: Left to right sweep
  - Pro badge: Float animation
- **Duration**: 500ms cubic-bezier

### 8. **FAQ Items**

- **Effect**: Slide right + icon rotate
- **Animation**:
  - Card: `translateX(4px)`
  - Icon: Rotate 45° + background + glow
  - Content: Slide-down animation
- **Duration**: 300-400ms

### 9. **Buttons**

- **Effect**: Shimmer sweep + scale on click
- **Animation**:
  - Hover: Shimmer left → right
  - Active: `scale(0.98)`
- **Duration**: 600ms sweep, 150ms click

### 10. **Theme Toggle**

- **Effect**: Rotate + scale
- **Animation**: `rotate(15deg) scale(1.1)`
- **Icons**: Sun / Moon switch

---

## 🎬 Scroll Animations

### GSAP ScrollTrigger Implementation

#### Hero Section

```javascript
// Hero copy: Stagger fade-up
gsap.fromTo(
  '[data-hero-copy] > *',
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, duration: 1, stagger: 0.15 }
);

// Hero card: 3D entrance
gsap.fromTo(
  '[data-hero-card]',
  { opacity: 0, y: 60, scale: 0.95, rotateX: 10 },
  { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.2 }
);

// Proof strip: Stagger fade-up
gsap.fromTo(
  '[data-proof-item]',
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }
);
```

#### Workflow Section

```javascript
gsap.fromTo(
  '.workflow-step',
  { opacity: 0, x: -40 },
  {
    opacity: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.15,
    scrollTrigger: { trigger: section, start: 'top 75%' },
  }
);
```

#### Feature Section

```javascript
gsap.fromTo(
  '.feature-card',
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    scrollTrigger: { trigger: section, start: 'top 75%' },
  }
);
```

#### Pricing Section

```javascript
gsap.fromTo(
  '.pricing-card',
  { opacity: 0, scale: 0.9 },
  {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: { trigger: section, start: 'top 75%' },
  }
);
```

#### FAQ Section

```javascript
gsap.fromTo(
  '.faq-item',
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    scrollTrigger: { trigger: section, start: 'top 75%' },
  }
);
```

#### CTA Section

```javascript
gsap.fromTo(
  '.cta-shell',
  { opacity: 0, scale: 0.95 },
  { opacity: 1, scale: 1, duration: 1, scrollTrigger: { trigger: section, start: 'top 75%' } }
);
```

### Parallax Effects

```javascript
// Hero glows move on scroll
gsap.to('.hero-glow-1', {
  yPercent: 20,
  scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: 1 },
});

gsap.to('.hero-glow-2', {
  yPercent: -20,
  scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: 1 },
});
```

---

## 🎯 Key Animations

### Float Animation

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

**Used on**: Pricing badge, floating elements

### Pulse Glow

```css
@keyframes pulse-glow {
  0%, 100% { opacity: 0.4, transform: scale(1); }
  50% { opacity: 0.7, transform: scale(1.05); }
}
```

**Used on**: Hero glows, accent elements

### Shimmer

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

**Used on**: Buttons, loading states

### Border Pulse (Pro Pricing)

```css
@keyframes border-pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}
```

**Used on**: Pro pricing card glow

### Rotate Gradient (CTA)

```css
@keyframes rotate-gradient {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

**Used on**: CTA section background

### Slide Down (FAQ Content)

```css
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Used on**: FAQ answer text

---

## 🌓 Theme System

### Toggle Implementation

```tsx
const [isDark, setIsDark] = useState(true);

const toggleTheme = () => {
  const newTheme = !isDark;
  setIsDark(newTheme);
  document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
};
```

### CSS Variable Switching

```css
[data-theme='light'] {
  --background: #ffffff;
  --foreground: #0a0a0b;
  /* ... all variables override */
}
```

### Transition

```css
body {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
```

---

## 🎨 Component States

### Feature Card

| State   | Effect                                                     |
| :------ | :--------------------------------------------------------- |
| Default | Border, surface background                                 |
| Hover   | Lift, top border glow, mouse-tracking glow, icon transform |
| Active  | N/A (no click state)                                       |

### Workflow Step

| State   | Effect                                                |
| :------ | :---------------------------------------------------- |
| Default | Border, surface background                            |
| Hover   | Slide right, left accent bar grows, number transforms |

### Pricing Card

| State   | Effect                                |
| :------ | :------------------------------------ |
| Default | Border, surface background            |
| Hover   | Lift, shimmer sweep, shadow intensify |
| Pro     | Ambient glow, border pulse animation  |

### FAQ Item

| State   | Effect                                       |
| :------ | :------------------------------------------- |
| Default | Border, surface background                   |
| Hover   | Slide right, background change               |
| Open    | Icon rotates 45°, glows, content slides down |

---

## 📱 Responsive Behavior

### Breakpoints

- **Mobile**: < 768px
- **Desktop**: ≥ 768px

### Mobile Adjustments

```css
@media (max-width: 767px) {
  .workflow-step {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .workflow-number {
    height: 2.5rem;
    width: 2.5rem;
    font-size: 1.25rem;
  }
}
```

### Reduced Motion

```javascript
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  // Skip animations, add revealed class immediately
}
```

---

## 🚀 Performance Optimizations

1. **GPU Acceleration**: Use `transform` and `opacity` for animations
2. **Will-change**: Applied to animated elements
3. **Debounce**: Scroll triggers use `once: true` where possible
4. **Context Cleanup**: GSAP contexts revert on unmount
5. **CSS Transitions**: Preferred over JS animations for simple effects

---

## 🎯 Usage Guidelines

### When to Use Animations

- **Hero**: Full animation suite on load
- **Sections**: Reveal on scroll (once)
- **Interactive elements**: Hover states
- **Feedback**: Click/active states

### When to Skip

- **Reduced motion**: User preference respected
- **Mobile**: Reduce complex animations
- **Above fold**: Minimize initial load animations

---

## 📋 Checklist for New Components

- [ ] Hover state defined
- [ ] Active/click state (if interactive)
- [ ] Scroll reveal animation
- [ ] Responsive behavior
- [ ] Reduced motion support
- [ ] Dark/light theme support
- [ ] Transition timing (cubic-bezier)
- [ ] Performance (GPU-accelerated properties)

---

_Last updated: 2026-03-08 | Version: 2.0_
