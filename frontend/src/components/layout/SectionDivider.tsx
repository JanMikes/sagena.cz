import React from 'react';

type SpacingType = 'Small spacing' | 'Medium spacing' | 'Large spacing';
type StyleType = 'Solid line' | 'Dashed line' | 'Dotted line' | 'Double line' | 'Gradient line';
type ColorType = 'Gray' | 'Primary blue';

interface SectionDividerProps {
  spacing?: SpacingType;
  style?: StyleType;
  color?: ColorType;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  spacing = 'Medium spacing',
  style = 'Solid line',
  color = 'Gray',
}) => {
  const spacingClasses: Record<SpacingType, string> = {
    'Small spacing': 'my-4',
    'Medium spacing': 'my-8',
    'Large spacing': 'my-12',
  };

  const colorClasses: Record<ColorType, string> = {
    Gray: 'border-gray-300',
    'Primary blue': 'border-primary-500',
  };

  if (style === 'Gradient line') {
    const gradientColorClasses: Record<ColorType, string> = {
      Gray: 'via-gray-400',
      'Primary blue': 'via-primary-400',
    };

    return (
      <div className={spacingClasses[spacing]}>
        <div
          className={`h-px bg-gradient-to-r from-transparent ${gradientColorClasses[color]} to-transparent`}
        />
      </div>
    );
  }

  const styleClasses: Record<StyleType, string> = {
    'Solid line': 'border-solid',
    'Dashed line': 'border-dashed',
    'Dotted line': 'border-dotted',
    'Double line': 'border-double border-t-4',
    'Gradient line': '', // Handled separately above
  };

  return (
    <hr
      className={`border-t ${styleClasses[style]} ${colorClasses[color]} ${spacingClasses[spacing]}`}
    />
  );
};

export default SectionDivider;
