import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface CardItem {
  icon: LucideIcon;
  title: string;
  description: string;
  url: string;
}

interface FullWidthCardsProps {
  cards: CardItem[];
}

const FullWidthCards: React.FC<FullWidthCardsProps> = ({ cards }) => {
  return (
    <div className="space-y-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Link
            key={index}
            href={card.url}
            className="flex items-center space-x-4 p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md hover:bg-primary-50/30 transition-all duration-300 group w-full"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg flex-shrink-0 group-hover:bg-primary-600 transition-colors">
              <IconComponent className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{card.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default FullWidthCards;
