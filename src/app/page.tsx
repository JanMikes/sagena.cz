import React from 'react';
import { Package, Layout, Lock, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function HomePage() {
  const previewPages = [
    {
      title: 'Komponenty',
      description: 'Kompletní knihovna všech dostupných komponent včetně ukázek použití.',
      icon: Package,
      href: '/komponenty',
      badge: '30+ komponent',
      highlights: [
        'Interaktivní komponenty',
        'Formuláře a vstupy',
        'Marketing a média',
        'Typografie a layout',
      ],
    },
    {
      title: 'S panelem',
      description: 'Ukázka layoutu stránky s postranním panelem pro rychlé odkazy a informace.',
      icon: Layout,
      href: '/s-panelem',
      badge: 'Sticky panel',
      highlights: [
        'Layout 2/3 + 1/3',
        'Sticky postranní panel',
        'Responsivní design',
        'Kontextový obsah',
      ],
    },
    {
      title: 'Intranet',
      description: 'Mockup interního systému s přihlašovací stránkou a dashboardem.',
      icon: Lock,
      href: '/intranet',
      badge: 'Mockup',
      highlights: [
        'Přihlašovací stránka',
        'Intranet navigace',
        'Dashboard s metrikami',
        'Personalizované rozhraní',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="info" className="mb-6 bg-white/20 text-white border-white/30">
              Sagena Component System
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Knihovna komponent
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Kompletní systém komponent pro tvorbu moderních webových stránek.
              Prozkoumejte všechny dostupné komponenty a jejich možnosti využití.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/komponenty" size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                Zobrazit komponenty
              </Button>
              <Button
                href="/s-panelem"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Ukázky layoutů
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Pages Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Náhledy stránek
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Prozkoumejte tři různé typy stránek, které demonstrují využití komponent v praxi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewPages.map((page, index) => {
              const IconComponent = page.icon;
              return (
                <Card
                  key={index}
                  hover
                  className="h-full flex flex-col"
                  padding="lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl">
                      <IconComponent className="w-7 h-7 text-primary-600" />
                    </div>
                    <Badge variant="primary">{page.badge}</Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {page.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                    {page.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {page.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={page.href}
                    variant="outline"
                    className="w-full group"
                  >
                    <span>Zobrazit náhled</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-primary-50/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Co najdete v knihovně
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Interaktivní komponenty
                </h3>
                <p className="text-gray-600 text-sm">
                  Modály, alertykolapsy a další interaktivní prvky pro lepší UX
                </p>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Formuláře
                </h3>
                <p className="text-gray-600 text-sm">
                  Kompletní sada formulářových prvků s validací a zpracováním
                </p>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Marketing & média
                </h3>
                <p className="text-gray-600 text-sm">
                  Slidery, galerie, video, argumenty a další marketingové komponenty
                </p>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Layout & typografie
                </h3>
                <p className="text-gray-600 text-sm">
                  Layoutové komponenty, panely, nadpisy a formátovaný text
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary-600 to-primary-700 border-none text-white text-center" padding="lg">
            <Package className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Připraveni začít?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Prozkoumejte všechny komponenty a zjistěte, jak je můžete využít pro tvorbu vašich stránek.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/komponenty"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Knihovna komponent
              </Button>
              <Button
                href="/s-panelem"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Ukázky layoutů
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
