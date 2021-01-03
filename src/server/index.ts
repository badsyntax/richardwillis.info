import next from 'next';
import express from 'express';
import bodyParser from 'body-parser';
import getConfig, { setConfig } from 'next/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { publicRuntimeConfig } from '../../next.config.js';
setConfig({ publicRuntimeConfig });

import { metricsHandler } from './routes/metrics';
import { vitalsHandler } from './routes/vitals';
import { withRouteMetrics } from './metrics/metricsMiddleware';

const { port, isProd } = getConfig().publicRuntimeConfig;

const app = next({ dev: !isProd });
const nextRequestHandler = app.getRequestHandler();

const server = express();
server.disable('x-powered-by');
server.use(bodyParser.json());

app.prepare().then(() => {
  server.get('/metrics', metricsHandler);
  server.post('/vitals', vitalsHandler);
  server.use(withRouteMetrics(nextRequestHandler));
  server.listen(port, () => {
    console.log(`🚀 http application ready on http://localhost:${port}`);
  });
});
