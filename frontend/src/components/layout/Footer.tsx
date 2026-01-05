import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { resolveTextLink, getStrapiMediaURL } from '@/lib/strapi';
import type { Footer as FooterType, NavigationItem, ElementsTextLink } from '@/types/strapi';

interface FooterProps {
  data: FooterType | null;
  locale?: string;
  footerNavigation?: NavigationItem[];
}

const translations = {
  cs: {
    newsletter: {
      title: 'Buďte informováni',
      description: 'Přihlaste se k odběru novinek a důležitých informací ze Sageny',
      placeholder: 'Váš e-mail',
      button: 'Odebírat',
    },
    copyright: '© {year} Sagena. Všechna práva vyhrazena.',
  },
  en: {
    newsletter: {
      title: 'Stay informed',
      description: 'Subscribe to news and important information from Sagena',
      placeholder: 'Your e-mail',
      button: 'Subscribe',
    },
    copyright: '© {year} Sagena. All rights reserved.',
  },
} as const;

const Footer: React.FC<FooterProps> = ({ data, locale = 'cs', footerNavigation = [] }) => {
  const t = translations[locale as keyof typeof translations] || translations.cs;
  // Transform columns value from Strapi to number
  const getColumnsNumber = (columns?: string): 2 | 3 | 4 | 5 | 6 => {
    const mapping: Record<string, 2 | 3 | 4 | 5 | 6> = {
      'Two columns': 2,
      'Three columns': 3,
      'Four columns': 4,
      'Five columns': 5,
      'Six columns': 6,
    };
    return columns ? mapping[columns] || 6 : 6;
  };

  // Transform gap value from Strapi
  const getGapValue = (gap?: string): 'small' | 'medium' | 'large' => {
    const mapping: Record<string, 'small' | 'medium' | 'large'> = {
      'Small spacing': 'small',
      'Medium spacing': 'medium',
      'Large spacing': 'large',
    };
    return gap ? mapping[gap] || 'medium' : 'medium';
  };

  // Grid columns for insurance logos
  const gridColumns = {
    2: 'grid-cols-2 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
  };

  const gapStyles = {
    small: 'gap-4',
    medium: 'gap-6',
    large: 'gap-8',
  };

  const insuranceLogos = data?.insurance_logos;
  const columns = getColumnsNumber(insuranceLogos?.columns ?? undefined);
  const gap = getGapValue(insuranceLogos?.gap ?? undefined);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Newsletter Section - Hidden for now */}
      <div className="hidden border-b border-gray-800">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              {t.newsletter.title}
            </h3>
            <p className="text-gray-400 mb-6">
              {t.newsletter.description}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t.newsletter.placeholder}
                className="flex-1"
              />
              <Button type="submit" size="md">
                {t.newsletter.button}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Company Info - Takes 4 columns on large screens */}
          <div className="lg:col-span-4">
            <Link href={`/${locale}/`} className="flex items-center space-x-3 mb-4">
              <img
                src="/logo-color.svg"
                alt="Sagena"
                className="h-12 w-auto"
              />
            </Link>
            {data?.text && (
              <div
                className="text-gray-400 mb-4 prose prose-sm prose-invert"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            )}
            <div className="space-y-2">
              {data?.contact_phone && (
                <a
                  href={`tel:${data.contact_phone.replace(/\s/g, '')}`}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{data.contact_phone}</span>
                </a>
              )}
              {data?.contact_email && (
                <a
                  href={`mailto:${data.contact_email}`}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{data.contact_email}</span>
                </a>
              )}
              {data?.contact_address && (
                <div className="flex items-start space-x-2 text-gray-400">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="whitespace-pre-line">{data.contact_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Links - Takes remaining 8 columns */}
          {(data?.links && data.links.length > 0) || footerNavigation.length > 0 ? (
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {/* Links from footer single collection (grouped sections) */}
              {data?.links?.map((section, sectionIndex) => (
                <div key={section.id || sectionIndex}>
                  {section.heading && (
                    <h4 className="text-white font-semibold mb-4">{section.heading}</h4>
                  )}
                  {section.links && section.links.length > 0 && (
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => {
                        const resolved = resolveTextLink(link, locale);
                        if (resolved.disabled) return null;
                        return (
                          <li key={link.id || linkIndex}>
                            {resolved.external ? (
                              <a
                                href={resolved.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                {link.text}
                              </a>
                            ) : (
                              <Link
                                href={resolved.url}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                {link.text}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}

              {/* Navigation items where footer=true */}
              {footerNavigation.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-4">Navigace</h4>
                  <ul className="space-y-2">
                    {footerNavigation.map((item, index) => (
                      <li key={index}>
                        {item.target === '_blank' ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Insurance Logos */}
        {insuranceLogos?.partners && insuranceLogos.partners.length > 0 && (
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div
              className={`grid ${gridColumns[columns]} ${gapStyles[gap]} items-center justify-items-center`}
            >
              {insuranceLogos.partners
                .filter((partner) => partner.logo?.url)
                .map((partner, index) => (
                <a
                  key={partner.id || index}
                  href={partner.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 hover:bg-gray-750 transition-all duration-300"
                  aria-label={partner.name || ''}
                >
                  <Image
                    src={getStrapiMediaURL(partner.logo!.url)}
                    alt={partner.logo!.alternativeText || partner.name || ''}
                    width={120}
                    height={60}
                    className={`w-full h-auto max-h-12 object-contain ${
                      insuranceLogos.grayscale
                        ? 'grayscale hover:grayscale-0 transition-all duration-300'
                        : ''
                    }`}
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            {t.copyright.replace('{year}', new Date().getFullYear().toString())}
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
