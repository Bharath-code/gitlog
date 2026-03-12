import type { Metadata } from 'next';
import { Cormorant_Garamond, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';

import { siteConfig } from '@/shared/config/site';
import { Toaster } from '@/shared/components/ui/sonner';
import { ErrorBoundary } from '@/shared/components/common/error-boundary';
import { CommandPalette } from '@/shared/components/common/command-palette';

import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground outline-none">
            Skip to content
          </a>
          <ErrorBoundary>
            <CommandPalette />
            {children}
            <Toaster />
            <Analytics />
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}

