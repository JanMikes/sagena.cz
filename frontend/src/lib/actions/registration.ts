'use server';

/**
 * Server actions for registration form
 */

import { getRegistrationSchema } from '@/lib/validations/registration';
import type { Locale } from '@/i18n/config';
import { sendEmail, sagenaEmailTemplate } from '@/lib/email';

export interface RegistrationActionState {
  success: boolean;
  error?: string;
  fieldErrors?: {
    fullName?: string[];
    email?: string[];
    phone?: string[];
    message?: string[];
    consent?: string[];
  };
}

const errorMessages = {
  cs: {
    serverError: 'Došlo k chybě při odesílání. Zkuste to prosím znovu.',
    unknownError: 'Došlo k neočekávané chybě',
  },
  en: {
    serverError: 'An error occurred while submitting. Please try again.',
    unknownError: 'An unexpected error occurred',
  },
} as const;

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * Send notification email (fire-and-forget)
 */
async function sendNotificationEmail(data: {
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  submittedAt: string;
}): Promise<void> {
  const recipients = process.env.EMAIL_RECIPIENTS?.split(',').map(e => e.trim()).filter(Boolean) || [];

  if (recipients.length === 0) {
    console.warn('No email recipients configured for registration notifications');
    return;
  }

  const submittedDate = new Date(data.submittedAt).toLocaleString('cs-CZ', {
    timeZone: 'Europe/Prague',
  });

  const bodyHtml = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td style="padding-bottom: 24px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 600;">Jméno a příjmení</p>
        <p style="margin: 0; font-size: 16px; color: #18181b; font-weight: 500;">${data.fullName}</p>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 24px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 600;">E-mail</p>
        <p style="margin: 0; font-size: 16px; color: #18181b;"><a href="mailto:${data.email}" style="color: #005086; text-decoration: none;">${data.email}</a></p>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 24px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 600;">Telefon</p>
        <p style="margin: 0; font-size: 16px; color: #18181b;"><a href="tel:${data.phone}" style="color: #005086; text-decoration: none;">${data.phone}</a></p>
      </td>
    </tr>
    ${data.message ? `
    <tr>
      <td style="padding-bottom: 24px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 600;">Zpráva</p>
        <p style="margin: 0; font-size: 16px; color: #18181b; line-height: 1.5; white-space: pre-wrap;">${data.message}</p>
      </td>
    </tr>
    ` : ''}
    <tr>
      <td>
        <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 600;">Čas odeslání</p>
        <p style="margin: 0; font-size: 16px; color: #18181b;">${submittedDate}</p>
      </td>
    </tr>
  </table>`;

  await sendEmail({
    to: recipients,
    subject: `Nová registrace: ${data.fullName}`,
    html: sagenaEmailTemplate({
      title: 'Nová registrace',
      subtitle: 'Registrace k praktickému lékaři',
      bodyHtml,
    }),
  });
}

/**
 * Server action for registration form submission
 */
export async function submitRegistration(
  locale: Locale,
  prevState: RegistrationActionState,
  formData: FormData
): Promise<RegistrationActionState> {
  const messages = errorMessages[locale];
  const schema = getRegistrationSchema(locale);

  // Parse form data
  const rawData = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    message: (formData.get('message') as string) || '',
    consent: formData.get('consent') === 'true',
    website: (formData.get('website') as string) || '', // Honeypot
  };

  // Honeypot check - if filled, silently "succeed" to not reveal detection
  if (rawData.website && rawData.website.length > 0) {
    return { success: true };
  }

  // Validate
  const validationResult = schema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      fieldErrors: {
        fullName: fieldErrors.fullName,
        email: fieldErrors.email,
        phone: fieldErrors.phone,
        message: fieldErrors.message,
        consent: fieldErrors.consent,
      },
    };
  }

  const submittedAt = new Date().toISOString();

  // Submit to Strapi
  try {
    const response = await fetch(`${STRAPI_URL}/api/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      body: JSON.stringify({
        data: {
          fullName: validationResult.data.fullName,
          email: validationResult.data.email,
          phone: validationResult.data.phone,
          message: validationResult.data.message || null,
          submittedAt,
        },
      }),
    });

    if (!response.ok) {
      console.error('Strapi registration error:', await response.text());
      return {
        success: false,
        error: messages.serverError,
      };
    }

    // Fire-and-forget email - don't await, don't fail submission on email error
    sendNotificationEmail({
      fullName: validationResult.data.fullName,
      email: validationResult.data.email,
      phone: validationResult.data.phone,
      message: validationResult.data.message,
      submittedAt,
    }).catch((error) => {
      console.error('Failed to send registration notification email:', error);
    });

    return { success: true };
  } catch (error) {
    console.error('Registration submission error:', error);
    return {
      success: false,
      error: messages.serverError,
    };
  }
}
