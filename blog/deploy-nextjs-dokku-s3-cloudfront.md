---
title: 'Deploy a Next.js app to dokku & S3'
excerpt: 'How to package and deploy & Next.js app to your dokku server and the cloud.'
date: '2020-12-27T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: false
---

This post outlines how to release your Next.js app with CI/CD (GitHub actions), and covers how to:

- Package a Next.js application using Docker
- Publish the docker image to the GitHub Container Registry
- Publish static assets to S3 (and distribute with CloudFront)
- Deploy the docker image to dokku

## Motivation

- Builds should never happen on the runtime dokku server as it affects runtime performance (front-end builds using webpack etc can take up a LOT of RAM and CPU)
- Deployments should be continuous and automated
- The runtime Node.js server should not be concerned with serving immutable static assets

## Next.js Config

In file `next.config.js`:

```js
const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  assetPrefix: isProd ? process.env.ASSET_PREFIX || 'https://assets.example.com' : '';
  generateBuildId: () => {
    return process.env.APP_VERSION || 'unknown-app-version';
  },
};
```

## Creating the Dockerfile

The following Dockerfile shows how to use multi-stage builds to package a Next.js app.

Please update where appropriate (at least `EMAIL`, `GITHUB_USER`, `REPO_NAME` & `DESCRIPTION`).

```dockerfile
FROM node:14.15.3-alpine as base
ARG APP_VERSION
ARG ASSET_PREFIX
ENV APP_VERSION $APP_VERSION
ENV ASSET_PREFIX $ASSET_PREFIX


FROM base AS builder

WORKDIR /app

RUN apk update && apk add curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV CI true

COPY package.json package-lock.json ./

RUN npm ci
COPY . .

RUN NODE_ENV=production npm run build
RUN npm prune --production
RUN node-prune node_modules


FROM base

LABEL maintainer=EMAIL
LABEL org.opencontainers.image.source https://github.com/GITHUB_USER/REPO_NAME
LABEL org.label-schema.name="REPO_NAME"
LABEL org.label-schema.description="DESCRIPTION"
LABEL org.label-schema.vcs-url="https://github.com/GITHUB_USER/REPO_NAME"
LABEL org.label-schema.usage="README.md"
LABEL org.label-schema.vendor="GITHUB_USER"

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 3000
ENV APP_HOME /app

RUN mkdir -p $APP_HOME && chown -R node:node $APP_HOME
WORKDIR $APP_HOME

COPY --from=builder --chown=node:node $APP_HOME/package.json $APP_HOME/package.json
COPY --from=builder --chown=node:node $APP_HOME/node_modules $APP_HOME/node_modules
COPY --from=builder --chown=node:node $APP_HOME/.next $APP_HOME/.next
COPY --from=builder --chown=node:node $APP_HOME/next.config.js $APP_HOME/next.config.js
COPY --from=builder --chown=node:node $APP_HOME/public $APP_HOME/public

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

Notes:

- Multi-stage builds are used to reduce the final size of the container.
- A base image is used to share environment variables between build & runtime stages.
- `npm prune --production` and [node-prune](https://github.com/tj/node-prune) are used to reduce the final size of `node_modules`/
- No process manager is used (eg `pm2`) as by default Dokku will automatically restart containers that exit with a non-zero, so there's no need for an extra process manager.
- `npm` is used to start the process as it handles termination signals (eg `SIGINT`) for us. If your app handles these signals itself, then you'll need to start the process with `node`.

I'm not really happy with the final image size (+-300mb) but there's not much I can do about that it's mostly due to app dependencies within `node_modules`.

## Deploying the dokku App manually

First build and run the app locally:

```bash
docker build -t ghcr.io/GITHUB_USER/DOKKU_APP_NAME:latest --build-arg ASSET_PREFIX=/ .
docker run --publish 3000:3000 ghcr.io/GITHUB_USER/DOKKU_APP_NAME:latest
```

Note we're passing `ASSET_PREFIX=/` as a build arg to serve assets from the app instead of S3.

Once you're happy with the app, you'll need to rebuild without the `ASSET_PREFIX=/` build arg:

```bash
docker build -t ghcr.io/GITHUB_USER/DOKKU_APP_NAME:latest .
```

Now publish the image to GitHub container registry:

```shell-session
echo $CR_PAT | docker login ghcr.io -u GITHUB_USER --password-stdin
docker build -t ghcr.io/GITHUB_USER/DOKKU_APP_NAME:latest .
docker push ghcr.io/GITHUB_USER/DOKKU_APP_NAME:latest
```

On your dokku server:

```shell-session
# create the app
dokku apps:create DOKKU_APP_NAME
dokku proxy:ports-add DOKKU_APP_NAME http:80:3000
dokku proxy:ports-remove DOKKU_APP_NAME http:3000:3000

