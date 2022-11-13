/** @type {import('next').NextConfig} */
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  productionBrowserSourceMaps: true,
  reactStrictMode: true,
};
