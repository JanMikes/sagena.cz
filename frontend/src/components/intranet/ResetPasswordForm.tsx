'use client';

import React, { useState, useActionState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { resetPasswordAction, type ResetPasswordActionState } from '@/lib/actions/password-reset';
import type { Locale } from '@/i18n/config';
import Link from 'next/link';

interface ResetPasswordFormProps {
  locale: Locale;
  code: string;
}

const translations = {
  cs: {
    title: 'Nové heslo',
    subtitle: 'Zadejte své nové heslo',
    passwordLabel: 'Nové heslo',
    passwordPlaceholder: '********',
    passwordConfirmationLabel: 'Potvrzení hesla',
    passwordConfirmationPlaceholder: '********',
    submit: 'Nastavit heslo',
    submitting: 'Nastavování...',
    backToLogin: 'Zpět na přihlášení',
    successTitle: 'Heslo bylo změněno',
    successMessage: 'Vaše heslo bylo úspěšně změněno. Nyní se můžete přihlásit.',
    loginButton: 'Přihlásit se',
    invalidCode: 'Neplatný nebo chybějící kód pro obnovení hesla.',
    requestNew: 'Požádat o nový odkaz',
  },
  en: {
    title: 'New password',
    subtitle: 'Enter your new password',
    passwordLabel: 'New password',
    passwordPlaceholder: '********',
    passwordConfirmationLabel: 'Confirm password',
    passwordConfirmationPlaceholder: '********',
    submit: 'Set password',
    submitting: 'Setting...',
    backToLogin: 'Back to login',
    successTitle: 'Password changed',
    successMessage: 'Your password has been successfully changed. You can now sign in.',
    loginButton: 'Sign in',
    invalidCode: 'Invalid or missing password reset code.',
    requestNew: 'Request a new link',
  },
} as const;

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ locale, code }) => {
  const t = translations[locale];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const initialState: ResetPasswordActionState = { success: false };
  const resetPasswordActionWithLocale = resetPasswordAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(
    resetPasswordActionWithLocale,
    initialState
  );

  if (!code) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-700 mb-4">{t.invalidCode}</p>
            <Link
              href={`/${locale}/intranet/forgot-password/`}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {t.requestNew}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary-600 mb-2">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {state.success ? (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.successTitle}</h3>
              <p className="text-sm text-gray-600 mb-6">{t.successMessage}</p>
              <Link href={`/${locale}/intranet/login/`}>
                <Button size="lg" className="w-full">
                  {t.loginButton}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{state.error}</p>
                </div>
              )}

              <form action={formAction} className="space-y-6">
                <input type="hidden" name="code" value={code} />

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        state.fieldErrors?.password
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={t.passwordPlaceholder}
                      required
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {state.fieldErrors?.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.fieldErrors.password[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="passwordConfirmation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.passwordConfirmationLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmation ? 'text' : 'password'}
                      id="passwordConfirmation"
                      name="passwordConfirmation"
                      className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        state.fieldErrors?.passwordConfirmation
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={t.passwordConfirmationPlaceholder}
                      required
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmation(!showConfirmation)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={isPending}
                    >
                      {showConfirmation ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {state.fieldErrors?.passwordConfirmation && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.fieldErrors.passwordConfirmation[0]}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t.submitting}
                    </span>
                  ) : (
                    t.submit
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href={`/${locale}/intranet/login/`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t.backToLogin}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
