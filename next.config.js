const { ASSET_PREFIX, IS_PROD, APP_VERSION } = require('./config/config');

module.exports = {
  assetPrefix: ASSET_PREFIX,
  generateBuildId: () => APP_VERSION,
  webpack(config, options) {
    const adjustCssModulesConfig = (use) => {
      if (use.loader.indexOf('css-loader') >= 0 && use.options.modules) {
        delete use.options.modules.getLocalIdent;
        use.options.modules.localIdentName = IS_PROD
          ? '[sha1:hash:hex:4]'
          : '[name]__[local]--[sha1:hash:hex:4]';
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
