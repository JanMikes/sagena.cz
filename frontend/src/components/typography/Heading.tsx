import React from 'react';

interface HeadingProps {
  level: 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string; // For anchor links
}

const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className = '',
  id,
}) => {
  const baseClasses = 'font-bold text-primary-600';

  const levelClasses = {
    2: 'text-2xl md:text-3xl',
    3: 'text-xl md:text-2xl',
    4: 'text-lg md:text-xl',
    5: 'text-base md:text-lg',
    6: 'text-sm md:text-base',
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      id={id}
      className={`${baseClasses} ${levelClasses[level]} ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Heading;
