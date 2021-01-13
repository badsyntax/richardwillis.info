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

Monitoring service health is important for ensuring uptime and discovering issues early. At a high level you want to:

- Store metrics in a time series database
- Visualise those metrics
- Alert on those metrics

There are various tools to help achieve this but Prometheus, Loki & Grafana are a good fit and a popular choice.

- Prometheus is a monitoring and alerting toolkit and provides time series database and features to scrape (pull) metrics from applications.
- Loki is a set of components that can be composed into a fully featured logging stack.
- Grafana is a useful tool for visualising and alerting on metrics.

We'll use these 3 tools (and others) to create a monitoring & alerting platform on a single `dokku` server, then setup our Next.js application to provide both runtime Node.js and Browser metrics. These metrics will ultimately allow us to identify performance issues & fine-tune our Next.js app so it runs well.

Adding a full monitoring solution to your dokku server increases the required resources but once the tools are setup you'll have metrics to identify whether you need additional resources. I settled on 4vCPU's and 8GB RAM hosted with Hetzner for my single dokku server.

## Set up dokku

We'll be running 7 different dokku apps:

- Next.js application container (`next-app`) - provides application metrics
- Node-exporter container (`node-advisor`) - provides metrics about the host machine
- cAdvisor container (`cadvisor`) - provides metrics about running containers
- Prometheus container (`prometheus`) - read & index metrics from `next-app`, `node-advisor` & `cadvisor`
- Loki container (`loki`) - index application logs
- Promtail container (`loki`) - ships the contents of local logs to loki
- Grafana container (`grafana`) - read & graph time series data from `prometheus` & `loki`

Make sure you've already [setup and deployed your Next.js app](/blog/deploy-nextjs-dokku-s3-cloudfront) to your dokku server.

Public endpoints are secured with `http-auth` and `tls` so you'll need to make sure you have the relevant plugins installed:

```bash
dokku plugin:install https://github.com/dokku/dokku-http-auth.git
dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
```

See: https://www.milanvit.net/post/getting-started-with-server-monitoring-and-alerting/

### Networking

We'll use a private docker network to allow the apps to communicate with each other in a private network.

Create a bridged network called `prometheus-bridge`:

```bash
dokku network:create prometheus-bridge
```

Later on, we'll attach apps to this network, for example:

```bash
dokku network:set fancy-app attach-post-deploy prometheus-bridge

# once attached, the hostname "fancy-app.web" is available on the network.
```

### Set up Prometheus

Create the prometheus dokku app and set the ports:

```bash
dokku apps:create prometheus
dokku proxy:ports-add prometheus http:80:9090
dokku proxy:ports-remove prometheus http:9090:9090
```

Set the volume mounts for persistent storage:

```bash
mkdir -p /var/lib/dokku/data/storage/prometheus/{config,data}
touch /var/lib/dokku/data/storage/prometheus/config/{alert.rules,prometheus.yml}
chown -R nobody:nogroup /var/lib/dokku/data/storage/prometheus

dokku storage:mount prometheus /var/lib/dokku/data/storage/prometheus/config:/etc/prometheus
dokku storage:mount prometheus /var/lib/dokku/data/storage/prometheus/data:/prometheus
```

Set prometheus config:

```bash
dokku config:set --no-restart prometheus DOKKU_DOCKERFILE_START_CMD="--config.file=/etc/prometheus/prometheus.yml
  --storage.tsdb.path=/prometheus
  --web.console.libraries=/usr/share/prometheus/console_libraries
  --web.console.templates=/usr/share/prometheus/consoles
  --web.enable-lifecycle
  --storage.tsdb.no-lockfile"
```

(We set `--storage.tsdb.no-lockfile` to prevent tsdb from creating a lockfile to allow us to re-deploy without data read errors.)

Attach `prometheus` to the `prometheus-bridge` network:

```bash
dokku network:set prometheus attach-post-deploy prometheus-bridge
```

#### Prometheus Config

The following example shows how to use both local and public app hostnames. We have to use a public endpoint for `node-exporter` as it's using the host network and cannot be attached to the `prometheus-bridge` network. TODO

You'll need to create the prometheus configuration file at location `/var/lib/dokku/data/storage/prometheus/config/prometheus.yml`.

