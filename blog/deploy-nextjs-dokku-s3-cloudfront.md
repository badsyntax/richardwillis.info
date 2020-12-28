---
title: 'Deploy a Next.js docker app to dokku & S3'
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
  assetPrefix: isProd ? 'https://assets.example.com' : '',
  images: {
    domains: ['assets.example.com'],
  },
  generateBuildId: () => {
    return process.env.APP_VERSION || 'unknown-app-version';
  },
};
```

## Creating the Dockerfile

The following Dockerfile shows how to use multi-stage builds to package a Next.js app. (Multi-stage builds are used to reduce the final size of the container.)

Please update where appropriate (at least `EMAIL`, `GITHUB_USER`, `REPO_NAME` & `DESCRIPTION`).

```dockerfile
FROM node:14.15.3-alpine AS builder

LABEL maintainer=EMAIL

WORKDIR /app

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV CI true

COPY package.json package-lock.json ./

RUN npm ci
COPY . .

RUN NODE_ENV=production npm run build
RUN npm prune --production


FROM node:14.15.3-alpine

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

CMD ["node_modules/.bin/pm2-runtime", "node_modules/.bin/next", "--", "start"]
```

## Building and Running the App Locally

```bash
docker build -t GITHUB_USER/DOKKU_APP_NAME:latest .
docker run --publish 3000:3000 GITHUB_USER/DOKKU_APP_NAME:latest
```

## Deploying the App with CI/CD

We'll use GitHub Actions to:

1. Build the docker image and publish it to the container registry
2. Extract the static assets from the docker image and publish them to S3
3. Deploy the app to dokku using GitHub Actions

### Setting up S3 & CloudFront

An S3 bucket is used to host all static assets for all app versions.

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
          args: --cache-control public,max-age=31536000,immutable
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'eu-west-2'
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

Some interesting points about this approach:

- Static assets are copied out of the docker image as the file hashes don't match when building in different OS environments (even when setting the Next.js build ID).
- `APP_VERSION` is used as the build ID and is set from the GitHub Release tag value
