---
title: 'Set up a Next.js app'
excerpt: 'An overview of how I created my first Next.js app.'
date: '2020-12-27T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

This post outlines the approach I took to creating my first Next.js app.

## Responsive Images

Next.js offers a useful Image component which provides responsive images by resizing images on the fly. I had difficulty getting it to respect my origin image headers (from Cloudfront) and so my images weren't cached correctly. I also don't want my runtime app storing images locally filling up my disk space and not being cached by the CDN. So I decided to build my own very simple responsive image component which relies on images existing on the CDN.

### Where to Store the Original Images

I don't want to store images in my main code repo as they will quickly take up a lot of space and slow down Git operations. But I also like the idea of storing my photos in Git, and GitHub let's you store [quite a lot of data](https://docs.github.com/en/free-pro-team@latest/github/managing-large-files/what-is-my-disk-quota#file-and-repository-size-limitations) for free. So I store my images and other assets in a separate repo hosted on GitHub.

### Deciding on image sizes

You can use the HTML5 `srcSet` image attribute to provide alternative image sizes which the browser decides to use depending on the device screen width.

I decided to provide support for _4_ breakpoints between _200px_ and _1280px_, and used [https://responsivebreakpoints.com/](https://responsivebreakpoints.com/) to generate the breakpoints.

These are the generated breakpoints:

- 200
- 725
- 1075
- 1280

### Generating and Syncing the Images

The source jpgs must be encoded as `progressive`.

The workflow involves:

- Clone the image repo
- Copy a large source image into the image repo
- Run a script to generate the resized images
- Run a script to sync the images to S3
- Push the image to the image repo