<!-- # old -->
<!-- Create the prometheus configuration file at location `/home/dokku/prometheus/prometheus.yml`: -->

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 15s
    static_configs:
      - targets:
          - 'localhost:9090'
  - job_name: node-exporter
    scrape_interval: 15s
    scheme: https
    basic_auth:
      username: <username>
      password: <password>
    static_configs:
      - targets:
          - 'node-exporter.dokku.me'
  - job_name: cadvisor
    scrape_interval: 15s
    scheme: http
    static_configs:
      - targets:
          - 'cadvisor.web:8080'
```

Deploy the prometheus app and secure it with `http-auth`:

```bash
docker pull prom/prometheus:latest
docker tag prom/prometheus:latest dokku/prometheus:latest
dokku tags:deploy prometheus latest

dokku letsencrypt prometheus
dokku http-auth:on prometheus USER PASSWORD
```

Once the prometheus app is deployed visit [https://prometheus.dokku.me/targets](https://prometheus.dokku.me/targets) to confirm prometheus can connect to localhost, but other targets should all be down.

### Set up Node-exporter

Node exporter provides metrics about the host machine.

```bash
dokku apps:create node-exporter

docker image pull prom/node-exporter:latest
docker image tag prom/node-exporter:latest dokku/node-exporter:latest

dokku config:set --no-restart node-exporter DOKKU_DOCKERFILE_START_CMD="--collector.textfile.directory=/data --path.procfs=/host/proc --path.sysfs=/host/sys"

dokku storage:mount node-exporter /proc:/host/proc:ro
dokku storage:mount node-exporter /:/rootfs:ro
dokku storage:mount node-exporter /sys:/host/sys:ro
dokku storage:mount node-exporter /var/lib/dokku/data/storage/node-exporter:/data

mkdir -p /var/lib/dokku/data/storage/node-exporter
chown nobody:nogroup /var/lib/dokku/data/storage/node-exporter

dokku docker-options:add node-exporter deploy "--net=host"
dokku checks:disable node-exporter

dokku tags:deploy node-exporter latest
dokku proxy:ports-set node-exporter http:80:9100
dokku letsencrypt node-exporter
dokku http-auth:on node-exporter <username> <password>
```

### Set up cAdvisor

```bash
dokku apps:create cadvisor

docker image pull gcr.io/google-containers/cadvisor:latest
docker image tag gcr.io/google-containers/cadvisor:latest dokku/cadvisor:latest

dokku config:set --no-restart cadvisor DOKKU_DOCKERFILE_START_CMD="--docker_only --housekeeping_interval=10s --max_housekeeping_interval=60s"

dokku storage:mount cadvisor /:/rootfs:ro
dokku storage:mount cadvisor /sys:/sys:ro
dokku storage:mount cadvisor /var/lib/docker:/var/lib/docker:ro
dokku storage:mount cadvisor /var/run:/var/run:rw
dokku network:set cadvisor attach-post-deploy prometheus-bridge

dokku tags:deploy cadvisor latest
dokku proxy:ports-set cadvisor http:80:8080
dokku letsencrypt cadvisor
dokku http-auth:on cadvisor <username> <password>
```

### Set up loki

Create the app and set the app config:

```bash
dokku apps:create loki
dokku proxy:ports-add loki http:80:3100
dokku proxy:ports-remove loki http:3100:3100
dokku config:set --no-restart loki DOKKU_DOCKERFILE_START_CMD="-config.file=/etc/loki/loki-config.yaml"
```

Set the `loki` config file mounts:

```bash
mkdir -p /var/lib/dokku/data/storage/loki/config
touch /var/lib/dokku/data/storage/loki/config/loki-config.yml
chown -R nobody:nogroup /var/lib/dokku/data/storage/loki
dokku storage:mount loki /var/lib/dokku/data/storage/loki/config:/etc/loki
```

#### Loki Networking

Add loki to the prometheus bridge network:

```bash
dokku network:set loki attach-post-deploy prometheus-bridge
```

#### Loki Config

Create the `loki` configuration file at location `/var/lib/dokku/data/storage/loki/config/loki-config.yaml`.

```yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 1h # Any chunk not receiving new logs in this time will be flushed
  max_chunk_age: 1h # All chunks will be flushed when they hit this age, default is 1h
  chunk_target_size: 1048576 # Loki will attempt to build chunks up to 1.5MB, flushing first if chunk_idle_period or max_chunk_age is reached first
  chunk_retain_period: 30s # Must be greater than index read cache TTL if using an index cache (Default index read cache TTL is 5m)
  max_transfer_retries: 0 # Chunk transfers disabled

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /tmp/loki/boltdb-shipper-active
    cache_location: /tmp/loki/boltdb-shipper-cache
    cache_ttl: 24h # Can be increased for faster performance over longer query periods, uses more disk space
    shared_store: filesystem
  filesystem:
    directory: /tmp/loki/chunks

