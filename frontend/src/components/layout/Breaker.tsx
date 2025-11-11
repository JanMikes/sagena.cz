import React from 'react';

interface BreakerProps {
  spacing?: 'sm' | 'md' | 'lg';
  style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'gradient';
  color?: 'gray' | 'primary';
}

const Breaker: React.FC<BreakerProps> = ({
  spacing = 'md',
  style = 'solid',
  color = 'gray',
}) => {
  const spacingClasses = {
    sm: 'my-4',
    md: 'my-8',
    lg: 'my-12',
  };

  const colorClasses = {
    gray: 'border-gray-200',
    primary: 'border-primary-200',
  };

  if (style === 'gradient') {
    return (
      <div className={spacingClasses[spacing]}>
        <div className="h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
      </div>
    );
  }

  const styleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    double: 'border-double border-t-4',
  };

  return (
    <hr
      className={`border-t ${styleClasses[style]} ${colorClasses[color]} ${spacingClasses[spacing]}`}
    />
  );
};

export default Breaker;
