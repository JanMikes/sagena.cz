/**
 * Search utilities for diacritics-insensitive search
 *
 * Supports Czech language by normalizing diacritics:
 * - "č" becomes "c"
 * - "ř" becomes "r"
 * - "ž" becomes "z"
 * etc.
 */

/**
 * Normalize text for searching by removing diacritics
 *
 * Uses NFD (Canonical Decomposition) to split characters like "č" into
 * base character "c" + combining caron, then removes the combining marks.
 *
 * @example
 * normalizeForSearch("Kardiologie") // "kardiologie"
 * normalizeForSearch("Lékaři") // "lekari"
 * normalizeForSearch("Pediatrická ambulance") // "pediatricka ambulance"
 */
export function normalizeForSearch(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .normalize('NFD') // Decompose: "č" -> "c" + combining caron
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .trim();
}

/**
 * Check if normalized query matches normalized text
 *
 * Supports multi-word queries where all words must match.
 *
 * @example
 * matchesSearch("kardiologie oddeleni", "kardio") // true
 * matchesSearch("pediatricka ambulance", "ped amb") // true
 * matchesSearch("neurologie", "kardio") // false
 */
export function matchesSearch(
  normalizedText: string,
  normalizedQuery: string
): boolean {
  if (!normalizedQuery) return true;
  if (!normalizedText) return false;

  // Split query into words and check if all words are found in text
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  return queryWords.every((word) => normalizedText.includes(word));
}

/**
 * Build normalized searchable text from multiple fields
 *
 * @example
 * buildSearchableText("Kardiologie", "Oddělení pro léčbu srdce", ["srdce", "EKG"])
 * // "kardiologie oddeleni pro lecbu srdce srdce ekg"
 */
export function buildSearchableText(...fields: (string | undefined | null)[]): string {
  return normalizeForSearch(
    fields
      .filter((f): f is string => typeof f === 'string' && f.length > 0)
      .join(' ')
  );
}
