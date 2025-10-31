import React from 'react';
import { MapPin, Briefcase, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

interface WorkOpportunityProps {
  title: string;
  description: string;
  department: string;
  type: string;
  location: string;
  ctaText?: string;
  ctaUrl: string;
}

const WorkOpportunity: React.FC<WorkOpportunityProps> = ({
  title,
  description,
  department,
  type,
  location,
  ctaText = 'Zobrazit pozici',
  ctaUrl,
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-primary-50/30 border border-gray-200 rounded-xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-primary-600" />
              <span>{department}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-primary-600" />
              <span>{type}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span>{location}</span>
            </div>
          </div>
        </div>
        <div className="lg:flex-shrink-0">
          <Button href={ctaUrl} size="lg">
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkOpportunity;
