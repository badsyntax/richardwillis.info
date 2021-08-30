# RichardWillis.info

[![Analyze](https://github.com/badsyntax/richardwillis.info/actions/workflows/analyze.yml/badge.svg)](https://github.com/badsyntax/richardwillis.info/actions/workflows/analyze.yml)
[![Prod deploy](https://github.com/badsyntax/richardwillis.info/actions/workflows/prod-deploy.yml/badge.svg)](https://github.com/badsyntax/richardwillis.info/actions/workflows/prod-deploy.yml)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Add the following to `.env.local`:

```bash
STRAPI_ENDPOINT=https://strapi.docker-box.example.com
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running With Docker

```console
docker build -t registry.docker-box.richardwillis.info/badsyntax/richardwillis.info . --build-arg STRAPI_ENDPOINT=https://strapi.docker-box.richardwillis.info
docker run --publish 8000:80 registry.docker-box.richardwillis.info/badsyntax/richardwillis.info:latest
```

### Running With Docker Swarm

```console
docker swarm init
docker network create --driver=overlay traefik-public
docker stack rm $(docker stack ls --format "{{.Name}}")
docker stack deploy --compose-file docker-compose.yml richardwillis
docker service update richardwillis_nextjs --publish-add 3002:80
```
