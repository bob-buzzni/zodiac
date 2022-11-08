/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    optimizeCss: true,
    
  },

  reactStrictMode: false,
  swcMinify: true,
  compiler: {},
  
};

module.exports = nextConfig;
