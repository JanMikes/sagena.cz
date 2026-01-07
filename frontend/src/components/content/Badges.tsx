import React from 'react';
import Badge from '@/components/ui/Badge';

interface BadgeItem {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

interface BadgesProps {
  badges: BadgeItem[];
  alignment?: 'left' | 'center' | 'right';
}

const Badges: React.FC<BadgesProps> = ({
  badges,
  alignment = 'left',
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${alignmentClasses[alignment]}`}>
      {badges.map((badge, index) => (
        <Badge
          key={index}
          variant={badge.variant || 'primary'}
          size={badge.size || 'md'}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  );
};

export default Badges;
