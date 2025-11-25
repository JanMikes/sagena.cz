import React from 'react';
import Image from 'next/image';
import { marked } from 'marked';

interface Instruction {
  icon?: string | null;  // Icon image URL
  floor?: string | null;
  text: string;  // Markdown content
}

interface DirectionsProps {
  title?: string;
  instructions: Instruction[];
  description?: string | null;  // Optional markdown description shown below steps
  style?: 'Style 1' | 'Style 2';
}

const Directions: React.FC<DirectionsProps> = ({
  title,
  instructions,
  description,
  style = 'Style 1',
}) => {
  const isStyle2 = style === 'Style 2';

  // Style 1: White background with border (current/default)
  // Style 2: Primary gradient background
  const containerClasses = isStyle2
    ? 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-xl p-6 shadow-lg'
    : 'bg-white border border-gray-200 rounded-xl p-6';

  const titleClasses = isStyle2
    ? 'text-2xl font-bold text-white mb-6'
    : 'text-2xl font-bold text-gray-900 mb-6';

  const iconContainerClasses = isStyle2
    ? 'flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex-shrink-0'
    : 'flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg flex-shrink-0';

  const stepNumberClasses = isStyle2
    ? 'text-xl font-bold text-white'
    : 'text-xl font-bold text-primary-600';

  const floorBadgeClasses = isStyle2
    ? 'inline-block text-xs font-semibold text-primary-800 bg-white/90 px-2 py-1 rounded mb-2'
    : 'inline-block text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded mb-2';

  const textClasses = isStyle2
    ? 'prose prose-sm max-w-none prose-invert [&_p]:text-white/90 [&_p]:mb-0 [&_a]:text-primary-200 [&_strong]:text-white'
    : 'prose prose-sm max-w-none [&_p]:text-gray-700 [&_p]:mb-0 [&_a]:text-primary-600';

  const descriptionClasses = isStyle2
    ? 'prose prose-sm max-w-none prose-invert [&_p]:text-white/80 [&_a]:text-primary-200 [&_strong]:text-white mt-6 pt-6 border-t border-white/20'
    : 'prose prose-sm max-w-none [&_p]:text-gray-600 [&_a]:text-primary-600 mt-6 pt-6 border-t border-gray-200';

  return (
    <div className={containerClasses}>
      {title && <h3 className={titleClasses}>{title}</h3>}
      <div className="space-y-4">
        {instructions.map((instruction, index) => {
          const textHtml = marked.parse(instruction.text, { async: false }) as string;
          return (
            <div key={index} className="flex items-start space-x-4">
              {/* Icon or Step Number */}
              {instruction.icon ? (
                <div className={iconContainerClasses}>
                  <Image
                    src={instruction.icon}
                    alt=""
                    width={24}
                    height={24}
                    className={isStyle2 ? 'w-6 h-6 object-contain brightness-0 invert' : 'w-6 h-6 object-contain'}
                  />
                </div>
              ) : (
                <div className={iconContainerClasses}>
                  <span className={stepNumberClasses}>
                    {index + 1}
                  </span>
                </div>
              )}
              <div className="flex-1 pt-2">
                {instruction.floor && (
                  <span className={floorBadgeClasses}>
                    {instruction.floor}
                  </span>
                )}
                <div
                  className={textClasses}
                  dangerouslySetInnerHTML={{ __html: textHtml }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {description && (
        <div
          className={descriptionClasses}
          dangerouslySetInnerHTML={{ __html: marked.parse(description, { async: false }) as string }}
        />
      )}
    </div>
  );
};

export default Directions;
