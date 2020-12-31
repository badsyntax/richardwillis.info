---
title: 'Monitor a dokku Next.js app with Prometheus & Grafana'
excerpt: 'How to use the picture HTML element to provide responsive images.'
date: '2020-12-28T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

Monitoring service health is important for ensuring uptime and discovering bugs early. There are various tools to help achieve this, but at a high level you want to:

- Store metrics in a time series database
- Visualise those metrics
- Alert on those metrics

Prometheus is a monitoring and alerting toolkit and provides time series database and features to scrape (pull) metrics from applications.

Grafana is a useful tool for visualising and alerting on metrics.

We'll use these 2 tools to create a monitoring platform on a dokku server, and start to monitor our Next application metrics.

## Setting up dokku

We'll be running 3 different dokku apps:

- Application container exposing metrics at `next-app:3000/metrics`
- Prometheus container that can read `next-app:3000/metrics`
- Grafana container that can read prometheus at `prometheus:9090`

We'll be using a private docker network for cross-container communication.

<details><summary>Here's how you can achieve the above with `docker-compose`.</summary>

```yaml
version: '3'
services:
  nextapp:
    container_name: 'next-app.web'
    build: ./
    ports:
      - 3000:3000
  prometheus:
    container_name: 'prometheus.web'
    image: prom/prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - 9090:9090
  grafana:
    container_name: 'grafana.web'
    image: grafana/grafana:latest
    ports:
      - 3001:3000
```

</details>

### Setting up Prometheus with dokku

Create the prometheus dokku app and set the ports:

```bash
dokku apps:create prometheus
dokku proxy:ports-add prometheus http:80:9090
dokku proxy:ports-remove prometheus http:9090:9090
```

Set the volume mounts for persistent storage:

```bash
mkdir -p /var/lib/dokku/data/storage/prometheus
chown nobody /var/lib/dokku/data/storage/prometheus
dokku storage:mount prometheus "/var/lib/dokku/data/storage/prometheus:/prometheus"
dokku storage:mount prometheus "/home/dokku/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml"
```

Set the docker command to set tsdb config (to prevent a lockfile being saved to allow us to re-deploy without errors):

```bash
dokku config:set prometheus DOKKU_DOCKERFILE_START_CMD="--config.file=/etc/prometheus/prometheus.yml
  --storage.tsdb.path=/prometheus
  --web.console.libraries=/usr/share/prometheus/console_libraries
  --web.console.templates=/usr/share/prometheus/consoles
  --storage.tsdb.no-lockfile"
```

We want to link prometheus to specific apps to allow it to scape app metrics. By default dokku apps can't communicate with each other but we can achieve this using docker networking. You can create a new bridge network and attach containers to that network.

So we'll create a new network called `prometheus-bridge` and attach our apps to that network. This results in all containers in this network being able to communicate with each other, which is not what we want, but I don't yet know how to link containers correctly without using (`--link`). (*I will update this blog post when I figure this out, as it seems the service plugins (eg `dokku-postgres`) achieve this without using docker networking.*)

Create the bridge network and attach the prometheus app to it:

```bash
dokku network:create prometheus-bridge
dokku network:set prometheus attach-post-deploy prometheus-bridge
```

Create the prometheus configuration file at location `/home/dokku/prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'next-app-nodejs'
    scrape_interval: 30s
    metrics_path: '/metrics'
    static_configs:
      - targets: ['next-app.web:3000']
```

Deploy the prometheus app and secure it with `http-auth`:

```shell-session
docker pull prom/prometheus:latest
docker tag prom/prometheus:latest dokku/prometheus:latest
dokku tags:deploy prometheus latest

dokku letsencrypt prometheus
dokku plugin:install https://github.com/dokku/dokku-http-auth.git
dokku http-auth:on prometheus USER PASSWORD
```

