const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  serverExternalPackages: ['ioredis'],
}

module.exports = withSentryConfig(nextConfig, {
  silent: !process.env.CI,
});
