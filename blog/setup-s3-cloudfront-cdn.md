---
title: 'Setup Cloudfront & S3 for your Next.js app'
excerpt: 'Setup Cloudfront & S3 for your Next.js app'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

This posts describes how to:

- Setup Cloudfront & S3 in AWS
- Setup a alternative domain with TLS
- Deploy static files to S3 with CI/CD (Github Action)

## Setup Cloudfront & S3

TODO: should the bucket be crated in the `ue-east-1` region?

We'll use Cloudformation to create the S3 bucket and to create the Cloudfront distribution:

```yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'CloudFront distribution with an S3 origin'

Parameters:
  S3BucketName:
    Type: String
    Default: assets.richardwillis.info
    Description: Name of S3 bucket to create
  S3AllowedOrigins:
    Type: CommaDelimitedList
    Default: https://richardwillis.info, https://assets.richardwillis.info, https://richardwillis.dokku.proxima-web.com
    Description: A list of allowed domains to request resources from Cloudfront

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

- The SSL certificate and Alternate domain name are not automatically set (see below)
- The bucket is created in the region you used when creating the cloudformation stack.

## Allowing access to S3 bucket from Cloudfront

By default the S3 bucket will not be public, and we want to keep it that way, but we need to explicitly allow Cloudfront to access the files.

An "Origin Access Identity" resource is created as part of the above stack, but you need to manually edit the distribution to assign the identity. You can do this by editing the Origin for the distribution in the AWS UI.

1. Edit the cloudfront distribution
2. Select "Restrict Bucket Access"
3. Select "Use an Existing Identity"
4. Select the "Access S3 bucket content only through Cloudfront" identity
5. For "Grant Read Permissions on Bucket", I set "No, I Will Update Permissions" (but I didn't need to adjust the permissions).

## Setting the root domain and certificate

1. Edit the cloudfront distribution and add your root domain to the Alternate Domain Names (CNAMEs) field.
2. Select "Custom SSL Certificate (example.com):".
3. Click on "Request or Import a Certificate with ACM"
4. Check your AWS console region is `us-east-1` . This is important as cloudfront can only use certificates from `us-east-1`.
5. Follow the wizard to create a new certificate and edit your domain DNS to point a CNAME entry to your cloudfront domain
6. Wait for the verification to complete
7. Copy the certficate ARN.
8. Return to editing the cloudfront distribution and paste the certificate ARN.
9. Click save

Now you should be able to send a request to your CDN url:

```bash
curl -I https://assets.example.com/image.jpg
```

You might be `HTTP/1.1 307 Temporary Redirect` when attempting to GET the cloudfront URL. This is due to domain propagation when the bucket is created in any region that isn't `us-east-1`. To resolve the redirects, manually edit the Cloudfront distribution origin to include the S3 bucket region, for example: `assets.example.com.s3-eu-west-2.amazonaws.com`

## Setting up the bucket

Don't forget to add your domain to the CNAME section.

Now add a CNAME entry to your domain that points to your cloudfront root URL.

And that should be all!

Test everything works correctly. The first request will result in a cache miss:

```console
curl -I https://assets.example.com/photo.jpg
HTTP/1.1 200 OK
X-Cache: Miss from cloudfront
...etc
```

The second request should show the asset is cached by cloudfront:

```console
curl -I https://assets.example.com/photo.jpg
HTTP/1.1 200 OK
X-Cache: Hit from cloudfront
...etc
```

## Setting cache headers

CDN assets should be immutable and have long-cache headers (at least a year). Cache headers are set at an object level in S3, meaning you need to set headers when uploading assets to S3. (More on that below in the CI/CD section.)

You can however set headers for multiple assets in the S3 console UI by selecting multiple assets then choosing "Edit metadata", then "Add metadata", then "System defined" and finally "Cache-Control".

The cache headers should be:

```
Cache-Control: public,max-age=31536000,immutable
```

## Setting CORS headers

### Update S3 bucket CORS

We need to update the S3 CORs policy to allow for cross domain requests:

```json
[
  {
    "AllowedHeaders": [],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": [
      "https://richardwillis.info",
      "https://assets.richardwillis.info"
    ],
    "ExposeHeaders": []
  }
]
```

### Update cloudfront to forward the correct headers

## Uploading static Next.js files

We need to upload the contents of `.next/static` to the s3 bucket at location `/_next`.
