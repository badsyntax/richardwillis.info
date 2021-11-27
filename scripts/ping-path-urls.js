const path = require('node:path');
const https = require('node:https');
const glob = require('glob');

const rootDir = path.resolve(__dirname, '..', 'out');
const rootDomains = [
  'https://richardwillis.info',
  'https://assets.richardwillis.info',
];

glob(`${rootDir}/**/*.html`, {}, processFiles);

async function processFiles(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const urls = files
    .map((file) =>
      rootDomains.map(
        (domain) =>
          `${domain}${file
            .replace(rootDir, '')
            .replace('.html', '')
            .replace('/index', '')}`
      )
    )
    .flat();

  for (const url of urls) {
    await getRequest(url);
  }
}

function getRequest(url, tryTime = 1) {
  return new Promise((resolve) => {
    const { hostname, port, pathname } = new URL(url);
    https
      .request(
        {
          hostname,
          port,
          path: pathname,
          method: 'GET',
          headers: {
            accept: 'text/html,application/xhtml+xml,application/xml',
            'accept-encoding': 'gzip, deflate, br',
            'cache-control': 'no-cache',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
          },
        },
        (res) => {
          const xCache = res.headers['x-cache'];
          console.log(`${url} ${res.statusCode} ${xCache}`);
          if (xCache !== 'Hit from cloudfront') {
            if (tryTime === 5) {
              console.error('Tried 5 times, aborting...');
              resolve();
            } else {
              console.log(`Retrying ${tryTime + 1} of 5`);
              getRequest(url, tryTime + 1).then(resolve);
            }
          } else {
            resolve();
          }
        }
      )
      .end();
  });
}
