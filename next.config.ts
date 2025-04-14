import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['v3.fal.media'], // Allow images from Fal.ai media domain
  },
};

export default nextConfig;
