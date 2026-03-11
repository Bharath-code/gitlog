import { cn } from '@/shared/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function NotFoundIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className={cn('w-full h-full', className)}>
      <defs>
        <linearGradient id="404-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="404-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 107, 53, 0.4)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.4)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background Orbits */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="url(#404-glow)"
        strokeWidth="1"
        strokeDasharray="4 8"
        className="animate-[spin_20s_linear_infinite]"
      />
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="url(#404-glow)"
        strokeWidth="1"
        strokeDasharray="8 8"
        className="animate-[spin_15s_linear_infinite_reverse]"
      />

      {/* Main Element - Animated Planet */}
      <g className="animate-float" style={{ animationDuration: '4s' }}>
        <circle cx="100" cy="100" r="40" fill="url(#404-grad)" filter="url(#glow)" />
        <path
          d="M70 90 Q100 70 130 90"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          className="opacity-80"
        />
        <path
          d="M65 110 Q100 130 135 110"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          className="opacity-80"
        />
        {/* Satellites */}
        <circle cx="45" cy="80" r="8" fill="white" className="animate-pulse" />
        <circle
          cx="145"
          cy="120"
          r="5"
          fill="white"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </g>
    </svg>
  );
}

export function ErrorIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className={cn('w-full h-full', className)}>
      <defs>
        <linearGradient id="error-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="error-glow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glitch lines */}
      <g className="animate-pulse" style={{ animationDuration: '0.5s' }}>
        <rect x="20" y="40" width="160" height="2" fill="#ef4444" opacity="0.2" />
        <rect x="40" y="80" width="120" height="4" fill="#ef4444" opacity="0.3" />
        <rect x="10" y="140" width="180" height="2" fill="#ef4444" opacity="0.2" />
      </g>

      {/* Broken Gear */}
      <g className="animate-float" style={{ animationDuration: '3s' }}>
        <path
          d="M100 40 
                 A 60 60 0 1 1 99.9 40 Z"
          fill="none"
          stroke="url(#error-grad)"
          strokeWidth="16"
          strokeDasharray="30 10"
          filter="url(#error-glow)"
        />
        {/* Core */}
        <circle cx="100" cy="100" r="25" fill="none" stroke="url(#error-grad)" strokeWidth="8" />
        {/* Lightning bolt / break */}
        <path d="M110 50 L90 100 L110 100 L85 150 L115 110 L95 110 Z" fill="white" />
      </g>
    </svg>
  );
}

export function OnboardingIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className={cn('w-full h-full', className)}>
      <defs>
        <linearGradient id="rocket-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="rocket-window" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="rocket-flame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Stars/Particles */}
      <g
        className="animate-slide-up-fade"
        style={{ animationIterationCount: 'infinite', animationDuration: '3s' }}
      >
        <circle cx="40" cy="60" r="2" fill="#8b5cf6" />
        <circle cx="160" cy="40" r="3" fill="#ff6b35" />
        <circle cx="140" cy="140" r="2" fill="#3b82f6" />
        <circle cx="30" cy="120" r="1.5" fill="#f59e0b" />
      </g>

      <g className="animate-float" style={{ animationDuration: '2.5s' }}>
        {/* Engine Exhaust/Flame */}
        <path
          d="M80 140 Q100 190 120 140 Q100 160 80 140"
          fill="url(#rocket-flame)"
          className="animate-pulse"
          style={{ transformOrigin: '100px 140px', animationDuration: '0.4s' }}
        />

        {/* Rocket Fins */}
        <path d="M70 110 L40 140 L75 140 Z" fill="#8b5cf6" />
        <path d="M130 110 L160 140 L125 140 Z" fill="#8b5cf6" />

        {/* Rocket Body */}
        <path d="M100 30 Q140 70 130 140 L70 140 Q60 70 100 30" fill="url(#rocket-body)" />

        {/* Center Fin */}
        <path d="M100 110 L90 140 L110 140 Z" fill="#6d28d9" />

        {/* Window */}
        <circle cx="100" cy="85" r="16" fill="#cbd5e1" />
        <circle cx="100" cy="85" r="12" fill="url(#rocket-window)" />

        {/* Window Shine */}
        <path d="M92 77 Q100 73 108 77 Q100 85 92 77" fill="rgba(255,255,255,0.6)" />
      </g>
    </svg>
  );
}

export function LoadingIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn('w-full h-full', className)}>
      <defs>
        <linearGradient id="load-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Magical expanding rings */}
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="url(#load-grad)"
        strokeWidth="4"
        className="animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
        opacity="0.5"
      />
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="url(#load-grad)"
        strokeWidth="6"
        className="animate-[spin_1.5s_ease-in-out_infinite]"
        strokeLinecap="round"
        strokeDasharray="30 80"
      />
      <circle cx="50" cy="50" r="10" fill="url(#load-grad)" className="animate-pulse" />
    </svg>
  );
}
