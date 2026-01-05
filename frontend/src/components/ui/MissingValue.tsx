/**
 * MissingValue Component
 *
 * Displays a visual indicator when a required value is missing from Strapi CMS.
 * This helps content editors identify incomplete content that needs attention.
 *
 * Usage:
 * - Inline: <MissingValue field="title" />
 * - Block: <MissingValue field="description" block />
 * - Conditional: {title || <MissingValue field="title" />}
 */

import React from 'react';

interface MissingValueProps {
  /** The field name that is missing (for context in the message) */
  field?: string;
  /** Custom message to display instead of the default */
  message?: string;
  /** Display as block element instead of inline */
  block?: boolean;
  /** Locale for the message - 'cs' for Czech, 'en' for English */
  locale?: 'cs' | 'en';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get the missing value message based on locale
 */
function getMissingMessage(locale: 'cs' | 'en', field?: string): string {
  const baseMessage = locale === 'cs' ? 'Chybějící' : 'Missing';
  if (field) {
    return `[${baseMessage}: ${field}]`;
  }
  return `[${baseMessage}]`;
}

/**
 * MissingValue component for displaying missing field indicators
 */
export const MissingValue: React.FC<MissingValueProps> = ({
  field,
  message,
  block = false,
  locale = 'cs',
  className = '',
}) => {
  const displayMessage = message || getMissingMessage(locale, field);

  const baseClasses = 'bg-warning-100 text-warning-700 border border-warning-300 rounded px-2 py-0.5 text-sm font-medium';
  const layoutClasses = block ? 'block w-full text-center py-2' : 'inline';

  return (
    <span className={`${baseClasses} ${layoutClasses} ${className}`} title={displayMessage}>
      {displayMessage}
    </span>
  );
};

/**
 * Helper function to render a value or a MissingValue placeholder
 * @param value - The value to display
 * @param field - The field name for the missing indicator
 * @param locale - Locale for the message
 * @returns The value if present, or a MissingValue component
 */
export function valueOrMissing(
  value: string | null | undefined,
  field: string,
  locale: 'cs' | 'en' = 'cs'
): React.ReactNode {
  if (value && value.trim()) {
    return value;
  }
  return <MissingValue field={field} locale={locale} />;
}

export default MissingValue;
