import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3.fal.media',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ui.shadcn.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
