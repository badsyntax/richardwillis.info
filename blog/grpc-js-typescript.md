---
title: 'gRPC & TypeScript'
excerpt: 'An overview of how to generate TypeScript types for your gRPC protobufs.'
coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/tim.jpeg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

## State of gRPC/Protobuf for Node.js

Traditionally you'd use the Protobuf Compiler to compile your proto definitions into actual JavaScript code that you'd consume in your application. The generated code can be in the form of data models, gRPC service definitions and gRPC client definitions. The generated code uses the `grpc` package at runtime for providing the client and server implementations. The `grpc` server is implemented as a custom c++ server and requires various build tools to allow it to be built and installed correctly. The `google-protobuf` package is used at runtime to construct and (de)serialise Protobuf models.

While this traditional approach works, there are some [portability and maintenance issues](https://github.com/denoland/deno/issues/3326#issuecomment-674428001) with it, and it's effectively deprecated in favour of a pure JavaScript implementation of gRPC. This new package is called `@grpc/grpc-js` and it doesn't require a build/compile step. It loads protobuf files at runtime using the [protobuf.js](https://www.npmjs.com/package/protobufjs) package. (It's also with compatible `google-protobuf` if you prefer to compile your models.) It uses the standard Node.js http2 library for providing the server implementation, so it's a WHOLE lot more portable than `grpc`. One huge benefit of this approach is works without any headaches in embedded Node.js environments like Electron.

No matter which approach you take, if you're using TypeScript and gRPC you'd ideally want to have TypeScript types that describe your Protobuf definitions.

There's two main approaches to achieve this:

1. Use the Proto compiler and 3rd party plugins to generate the types, or
2. Use the `grpc-proto-loader` package (as part of `@grpc/grpc-js`) to generate the types

## Generating TypeScript Types from Protocol Buffer definitions

## Using the Proto compiler

There's two popular proto compiler plugins you can use. They offer different approaches in how they generate the server interface.

### `ts-protoc-gen` Proto Compiler Plugin

```bash
#!/usr/bin/env bash

OUT_DIR="."
TS_OUT_DIR="."
IN_DIR="./proto"
PROTOC="$(npm bin)/grpc_tools_node_protoc"
PROTOC_GEN_TS_PATH="$(npm bin)/protoc-gen-ts"
PROTOC_GEN_GRPC_PATH="$(npm bin)/grpc_tools_node_protoc_plugin"

$PROTOC \
    -I="./" \
    --plugin=protoc-gen-ts=$PROTOC_GEN_TS_PATH \
    --plugin=protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH} \
    --js_out=import_style=commonjs:$OUT_DIR \
    --grpc_out=grpc_js:$OUT_DIR \
    --ts_out=service=grpc-node,mode=grpc-js:$TS_OUT_DIR \
    "$IN_DIR"/*.proto
```


## Background

My journey to exploring how to use gRPC with TypeScript started when I wanted to use `grpc` in my VS Code extension. The `grpc` implementation uses a custom c++ runtime which has to built against a specific environment, and each time VS Code is updated it potentially changes the electron version making the extension incompatible with the updated version of VS Code. It was a huge headache. I outlined the journey in more detail [in this gist](https://gist.github.com/badsyntax/9827722afcb33a4b0e03c809f1aede98), but to summaize `@grpc/grpc-js` was the solution to my problems. It only uses standard Node.js modules (http2)! I discovered some minor bugs before the package came out of beta and the lead grpc-node developer murgatoid was responsive and very willing to accept contributions and engage in discussions. Eventually `@grpc/grpc-js` came out of BETA and `grpc` was deprecated, for these reasons. From my personal experience this was a great move and it's been interesting to follow the development. `@grpc/grpc-js` is entirely written in TypeScript and the code is nice and readable.

The second part to my journey was figuring out how best to generate TypeScript types from the proto files. This was also not a straightforward journey. There wasn't much info about this in the grpc docs and it seemed like there was no standard approach. I noticed others were having similiar difficulties in StackOverflow and GitHub issues. There were different tools available but each had their own shortcommings. For example `ts-protoc-gen` didn't generate the server types, and `grpc_tools_node_protoc_ts` generated a server interface requiring you to use `@ts-ignore` due to mismatching types. I contributed to `ts-protoc-gen` to generate the server types, but also the grpc-js lead developer created a TypeScript generator to the proto-loader package.

If you're using gRPC you'd typically be using Protocol Buffers as a data transport format and schema to define both your services (your rpc method calls) and your data models.
