const {
  assetPrefix,
  isProd,
  appVersion,
} = require('./build/config/config').default;

module.exports = {
  assetPrefix: assetPrefix,
  generateBuildId: () => appVersion,
  webpack(config) {
    const adjustCssModulesConfig = (use) => {
      if (use.loader.indexOf('css-loader') >= 0 && use.options.modules) {
        delete use.options.modules.getLocalIdent;
        use.options.modules.localIdentName = isProd
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
