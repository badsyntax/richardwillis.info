import next from 'next';
import express from 'express';
import bodyParser from 'body-parser';

import config from '../config/config';
import { metricsHandler } from './routes/metrics';
import { vitalsHandler } from './routes/vitals';
import { withRouteMetrics } from './metrics/metricsMiddleware';

const { port, isProd } = config;

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
