import React from 'react';
import Image from 'next/image';

interface TimelineItem {
  icon?: string | null;  // Icon image URL from Strapi
  number?: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
  compact?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ items, compact = false }) => {
  // Compact mode uses smaller sizes for sidebar display
  const iconSize = compact ? 'w-12 h-12' : 'w-16 h-16';
  const linePosition = compact ? 'left-6' : 'left-8';
  const imageSize = compact ? 'w-5 h-5' : 'w-7 h-7';
  const numberSize = compact ? 'text-xl' : 'text-2xl';
  const gapSize = compact ? 'gap-4' : 'gap-6 md:gap-8';

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className={`absolute ${linePosition} top-0 bottom-0 w-0.5 bg-primary-200 hidden md:block`} />

      <div className="space-y-8">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className={`relative flex ${gapSize}`}>
              {/* Icon or Number */}
              <div className="relative flex-shrink-0">
                {item.icon && (
                  <div className={`flex items-center justify-center ${iconSize} bg-primary-600 rounded-full z-10 relative border-4 border-white shadow-md`}>
                    <Image
                      src={item.icon}
                      alt=""
                      width={compact ? 20 : 28}
                      height={compact ? 20 : 28}
                      className={`${imageSize} object-contain brightness-0 invert`}
                    />
                  </div>
                )}
                {item.number && !item.icon && (
                  <div className={`flex items-center justify-center ${iconSize} bg-primary-600 rounded-full z-10 relative border-4 border-white shadow-md`}>
                    <span className={`${numberSize} font-bold text-white`}>
                      {item.number}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${!isLast ? 'pb-8' : ''}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
