'use client';

import React from 'react';
import { Calendar, Activity, AlertCircle } from 'lucide-react';
import IntranetNav from '@/components/intranet/IntranetNav';
import Card from '@/components/ui/Card';
import Alert from '@/components/interactive/Alert';
import LinksList from '@/components/navigation/LinksList';
import Documents from '@/components/content/Documents';
import ContactCard from '@/components/people/ContactCard';
import MarketingArguments from '@/components/marketing/MarketingArguments';
import RichText from '@/components/typography/RichText';
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
    todayPatients: 'Dnešní pacienti',
    scheduledVisits: 'Naplánované návštěvy',
    pendingTasks: 'Čekající úkoly',
    toResolveToday: 'K vyřízení dnes',
    newMessages: 'Nové zprávy',
    unread: 'Nepřečtené',
    monthPerformance: 'Výkon měsíce',
    planFulfillment: 'Splnění plánu',
    importantAlerts: 'Důležitá upozornění',
    systemMaintenance: 'Systémová údržba',
    maintenanceText:
      'V neděli 28.1. od 22:00 do 24:00 bude probíhat plánovaná údržba systému.',
    newAppVersion: 'Nová verze aplikace',
    newAppVersionText:
      'K dispozici je nová verze mobilní aplikace s vylepšeními.',
    todaySchedule: 'Dnešní rozvrh',
    recentActivity: 'Nedávná aktivita',
    quickActions: 'Rychlé akce',
    newPatient: 'Nový pacient',
    testResults: 'Výsledky testů',
    documents: 'Dokumenty',
    paperwork: 'Písemnosti',
    statistics: 'Statistiky',
    colleagueOnDuty: 'Kolega na službě',
    systemActive: 'Systém aktivní',
    systemActiveText: 'Všechny systémy fungují bez problémů.',
  },
  en: {
    welcomeBack: 'Welcome back',
    todayIs: 'Today is',
    todayPatients: "Today's patients",
    scheduledVisits: 'Scheduled visits',
    pendingTasks: 'Pending tasks',
    toResolveToday: 'To resolve today',
    newMessages: 'New messages',
    unread: 'Unread',
    monthPerformance: 'Month performance',
    planFulfillment: 'Plan fulfillment',
    importantAlerts: 'Important alerts',
    systemMaintenance: 'System maintenance',
    maintenanceText:
      'On Sunday 28.1. from 22:00 to 24:00 there will be scheduled system maintenance.',
    newAppVersion: 'New app version',
    newAppVersionText:
      'A new version of the mobile app with improvements is available.',
    todaySchedule: "Today's schedule",
    recentActivity: 'Recent activity',
    quickActions: 'Quick actions',
    newPatient: 'New patient',
    testResults: 'Test results',
    documents: 'Documents',
    paperwork: 'Paperwork',
    statistics: 'Statistics',
    colleagueOnDuty: 'Colleague on duty',
    systemActive: 'System active',
    systemActiveText: 'All systems are working without issues.',
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

      <div className="container-custom py-8 space-y-8">
        {/* Welcome Alert */}
        <Alert
          type="info"
          title={`${t.welcomeBack}, ${userName}!`}
          text={`${t.todayIs} ${new Date().toLocaleDateString(dateLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
        />

        {/* Stats Overview */}
        <MarketingArguments
          columns={4}
          arguments={[
            {
              icon: null,
              number: '12',
              title: t.todayPatients,
              description: t.scheduledVisits,
            },
            {
              icon: null,
              number: '5',
              title: t.pendingTasks,
              description: t.toResolveToday,
            },
            {
              icon: null,
              number: '8',
              title: t.newMessages,
              description: t.unread,
            },
            {
              icon: null,
              number: '94%',
              title: t.monthPerformance,
              description: t.planFulfillment,
            },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Alerts */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-primary-600 mr-2" />
                {t.importantAlerts}
              </h2>
              <div className="space-y-4">
                <Alert
                  type="warning"
                  title={t.systemMaintenance}
                  text={t.maintenanceText}
                />
                <Alert
                  type="info"
                  title={t.newAppVersion}
                  text={t.newAppVersionText}
                />
              </div>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                {t.todaySchedule}
              </h2>
              <RichText
                content={`
                  <ul>
                    <li><strong>08:00</strong> - Jan Svoboda (Kontrola)</li>
                    <li><strong>09:00</strong> - Marie Nová (První vyšetření)</li>
                    <li><strong>10:30</strong> - Petr Dvořák (Následná péče)</li>
                    <li><strong>13:00</strong> - Obědová pauza</li>
                    <li><strong>14:00</strong> - Eva Malá (Konzultace)</li>
                  </ul>
                `}
              />
            </Card>

            {/* Recent Activity */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 text-primary-600 mr-2" />
                {t.recentActivity}
              </h2>
              <RichText
                content={`
                  <ul>
                    <li>Vyšetření pacienta dokončeno <em>(před 15 minutami)</em></li>
                    <li>Nový pacient se objednal <em>(před 1 hodinou)</em></li>
                    <li>Výsledky laboratorních testů připraveny <em>(před 2 hodinami)</em></li>
                  </ul>
                `}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t.quickActions}
              </h3>
              <LinksList
                links={[
                  { title: t.newPatient, url: '#' },
                  { title: t.testResults, url: '#' },
                  { title: t.paperwork, url: '#' },
                  { title: t.statistics, url: '#' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t.documents}
              </h3>
              <Documents
                columns={1}
                documents={[
                  {
                    name: 'Protokol Q1',
                    url: '#',
                    size: '1.2 MB',
                    extension: 'pdf',
                  },
                  {
                    name: 'Směrnice',
                    url: '#',
                    size: '890 KB',
                    extension: 'pdf',
                  },
                  {
                    name: 'Statistiky',
                    url: '#',
                    size: '450 KB',
                    extension: 'xlsx',
                  },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t.colleagueOnDuty}
              </h3>
              <ContactCard
                name="Dr. Marie Svobodová"
                email="svobodova@sagena.cz"
                phone="+420 553 030 801"
              />
            </Card>

            <Alert
              type="success"
              title={t.systemActive}
              text={t.systemActiveText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
