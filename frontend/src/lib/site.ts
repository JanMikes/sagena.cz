/**
 * Canonical public site URL.
 *
 * Used for absolute URLs in metadata (canonical/hreflang), robots.txt and the
 * sitemap. Read server-side only, so a plain (non-`NEXT_PUBLIC_`) env var is
 * enough and avoids build-time inlining. Falls back to the production domain so
 * generated URLs are correct even if the env var is not set in deployment.
 */
export const SITE_URL = (process.env.SITE_URL || 'https://sagena.cz').replace(/\/+$/, '');
