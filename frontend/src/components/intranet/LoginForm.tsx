'use client';

import React, { useState, useActionState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { loginAction, type LoginActionState } from '@/lib/actions/auth';
import type { Locale } from '@/i18n/config';

interface LoginFormProps {
  locale: Locale;
}

const translations = {
  cs: {
    title: 'Intranet Sagena',
    subtitle: 'Přihlaste se do svého účtu',
    emailLabel: 'E-mail',
    emailPlaceholder: 'vas.email@sagena.cz',
    passwordLabel: 'Heslo',
    passwordPlaceholder: '********',
    rememberMe: 'Zapamatovat si mě',
    forgotPassword: 'Zapomenuté heslo?',
    submit: 'Přihlásit se',
    submitting: 'Přihlašování...',
    needAccess: 'Potřebujete přístup?',
    contactIt: 'Kontaktujte IT podporu',
  },
  en: {
    title: 'Sagena Intranet',
    subtitle: 'Sign in to your account',
    emailLabel: 'Email',
    emailPlaceholder: 'your.email@sagena.cz',
    passwordLabel: 'Password',
    passwordPlaceholder: '********',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    submit: 'Sign in',
    submitting: 'Signing in...',
    needAccess: 'Need access?',
    contactIt: 'Contact IT support',
  },
} as const;

const LoginForm: React.FC<LoginFormProps> = ({ locale }) => {
  const t = translations[locale];
  const [showPassword, setShowPassword] = useState(false);

  const initialState: LoginActionState = { success: false };
  const loginActionWithLocale = loginAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(
    loginActionWithLocale,
    initialState
  );

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary-600 mb-2">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Error Alert */}
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
                  <User className="h-5 w-5 text-gray-400" />
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  disabled={isPending}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {t.rememberMe}
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {t.forgotPassword}
              </a>
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
            <p className="text-sm text-gray-600">
              {t.needAccess}{' '}
              <a
                href="#"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t.contactIt}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
