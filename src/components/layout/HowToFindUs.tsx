import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Instruction {
  icon: LucideIcon;
  floor?: string;
  text: string;
}

interface HowToFindUsProps {
  title?: string;
  instructions: Instruction[];
}

const HowToFindUs: React.FC<HowToFindUsProps> = ({
  title = 'Jak nás najít',
  instructions,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {instructions.map((instruction, index) => {
          const IconComponent = instruction.icon;
          return (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg flex-shrink-0">
                <IconComponent className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 pt-2">
                {instruction.floor && (
                  <span className="inline-block text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded mb-2">
                    {instruction.floor}
                  </span>
                )}
                <p className="text-gray-700 leading-relaxed">
                  {instruction.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowToFindUs;
