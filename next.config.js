module.exports = require("next-compose-plugins")(
  [
    require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
    }),
    require("@zeit/next-source-maps")(),
  ],
  {
    experimental: {
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
