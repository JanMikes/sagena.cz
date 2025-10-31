'use client';

import React, { useState } from 'react';
import { Calendar, FileText, Users, TrendingUp, Clock, Activity, Heart, AlertCircle } from 'lucide-react';
import LoginPage from '@/components/intranet/LoginPage';
import IntranetNav from '@/components/intranet/IntranetNav';
import Card from '@/components/ui/Card';
import Alert from '@/components/interactive/Alert';
import LinksList from '@/components/navigation/LinksList';
import Documents from '@/components/content/Documents';
import Contact from '@/components/people/Contact';

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
        <Alert variant="info" title="Vítejte zpět, Jan Novák!">
          Dnes je {new Date().toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Alert>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dnešní pacienti</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Čekající úkoly</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nové zprávy</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Výkon měsíce</p>
                <p className="text-3xl font-bold text-gray-900">94%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

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
                <Alert variant="warning" title="Systémová údržba">
                  V neděli 28.1. od 22:00 do 24:00 bude probíhat plánovaná údržba systému.
                </Alert>
                <Alert variant="info" title="Nová verze aplikace">
                  K dispozici je nová verze mobilní aplikace s vylepšeními.
                </Alert>
              </div>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                Dnešní rozvrh
              </h2>
              <div className="space-y-3">
                {[
                  { time: '08:00', patient: 'Jan Svoboda', type: 'Kontrola' },
                  { time: '09:00', patient: 'Marie Nová', type: 'První vyšetření' },
                  { time: '10:30', patient: 'Petr Dvořák', type: 'Následná péče' },
                  { time: '13:00', patient: 'Obědová pauza', type: '-' },
                  { time: '14:00', patient: 'Eva Malá', type: 'Konzultace' },
                ].map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-primary-600 font-semibold text-sm">
                        {appointment.time}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                    </div>
                    {appointment.type !== '-' && (
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Detail
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 text-primary-600 mr-2" />
                Nedávná aktivita
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Vyšetření pacienta dokončeno</p>
                    <p className="text-xs text-gray-500">před 15 minutami</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Nový pacient se objednal</p>
                    <p className="text-xs text-gray-500">před 1 hodinou</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Výsledky laboratorních testů připraveny</p>
                    <p className="text-xs text-gray-500">před 2 hodinami</p>
                  </div>
                </div>
              </div>
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
                documents={[
                  { name: 'Protokol Q1', url: '#', size: '1.2 MB', extension: 'pdf' },
                  { name: 'Směrnice', url: '#', size: '890 KB', extension: 'pdf' },
                  { name: 'Statistiky', url: '#', size: '450 KB', extension: 'xlsx' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kolega na službě</h3>
              <Contact
                name="Dr. Marie Svobodová"
                email="svobodova@sagena.cz"
                phone="+420 553 030 801"
              />
            </Card>

            <Alert variant="success" title="Systém aktivní">
              Všechny systémy fungují bez problémů.
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
