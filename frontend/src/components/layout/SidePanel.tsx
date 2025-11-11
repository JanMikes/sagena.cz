import React from 'react';

interface SidePanelProps {
  children: React.ReactNode;
  position?: 'left' | 'right';
  sticky?: boolean;
  className?: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
  children,
  position = 'right',
  sticky = true,
  className = '',
}) => {
  const positionClass = position === 'left' ? 'order-first' : 'order-last';
  const stickyClass = sticky ? 'lg:sticky lg:top-24 lg:self-start' : '';

  return (
    <aside
      className={`${positionClass} ${stickyClass} ${className}`}
    >
      <div className="space-y-6">{children}</div>
    </aside>
  );
};

export default SidePanel;
