'use client';

import React, { useState, useActionState } from 'react';
import { UserPlus, Lock, User, Mail, Eye, EyeOff, AlertCircle, Loader2, KeyRound, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { verifySecretAction, signupAction, type VerifySecretActionState, type SignupActionState } from '@/lib/actions/signup';
import type { Locale } from '@/i18n/config';

interface SignupFormProps {
  locale: Locale;
  initialSecret?: string;
  secretPreVerified: boolean;
}

const translations = {
  cs: {
    title: 'Registrace do intranetu',
    subtitle: 'Vytvořte si účet pro přístup do intranetu Sagena',
    secretLabel: 'Přístupový kód',
    secretPlaceholder: 'Zadejte přístupový kód',
    secretSubmit: 'Ověřit',
    secretSubmitting: 'Ověřování...',
    secretHint: 'Přístupový kód získáte od administrátora.',
    firstNameLabel: 'Jméno',
    firstNamePlaceholder: 'Jan',
    lastNameLabel: 'Příjmení',
    lastNamePlaceholder: 'Novák',
    emailLabel: 'E-mail',
    emailPlaceholder: 'vas.email@sagena.cz',
    passwordLabel: 'Heslo',
    passwordPlaceholder: '********',
    gdprConsentPrefix: 'Kliknutím na „Zaregistrovat se" souhlasíte se zpracováním Vašeho jména, příjmení a e-mailové adresy pro využívání sítě intranet společnosti Sagena, s.r.o. Tyto údaje nejsou uváděny veřejně. Bližší informace viz „',
    gdprConsentLinkText: 'Informace o zpracování osobních údajů',
    gdprConsentSuffix: '".',
    gdprConsentLinkUrl: '/cs/informace-o-zpracovani-osobnich-udaju-uzivatelu-site-intranet/',
    submit: 'Zaregistrovat se',
    submitting: 'Registrace...',
    alreadyHaveAccount: 'Již máte účet?',
    signIn: 'Přihlaste se',
    pendingTitle: 'Registrace úspěšná',
    pendingMessage: 'Váš účet čeká na schválení administrátorem. Jakmile bude váš účet aktivován, budete se moci přihlásit.',
    goToLogin: 'Přejít na přihlášení',
  },
  en: {
    title: 'Intranet Registration',
    subtitle: 'Create an account to access Sagena intranet',
    secretLabel: 'Access code',
    secretPlaceholder: 'Enter access code',
    secretSubmit: 'Verify',
    secretSubmitting: 'Verifying...',
    secretHint: 'Get the access code from your administrator.',
    firstNameLabel: 'First name',
    firstNamePlaceholder: 'John',
    lastNameLabel: 'Last name',
    lastNamePlaceholder: 'Doe',
    emailLabel: 'Email',
    emailPlaceholder: 'your.email@sagena.cz',
    passwordLabel: 'Password',
    passwordPlaceholder: '********',
    gdprConsentPrefix: 'By clicking "Sign up" you agree to the processing of your first name, last name, and email address for the use of the intranet of Sagena, s.r.o. This data is not published publicly. For more information see "',
    gdprConsentLinkText: 'Information on personal data processing',
    gdprConsentSuffix: '".',
    gdprConsentLinkUrl: '/en/informace-o-zpracovani-osobnich-udaju-uzivatelu-site-intranet/',
    submit: 'Sign up',
    submitting: 'Signing up...',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign in',
    pendingTitle: 'Registration successful',
    pendingMessage: 'Your account is waiting for administrator approval. Once your account is activated, you will be able to sign in.',
    goToLogin: 'Go to sign in',
  },
} as const;

const SignupForm: React.FC<SignupFormProps> = ({ locale, initialSecret, secretPreVerified }) => {
  const t = translations[locale];
  const [showPassword, setShowPassword] = useState(false);
  const [secretVerified, setSecretVerified] = useState(secretPreVerified);
  const [secret, setSecret] = useState(initialSecret || '');

  // Secret verification form
  const verifyInitialState: VerifySecretActionState = { verified: false };
  const verifyActionWithLocale = verifySecretAction.bind(null, locale);
  const [verifyState, verifyFormAction, isVerifying] = useActionState(
    async (prevState: VerifySecretActionState, formData: FormData) => {
      const result = await verifyActionWithLocale(prevState, formData);
      if (result.verified) {
        setSecretVerified(true);
        setSecret(formData.get('secret') as string);
      }
      return result;
    },
    verifyInitialState
  );

  // Signup form
  const signupInitialState: SignupActionState = { success: false };
  const signupActionWithLocale = signupAction.bind(null, locale);
  const [signupState, signupFormAction, isSubmitting] = useActionState(
    signupActionWithLocale,
    signupInitialState
  );

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary-600 mb-2">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {signupState.success ? (
            /* Success: Pending admin approval */
            <div className="text-center py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-14 h-14 bg-amber-100 rounded-full">
                  <Clock className="w-7 h-7 text-amber-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.pendingTitle}</h3>
              <p className="text-gray-600 mb-6">{t.pendingMessage}</p>
              <a
                href={`/${locale}/intranet/login/`}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
              >
                {t.goToLogin}
              </a>
            </div>
          ) : !secretVerified ? (
            /* Phase 1: Secret Gate */
            <>
              {verifyState.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{verifyState.error}</p>
                </div>
              )}

              <form action={verifyFormAction} className="space-y-6">
                <div>
                  <label
                    htmlFor="secret"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.secretLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="secret"
                      name="secret"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={t.secretPlaceholder}
                      required
                      disabled={isVerifying}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{t.secretHint}</p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t.secretSubmitting}
                    </span>
                  ) : (
                    t.secretSubmit
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Phase 2: Registration Form */
            <>
              {signupState.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{signupState.error}</p>
                </div>
              )}

              <form action={signupFormAction} className="space-y-6">
                <input type="hidden" name="secret" value={secret} />

                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.firstNameLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        signupState.fieldErrors?.firstName
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={t.firstNamePlaceholder}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {signupState.fieldErrors?.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {signupState.fieldErrors.firstName[0]}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.lastNameLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        signupState.fieldErrors?.lastName
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={t.lastNamePlaceholder}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {signupState.fieldErrors?.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {signupState.fieldErrors.lastName[0]}
                    </p>
                  )}
                </div>

                {/* Email */}
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
                        signupState.fieldErrors?.email
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={t.emailPlaceholder}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {signupState.fieldErrors?.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {signupState.fieldErrors.email[0]}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                        signupState.fieldErrors?.password
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={t.passwordPlaceholder}
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {signupState.fieldErrors?.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {signupState.fieldErrors.password[0]}
                    </p>
                  )}
                </div>

                {/* GDPR Consent */}
                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="gdprConsent"
                      value="true"
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-600">
                      {t.gdprConsentPrefix}
                      <a
                        href={t.gdprConsentLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 underline"
                      >
                        {t.gdprConsentLinkText}
                      </a>
                      {t.gdprConsentSuffix}
                    </span>
                  </label>
                  {signupState.fieldErrors?.gdprConsent && (
                    <p className="mt-1 text-sm text-red-600">
                      {signupState.fieldErrors.gdprConsent[0]}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t.submitting}
                    </span>
                  ) : (
                    t.submit
                  )}
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t.alreadyHaveAccount}{' '}
              <a
                href={`/${locale}/intranet/login/`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t.signIn}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
