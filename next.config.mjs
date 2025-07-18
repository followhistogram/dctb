/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Povolení ESLint kontrol
  },
  typescript: {
    ignoreBuildErrors: false, // Povolení TypeScript kontrol
  },
  images: {
    unoptimized: false, // Povolení optimalizace obrázků
    domains: ['supabase.co', 'your-domain.com'], // Povolené domény pro obrázky
    formats: ['image/webp', 'image/avif'], // Moderní formáty obrázků
  },
  // Bezpečnostní hlavičky
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://supabase.co https://*.supabase.co",
          },
        ],
      },
    ]
  },
  // Přesměrování pro starší URLs
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'sb-access-token',
            value: '(?<token>.*)',
          },
        ],
      },
    ]
  },
  // Webpack optimalizace
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  // Experimentální funkce pro lepší výkon
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
