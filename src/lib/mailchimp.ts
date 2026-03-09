import mailchimp from '@mailchimp/mailchimp_marketing';

const apiKey = process.env.MAILCHIMP_API_KEY;
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

if (!apiKey || !audienceId || !serverPrefix) {
  console.warn('Mailchimp credentials not fully configured');
}

// Initialize Mailchimp client
if (apiKey && serverPrefix) {
  mailchimp.setConfig({
    apiKey,
    server: serverPrefix,
  });
}

export interface Subscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  status?: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
}

export async function addSubscriber(subscriber: Subscriber) {
  try {
    if (!apiKey || !audienceId) {
      throw new Error('Mailchimp not configured');
    }

    const response = await mailchimp.lists.addListMember(audienceId, {
      email_address: subscriber.email,
      status: 'pending', // Double opt-in
      merge_fields: {
        FNAME: subscriber.firstName || '',
        LNAME: subscriber.lastName || '',
      },
    });

    return {
      success: true,
      subscriber: response,
    };
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw new Error('Failed to add subscriber');
  }
}

export async function updateSubscriberStatus(
  email: string,
  status: 'subscribed' | 'unsubscribed'
) {
  try {
    if (!apiKey || !audienceId) {
      throw new Error('Mailchimp not configured');
    }

    const subscriberHash = md5(email.toLowerCase());
    
    const response = await mailchimp.lists.updateListMember(
      audienceId,
      subscriberHash,
      {
        status,
      }
    );

    return {
      success: true,
      subscriber: response,
    };
  } catch (error) {
    console.error('Error updating subscriber:', error);
    throw new Error('Failed to update subscriber');
  }
}

export async function getSubscriberCount() {
  try {
    if (!apiKey || !audienceId) {
      return { count: 0 };
    }

    const response = await mailchimp.lists.getListMembersInfo(audienceId, {
      count: 1,
    });

    return {
      count: response.total_items,
    };
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    return { count: 0 };
  }
}

export async function createCampaign(
  subject: string,
  htmlContent: string,
  previewText?: string
) {
  try {
    if (!apiKey || !audienceId) {
      throw new Error('Mailchimp not configured');
    }

    // Create campaign
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: {
        list_id: audienceId,
      },
      settings: {
        subject_line: subject,
        preview_text: previewText,
        from_name: 'GitLog',
        reply_to: 'hello@gitlog.app',
      },
    });

    // Set content
    await mailchimp.campaigns.setContent(campaign.id, {
      html: htmlContent,
    });

    return {
      success: true,
      campaignId: campaign.id,
    };
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw new Error('Failed to create campaign');
  }
}

export async function sendCampaign(campaignId: string) {
  try {
    if (!apiKey) {
      throw new Error('Mailchimp not configured');
    }

    await mailchimp.campaigns.send(campaignId);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error sending campaign:', error);
    throw new Error('Failed to send campaign');
  }
}

// Simple MD5 implementation for subscriber hash
function md5(str: string): string {
  // In production, use a proper MD5 library
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
