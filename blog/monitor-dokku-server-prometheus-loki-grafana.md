---
title: 'Monitor a dokku server with Prometheus, Grafana & Loki'
excerpt: 'How to setup a full monitoring stack on your dokku server using Prometheus, Loki & Grafana.'
date: '2021-01-14T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: false
---

This post outlines how I setup a full monitoring stack on my single `dokku` server. While it's a pretty long post, it's not very detailed and just covers the absolute basics of setting up the various services.

## Services Overview

We'll set up 6 different services as dokku apps:

- `prometheus` - monitoring and alerting toolkit
- `loki` - application logs indexer
- `promtail` - ships the contents of local logs to `loki`
- `grafana` - read & graph time series data from `loki` & `prometheus`
- `node-exporter` - provides metrics about the host machine
- `cadvisor` - provides metrics about running docker containers

## Requirements

You'll need `dokku` installed on a single server running `Ubuntu 20.04`. I've tested these instructions on `dokku` version `v0.22.8` but they'll probably work on other versions too.

Public endpoints are secured with `http-auth` and `tls` so you'll need to make sure you have the relevant plugins installed:

```bash
dokku plugin:install https://github.com/dokku/dokku-http-auth.git
dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
```

Adding a full monitoring solution increases the required resources for your server, but once the tools are set up you'll have metrics to identify whether you need any additional resources.

## Networking

We'll use a private docker network to allow the apps to communicate with each other in a private network.

Create a bridged network called `prometheus-bridge`:

```bash
dokku network:create prometheus-bridge
```

## Set up Prometheus

Create the prometheus dokku app and set the ports:

```bash
dokku apps:create prometheus
dokku proxy:ports-add prometheus http:80:9090
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

### Prometheus Config

Create the config file at location `/var/lib/dokku/data/storage/prometheus/config/prometheus.yml`:

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

Ideally we only want to use local hostnames available within the private `prometheus-bridge` network, but we have to use a public endpoint for `node-exporter` as it's using the host network and cannot be attached to the `prometheus-bridge` network.

### Deploy Prometheus

Deploy the prometheus app and secure it with `http-auth`:

```bash
docker pull prom/prometheus:latest
docker tag prom/prometheus:latest dokku/prometheus:latest
dokku tags:deploy prometheus latest

dokku letsencrypt prometheus
dokku http-auth:on prometheus USER PASSWORD
```

Visit [https://prometheus.dokku.me/targets](https://prometheus.dokku.me/targets) to confirm prometheus can connect to localhost (and other targets should all be down).

## Set up Node-exporter

Node exporter provides metrics on the host machine.

Create the app and set the config:

```bash
dokku apps:create node-exporter
dokku proxy:ports-set node-exporter http:80:9100
dokku config:set --no-restart node-exporter DOKKU_DOCKERFILE_START_CMD="--collector.textfile.directory=/data --path.procfs=/host/proc --path.sysfs=/host/sys"
```

Set the storage mounts:

```bash
mkdir -p /var/lib/dokku/data/storage/node-exporter
chown nobody:nogroup /var/lib/dokku/data/storage/node-exporter

dokku storage:mount node-exporter /proc:/host/proc:ro
dokku storage:mount node-exporter /:/rootfs:ro
dokku storage:mount node-exporter /sys:/host/sys:ro
dokku storage:mount node-exporter /var/lib/dokku/data/storage/node-exporter:/data
```

Add `node-exporter` to the host network:

```bash
dokku docker-options:add node-exporter deploy "--net=host"
```

Disable zero-downtime checks:

```bash
dokku checks:disable node-exporter
```

Deploy the app:

```bash
docker image pull prom/node-exporter:latest
docker image tag prom/node-exporter:latest dokku/node-exporter:latest

