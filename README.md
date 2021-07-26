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

## Building

```bash
docker build -t ghcr.io/badsyntax/richardwillis:latest --build-arg ASSET_PREFIX=/ .
```

Build the images (local):

```bash
cd nextjs
docker build -t ghcr.io/badsyntax/richardwillis:latest --build-arg ASSET_PREFIX=/ .
cd ../staticman
docker build -t ghcr.io/badsyntax/richardwillis-staticman:latest .
cd ../strapi
docker build -t ghcr.io/badsyntax/richardwillis-strapi:latest .
cd ../
```

Setup swarm and deploy the stack:

```bash
docker swarm leave --force
docker volume prune --force
docker swarm init
docker network create --driver=overlay --attachable traefik-public
docker secret create richardwillis-staticman-config ./staticman.config.json
docker secret create richardwillis-strapi-config ./strapi.env
echo 1234 | docker secret create richardwillis-postgres-password -
echo user | docker secret create richardwillis-postgres-user -
docker stack deploy -c ./docker-compose.yml richardwillis
```
