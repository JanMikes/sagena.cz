import React from 'react';
import Image from 'next/image';
import RichText from '@/components/typography/RichText';

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
    : `bg-white border border-gray-200 rounded-xl p-6 ${description ? 'pb-0' : ''}`;

  const titleClasses = isStyle2
    ? 'text-2xl font-bold text-white mb-6'
    : 'text-2xl font-bold text-gray-900 mb-6';

  const iconContainerClasses = 'flex items-center justify-center w-12 h-12 flex-shrink-0';

  const numberContainerClasses = isStyle2
    ? 'flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex-shrink-0'
    : 'flex items-center justify-center w-12 h-12 bg-[#a0bfdf] rounded-lg flex-shrink-0';

  const stepNumberClasses = isStyle2
    ? 'text-xl font-bold text-white'
    : 'text-xl font-bold text-white';

  const floorBadgeClasses = isStyle2
    ? 'inline-block text-xs font-semibold text-primary-800 bg-white/90 px-2 py-1 rounded mb-2'
    : 'inline-block text-xs font-semibold text-white bg-[#a0bfdf] px-2 py-1 rounded mb-2';

  const textClasses = isStyle2
    ? 'prose-invert [&_p]:text-white/90 [&_p]:mb-0 [&_a]:text-primary-200 [&_strong]:text-white'
    : '[&_p]:text-gray-700 [&_p]:mb-0 [&_a]:text-primary-600';

  const descriptionClasses = isStyle2
    ? 'prose-invert [&_p]:text-white/80 [&_a]:text-primary-200 [&_strong]:text-white mt-6 pt-6 border-t border-white/20'
    : '[&_p]:text-gray-600 [&_a]:text-primary-600 mt-6 border-t border-gray-200 bg-gradient-to-r from-[#d3e5f1] to-[#e0f0fa] -mx-6 px-6 py-6 rounded-b-xl';

  return (
    <div className={containerClasses}>
      {title && <h3 className={titleClasses}>{title}</h3>}
      <div className="space-y-4">
        {instructions.map((instruction, index) => (
          <div key={index} className="flex items-start space-x-4">
            {/* Icon or Step Number */}
            {instruction.icon ? (
              <div className={iconContainerClasses}>
                <Image
                  src={instruction.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
            ) : (
              <div className={numberContainerClasses}>
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
              <RichText content={instruction.text} size="sm" className={textClasses} />
            </div>
          </div>
        ))}
      </div>
      {description && (
        <RichText content={description} size="sm" className={descriptionClasses} />
      )}
    </div>
  );
};

export default Directions;
