/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  // Ensure the base path is correct
  basePath: '',
  trailingSlash: false,
  // Add distDir for Vercel to locate build output
  distDir: '.next',
  // Add output option
  output: 'standalone',
  // Properly handle static assets
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
