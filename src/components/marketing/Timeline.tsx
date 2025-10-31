import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TimelineItem {
  icon?: LucideIcon;
  number?: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200 hidden md:block" />

      <div className="space-y-8">
        {items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="relative flex gap-6 md:gap-8">
              {/* Icon or Number */}
              <div className="relative flex-shrink-0">
                {IconComponent && (
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full z-10 relative">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                )}
                {item.number && !IconComponent && (
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full z-10 relative">
                    <span className="text-2xl font-bold text-white">
                      {item.number}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
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
