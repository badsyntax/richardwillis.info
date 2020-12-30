---
title: 'Monitor a dokku Next.js app with Prometheus and the User Timing API'
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

Next.js offers a way to record performance marks (using whatever tool you want) by sending the metrics to an HTTP endpoint. We can use this technique to publish the peroormance metrics to Prometheus:

```js
export function reportWebVitals(metric) {
  const body = JSON.stringify(metric);
  const endpointUrl = '/vitals';

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(endpointUrl, blob);
  } else {
    fetch(endpointUrl, {
      body,
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      keepalive: true,
    });
  }
}
```

## Back-end Metrics

It's important to gather back-end metrics to monitor app health and optimise the runtime environment.

### Goals

- The server should provide a prometheus compatible endpoint (`/metrics`) that provides metrics of the running Node.js app
- Metrics should include useful Node.js metrics like event loop lag, memory usage etc
- Metrics should include server request timings

We can use the popular `prom-client` library to generate default Node.js metrics as well as our own custom performance metrics.

Integrating `prom-client` into Next.js was a bit of pain. The webpack server `Hot Module Replacing` interferes with the initialisation of `prom-client`, and there's no way to configure this behaviour in Next.js (at time of writing). This means you need to use a custom server and build your metrics endpoint outside of `pages/api`, which is rather inconvenient.

Here's an example custom `server.ts` using `express`:

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

## Setting up dokku

We'll be running 3 different dokku apps:

- Application container exposing metrics at `next-app:3000/metrics`
- Prometheus container that can read `next-app:3000/metrics`
- Grafana container that can read prometheus at `prometheus:9090`

We want to prevent public access of the app metrics endpoints, prometheus & grafana so we'll be using private local hostnames for inter-container communication.

I attempted to do this with [dokku networking](http://dokku.viewdocs.io/dokku/networking/network/) but discovered this is not really helpful when you want a container to connect to multiple networks. So I decided to use the legacy docker `--link` feature as it's a whole lot more convenient. Perhaps someday I'll better understand how to do docker networking properly.

The following assumes you're already created and deployed your Next app.

## Setting up Prometheus with dokku

Create the prometheus dokku app and set the ports:

```shell-session
dokku apps:create prometheus
dokku proxy:ports-add prometheus http:80:9090
dokku proxy:ports-remove prometheus http:9090:9090
```

Set the volume mounts for persistent storage:

```shell-session
mkdir -p /var/lib/dokku/data/storage/prometheus
chown nobody /var/lib/dokku/data/storage/prometheus
dokku storage:mount prometheus "/var/lib/dokku/data/storage/prometheus:/prometheus"
dokku storage:mount prometheus "/home/dokku/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml"
```

Set the docker command to set tsdb config (to prevent a lockfile being saved):

```shell-session
dokku config:set prometheus DOKKU_DOCKERFILE_START_CMD="--config.file=/etc/prometheus/prometheus.yml
  --storage.tsdb.path=/prometheus
  --web.console.libraries=/usr/share/prometheus/console_libraries
  --web.console.templates=/usr/share/prometheus/consoles
  --storage.tsdb.no-lockfile"
```

Link prometheus to your app instance/s:

```shell-session
dokku docker-options:add prometheus build,deploy,run "--link next-app.web.1:next-app"
```

Create the prometheus configuration file at location `/home/dokku/prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'next-app-nodejs'
    scrape_interval: 30s
    metrics_path: '/metrics'
    static_configs:
      - targets: ['next-app:3000']
```

Deploy the prometheus app:

```shell-session
docker pull prom/prometheus:latest
docker tag prom/prometheus:latest dokku/prometheus:latest
dokku tags:deploy prometheus latest
```

Once the prometheus app is deployed visit [http://prometheus.dokku.me/targets](http://prometheus.dokku.me/targets) to confirm prometheus can connect to your Next app.

## Setting up Grafana

Create the dokku app and set the ports:

```shell-session
dokku apps:create grafana
dokku proxy:ports-add grafana http:80:3000
dokku proxy:ports-remove grafana http:3000:3000
```

Set the volume mounts for persistent storage:

```shell-session
mkdir -p /var/lib/dokku/data/storage/grafana
chown 472:472 /var/lib/dokku/data/storage/grafana
dokku storage:mount grafana "/var/lib/dokku/data/storage/grafana:/var/lib/grafana"
```

Link Grafana to Prometheus:

```shell-session
dokku docker-options:add grafana build,deploy,run "--link prometheus.web.1:prometheus"
```

Deploy Grafana:

```shell-session
docker pull grafana/grafana:latest
docker tag grafana/grafana:latest dokku/grafana:latest
dokku tags:deploy grafana latest
```

### Adding the Prometheus data source

Grafana should be be able to access `http://prometheus:9090`.
