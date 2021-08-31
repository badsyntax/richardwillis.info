import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const siteAssets = `${publicRuntimeConfig.assetPrefix}site-assets/`;

export default class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href={`${siteAssets}favicon.ico`} />
          <link rel="icon" href={`${siteAssets}favicon.ico`} />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${siteAssets}apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${siteAssets}favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${siteAssets}favicon-16x16.png`}
          />
          <meta name="theme-color" content="#000000" />
          <script
            defer
            data-domain="richardwillis.info"
            src="https://plausible.docker-box.richardwillis.info/js/plausible.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
