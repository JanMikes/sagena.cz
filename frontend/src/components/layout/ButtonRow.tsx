import React from 'react';
import Button from '@/components/ui/Button';

interface ButtonItem {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

interface ButtonRowProps {
  buttons: ButtonItem[];
  alignment?: 'left' | 'center' | 'right';
  spacing?: 'sm' | 'md' | 'lg';
}

const ButtonRow: React.FC<ButtonRowProps> = ({
  buttons,
  alignment = 'left',
  spacing = 'md',
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={`flex flex-wrap ${alignmentClasses[alignment]} ${spacingClasses[spacing]}`}
    >
      {buttons.map((button, index) => (
        <Button
          key={index}
          href={button.href}
          onClick={button.onClick}
          variant={button.variant || 'primary'}
          size={button.size || 'md'}
        >
          {button.text}
        </Button>
      ))}
    </div>
  );
};

export default ButtonRow;
