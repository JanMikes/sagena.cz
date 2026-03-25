'use client';

import React, { useActionState } from 'react';
import { Mail, ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { forgotPasswordAction, type ForgotPasswordActionState } from '@/lib/actions/password-reset';
import type { Locale } from '@/i18n/config';
import Link from 'next/link';

interface ForgotPasswordFormProps {
  locale: Locale;
}

const translations = {
  cs: {
    title: 'Zapomenuté heslo',
    subtitle: 'Zadejte svůj e-mail a my vám zašleme odkaz pro obnovení hesla',
    emailLabel: 'E-mail',
    emailPlaceholder: 'vas.email@sagena.cz',
    submit: 'Odeslat odkaz',
    submitting: 'Odesílání...',
    backToLogin: 'Zpět na přihlášení',
    successTitle: 'E-mail odeslán',
    successMessage: 'Pokud zadaný e-mail existuje v našem systému, odeslali jsme na něj odkaz pro obnovení hesla. Zkontrolujte svou e-mailovou schránku.',
  },
  en: {
    title: 'Forgot password',
    subtitle: 'Enter your email and we will send you a password reset link',
    emailLabel: 'Email',
    emailPlaceholder: 'your.email@sagena.cz',
    submit: 'Send reset link',
    submitting: 'Sending...',
    backToLogin: 'Back to login',
    successTitle: 'Email sent',
    successMessage: 'If the email exists in our system, we have sent a password reset link. Check your inbox.',
  },
} as const;

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ locale }) => {
  const t = translations[locale];

  const initialState: ForgotPasswordActionState = { success: false };
  const forgotPasswordActionWithLocale = forgotPasswordAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(
    forgotPasswordActionWithLocale,
    initialState
  );

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl">
              <Mail className="w-8 h-8 text-white" />
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
              <Link
                href={`/${locale}/intranet/login/`}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                {t.backToLogin}
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
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        state.fieldErrors?.email
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={t.emailPlaceholder}
                      required
                      disabled={isPending}
                    />
                  </div>
                  {state.fieldErrors?.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {state.fieldErrors.email[0]}
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
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
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

export default ForgotPasswordForm;
