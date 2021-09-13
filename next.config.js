const { ASSET_PREFIX, NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';
const assetPrefix =
  ASSET_PREFIX || (isProd ? 'https://assets.richardwillis.info/' : '/');

module.exports = {
  poweredByHeader: false,
  assetPrefix,
  publicRuntimeConfig: {
    locale: 'en-GB',
    assetPrefix,
  },
  experimental: { optimizeCss: true },
};
