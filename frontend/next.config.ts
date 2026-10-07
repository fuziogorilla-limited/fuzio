import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fuzio-3y0x.onrender.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.fuziogorilla.co.ke",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;