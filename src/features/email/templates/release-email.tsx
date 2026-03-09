import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Button,
  Img,
} from '@react-email/components';

interface ChangelogEntry {
  id: string;
  title: string;
  aiRewrite?: string;
  category: 'New' | 'Fixed' | 'Improved' | 'Other';
  mergedAt: string;
  prUrl: string;
}

interface ReleaseEmailTemplateProps {
  repoName: string;
  entries: ChangelogEntry[];
  publishedAt: string;
  viewOnlineLink: string;
  unsubscribeLink: string;
  branding?: {
    logo?: string;
    primaryColor?: string;
  };
}

export function ReleaseEmailTemplate({
  repoName,
  entries,
  publishedAt,
  viewOnlineLink,
  unsubscribeLink,
  branding,
}: ReleaseEmailTemplateProps) {
  const primaryColor = branding?.primaryColor || '#ff6b35';

  // Group entries by category
  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.category]) {
      acc[entry.category] = [];
    }
    acc[entry.category].push(entry);
    return acc;
  }, {} as Record<string, ChangelogEntry[]>);

  const categoryOrder = ['New', 'Fixed', 'Improved', 'Other'];

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          {branding?.logo ? (
            <Img
              src={branding.logo}
              alt={repoName}
              style={styles.logo}
            />
          ) : (
            <Text style={styles.header}>{repoName} Updates</Text>
          )}

          {/* Introduction */}
          <Text style={styles.intro}>
            Hi there! 👋
          </Text>
          <Text style={styles.text}>
            We've just shipped some exciting updates to {repoName}. Here's what's new:
          </Text>

          {/* Entries by Category */}
          {categoryOrder.map((category) => {
            const categoryEntries = grouped[category];
            if (!categoryEntries || categoryEntries.length === 0) return null;

            return (
              <Section key={category} style={styles.categorySection}>
                <Text style={{ ...styles.categoryTitle, color: primaryColor }}>
                  {category}
                </Text>
                {categoryEntries.map((entry) => (
                  <Section key={entry.id} style={styles.entry}>
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                    {entry.aiRewrite && (
                      <Text style={styles.entryDescription}>
                        {entry.aiRewrite}
                      </Text>
                    )}
                    <Link
                      href={entry.prUrl}
                      style={{ ...styles.link, color: primaryColor }}
                    >
                      View details →
                    </Link>
                  </Section>
                ))}
              </Section>
            );
          })}

          {/* CTA Button */}
          <Section style={styles.ctaSection}>
            <Button
              href={viewOnlineLink}
              style={{ ...styles.button, backgroundColor: primaryColor }}
            >
              View Full Changelog
            </Button>
          </Section>

          {/* Footer */}
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            You're receiving this email because you subscribed to updates from{' '}
            <strong>{repoName}</strong>.
          </Text>
          <Text style={styles.footer}>
            <Link href={unsubscribeLink} style={styles.link}>
              Unsubscribe
            </Link>{' '}
            •{' '}
            <Link href={viewOnlineLink} style={styles.link}>
              View Online
            </Link>
          </Text>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} GitLog. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f4f4f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  logo: {
    marginBottom: '24px',
  },
  intro: {
    fontSize: '18px',
    color: '#1a1a2e',
    marginBottom: '16px',
  },
  text: {
    fontSize: '16px',
    color: '#4b5563',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  categorySection: {
    marginBottom: '32px',
  },
  categoryTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid',
  },
  entry: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  entryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  entryDescription: {
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.5',
    marginBottom: '12px',
  },
  link: {
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
  },
  ctaSection: {
    textAlign: 'center' as const,
    marginTop: '32px',
    marginBottom: '32px',
  },
  button: {
    display: 'inline-block',
    padding: '14px 32px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
  },
  hr: {
    borderColor: '#e5e7eb',
    marginTop: '32px',
  },
  footer: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '16px',
    textAlign: 'center' as const,
  },
};

export default ReleaseEmailTemplate;
