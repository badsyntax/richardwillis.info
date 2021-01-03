---
title: 'Deploy a dokku App With a Remote Docker Image'
excerpt: 'How to deploy your app using a remote dokku image.'
date: '2021-01-06T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: false
---

There's a couple ways to deploy your app to dokku. The most common workflow being the heroku style `git push`. This approach is convenient, but means app builds take place on your server. This is perhaps not a problem for most people, but was quite a big problem for me as I'm deploying apps with complicated builds (using webpack) that take long time to complete and require a lot of machine resources (like a LOT of RAM and a decent amount of processing power). These builds ultimately kill my runtime server and my running apps are unresponsive while a build is taking place. Sure, I could throw more RAM and CPU at the problem, but I'm still on a budget and conceptually I don't like the idea of builds taking place on my runtime server.

## Deploy a pre-built App

To prevent building your app on your server you can build it locally and deploy it using the remote image. Unfortunately this breaks the `git push` workflow, but more on that below...

### Deploy Using a Remote Docker Image

This approach involves:

- Building your image locally
- Pushing it to a remote registry
- Log into your server and pull the image from the registry
- Tag the image and deploy using dokku commands

Here's the commands to achieve this:

```bash
# on your local machine
echo $CR_PAT | docker login ghcr.io -u user --password-stdin
docker build -t ghcr.io/user/app:latest .
docker push ghcr.io/use/app:latest

# on your dokku server
dokku apps:create app
echo $CR_PAT | docker login ghcr.io -u user --password-stdin
docker pull ghcr.io/user/app:latest
docker tag ghcr.io/user/app:latest dokku/app:latest
dokku tags:deploy app latest
```

If you want to automate this in CI (using GitHub Actions):

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
          tags: ghcr.io/${{ github.repository }}:latest
  deploy:
    name: Deploy app
    needs: [publish-docker]
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
            docker pull ghcr.io/${{ github.repository }}:latest && \\
            docker tag ghcr.io/${{ github.repository }}:latest dokku/app:latest && \\
            dokku tags:deploy app latest"
```

You'll note we're using the `root` user to pull & tag the docker image. _This is far from ideal._ I'd prefer to use the `dokku` user, but as that user is using `sshcommand` (which sets the default command to be `dokku`), you can't use the dokku user to achieve this.

I don't like this. I want dokku to handle this for me. I created a [GitHub issue](https://github.com/dokku/dokku/issues/4296) and it looks like the dokku maintainers will support this workflow in the future.

### Deploy Using a Remote Docker Image With `git push`

Until dokku supports [remote image deployments with git](https://github.com/dokku/dokku/issues/4296), there is a hacky workaround we can use. This approach is not practical for local deployments but can be used in CI.

Let's use a basic `Dockerfile` as an example:

```dockerfile
FROM node:12.19.0 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm ci
COPY . .
RUN npm run build


FROM nginx

COPY ./nginx /etc/nginx
COPY --from=build /app/build /usr/share/nginx/html
```

This `Dockerfile` shows an example of a complicated build (building a front-end app using webpack etc). Notice the build stages referencing base images (`FROM node:12.19.0` and `FROM nginx`). We can utilise build stages and base images to deploy our pre-built app. All we need to do is build and push the docker image, then create a new Dockerfile that references that remote image as a build image.

For example:

```dockerfile
FROM ghcr.io/user/app:latest
```

If we now add this Dockerfile to the root of our application and `git push`, then docker simply pulls the base image and dokku deploys it. _No builds take place on the server._

As previously mentioned, this is not practical to do locally, but we can achieve this quite easily in CI (using GitHub Actions):

```yaml
name: Deploy
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
          tags: ghcr.io/${{ github.repository }}:latest

  deploy-app:
    needs: [publish-docker]
    name: Deploy app
    runs-on: ubuntu-20.04
    steps:
      - name: Create deploy repo for dokku
        id: deploy_repo
        run: |
          echo "FROM $IMAGE_URL" > Dockerfile
          git init
          git config user.email "user@email.com"
          git config user.name "Your Name"
          git add Dockerfile
          git commit -m "Add Dockerfile"
          commit=$(git rev-parse HEAD 2>/dev/null || true)
          echo ::set-output name=commit_sha::$commit
        env:
          IMAGE_URL: ghcr.io/${{ github.repository_owner }}/app:latest
      - name: Push to dokku
        uses: dokku/github-action@master
        with:
          command: deploy
          git_remote_url: 'ssh://dokku@dokku.me:22/appname'
          ssh_private_key: ${{ secrets.DOKKU_SSH_PRIVATE_KEY }}
          git_push_flags: '--force'
          ci_commit: ${{ steps.deploy_repo.outputs.commit_sha }}
```

You'll note we're creating a fresh git repo to achieve this.

#### Using a Moving Tag

This example uses a moving tag `latest`. While I generally try to avoid using a moving tag, I'm doing this as I have concerns over storage quotas using GitHub Container Registry.

_If you use a moving tag, you need to tell docker to not use cache and to pull the base image when building your app._ If you don't do this, each time you deploy docker will use the previous cached version of `ghcr.io/user/app:latest`. You can set the correct no-cache build args like so:

```bash
dokku docker-options:add app build "--no-cache --pull"
```

Now every-time you deploy, docker will pull down the latest version of the moving tag.

## Conclusion

While the workaround is hacky, it provides the following benefits:

- We're using a supported dokku workflow (`git push`)
- We don't need to use a different Linux user to achieve this
- It allows us to the use the official dokku [GitHub Action](https://github.com/dokku/github-action) (which provides some awesome features like app previews)

Once support for [remote image deployments with git](https://github.com/dokku/dokku/issues/4296) lands we can remove this hacky workaround. Until then, this works for me!
