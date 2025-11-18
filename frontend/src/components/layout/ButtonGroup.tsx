import React from 'react';
import Button from '@/components/ui/Button';

/**
 * Button item - supports both hardcoded and Strapi data
 */
interface ButtonItem {
  text: string;
  href?: string;
  url?: string;  // Strapi uses 'url' instead of 'href'
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  external?: boolean;
}

interface ButtonGroupProps {
  buttons: ButtonItem[];
  alignment?: 'left' | 'center' | 'right';
  spacing?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';  // Support both formats
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttons,
  alignment = 'left',
  spacing = 'md',
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  // Normalize spacing value (support both 'md' and 'Medium spacing' from Strapi)
  const normalizeSpacing = (value: string): 'sm' | 'md' | 'lg' => {
    const spacingMap: Record<string, 'sm' | 'md' | 'lg'> = {
      'small': 'sm',
      'Small spacing': 'sm',
      'sm': 'sm',
      'medium': 'md',
      'Medium spacing': 'md',
      'md': 'md',
      'large': 'lg',
      'Large spacing': 'lg',
      'lg': 'lg',
    };
    return spacingMap[value] || 'md';
  };

  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const normalizedSpacing = normalizeSpacing(spacing);

  return (
    <div
      className={`flex flex-wrap ${alignmentClasses[alignment]} ${spacingClasses[normalizedSpacing]}`}
    >
      {buttons.map((button, index) => {
        // Support both 'href' and 'url' properties
        const buttonUrl = button.url || button.href;

        return (
          <Button
            key={index}
            href={button.disabled ? undefined : buttonUrl}
            onClick={button.onClick}
            variant={button.variant || 'primary'}
            size={button.size || 'md'}
            disabled={button.disabled}
          >
            {button.text}
          </Button>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
