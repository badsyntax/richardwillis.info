import React, { Fragment } from 'react';

import '../styles/globals.css';
import '../styles/prism.css';
import '../styles/nprogress.css';

import { Meta } from '../features/layout/Meta/Meta';
import { LoadingBar } from '../features/layout/LoadingBar/LoadingBar';

export { reportWebVitals } from '../features/metrics/reportWebVitals';

export interface MyAppProps {
  Component: React.FunctionComponent | React.ComponentClass;
  pageProps: Record<string, unknown>;
}

const MyApp: React.FunctionComponent<MyAppProps> = ({
  Component,
  pageProps,
}) => {
  return (
    <Fragment>
      <Meta />
      <LoadingBar />
      <Component {...pageProps} />
    </Fragment>
  );
};

export default MyApp;
