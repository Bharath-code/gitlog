import { Badge } from '@/shared/components/ui/badge';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Badge>Legal</Badge>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-6 text-muted">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              GitLog ("we," "us," or "our") is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you
              use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>GitHub account information (username, email, public profile)</li>
              <li>Repository information you choose to connect</li>
              <li>Payment information (processed securely by DodoPayment)</li>
              <li>Communications with our support team</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
              2.2 Information Collected Automatically
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Usage data (pages visited, features used)</li>
              <li>Device information (browser type, operating system)</li>
              <li>IP address and approximate location</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process your transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect and prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may
              share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>Service Providers:</strong> With third-party vendors who perform services on
                our behalf (hosting, payment processing, analytics)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                sale of assets
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              5. Data Storage and Security
            </h2>
            <p>
              Your information is stored on secure servers hosted by Vercel and protected by
              industry-standard security measures. We use encryption for data in transit and at
              rest. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. GitHub Integration</h2>
            <p>When you connect your GitHub account, we request permission to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Read your public and private repositories</li>
              <li>Read pull request information</li>
              <li>Create webhooks in your repositories</li>
            </ul>
            <p className="mt-2">
              We only access the minimum information necessary to provide the Service. We never
              modify your code or repositories.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Cookies and Tracking</h2>
            <p>We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Remember your preferences</li>
              <li>Understand how you use the Service</li>
              <li>Improve your experience</li>
            </ul>
            <p className="mt-2">
              You can control cookies through your browser settings, but disabling cookies may limit
              your use of certain features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your information (subject to legal obligations)</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at{' '}
              <Link href="mailto:hello@gitlog.app" className="text-accent hover:underline">
                hello@gitlog.app
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Children's Privacy</h2>
            <p>
              The Service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              10. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries other than your
              country of residence. We ensure appropriate safeguards are in place to protect your
              information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              11. Changes to Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <Link href="mailto:hello@gitlog.app" className="text-accent hover:underline">
                hello@gitlog.app
              </Link>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-line">
          <div className="flex gap-4 text-sm text-muted">
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
