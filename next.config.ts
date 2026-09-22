import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // За замовчуванням 1MB — замало навіть для одного фото з телефону.
      // 25MB із запасом покриває головне фото + кілька фото галереї за раз.
      bodySizeLimit: "25mb",
    },
  },
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
