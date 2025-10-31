import React from 'react';
import { Heart, Activity, Stethoscope, Brain, Bone, Waves, Eye, Pill, Calendar, Clock, Phone, Award, Shield, Users, MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Doctor from '@/components/people/Doctor';
import CardsWithDescription from '@/components/content/CardsWithDescription';
import MarketingArguments from '@/components/marketing/MarketingArguments';
import Actuality from '@/components/content/Actuality';
import PhotoGallery from '@/components/media/PhotoGallery';
import ContactForm from '@/components/forms/ContactForm';
import PartnerLogos from '@/components/content/PartnerLogos';
import Breaker from '@/components/layout/Breaker';
import RichText from '@/components/typography/RichText';
import Slider from '@/components/marketing/Slider';

export default function HomePage() {
  const services = [
    {
      icon: Heart,
      title: 'Kardiologie',
      description: 'Komplexní péče o vaše srdce a cévy. EKG, echokardiografie, holter monitoring a preventivní vyšetření.',
      linkText: 'Zjistit více',
      linkUrl: '/priklad-1/'
    },
    {
      icon: Brain,
      title: 'Neurologie',
      description: 'Diagnostika a léčba onemocnění nervového systému, bolesti hlavy, závrať a neurologická vyšetření.',
      linkText: 'Zjistit více',
      linkUrl: '#'
    },
    {
      icon: Bone,
      title: 'Ortopedie',
      description: 'Péče o pohybový aparát, léčba úrazů, kloubní problémy a rehabilitační programy.',
      linkText: 'Zjistit více',
      linkUrl: '#'
    },
    {
      icon: Activity,
      title: 'Rehabilitace',
      description: 'Fyzioterapie, masáže, elektroléčba a komplexní rehabilitační péče pod vedením odborníků.',
      linkText: 'Zjistit více',
      linkUrl: '/priklad-2/'
    },
    {
      icon: Waves,
      title: 'MRI vyšetření',
      description: 'Moderní magnetická rezonance pro přesnou diagnostiku celého těla s možností objednání online.',
      linkText: 'Zjistit více',
      linkUrl: '#'
    },
    {
      icon: Eye,
      title: 'Oftalmologie',
      description: 'Komplexní péče o vaše oči včetně preventivních prohlídek a diagnostiky očních onemocnění.',
      linkText: 'Zjistit více',
      linkUrl: '#'
    },
    {
      icon: Stethoscope,
      title: 'Všeobecné lékařství',
      description: 'Registrace k praktickému lékaři, preventivní prohlídky a základní zdravotní péče pro celou rodinu.',
      linkText: 'Zjistit více',
      linkUrl: '#'
    },
    {
      icon: Pill,
      title: 'Lékárna',
      description: 'Plně vybavená lékárna s širokým sortimentem léků, doplňků stravy a zdravotnických pomůcek.',
      linkText: 'Zjistit více',
      linkUrl: '#'
    }
  ];

  const whyChooseUs = [
    {
      number: '25+',
      title: 'Let zkušeností',
      description: 'Poskytujeme zdravotní péči již čtvrt století'
    },
    {
      number: '50+',
      title: 'Odborníků',
      description: 'Tým zkušených lékařů a zdravotnického personálu'
    },
    {
      number: '20+',
      title: 'Specializací',
      description: 'Komplexní nabídka zdravotních služeb na jednom místě'
    },
    {
      number: '15000+',
      title: 'Pacientů ročně',
      description: 'Důvěřuje nám tisíce lidí z celého regionu'
    }
  ];

  const sliderSlides = [
    {
      title: 'Moderní zdravotní centrum v srdci města',
      description: 'Poskytujeme komplexní zdravotní péči s využitím nejnovějších technologií a zkušeného týmu odborníků',
      linkText: 'Naše služby',
      linkUrl: '#sluzby'
    },
    {
      title: 'MRI vyšetření na nejvyšší úrovni',
      description: 'Nový moderní přístroj pro přesnou diagnostiku s možností online objednání a rychlé vyhodnocení',
      linkText: 'Objednat MRI',
      linkUrl: '#'
    },
    {
      title: 'Rehabilitace a fyzioterapie',
      description: 'Komplexní rehabilitační péče s individuálním přístupem a moderním vybavením',
      linkText: 'Více o rehabilitaci',
      linkUrl: '/priklad-2/'
    }
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      alt: 'Recepce Sagena',
      caption: 'Moderní recepce a vstupní prostory'
    },
    {
      url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800',
      alt: 'Ordinace',
      caption: 'Plně vybavené ordinace'
    },
    {
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800',
      alt: 'MRI pracoviště',
      caption: 'Moderní MRI diagnostické centrum'
    },
    {
      url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800',
      alt: 'Vyšetřovna',
      caption: 'Vyšetřovny s nejnovějším vybavením'
    },
    {
      url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800',
      alt: 'Čekárna',
      caption: 'Pohodlné čekárny pro pacienty'
    },
    {
      url: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800',
      alt: 'Rehabilitace',
      caption: 'Rehabilitační centrum'
    }
  ];

  const insuranceLogos = [
    { id: 'vzp', name: 'VZP', logo: 'https://placehold.co/150x80/2563eb/ffffff?text=VZP', url: '#', alt: 'VZP' },
    { id: 'cpzp', name: 'ČPZP', logo: 'https://placehold.co/150x80/2563eb/ffffff?text=ČPZP', url: '#', alt: 'ČPZP' },
    { id: 'ozp', name: 'OZP', logo: 'https://placehold.co/150x80/2563eb/ffffff?text=OZP', url: '#', alt: 'OZP' },
    { id: 'rbp', name: 'RBP', logo: 'https://placehold.co/150x80/2563eb/ffffff?text=RBP', url: '#', alt: 'RBP' },
    { id: 'zpmv', name: 'ZPMV', logo: 'https://placehold.co/150x80/2563eb/ffffff?text=ZPMV', url: '#', alt: 'ZPMV' },
    { id: 'vozp', name: 'VOZP', logo: 'https://placehold.co/150x80/2563eb/ffffff?text=VOZP', url: '#', alt: 'VOZP' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <Slider slides={sliderSlides} autoplay />
      </div>

        {/* Why Choose Us Section */}
        <div className="bg-primary-50 py-16">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card padding="lg" className="text-center bg-white">
                        <Award className="w-12 h-12 text-primary-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-primary-700 mb-2">
                            Kvalitní péče
                        </h3>
                        <p className="text-neutral-600">
                            Certifikované pracoviště splňující nejvyšší standardy kvality
                        </p>
                    </Card>

                    <Card padding="lg" className="text-center bg-white">
                        <Shield className="w-12 h-12 text-primary-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-primary-700 mb-2">
                            Moderní vybavení
                        </h3>
                        <p className="text-neutral-600">
                            Investujeme do nejnovějších diagnostických a léčebných technologií
                        </p>
                    </Card>

                    <Card padding="lg" className="text-center bg-white">
                        <Users className="w-12 h-12 text-primary-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-primary-700 mb-2">
                            Zkušený tým
                        </h3>
                        <p className="text-neutral-600">
                            Více než 50 odborníků s dlouholetou praxí ve svých oborech
                        </p>
                    </Card>
                </div>
            </div>
        </div>

      {/* Services Section */}
      <div id="sluzby" className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Ordinace
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Poskytujeme komplexní spektrum zdravotních služeb na jednom místě
          </p>
        </div>

        <CardsWithDescription cards={services} columns={4} />

        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-6">
            A mnoho dalších specializovaných ambulancí a služeb
          </p>
          <Button variant="outline" size="lg" href="#objednat">
            Zobrazit všechny služby
          </Button>
        </div>
      </div>

      {/* Services Links Only Section */}
      <div className="bg-neutral-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
              Rehabilitace
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <a
                key={index}
                href={service.linkUrl}
                className="text-center p-4 rounded-lg bg-white hover:bg-primary-50 transition-colors duration-200 border border-neutral-200 hover:border-primary-300"
              >
                <span className="text-primary-700 font-semibold hover:text-primary-800">
                  {service.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-primary-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
              Proč si vybrat Sagenu
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Jsme tu pro vás již více než čtvrt století
            </p>
          </div>

          <MarketingArguments arguments={whyChooseUs} columns={4} />
        </div>
      </div>

      {/* Featured Doctors */}
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Praktický lékař
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Seznamte se s některými z našich zkušených odborníků
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Doctor
            name="MUDr. Jana Nováková"
            department="Kardiologie"
            positions={['Kardiologie', 'Interní medicína']}
            emails={['novakova@sagena.cz']}
            phones={['+420 553 030 810']}
            openingHours={[
              { day: 'Pondělí', time: '8:00 - 15:00' },
              { day: 'Úterý', time: '8:00 - 15:00' },
              { day: 'Středa', time: '8:00 - 15:00' },
              { day: 'Čtvrtek', time: '8:00 - 15:00' },
              { day: 'Pátek', time: '8:00 - 15:00' }
            ]}
          />

          <Doctor
            name="MUDr. Petr Svoboda"
            department="Neurologie"
            positions={['Neurologie']}
            emails={['svoboda@sagena.cz']}
            phones={['+420 553 030 820']}
            openingHours={[
              { day: 'Pondělí', time: '9:00 - 16:00' },
              { day: 'Středa', time: '9:00 - 16:00' },
              { day: 'Pátek', time: '9:00 - 16:00' }
            ]}
          />

          <Doctor
            name="MUDr. Martin Dvořák"
            department="Ortopedie"
            positions={['Ortopedie', 'Sportovní medicína']}
            emails={['dvorak@sagena.cz']}
            phones={['+420 553 030 830']}
            openingHours={[
              { day: 'Úterý', time: '8:00 - 14:00' },
              { day: 'Středa', time: '8:00 - 14:00' },
              { day: 'Čtvrtek', time: '8:00 - 14:00' }
            ]}
          />
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" href="#">
            Zobrazit všechny lékaře
          </Button>
        </div>
      </div>

        <Breaker style="gradient" spacing="lg" />

      {/* News Section */}
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Aktuality
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Novinky a důležité informace z našeho centra
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Actuality
            title="Nové MRI pracoviště zahájilo provoz"
            date="2025-01-20"
            text="S radostí oznamujeme, že jsme uvedli do provozu nový moderní MRI přístroj nejnovější generace. Díky tomu můžeme pacientům nabídnout ještě přesnější diagnostiku..."
            image="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"
            readMoreUrl="#"
          />
          <Actuality
            title="Rozšíření rehabilitačních služeb"
            date="2025-01-15"
            text="Od února rozšiřujeme nabídku našeho rehabilitačního centra o nové terapeutické metody včetně laserové terapie a magnetoterapie..."
            image="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400"
            readMoreUrl="/priklad-2/"
          />
          <Actuality
            title="Víkendové pohotovosti kardiologie"
            date="2025-01-10"
            text="Kardiologická ambulance nově poskytuje služby i o víkendech pro urgentní případy. Objednání je možné telefonicky na čísle +420 553 030 810..."
            readMoreUrl="/priklad-1/"
          />
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" href="#">
            Všechny aktuality
          </Button>
        </div>
      </div>

      <Breaker style="gradient" spacing="lg" />

      {/* Photo Gallery */}
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Prohlídka našeho centra
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Podívejte se na naše moderní prostory a vybavení
          </p>
        </div>

        <PhotoGallery photos={galleryImages} columns={3} />
      </div>

      <Breaker style="gradient" spacing="lg" />

      {/* Contact Form */}
      <div id="objednat" className="bg-neutral-50 py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
                Objednat se
              </h2>
              <p className="text-lg text-neutral-600">
                Vyplňte formulář a my vás budeme co nejdříve kontaktovat pro potvrzení termínu
              </p>
            </div>

            <Card padding="lg">
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>

      {/* Insurance Partners */}
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Přijímáme všechny pojišťovny
          </h2>
          <p className="text-lg text-neutral-600">
            Péče je hrazena všemi zdravotními pojišťovnami v České republice
          </p>
        </div>

        <PartnerLogos partners={insuranceLogos} columns={6} grayscale />
      </div>
    </div>
  );
}
