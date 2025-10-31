import React from 'react';
import {
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  AlertTriangle,
  LucideIcon,
} from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: LucideIcon;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  icon: CustomIcon,
  title,
  children,
  className = '',
}) => {
  const variantConfig = {
    info: {
      containerClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-600',
      titleClass: 'text-blue-900',
      textClass: 'text-blue-800',
      Icon: Info,
    },
    success: {
      containerClass: 'bg-green-50 border-green-200',
      iconClass: 'text-green-600',
      titleClass: 'text-green-900',
      textClass: 'text-green-800',
      Icon: CheckCircle,
    },
    warning: {
      containerClass: 'bg-yellow-50 border-yellow-200',
      iconClass: 'text-yellow-600',
      titleClass: 'text-yellow-900',
      textClass: 'text-yellow-800',
      Icon: AlertTriangle,
    },
    error: {
      containerClass: 'bg-red-50 border-red-200',
      iconClass: 'text-red-600',
      titleClass: 'text-red-900',
      textClass: 'text-red-800',
      Icon: XCircle,
    },
  };

  const config = variantConfig[variant];
  const IconComponent = CustomIcon || config.Icon;

  return (
    <div
      className={`border rounded-lg p-4 ${config.containerClass} ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className={`w-5 h-5 ${config.iconClass}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleClass} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${config.textClass}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
