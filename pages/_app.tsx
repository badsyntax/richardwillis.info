import React, { Fragment } from 'react';
import '../styles/tokens.css';
import '../styles/globals.css';
import { Meta } from '../features/layout/Meta/Meta';

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
      <Meta />
      <Component {...pageProps} />
    </Fragment>
  );
};

export default MyApp;
