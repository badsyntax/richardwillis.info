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
docker-compose up
```

## Deploy

First build & push the docker image:

```bash
echo $CR_PAT | docker login ghcr.io -u badsyntax --password-stdin
docker build -t ghcr.io/badsyntax/richardwillis:latest .
docker push ghcr.io/badsyntax/richardwillis:latest
```

Now deploy the image on the dokku server:

```bash
dokku apps:create richardwillis
dokku proxy:ports-add richardwillis http:80:3000
echo $CR_PAT | docker login ghcr.io -u badsyntax --password-stdin
docker pull ghcr.io/badsyntax/richardwillis:latest
docker tag ghcr.io/badsyntax/richardwillis:latest dokku/richardwillis:latest
dokku tags:deploy richardwillis latest
dokku proxy:ports-add richardwillis http:80:3000
dokku letsencrypt richardwillis
```
