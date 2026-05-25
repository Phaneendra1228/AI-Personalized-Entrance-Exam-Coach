/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  devIndicators: false,
  async rewrites() {
    return [
      {
        // Proxy everything under /api/ to the backend EXCEPT /api/auth/
        source: '/api/:path((?!auth).*)',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
};

export default nextConfig;


