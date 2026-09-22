import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "91.239.235.97",
        port: "9000",
        pathname: "/vl-site/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
