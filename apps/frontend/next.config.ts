import type { NextConfig } from 'next'

// Bundle analyzer for production optimization
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // Configure for static export (SPA mode)
  output: 'export',

  // Disable server-side features for static export
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // Image optimization for static export
  images: {
    unoptimized: true, // Required for static export
  },

  // Base path for deployment (can be configured for S3/CloudFront)
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Asset prefix for CDN deployment
  // assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',

  // Disable server-side features
  experimental: {
    // Enable static exports
    esmExternals: true,
  },

  // Configure webpack for better optimization
  webpack: (config, { isServer }) => {
    // Exclude Storybook files from build
    config.module.rules.push({
      test: /\.stories\.(js|jsx|ts|tsx|mdx)$/,
      use: 'ignore-loader',
    })

    if (!isServer) {
      // Client-side optimizations
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Bundle vendor libraries separately
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Bundle common code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      }
    }
    return config
  },
}

export default withBundleAnalyzer(nextConfig)
