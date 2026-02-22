/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    instrumentationHook: true,
  },
};

try {
  const { withSentryConfig } = require("@sentry/nextjs");
  module.exports = withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG ?? "",
    project: process.env.SENTRY_PROJECT ?? "",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: true,
  });
} catch (_) {
  module.exports = nextConfig;
}
