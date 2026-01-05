import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

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
  const iconContainerClass = isCentered
    ? 'flex items-center justify-center w-14 h-14 mb-4 mx-auto'
    : 'flex items-center justify-center w-14 h-14 mb-4';

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {cards.map((card, index) => {
        // Determine if we should make the whole card clickable
        const shouldWrapInLink = cardClickable && card.link?.url;

        const cardContent = (
          <>
            {card.icon && (
              <div className={iconContainerClass}>
                <Image
                  src={card.icon}
                  alt=""
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain"
                />
              </div>
            )}
            <h3 className={`text-xl font-bold text-gray-900 mb-2 ${isCentered ? 'group-hover:text-primary-600 transition-colors' : ''}`}>
              {card.title}
            </h3>
            {card.description && (
              <p className="text-gray-600 mb-4 leading-relaxed">
                {card.description}
              </p>
            )}
            {/* Show link button only when not in cardClickable mode */}
            {card.link && !cardClickable && (
              <Link
                href={card.link.url}
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium group"
              >
                <span>{card.link.text}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </>
        );

        const baseCardClass = `bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${textAlignClass}`;

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
