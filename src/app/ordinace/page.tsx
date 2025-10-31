import React from 'react';
import {
    Activity, Zap, Waves, Sparkles, Heart, Briefcase, Phone, Mail, Clock, FileText, AlertCircle, ChevronRight,
    DoorOpen, ArrowUp, MapPin
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import SidePanel from '@/components/layout/SidePanel';
import FullWidthCards from '@/components/content/FullWidthCards';
import Video from '@/components/content/Video';
import Actuality from '@/components/content/Actuality';
import WorkOpportunity from '@/components/content/WorkOpportunity';
import Documents from '@/components/content/Documents';
import Alert from '@/components/interactive/Alert';
import LinksList from '@/components/navigation/LinksList';
import Collapse from '@/components/interactive/Collapse';
import RichText from '@/components/typography/RichText';
import Breaker from '@/components/layout/Breaker';
import HowToFindUs from "@/components/layout/HowToFindUs";
import Doctor from "@/components/people/Doctor";

export default function Priklad2Page() {
  const breadcrumbItems = [
    { label: 'Domů', href: '/' },
    { label: 'Služby', href: '#' },
    { label: 'Rehabilitační služby' }
  ];

  const services = [
    {
      icon: Activity,
      title: 'Fyzioterapie',
      description: 'Individuální cvičení s fyzioterapeutem, léčebná tělesná výchova, pohybová terapie',
      url: '#'
    },
    {
      icon: Waves,
      title: 'Masáže',
      description: 'Klasická masáž, reflexní masáž, lymfatická drenáž, sportovní masáž',
      url: '#'
    },
    {
      icon: Zap,
      title: 'Elektroléčba',
      description: 'TENS, ultrazvuk, magnetoterapie, laserová terapie, iontoforéza',
      url: '#'
    },
    {
      icon: Sparkles,
      title: 'Speciální metody',
      description: 'Kinesiotaping, suchá jehla, baňkování, McKenzie metoda, Vojtova metoda',
      url: '#'
    }
  ];

  const documents = [
    {
      name: 'Ceník rehabilitačních služeb 2025',
      url: '#',
      size: '156 KB',
      extension: 'pdf'
    },
    {
      name: 'Informace pro nové pacienty',
      url: '#',
      size: '98 KB',
      extension: 'pdf'
    },
    {
      name: 'Žádanka na rehabilitaci',
      url: '#',
      size: '245 KB',
      extension: 'pdf'
    },
    {
      name: 'Cvičební plán ke stažení',
      url: '#',
      size: '312 KB',
      extension: 'pdf'
    }
  ];

  const quickLinks = [
    { title: 'Objednat se online', url: '#' },
    { title: 'Kontakt na recepci', url: 'tel:+420553030850' },
    { title: 'Jak se k nám dostat', url: '#' },
    { title: 'Ceník služeb', url: '#' },
    { title: 'Často kladené otázky', url: '#' }
  ];

  const introContent = `
    <p><strong>Rehabilitační centrum Sagena</strong> poskytuje komplexní fyzioterapeutickou a rehabilitační péči pro pacienty všech věkových kategorií. Náš tým zkušených fyzioterapeutů a rehabilitačních pracovníků vám pomůže při léčbě akutních i chronických potíží pohybového aparátu.</p>

    <p>Zaměřujeme se na individuální přístup ke každému pacientovi a vytváříme léčebné plány šité na míru vašim potřebám. Disponujeme moderním vybavením a aplikujeme nejnovější metody fyzioterapie a rehabilitace.</p>
  `;

  const whoIsItForContent = `
    <h3>Pro koho jsou naše služby určeny?</h3>
    <ul>
      <li><strong>Pacienti po úrazech a operacích</strong> - rehabilitace po zlomeninách, operacích kloubů, úrazech páteře</li>
      <li><strong>Bolesti pohybového aparátu</strong> - bolesti zad, krční páteře, ramene, kolen a dalších kloubů</li>
      <li><strong>Neurologické diagnózy</strong> - rehabilitace po cévní mozkové příhodě, roztroušené skleróze, Parkinsonově chorobě</li>
      <li><strong>Sportovci</strong> - prevence a léčba sportovních úrazů, zlepšení výkonu</li>
      <li><strong>Senioři</strong> - udržení a zlepšení pohyblivosti, prevence pádů</li>
      <li><strong>Preventivní péče</strong> - prevence problémů s držením těla, posílení svalstva</li>
    </ul>
  `;

  const processContent = `
    <h3>Jak probíhá rehabilitace?</h3>
    <ol>
      <li><strong>První vyšetření</strong> - Fyzioterapeut provede důkladné vyšetření, zjistí anamnézu a stanoví léčebný plán</li>
      <li><strong>Terapie</strong> - Individuální terapeutické jednotky 1-3x týdně podle potřeby, kombinace různých metod</li>
      <li><strong>Domácí cvičení</strong> - Doporučení cvičení pro domácí péči, které urychlí léčbu</li>
      <li><strong>Kontrolní vyšetření</strong> - Pravidelné hodnocení pokroku a úprava léčebného plánu</li>
    </ol>

    <p>Standardní terapeutická jednotka trvá 30-60 minut. Počet návštěv závisí na diagnóze a stavu pacienta, obvykle 10-20 sezení.</p>
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Rehabilitační služby
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl">
            Komplexní fyzioterapeutická a rehabilitační péče s individuálním přístupem a moderním vybavením
          </p>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Introduction */}
            <div>
              <RichText content={introContent} />
              <div className="mt-6">
                <Button variant="primary" size="lg" href="#objednat">
                  Objednat se na rehabilitaci
                </Button>
              </div>
            </div>

              {/* Alert */}
              <Alert variant="info" title="Důležitá informace">
                  Pro první vyšetření je nutné doporučení od lékaře. Akutní stavy řešíme přednostně.
              </Alert>

          {/* How To Find Us */}
          <section>
              <HowToFindUs
                  instructions={[
                      { icon: DoorOpen, floor: '1. patro', text: 'Vstupte hlavním vchodem a pokračujte k recepci' },
                      { icon: ArrowUp, floor: '2. patro', text: 'Jděte po schodech nebo výtahem do 2. patra' },
                      { icon: MapPin, floor: '2. patro, č. 215', text: 'Najdete nás na konci chodby vpravo, dveře číslo 215' },
                  ]}
              />
          </section>

            {/* Services */}
            <div>
              <h2 className="text-3xl font-bold text-primary-700 mb-6">
                Naše rehabilitační metody
              </h2>
              <FullWidthCards cards={services} />
            </div>

              <Breaker />

              {/* Doctor Cards */}
              <section>
                  <h2 className="text-2xl font-bold mb-6">Karta lékaře</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Who is it for */}
            <Card padding="lg">
              <RichText content={whoIsItForContent} />
            </Card>

            <Breaker />

            {/* Video */}
            <div>
              <h2 className="text-3xl font-bold text-primary-700 mb-6">
                Ukázka z našeho rehabilitačního centra
              </h2>
              <Video
                youtubeId="dQw4w9WgXcQ"
                title="Prohlídka rehabilitačního centra"
              />
            </div>

            <Breaker />

            {/* Process */}
            <Card padding="lg">
              <RichText content={processContent} />
            </Card>

            <Breaker />

            {/* CTA Section */}
            <Card padding="lg" className="bg-primary-50">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary-700 mb-4">
                  Máte dotazy nebo chcete rezervovat termín?
                </h3>
                <p className="text-neutral-600 mb-6">
                  Kontaktujte nás telefonicky nebo prostřednictvím online formuláře
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="primary" size="lg" href="tel:+420553030850">
                    <Phone className="w-5 h-5 mr-2" />
                    +420 553 030 850
                  </Button>
                  <Button variant="secondary" size="lg" href="#objednat">
                    Online formulář
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - 1/3 width */}
          <SidePanel position="right" sticky>
            {/* Contact Info */}
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-bold text-primary-700">Kontakt</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-500">Recepce rehabilitace</p>
                  <a href="tel:+420553030850" className="text-lg font-medium text-primary-600 hover:text-primary-700">
                    +420 553 030 850
                  </a>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <a href="mailto:rehabilitace@sagena.cz" className="text-primary-600 hover:text-primary-700">
                    rehabilitace@sagena.cz
                  </a>
                </div>
              </div>
            </Card>

            {/* Opening Hours */}
            <Collapse
              title="Ordinační hodiny"
              description="Rehabilitační centrum je otevřeno 6 dní v týdnu"
              contact={{
                name: 'Recepce rehabilitace',
                email: 'rehabilitace@sagena.cz',
                phone: '+420 553 030 850'
              }}
              defaultOpen
            />

            {/* Documents */}
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-bold text-primary-700">Dokumenty</h3>
              </div>
              <Documents documents={documents} columns={1} />
            </Card>

            {/* Quick Links */}
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <ChevronRight className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-bold text-primary-700">Rychlé odkazy</h3>
              </div>
              <LinksList links={quickLinks} />
            </Card>

            {/* Price Info Card */}
            <Card padding="lg" className="bg-medical-green/10 border-medical-green/20">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-6 h-6 text-medical-green" />
                <h3 className="text-lg font-bold text-primary-700">Hrazeno pojišťovnou</h3>
              </div>
              <p className="text-sm text-neutral-600">
                Většina rehabilitačních výkonů je hrazena zdravotními pojišťovnami na základě doporučení lékaře.
              </p>
            </Card>

            {/* Opening Hours Card */}
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-bold text-primary-700">Otevírací doba</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Po-Pá</span>
                  <span className="font-medium">7:00 - 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Sobota</span>
                  <span className="font-medium">8:00 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Neděle</span>
                  <span className="font-medium text-red-600">Zavřeno</span>
                </div>
              </div>
            </Card>
          </SidePanel>
        </div>
      </div>
    </div>
  );
}
