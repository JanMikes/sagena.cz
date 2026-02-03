'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight, Clock } from 'lucide-react';
import RichText from '@/components/typography/RichText';

interface LocationCardData {
  title?: string;
  photo?: string | null;
  photoAlt?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  link?: {
    text: string;
    url: string;
    external: boolean;
  };
  mapLink?: string;
  openingHours?: { day: string; time: string }[];
}

interface LocationCardsProps {
  cards: LocationCardData[];
  columns?: 2 | 3 | 4;
}

const LocationCard: React.FC<{ card: LocationCardData }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasOpeningHours = card.openingHours && card.openingHours.length > 0;

  return (
    <div
      className="relative"
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative w-full transition-transform duration-700 ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {/* Photo */}
            {card.photo && (
              <div className="relative h-48 w-full flex-shrink-0">
                <Image
                  src={card.photo}
                  alt={card.photoAlt || card.title || ''}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col">
              {/* Title */}
              {card.title && (
                <h3 className="text-xl font-bold text-primary-600 mb-3">
                  {card.title}
                </h3>
              )}

              {/* Description */}
              {card.description && (
                <RichText
                  content={card.description}
                  size="sm"
                  className="text-gray-600 mb-4 leading-relaxed [&_p]:text-gray-600"
                />
              )}

              {/* Contact Info */}
              <div className="space-y-2">
                {/* Address */}
                {card.address && (
                  card.mapLink ? (
                    <a
                      href={card.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <MapPin className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5" />
                      <span className="text-sm whitespace-pre-line">{card.address}</span>
                    </a>
                  ) : (
                    <div className="flex items-start space-x-3 text-gray-600">
                      <MapPin className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5" />
                      <span className="text-sm whitespace-pre-line">{card.address}</span>
                    </div>
                  )
                )}

                {/* Phone */}
                {card.phone && (
                  <a
                    href={`tel:${card.phone.replace(/\s/g, '')}`}
                    className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Phone className="w-5 h-5 flex-shrink-0 text-primary-600" />
                    <span className="text-sm">{card.phone}</span>
                  </a>
                )}

                {/* Email */}
                {card.email && (
                  <a
                    href={`mailto:${card.email}`}
                    className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Mail className="w-5 h-5 flex-shrink-0 text-primary-600" />
                    <span className="text-sm">{card.email}</span>
                  </a>
                )}
              </div>

              {/* Opening Hours Button */}
              {hasOpeningHours && (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-primary-600 text-white font-medium text-sm transition-colors border border-primary-600 rounded-lg hover:bg-primary-700 hover:border-primary-700"
                >
                  <Clock className="w-4 h-4 text-white" />
                  <span>Ordinační hodiny</span>
                </button>
              )}

              {/* Buttons (full-width at bottom) */}
              {card.link && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={card.link.url}
                    target={card.link.external ? '_blank' : undefined}
                    rel={card.link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-center w-full px-3 py-2 text-primary-600 hover:text-primary-700 text-sm rounded-lg border border-primary-600 hover:bg-primary-50 transition-colors group"
                  >
                    <span>{card.link.text}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-primary-600 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Side - Opening Hours */}
        <div
          className="absolute inset-0 top-0 left-0 w-full h-full [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="bg-primary-600 text-white rounded-xl p-6 h-full flex flex-col">
            <h4 className="text-xl font-bold mb-4">Ordinační hodiny</h4>
            {card.title && (
              <p className="text-primary-100 mb-4">{card.title}</p>
            )}
            <div className="space-y-2 flex-1">
              {card.openingHours && Object.entries(
                card.openingHours.reduce<Record<string, string[]>>((acc, hours) => {
                  if (!acc[hours.day]) {
                    acc[hours.day] = [];
                  }
                  acc[hours.day].push(hours.time);
                  return acc;
                }, {})
              ).map(([day, times]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="font-medium">{day}</span>
                  <div className="text-right">
                    {times.map((time, index) => (
                      <div key={index}>{time}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsFlipped(false)}
              className="mt-3 w-full py-1.5 bg-white text-primary-600 rounded text-xs hover:bg-primary-50 transition-colors"
            >
              Zpět
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LocationCards: React.FC<LocationCardsProps> = ({
  cards,
  columns = 3,
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {cards.map((card, index) => (
        <LocationCard key={index} card={card} />
      ))}
    </div>
  );
};

export default LocationCards;
