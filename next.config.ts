import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },

  experimental: {
    useTypeScriptCli: false,
  },

  pageExtensions: ["page.tsx", "handler.ts"],
  productionBrowserSourceMaps: true,

  reactCompiler: true,
  reactStrictMode: true,

  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
