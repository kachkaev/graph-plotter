module.exports = require("next-compose-plugins")(
  [
    require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
    }),
  ],
  {
    experimental: {
      modern: true,
      productionBrowserSourceMaps: true,
      redirects: () => [
        {
          source: "/",
          destination: "/vk",
          permanent: false,
        },
      ],
    },
    reactStrictMode: true,
    typescript: {
      ignoreDevErrors: true,
      ignoreBuildErrors: true,
    },
  },
);
