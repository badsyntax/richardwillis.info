const { ASSET_PREFIX, NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';

module.exports = {
  poweredByHeader: false,
  assetPrefix:
    ASSET_PREFIX || (isProd ? 'https://assets.richardwillis.info' : '/'),
  publicRuntimeConfig: {
    locale: 'en-GB',
  },
};
