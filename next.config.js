const { ASSET_PREFIX, NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';
const assetPrefix = ASSET_PREFIX || (isProd ? '/' : '/');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  assetPrefix,
  trailingSlash: false,
  publicRuntimeConfig: {
    locale: 'en-GB',
    assetPrefix,
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      });
    }
    return config;
  },
});
