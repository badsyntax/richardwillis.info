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

LABEL org.label-schema.name="richardwillis.info" \
  org.label-schema.description="Personal site of Richard Willis" \
  org.label-schema.vcs-url="https://github.com/badsyntax/richardwillis.info" \
  org.label-schema.usage="README.md" \
  org.label-schema.vendor="badsyntax"

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 3000

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY public public

RUN npm install pm2 -g

EXPOSE 3000

USER node

CMD ["pm2-runtime", "./node_modules/.bin/next", "--", "start"]
