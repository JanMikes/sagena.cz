import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Footer: React.FC = () => {
  const footerNavigation = {
    services: [
      { name: 'Ordinace', href: '/ordinace' },
      { name: 'Rehabilitace', href: '/rehabilitace' },
      { name: 'MR Vyšetření', href: '/magneticka-rezonance' },
      { name: 'Infuzní Centrum', href: '/infuzni-centrum' },
      { name: 'Lékárna', href: '/lekarna' },
    ],
    company: [
      { name: 'O Nás', href: '/o-nas' },
      { name: 'Náš Tým', href: '/nas-tym' },
      { name: 'Aktuality', href: '/aktuality' },
      { name: 'Kariéra', href: '/kariera' },
    ],
    support: [
      { name: 'Kontakt', href: '/kontakt' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Podmínky Používání', href: '/podminky' },
      { name: 'Ochrana Osobních Údajů', href: '/ochrana-udaju' },
    ],
  };

  const insuranceProviders = [
    'VZP', 'ČPZP', 'RBP', 'ZPMV', 'OZP', 'VOZP'
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Buďte informováni
            </h3>
            <p className="text-gray-400 mb-6">
              Přihlaste se k odběru novinek a důležitých informací ze Sageny
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Váš e-mail"
                className="flex-1"
              />
              <Button type="submit" size="md">
                Odebírat
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <span className="text-2xl font-bold text-white">Sagena</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Centrum zdraví poskytující komplexní zdravotní péči desítkám tisíc spokojených klientů.
            </p>
            <div className="space-y-2">
              <a
                href="tel:+420553030800"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+420 553 030 800</span>
              </a>
              <a
                href="mailto:info@sagena.cz"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>info@sagena.cz</span>
              </a>
              <div className="flex items-start space-x-2 text-gray-400">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>8. pěšího pluku 2450<br />738 01 Frýdek-Místek</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Služby</h4>
            <ul className="space-y-2">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Společnost</h4>
            <ul className="space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Podpora</h4>
            <ul className="space-y-2">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Insurance Providers */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="text-white font-semibold mb-4 text-center">Akceptujeme pojišťovny</h4>
          <div className="flex flex-wrap justify-center gap-6">
            {insuranceProviders.map((provider) => (
              <div
                key={provider}
                className="px-6 py-3 bg-gray-800 rounded-lg text-gray-300 font-medium"
              >
                {provider}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Sagena. Všechna práva vyhrazena.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-lg transition-all"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-lg transition-all"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-lg transition-all"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
