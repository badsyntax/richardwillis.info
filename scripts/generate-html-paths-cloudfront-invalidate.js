const path = require('node:path');
const glob = require('glob');

const rootDir = path.resolve(__dirname, '..', 'out');

glob(`${rootDir}/**/*.html`, {}, processFiles);

function processFiles(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const filePaths = files.map((file) =>
    file.replace(rootDir, '').replace('.html', '').replace('/index', '/')
  );
  const invalidationBatch = {
    Paths: {
      Quantity: filePaths.length,
      Items: filePaths,
    },
    CallerReference: `invalidate-paths-${Date.now()}`,
  };
  console.log(JSON.stringify(invalidationBatch, null, 2));
}
