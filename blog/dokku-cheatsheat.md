---
title: 'Dokku cheatsheet'
excerpt: 'Some semi-random notes about getting up and running with kubernetes'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

Deploy an app:

```bash
dokku tags:deploy APP_NAME VERSION
```

For example:

```bash
dokku tags:deploy my-app latest
```

Re-deploy an app:

```bash
dokku ps:restart APP_NAME
```
