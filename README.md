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

## Docker

## Running the Next.js App with Docker

```console
docker build -t registry.docker-box.richardwillis.info/badsyntax/richardwillis.info . --build-arg STRAPI_ENDPOINT=https://strapi.docker-box.richardwillis.info
docker run --publish 8000:80 registry.docker-box.richardwillis.info/badsyntax/richardwillis.info:latest
```

### Running the Stack With Docker Swarm

```console
docker swarm init
docker network create --driver=overlay traefik-public
docker stack rm $(docker stack ls --format "{{.Name}}")

printf "postgres-password" | docker secret create richardwillis-postgres-password -
printf "postgres-user" | docker secret create richardwillis-postgres-user -
printf "DATABASE_HOST=strapi_db
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres-user
DATABASE_PASSWORD=postgres-password
ADMIN_JWT_SECRET=123456789

AWS_ACCESS_KEY_ID=123456
AWS_ACCESS_SECRET=123456
AWS_REGION=us-east-1
AWS_BUCKET=assets.example.com" | docker secret create richardwillis-strapi-config -

printf "GITHUB_TOKEN=1234" | docker secret create richardwillis-actions-proxy-env -

printf "GITHUB_TOKEN=1234" | docker secret create richardwillis-actions-proxy-env -

ADMIN_USER_EMAIL=replace-me
ADMIN_USER_NAME=replace-me
ADMIN_USER_PWD=replace-me
BASE_URL=replace-me
SECRET_KEY_BASE=replace-me



printf "plausible-admin-user-email" | docker secret create richardwillis-plausible-admin-user-email -
printf "plausible-admin-user-name" | docker secret create richardwillis-plausible-admin-user-name -
printf "plausible-admin-user-password" | docker secret create richardwillis-plausible-admin-user-password -
printf "plausible-base-url" | docker secret create richardwillis-plausible-base-url -
printf "plausible-secret-key-base" | docker secret create richardwillis-plausible-secret-key-base -

docker stack deploy --compose-file docker-compose.yml richardwillis
docker service update richardwillis_nextjs --publish-add 3002:80
docker service update richardwillis_plausible --publish-add 8001:8000

docker service ls
```
