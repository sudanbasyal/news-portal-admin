const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "news-portal-backend-0i3s.onrender.com",
        port: "",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;
