---
title: 'Linking containers in dokku'
excerpt: 'Some semi-random notes about getting up and running with kubernetes'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

A common requirements of a container orchestration system to allow containers to communicate with each on on a private network.

For example you might have a single database instance and many apps that connect to that instance.

You don't want to expose the database to the public internet, so you create an internal network that containers connect to.

This was tradititionally achieved using docker `--link` via dokku-add-options.
