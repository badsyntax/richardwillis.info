module.exports = {
  images: {
    domains: [
      'images.richardwillis.info',
      'images.richardwillis.info.s3.eu-west-2.amazonaws.com',
      'd1kawhui9ewore.cloudfront.net'
    ],
  },
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
