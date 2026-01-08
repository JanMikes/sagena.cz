'use client';

import React from 'react';
import IntranetNav from '@/components/intranet/IntranetNav';
import Alert from '@/components/interactive/Alert';
import type { Locale } from '@/i18n/config';
import type { StrapiUser } from '@/lib/auth';
import type { NavigationItem } from '@/types/strapi';

interface DashboardProps {
  locale: Locale;
  user: StrapiUser;
  navigation: NavigationItem[];
}

const translations = {
  cs: {
    welcomeBack: 'Vítejte zpět',
    todayIs: 'Dnes je',
  },
  en: {
    welcomeBack: 'Welcome back',
    todayIs: 'Today is',
  },
} as const;

export default function Dashboard({ locale, user, navigation }: DashboardProps) {
  const t = translations[locale];
  const dateLocale = locale === 'cs' ? 'cs' : 'en';

  const userName = user.username || user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Intranet Navigation */}
      <IntranetNav userName={userName} locale={locale} navigation={navigation} />

      <div className="container-custom py-8">
        {/* Welcome Alert */}
        <Alert
          type="info"
          title={`${t.welcomeBack}, ${userName}!`}
          text={`${t.todayIs} ${new Date().toLocaleDateString(dateLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
        />
      </div>
    </div>
  );
}
