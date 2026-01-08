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
  const iconSize = compact ? 'w-10 h-10' : 'w-12 h-12';
  const linePosition = compact ? 'left-5' : 'left-6';
  const numberSize = compact ? 'text-lg' : 'text-xl';
  const gapSize = compact ? 'gap-3' : 'gap-4 md:gap-5';

  return (
    <div className="relative">
      <div className="space-y-4">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className={`relative flex ${gapSize}`}>
              {/* Vertical connecting line to next item */}
              {!isLast && (
                <div
                  className={`absolute ${linePosition} w-0.5 bg-primary-200 hidden md:block`}
                  style={{
                    top: compact ? '20px' : '24px',
                    bottom: compact ? '-36px' : '-40px'
                  }}
                />
              )}

              {/* Icon or Number */}
              <div className="relative flex-shrink-0">
                {item.icon && (
                  <div className={`flex items-center justify-center ${iconSize} z-10 relative`}>
                    <Image
                      src={item.icon}
                      alt=""
                      width={compact ? 40 : 48}
                      height={compact ? 40 : 48}
                      className={`${iconSize} object-contain`}
                    />
                  </div>
                )}
                {item.number && !item.icon && (
                  <div className={`flex items-center justify-center ${iconSize} bg-[#a0bfdf] rounded-full z-10 relative border-2 border-white shadow-md`}>
                    <span className={`${numberSize} font-bold text-white`}>
                      {item.number}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pt-3 ${!isLast ? 'pb-4' : ''}`}>
                <h3 className="text-base font-bold text-primary-600 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
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
