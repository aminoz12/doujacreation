/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Netlify's legacy v4 runtime has a broken image optimizer (it redirects
    // /_next/image to a malformed /_ipx URL that 500s). Serving images
    // unoptimized bypasses it entirely so images actually load. Product images
    // are already compressed to WebP <=1600px at upload time, so the impact is
    // minimal. To RE-ENABLE optimization: upgrade the site to the Next.js
    // Runtime v5 in the Netlify UI, then remove this line.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'bqrwcvbiyyblwadztvyt.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  // NOTE: trailingSlash must stay false. With `true`, next/image URLs become
  // `/_next/image/?url=...` which breaks image optimization on Netlify
  // (redirects to a malformed _ipx path that 500s). Keep it off.
}

module.exports = nextConfig
