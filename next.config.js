/* eslint-disable import/no-anonymous-default-export */

/** @type {import('next').NextConfig} */
export default {
  compiler: {
    styledComponents: true,
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  pageExtensions: ["page.tsx", "handler.ts"],
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
};
