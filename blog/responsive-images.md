---
title: 'Responsive Images'
excerpt: 'How to use the picture HTML element to provide responsive images.'
date: '2020-12-28T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: false
---

Part of delivering a great user experience involves providing optimised images depending on screen sizes and image format support. This can be achieved using a technique called "[responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)".

Responsive images uses a combination of HTML5 image elements &amp; attributes, including:

- The `<img>` [`sizes`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes) attribute
- The `<img>` [`srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset) attribute
- The [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) element
- The [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source) element and relevant `<source>` attributes

## Image Sizes

For simplicity's sake, I like to align my image sizes with my CSS breakpoints:

- 420px
- 640px
- 768px
- 1024px
- 1280px

## Image Formats

As [suggested by Google](https://web.dev/uses-webp-images/), it's a good idea to provide `WebP` versions of your images as it provides better compression and thus a smaller file size. The problem is not all browsers support it, so we need to provide fallback traditional formats (like `jpg` & `png`).

## Building the Markup

### Defining the Sizes

If we want to just provide alternative sizes without providing alternative formats, we can use `<img>` `sizes` and `srset` attributes.

```html
<img
  src="/photos/image-1280.jpg"
  srcset="
    /photos/image-420.jpg   420w,
    /photos/image-640.jpg   640w,
    /photos/image-768.jpg   768w,
    /photos/image-1024.jpg 1024w,
    /photos/image-1280.jpg 1280w
  "
  sizes="(max-width: 420px) 420px,
    (max-width: 640px)      640px,
    (max-width: 768px)      768px,
    (max-width: 1024px)     1024px,
    1280px"
/>
```

- The `srcset` attribute defines the set of images we will allow the browser to choose between, and what size each image is.
- The `sizes` attribute defines a set of media conditions (e.g. screen widths) and indicates what image size would be best to choose, when certain media conditions are true. The last value `1280px` is the default width when none of the media queries match.

### Defining the Sizes & Supported Formats

If we want to combine image sizes with image formats, we have to use the `<source>` &amp; `<picture>` elements:

```html
<picture>
  <!-- The browser will pick the first supported image type -->
  <source
    type="image/webp"
    sizes="(max-width: 420px) 420px,
      (max-width: 640px)      640px,
      (max-width: 768px)      768px,
      (max-width: 1024px)     1024px,
      1280px"
    srcset="
      /photos/image-420.webp   420w,
      /photos/image-640.webp   640w,
      /photos/image-768.webp   768w,
      /photos/image-1024.webp 1024w,
      /photos/image-1280.webp 1280w
    "
  />
  <source
    type="image/jpg"
    sizes="(max-width: 420px) 420px,
      (max-width: 640px)      640px,
      (max-width: 768px)      768px,
      (max-width: 1024px)     1024px,
      1280px"
    srcset="
      /photos/image-420.jpg   420w,
      /photos/image-640.jpg   640w,
      /photos/image-768.jpg   768w,
      /photos/image-1024.jpg 1024w,
      /photos/image-1280.jpg 1280w
    "
  />
  <img src="/photos/image-1280.jpg" />
</picture>
```

As you can see `<source>` also supports `sizes` and `srcset` attributes.

## Hosting the Images

Images like photos (and other large assets) generally should be hosted outside of your main application.

Amazon S3 (Simple Storage Service) is a good place to host them and gives you some useful benefits:

- It's really quite cheap. You can store a lot of images without massive financial risk.
- It can be connected to the CloudFront CDN to cache your images on the Edge.

Refer to [Set up S3 & CloudFront](/blog/setup-s3-cloudfront-cdn) for more information on setting this up.

## Generating the Images

Some cloud CDN providers provide image resizing capabilities "on the fly", meaning you don't need to manually resize images yourself. You can achieve this Cloudfront & S3 but it increases cost fairly significantly due to usage of a Lambda function.

I instead opted for manually resizing the images and syncing them to S3 with CI/CD (Github Actions).

### Generation Goals

- Generate resized images matching the breakpoints decided above
- Generate `webp` versions of all resized images
- Encode `jpg`'s as `progressive`

### Generation Script

Imagemagick is used to resize the images, adjust the quality and convert them to `webp`.

This is the bash script I use:

```bash
#!/usr/bin/env bash

IMAGE="$1"
SIZES=("420" "640" "768" "1024" "1280")
FILENAME=$(basename -- "$IMAGE")
EXTENSION="${FILENAME##*.}"

log_info_main() {
  local MESSAGE=$1
  echo "--> $MESSAGE"
}

log_info() {
  local MESSAGE=$1
  echo "----> $MESSAGE"
}

log_error() {
  local MESSAGE=$1
  echo "!! $MESSAGE"
}

if [[ "$EXTENSION" == "jpg" ]]; then
  log_info_main "Generating images for $IMAGE"
  for size in "${SIZES[@]}"; do
    convert "$IMAGE" \
      -resize "$size" \
      -interlace Plane \
      -quality 85 \
      -strip \
      -set filename:t '%d/resized/%t'"-$size" '%[filename:t].jpg'
    log_info "Generated resized jpg for $size"
    convert "$IMAGE" \
      -resize "$size" \
      -quality 85 \
      -strip \
      -set filename:t '%d/resized/%t'"-$size" '%[filename:t].webp'
    log_info "Generated resized webp for $size"
  done
  log_info_main "All Done!"
else
  log_error "Not a jpg image"
  exit 1
fi
```

Notes:

- `-interlace Plane` is used on `jpg` images to encode them as `progressive`
- All exif metadata is stripped

### GitHub Workflow

This is the GitHub Action workflow I use:

```yaml
name: Sync images to S3

on:
  pull_request:
    branches: [master]

jobs:
  lint:
    runs-on: ubuntu-20.04
    name: Resize and Sync
    steps:
      - uses: actions/checkout@v2.3.4
        with:
          fetch-depth: 1
      - id: files
        uses: jitterbit/get-changed-files@v1
      - name: Add webp mime type
        run: echo "image/webp       webp" | sudo tee -a /etc/mime.types
      - name: Generate responsive images
        run: |
          mkdir -p photos/resized
          for changed_file in ${{ steps.files.outputs.added_modified }}; do
            filename=$(basename -- "$changed_file")
            extension="${filename##*.}"
            if [[ "$extension" == "jpg" ]]; then
              scripts/generate-responsive-image.sh "$changed_file"
            fi
          done
      - name: Sync photos to S3
        run: |

          if [ -z "$AWS_REGION" ]; then
            AWS_REGION="us-east-1"
          fi
          if [ -n "$AWS_S3_ENDPOINT" ]; then
            ENDPOINT_APPEND="--endpoint-url $AWS_S3_ENDPOINT"
          fi

          # Create a dedicated profile for this action to avoid conflicts
          # with past/future actions.
          # https://github.com/jakejarvis/s3-sync-action/issues/1
          aws configure --profile s3-sync-action <<-EOF > /dev/null 2>&1
          ${AWS_ACCESS_KEY_ID}
          ${AWS_SECRET_ACCESS_KEY}
          ${AWS_REGION}
          text
          EOF

          # Sync using our dedicated profile and suppress verbose messages.
          sh -c "aws s3 sync ${SOURCE_DIR:-.} s3://${AWS_S3_BUCKET}/${DEST_DIR} \
                        --profile s3-sync-action \
                        --no-progress \
                        ${ENDPOINT_APPEND} ${SYNC_ARGS}"

          # Clear out credentials after we're done.
          # We need to re-run `aws configure` with bogus input instead of
          # deleting ~/.aws in case there are other credentials living there.
          # https://forums.aws.amazon.com/thread.jspa?threadID=148833
          aws configure --profile s3-sync-action <<-EOF > /dev/null 2>&1
          null
          null
          null
          text
          EOF
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'us-east-1'
          SOURCE_DIR: 'photos'
          DEST_DIR: 'photos'
          SYNC_ARGS: '--cache-control public,max-age=31536000,immutable --size-only'
```

This requires the following secrets to be set:

- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Other notes:

- The Ubuntu Runner comes with `imagemagick` and `aws` pre-installed
- I explicitly add the `webp` type to `/etc/mime.types`, to allow the `aws` utility to correctly set the `Content-Type` as `image/webp` when syncing to S3
- A long TTL of 1 year is set
- `--size-only` is used to only sync changed files

## User Workflow

1. User adds a new source image to the repo and send a pull request
2. The GitHub workflow above is triggered
3. GitHub Actions will process the added or modified images and sync them to S3
4. User merges the image/s into master

## Example Repo

Refer to [https://github.com/badsyntax/assets.richardwillis.info](https://github.com/badsyntax/assets.richardwillis.info) for a complete working solution.
