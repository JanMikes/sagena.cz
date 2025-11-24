import { locales } from '@/i18n/config';
import IntranetContent from './Content';

/**
 * Generate static params for all supported locales
 * This page always shows Czech content regardless of locale
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function IntranetPage() {
  return <IntranetContent />;
}
