import { IncomingMessage, ServerResponse } from 'http';
import { Request, Response } from 'express';
import { parse, UrlWithParsedQuery } from 'url';
import { httpRequestDurationMicroseconds } from './client';

const denyMetricsRoutes = [
  '/favicon.ico',
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
      const end = httpRequestDurationMicroseconds.startTimer();
      res.on('finish', () => {
        if (res.statusCode === 200) {
          end({
            path: pathname || undefined,
            code: res.statusCode,
            method: req.method,
          });
        }
      });
    }
    handler(req, res, parsedUrl);
  };
}
