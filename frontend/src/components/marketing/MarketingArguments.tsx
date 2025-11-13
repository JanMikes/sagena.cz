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
}

const MarketingArguments: React.FC<MarketingArgumentsProps> = ({
  arguments: args,
  columns = 3,
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
      {args.map((arg, index) => {
        return (
          <div key={index} className="text-center">
            {/* Icon or Number */}
            <div className="flex items-center justify-center mb-4">
              {arg.icon && (
                <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl">
                  <Image
                    src={arg.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain brightness-0 invert"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">
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