# deploy the app
echo $CR_PAT | docker login ghcr.io -u GITHUB_USER --password-stdin
docker pull ghcr.io/GITHUB_USER/DOKKU_APP_NAME:latest
docker tag ghcr.io/GITHUB_USER/DOKKU_APP_NAME:latest dokku/DOKKU_APP_NAME:latest
dokku tags:deploy DOKKU_APP_NAME latest

# add custom domain and TLS
dokku domains:add DOKKU_APP_NAME example.com
dokku letsencrypt DOKKU_APP_NAME
```

## Deploying the App with CI/CD

We'll use GitHub Actions to:

1. Build the docker image and publish it to the container registry
2. Extract the static assets from the docker image and publish them to S3
3. Deploy the app to dokku using GitHub Actions

### Setting up S3 & CloudFront

An S3 bucket is required to host all static assets for all app versions.

Refer to [Set up CloudFront & S3](/blog/setup-s3-cloudfront-cdn) to set this up.

### Setting up Remote Dokku access

You'll need a SSH keypair created (without a passphrase) to allow the GitHub Action runner to SSH to the dokku server.

On your dokku server:

```bash
ssh-keygen -N "" -f /root/.ssh/githubactions
```

Add the `githubactions` public key to authorized_keys:

```bash
cat /root/.ssh/githubactions.pub >> /root/.ssh/authorized_keys
```

Now copy the private key which you'll use in the next step:

```bash
cat /root/.ssh/githubactions
```

### Repo Secrets

You'll need to set the following secrets in your Github repo:

- `AWS_ACCESS_KEY_ID`
- `AWS_S3_BUCKET`
- `AWS_SECRET_ACCESS_KEY`
- `CR_PAT` (GitHub Container Registry Personal Access Token)
- `DOKKU_APP_NAME`
- `DOKKU_HOST`
- `DOKKU_SSH_PRIVATE_KEY`

### Workflow

The following workflow file demonstrates how to release the app when creating a new GitHub Release:

```yaml
name: Publish
on:
  release:
    types: [published]

jobs:
  publish-docker:
    name: Publish docker image
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v1
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Cache Docker layers
        uses: actions/cache@v2
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v1
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.CR_PAT }}
      - name: Build and push docker image
        uses: docker/build-push-action@v2
        with:
          context: .
          file: ./Dockerfile
          push: true
          platforms: linux/amd64
          tags: ghcr.io/${{ github.repository_owner }}/${{ secrets.DOKKU_APP_NAME }}:latest
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache
          build-args: |
            APP_VERSION=${{ github.event.release.tag_name }}
  publish-s3:
    name: Publish to S3
    needs: [publish-docker]
    runs-on: ubuntu-20.04
    steps:
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v1
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.CR_PAT }}
      - name: Copy static files from docker image
        run: |
          docker pull ghcr.io/${{ github.repository_owner }}/${{ secrets.DOKKU_APP_NAME }}:latest
          docker run -i --name helper ghcr.io/${{ github.repository_owner }}/${{ secrets.DOKKU_APP_NAME }}:latest true
          docker cp helper:/app/.next .
          docker rm helper
      - name: Sync static assets to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: '--cache-control public,max-age=31536000,immutable --size-only'
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'us-east-1'
          SOURCE_DIR: '.next/static'
          DEST_DIR: '_next/static'
  deploy:
    name: Deploy app
    needs: [publish-docker, publish-s3]
    runs-on: ubuntu-20.04
    steps:
      - name: Set up SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.DOKKU_SSH_PRIVATE_KEY }}" | tr -d '\r' > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan ${{ secrets.DOKKU_HOST }} >> ~/.ssh/known_hosts
      - name: Deploy app
        run: |
          ssh root@${{ secrets.DOKKU_HOST }} "\\
            docker pull ghcr.io/${{ github.repository_owner }}/${{ secrets.DOKKU_APP_NAME }}:latest && \\
            docker tag ghcr.io/${{ github.repository_owner }}/${{ secrets.DOKKU_APP_NAME }}:latest dokku/${{ secrets.DOKKU_APP_NAME }}:latest && \\
            dokku config:set --no-restart ${{ secrets.DOKKU_APP_NAME }} APP_VERSION=\"${{ github.event.release.tag_name }}\" && \\
            dokku tags:deploy ${{ secrets.DOKKU_APP_NAME }} latest && \\
            dokku cleanup"
```

Notes:

- Static assets are copied out of the docker image as the file hashes don't match when building in different OS environments (even when setting the Next.js build ID).
- `APP_VERSION` is used as the build ID and is set from the GitHub Release tag value
