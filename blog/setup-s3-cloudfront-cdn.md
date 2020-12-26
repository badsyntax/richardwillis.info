---
title: 'Setup CloudFront & S3'
excerpt: 'An overview of how to setup S3 & CloudFront'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: false
---

This posts describes how to:

- Setup CloudFront & S3 in AWS
- Setup an Alternate domain with TLS

## Setup CloudFront & S3

It can be a little complex to get CloudFront and S3 configured correctly. The correct CORS configuration is required as you'll be serving your assets on a different domain to your main site, and the assets need to be "given permission" to work on specified origin domains.

My initial attempt at this resulted in my assets being too aggressively cached, and they would not load via `fetch` as the CORS headers (or lack thereof) were cached by CloudFront. It's thus important to configure the caching policy correctly to ensure cache is invalidated when changing the Origin header.

The second caching issue I had was browser cache. When the browser first requests an asset, it won't add the Origin header as it's using a link/script element. The browser will cache the response, and use the cache for subsequent requests. This is because CloudFront and S3 [doesn't send the `Vary: Origin` header](https://stackoverflow.com/questions/31732533/s3-cors-always-send-vary-origin). If you're using `cURL` to test this, you won't see the issue. The issue is only obvious in the browser due to how it caches responses. This results in a AJAX/fetch failing when attempting to access the asset the second time.

After a lot trial and error I managed to create a working cloudformation template.

The following template creates the following resources:

- An S3 bucket with CORS configured for a list of allowed origins.
- A CloudFront OriginAccessIdentity that allows CloudFront to read from S3.
- A CloudFront caching policy with the correct CORS configuration.
- A CloudFront distribution that uses the S3 bucket as origin source.

```yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'CloudFront distribution with an S3 origin'

Parameters:
  S3BucketName:
    Type: String
    Default: assets.example.com
    Description: Name of S3 bucket to create
  S3AllowedOrigins:
    Type: CommaDelimitedList
    Default: https://example.com, https://assets.example.com
    Description: A list of allowed domains to request resources from CloudFront

Resources:
  S3Bucket:
    Type: 'AWS::S3::Bucket'
    DeletionPolicy: 'Delete'
    Metadata:
      Comment: 'Bucket to store all assets to be served over the CDN'
    Properties:
      AccessControl: 'Private'
      BucketName: !Ref S3BucketName
      CorsConfiguration:
        CorsRules:
          - AllowedOrigins: !Ref S3AllowedOrigins
            AllowedMethods:
              - GET
              - HEAD
            AllowedHeaders:
              - '*'

  S3BucketPolicy:
    Type: 'AWS::S3::BucketPolicy'
    Metadata:
      Comment: 'Bucket policy to allow cloudfront to access the data'
    Properties:
      Bucket: !Ref S3Bucket
      PolicyDocument:
        Statement:
          - Action:
              - 's3:GetObject'
            Effect: 'Allow'
            Principal:
              CanonicalUser: !GetAtt CfOriginAccessIdentity.S3CanonicalUserId
            Resource:
              - !Sub 'arn:aws:s3:::${S3BucketName}/*'

  CfStaticCachePolicy:
    Type: 'AWS::CloudFront::CachePolicy'
    Metadata:
      Comment: 'The cache policy for Next.js static assets'
    Properties:
      CachePolicyConfig:
        DefaultTTL: 31536000
        MaxTTL: 31536000
        MinTTL: 31536000
        Name: 'static-assets-cache-policy'
        ParametersInCacheKeyAndForwardedToOrigin:
          EnableAcceptEncodingGzip: true
          EnableAcceptEncodingBrotli: true
          CookiesConfig:
            CookieBehavior: none
          QueryStringsConfig:
            QueryStringBehavior: none
          HeadersConfig:
            HeaderBehavior: whitelist
            Headers:
              - Access-Control-Request-Headers
              - Access-Control-Request-Method
              - Origin

  CfDistribution:
    Type: 'AWS::CloudFront::Distribution'
    Metadata:
      Comment: 'A CloudFront distribution with an S3 origin'
    Properties:
      DistributionConfig:
        Comment: 'CDN for all static assets'
        CacheBehaviors:
          - CachePolicyId: !Ref CfStaticCachePolicy
            PathPattern: '/_next/*'
            AllowedMethods:
              - 'HEAD'
              - 'GET'
            CachedMethods:
              - 'HEAD'
              - 'GET'
            Compress: true
            ForwardedValues:
              Cookies:
                Forward: 'none'
              Headers:
                - 'Origin'
              QueryString: false
            DefaultTTL: 31536000
            MaxTTL: 31536000
            MinTTL: 31536000
            TargetOriginId: !Sub 's3-origin-${S3Bucket}'
            ViewerProtocolPolicy: 'redirect-to-https'
        DefaultCacheBehavior:
          AllowedMethods:
            - 'HEAD'
            - 'GET'
          CachedMethods:
            - 'HEAD'
            - 'GET'
          Compress: false
          ForwardedValues:
            Cookies:
              Forward: 'none'
            Headers:
              - 'Origin'
            QueryString: false
          DefaultTTL: 31536000
          MaxTTL: 31536000
          MinTTL: 31536000
          TargetOriginId: !Sub 's3-origin-${S3Bucket}'
          ViewerProtocolPolicy: 'redirect-to-https'
        DefaultRootObject: 'index.html'
        Enabled: true
        HttpVersion: 'http1.1'
        IPV6Enabled: false
        Origins:
          - DomainName: !GetAtt S3Bucket.DomainName
            Id: !Sub 's3-origin-${S3Bucket}'
            OriginPath: ''
            S3OriginConfig:
              OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/${CfOriginAccessIdentity}'
        PriceClass: 'PriceClass_All'

  CfOriginAccessIdentity:
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity'
    Metadata:
      Comment: 'Access S3 bucket content only through CloudFront'
    Properties:
      CloudFrontOriginAccessIdentityConfig:
        Comment: 'Access S3 bucket content only through CloudFront'

Outputs:
  S3BucketName:
    Description: 'Bucket name'
    Value: !Ref S3Bucket
  CfDistributionId:
    Description: 'Id for our cloudfront distribution'
    Value: !Ref CfDistribution
  CfDistributionDomainName:
    Description: 'Domain name for our cloudfront distribution'
    Value: !GetAtt CfDistribution.DomainName
```

Note the following:

- The SSL certificate and Alternate domain name are not automatically set (see below).
- The bucket is created in the region you used when creating the cloudformation stack.

## Allowing access to S3 bucket from CloudFront

By default the S3 bucket will not be public, and we want to keep it that way, but we need to explicitly allow CloudFront to access the files.

An "Origin Access Identity" resource is created as part of the above stack, but you need to manually edit the distribution to assign the identity. You can do this by editing the Origin for the distribution in the AWS UI.

1. Edit the CloudFront distribution
2. Select "Restrict Bucket Access"
3. Select "Use an Existing Identity"
4. Select the "Access S3 bucket content only through CloudFront" identity
5. For "Grant Read Permissions on Bucket", I set "No, I Will Update Permissions" (but I didn't need to adjust the permissions).

## Setting the root domain and certificate

1. Edit the CloudFront distribution and add your root domain to the Alternate Domain Names (CNAMEs) field.
2. Select "Custom SSL Certificate (example.com):".
3. Click on "Request or Import a Certificate with ACM"
4. Check your AWS console region is `us-east-1` . This is important as CloudFront can only use certificates from `us-east-1`.
5. Follow the wizard to create a new certificate and edit your domain DNS to point a CNAME entry to your CloudFront domain
6. Wait for the verification to complete
7. Copy the certficate ARN.
8. Return to editing the CloudFront distribution and paste the certificate ARN.
9. Click save

Now you should be able to send a request to your CDN url:

```bash
curl -I https://assets.example.com/image.jpg
```

You might be `HTTP/1.1 307 Temporary Redirect` when attempting to GET the CloudFront URL. This is due to domain propagation when the bucket is created in any region that isn't `us-east-1`. To resolve the redirects, manually edit the CloudFront distribution origin to include the S3 bucket region, for example: `assets.example.com.s3-eu-west-2.amazonaws.com`

## Setting cache headers

CDN assets should be immutable and have long-cache headers (at least a year). Cache headers are set at an object level in S3, meaning you need to set headers when uploading assets to S3.

Typically you'd use the `aws s3 sync` command to upload assets, and this command accepts a `cache-control` header value. Here's an example of how it can work in GitHub Actions:

```yaml
- name: Sync static assets to S3
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --cache-control public,max-age=31536000,immutable
  env:
    AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_REGION: 'eu-west-2'
    SOURCE_DIR: '.next/static'
    DEST_DIR: '_next/static'
```

## Conclusion

While this setup is somewhat complicated, it's a good approach for offloading file serving to the Edge where it will be quicker to download for all users across all locations. This also keeps the runtime server focusing on runtime request handling instead of file serving.

The pricing is also somewhat complicated to figure out, but based on what others have mentioned, I don't expect to pay more than a few cents a month.
