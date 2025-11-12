/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR mode (default) - no output: 'export'
  images: {
    // Can enable optimization if needed, keeping unoptimized for now
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
