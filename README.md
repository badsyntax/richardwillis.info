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
# on local host (build and publish the image)
echo $CR_PAT | docker login ghcr.io -u badsyntax --password-stdin
docker build -t ghcr.io/badsyntax/richardwillis:latest .
docker push ghcr.io/badsyntax/richardwillis:latest
docker run --publish 3000:3000 ghcr.io/badsyntax/richardwillis:latest

# on dokku server
dokku apps:create richardwillis
dokku proxy:ports-add richardwillis http:80:3000
echo $CR_PAT | docker login ghcr.io -u badsyntax --password-stdin
docker pull ghcr.io/badsyntax/richardwillis:latest
docker tag ghcr.io/badsyntax/richardwillis:latest dokku/richardwillis:latest
dokku tags:deploy richardwillis latest
dokku proxy:ports-add richardwillis http:80:3000
dokku letsencrypt richardwillis

# on local host
git remote add dokku dokku@dokku.proxima-web.com:richardwillis
git push dokku
```

# Images

## Setting up S3 & CloudFront

Create a new AWS stack by uploading one of the files in [cloudformation/](./cloudformation).

The stack includes an s3 bucket for storage and a cloudfront distribution for global distribution of static assets (CDN).

Once the stack is created, it can take some time before Cloudfront can serve assets. You might get `307` redirects. In this case you just need to wait longer, or try disabling and re-enabling the distribution in the AWS UI.

## Setting correct cache headers

```console
Cache-Control: public,max-age=31536000,immutable
```

https://d38u3zebjo2rjn.cloudfront.net/photos/beetle-montserrat.jpg
https://assets.richardwillis.info/photos/beetle-montserrat.jpg
