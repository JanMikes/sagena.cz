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
    passwordConfirmationRequired: 'Potvrzení hesla je povinné',
    passwordsMustMatch: 'Hesla se musí shodovat',
    codeRequired: 'Kód je povinný',
  },
  en: {
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordConfirmationRequired: 'Password confirmation is required',
    passwordsMustMatch: 'Passwords must match',
    codeRequired: 'Code is required',
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

/**
 * Get locale-aware forgot password validation schema
 */
export function getForgotPasswordSchema(locale: Locale) {
  const messages = validationMessages[locale];

  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
  });
}

/**
 * Get locale-aware reset password validation schema
 */
export function getResetPasswordSchema(locale: Locale) {
  const messages = validationMessages[locale];

  return z.object({
    code: z.string().min(1, messages.codeRequired),
    password: z
      .string()
      .min(6, messages.passwordMinLength),
    passwordConfirmation: z
      .string()
      .min(1, messages.passwordConfirmationRequired),
  }).refine(data => data.password === data.passwordConfirmation, {
    message: messages.passwordsMustMatch,
    path: ['passwordConfirmation'],
  });
}
