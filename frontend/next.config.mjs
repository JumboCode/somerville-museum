/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
      MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC,
      MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE,
  },
  images: {
      remotePatterns: [
          {
              protocol: "https",
              hostname: "upload-r2-assets.somerville-museum1.workers.dev",
          },
      ],
  },
  eslint: {
      ignoreDuringBuilds: true, // Suppresses ESLint warnings
  },
  typescript: {
      ignoreBuildErrors: true, // Suppresses TypeScript warnings
  },
};

export default nextConfig;