Once the prometheus app is deployed visit [https://prometheus.dokku.me/targets](https://prometheus.dokku.me/targets) to confirm prometheus can connect to your Next app.

### Setting up Grafana

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

Add Grafana to the `prometheus-bridge` network:

```bash
dokku network:set grafana attach-post-deploy prometheus-bridge
```

Deploy Grafana:

```shell-session
docker pull grafana/grafana:latest
docker tag grafana/grafana:latest dokku/grafana:latest
dokku tags:deploy grafana latest
dokku letsencrypt grafana
```

TODO: grafana config eg smtp

https://medium.com/better-programming/node-js-application-monitoring-with-prometheus-and-grafana-b08deaf0efe3

#### Adding the Prometheus data source

Head on over to `http://grafana.dokku.me` and add the prometheus data source (`http://prometheus.web:9090`).

#### Import Dashboards

Import the following dashboards:

- [Prometheus internal metrics](https://grafana.com/grafana/dashboards/3662)

## Recording App Metrics

We'll be recording both back-end and front-end metrics.

Before continuing, ensure you've deployed your app, then add it to the `prometheus-bridge` network:

```bash
dokku network:set next-app attach-post-deploy prometheus-bridge
```

### Back-end Metrics

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
import { APP_VERSION } from '../../config/config';

export const registry = new client.Registry();

registry.setDefaultLabels({
  app: 'example-nodejs-app',
  version: APP_VERSION,
});

client.collectDefaultMetrics({ register: registry });

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP request in microseconds',
  labelNames: ['method', 'route', 'code'],
});

registry.registerMetric(httpRequestDurationMicroseconds);
```

The server is written in TypeScript and is not part of the Next.js build, so we need a new `tsconfig` for compiling the server. I save this file as `tsconfig.server.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "isolatedModules": false,
    "noEmit": false
  },
  "include": ["./server/**/*.ts"]
}
```

Adjust your `npm` run scripts in `package.json` to compile the server and adjust the start script:

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

## Front-end Metrics

[Real User Monitoring](https://en.wikipedia.org/wiki/Real_user_monitoring) (RUM) data captures the performance experienced by a site's actual users.

A standard Next.js app uses the `User Timing API` to mark various performance metrics of your app. These performance marks are known as [web vitals](https://web.dev/vitals/).

You can see the marks by running `performance.getEntries()` in the Browser console. These marks can be read by analysis tools such as lighthouse and others to monitor the performance of your application.

Next.js offers a way to record performance marks (using whatever tool you want) by sending the metrics to an HTTP endpoint:

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

We'll use this technique to publish performance metrics to Prometheus.

First we'll need to create an endpoint (`/vitals`) to process metrics sent from the client.

### Create the vitals endpoint

First register a new metrics provider with your prometheus client:

```ts
export const ttfbHistogram = new client.Histogram({
  name: 'client_user_timing_ttfb',
  help: 'Time to first byte',
  labelNames: ['path'],
});

registry.registerMetric(ttfbHistogram);
```

Now create the `/vitals` endpoint to record the metric:

```ts
import { Request, Response } from 'express';
import { Vital } from '../types/types';
import { ttfbHistogram } from './metrics/client';

export const vitalsHandler = (
  req: Request,
  res: Response
): Response<string> => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(415).send('Invalid content-type');
  }
  const vital = req.body as Vital;
  switch (vital.metric.name) {
    case 'TTFB': {
      ttfbHistogram.observe(
        {
          path: vital.path,
        },
        vital.metric.value
      );
      break;
    }
    default:
      break;
  }
  return res.status(200).send('ok');
};
```

## Adding Deploy Annotations to Grafana

We can use dokku [deployment tasks](http://dokku.viewdocs.io/dokku~v0.22.4/advanced-usage/deployment-tasks/) to record a deployment with Grafana each time the app is deployed, and display that deployment as an annotation on your Grafana graphs. This is useful to understand if metrics changes as a result of a new deployment.

If using a Dockerfile for deployment, we'll need to place an `app.json` within the docker `WORKDIR` (typically the root of your application):

```json
{
  "scripts": {
    "dokku": {
      "postdeploy": "echo 'hello from post deploy'"
    }
  }
}
```

(Also don't forget to add this file to your docker image with `COPY` or `ADD`!)

https://frederic-hemberger.de/notes/grafana/annotate-dashboards-with-deployments/
