'use client';

import React from 'react';

// Import all components
import PopupModal from '@/components/interactive/PopupModal';
import ExpandableSection from '@/components/interactive/ExpandableSection';
import Alert from '@/components/interactive/Alert';
import ServiceCards from '@/components/content/ServiceCards';
import FullWidthCards from '@/components/content/FullWidthCards';
import Documents from '@/components/content/Documents';
import Video from '@/components/content/Video';
import NewsArticle from '@/components/content/NewsArticle';
import JobPosting from '@/components/content/JobPosting';
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
import DoctorProfile from '@/components/people/DoctorProfile';
import ContactCard from '@/components/people/ContactCard';
import Directions from '@/components/layout/Directions';
import SectionDivider from '@/components/layout/SectionDivider';
import ButtonGroup from '@/components/layout/ButtonGroup';
import LocationCards from '@/components/content/LocationCards';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import PartnerLogos from '@/components/content/PartnerLogos';
import { insuranceProviders, medicalPartners } from '@/data/partners';

export default function KomponentyPage() {
  return (
    <>
      <PopupModal
        title="Vítejte na stránce komponent"
        description="Tato stránka obsahuje přehled všech dostupných komponent, které můžete použít při tvorbě obsahu."
        link={{ text: 'Rozumím', url: '/cs/komponenty/' }}
      />

      <div className="container-custom py-12 space-y-8">
        <Breadcrumb items={[{ label: 'Komponenty', href: '/cs/komponenty' }, { label: 'Aktuální stránka' }]} locale="cs" />

      <SectionDivider style="Gradient line" />

      <Heading level={2}>Upozornění (Alerts)</Heading>
      <Alert type="info" title="Informace" text="Toto je informační upozornění pro uživatele." />
      <Alert type="success" title="Úspěch" text="Operace byla úspěšně dokončena." />
      <Alert type="warning" title="Varování" text="Tato akce vyžaduje vaši pozornost." />
      <Alert type="error" title="Chyba" text="Něco se pokazilo. Zkuste to prosím znovu." />

      <SectionDivider />

      <Heading level={2}>Karty s popisem</Heading>
      <ServiceCards
        columns={3}
        cards={[
          { icon: null, title: 'Kardiologie', description: 'Péče o vaše srdce', link: { text: 'Zjistit více', url: '#' } },
          { icon: null, title: 'Rehabilitace', description: 'Moderní rehabilitační metody', link: { text: 'Zjistit více', url: '#' } },
          { icon: null, title: 'Ordinace', description: 'Široká nabídka ordinací', link: { text: 'Zjistit více', url: '#' } },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Karty na celou šířku</Heading>
      <FullWidthCards
        cards={[
          { icon: null, title: 'Objednání', description: 'Objednejte se online', url: '#' },
          { icon: null, title: 'Dokumenty', description: 'Stáhněte si potřebné formuláře', url: '#' },
          { icon: null, title: 'Náš tým', description: 'Seznamte se s našimi lékaři', url: '#' },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Dokumenty</Heading>
      <Documents
        documents={[
          { name: 'Registrační formulář', url: '#', size: '245 KB', extension: 'pdf' },
          { name: 'Informovaný souhlas', url: '#', size: '180 KB', extension: 'pdf' },
          { name: 'Ceník služeb', url: '#', size: '125 KB', extension: 'xlsx' },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Video</Heading>
      <Video youtubeId="dQw4w9WgXcQ" />

      <SectionDivider />

      <Heading level={2}>Aktuality</Heading>
      <NewsArticle
        title="Nové ordinační hodiny"
        date="2025-01-15"
        text="Od února rozšiřujeme ordinační hodiny naší kardiologie o víkendové pohotovosti..."
        readMoreUrl="#"
      />
      <NewsArticle
        title="Moderní MR přístroj"
        date="2025-01-10"
        text="Do našeho centra dorazil nejmodernější magnetický rezonance..."
        image="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"
        readMoreUrl="#"
      />

      <SectionDivider />

      <Heading level={2}>Pracovní příležitost</Heading>
      <JobPosting
        title="Všeobecná sestra"
        description="Hledáme zkušenou všeobecnou sestru do našeho týmu. Nabízíme moderní pracoviště a příjemný kolektiv."
        department="Kardiologie"
        employment_type="Plný úvazek"
        location="Frýdek-Místek"
        cta_link={{ text: "Zobrazit pozici", url: "#" }}
      />

      <SectionDivider />

      <Heading level={2}>Formuláře</Heading>
      <Card>
        <ContactForm />
      </Card>

      <SectionDivider />

      <Heading level={2}>Formulářové prvky</Heading>
      <Card>
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
      </Card>

      <SectionDivider />

      <Heading level={2}>Marketingové argumenty</Heading>
      <MarketingArguments
        columns={3}
        arguments={[
          { icon: null, title: 'Zkušený tým', description: '50+ lékařů a specialistů' },
          { icon: null, title: 'Moderní vybavení', description: 'Nejnovější zdravotnická technika' },
          { number: '15+', title: 'Let zkušeností', description: 'V péči o vaše zdraví' },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Časová osa</Heading>
      <Timeline
        items={[
          { number: '1', title: 'Objednání', description: 'Objednejte se online nebo telefonicky' },
          { number: '2', title: 'Vyšetření', description: 'Přijďte na termín vyšetření' },
          { number: '3', title: 'Výsledky', description: 'Získejte výsledky a doporučení' },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Slider</Heading>
      <Slider
        slides={[
          {
            title: 'Moderní zdravotní péče',
            description: 'Poskytujeme komplexní služby s využitím nejnovější technologie',
            link: { text: 'Zjistit více', url: '#' },
          },
          {
            title: 'Zkušený tým',
            description: 'Naši lékaři mají dlouholeté zkušenosti ve svých oborech',
            link: { text: 'Náš tým', url: '#' },
          },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Fotogalerie</Heading>
      <PhotoGallery
        columns={3}
        photos={[
          { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400', alt: 'Čekárna' },
          { url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400', alt: 'Ordinace' },
          { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400', alt: 'MR přístroj' },
          { url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400', alt: 'Lékař' },
          { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400', alt: 'Čekárna' },
          { url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400', alt: 'Ordinace' },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Galerie slider</Heading>
      <GallerySlider
        photos={[
          { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600', alt: 'Čekárna' },
          { url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600', alt: 'Ordinace' },
          { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600', alt: 'MR přístroj' },
          { url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600', alt: 'Lékař' },
          { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600', alt: 'Čekárna 2' },
          { url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600', alt: 'Ordinace 2' },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Seznam odkazů</Heading>
      <LinksList
        links={[
          { title: 'Kardiologie', url: '#' },
          { title: 'Neurologie', url: '#' },
          { title: 'Ortopedie - plná kapacita', url: '#', disabled: true, disabledReason: 'Momentálně nepřijímáme nové pacienty' },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Nadpisy</Heading>
      <Heading level={2}>Nadpis úrovně 2</Heading>
      <Heading level={3}>Nadpis úrovně 3</Heading>
      <Heading level={4}>Nadpis úrovně 4</Heading>
      <Heading level={5}>Nadpis úrovně 5</Heading>
      <Heading level={6}>Nadpis úrovně 6</Heading>

      <SectionDivider />

      <Heading level={2}>Formátovaný text</Heading>
      <RichText
        content={`### O našem centru

Centrum Zdraví Sagena poskytuje **komplexní zdravotní péči** již více než 15 let.

- Moderní vybavení
- Zkušený tým lékařů
- Široká nabídka služeb`}
      />

      <SectionDivider />

      <Heading level={2}>Karty lékařů (grid 3 sloupce)</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DoctorProfile
          name="MUDr. Jan Novák"
          department="Kardiologie"
          positions={['Kardiolog', 'Interní lékařství']}
          phone="+420 553 030 810"
          email="novak@sagena.cz"
          openingHours={[
            { day: 'Pondělí', time: '8:00 - 16:00' },
            { day: 'Středa', time: '8:00 - 16:00' },
            { day: 'Pátek', time: '8:00 - 14:00' },
          ]}
        />
        <DoctorProfile
          ambulanceTitle="Neurologie"
          name="MUDr. Marie Dvořáková"
          department="Neurologie"
          positions={['Neurolog']}
          phone="+420 553 030 820"
          email="dvorakova@sagena.cz"
          holiday={{ from: '2025-02-01', to: '2025-02-14' }}
          openingHours={[
            { day: 'Úterý', time: '9:00 - 17:00' },
            { day: 'Čtvrtek', time: '9:00 - 17:00' },
          ]}
        />
        <DoctorProfile
          ambulanceTitle="Ortopedie"
          name="MUDr. Petr Svoboda"
          department="Ortopedie"
          positions={['Ortoped', 'Chirurg']}
          phone="+420 553 030 830"
          email="svoboda@sagena.cz"
          openingHours={[
            { day: 'Pondělí', time: '7:00 - 15:00' },
            { day: 'Středa', time: '7:00 - 15:00' },
          ]}
        />
      </div>

      <SectionDivider />

      <Heading level={2}>Kontaktní karty</Heading>
      <ContactCard name="Jan Novák" email="novak@sagena.cz" phone="+420 553 030 800" />
      <ContactCard name="Marie Svobodová" email="svobodova@sagena.cz" phone="+420 553 030 801" />

      <SectionDivider />

      <Heading level={2}>Karty poboček</Heading>
      <LocationCards
        columns={3}
        cards={[
          {
            title: 'Pobočka Frýdek-Místek',
            photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
            photoAlt: 'Budova pobočky Frýdek-Místek',
            address: 'Palackého 123\n738 01 Frýdek-Místek',
            phone: '+420 553 030 800',
            email: 'fm@sagena.cz',
            description: 'Hlavní pobočka s kompletním vybavením pro kardiologii a neurologii.',
            link: { text: 'Více informací', url: '#', external: false },
            mapLink: 'https://maps.google.com',
          },
          {
            title: 'Pobočka Ostrava',
            photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400',
            photoAlt: 'Budova pobočky Ostrava',
            address: 'Hlavní třída 456\n702 00 Ostrava',
            phone: '+420 596 123 456',
            email: 'ostrava@sagena.cz',
            description: 'Moderní pracoviště s ambulancemi a rehabilitačním centrem.',
            link: { text: 'Více informací', url: '#', external: false },
            mapLink: 'https://maps.google.com',
          },
          {
            title: 'Pobočka Havířov',
            address: 'Nádražní 789\n736 01 Havířov',
            phone: '+420 596 789 012',
            email: 'havirov@sagena.cz',
            description: 'Specializované pracoviště pro ortopedii.',
          },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Jak nás najít</Heading>
      <Directions
        instructions={[
          { icon: null, floor: '1. patro', text: 'Vstupte hlavním vchodem a pokračujte k recepci' },
          { icon: null, floor: '2. patro', text: 'Jděte po schodech nebo výtahem do 2. patra' },
          { icon: null, floor: '2. patro, č. 215', text: 'Najdete nás na konci chodby vpravo, dveře číslo 215' },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Tlačítka</Heading>
      <ButtonGroup
        buttons={[
          { text: 'Primární tlačítko', variant: 'primary' },
          { text: 'Sekundární tlačítko', variant: 'secondary' },
          { text: 'Outline tlačítko', variant: 'outline' },
          { text: 'Ghost tlačítko', variant: 'ghost' },
        ]}
      />
      <ButtonGroup
        alignment="center"
        buttons={[
          { text: 'Malé', variant: 'primary', size: 'sm' },
          { text: 'Střední', variant: 'primary', size: 'md' },
          { text: 'Velké', variant: 'primary', size: 'lg' },
        ]}
      />

      <SectionDivider />

      <Heading level={2}>Rozbalovací sekce</Heading>
      <ExpandableSection
        title="Ordinační hodiny"
        description="Naše ordinace je otevřena v následujících hodinách."
        contacts={[
          { name: 'Dr. Jan Novák', email: 'novak@sagena.cz', phone: '+420 553 030 800' },
        ]}
      />
      <ExpandableSection
        title="Dokumenty ke stažení"
        description="Zde najdete všechny potřebné formuláře."
        files={[
          { name: 'Registrační formulář.pdf', url: '#', ext: '.pdf', size: 245 },
          { name: 'Informovaný souhlas.pdf', url: '#', ext: '.pdf', size: 180 },
        ]}
      />

      <SectionDivider style="Gradient line" />

      <Heading level={2}>Štítky (Badges)</Heading>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="primary" size="sm">Malý štítek</Badge>
      <Badge variant="primary" size="md">Velký štítek</Badge>

      <SectionDivider />

      <Heading level={2}>Loga partnerů</Heading>
      <Heading level={3}>Zdravotní pojišťovny (6 sloupců, grayscale)</Heading>
      <Card>
        <PartnerLogos partners={insuranceProviders} columns={6} gap="medium" grayscale={true} />
      </Card>

      <Heading level={3}>Zdravotní pojišťovny (4 sloupce, barevné)</Heading>
      <Card>
        <PartnerLogos partners={insuranceProviders} columns={4} gap="large" grayscale={false} />
      </Card>

        <Heading level={3}>Mediální partneři (3 sloupce)</Heading>
        <Card>
          <PartnerLogos partners={medicalPartners} columns={3} gap="large" />
        </Card>
      </div>
    </>
  );
}
