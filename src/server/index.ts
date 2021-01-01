import next from 'next';
import express from 'express';
import bodyParser from 'body-parser';

import { PORT } from '../config/config';
import { metricsHandler } from './routes/metrics';
import { vitalsHandler } from './routes/vitals';
import { withRouteMetrics } from './metrics/metricsMiddleware';

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const nextRequestHandler = app.getRequestHandler();

const server = express();
server.use(bodyParser.json());

app.prepare().then(() => {
  server.get('/metrics', metricsHandler);
  server.post('/vitals', vitalsHandler);
  server.use(withRouteMetrics(nextRequestHandler));
  server.listen(PORT, () => {
    console.log(`🚀 http application ready on http://localhost:${PORT}`);
  });
});
