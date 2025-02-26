import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingIncludes: {
    '/**/*': [
      './node_modules/@splinetool/react-spline/**/*',
      './node_modules/@splinetool/runtime/**/*'
    ]
  },
  serverComponentsExternalPackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  transpilePackages: [
    '@splinetool/react-spline',
    '@splinetool/runtime',
    'framer-motion',
    '@privy-io/react-auth'
  ],
  webpack: (config) => {
    // Configure node polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      zlib: require.resolve('browserify-zlib'),
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer/'),
    };
    
    return config;
  },
};

export default nextConfig;
