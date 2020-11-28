module.exports = require("next-compose-plugins")(
  [
    require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
    }),
  ],
  {
    experimental: {
      productionBrowserSourceMaps: true,
    },
    reactStrictMode: true,
  },
);
