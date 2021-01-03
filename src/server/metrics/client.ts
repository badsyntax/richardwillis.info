import client from 'prom-client';
import getConfig from 'next/config';

const { appVersion, siteId } = getConfig().publicRuntimeConfig;

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
