'use server';

/**
 * Server actions for registration form
 */

import { getRegistrationSchema } from '@/lib/validations/registration';
import type { Locale } from '@/i18n/config';
import nodemailer from 'nodemailer';

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

  const smtpPort = parseInt(process.env.SMTP_PORT || '1025', 10);
  const smtpEncryption = process.env.SMTP_ENCRYPTION?.toLowerCase();

  // secure: true for SSL/TLS on port 465, false for STARTTLS on port 587
  const isSecure = smtpEncryption === 'ssl' || smtpEncryption === 'tls' || smtpPort === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: smtpPort,
    secure: isSecure,
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  });

  const submittedDate = new Date(data.submittedAt).toLocaleString('cs-CZ', {
    timeZone: 'Europe/Prague',
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@sagena.cz',
    to: recipients,
    subject: `Nová registrace: ${data.fullName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #005086 0%, #004069 100%); padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Nová registrace</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Registrace k praktickému lékaři</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
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
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 40px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 13px; color: #71717a; text-align: center;">
                Tato zpráva byla automaticky vygenerována systémem <strong style="color: #005086;">Sagena</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
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
