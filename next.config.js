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
  images: {
    domains: ['assets.richardwillis.info'],
    deviceSizes: [420, 640, 768, 1024, 1280],
    imageSizes: [],
    loader: 'custom',
  },
};
