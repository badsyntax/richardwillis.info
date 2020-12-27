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

### Generating and Syncing the Images

The workflow involves:

- Clone the image repo
- Copy a large source image into the image repo
- Run a script to generate the resized images
- Run a script to sync the images to S3
- Push the image to the image repo
