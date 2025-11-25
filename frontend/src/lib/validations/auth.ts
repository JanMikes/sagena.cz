/**
 * Authentication validation schemas with locale-aware error messages
 */

import { z } from 'zod';
import type { Locale } from '@/i18n/config';

const validationMessages = {
  cs: {
    emailRequired: 'E-mail je povinný',
    emailInvalid: 'Zadejte platný e-mail',
    passwordRequired: 'Heslo je povinné',
    passwordMinLength: 'Heslo musí mít alespoň 6 znaků',
  },
  en: {
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
  },
} as const;

/**
 * Get locale-aware login validation schema
 */
export function getLoginSchema(locale: Locale) {
  const messages = validationMessages[locale];

  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z
      .string()
      .min(1, messages.passwordRequired),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;
