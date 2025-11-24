/**
 * i18n Configuration
 *
 * Central configuration for supported locales and locale-related constants.
 */

export const locales = ['cs', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'cs';

/**
 * Static pages that always show Czech content regardless of locale.
 * These are demonstration pages for the component system.
 */
export const staticCzechPages = [
  'komponenty',
  'ordinace',
  'rehabilitace',
  's-panelem',
  'intranet',
];

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get the alternate locale (for language switcher)
 */
export function getAlternateLocale(current: Locale): Locale {
  return current === 'cs' ? 'en' : 'cs';
}

/**
 * Check if a page slug is a static Czech-only page
 */
export function isStaticCzechPage(slug: string): boolean {
  const firstSegment = slug.split('/')[0];
  return staticCzechPages.includes(firstSegment);
}
