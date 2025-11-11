import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface CardItem {
  icon: LucideIcon;
  title: string;
  description?: string;
  linkText: string;
  linkUrl: string;
}

interface CardsWithDescriptionProps {
  cards: CardItem[];
  columns?: 2 | 3 | 4;
}

const CardsWithDescription: React.FC<CardsWithDescriptionProps> = ({
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
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-4">
              <IconComponent className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {card.title}
            </h3>
            {card.description && (
              <p className="text-gray-600 mb-4 leading-relaxed">
                {card.description}
              </p>
            )}
            <Link
              href={card.linkUrl}
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium group"
            >
              <span>{card.linkText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CardsWithDescription;
