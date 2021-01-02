import { IncomingMessage, ServerResponse } from 'http';
import { Request, Response } from 'express';
import { parse, UrlWithParsedQuery } from 'url';
import { httpRequestDurationMicroseconds, requestCounter } from './client';

const denyMetricsRoutes = [
  '/favicon.ico',
  '/robots.txt',
  '/_next/static',
  '/_next/webpack-hmr',
];

export function withRouteMetrics(
  handler: (
    req: IncomingMessage,
    res: ServerResponse,
    parsedUrl?: UrlWithParsedQuery
  ) => Promise<void>
) {
  return (req: Request, res: Response): void => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    const shouldRecordMetrics = !denyMetricsRoutes.some((denyRoute) =>
      pathname?.startsWith(denyRoute)
    );
    if (shouldRecordMetrics) {
      requestCounter.inc({
        path: pathname || undefined,
        method: req.method,
        status: res.statusCode,
      });
      const end = httpRequestDurationMicroseconds.startTimer();
      res.on('finish', () => {
        if (res.statusCode === 200) {
          end({
            path: pathname || undefined,
            status: res.statusCode,
            method: req.method,
          });
        }
      });
    }
    handler(req, res, parsedUrl);
  };
}
