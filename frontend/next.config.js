const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR mode (default) - no output: 'export'
  images: {
    // Can enable optimization if needed, keeping unoptimized for now
    unoptimized: true,
  },
  trailingSlash: true,
  // Server-only packages should not be bundled for client
  serverExternalPackages: ['ioredis'],
}

module.exports = withSentryConfig(nextConfig, {
  silent: !process.env.CI,
});
