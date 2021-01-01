---
title: 'Set up staticman on dokku'
excerpt: 'How to set up S3 & CloudFront to host & distribute immutable static assets.'
date: '2020-12-24T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

## Create the dokku App

On your local machine:

```shell
docker build -t ghcr.io/GITHUB_USER/staticman:latest .
echo $CR_PAT | docker login ghcr.io -u GITHUB_USER --password-stdin
docker push ghcr.io/GITHUB_USER/staticman:latest
```

On the dokku server:

```bash
dokku apps:create staticman
dokku proxy:ports-add staticman http:80:3000

# Create the private key with an empty passphrase
ssh-keygen -m PEM -t rsa -b 4096 -C "staticman key" -f ~/.ssh/staticman -q -N ""
dokku config:set --encoded --no-restart staticman RSA_PRIVATE_KEY="$(base64 ~/.ssh/staticman)"
dokku config:set staticman --no-restart GITHUB_TOKEN=YOUR_GITHUB_TOKEN PORT=3000

docker pull ghcr.io/GITHUB_USER/staticman:latest
docker tag ghcr.io/GITHUB_USER/staticman:latest dokku/staticman:latest

dokku tags:deploy staticman latest
dokku domains:add staticman staticman.richardwillis.info
dokku letsencrypt staticman
dokku proxy:ports-remove staticman http:3000:3000
```

GITHUB_TOKEN



```dockerfile
FROM node:14.15.3-alpine as builder

RUN apk add --no-cache python3 make

WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV CI true
ENV NODE_ENV production

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production


FROM node:14.15.3-alpine

WORKDIR /app

ENV NODE_ENV production
ENV RSA_PRIVATE_KEY none
ENV PORT 3000

# Bundle app source
COPY . .

# Bundle app dependencies
COPY --from=builder --chown=node:node app/node_modules node_modules

EXPOSE $PORT

USER node

CMD [ "npm", "start" ]
```

Generate an private encryption key:

```bash
ssh-keygen -m PEM -t rsa -b 4096 -C "staticman key" -f .ssh/staticman_key
```

Build and run docker image:

```sh
docker build -t dokku/staticman:latest .
docker run --publish 3000:3000 -e "RSA_PRIVATE_KEY=$(cat .ssh/staticman_key)" dokku/staticman:latest
```
