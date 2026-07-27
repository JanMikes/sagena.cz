interface ComponentErrorProps {
  componentType?: string;
  showDetails?: boolean;
  locale?: string;
}

const translations = {
  cs: { unavailable: 'Obsah není k dispozici' },
  en: { unavailable: 'Content is not available' },
} as const;

export function ComponentError({ componentType, showDetails, locale = 'cs' }: ComponentErrorProps) {
  const t = translations[locale as keyof typeof translations] || translations.cs;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
      <p>{t.unavailable}</p>
      {showDetails && componentType && (
        <p className="text-sm mt-2 text-gray-400">Component: {componentType}</p>
      )}
    </div>
  );
}
