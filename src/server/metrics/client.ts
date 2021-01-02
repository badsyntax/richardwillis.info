import client from 'prom-client';
import config from '../../config/config';

const { appVersion, siteId } = config;

export const registry = new client.Registry();

registry.setDefaultLabels({
  app: `${siteId}-nodejs-app`,
  version: appVersion,
});

client.collectDefaultMetrics({ register: registry });

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP request in microseconds',
  labelNames: ['method', 'path', 'status'],
});

registry.registerMetric(httpRequestDurationMicroseconds);

export const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Counter for total requests received',
  labelNames: ['path', 'method', 'status'],
});

registry.registerMetric(requestCounter);

export const ttfbHistogram = new client.Histogram({
  name: 'client_user_timing_ttfb',
  help: 'Time to first byte',
  labelNames: ['path'],
});

registry.registerMetric(ttfbHistogram);
