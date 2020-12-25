FROM node:14.15.3-alpine AS builder

LABEL maintainer=willis.rh@gmail.com

WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV CI true

COPY package.json package-lock.json ./

RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production


FROM node:14.15.3-alpine

LABEL maintainer=willis.rh@gmail.com

LABEL org.opencontainers.image.source https://github.com/badsyntax/richardwillis.info \
  org.label-schema.name="richardwillis.info" \
  org.label-schema.description="Personal site of Richard Willis" \
  org.label-schema.vcs-url="https://github.com/badsyntax/richardwillis.info" \
  org.label-schema.usage="README.md" \
  org.label-schema.vendor="badsyntax"

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 3000

WORKDIR /app

COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/next.config.js /app/next.config.js
COPY --from=builder /app/public /app/public

EXPOSE 3000

RUN ls

RUN ls .next/

USER node

CMD ["node_modules/.bin/pm2-runtime", "node_modules/.bin/next", "--", "start"]
