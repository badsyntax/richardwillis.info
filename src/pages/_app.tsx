import React, { Fragment } from 'react';
import { Meta } from '../features/layout/Meta/Meta';

import '../styles/globals.scss';
import '../styles/prism.scss';

export interface MyAppProps {
  Component: React.FC | React.ComponentClass;
  pageProps: Record<string, unknown>;
}

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
  return (
    <Fragment>
      <Meta />
      <Component {...pageProps} />
    </Fragment>
  );
};

export default MyApp;
