import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import getConfig from 'next/config';
// import { renderStatic } from '../features/renderer';
const { publicRuntimeConfig } = getConfig();

const siteAssets = `${publicRuntimeConfig.assetPrefix}site-assets`;

export default class MyDocument extends Document {
  // static async getInitialProps(ctx: any) {
  //   const page = await ctx.renderPage();
  //   const { css, ids } = await renderStatic(page.html);
  //   const initialProps = await Document.getInitialProps(ctx);
  //   return {
  //     ...initialProps,
  //     styles: (
  //       <React.Fragment>
  //         {initialProps.styles}
  //         <style
  //           data-foo="fooooooo"
  //           data-emotion={`css ${ids.join(' ')}`}
  //           dangerouslySetInnerHTML={{ __html: css }}
  //         />
  //       </React.Fragment>
  //     ),
  //   };
  // }
  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <link rel="shortcut icon" href={`${siteAssets}/favicon.ico`} />
          <link rel="icon" href={`${siteAssets}/favicon.ico`} />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${siteAssets}/apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${siteAssets}/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${siteAssets}/favicon-16x16.png`}
          />
          <meta name="theme-color" content="#000000" />
          <script
            defer
            data-domain="richardwillis.info"
            data-api="https://plausible.docker-box.richardwillis.info/api/event"
            src={`${siteAssets}/plausible.js`}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
