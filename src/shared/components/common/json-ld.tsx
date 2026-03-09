import { siteConfig } from '@/shared/config/site';

interface SoftwareApplicationJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export function SoftwareApplicationJsonLd({
  name,
  description,
  url,
}: SoftwareApplicationJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface ChangelogJsonLdProps {
  repoName: string;
  entries: Array<{
    title: string;
    description: string;
    datePublished: string;
    url: string;
  }>;
}

export function ChangelogJsonLd({ repoName, entries }: ChangelogJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Changelog - ${repoName}`,
    description: `Latest updates and changelog for ${repoName}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: entries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TechArticle',
          headline: entry.title,
          description: entry.description,
          datePublished: entry.datePublished,
          url: entry.url,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    position: number;
    name: string;
    item: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo: string;
}

export function OrganizationJsonLd({ name, url, logo }: OrganizationJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs: [
      'https://twitter.com/gitlogapp',
      'https://github.com/gitlogapp',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
