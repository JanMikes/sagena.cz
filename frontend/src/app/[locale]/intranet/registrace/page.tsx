/**
 * Intranet Registrations Page
 *
 * Displays all patient registrations submitted via the public form.
 * Protected by authentication middleware - only accessible in the intranet.
 */

import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { fetchRegistrations, fetchIntranetMenu } from '@/lib/strapi';
import { getSession } from '@/lib/auth';
import IntranetNav from '@/components/intranet/IntranetNav';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Card from '@/components/ui/Card';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import { getAlternateLocale, isValidLocale, type Locale } from '@/i18n/config';
import { Mail, Phone, Calendar, MessageSquare, User } from 'lucide-react';

interface RegistrationsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const translations = {
  cs: {
    title: 'Registrace pacientů',
    description: 'Přehled všech registrací z kontaktního formuláře.',
    intranetHome: 'Intranet',
    noRegistrations: 'Zatím nejsou žádné registrace.',
    submittedAt: 'Odesláno',
    message: 'Zpráva',
  },
  en: {
    title: 'Patient Registrations',
    description: 'Overview of all registrations from the contact form.',
    intranetHome: 'Intranet',
    noRegistrations: 'No registrations yet.',
    submittedAt: 'Submitted',
    message: 'Message',
  },
} as const;

/**
 * Generate metadata based on locale
 */
export async function generateMetadata({
  params,
}: RegistrationsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = translations[locale as Locale] || translations.cs;

  return {
    title: `${t.title} | Sagena Intranet`,
    description: t.description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      languages: {
        cs: '/cs/intranet/registrace/',
        en: '/en/intranet/registrace/',
      },
    },
  };
}

/**
 * Generate static params for both locales
 */
export async function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'en' }];
}

/**
 * Format date for display
 */
function formatDate(dateString: string | null | undefined, locale: string): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'cs' ? 'cs-CZ' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Intranet Registrations Page
 * Displays all patient registrations
 */
export default async function RegistrationsPage({ params }: RegistrationsPageProps) {
  const { locale } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    redirect(`/cs/intranet/registrace/`);
  }

  // Double-check authentication (middleware should have caught this)
  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/intranet/login/`);
  }

  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/intranet/registrace/`;
  const t = translations[locale as Locale] || translations.cs;

  // Fetch intranet navigation and registrations
  const [navigation, registrations] = await Promise.all([
    fetchIntranetMenu(locale),
    fetchRegistrations('submittedAt:desc', 100),
  ]);

  const userName = session.user.username || session.user.email.split('@')[0];

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: t.intranetHome, href: `/${locale}/intranet/` },
    { label: t.title, href: `/${locale}/intranet/registrace/` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Set alternate URL for language switcher */}
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />

      {/* Intranet Navigation */}
      <IntranetNav userName={userName} locale={locale as Locale} navigation={navigation} />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-primary-100">{t.description}</p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} locale={locale} />
        </div>

        {/* Registrations list */}
        {registrations.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">{t.noRegistrations}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <Card key={registration.id}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Main info */}
                  <div className="flex-1 space-y-3">
                    {/* Name */}
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <span className="font-semibold text-lg text-gray-900">
                        {registration.fullName}
                      </span>
                    </div>

                    {/* Contact info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <a
                        href={`mailto:${registration.email}`}
                        className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {registration.email}
                      </a>
                      <a
                        href={`tel:${registration.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {registration.phone}
                      </a>
                    </div>

                    {/* Message */}
                    {registration.message && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm whitespace-pre-wrap">
                            {registration.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 md:text-right">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(registration.submittedAt, locale)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