dokku tags:deploy node-exporter latest
dokku letsencrypt node-exporter
dokku http-auth:on node-exporter <username> <password>
```

### Set up cAdvisor

Create the app and set the config:

```bash
dokku apps:create cadvisor
dokku proxy:ports-set cadvisor http:80:8080
dokku config:set --no-restart cadvisor DOKKU_DOCKERFILE_START_CMD="--docker_only --housekeeping_interval=10s --max_housekeeping_interval=60s"
```

Set the storage mounts:

```bash
dokku storage:mount cadvisor /:/rootfs:ro
dokku storage:mount cadvisor /sys:/sys:ro
dokku storage:mount cadvisor /var/lib/docker:/var/lib/docker:ro
dokku storage:mount cadvisor /var/run:/var/run:rw
```

Attach to the `prometheus-bridge` network:

```bash
dokku network:set cadvisor attach-post-deploy prometheus-bridge
```

Deploy the app:

```bash
docker image pull gcr.io/google-containers/cadvisor:latest
docker image tag gcr.io/google-containers/cadvisor:latest dokku/cadvisor:latest

dokku tags:deploy cadvisor latest
dokku letsencrypt cadvisor
dokku http-auth:on cadvisor <username> <password>
```

## Set up loki

Create the app and set the config:

```bash
dokku apps:create loki
dokku proxy:ports-add loki http:80:3100
dokku config:set --no-restart loki DOKKU_DOCKERFILE_START_CMD="-config.file=/etc/loki/loki-config.yaml"
```

Set the storage mounts:

```bash
mkdir -p /var/lib/dokku/data/storage/loki/config
touch /var/lib/dokku/data/storage/loki/config/loki-config.yml
chown -R nobody:nogroup /var/lib/dokku/data/storage/loki
dokku storage:mount loki /var/lib/dokku/data/storage/loki/config:/etc/loki
```

Attach to the `prometheus-bridge` network:

```bash
dokku network:set loki attach-post-deploy prometheus-bridge
```

### Loki Config

Create the configuration file at location `/var/lib/dokku/data/storage/loki/config/loki-config.yaml`:

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

### Deploy loki

```bash
docker image pull grafana/loki:2.0.0
docker image tag grafana/loki:2.0.0 dokku/loki:latest
dokku tags:deploy loki latest
dokku letsencrypt loki
dokku http-auth:on loki <username> <password>
```

The following endpoints should be available:

- [https://loki.dokku.me/ready](http://loki.dokku.me/ready)
- [https://loki.dokku.me/metrics](http://loki.dokku.me/metrics)

## Set up Promtail

`Promtail` will read logs and push to `loki`.

Create the app and set the config:

```bash
dokku apps:create promtail
dokku config:set --no-restart promtail DOKKU_DOCKERFILE_START_CMD="-config.file=/etc/promtail/promtail-config.yaml"
```

Set the storage mounts:

```bash
mkdir -p /var/lib/dokku/data/storage/promtail/config
touch /var/lib/dokku/data/storage/promtail/config/promtail-config.yml
chown -R nobody:nogroup /var/lib/dokku/data/storage/promtail
dokku storage:mount promtail /var/lib/dokku/data/storage/promtail/config:/etc/promtail
dokku storage:mount promtail /var/log:/var/log
```

Attach to the `prometheus-bridge` network:

```bash
dokku network:set promtail attach-post-deploy prometheus-bridge
```

### Promtail Config

Create the configuration file at location `/var/lib/dokku/data/storage/promtail/config/promtail-config.yaml`.

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

### Deploy promtail

```bash
docker image pull grafana/promtail:2.0.0
docker image tag grafana/promtail:2.0.0 dokku/promtail:latest
dokku tags:deploy promtail latest
dokku domains:disable promtail
```

## Set up Grafana

Create the dokku app and set the ports:

```bash
dokku apps:create grafana
dokku proxy:ports-add grafana http:80:3000
```

Mount the data & config directories:

```bash
mkdir -p /var/lib/dokku/data/storage/grafana/{config,data,plugins}
mkdir -p /var/lib/dokku/data/storage/grafana/config/provisioning/datasources
chown -R 472:472 /var/lib/dokku/data/storage/grafana

