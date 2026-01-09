/**
 * Czech typography utilities
 *
 * Handles Czech-specific typography rules like preventing
 * single-letter prepositions from appearing at line ends.
 */

/**
 * Prevents orphaned single-letter Czech prepositions/conjunctions
 * by replacing spaces after them with non-breaking spaces.
 *
 * Czech prepositions: a, i, k, o, s, u, v, z
 *
 * @example
 * preventOrphans("Jdu do práce a do školy")
 * // "Jdu do práce a\u00A0do školy"
 *
 * preventOrphans("Přijdu v pondělí")
 * // "Přijdu v\u00A0pondělí"
 */
export function preventOrphans(text: string): string {
  if (!text) return '';

  // Match single letters (a, i, k, o, s, u, v, z) followed by whitespace
  // Case-insensitive, word boundary aware
  return text.replace(/\b([aAiIkKoOsSuUvVzZ])\s+/g, '$1\u00A0');
}
