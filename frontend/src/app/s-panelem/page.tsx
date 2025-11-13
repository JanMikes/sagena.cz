'use client';

import React from 'react';
import { Heart, Activity, Users, Calendar, FileText, Mail, Phone } from 'lucide-react';
import SidePanel from '@/components/layout/SidePanel';
import Card from '@/components/ui/Card';
import Heading from '@/components/typography/Heading';
import RichText from '@/components/typography/RichText';
import Alert from '@/components/interactive/Alert';
import NewsArticle from '@/components/content/NewsArticle';
import LinksList from '@/components/navigation/LinksList';
import ContactCard from '@/components/people/ContactCard';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Documents from '@/components/content/Documents';
import SectionDivider from '@/components/layout/SectionDivider';

export default function SPanelemPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Layout s panelem</h1>
          <p className="text-xl text-primary-100">Ukázka rozvržení stránky s postranním panelem</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            <Breadcrumb items={[{ label: 'S panelem', href: '/s-panelem' }, { label: 'Aktuální stránka' }]} />

            <Card>
              <Heading level={2} className="mb-4">Hlavní obsah stránky</Heading>
              <RichText
                content={`
                  <p>Toto je ukázka rozvržení stránky s postranním panelem. Hlavní obsah zabírá 2/3 šířky stránky a nachází se vlevo.</p>
                  <p>Panel na pravé straně je <strong>sticky</strong> - to znamená, že při scrollování zůstává viditelný a přichycený k horní části okna prohlížeče.</p>
                  <h3>Použití panelu</h3>
                  <p>Panel je ideální pro:</p>
                  <ul>
                    <li>Kontaktní informace</li>
                    <li>Rychlé odkazy</li>
                    <li>Aktuality a novinky</li>
                    <li>Dokumenty ke stažení</li>
                    <li>Související obsah</li>
                  </ul>
                `}
              />
            </Card>

            <Alert
              type="info"
              title="Responsivní design"
              text="Na mobilních zařízeních se panel automaticky přesouvá pod hlavní obsah."
            />

            <Heading level={3}>Ukázka aktualit</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NewsArticle
                title="Nové služby v nabídce"
                date="2025-01-20"
                text="Rozšiřujeme naši nabídku o další specializované služby..."
                image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400"
                readMoreUrl="#"
              />
              <NewsArticle
                title="Víkendové ordinační hodiny"
                date="2025-01-18"
                text="Od února jsme k dispozici i během víkendů..."
                readMoreUrl="#"
              />
            </div>

            <SectionDivider />

            <Card>
              <Heading level={3} className="mb-4">Více obsahu</Heading>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </Card>

            <Card>
              <Heading level={3} className="mb-4">Další informace</Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Heart className="w-5 h-5 text-primary-600 mr-2" />
                    Specializace
                  </h4>
                  <p className="text-gray-600 text-sm">Kardiologie, neurologie, ortopedie a další</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Activity className="w-5 h-5 text-primary-600 mr-2" />
                    Moderní vybavení
                  </h4>
                  <p className="text-gray-600 text-sm">Nejnovější diagnostická a terapeutická zařízení</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Users className="w-5 h-5 text-primary-600 mr-2" />
                    Zkušený tým
                  </h4>
                  <p className="text-gray-600 text-sm">50+ lékařů a zdravotnických pracovníků</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                    Flexibilní termíny
                  </h4>
                  <p className="text-gray-600 text-sm">Objednání online i telefonicky</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Side Panel - 1/3 width, sticky */}
          <SidePanel position="right" sticky>
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 text-primary-600 mr-2" />
                Kontaktujte nás
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+420553030800"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>+420 553 030 800</span>
                </a>
                <a
                  href="mailto:info@sagena.cz"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>info@sagena.cz</span>
                </a>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Rychlé odkazy</h3>
              <LinksList
                links={[
                  { title: 'Objednání', url: '#' },
                  { title: 'Ceník služeb', url: '#' },
                  { title: 'Kontakt', url: '#' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dokumenty ke stažení</h3>
              <Documents
                columns={1}
                documents={[
                  { name: 'Registrace', url: '#', size: '245 KB', extension: 'pdf' },
                  { name: 'Ceník', url: '#', size: '180 KB', extension: 'pdf' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kontaktní osoba</h3>
              <ContactCard
                name="Jan Novák"
                email="novak@sagena.cz"
                phone="+420 553 030 800"
              />
            </Card>

            <Alert
              type="success"
              title="Online objednávání"
              text="Nově můžete objednat termín online 24/7."
            />
          </SidePanel>
        </div>
      </div>
    </div>
  );
}
