/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.dicebear.com', 'lh3.googleusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/_health',
        destination: '/api/health',
      },
    ];
  },
};

module.exports = nextConfig;
