'use server';

/**
 * Server actions for authentication
 */

import { redirect } from 'next/navigation';
import { login, logout } from '@/lib/auth';
import { getLoginSchema } from '@/lib/validations/auth';
import type { Locale } from '@/i18n/config';

export interface LoginActionState {
  success: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
}

const errorMessages = {
  cs: {
    invalidCredentials: 'Nesprávný e-mail nebo heslo',
    connectionError: 'Chyba připojení k serveru',
    unknownError: 'Došlo k neočekávané chybě',
  },
  en: {
    invalidCredentials: 'Invalid email or password',
    connectionError: 'Server connection error',
    unknownError: 'An unexpected error occurred',
  },
} as const;

/**
 * Server action for login form submission
 */
export async function loginAction(
  locale: Locale,
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const messages = errorMessages[locale];
  const schema = getLoginSchema(locale);

  // Parse and validate form data
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validationResult = schema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      fieldErrors: {
        email: fieldErrors.email,
        password: fieldErrors.password,
      },
    };
  }

  // Attempt login
  const { email, password } = validationResult.data;
  const result = await login(email, password);

  if (!result.success) {
    // Map Strapi error messages to locale-aware messages
    let errorMessage: string = messages.unknownError;
    if (
      result.error.includes('Invalid') ||
      result.error.includes('credentials')
    ) {
      errorMessage = messages.invalidCredentials;
    } else if (result.error.includes('Connection')) {
      errorMessage = messages.connectionError;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }

  // Redirect to intranet dashboard on success
  redirect(`/${locale}/intranet/`);
}

/**
 * Server action for logout
 */
export async function logoutAction(locale: Locale): Promise<void> {
  await logout();
  redirect(`/${locale}/intranet/login/`);
}
