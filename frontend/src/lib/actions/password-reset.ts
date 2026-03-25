'use server';

import { getForgotPasswordSchema, getResetPasswordSchema } from '@/lib/validations/auth';
import type { Locale } from '@/i18n/config';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export interface ForgotPasswordActionState {
  success: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
  };
}

export interface ResetPasswordActionState {
  success: boolean;
  error?: string;
  fieldErrors?: {
    code?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
}

const forgotPasswordMessages = {
  cs: {
    success: 'Pokud zadaný e-mail existuje v našem systému, odeslali jsme na něj odkaz pro obnovení hesla.',
    connectionError: 'Chyba připojení k serveru',
    unknownError: 'Došlo k neočekávané chybě',
  },
  en: {
    success: 'If the email exists in our system, we have sent a password reset link.',
    connectionError: 'Server connection error',
    unknownError: 'An unexpected error occurred',
  },
} as const;

const resetPasswordMessages = {
  cs: {
    invalidCode: 'Neplatný nebo expirovaný kód pro obnovení hesla',
    connectionError: 'Chyba připojení k serveru',
    unknownError: 'Došlo k neočekávané chybě',
  },
  en: {
    invalidCode: 'Invalid or expired password reset code',
    connectionError: 'Server connection error',
    unknownError: 'An unexpected error occurred',
  },
} as const;

export async function forgotPasswordAction(
  locale: Locale,
  prevState: ForgotPasswordActionState,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const schema = getForgotPasswordSchema(locale);

  const rawData = {
    email: formData.get('email'),
  };

  const validationResult = schema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      fieldErrors: {
        email: fieldErrors.email,
      },
    };
  }

  const { email } = validationResult.data;

  try {
    await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    // Always return success to prevent email enumeration
    return { success: true };
  } catch (error) {
    console.error('Forgot password error:', error);
    // Still return success to prevent email enumeration
    return { success: true };
  }
}

export async function resetPasswordAction(
  locale: Locale,
  prevState: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> {
  const messages = resetPasswordMessages[locale];
  const schema = getResetPasswordSchema(locale);

  const rawData = {
    code: formData.get('code'),
    password: formData.get('password'),
    passwordConfirmation: formData.get('passwordConfirmation'),
  };

  const validationResult = schema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      fieldErrors: {
        code: fieldErrors.code,
        password: fieldErrors.password,
        passwordConfirmation: fieldErrors.passwordConfirmation,
      },
    };
  }

  const { code, password, passwordConfirmation } = validationResult.data;

  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, password, passwordConfirmation }),
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = data?.error?.message || '';

      if (errorMessage.includes('code') || errorMessage.includes('Incorrect')) {
        return { success: false, error: messages.invalidCode };
      }

      return { success: false, error: messages.unknownError };
    }

    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: messages.connectionError };
  }
}
