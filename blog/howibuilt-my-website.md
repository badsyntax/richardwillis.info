---
title: 'How I Built This Website'
excerpt: 'Some semi-random notes about getting up and running with kubernetes'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

Checklist

- [x] http/2 support on all requests
  - [x] requests from nodejs
  - [x] requests from CDN (CloudFront)
- [x] Immutable assets served from CDN (js,css,images etc)
  - [x] Correct cache headers on immutable assets
  - [x] Correct CORS headers on immutable assets
- [x] robots.txt
- [x] favicon.ico
- [x] Automated & versioned deployments
  - [x] Immutable assets uploaded to S3
  - [ ] Tests (layout & functional)
  - [x] App previews on pull request
- [x] Monitoring
  - [x] Runtime server metrics
  - [x] Client metrics (including web-vitals)
  - [x] Docker container metrics
  - [x] Host server metrics
  - [x] Graphs UI
- [ ] Logs
  - [ ] Indexed in elasticsearch
  - [ ] Log viewing UI
- [x] Responsive images
- [ ] Budgets added (see web.dev & lighthouse)
- [ ] Sub-100ms response times for server side responses
