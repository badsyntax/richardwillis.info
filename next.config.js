const { ASSET_PREFIX, NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';
const assetPrefix = ASSET_PREFIX || (isProd ? '/' : '/');

module.exports = {
  poweredByHeader: false,
  assetPrefix,
  trailingSlash: false,
  publicRuntimeConfig: {
    locale: 'en-GB',
    assetPrefix,
  },
};
