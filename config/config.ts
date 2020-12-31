export const IS_PROD = process.env.NODE_ENV === 'production';
export const APP_VERSION = process.env.APP_VERSION || 'unknown-version';
export const SITE_ID = 'richardwillis';
export const LOCALE = 'en-GB';
export const PORT = Number(process.env.PORT || '3000');
export const ASSET_PREFIX = IS_PROD
  ? process.env.ASSET_PREFIX || 'https://assets.richardwillis.info'
  : '';
