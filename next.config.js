const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? 'https://assets.richardwillis.info' : '',
  images: {
    domains: [
      'assets.richardwillis.info'
    ],
  },
};
