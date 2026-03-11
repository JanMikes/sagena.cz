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

  // Match single letters (a, i, k, o, s, u, v, z) followed by a space (not newlines)
  // Case-insensitive, word boundary aware
  // Using [ ] instead of \s to preserve newlines (important for markdown parsing)
  return text.replace(/\b([aAiIkKoOsSuUvVzZ]) +/g, '$1\u00A0');
}

/**
 * Converts phone numbers in HTML to clickable tel: links.
 * Skips numbers already inside <a> tags.
 * Matches Czech phone format: +420 553 030 830 or 553 030 830
 */
const phoneRegex = /(?<!\d)(\+?\d{3})[\s\u00a0]?(\d{3})[\s\u00a0]?(\d{3})[\s\u00a0]?(\d{3})(?!\d)/g;

export function linkifyPhones(html: string): string {
  if (!html) return '';
  // Split by <a ...>...</a> to avoid double-linking existing anchors
  const parts = html.split(/(<a\s[^>]*>.*?<\/a>)/gi);
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      parts[i] = parts[i].replace(phoneRegex, (match, p1, p2, p3, p4) => {
        const digits = `${p1}${p2}${p3}${p4}`;
        return `<a href="tel:${digits}">${match}</a>`;
      });
    }
  }
  return parts.join('');
}
