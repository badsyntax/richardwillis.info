const { ASSET_PREFIX, APP_VERSION, PORT, NODE_ENV } = process.env;

const isProd = NODE_ENV === 'production';

module.exports = {
  basePath: '',
  assetPrefix:
    ASSET_PREFIX || isProd ? 'https://assets.richardwillis.info' : '/',
  generateBuildId: () => APP_VERSION || 'unknown-version',
  poweredByHeader: false,
  target: 'server',
  compression: true,
  publicRuntimeConfig: Object.assign(
    {
      appVersion: APP_VERSION || 'unknown-version',
      siteId: 'richardwillis',
      locale: 'en-GB',
      port: Number(PORT || '3000'),
      isProd,
    },
    isProd
      ? {
          staticManRepo: 'badsyntax/richardwillis.info',
          staticManEndpoint: 'https://staticman.richardwillis.info',
        }
      : {
          staticManRepo: 'badsyntax/richardwillis.info',
          staticManEndpoint: 'http://localhost:3002',
        }
  ),
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