dokku storage:mount grafana /var/lib/dokku/data/storage/grafana/config/provisioning/datasources:/etc/grafana/provisioning/datasources
dokku storage:mount grafana /var/lib/dokku/data/storage/grafana/data:/var/lib/grafana
dokku storage:mount grafana /var/lib/dokku/data/storage/grafana/plugins:/var/lib/grafana/plugins
```

Set the `prometheus` data source in `/var/lib/dokku/data/storage/grafana/config/provisioning/datasources/prometheus.yml`:

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

Set the `loki` data source in `/var/lib/dokku/data/storage/grafana/config/provisioning/datasources/loki.yml`:

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

Attach to the `prometheus-bridge` network:

```bash
dokku network:set grafana attach-post-deploy prometheus-bridge
```

Add the WorldMap plugin (required for the web-analytics dashboard):

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

### Data sources

By default the following data sources should be enabled:

- `http://prometheus.web:9090`
- `http://loki.web:3100`

To explore the `loki` logs, click `Explore` on the sidebar, select the `Loki` datasource in the top-left dropdown, and then choose a log stream using the `Log labels` button.

## Monitor nginx access logs

We can use `loki` and `promtail` to index nginx access logs and display them as metrics in `grafana`, but we first need to configure nginx to output logs in a particular format, and use the geoip2 module to map ip addresses to locations.

### Configure nginx

