export const isProd = process.env.NODE_ENV === 'production';

export interface DefaultConfig {
  appVersion: string;
  siteId: string;
  locale: string;
  port: number;
  assetPrefix: string;
  isProd: boolean;
}

export interface EnvConfig {
  staticManEndpoint: string;
  staticManRepo: string;
  assetPrefix: string;
}

export type Config = DefaultConfig & EnvConfig;

function getEnvConfig(): EnvConfig {
  return isProd
    ? require('../../config.production.json')
    : require('../../config.development.json');
}

const envConfig = getEnvConfig();

const defaultConfig: DefaultConfig = {
  appVersion: process.env.APP_VERSION || 'unknown-version',
  siteId: 'richardwillis',
  locale: 'en-GB',
  port: Number(process.env.PORT || '3000'),
  assetPrefix: process.env.ASSET_PREFIX || envConfig.assetPrefix,
  isProd,
};

const config: Config = {
  ...getEnvConfig(),
  ...defaultConfig,
};

export default config;
