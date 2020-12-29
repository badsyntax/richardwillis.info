import client from 'prom-client';
import { APP_VERSION, SITE_ID } from '../../config/config';

export const registry = new client.Registry();

registry.setDefaultLabels({
  app: `${SITE_ID}-nodejs-app`,
  version: APP_VERSION,
});

client.collectDefaultMetrics({ register: registry });

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP request in microseconds',
  labelNames: ['method', 'path', 'code'],
});

registry.registerMetric(httpRequestDurationMicroseconds);

export const ttfbHistogram = new client.Histogram({
  name: 'client_user_timing_ttfb',
  help: 'Time to first byte',
  labelNames: ['method', 'path'],
});

registry.registerMetric(ttfbHistogram);
