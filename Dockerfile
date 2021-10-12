FROM node:16.11.0-alpine as base

FROM base AS deps

WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV NPM_CONFIG_UPDATE_NOTIFIER false
ENV CI true

COPY package.json package-lock.json ./

RUN npm ci

FROM base AS builder

WORKDIR /app

ARG ASSET_PREFIX
ARG STRAPI_ENDPOINT

ENV ASSET_PREFIX $ASSET_PREFIX
ENV STRAPI_ENDPOINT $STRAPI_ENDPOINT

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV NPM_CONFIG_UPDATE_NOTIFIER false

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules ./node_modules

RUN NODE_ENV=production npm run build && \
    npm prune --production

# hadolint ignore=DL3007
FROM ghcr.io/badsyntax/base-nginx:latest

LABEL maintainer=willis.rh@gmail.com
LABEL org.opencontainers.image.source=https://github.com/badsyntax/richardwillis.info
LABEL org.label-schema.name="richardwillis.info"
LABEL org.label-schema.description="Personal site of Richard Willis"
LABEL org.label-schema.vcs-url="https://github.com/badsyntax/richardwillis.info"
LABEL org.label-schema.usage="README.md"
LABEL org.label-schema.vendor="badsyntax"

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/out /usr/share/nginx/html
COPY ./nginx /etc/nginx
