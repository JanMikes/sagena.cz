/**
 * Signup validation schemas with locale-aware error messages
 */

import { z } from 'zod';
import type { Locale } from '@/i18n/config';

const validationMessages = {
  cs: {
    firstNameRequired: 'Jméno je povinné',
    lastNameRequired: 'Příjmení je povinné',
    emailRequired: 'E-mail je povinný',
    emailInvalid: 'Zadejte platný e-mail',
    passwordRequired: 'Heslo je povinné',
    passwordMinLength: 'Heslo musí mít alespoň 8 znaků',
    gdprConsentRequired: 'Pro registraci musíte souhlasit se zpracováním osobních údajů',
  },
  en: {
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 8 characters',
    gdprConsentRequired: 'You must agree to the processing of personal data to register',
  },
} as const;

/**
 * Get locale-aware signup validation schema
 */
export function getSignupSchema(locale: Locale) {
  const messages = validationMessages[locale];

  return z.object({
    firstName: z
      .string()
      .min(1, messages.firstNameRequired),
    lastName: z
      .string()
      .min(1, messages.lastNameRequired),
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(8, messages.passwordMinLength),
    gdprConsent: z
      .boolean()
      .refine((val) => val === true, { message: messages.gdprConsentRequired }),
  });
}

export type SignupFormData = z.infer<ReturnType<typeof getSignupSchema>>;
