import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="shortcut icon"
            href={`${publicRuntimeConfig.assetPrefix}favicon.ico`}
          />
          <link
            rel="icon"
            href={`${publicRuntimeConfig.assetPrefix}favicon.ico`}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${publicRuntimeConfig.assetPrefix}apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${publicRuntimeConfig.assetPrefix}favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${publicRuntimeConfig.assetPrefix}favicon-16x16.png`}
          />
          <meta name="theme-color" content="#000000" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
