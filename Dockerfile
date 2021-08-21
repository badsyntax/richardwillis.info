FROM node:16.7.0-alpine as base

FROM base AS deps

WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV CI true

COPY package.json package-lock.json ./

RUN npm ci

FROM base AS builder

WORKDIR /app

ARG APP_VERSION
ARG ASSET_PREFIX
ARG STRAPI_ENDPOINT

ENV APP_VERSION $APP_VERSION
ENV ASSET_PREFIX $ASSET_PREFIX
ENV STRAPI_ENDPOINT $STRAPI_ENDPOINT

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_UPDATE_NOTIFIER false
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV CI true

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules ./node_modules

RUN echo "$APP_VERSION" > VERSION
RUN NODE_ENV=production npm run build
RUN npm prune --production


FROM base

LABEL maintainer=willis.rh@gmail.com
LABEL org.opencontainers.image.source=https://github.com/badsyntax/richardwillis.info
LABEL org.label-schema.name="richardwillis.info"
LABEL org.label-schema.description="Personal site of Richard Willis"
LABEL org.label-schema.vcs-url="https://github.com/badsyntax/richardwillis.info"
LABEL org.label-schema.usage="README.md"
LABEL org.label-schema.vendor="badsyntax"

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_UPDATE_NOTIFIER false
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false

ENV NODE_ENV production
ENV PORT 3000
ENV APP_HOME /app

RUN mkdir -p $APP_HOME && chown -R node:node $APP_HOME
WORKDIR $APP_HOME

COPY --from=deps --chown=node:node $APP_HOME/package.json $APP_HOME/package.json
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node $APP_HOME/.next $APP_HOME/.next
COPY --from=builder --chown=node:node $APP_HOME/next.config.js $APP_HOME/next.config.js
COPY --from=builder --chown=node:node $APP_HOME/public $APP_HOME/public
COPY --from=builder --chown=node:node $APP_HOME/VERSION $APP_HOME/VERSION

USER node

CMD ["npm", "start"]
