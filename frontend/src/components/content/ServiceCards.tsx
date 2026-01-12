import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import RichText from '@/components/typography/RichText';

interface CardItem {
  icon?: string | null;  // Icon image URL from Strapi
  title: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
}

interface ServiceCardsProps {
  cards: CardItem[];
  columns?: 2 | 3 | 4 | 5;
  textAlign?: 'Left aligned' | 'Center aligned';
  cardClickable?: boolean;
}

const ServiceCards: React.FC<ServiceCardsProps> = ({
  cards,
  columns = 3,
  textAlign = 'Left aligned',
  cardClickable = false,
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
    5: 'md:grid-cols-3 lg:grid-cols-5',
  };

  const isCentered = textAlign === 'Center aligned';
  const textAlignClass = isCentered ? 'text-center' : '';

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {cards.map((card, index) => {
        // Determine if we should make the whole card clickable
        const shouldWrapInLink = cardClickable && card.link?.url;

        const cardContent = (
          <>
            {/* Icon + Title on same line */}
            <div className={`flex items-center gap-3 ${isCentered ? 'justify-center' : ''} ${!card.description && card.link ? 'mb-6' : 'mb-2'}`}>
              {card.icon && (
                <div className="flex-shrink-0 w-10 h-10">
                  <Image
                    src={card.icon}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
              <h3 className={`font-semibold text-primary-600 ${isCentered ? 'group-hover:text-primary-700 transition-colors' : ''}`}>
                {card.title}
              </h3>
            </div>
            {card.description && (
              <RichText
                content={card.description}
                size="sm"
                className={`text-primary-400 leading-relaxed [&_p]:text-primary-400 ${card.link ? 'mb-6' : ''}`}
              />
            )}
            {/* Arrow always in bottom-right with absolute positioning */}
            {card.link && (
              <div className="absolute bottom-0 right-0">
                {!cardClickable ? (
                  <Link
                    href={card.link.url}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-tl-lg rounded-br-xl hover:brightness-95 transition-all group"
                    style={{ backgroundColor: '#a0bfdf' }}
                  >
                    {card.link.text && (
                      <span className="text-white font-medium text-sm">{card.link.text}</span>
                    )}
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 px-5 py-3 rounded-tl-lg rounded-br-xl" style={{ backgroundColor: '#a0bfdf' }}>
                    {card.link.text && (
                      <span className="text-white font-medium text-sm">{card.link.text}</span>
                    )}
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </div>
            )}
          </>
        );

        const baseCardClass = `relative flex flex-col bg-white rounded-xl p-6 shadow-[0_0_25px_rgba(204,229,243,0.8)] hover:shadow-[0_0_35px_rgba(153,203,231,0.9)] hover:-translate-y-1 transition-[box-shadow,transform] duration-300 ${textAlignClass}`;

        if (shouldWrapInLink) {
          return (
            <Link
              key={index}
              href={card.link!.url}
              className={`${baseCardClass} block group`}
            >
              {cardContent}
            </Link>
          );
        }

        return (
          <div key={index} className={baseCardClass}>
            {cardContent}
          </div>
        );
      })}
    </div>
  );
};

export default ServiceCards;
