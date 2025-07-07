import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
        pathname: '/**',
      },
      {
        hostname: 'localhost',
        protocol: 'http',
        pathname: '/**',
      },
      {
        hostname: 'localhost',
        protocol: 'https',
        pathname: '/**',
      },
      {
        hostname: 'host.docker.internal',
        protocol: 'http',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  experimental: {
    nodeMiddleware: true,
    serverActions: {
      bodySizeLimit: '10000mb',
    },
  },
};

export default nextConfig;
