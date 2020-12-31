# RichardWillis.info

![Analyze](https://github.com/badsyntax/richardwillis.info/workflows/Analyze/badge.svg)
![Publish](https://github.com/badsyntax/richardwillis.info/workflows/Publish/badge.svg)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install deps & run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding Blog Entries

Add new entries as markdown files to [blog/](./blog).

## Docker

Build & run the Node.js image:

```bash
docker build -t badsyntax/richardwillis .
docker run --publish 3000:3000 badsyntax/richardwillis

# or
docker-compose up --remove-orphans
```

## Manual Deploy

First build & push the docker image:

```bash
echo $CR_PAT | docker login ghcr.io -u badsyntax --password-stdin
docker build -t ghcr.io/badsyntax/richardwillis:latest --build-arg ASSET_PREFIX=/ .
docker push ghcr.io/badsyntax/richardwillis:latest
```

Now pull & deploy the image on the dokku server:

```bash
dokku apps:create richardwillis
dokku proxy:ports-add richardwillis http:80:3000
dokku proxy:ports-remove richardwillis http:3000:3000
echo $CR_PAT | docker login ghcr.io -u badsyntax --password-stdin
docker pull ghcr.io/badsyntax/richardwillis:latest
docker tag ghcr.io/badsyntax/richardwillis:latest dokku/richardwillis:latest
dokku tags:deploy richardwillis latest
dokku letsencrypt richardwillis
dokku domains:add richardwillis richardwillis.info
```

## Setting up Prometheus with dokku

```bash
dokku apps:create prometheus
dokku proxy:ports-add prometheus http:80:9090
dokku proxy:ports-remove prometheus http:9090:9090

mkdir -p /var/lib/dokku/data/storage/prometheus
chown nobody /var/lib/dokku/data/storage/prometheus
dokku storage:mount prometheus "/var/lib/dokku/data/storage/prometheus:/prometheus"
dokku storage:mount prometheus "/home/dokku/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml"

dokku config:set prometheus DOKKU_DOCKERFILE_START_CMD="--config.file=/etc/prometheus/prometheus.yml
  --storage.tsdb.path=/prometheus
  --web.console.libraries=/usr/share/prometheus/console_libraries
  --web.console.templates=/usr/share/prometheus/consoles
  --storage.tsdb.no-lockfile"

dokku docker-options:add prometheus build,deploy,run "--link richardwillis.web.1:richardwillis"

## Add contents of ./prometheus/prometheus.yml to /home/dokku/prometheus/prometheus.yml

docker pull prom/prometheus:latest
docker tag prom/prometheus:latest dokku/prometheus:latest
dokku tags:deploy prometheus latest
dokku
```
