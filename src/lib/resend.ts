import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not configured');
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export async function sendEmail(options: SendEmailOptions) {
  if (!resend) {
    throw new Error('Resend is not configured');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: options.from || 'GitLog <updates@gitlog.app>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return {
      success: true,
      emailId: data?.id,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendBulkEmails(emails: string[], subject: string, html: string) {
  const results = [];

  for (const email of emails) {
    try {
      const result = await sendEmail({
        to: email,
        subject,
        html,
      });
      results.push({ email, ...result });
    } catch (error) {
      results.push({ email, success: false, error: 'Failed to send' });
    }
  }

  return results;
}
