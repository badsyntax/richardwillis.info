---
title: 'Monitoring a Next.js app with Prometheus and the User Timing API'
excerpt: 'How to use the picture HTML element to provide responsive images.'
date: '2020-12-28T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: false
---

## Front-end Metrics

A standard Next.js app uses the `User Timing` API to mark various performance metrics of your app. You can see the marks by running `performance.getEntries()` in the Browser console. These performance marks can be read by analysis tools such as lighthouse, to monitor the performance of your application.

Next.js offers a way to record performance marks (using whatever tool you want) by sending the metrics to an HTTP endpoint:

```js
export function reportWebVitals(metric) {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
}
```

We can use this technique to publish the peroormance metrics to Prometheus.

## Back-end Metrics

It's important to gather back-end metrics to monitor app health and optimise the runtime environment.

### Goals

- The server should provide an endpoint (`/metrics`) that provides metrics of the running Node.js app
- Metrics should include useful Node.js metrics like event loop lag, memory usage etc
- Metrics should include server request timings

We can use the popular `prom-client` library to generate default Node.js metrics as well as our own custom performance metrics.

Integrating `prom-client` into Next.js was a bit of pain. The webpack server `Hot Module Replacing` interferes with the initialisation of `prom-client`, and there's no way to configure this behaviour in Next.js (at time of writing). So you need to use a custom server and build your metrics endpoint outside of `pages/api`.

Here's an example custom `server.ts` using ExpressJS:

```ts
import next from 'next';
import express, { Request, Response } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { httpRequestDurationMicroseconds, registry } from './prometheus/client';

const PORT = 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

const handleWithTiming = async (req: IncomingMessage, res: ServerResponse) => {
  const route = url.parse(req.url).pathname;
  const end = httpRequestDurationMicroseconds.startTimer();
  await handle(req, res);
  end({ route, code: res.statusCode, method: req.method });
};

app.prepare().then(() => {
  server.get('/metrics', async (_: Request, res: Response) => {
    res.type(registry.contentType);
    return res.send(await registry.metrics());
  });

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
```

And here's the Prometheus client:

```ts
import client from 'prom-client';

export const registry = new client.Registry();

registry.setDefaultLabels({
  app: 'example-nodejs-app',
});

client.collectDefaultMetrics({ register: registry });

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP request in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

registry.registerMetric(httpRequestDurationMicroseconds);
```

Create a custom `tsconfig` for the server:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "isolatedModules": false,
    "noEmit": false
  },
  "include": ["./server.ts"]
}
```

Adjust your `npm` run scripts in `package.json`:

```json
{
 "scripts": {
    "dev": "npm run build:server && npm start",
    "build:server": "tsc --project tsconfig.server.json",
    "build": "npm run build:server && next build",
    "start": "node server"
  }
}
```

After running `npm run dev` you should see metrics available at [http://localhost:3000/metrics](http://localhost:3000/metrics).
