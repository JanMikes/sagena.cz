/**
 * Registration validation schemas with locale-aware error messages
 */

import { z } from 'zod';
import type { Locale } from '@/i18n/config';

const validationMessages = {
  cs: {
    nameRequired: 'Jméno a příjmení je povinné',
    nameMinLength: 'Jméno musí mít alespoň 2 znaky',
    emailRequired: 'E-mail je povinný',
    emailInvalid: 'Zadejte platný e-mail',
    phoneRequired: 'Telefon je povinný',
    phoneInvalid: 'Zadejte platné telefonní číslo',
    consentRequired: 'Pro odeslání formuláře musíte souhlasit se zpracováním osobních údajů',
  },
  en: {
    nameRequired: 'Full name is required',
    nameMinLength: 'Name must be at least 2 characters',
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email',
    phoneRequired: 'Phone is required',
    phoneInvalid: 'Enter a valid phone number',
    consentRequired: 'You must agree to the processing of personal data to submit the form',
  },
} as const;

// Czech phone number regex (supports +420 and various formats)
const czechPhoneRegex = /^(\+420\s?)?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/;

/**
 * Get locale-aware registration validation schema
 */
export function getRegistrationSchema(locale: Locale) {
  const messages = validationMessages[locale];

  return z.object({
    fullName: z
      .string()
      .min(1, messages.nameRequired)
      .min(2, messages.nameMinLength),
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    phone: z
      .string()
      .min(1, messages.phoneRequired)
      .regex(czechPhoneRegex, messages.phoneInvalid),
    message: z.string().optional(),
    consent: z
      .boolean()
      .refine((val) => val === true, { message: messages.consentRequired }),
    // Honeypot field - must be empty
    website: z.string().max(0).optional(),
  });
}

export type RegistrationFormData = z.infer<ReturnType<typeof getRegistrationSchema>>;
