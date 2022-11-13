/** @type {import('next').NextConfig} */

// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  pageExtensions: ["page.tsx", "handler.ts"],
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
};
