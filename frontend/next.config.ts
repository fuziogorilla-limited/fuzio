import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fuzio-3y0x.onrender.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;