Install the [maxmind tools](https://github.com/maxmind/libmaxminddb#on-ubuntu-via-ppa):

```bash
add-apt-repository -y ppa:maxmind/ppa
apt-get update
apt-get install -y geoipupdate libmaxminddb0 libmaxminddb-dev mmdb-bin
```

### Download geoip database

[Sign up for GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/) (it's free) and create a new license key.

Update `/etc/GeoIP.conf`:

```nginx
AccountID YOUR_ACCOUNT_ID_HERE
LicenseKey YOUR_LICENSE_KEY_HERE
EditionIDs GeoLite2-City GeoLite2-Country
```

Update the geoip database:

```bash
geoipupdate
```

List the geoip databases:

```bash
ls -l /usr/share/GeoIP/
```

### Install the nginx geoip2 module

Adding new modules to nginx requires you to build from source but Ubuntu 20.04 ships with a package called `nginx-full` that configures nginx to use the `mod-http-geoip2` dynamic module (amongst other).

For convenience we'll use this package and disable the dynamic modules we don't need.

Install `nginx-full`:

```bash
apt-get install -y nginx-full
```

Inspect the configure arguments to check the `http-geoip2` is installed correctly:

```bash
nginx -V
```

You should see something like:

```nginx
--add-dynamic-module=/build/nginx-5J5hor/nginx-1.18.0/debian/modules/http-geoip2
```

Disable the modules we don't need:

```bash
rm /etc/nginx/modules-enabled/50-mod-http-auth-pam.conf
rm /etc/nginx/modules-enabled/50-mod-http-dav-ext.conf
rm /etc/nginx/modules-enabled/50-mod-http-echo.conf
rm /etc/nginx/modules-enabled/50-mod-http-geoip.conf
rm /etc/nginx/modules-enabled/50-mod-http-subs-filter.conf
rm /etc/nginx/modules-enabled/50-mod-http-upstream-fair.conf
```

List the enabled modules:

```bash
ls -l /etc/nginx/modules-enabled
```

You should see:

```shell-session
50-mod-http-geoip2.conf -> /usr/share/nginx/modules-available/mod-http-geoip2.conf
50-mod-http-image-filter.conf -> /usr/share/nginx/modules-available/mod-http-image-filter.conf
50-mod-http-xslt-filter.conf -> /usr/share/nginx/modules-available/mod-http-xslt-filter.conf
50-mod-mail.conf -> /usr/share/nginx/modules-available/mod-mail.conf
50-mod-stream.conf -> /usr/share/nginx/modules-available/mod-stream.conf
```

The `mod-http-image-filter`, `mod-http-xslt-filter`, `mod-mail` and `mod-stream` modules are the default modules enabled with the default dokku nginx installation. We're only enabling one additional dynamic module (`mod-http-geoip2`).

Update `/etc/nginx/nginx.conf` to load the geoip databases:

```nginx
http {
    ...

    geoip2 /usr/share/GeoIP/GeoLite2-Country.mmdb {
        auto_reload 60m;
        $geoip2_metadata_country_build metadata build_epoch;
        $geoip2_data_country_code country iso_code;
        $geoip2_data_country_name country names en;
    }

    geoip2 /usr/share/GeoIP/GeoLite2-City.mmdb {
        auto_reload 60m;
        $geoip2_metadata_city_build metadata build_epoch;
        $geoip2_data_city_name city names en;
    }

    ...
}
```

Restart nginx:

```bash
nginx -t
service nginx reload
```

### Update application log format

Update your app nginx configuration capture additional metrics and store in json format.

For example in file `/home/dokku/my-app/nginx.conf`:

```nginx
log_format json_analytics escape=json '{'
  '"msec": "$msec", ' # request unixtime in seconds with a milliseconds resolution
  '"connection": "$connection", ' # connection serial number
  '"connection_requests": "$connection_requests", ' # number of requests made in connection
  '"pid": "$pid", ' # process pid
  '"request_id": "$request_id", ' # the unique request id
  '"request_length": "$request_length", ' # request length (including headers and body)
  '"remote_addr": "$remote_addr", ' # client IP
  '"remote_user": "$remote_user", ' # client HTTP username
  '"remote_port": "$remote_port", ' # client port
  '"time_local": "$time_local", '
  '"time_iso8601": "$time_iso8601", ' # local time in the ISO 8601 standard format
  '"request": "$request", ' # full path no arguments if the request
  '"request_uri": "$request_uri", ' # full path and arguments if the request
  '"args": "$args", ' # args
  '"status": "$status", ' # response status code
  '"body_bytes_sent": "$body_bytes_sent", ' # the number of body bytes exclude headers sent to a client
  '"bytes_sent": "$bytes_sent", ' # the number of bytes sent to a client
  '"http_referer": "$http_referer", ' # HTTP referer
  '"http_user_agent": "$http_user_agent", ' # user agent
  '"http_x_forwarded_for": "$http_x_forwarded_for", ' # http_x_forwarded_for
  '"http_host": "$http_host", ' # the request Host: header
  '"server_name": "$server_name", ' # the name of the vhost serving the request
  '"request_time": "$request_time", ' # request processing time in seconds with msec resolution
  '"upstream": "$upstream_addr", ' # upstream backend server for proxied requests
  '"upstream_connect_time": "$upstream_connect_time", ' # upstream handshake time incl. TLS
  '"upstream_header_time": "$upstream_header_time", ' # time spent receiving upstream headers
  '"upstream_response_time": "$upstream_response_time", ' # time spend receiving upstream body
  '"upstream_response_length": "$upstream_response_length", ' # upstream response length
  '"upstream_cache_status": "$upstream_cache_status", ' # cache HIT/MISS where applicable
  '"ssl_protocol": "$ssl_protocol", ' # TLS protocol
  '"ssl_cipher": "$ssl_cipher", ' # TLS cipher
  '"scheme": "$scheme", ' # http or https
  '"request_method": "$request_method", ' # request method
  '"server_protocol": "$server_protocol", ' # request protocol, like HTTP/1.1 or HTTP/2.0
  '"pipe": "$pipe", ' # "p" if request was pipelined, "." otherwise
  '"gzip_ratio": "$gzip_ratio", '
  '"http_cf_ray": "$http_cf_ray",'
  '"geoip_country_code": "$geoip2_data_country_code"'
  '}';

server {
  ...

  access_log  /var/log/nginx/my-app-access.log;
  access_log  /var/log/nginx/my-app-json-access.log json_analytics;
  error_log   /var/log/nginx/my-app-error.log;

  ...
}
```

Restart nginx:

```bash
nginx -t
service nginx reload
```

## Grafana Dashboards

Now _finally_ to put it all together. We'll set up the following Grafana dashboards:

- Host Metrics dashboard
- Container Metrics dashboard
- Application Nginx Metrics dashboard

Click on each of the links above to view the corresponding `json` files for each dashboard. You can import these json files into Grafana by visiting http://grafana.dokku.me/dashboards and clicking on "Import".

## Supporting Articles

- [Getting started with server monitoring and alerting](https://www.milanvit.net/post/getting-started-with-server-monitoring-and-alerting/)
