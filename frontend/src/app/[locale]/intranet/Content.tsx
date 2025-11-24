'use client';

import React, { useState } from 'react';
import { Calendar, FileText, Users, TrendingUp, Clock, Activity, AlertCircle } from 'lucide-react';
import LoginPage from '@/components/intranet/LoginPage';
import IntranetNav from '@/components/intranet/IntranetNav';
import Card from '@/components/ui/Card';
import Alert from '@/components/interactive/Alert';
import LinksList from '@/components/navigation/LinksList';
import Documents from '@/components/content/Documents';
import ContactCard from '@/components/people/ContactCard';
import MarketingArguments from '@/components/marketing/MarketingArguments';
import NewsArticle from '@/components/content/NewsArticle';
import RichText from '@/components/typography/RichText';

export default function IntranetPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username: string, password: string) => {
    // Mock login - just set logged in state
    setIsLoggedIn(true);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show dashboard if logged in
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Intranet Navigation */}
      <IntranetNav userName="Jan Novák" activeItem="dashboard" />

      <div className="container-custom py-8 space-y-8">
        {/* Welcome Alert */}
        <Alert
          type="info"
          title="Vítejte zpět, Jan Novák!"
          text={`Dnes je ${new Date().toLocaleDateString('cs', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
        />

        {/* Stats Overview */}
        <MarketingArguments
          columns={4}
          arguments={[
            { icon: null, number: '12', title: 'Dnešní pacienti', description: 'Naplánované návštěvy' },
            { icon: null, number: '5', title: 'Čekající úkoly', description: 'K vyřízení dnes' },
            { icon: null, number: '8', title: 'Nové zprávy', description: 'Nepřečtené' },
            { icon: null, number: '94%', title: 'Výkon měsíce', description: 'Splnění plánu' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Alerts */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-primary-600 mr-2" />
                Důležitá upozornění
              </h2>
              <div className="space-y-4">
                <Alert
                  type="warning"
                  title="Systémová údržba"
                  text="V neděli 28.1. od 22:00 do 24:00 bude probíhat plánovaná údržba systému."
                />
                <Alert
                  type="info"
                  title="Nová verze aplikace"
                  text="K dispozici je nová verze mobilní aplikace s vylepšeními."
                />
              </div>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                Dnešní rozvrh
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
                Nedávná aktivita
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Rychlé akce</h3>
              <LinksList
                links={[
                  { title: 'Nový pacient', url: '#' },
                  { title: 'Výsledky testů', url: '#' },
                  { title: 'Písemnosti', url: '#' },
                  { title: 'Statistiky', url: '#' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dokumenty</h3>
              <Documents
                columns={1}
                documents={[
                  { name: 'Protokol Q1', url: '#', size: '1.2 MB', extension: 'pdf' },
                  { name: 'Směrnice', url: '#', size: '890 KB', extension: 'pdf' },
                  { name: 'Statistiky', url: '#', size: '450 KB', extension: 'xlsx' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kolega na službě</h3>
              <ContactCard
                name="Dr. Marie Svobodová"
                email="svobodova@sagena.cz"
                phone="+420 553 030 801"
              />
            </Card>

            <Alert
              type="success"
              title="Systém aktivní"
              text="Všechny systémy fungují bez problémů."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
