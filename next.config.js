const fs = require('fs');

function getAppVersion() {
  // We store app version on disk (as part of the docker build phase) due to limitations on
  // setting env vars as part of the deploy phase (see dokku/github-action)
  const defaultVersion = new Date().getTime().toString();
  try {
    const version = fs.readFileSync('./VERSION', 'utf8').trim();
    if (!version) {
      throw new Error('No version specified in VERSION');
    }
    return version;
  } catch (e) {
    console.warn(
      `[warn] Using default version (${defaultVersion}), because:`,
      e.message
    );
    return defaultVersion;
  }
}

const { ASSET_PREFIX, PORT, NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';
const appVersion = getAppVersion();
const port = Number(PORT || '3000');

module.exports = {
  assetPrefix:
    ASSET_PREFIX || (isProd ? 'https://assets.richardwillis.info' : '/'),
  generateBuildId: () => appVersion,
  poweredByHeader: false,
  target: 'server',
  compression: true,
  publicRuntimeConfig: Object.assign(
    {
      appVersion,
      siteId: 'richardwillis',
      locale: 'en-GB',
      port,
      isProd,
    },
    isProd
      ? {
          staticManRepo: 'badsyntax/richardwillis.info',
          staticManGitProvider: 'github',
          staticManEndpoint: 'https://staticman.richardwillis.info',
        }
      : {
          staticManRepo: 'badsyntax/richardwillis.info',
          staticManGitProvider: 'github',
          staticManEndpoint: 'http://localhost:3002',
        }
  ),
  webpack(config) {
    if (!isProd) {
      return config;
    }

    const adjustCssModulesConfig = (use) => {
      if (use.loader.indexOf('css-loader') >= 0 && use.options.modules) {
        delete use.options.modules.getLocalIdent;
        use.options.modules.localIdentName = '[sha1:hash:hex:4]';
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
