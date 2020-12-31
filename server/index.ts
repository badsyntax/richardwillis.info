import next from 'next';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { PORT } from '../config/config';
import { vitalsHandler } from './vitals';
import { httpRequestDurationMicroseconds, registry } from './metrics/client';

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
server.use(bodyParser.json());

const handleWithTiming = async (req: IncomingMessage, res: ServerResponse) => {
  const path = url.parse(req.url).pathname;
  const end = httpRequestDurationMicroseconds.startTimer();
  await handle(req, res);
  end({ path, code: res.statusCode, method: req.method });
};

app.prepare().then(() => {
  server.get('/metrics', async (_: Request, res: Response) => {
    res.type(registry.contentType);
    return res.send(await registry.metrics());
  });

  server.post('/vitals', vitalsHandler);

  server.all('*', async (req: Request, res: Response) => {
    const route = url.parse(req.url).pathname;
    const isStaticRoute =
      route.startsWith('/_next/static') || route.startsWith('/favicon.ico');
    const handler = isStaticRoute ? handle : handleWithTiming;
    handler(req, res);
  });

  server.listen(PORT, () => {
    console.log(`🚀 http application ready on http://localhost:${PORT}`);
  });
});
