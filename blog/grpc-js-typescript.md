# gRPC & TypeScript

gRPC allows (and recommends) you to use Protocol Buffers as a data transport format. Protobuf is cool as it gives you a strict data transfer schema instead of passing "arbitrary" messages over HTTP that you hope the client and server will understand. There are of-course other ways to enforce HTTP message types but Protobuf is a generic solution that works across different languages and codebases as well as having other benefits. If you're using gRPC you'll likely be using Protobuf to define both your services (your rpc method calls) and your data models.

## State of gRPC/Protobuf for Node.js

Traditionally you'd use the Protobuf Compiler to compile the proto definitions into actual JavaScript code that you'd consume in your application. The generated code can be in the form of data models, gRPC service definitions and gRPC client definitions. The generated code uses the `grpc` package for providing the client and server implementations. The server is implemented as a custom c++ server and requires various build tools to allow it to be built and installed correctly. The `google-protobuf` package is used at runtime to create data model classes with getters, setters and (de)serialization methods.

While this traditional approach works, it's effectively deprecated in favour of a pure JavaScript implementation of gRPC. This new package is called `@grpc/grpc-js`. The [protobuf.js](https://www.npmjs.com/package/protobufjs) package is used for runtime consumption of Protobuf files so there's no compile step required, but it's also with compatible `google-protobuf` if you prefer to compile your models. It uses the standard Node.js http2 libraries for providing the server implementation, so it's a WHOLE lot more portable than `grpc`. One huge benefit of this approach is works without any headaches in embedded Node.js environments like Electron.

No matter which approach you take, if you're using TypeScript you'd ideally want to have TypeScript types that describe your Protobuf definitions.

You can use the Proto compiler and 3rd party plugins to generate the types, or you can use the `grpc-proto-loader` package (as part of `@grpc/grpc-js`) to generate the types.

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
