//@ts-check
const {
  CLIENT_STATIC_FILES_RUNTIME_MAIN,
  CLIENT_STATIC_FILES_RUNTIME_WEBPACK,
} = require('next/constants');

const isProd = process.env.NODE_ENV === 'production';

/**@type {import('next/dist/next-server/server/config').NextConfig}*/
module.exports = {
  assetPrefix: isProd ? 'https://assets.richardwillis.info' : '',
  images: {
    domains: ['assets.richardwillis.info'],
  },
  generateBuildId: async () => {
    return process.env.APP_VERSION || 'unknown-app-version';
  },
  webpack(config, options) {
    const adjustCssModulesConfig = (use) => {
      if (use.loader.indexOf('css-loader') >= 0 && use.options.modules) {
        delete use.options.modules.getLocalIdent;
        use.options.modules.localIdentName = isProd
          ? '[sha1:hash:hex:4]'
          : '[local]--[sha1:hash:hex:4]';
      }
    };

    const oneOfRule = config.module.rules.find(
      (rule) => typeof rule.oneOf === 'object'
    );

    if (oneOfRule) {
      oneOfRule.oneOf.forEach((rule) => {
        if (Array.isArray(rule.use)) {
          rule.use.map(adjustCssModulesConfig);
        } else if (rule.use && rule.use.loader) {
          adjustCssModulesConfig(rule.use);
        }
      });
    }
    return config;
  },
};
