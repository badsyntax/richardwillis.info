This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Adding Photos

Make sure you have `imagemagick` installed: `brew install imagemagick`

Add photos to the [public/photos/](./public/photos) directory and resize them by running `npm run resize-photos` from the root of the project.

## Adding Blog Entries

Add new entries as markdown files to [blog/](./blog).

## Docker

See https://steveholgado.com/nginx-for-nextjs/ & https://github.com/steveholgado/nextjs-docker-pm2-nginx

Build & run the Node.js image:

```bash
docker build -t badsyntax/richardwillis .
docker run --publish 3000:3000 badsyntax/richardwillis
```

Build & run the Node.js & Nginx images:

```bash
docker-compose up
```

## Dokku

```bash
# on local host
docker build -t dokku/richardwillis:latest .
docker run --publish 3000:3000 dokku/richardwillis:latest
# This does not work as per the docs!
docker save dokku/richardwillis:latest | ssh dokku.proxima-web.com "docker load | dokku tags:deploy richardwillis latest"

# on local host (build and publish the image)
echo $CR_PAT | docker login ghcr.io -u badsyntax --password-stdin
docker build -t ghcr.io/badsyntax/richardwillis:latest .
docker push ghcr.io/badsyntax/richardwillis:latest

# on dokku server
# dokku apps:create richardwillis
# dokku plugin:install https://github.com/dokku/dokku-registry.git registry
# dokku registry:login ghcr.io badsyntax $CR_PAT
# dokku registry:set richardwillis server ghcr.io
# dokku registry:set richardwillis image-repo badsyntax/richardwillis
# dokku registry:pull richardwillis latest
# docker tag badsyntax/richardwillis:latest dokku/richardwillis:latest
# dokku tags:deploy richardwillis latest
# dokku proxy:ports-add richardwillis http:80:3000
# dokku letsencrypt richardwillis

dokku apps:create richardwillis
echo $CR_PAT | docker login ghcr.io -u badsyntax --password-stdin
docker pull ghcr.io/badsyntax/richardwillis:latest
docker tag ghcr.io/badsyntax/richardwillis:latest dokku/richardwillis:latest
dokku tags:deploy richardwillis latest
dokku proxy:ports-add richardwillis http:80:3000
dokku letsencrypt richardwillis

# on dokku server
dokku apps:create richardwillis
dokku proxy:ports-add richardwillis http:80:3000

# on local host
git remote add dokku dokku@dokku.proxima-web.com:richardwillis
git push dokku

# on dokku server
dokku letsencrypt richardwillis
```

# Images

https://d1kawhui9ewore.cloudfront.net/photos/beetle-montserrat.jpg
