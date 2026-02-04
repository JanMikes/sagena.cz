import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

interface TarifItem {
  text: string;
}

interface Tarif {
  title?: string | null;
  subtitle?: string | null;
  label?: string | null;
  items?: TarifItem[];
  link?: {
    text: string;
    url: string;
  } | null;
  style?: 'Style 1' | 'Style 2';
}

interface TarifyProps {
  tarify: Tarif[];
}

const TarifCard: React.FC<{ tarif: Tarif }> = ({ tarif }) => {
  const isStyle2 = tarif.style === 'Style 2';

  const cardClasses = isStyle2
    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
    : 'bg-white text-primary-600';

  const titleClasses = isStyle2
    ? 'text-white'
    : 'text-primary-700';

  const subtitleClasses = isStyle2
    ? 'text-primary-100'
    : 'text-primary-500';

  const itemClasses = isStyle2
    ? 'text-primary-50'
    : 'text-primary-500';

  const checkClasses = isStyle2
    ? 'text-primary-200'
    : 'text-primary-400';

  const dividerClasses = isStyle2
    ? 'border-white/20'
    : 'border-primary-100';

  const buttonClasses = isStyle2
    ? 'bg-white text-primary-700 hover:bg-primary-50'
    : 'bg-primary-600 text-white hover:bg-primary-700';

  return (
    <div
      className={`
        flex flex-col rounded-2xl p-6 h-full
        shadow-[0_0_25px_rgba(204,229,243,0.8)]
        hover:shadow-[0_0_35px_rgba(153,203,231,0.9)]
        hover:-translate-y-1
        transition-[box-shadow,transform] duration-300
        ${cardClasses}
      `}
    >
        {/* Header */}
      <div className={`text-center pb-4 ${tarif.items && tarif.items.length > 0 ? `border-b ${dividerClasses}` : ''}`}>
        {tarif.title && (
          <h3 className={`text-2xl font-bold mb-1 ${titleClasses}`}>
            {tarif.title}
          </h3>
        )}
        {tarif.subtitle && (
          <p className={`text-lg font-bold ${subtitleClasses}`}>
            {tarif.subtitle}
          </p>
        )}
      </div>

      {/* Items list */}
      {tarif.items && tarif.items.length > 0 && (
        <ul className="flex-grow py-4 space-y-3">
          {tarif.items.map((item, idx) => (
            <li key={idx} className={`flex items-start gap-3 ${itemClasses}`}>
              <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${checkClasses}`} />
              <span className="text-sm leading-relaxed">{item.text}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Link */}
      {tarif.link && (
        <div className={`pt-4 mt-auto ${tarif.items && tarif.items.length > 0 ? `border-t ${dividerClasses}` : ''}`}>
          <Link
            href={tarif.link.url}
            className={`
              w-full inline-flex items-center justify-center gap-2
              px-6 py-3 rounded-xl font-medium text-sm
              transition-colors duration-200 group
              ${buttonClasses}
            `}
          >
            {tarif.link.text}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
};

const Tarify: React.FC<TarifyProps> = ({ tarify }) => {
  // Calculate responsive grid columns based on number of cards
  // Max 6 cards per row on desktop
  const count = tarify.length;

  // Grid column classes based on count
  const getGridCols = () => {
    if (count === 1) return 'grid-cols-1 max-w-sm';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    if (count === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    if (count === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
    // 6 or more
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
  };

  return (
    <div className={`grid ${getGridCols()} gap-6 justify-start`}>
      {tarify.map((tarif, index) => {
        return (
          <div key={index} className="relative">
            {/* Label badge - positioned at top of card */}
            {tarif.label && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <span className="inline-block px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap shadow-sm bg-[#679641] text-white">
                  {tarif.label}
                </span>
              </div>
            )}
            <TarifCard tarif={tarif} />
          </div>
        );
      })}
    </div>
  );
};

export default Tarify;
