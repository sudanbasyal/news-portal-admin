/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ["api.ujyalobulletin.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.ujyalobulletin.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.ujyalobulletin.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
