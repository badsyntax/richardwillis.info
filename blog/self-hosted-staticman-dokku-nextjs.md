---
title: 'Self-hosted staticman With Dokku and Next.js'
excerpt: 'How to deploy a self-hosted staticman instance to your dokku server & integrate it into your Next.js project.'
date: '2021-01-03T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: false
---

[Staticman](https://staticman.net/) is a service that provides static file user-generated content (as `yaml` or `json` files) to your project via GitHub pull requests.

`Staticman` doesn't provide any front-end implementation, it just validates requests (eg to prevent spam) and creates pull requests. It's mainly targetted towards static website build systems (eg hugo/jekyll/gatsby/nextjs etc) which already have a build process in place, but it's entirely up to you to integrate it into your project. One obvious big benefit of this approach is you have absolute control over the front-end, and don't need to load any 3rd party JavaScript or CSS.

You can use the [hosted version](https://staticman.net/docs/getting-started.html) or self-host it yourself. I decided to self-host as it's really not a large project and was easy to setup. I can also then monitor and optmise the service better.

## Create the self-hosted staticman service

### Set up GitHub

`staticman` requires a GitHub Personal Access Token to allow it to interact with the GitHub API on behalf of a user. You can use your own user account or create a new GitHub user (a "bot" account). The downside to using your own user account is you won't get any GitHub notifications, so I opted to use a bot account.

The token should include permissions to manage the repo and read from user. The bot user account should be invited to your project with read/write permissions.

### Configure `staticman`

`staticman` will look for a file called `staticman.yml` in the repo of your repo. **This file needs to be exist before the service will work.**

Here's an example of a basic `staticman.yml` file:

```yaml
comments:
  name: 'My Awesome Website'
  path: 'blog/comments'
  requiredFields: ['name', 'slug', 'message']
  allowedFields: ['name', 'slug', 'message']
  branch: master
  commitMessage: 'Add new blog comment'
  filename: '{fields.slug}/entry{@timestamp}'
  format: 'yaml'
  generatedFields:
    date:
      type: date
      options:
        format: 'timestamp'
  moderation: true
  pullRequestBody: "A new comment has been added. :tada:\n\nMerge the pull request to accept it, or close it to send it away.\n\n---\n"
  reCaptcha:
    enabled: false
```

Refer the [`staticman` configuration page](https://staticman.net/docs/configuration) for more information about the config.

### Create the `staticman` docker Image

Before we can create the dokku app we need to create the docker image. (At the time of writing `staticman` does not distribute a docker image.)

Here's an example `Dockerfile` that uses a multi-stage build to clone `staticman` and install Node.js dependencies:

```dockerfile
FROM node:14.15.3-alpine as builder

RUN apk add --no-cache python3 make git

WORKDIR /app

RUN git clone https://github.com/eduardoboucas/staticman.git /app

ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_FUND false
ENV NPM_CONFIG_AUDIT false
ENV CI true
ENV NODE_ENV production

RUN npm ci --only=production


FROM node:14.15.3-alpine

WORKDIR /app

ENV RSA_PRIVATE_KEY ""
ENV GITHUB_TOKEN ""
ENV PORT 3000
ENV NODE_ENV production

COPY --from=builder --chown=node:node /app /app

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
```

You can test this by building and running the image locally:

```bash
# Create a private key with an empty passphrase
ssh-keygen -m PEM -t rsa -b 4096 -C "staticman key" -f ~/.ssh/staticman -q -N ""
docker build -t dokku/staticman:latest .
docker run --publish 3000:3000 -e "RSA_PRIVATE_KEY=$(cat ~/.ssh/staticman_key)" dokku/staticman:latest
```

### Deploy docker Image to dokku Server

You can build directly on the dokku server, which means you need to store the Dockerfile somewhere on your server:

```bash
docker build -t dokku/staticman:latest .
```

Or build locally and push to the Github Container Registry:

```bash
# on local machine
docker build -t ghcr.io/GITHUB_USER/staticman:latest .
docker push ghcr.io/GITHUB_USER/staticman:latest

# on dokku server
docker pull ghcr.io/GITHUB_USER/staticman:latest
docker tag ghcr.io/GITHUB_USER/staticman:latest dokku/staticman:latest
```

### Create & Deploy the dokku App

Now that our docker image is ready and tagged as `dokku/staticman:latest`, we can create the dokku app and deploy it.

```bash
dokku apps:create staticman
dokku proxy:ports-add staticman http:80:3000

# Create a private key with an empty passphrase
ssh-keygen -m PEM -t rsa -b 4096 -C "staticman key" -f ~/.ssh/staticman -q -N ""

dokku config:set --encoded --no-restart staticman RSA_PRIVATE_KEY="$(base64 ~/.ssh/staticman)"
dokku config:set staticman --no-restart GITHUB_TOKEN=YOUR_GITHUB_TOKEN PORT=3000

dokku tags:deploy staticman latest
dokku domains:add staticman staticman.example.com
dokku letsencrypt staticman
dokku proxy:ports-remove staticman http:3000:3000
```

### Testing the Service With curl

```bash
curl 'https://staticman.example.com/v2/entry/GITHUB_USER/GITHUB_REPO/master/comments' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-raw 'fields%5Bslug%5D=slug&fields%5Bname%5D=Richard&fields%5Bmessage%5D=This+is+a+test+comment.'
```

If all goes well you should see:

```shell-session
{"success":true,"fields":{"slug":"slug","name":"Richard","message":"This is a test comment.","date":1609671959932}}
```

---

## Integrate staticman Into Your Next.js Project

At a high-level you need to:

- Read and parse the static markdown files and provide this data to the page component
- Render a list of comments
- Render a `html` form that either `post`'s or sends a `xhr`/`fetch` request to the `staticman` endpoint

The following assumes you have already built a blog system into your Next.js project. (View this [example blog starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) to see how to set that up.)

### Read & Parse the Comment yaml Files

Here's an example blog api witten in `TypeScript` that uses `remark` & `rehype` to parse the markdown blog posts, and `js-yaml` to parse the blog comments:

```ts
import fs from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';
import matter from 'gray-matter';
import { VFileCompatible } from 'vfile';
import unified from 'unified';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';

const postsDirectory = join(process.cwd(), 'blog');
const commentsDirectory = join(postsDirectory, 'comments');

export interface Author {
  name: string;
  picture: string;
}

export interface PostComment {
  _id: string;
  name: string;
  date: number;
  message: string;
  slug: string;
  messageHtml?: string;
}

export interface Post {
  slug: string;
  title: string;
  author: Author;
  date: string;
  content: string;
  excerpt: string;
  draft: boolean;
  comments: PostComment[];
}

export const markdownToHtml = (markdown: VFileCompatible): string => {
  const result = unified()
    .use(parse)
    .use(remark2rehype)
    .use(html)
    .processSync(markdown);
  return result.toString();
};

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter(
      (file: string) => !fs.lstatSync(join(postsDirectory, file)).isDirectory()
    );
}

export function getComments(slug: string): PostComment[] {
  const rootDir = join(commentsDirectory, slug);
  if (!fs.existsSync(rootDir)) {
    return [];
  }
  return fs
    .readdirSync(rootDir)
    .map<PostComment | null>((fileName: string) => {
      const filePath = join(rootDir, fileName);
      try {
        return yaml.load(fs.readFileSync(filePath, 'utf8')) as PostComment;
      } catch (e) {
        console.error(`Error parsing blog comment ${filePath}: ${e.message}`);
        return null;
      }
    })
    .filter((comment) => comment !== null)
    .map((comment) => {
      return {
        ...comment,
        messageHtml: markdownToHtml(comment.message),
      };
    });
}

export function getPostBySlug(slug: string, fields = []): Post {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const getData = (key: string): Post[keyof Post] => {
    switch (key) {
      case 'slug':
        return realSlug;
      case 'content':
        return content;
      case 'contentHtml':
        return markdownToHtml(content);
      case 'comments':
        return getComments(realSlug);
      default:
        return data[key];
    }
  };

  const post = fields.reduce(
    (acc: Record<string, Post[keyof Post]>, field: string) => ({
      ...acc,
      [field]: getData(field),
    }),
    {}
  );

  return post;
}

export function getAllPosts(fields = []): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug: string) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
```

Here's an example blog post page (called `[slug.tsx]`) that renders a single post with comments:

```tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getPostBySlug } from '../../features/blog/api';

// You need to create this yourself. It's a React component that renders
// the blog post and comment form.
export { PostPage as default } from '../../features/blog/PostPage/PostPage';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (Array.isArray(params.slug)) {
    return null;
  }

  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'contentHtml',
    'comments',
    'excerpt',
  ]);

  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};
```

### Rendering the Comment Form

Here's an example of a comment form (written in `TypeScript`) that posts the comment to the `staticman` endpoint via `fetch`:

```tsx
import React, { useState } from 'react';

const staticManRepo = 'GITHUB_USER/GITHUB_REPO';
const staticManEndpoint = 'https://staticman.example.com';

const postComment = (comment: FormData): Promise<Response> => {
  const url = `${staticManEndpoint}/v2/entry/${staticManRepo}/master/comments`;
  const searchParams = new URLSearchParams(comment as any);
  return fetch(url, {
    body: searchParams,
    method: 'POST',
    keepalive: true,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  });
};

export interface AddCommentFormProps {
  slug: string;
}

export const AddCommentForm: React.FunctionComponent<AddCommentFormProps> = ({
  slug,
}) => {
  const [postError, setPostError] = useState<string>(null);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostError(null);
    setIsPosting(true);
    setPostSuccess(false);
    const formData = new FormData(e.target as HTMLFormElement);
    postComment(formData)
      .then(
        () => {
          setPostSuccess(true);
        },
        (e) => {
          setPostSuccess(false);
          setPostError(e.message);
        }
      )
      .finally(() => {
        setIsPosting(false);
      });
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <input type="hidden" name="fields[slug]" value={slug} />
      <div>
        <label htmlFor="comment-name">Your name</label>
        <input
          id="comment-name"
          name="fields[name]"
          type="text"
          required
          disabled={isPosting}
        />
      </div>
      <div>
        <label htmlFor="comment-text">Your comment</label>
        <textarea
          id="comment-text"
          name="fields[message]"
          required
          rows={3}
          disabled={isPosting}
        />
      </div>
      {postError && (
        <div>There was an error saving your comment. Please try again.</div>
      )}
      {postSuccess && (
        <div>Your comment was successfully saved and is awaiting approval.</div>
      )}
      <button type="submit" disabled={isPosting}>
        Post Comment
      </button>
    </form>
  );
};
```

## Demo

Have a look at the bottom of the page 👇. Feel free to add a comment to test it.

## Conclusion

I'm really happy with this solution. I don't need to load any 3rd-party JavaScript or css so it doesn't add any bloat to my app, and I have complete control over the UI. I also like that comments are stored in the repo, there's absolutely no funky tracking business going on, and no user authentication is required to post comments. All of this adds up to a nice commenting user experience.
