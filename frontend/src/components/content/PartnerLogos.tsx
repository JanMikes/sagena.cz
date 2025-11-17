import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Partner logo item from Strapi (for CMS-driven pages)
 */
interface PartnerLogoItem {
  name: string;
  logo: string;
  url: string;
}

interface PartnerLogosProps {
  partners: PartnerLogoItem[];
  grayscale?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'small' | 'medium' | 'large';
}

const PartnerLogos: React.FC<PartnerLogosProps> = ({
  partners,
  grayscale = false,
  columns = 6,
  gap = 'medium',
}) => {
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

  return (
    <div
      className={`grid ${gridColumns[columns]} ${gapStyles[gap]} items-center justify-items-center`}
    >
      {partners.map((partner, index) => (
        <Link
          key={index}
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-full p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-300"
          aria-label={partner.name}
        >
          <Image
            src={partner.logo}
            alt={partner.name}
            width={120}
            height={60}
            className={`w-full h-auto max-h-16 object-contain ${
              grayscale
                ? 'grayscale hover:grayscale-0 transition-all duration-300'
                : ''
            }`}
          />
        </Link>
      ))}
    </div>
  );
};

export default PartnerLogos;
