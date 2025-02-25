import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
      './node_modules/@splinetool/runtime/**/*',
      './node_modules/framer-motion/**/*'
    ]
  },
  serverComponentsExternalPackages: [
    '@splinetool/react-spline',
    '@splinetool/runtime',
    'framer-motion'
  ],
  experimental: {
    // outputFileTracingIncludes: {
    //   '/**/*': [
    //     './node_modules/@splinetool/react-spline/**/*',
    //     './node_modules/@splinetool/runtime/**/*'
    //   ]
    // }
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      extensionAlias: {
        '.js': ['.js', '.ts', '.tsx']
      },
      mainFields: ['module', 'main', 'browser'],
      conditionNames: ['import', 'require', 'node', 'default'],
      fallback: {
        ...config.resolve.fallback,
        module: false,
      }
    };
    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...config.module.rules,
        {
          test: /@splinetool\/react-spline|framer-motion/,
          resolve: {
            fullySpecified: false
          }
        }
      ]
    };
    return config;
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development'
  }
};

export default nextConfig;
