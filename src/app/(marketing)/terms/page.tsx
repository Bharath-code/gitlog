import { Badge } from '@/shared/components/ui/badge';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Badge>Legal</Badge>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-6 text-muted">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using GitLog ("the Service"), you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to these Terms of Service,
              please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              2. Description of Service
            </h2>
            <p>GitLog auto-generates changelogs from GitHub pull requests. The Service provides:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Automatic changelog generation from GitHub PRs</li>
              <li>AI-powered rewrite of technical content to plain English</li>
              <li>Public changelog pages</li>
              <li>Draft management and publishing tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <p>
              To use the Service, you must sign in with your GitHub account. You are responsible for
              maintaining the security of your GitHub account and for all activities that occur
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use the Service to transmit spam or unsolicited messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              5. Intellectual Property
            </h2>
            <p>
              The Service and its original content, features, and functionality are owned by GitLog
              and are protected by international copyright, trademark, and other intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. User Content</h2>
            <p>
              You retain ownership of all content you create using the Service. By using the
              Service, you grant GitLog a license to use, store, and display your content solely for
              the purpose of providing the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Pricing and Payments</h2>
            <p>
              The Service offers both free and paid plans. Paid plans are billed monthly through our
              payment processor DodoPayment. You can cancel your subscription at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Refund Policy</h2>
            <p>
              We offer a 14-day money-back guarantee for paid plans. If you're not satisfied with
              the Service, contact us within 14 days of purchase for a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              9. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided "as is" and "as available" without any warranties of any kind,
              either express or implied. We do not warrant that the Service will be uninterrupted,
              secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              10. Limitation of Liability
            </h2>
            <p>
              GitLog shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify
              users of any material changes via email or through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">12. Termination</h2>
            <p>
              We may terminate or suspend your access to the Service at any time, with or without
              cause, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">13. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at{' '}
              <Link href="mailto:hello@gitlog.app" className="text-accent hover:underline">
                hello@gitlog.app
              </Link>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-line">
          <div className="flex gap-4 text-sm text-muted">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
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
