/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Project images are optional. If you reference remote images in
  // src/data/projects.ts, whitelist their host here so next/image can
  // optimize them. Local images placed in /public need no config.
  images: {
    remotePatterns: [
      // Example:
      // { protocol: "https", hostname: "images.example.com" },
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
