/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://20.235.173.36:3001/api/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://20.235.173.36:3001/api/:path*',
      },
    ]
  },
  // Optional: Add CORS headers
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ]
  },
  // Disable React Strict Mode if needed (can help with double rendering in development)
  reactStrictMode: true,
}

module.exports = nextConfig
