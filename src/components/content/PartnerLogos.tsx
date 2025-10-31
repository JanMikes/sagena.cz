import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
  alt?: string;
}

interface PartnerLogosProps {
  partners: Partner[];
  className?: string;
  grayscale?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
}

const PartnerLogos: React.FC<PartnerLogosProps> = ({
  partners,
  className = '',
  grayscale = false,
  columns = 6,
  gap = 'md',
}) => {
  const gridColumns = {
    2: 'grid-cols-2 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
  };

  const gapStyles = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={`${className}`}>
      <div className={`grid ${gridColumns[columns]} ${gapStyles[gap]} items-center justify-items-center`}>
        {partners.map((partner) => (
          <Link
            key={partner.id}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full h-full p-4 transition-all duration-300 hover:scale-105"
          >
            <img
              src={partner.logo}
              alt={partner.alt || partner.name}
              className={`max-w-full h-auto object-contain ${
                grayscale ? 'grayscale hover:grayscale-0 transition-all duration-300' : ''
              }`}
              style={{ maxHeight: '60px' }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PartnerLogos;
