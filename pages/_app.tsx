import React, { Fragment } from 'react';
import '../styles/globals.css';
import '../styles/prism-overrides.css';
import { Meta } from '../features/layout/Meta/Meta';

export { reportWebVitals } from '../features/metrics/reportWebVitals';

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
