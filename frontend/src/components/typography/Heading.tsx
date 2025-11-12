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
  const baseClasses = 'font-bold text-gray-900';

  const levelClasses = {
    2: 'text-3xl md:text-4xl lg:text-5xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg',
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
