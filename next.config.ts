import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable config img url
  images: {
    domains: [
      'geraldkrug.mypressonline.com',
      'cdn.learniverse.com',
      'source.unsplash.com',
      'i.pravatar.cc',
      'images.unsplash.com',
    ],
  },
};

export default nextConfig;
