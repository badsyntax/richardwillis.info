FROM node:16.6.0-alpine as builder

RUN apk add --no-cache python3=3.8.2-r1 make=4.2.1-r2 git=2.24.3-r0

WORKDIR /app

RUN git clone https://github.com/eduardoboucas/staticman.git /app

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV CI true
ENV NODE_ENV production

RUN npm ci --only=production


FROM node:16.6.0-alpine

LABEL maintainer=willis.rh@gmail.com
LABEL org.opencontainers.image.source=https://github.com/badsyntax/richardwillis.info
LABEL org.label-schema.name="richardwillis.info"
LABEL org.label-schema.description="Staticman for Richard Willis"
LABEL org.label-schema.vcs-url="https://github.com/badsyntax/richardwillis.info"
LABEL org.label-schema.vendor="badsyntax"

WORKDIR /app

ENV NODE_ENV production
ENV RSA_PRIVATE_KEY none
ENV PORT 3000

COPY --from=builder --chown=node:node /app /app

EXPOSE 3000

USER node

CMD [ "npm", "start" ]

