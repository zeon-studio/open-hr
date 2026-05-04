/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "t4.ftcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "t1.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    // Tree-shake heavy icon / utility libs imported across the app so each
    // file pulls only the symbols it uses. lucide-react alone is imported
    // from 73 source files; without this Turbopack rebuilds large icon
    // chunks on every dev edit.
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
};

module.exports = nextConfig;
