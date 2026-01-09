'use client';

import React, { useActionState, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { submitRegistration, type RegistrationActionState } from '@/lib/actions/registration';
import type { Locale } from '@/i18n/config';

interface RegistrationFormProps {
  locale: Locale;
}

const translations = {
  cs: {
    subtitle: 'Vyplňte formulář a my vás budeme kontaktovat',
    fullNameLabel: 'Jméno a příjmení',
    fullNamePlaceholder: 'Jan Novák',
    emailLabel: 'E-mail',
    emailPlaceholder: 'vas.email@email.cz',
    phoneLabel: 'Telefon',
    phonePlaceholder: '+420 123 456 789',
    messageLabel: 'Zpráva (nepovinná)',
    messagePlaceholder: 'Sem můžete napsat další informace...',
    consentLabel: 'Souhlasím se zpracováním osobních údajů',
    consentHelper: 'Vaše údaje použijeme pouze pro účely registrace.',
    submit: 'Odeslat registraci',
    submitting: 'Odesílání...',
    successTitle: 'Děkujeme!',
    successMessage: 'Vaše registrace byla úspěšně odeslána. Budeme vás kontaktovat.',
  },
  en: {
    subtitle: 'Fill out the form and we will contact you',
    fullNameLabel: 'Full name',
    fullNamePlaceholder: 'John Doe',
    emailLabel: 'Email',
    emailPlaceholder: 'your.email@email.com',
    phoneLabel: 'Phone',
    phonePlaceholder: '+420 123 456 789',
    messageLabel: 'Message (optional)',
    messagePlaceholder: 'You can add additional information here...',
    consentLabel: 'I agree to the processing of personal data',
    consentHelper: 'Your data will only be used for registration purposes.',
    submit: 'Submit registration',
    submitting: 'Submitting...',
    successTitle: 'Thank you!',
    successMessage: 'Your registration has been successfully submitted. We will contact you.',
  },
} as const;

const RegistrationForm: React.FC<RegistrationFormProps> = ({ locale }) => {
  const t = translations[locale];
  const [consentChecked, setConsentChecked] = useState(false);

  const initialState: RegistrationActionState = { success: false };
  const submitWithLocale = submitRegistration.bind(null, locale);
  const [state, formAction, isPending] = useActionState(submitWithLocale, initialState);

  // Success state
  if (state.success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.successTitle}</h3>
        <p className="text-gray-600">{t.successMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-600 mb-6">{t.subtitle}</p>

      {/* General error */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-5" noValidate>
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 h-0 w-0 pointer-events-none"
          aria-hidden="true"
        />

        <Input
          label={t.fullNameLabel}
          name="fullName"
          placeholder={t.fullNamePlaceholder}
          required
          disabled={isPending}
          error={state.fieldErrors?.fullName?.[0]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t.emailLabel}
            name="email"
            type="email"
            placeholder={t.emailPlaceholder}
            required
            disabled={isPending}
            error={state.fieldErrors?.email?.[0]}
          />
          <Input
            label={t.phoneLabel}
            name="phone"
            type="tel"
            placeholder={t.phonePlaceholder}
            required
            disabled={isPending}
            error={state.fieldErrors?.phone?.[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.messageLabel}
          </label>
          <textarea
            name="message"
            rows={4}
            placeholder={t.messagePlaceholder}
            disabled={isPending}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200 resize-none"
          />
        </div>

        {/* Hidden consent value for form submission */}
        <input type="hidden" name="consent" value={consentChecked ? 'true' : 'false'} />

        {/* Consent checkbox */}
        <div className="w-full">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                disabled={isPending}
                className="sr-only peer"
              />
              <div
                className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${
                  state.fieldErrors?.consent?.[0]
                    ? 'border-red-500'
                    : consentChecked
                      ? 'border-primary-600 bg-primary-600'
                      : 'border-gray-300'
                } peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2`}
              >
                {consentChecked && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {t.consentLabel} <span className="text-red-500">*</span>
              </span>
              <p className="mt-1 text-sm text-gray-500">{t.consentHelper}</p>
              {state.fieldErrors?.consent?.[0] && (
                <p className="mt-1 text-sm text-red-500">{state.fieldErrors.consent[0]}</p>
              )}
            </div>
          </label>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
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
    </div>
  );
};

export default RegistrationForm;
