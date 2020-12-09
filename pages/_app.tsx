import React, { Fragment } from 'react';
import Head from 'next/head';
import '../styles/tokens.css';
import '../styles/globals.css';

export interface MyAppProps {
  Component: React.FunctionComponent | React.ComponentClass;
  pageProps: unknown;
}

const MyApp: React.FunctionComponent<MyAppProps> = ({
  Component,
  pageProps,
}) => {
  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  );
};

export default MyApp;
