'use server';

/**
 * Server actions for intranet signup
 */

import { getSignupSchema } from '@/lib/validations/signup';
import type { Locale } from '@/i18n/config';
import { sendEmail, sagenaEmailTemplate } from '@/lib/email';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const SIGNUP_SECRET = process.env.SIGNUP_SECRET || '';

export interface VerifySecretActionState {
  verified: boolean;
  error?: string;
}

export interface SignupActionState {
  success: boolean;
  error?: string;
  fieldErrors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    gdprConsent?: string[];
  };
}

const errorMessages = {
  cs: {
    invalidSecret: 'Neplatný přístupový kód',
    emailExists: 'Uživatel s tímto e-mailem již existuje',
    connectionError: 'Chyba připojení k serveru',
    unknownError: 'Došlo k neočekávané chybě',
  },
  en: {
    invalidSecret: 'Invalid access code',
    emailExists: 'A user with this email already exists',
    connectionError: 'Server connection error',
    unknownError: 'An unexpected error occurred',
  },
} as const;

/**
 * Server action to verify the signup secret
 */
export async function verifySecretAction(
  locale: Locale,
  prevState: VerifySecretActionState,
  formData: FormData
): Promise<VerifySecretActionState> {
  const secret = formData.get('secret') as string;
  const messages = errorMessages[locale];

  if (!secret || secret !== SIGNUP_SECRET) {
    return { verified: false, error: messages.invalidSecret };
  }

  return { verified: true };
}

/**
 * Server action for signup form submission
 */
export async function signupAction(
  locale: Locale,
  prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const messages = errorMessages[locale];

  // Re-verify secret
  const secret = formData.get('secret') as string;
  if (!secret || secret !== SIGNUP_SECRET) {
    return { success: false, error: messages.invalidSecret };
  }

  // Validate form data
  const schema = getSignupSchema(locale);
  const rawData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    gdprConsent: formData.get('gdprConsent') === 'true',
  };

  const validationResult = schema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      fieldErrors: {
        firstName: fieldErrors.firstName,
        lastName: fieldErrors.lastName,
        email: fieldErrors.email,
        password: fieldErrors.password,
        gdprConsent: fieldErrors.gdprConsent,
      },
    };
  }

  const { firstName, lastName, email, password } = validationResult.data;
  const username = email; // Use full email as username
  const gdprConsentAt = new Date().toISOString();

  // Create user via Strapi API
  try {
    const response = await fetch(`${STRAPI_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        username,
        email,
        password,
        firstName,
        lastName,
        gdprConsentAt,
        confirmed: false, // Requires admin confirmation
        role: 1, // Authenticated role
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.error?.message || '';

      if (errorMessage.includes('already') || errorMessage.includes('unique') || errorMessage.includes('taken')) {
        return { success: false, error: messages.emailExists };
      }

      console.error('Strapi user creation error:', errorData);
      return { success: false, error: messages.unknownError };
    }

    // Fire-and-forget: notify admin about new signup
    sendEmail({
      to: 'sagena@sagena.cz',
      subject: `Nová registrace do intranetu: ${firstName} ${lastName}`,
      html: sagenaEmailTemplate({
        title: 'Nová registrace do intranetu',
        subtitle: 'Čeká na schválení administrátorem',
        bodyHtml: `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 600;">Jméno a příjmení</p>
              <p style="margin: 0; font-size: 16px; color: #18181b; font-weight: 500;">${firstName} ${lastName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 600;">E-mail</p>
              <p style="margin: 0; font-size: 16px; color: #18181b;"><a href="mailto:${email}" style="color: #005086; text-decoration: none;">${email}</a></p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 600;">Čas registrace</p>
              <p style="margin: 0; font-size: 16px; color: #18181b;">${new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })}</p>
            </td>
          </tr>
        </table>`,
      }),
    }).catch((error) => {
      console.error('Failed to send admin signup notification:', error);
    });

    // Fire-and-forget: confirm to user their registration is pending
    sendEmail({
      to: email,
      subject: 'Registrace na intranet Sagena',
      html: sagenaEmailTemplate({
        title: 'Registrace na intranet Sagena',
        bodyHtml: `<p style="margin: 0 0 16px 0; font-size: 16px; color: #18181b; line-height: 1.6;">Dobrý den, ${firstName},</p>
          <p style="margin: 0 0 16px 0; font-size: 16px; color: #18181b; line-height: 1.6;">Vaše registrace na intranet Sagena byla úspěšně přijata a čeká na schválení administrátorem.</p>
          <p style="margin: 0 0 16px 0; font-size: 16px; color: #18181b; line-height: 1.6;">O schválení vašeho účtu budete informováni e-mailem.</p>
          <p style="margin: 0; font-size: 16px; color: #71717a; line-height: 1.6;">S pozdravem,<br>Tým Sagena</p>`,
      }),
    }).catch((error) => {
      console.error('Failed to send user signup confirmation:', error);
    });

    // Account created — needs admin confirmation before login
    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: messages.connectionError };
  }
}
