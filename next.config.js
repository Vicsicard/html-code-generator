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
};

module.exports = nextConfig;
