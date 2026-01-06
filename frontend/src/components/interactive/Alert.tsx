import React from 'react';
import {
  CheckCircle,
  Info,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import RichText from '@/components/typography/RichText';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  text?: string;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  text,
  className = '',
}) => {
  const variantConfig = {
    info: {
      containerClass: 'bg-primary-50 border-l-primary-600',
      iconClass: 'text-primary-600',
      titleClass: 'text-primary-900',
      textClass: 'text-primary-800',
      Icon: Info,
    },
    success: {
      containerClass: 'bg-green-50 border-l-green-600',
      iconClass: 'text-green-600',
      titleClass: 'text-green-900',
      textClass: 'text-green-800',
      Icon: CheckCircle,
    },
    warning: {
      containerClass: 'bg-yellow-50 border-l-yellow-600',
      iconClass: 'text-yellow-600',
      titleClass: 'text-yellow-900',
      textClass: 'text-yellow-800',
      Icon: AlertTriangle,
    },
    error: {
      containerClass: 'bg-red-50 border-l-red-600',
      iconClass: 'text-red-600',
      titleClass: 'text-red-900',
      textClass: 'text-red-800',
      Icon: XCircle,
    },
  };

  const config = variantConfig[type];
  const IconComponent = config.Icon;

  return (
    <div
      className={`border-l-4 rounded-r-lg p-4 ${config.containerClass} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <IconComponent className={`w-12 h-12 ${config.iconClass}`} />
        </div>
        <div className="flex-1 pt-1">
          <h3 className={`text-sm font-medium ${config.titleClass} mb-1`}>
            {title}
          </h3>
          {text && (
            <RichText content={text} size="sm" className={config.textClass} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
