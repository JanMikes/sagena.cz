'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Activity, Stethoscope, Users, MapPin, ArrowUp, FileText, Briefcase, Calendar, Mail, Phone, DoorOpen } from 'lucide-react';

// Import all components
import Modal from '@/components/interactive/Modal';
import Collapse from '@/components/interactive/Collapse';
import Alert from '@/components/interactive/Alert';
import CardsWithDescription from '@/components/content/CardsWithDescription';
import FullWidthCards from '@/components/content/FullWidthCards';
import Documents from '@/components/content/Documents';
import Video from '@/components/content/Video';
import Actuality from '@/components/content/Actuality';
import WorkOpportunity from '@/components/content/WorkOpportunity';
import ContactForm from '@/components/forms/ContactForm';
import Select from '@/components/forms/Select';
import Checkbox from '@/components/forms/Checkbox';
import Radio from '@/components/forms/Radio';
import MarketingArguments from '@/components/marketing/MarketingArguments';
import Timeline from '@/components/marketing/Timeline';
import Slider from '@/components/marketing/Slider';
import PhotoGallery from '@/components/media/PhotoGallery';
import GallerySlider from '@/components/media/GallerySlider';
import LinksList from '@/components/navigation/LinksList';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Heading from '@/components/typography/Heading';
import RichText from '@/components/typography/RichText';
import Doctor from '@/components/people/Doctor';
import Contact from '@/components/people/Contact';
import HowToFindUs from '@/components/layout/HowToFindUs';
import Breaker from '@/components/layout/Breaker';
import ButtonRow from '@/components/layout/ButtonRow';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function KomponentyPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // Show modal on page load
  useEffect(() => {
    const timer = setTimeout(() => setModalOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal - Shows on page load */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Vítejte na stránce komponent"
        size="md"
      >
        <p className="text-gray-600 mb-4">
          Tato stránka obsahuje přehled všech dostupných komponent, které můžete použít při tvorbě obsahu.
        </p>
        <button
          onClick={() => setModalOpen(false)}
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Rozumím
        </button>
      </Modal>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Knihovna komponent</h1>
          <p className="text-xl text-primary-100">Přehled všech dostupných komponent pro tvorbu obsahu</p>
        </div>
      </div>

      <div className="container-custom py-12 space-y-16">
        {/* Breadcrumb */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Breadcrumb (Navigace)</h2>
          <Card>
            <Breadcrumb items={[{ label: 'Komponenty', href: '/komponenty' }, { label: 'Aktuální stránka' }]} />
          </Card>
        </section>

        <Breaker style="gradient" />

        {/* Alerts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Upozornění (Alerts)</h2>
          <div className="space-y-4">
            <Alert variant="info" title="Informace">
              Toto je informační upozornění pro uživatele.
            </Alert>
            <Alert variant="success" title="Úspěch">
              Operace byla úspěšně dokončena.
            </Alert>
            <Alert variant="warning" title="Varování">
              Tato akce vyžaduje vaši pozornost.
            </Alert>
            <Alert variant="error" title="Chyba">
              Něco se pokazilo. Zkuste to prosím znovu.
            </Alert>
          </div>
        </section>

        <Breaker />

        {/* Cards with Description */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Karty s popisem</h2>
          <CardsWithDescription
            columns={3}
            cards={[
              { icon: Heart, title: 'Kardiologie', description: 'Péče o vaše srdce', linkText: 'Zjistit více', linkUrl: '#' },
              { icon: Activity, title: 'Rehabilitace', description: 'Moderní rehabilitační metody', linkText: 'Zjistit více', linkUrl: '#' },
              { icon: Stethoscope, title: 'Ordinace', description: 'Široká nabídka ordinací', linkText: 'Zjistit více', linkUrl: '#' },
            ]}
          />
        </section>

        <Breaker />

        {/* Full Width Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Karty na celou šířku</h2>
          <FullWidthCards
            cards={[
              { icon: Calendar, title: 'Objednání', description: 'Objednejte se online', url: '#' },
              { icon: FileText, title: 'Dokumenty', description: 'Stáhněte si potřebné formuláře', url: '#' },
              { icon: Users, title: 'Náš tým', description: 'Seznamte se s našimi lékaři', url: '#' },
            ]}
          />
        </section>

        <Breaker />

        {/* Documents */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Dokumenty</h2>
          <Documents
            documents={[
              { name: 'Registrační formulář', url: '#', size: '245 KB', extension: 'pdf' },
              { name: 'Informovaný souhlas', url: '#', size: '180 KB', extension: 'pdf' },
              { name: 'Ceník služeb', url: '#', size: '125 KB', extension: 'xlsx' },
            ]}
          />
        </section>

        <Breaker />

        {/* Video */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Video</h2>
          <Video youtubeId="dQw4w9WgXcQ" title="Představení našeho centra" />
        </section>

        <Breaker />

        {/* Actuality */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Aktuality</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Actuality
              title="Nové ordinační hodiny"
              date="2025-01-15"
              text="Od února rozšiřujeme ordinační hodiny naší kardiologie o víkendové pohotovosti..."
              readMoreUrl="#"
            />
            <Actuality
              title="Moderní MR přístroj"
              date="2025-01-10"
              text="Do našeho centra dorazil nejmodernější magnetický rezonance..."
              image="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"
              readMoreUrl="#"
            />
          </div>
        </section>

        <Breaker />

        {/* Work Opportunity */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Pracovní příležitost</h2>
          <WorkOpportunity
            title="Všeobecná sestra"
            description="Hledáme zkušenou všeobecnou sestru do našeho týmu. Nabízíme moderní pracoviště a příjemný kolektiv."
            department="Kardiologie"
            type="Plný úvazek"
            location="Frýdek-Místek"
            ctaUrl="#"
          />
        </section>

        <Breaker />

        {/* Form Components */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Formuláře</h2>
          <Card>
            <ContactForm />
          </Card>
        </section>

        <Breaker />

        {/* Form Elements */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Formulářové prvky</h2>
          <div className="space-y-6 max-w-2xl">
            <Select
              label="Vyberte oddělení"
              name="department"
              options={[
                { value: 'kardio', label: 'Kardiologie' },
                { value: 'neuro', label: 'Neurologie' },
                { value: 'ortho', label: 'Ortopedie' },
              ]}
            />
            <Checkbox label="Souhlasím s obchodními podmínkami" name="terms" />
            <Radio
              label="Vyberte způsob kontaktu"
              name="contact"
              options={[
                { value: 'email', label: 'E-mail' },
                { value: 'phone', label: 'Telefon' },
              ]}
            />
          </div>
        </section>

        <Breaker />

        {/* Marketing Arguments */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Marketingové argumenty</h2>
          <MarketingArguments
            columns={3}
            arguments={[
              { icon: Users, title: 'Zkušený tým', description: '50+ lékařů a specialistů' },
              { icon: Heart, title: 'Moderní vybavení', description: 'Nejnovější zdravotnická technika' },
              { number: '15+', title: 'Let zkušeností', description: 'V péči o vaše zdraví' },
            ]}
          />
        </section>

        <Breaker />

        {/* Timeline */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Časová osa</h2>
          <Timeline
            items={[
              { number: '1', title: 'Objednání', description: 'Objednejte se online nebo telefonicky' },
              { number: '2', title: 'Vyšetření', description: 'Přijďte na termín vyšetření' },
              { number: '3', title: 'Výsledky', description: 'Získejte výsledky a doporučení' },
            ]}
          />
        </section>

        <Breaker />

        {/* Slider */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Slider</h2>
          <Slider
            slides={[
              {
                title: 'Moderní zdravotní péče',
                description: 'Poskytujeme komplexní služby s využitím nejnovější technologie',
                linkText: 'Zjistit více',
                linkUrl: '#',
              },
              {
                title: 'Zkušený tým',
                description: 'Naši lékaři mají dlouholeté zkušenosti ve svých oborech',
                linkText: 'Náš tým',
                linkUrl: '#',
              },
            ]}
          />
        </section>

        <Breaker />

        {/* Photo Gallery */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Fotogalerie</h2>
          <PhotoGallery
            columns={3}
            photos={[
              { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400', alt: 'Čekárna' },
              { url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400', alt: 'Ordinace' },
              { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400', alt: 'MR přístroj' },
              { url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400', alt: 'Lékař' },
            ]}
          />
        </section>

        <Breaker />

        {/* Gallery Slider */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Galerie slider</h2>
          <GallerySlider
            photos={[
              { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600', alt: 'Čekárna' },
              { url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600', alt: 'Ordinace' },
              { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600', alt: 'MR přístroj' },
            ]}
          />
        </section>

        <Breaker />

        {/* Links List */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Seznam odkazů</h2>
          <LinksList
            links={[
              { title: 'Kardiologie', url: '#' },
              { title: 'Neurologie', url: '#' },
              { title: 'Ortopedie - plná kapacita', url: '#', disabled: true, disabledReason: 'Momentálně nepřijímáme nové pacienty' },
            ]}
          />
        </section>

        <Breaker />

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Nadpisy</h2>
          <div className="space-y-4">
            <Heading level={2}>Nadpis úrovně 2</Heading>
            <Heading level={3}>Nadpis úrovně 3</Heading>
            <Heading level={4}>Nadpis úrovně 4</Heading>
            <Heading level={5}>Nadpis úrovně 5</Heading>
            <Heading level={6}>Nadpis úrovně 6</Heading>
          </div>
        </section>

        <Breaker />

        {/* Rich Text */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Formátovaný text</h2>
          <Card>
            <RichText
              content={`
                <h3>O našem centru</h3>
                <p>Centrum Zdraví Sagena poskytuje <strong>komplexní zdravotní péči</strong> již více než 15 let.</p>
                <ul>
                  <li>Moderní vybavení</li>
                  <li>Zkušený tým lékařů</li>
                  <li>Široká nabídka služeb</li>
                </ul>
              `}
            />
          </Card>
        </section>

        <Breaker />

        {/* Doctor Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Karta lékaře</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Doctor
              name="MUDr. Jan Novák"
              department="Kardiologie"
              positions={['Kardiolog', 'Interní lékařství']}
              phones={['+420 553 030 810']}
              emails={['novak@sagena.cz']}
              openingHours={[
                { day: 'Pondělí', time: '8:00 - 16:00' },
                { day: 'Středa', time: '8:00 - 16:00' },
                { day: 'Pátek', time: '8:00 - 14:00' },
              ]}
            />
            <Doctor
              ambulanceTitle="Neurologie"
              name="MUDr. Marie Dvořáková"
              department="Neurologie"
              positions={['Neurolog']}
              phones={['+420 553 030 820']}
              emails={['dvorakova@sagena.cz']}
              holiday={{ from: '2025-02-01', to: '2025-02-14' }}
              openingHours={[
                { day: 'Úterý', time: '9:00 - 17:00' },
                { day: 'Čtvrtek', time: '9:00 - 17:00' },
              ]}
            />
          </div>
        </section>

        <Breaker />

        {/* Contact Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Kontaktní karty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Contact name="Jan Novák" email="novak@sagena.cz" phone="+420 553 030 800" />
            <Contact name="Marie Svobodová" email="svobodova@sagena.cz" phone="+420 553 030 801" />
          </div>
        </section>

        <Breaker />

        {/* How To Find Us */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Jak nás najít</h2>
          <HowToFindUs
            instructions={[
              { icon: DoorOpen, floor: '1. patro', text: 'Vstupte hlavním vchodem a pokračujte k recepci' },
              { icon: ArrowUp, floor: '2. patro', text: 'Jděte po schodech nebo výtahem do 2. patra' },
              { icon: MapPin, floor: '2. patro, č. 215', text: 'Najdete nás na konci chodby vpravo, dveře číslo 215' },
            ]}
          />
        </section>

        <Breaker />

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Tlačítka</h2>
          <div className="space-y-6">
            <ButtonRow
              buttons={[
                { text: 'Primární tlačítko', variant: 'primary' },
                { text: 'Sekundární tlačítko', variant: 'secondary' },
                { text: 'Outline tlačítko', variant: 'outline' },
                { text: 'Ghost tlačítko', variant: 'ghost' },
              ]}
            />
            <ButtonRow
              alignment="center"
              buttons={[
                { text: 'Malé', variant: 'primary', size: 'sm' },
                { text: 'Střední', variant: 'primary', size: 'md' },
                { text: 'Velké', variant: 'primary', size: 'lg' },
              ]}
            />
          </div>
        </section>

        <Breaker />

        {/* Collapse */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Rozbalovací sekce</h2>
          <div className="space-y-4">
            <Collapse
              title="Ordinační hodiny"
              description="Naše ordinace je otevřena v následujících hodinách."
              contact={{ name: 'Dr. Jan Novák', email: 'novak@sagena.cz', phone: '+420 553 030 800' }}
            />
            <Collapse
              title="Dokumenty ke stažení"
              description="Zde najdete všechny potřebné formuláře."
              files={[
                { name: 'Registrační formulář.pdf', url: '#', size: '245 KB' },
                { name: 'Informovaný souhlas.pdf', url: '#', size: '180 KB' },
              ]}
            />
          </div>
        </section>

        <Breaker style="gradient" />

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Štítky (Badges)</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="primary" size="sm">Malý štítek</Badge>
            <Badge variant="primary" size="md">Velký štítek</Badge>
          </div>
        </section>
      </div>
    </div>
  );
}