compactor:
  working_directory: /tmp/loki/boltdb-shipper-compactor
  shared_store: filesystem

limits_config:
  reject_old_samples: true
  reject_old_samples_max_age: 168h

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: false
  retention_period: 0s

ruler:
  storage:
    type: local
    local:
      directory: /tmp/loki/rules
  rule_path: /tmp/loki/rules-temp
  alertmanager_url: http://localhost:9093
  ring:
    kvstore:
      store: inmemory
  enable_api: true
```

#### Deploy loki

```bash
docker image pull grafana/loki:2.0.0
docker image tag grafana/loki:2.0.0 dokku/loki:latest
dokku tags:deploy loki latest
```

The following endpoints should be available:

- [http://loki.dokku.me/ready](http://loki.dokku.me/ready)
- [http://loki.dokku.me/metrics](http://loki.dokku.me/metrics)

### Set up Promtail

`Promtail` will read logs and push to `loki`.

Create the app and set the app config:

```bash
dokku apps:create promtail
dokku config:set --no-restart promtail DOKKU_DOCKERFILE_START_CMD="-config.file=/etc/promtail/promtail-config.yaml"
dokku checks:disable promtail
```

Set the `promtail` volume mounts:

```bash
mkdir -p /var/lib/dokku/data/storage/promtail/config
touch /var/lib/dokku/data/storage/promtail/config/promtail-config.yml
chown -R nobody:nogroup /var/lib/dokku/data/storage/promtail
dokku storage:mount promtail /var/lib/dokku/data/storage/promtail/config:/etc/promtail
dokku storage:mount promtail /var/log:/var/log
```

#### Promtail Networking

Add `promtail` to the `prometheus` bridge network:

```bash
dokku network:set promtail attach-post-deploy prometheus-bridge
```

#### Promtail Config

Create the `promtail` configuration file at location `/var/lib/dokku/data/storage/promtail/config/promtail-config.yaml`.

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki.web:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log
      - targets:
          - localhost
        labels:
          job: nginx
          __path__: /var/log/nginx/*log
```

#### Deploy promtail

```bash
docker image pull grafana/promtail:2.0.0
docker image tag grafana/promtail:2.0.0 dokku/promtail:latest
dokku tags:deploy promtail latest
```

The following endpoints should be available:

