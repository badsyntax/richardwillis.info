import React, { Fragment } from 'react';
import { Meta } from '../features/layout/Meta/Meta';

import { ThemeProvider } from '../features/theme/ThemeProvider/ThemeProvider';

export interface MyAppProps {
  Component: React.FC | React.ComponentClass;
  pageProps: Record<string, unknown>;
}

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <Meta />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
