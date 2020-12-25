# Setup Cloudfront & S3 for your Next.js app

This posts describes how to:

- Setup Cloudfront & S3 in AWS
- Setup a alternative domain with TLS
- Automatically deploy static files with CI/CD

## Setup Cloudfront & S3

We'll use Cloudformation to create the S3 bucket and to create the Cloudfront distribution:

```yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'CloudFront distribution with an S3 origin'

Parameters:
  S3BucketName:
    Type: String
    Default: cdn.richardwillis.info
    Description: Name of S3 bucket to create

Resources:
  S3Bucket:
    Type: 'AWS::S3::Bucket'
    DeletionPolicy: 'Delete'
    Metadata:
      Comment: 'Bucket to store all assets to be served over the CDN'
    Properties:
      AccessControl: 'Private'
      BucketName: !Ref S3BucketName

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

  CfDistribution:
    Type: 'AWS::CloudFront::Distribution'
    Metadata:
      Comment: 'A CloudFront distribution with an S3 origin'
    Properties:
      DistributionConfig:
        Comment: 'A distribution with an S3 origin'
        DefaultCacheBehavior:
          AllowedMethods:
            - 'HEAD'
            - 'GET'
          CachedMethods:
            - 'HEAD'
            - 'GET'
          Compress: false
          DefaultTTL: 86400
          ForwardedValues:
            Cookies:
              Forward: 'none'
            Headers:
              - 'Origin'
            QueryString: false
          MaxTTL: 31536000
          MinTTL: 86400
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

Note that after the stack is created, you might be seeing `HTTP/1.1 307 Temporary Redirect` when attempting to GET the cloudfront URL. This is due to domain propagation when the bucket is created in any region that isn't `eu-west-1`.

To resolve the redirects, edit the Cloudfront distribution origin to include the S3 bucket region, for example:

```console
assets.example.com.s3-eu-west-2.amazonaws.com
```

## Allowing access to S3 bucket from Cloudfront

By default the S3 bucket will not be public, and we want to keep it that way, but we need to explicitly allow Cloudfront to access the files.

An "Origin Access Identity" resource is created as part of the above stack, but you need to edit the distribution to assign the identity. You can do this by editing the Origin for the distribution in the AWS UI. For "Grant Read Permissions on Bucket", I set "No, I Will Update Permissions" (but I didn't need to adjust the permissions).

## Using a alternative domain

You first need to create a certificate for the domain in AWS ACM. Note, public certificates are free.

Edit the distribution then click on "Request or Import a Certificate with ACM" to create a new certificate.

**You have to create the certificate in the us-east-1 region, this is important as cloudfront can only use images from us-east-1.**

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
