---
title: 'Setup CloudFront & S3'
excerpt: 'An overview of how to setup S3 & CloudFront'
date: '2020-12-27T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: false
---

This posts describes how to:

- Setup [CloudFront](https://aws.amazon.com/cloudfront/) & [S3](https://aws.amazon.com/s3/) in AWS
- Setup an [Lambda](https://aws.amazon.com/lambda/) to fix the cache headers
- Setup an Alternate domain with TLS

## Setup CloudFront & S3

Setting up a basic Cloudfront distribution and S3 bucket is fairly straightforward, but the complexity lies in setting the correct response headers.

The correct CORS configuration is required as you'll be serving your assets on a different domain to your main site, and the assets need to be "given permission" to work on specified origin domains.

My initial attempt at this resulted in my assets being too aggressively cached, and would not load via `fetch` as the CORS headers (or lack thereof) were cached by CloudFront. This was fixed by specifying a custom CachePolicy and forwarding the correct CORS headers.

The second caching issue I had was browser cache. The issue is fairly complex but boils down to S3 not sending a `Vary: Origin` which results in the browser caching the CORS headers and not allowing cross domain `fetch`/`xhr` requests.

Here are some resources covering the issue in more detail.

- [Issue with CloudFront not returning correct Vary header](https://stackoverflow.com/questions/31732533/s3-cors-always-send-vary-origin)
- [Not able to set Vary response header in S3](https://stackoverflow.com/a/21371500/492325)
- [Overview of the caching issue in Chrome](https://serverfault.com/questions/856904/chrome-s3-cloudfront-no-access-control-allow-origin-header-on-initial-xhr-req/856948#856948)

If you're using `cURL` to test this, you won't see the issue. The issue is only obvious in the browser due to how it caches responses.

The solution is use a lambda function to "fix" the S3 response headers (to add `Vary: Origin` for all responses from S3).

After a _lot_ of trial and error I managed to create a working CloudFormation template, which creates the following resources:

- An S3 bucket with CORS configured for a list of allowed origins
- A CloudFront OriginAccessIdentity that allows CloudFront to read from S3
- A CloudFront caching policy with the correct CORS configuration
- A CloudFront distribution that uses the S3 bucket as origin source
- A lambda function used for modifying the response headers from a `origin-response` event
- Custom root domain with TLS
- Various AWS roles

### Step 1 - Create the certificate for your root domain

This is a manual step as it requires domain verification. Note that AWS certificates are free.

Head on over to [AWS Certificate Manager](https://console.aws.amazon.com/acm/home?region=us-east-1) to create a certificate for your domain.

Once the certificate is created and domain verified, take note of the certificate ARN and move onto the next step.

### Step 2 - Create the stack with CloudFormation

Note the following before continuing:

- When you update the stack you'll need to bump the version to allow proper deployment of the lambda function
- **You have to create the stack in region `us-east-1`**, as this is where the CloudFront control pane sits and requires resources (eg certificates & buckets) to be created in the same region

```yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'CloudFront distribution with an S3 origin'

Parameters:
  ProjectName:
    Type: String
    Default: example-project-assets
    Description: Use for creating resource names
  Version:
    Type: String
    Default: '1-0-0'
    Description: A unique identifier to allow multiple deployments of the cloudformation
  S3BucketName:
    Type: String
    Default: assets.example.com-us-east-1
    Description: Name of S3 bucket to create
  S3AllowedOrigins:
    Type: CommaDelimitedList
    Default: https://example.com, https://assets.example.com
    Description: A list of allowed domains to request resources from Cloudfront
  RootDomain:
    Type: CommaDelimitedList
    Default: assets.example.com
    Description: A list of root hosts assigned to the cloudfront distribution
  CertificateARN:
    Type: String
    Description: ARN of the certificate for the root domain

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
              - 's3:*'
            Effect: 'Allow'
            Principal:
              CanonicalUser: !GetAtt CFOriginAccessIdentity.S3CanonicalUserId
            Resource:
              - !Sub 'arn:aws:s3:::${S3BucketName}/*'

  CFStaticCachePolicy:
    Type: 'AWS::CloudFront::CachePolicy'
    Metadata:
      Comment: 'The cache policy for Next.js static assets'
    Properties:
      CachePolicyConfig:
        DefaultTTL: 86400
        MaxTTL: 31536000
        MinTTL: 0
        Name: !Sub '${ProjectName}-cf-static-cache-policy'
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

  CFDistribution:
    Type: 'AWS::CloudFront::Distribution'
    Metadata:
      Comment: 'A CloudFront distribution with an S3 origin'
    Properties:
      DistributionConfig:
        Comment: 'CDN for all static assets'
        CacheBehaviors:
          - CachePolicyId: !Ref CFStaticCachePolicy
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
            TargetOriginId: !Sub 's3-origin-${S3Bucket}'
            ViewerProtocolPolicy: 'redirect-to-https'
            LambdaFunctionAssociations:
              - EventType: origin-response
                LambdaFunctionARN: !GetAtt CFLambdaVersion.FunctionArn
                IncludeBody: false
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
          DefaultTTL: 86400
          MaxTTL: 31536000
          MinTTL: 0
          TargetOriginId: !Sub 's3-origin-${S3Bucket}'
          ViewerProtocolPolicy: 'redirect-to-https'
          LambdaFunctionAssociations:
            - EventType: origin-response
              LambdaFunctionARN: !GetAtt CFLambdaVersion.FunctionArn
              IncludeBody: false
        DefaultRootObject: 'index.html'
        Enabled: true
        HttpVersion: 'http1.1'
        IPV6Enabled: false
        Origins:
          - DomainName: !GetAtt S3Bucket.DomainName
            Id: !Sub 's3-origin-${S3Bucket}'
            OriginPath: ''
            S3OriginConfig:
              OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/${CFOriginAccessIdentity}'
        PriceClass: 'PriceClass_All'
        Aliases: !Ref RootDomain
        ViewerCertificate:
          AcmCertificateArn: !Ref CertificateARN
          MinimumProtocolVersion: 'TLSv1.2_2019'
          SslSupportMethod: 'sni-only'

  CFOriginAccessIdentity:
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity'
    Metadata:
      Comment: 'Access S3 bucket content only through CloudFront'
    Properties:
      CloudFrontOriginAccessIdentityConfig:
        Comment: 'Access S3 bucket content only through CloudFront'

  CFLambda:
    Type: AWS::Lambda::Function
    Properties:
      Role: !GetAtt CFLambdaRole.Arn
      Runtime: nodejs12.x
      Handler: index.handler
      Code:
        ZipFile: |
          // response headers *should* be key value pairs but can also contain comma delimited values,
          // so we normalise them into a consistent key/value structure.
          function getNormalisedHeaders(headers = []) {
            return headers.reduce((previousValue, currentValue) => {
              const values = currentValue.value.split(",");
              values.forEach((value) => {
                previousValue.push({
                  key: currentValue.key,
                  value: value.trim(),
                });
              });
              return previousValue;
            }, []);
          }

          function addHeaders(existingHeaders, newHeaders) {
            newHeaders.forEach((newHeader) => {
              const hasExistingHeader = !!existingHeaders.find((existingHeader) => {
                return (
                  existingHeader.key.toLowerCase() === newHeader.key.toLowerCase() &&
                  existingHeader.value.toLowerCase() === newHeader.value.toLowerCase()
                );
              });
              if (!hasExistingHeader) {
                existingHeaders.push(newHeader);
              }
            });
          }

          // Always return 'Vary' headers to prevent browsers caching response
          // headers when 'Origin' changes.
          exports.handler = (event, context, callback) => {
            const response = event.Records[0].cf.response;
            const headers = response.headers;
            headers["vary"] = getNormalisedHeaders(headers["vary"]);
            addHeaders(headers["vary"], [
              { key: "Vary", value: "Access-Control-Request-Headers" },
              { key: "Vary", value: "Access-Control-Request-Method" },
              { key: "Vary", value: "Origin" },
            ]);
            callback(null, response);
          };

  CFLambdaRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - lambda.amazonaws.com
                - edgelambda.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

  CFLambdaVersion:
    Type: Custom::LatestLambdaVersion
    Properties:
      ServiceToken: !GetAtt PublishLambdaVersion.Arn
      FunctionName: !Ref CFLambda
      Version: !Ref Version

  PublishLambdaVersion:
    Type: AWS::Lambda::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs12.x
      Role: !GetAtt PublishLambdaVersionRole.Arn
      Code:
        ZipFile: |
          const {Lambda} = require('aws-sdk')
          const {send, SUCCESS, FAILED} = require('cfn-response')
          const lambda = new Lambda()
          exports.handler = (event, context) => {
            const {RequestType, ResourceProperties: {FunctionName}} = event
            if (RequestType == 'Delete') return send(event, context, SUCCESS)
            lambda.publishVersion({FunctionName}, (err, {FunctionArn}) => {
              err
                ? send(event, context, FAILED, err)
                : send(event, context, SUCCESS, {FunctionArn})
            })
          }

  PublishLambdaVersionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
      Policies:
        - PolicyName: PublishVersion
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action: lambda:PublishVersion
                Resource: '*'

Outputs:
  S3BucketName:
    Description: 'Bucket name'
    Value: !Ref S3Bucket
  CFDistributionId:
    Description: 'Id for our cloudfront distribution'
    Value: !Ref CFDistribution
  CFDistributionDomainName:
    Description: 'Domain name for our cloudfront distribution'
    Value: !GetAtt CFDistribution.DomainName
```

## Setting S3 object cache headers

CDN assets should be immutable and have long-cache headers (at least a year). Cache headers are set at an object level in S3, meaning you need to set headers when uploading assets to S3.

Typically you'd use the `aws s3 sync` command to upload assets, and this command accepts a `cache-control` header value. Here's an example of how it can work in [GitHub Actions](https://github.com/jakejarvis/s3-sync-action):

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

## Testing everything works as expected

### Normal HTTP GET

- `Vary` must include `Origin`
- `X-Cache: Hit from cloudfront`
- `Cache-Control: public,max-age=31536000,immutable`

```console
❯ curl -I https://assets.example.com/example.css
HTTP/1.1 200 OK
Content-Type: text/css
Content-Length: 8144
Connection: keep-alive
Date: Sun, 27 Dec 2020 13:52:58 GMT
Last-Modified: Sun, 27 Dec 2020 09:18:42 GMT
ETag: "4e1b3a0e44aca9680db285019b82ddc4"
Cache-Control: public,max-age=31536000,immutable
Accept-Ranges: bytes
Server: AmazonS3
Vary: Accept-Encoding,Access-Control-Request-Headers,Access-Control-Request-Method,Origin
X-Cache: Hit from cloudfront
Via: 1.1 2a699e0025d07c32806ac8609ddf615f.cloudfront.net (CloudFront)
X-Amz-Cf-Pop: MAN50-C1
X-Amz-Cf-Id: _I8Z_Q5yEnxGtMHHTs7P3OP9GoD-GxlZjgLmXcPfEt96WiiUiBBQ7A==
Age: 58
```

### HTTP "Ajax" GET

- `Access-Control-Allow-Origin` must the origin domain
- `Access-Control-Allow-Methods` must include GET & HEAD

```console
❯ curl -H "Origin: https://example.com" -I https://assets.example.com/example.css
HTTP/1.1 200 OK
Content-Type: text/css
Content-Length: 8144
Connection: keep-alive
Date: Sun, 27 Dec 2020 13:53:28 GMT
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, HEAD
Access-Control-Allow-Credentials: true
Last-Modified: Sun, 27 Dec 2020 09:18:42 GMT
ETag: "4e1b3a0e44aca9680db285019b82ddc4"
Cache-Control: public,max-age=31536000,immutable
Accept-Ranges: bytes
Server: AmazonS3
Vary: Accept-Encoding,Origin,Access-Control-Request-Headers,Access-Control-Request-Method
X-Cache: Hit from cloudfront
Via: 1.1 17f0b98b6d4137bc8dc94c29641bd8d0.cloudfront.net (CloudFront)
X-Amz-Cf-Pop: MAN50-C1
X-Amz-Cf-Id: NgcvOmQhdW0cYYeEPJ2cy3w0grvVGlTgt7Mxt7w658IXMzs7tC7uCw==
Age: 218
```

### HTTP GET accepting compressed contents

- `Content-Encoding` must include either `gzip` or `br`

```console
❯ curl -H "Accept-Encoding: gzip, deflate, br" -I https://assets.example.com/example.css
HTTP/1.1 200 OK
Content-Type: text/css
Connection: keep-alive
Date: Sun, 27 Dec 2020 14:00:42 GMT
Last-Modified: Sun, 27 Dec 2020 09:18:42 GMT
ETag: W/"4e1b3a0e44aca9680db285019b82ddc4"
Cache-Control: public,max-age=31536000,immutable
Server: AmazonS3
Content-Encoding: br
Vary: Accept-Encoding,Access-Control-Request-Headers,Access-Control-Request-Method,Origin
X-Cache: Hit from cloudfront
Via: 1.1 32af5a401f7615103a45caa0d855fe97.cloudfront.net (CloudFront)
X-Amz-Cf-Pop: MAN50-C1
X-Amz-Cf-Id: 3k3RkOOpWUyJpsSUx_vOxbjf7q4o0nXtpgCkB92E7HKpu-4bh8awOg==
Age: 18
```

## Debugging Lambda errors

If you make changes to the lambda function and get `502` ("LambdaValidationError from cloudfront") or `503` ("LambdaExecutionError from cloudfront") errors when attempting to request your assets, you can use [CloudWatch](https://console.aws.amazon.com/cloudwatch) to view the errors but _you need to be in the correct region (closest to you) to find the correct logs_.

## Conclusion

I spent a long time getting this to work, much longer than I initially thought it'd take. I assumed it would be easy to connect Cloudfront to S3 and everything would "just work", as these services are built to work well together, but I was wrong, and the devil is always in the detail. Saying that, having constructed a working CloudFormation template means I won't have to go through this pain again in the future.

Putting aside the pain of creating the stack, storing static assets at the Edge has great benefits.

- Static files are cached for a very long time (1 year)
- Static files are quicker to download to all users across all location
- Compression is handled automatically by the CDN
- The runtime application server has more resources available to focus on request/runtime computations instead of static file serving

The pricing is somewhat complicated to figure out, but based on what others have mentioned, I don't expect to pay more than a few cents a month for a personal website.
