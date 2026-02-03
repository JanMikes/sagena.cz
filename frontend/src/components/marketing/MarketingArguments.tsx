import React from 'react';
import Image from 'next/image';

interface Argument {
  icon?: string | null;  // Icon image URL
  number?: string;
  title: string;
  description: string;
}

interface MarketingArgumentsProps {
  arguments: Argument[];
  columns?: 2 | 3 | 4;
  alignment?: 'left' | 'center';
}

const MarketingArguments: React.FC<MarketingArgumentsProps> = ({
  arguments: args,
  columns = 3,
  alignment = 'center',
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
      {args.map((arg, index) => {
        const isLeft = alignment === 'left';

        return (
          <div key={index} className={isLeft ? 'text-left' : 'text-center'}>
            {/* Icon or Number */}
            <div className={`flex items-center mb-4 ${isLeft ? 'justify-start' : 'justify-center'}`}>
              {arg.icon && (
                <div className="flex items-center justify-center w-16 h-16">
                  <Image
                    src={arg.icon}
                    alt=""
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                </div>
              )}
              {arg.number && !arg.icon && (
                <div className="text-5xl font-bold text-primary-600">
                  {arg.number}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-primary-600 mb-2">
              {arg.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{arg.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MarketingArguments;
