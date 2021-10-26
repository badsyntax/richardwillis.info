// const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
// const withVanillaExtract = createVanillaExtractPlugin();

const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
const CleanCss = require('clean-css');
const { ASSET_PREFIX, NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';
const assetPrefix =
  ASSET_PREFIX || (isProd ? 'https://assets.richardwillis.info/' : '/');

module.exports = withVanillaExtract({
  poweredByHeader: false,
  assetPrefix,
  publicRuntimeConfig: {
    locale: 'en-GB',
    assetPrefix,
  },
  webpack(config) {
    config.plugins.push(
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: CleanCss,
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      })
    );
    return config;
  },
});
