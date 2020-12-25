const {
  CLIENT_STATIC_FILES_RUNTIME_MAIN,
  CLIENT_STATIC_FILES_RUNTIME_WEBPACK,
} = require('next/constants');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  assetPrefix: isProd ? 'https://assets.richardwillis.info' : '',
  images: {
    domains: ['assets.richardwillis.info'],
  },
  // crossOrigin: 'anonymous',
  generateBuildId: async () => {
    return process.env.APP_VERSION || 'unknown-version';
  },
  webpack(config, options) {
    // config.output.filename = ({ chunk }) => {
    //   // Use `[name]-[id].js` in production
    //   if (
    //     !options.dev &&
    //     (chunk.name === CLIENT_STATIC_FILES_RUNTIME_MAIN ||
    //       chunk.name === CLIENT_STATIC_FILES_RUNTIME_WEBPACK)
    //   ) {
    //     return chunk.name.replace(/\.js$/, '-[id].js');
    //   }
    //   return '[name]';
    // };
    // config.output.chunkFilename = options.isServer
    //   ? `${options.dev ? '[name]' : '[name].[id]'}.js`
    //   : `static/chunks/${options.dev ? '[name]' : '[name].[id]'}.js`;
    return config;
  },
};
