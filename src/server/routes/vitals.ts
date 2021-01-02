import client from 'prom-client';
import { Request, Response } from 'express';
import { VitalsMetric } from '../../types/types';
import { registry } from '../metrics/client';

export const ttfbHistogram = new client.Histogram({
  name: 'client_user_timing_ttfb',
  help: 'Time to first byte',
  labelNames: ['path'],
});

registry.registerMetric(ttfbHistogram);

export const fcpHistogram = new client.Histogram({
  name: 'client_user_timing_fcp',
  help: 'First Contentful Paint',
  labelNames: ['path'],
});

registry.registerMetric(fcpHistogram);

export const lcpHistogram = new client.Histogram({
  name: 'client_user_timing_lcp',
  help: 'Largest Contentful Paint',
  labelNames: ['path'],
});

registry.registerMetric(lcpHistogram);

export const clsHistogram = new client.Histogram({
  name: 'client_user_timing_cls',
  help: 'Cumulative Layout Shift',
  labelNames: ['path'],
});

registry.registerMetric(clsHistogram);

export const fidHistogram = new client.Histogram({
  name: 'client_user_timing_fid',
  help: 'First Input Delay ',
  labelNames: ['path'],
});

registry.registerMetric(fidHistogram);

export const nextHydrationHistogram = new client.Histogram({
  name: 'client_user_timing_nextjs_hydration',
  help:
    'Length of time it takes for the page to start and finish hydrating (in ms)',
  labelNames: ['path'],
});

registry.registerMetric(nextHydrationHistogram);

export const nextRenderHistogram = new client.Histogram({
  name: 'client_user_timing_nextjs_render',
  help:
    'Length of time it takes for a page to finish render after a route change (in ms)',
  labelNames: ['path'],
});

registry.registerMetric(nextRenderHistogram);

export const nextRouteChangeRenderHistogram = new client.Histogram({
  name: 'client_user_timing_nextjs_route_render',
  help:
    'Length of time it takes for a page to start rendering after a route change (in ms)',
  labelNames: ['path'],
});

registry.registerMetric(nextRouteChangeRenderHistogram);

function getHistogram(metricName: string): client.Histogram<any> | null {
  switch (metricName) {
    case 'TTFB':
      return ttfbHistogram;
    case 'FCP':
      return fcpHistogram;
    case 'LCP':
      return lcpHistogram;
    case 'CLS':
      return clsHistogram;
    case 'FID':
      return fidHistogram;
    case 'Next.js-hydration':
      return nextHydrationHistogram;
    case 'Next.js-route-change-to-render':
      return nextRouteChangeRenderHistogram;
    case 'Next.js-render':
      return nextRenderHistogram;
    default:
      return null;
  }
}

export const vitalsHandler = (
  req: Request,
  res: Response
): Response<string> => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(415).send('Invalid content-type');
  }

  const vital = req.body as VitalsMetric;
  const histoGram = getHistogram(vital.metric.name);

  if (!histoGram) {
    return res.status(200).send('unsupported metric name');
  }

  histoGram.observe(
    {
      path: vital.path,
    },
    vital.metric.value
  );

  return res.status(200).send('ok');
};