- [http://promtail.dokku.me/ready](http://promtail.dokku.me/ready)
- [http://promtail.dokku.me/metrics](http://promtail.dokku.me/metrics)

#### Monitoring nginx logs

First signup to maxmind to get your licence key: https://www.maxmind.com/en/geolite2/signup

Install the geoip database:

```bash
mkdir /etc/nginx/geoip
cd /etc/nginx/geoip
curl -o GeoLite2-City.tar.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=MAXMIND_LICENSE_KEY&suffix=tar.gz"
curl -o GeoLite2-Country.tar.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=MAXMIND_LICENSE_KEY&suffix=tar.gz"
tar -xzf GeoLite2-City.tar.gz
tar -xzf GeoLite2-Country.tar.gz
```

### Set up Grafana

Create the dokku app and set the ports:

```bash
dokku apps:create grafana
dokku proxy:ports-add grafana http:80:3000
dokku proxy:ports-remove grafana http:3000:3000
```

Mount the data & config directories:

```bash
mkdir -p /var/lib/dokku/data/storage/grafana/{config,data,plugins}
mkdir -p /var/lib/dokku/data/storage/grafana/config/provisioning/datasources
chown -R 472:472 /var/lib/dokku/data/storage/grafana

dokku storage:mount grafana /var/lib/dokku/data/storage/grafana/config/provisioning/datasources:/etc/grafana/provisioning/datasources
dokku storage:mount grafana /var/lib/dokku/data/storage/grafana/data:/var/lib/grafana
```

Set Prometheus data source in `/var/lib/dokku/data/storage/grafana/config/provisioning/datasources/prometheus.yml`:

```yaml
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    orgId: 1
    url: http://prometheus.web:9090
    basicAuth: false
    isDefault: true
    version: 1
    editable: true
```

Set the loki data source in `/var/lib/dokku/data/storage/grafana/config/provisioning/datasources/loki.yml`:

```yaml
datasources:
  - name: Loki
    type: loki
    access: proxy
    orgId: 1
    url: http://loki.web:3100
    basicAuth: false
    isDefault: false
    version: 1
    editable: true
```

Add Grafana to the `prometheus-bridge` network:

```bash
dokku network:set grafana attach-post-deploy prometheus-bridge
```

Add the WorldMap plugin:

```bash
apt-get install -y unzip
curl -o grafana-worldmap-panel.zip -L https://grafana.com/api/plugins/grafana-worldmap-panel/versions/0.3.2/download
unzip grafana-worldmap-panel.zip -d /var/lib/dokku/data/storage/grafana/plugins/
rm -f grafana-worldmap-panel.zip
```

Deploy Grafana:

```bash
docker pull grafana/grafana:latest
docker tag grafana/grafana:latest dokku/grafana:latest
dokku tags:deploy grafana latest
dokku letsencrypt grafana
```

TODO: grafana config eg smtp

https://medium.com/better-programming/node-js-application-monitoring-with-prometheus-and-grafana-b08deaf0efe3
https://www.milanvit.net/post/getting-started-with-server-monitoring-and-alerting/

#### Data sources

By default the following data sources should be enabled:

- `http://prometheus.web:9090`
- `http://loki.web:3100`

To explore the `loki` logs, click `Explore` on the sidebar, select the `Loki` datasource in the top-left dropdown, and then choose a log stream using the `Log labels` button.



## Recording App Metrics

We'll be recording both back-end and front-end metrics.

Before continuing, ensure you've deployed your app, then add it to the `prometheus-bridge` network:

```bash
dokku network:set next-app attach-post-deploy prometheus-bridge
```

### Back-end Metrics

Goals:

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

The server is written in TypeScript and is not part of the Next.js build, so we need a new build setup for compiling the server.

Install a base tsconfig for Node 14:

```bash
npm i @tsconfig/node14 --save-dev
```

Create a new directory called `server` and create a new file at `server/tsconfig.json` with:

```json
{
  "extends": "@tsconfig/node14/tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "isolatedModules": false,
    "noEmit": false
  },
  "include": ["**/*.ts"]
}
```

(Placing the `tsconfig.json` in a nested folder provides better compatibility for IDE intellisense, and this approach works well in VS Code.)

Adjust your `npm` run scripts in `package.json` to compile the server and adjust the start script:

```json
{
  "scripts": {
    "dev": "npm run build:server && npm start",
    "build:server": "tsc -p server --outDir build",
    "build": "npm run build:server && next build",
    "start": "node build/server"
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

We'll use this technique to publish performance metrics to Prometheus and we'll need to create an endpoint (`/vitals`) to process metrics sent from the client.

### Create the vitals endpoint

Register a new metrics provider with your prometheus client:

```ts
export const ttfbHistogram = new client.Histogram({
  name: 'client_user_timing_ttfb',
  help: 'Time to first byte',
  labelNames: ['path'],
});

registry.registerMetric(ttfbHistogram);
```

Create the `/vitals` endpoint to record the metric:

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

## Grafana Dashboards

Import the following dashboards:

- [Prometheus internal metrics](https://grafana.com/grafana/dashboards/3662)

## Add Deploy Annotations to Grafana

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

## Supporting Documentation

I recommend reading [Getting started with server monitoring and alerting](https://www.milanvit.net/post/getting-started-with-server-monitoring-and-alerting/)t as a compliment to this article, as it goes into a little more detail on a lot the tools we're using (except for `loki`).

https://blog.ruanbekker.com/blog/2020/08/13/getting-started-on-logging-with-loki-using-docker/
