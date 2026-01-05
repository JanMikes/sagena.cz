import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight, Map, Clock } from 'lucide-react';

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
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
        >
          {/* Photo */}
          {card.photo && (
            <div className="relative h-48 w-full">
              <Image
                src={card.photo}
                alt={card.photoAlt || card.title || ''}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Title */}
            {card.title && (
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {card.title}
              </h3>
            )}

            {/* Description */}
            {card.description && (
              <p className="text-gray-600 mb-4 leading-relaxed">
                {card.description}
              </p>
            )}

            {/* Contact Info */}
            <div className="space-y-2 flex-1">
              {/* Address */}
              {card.address && (
                <div className="flex items-start space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5" />
                  <span className="text-sm whitespace-pre-line">{card.address}</span>
                </div>
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

              {/* Opening Hours */}
              {card.openingHours && card.openingHours.length > 0 && (
                <div className="flex items-start space-x-3 text-gray-600 pt-2">
                  <Clock className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5" />
                  <div className="text-sm space-y-1 flex-1">
                    {Object.entries(
                      card.openingHours.reduce<Record<string, string[]>>((acc, hours) => {
                        if (!acc[hours.day]) {
                          acc[hours.day] = [];
                        }
                        acc[hours.day].push(hours.time);
                        return acc;
                      }, {})
                    ).map(([day, times]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium">{day}</span>
                        <div className="text-right">
                          {times.map((time, index) => (
                            <div key={index}>{time}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons (full-width at bottom) */}
            {(card.link || card.mapLink) && (
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                {card.link && (
                  <Link
                    href={card.link.url}
                    target={card.link.external ? '_blank' : undefined}
                    rel={card.link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-center w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors group"
                  >
                    <span>{card.link.text}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                {card.mapLink && (
                  <Link
                    href={card.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors group"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    <span>Zobrazit na mapě</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationCards;
