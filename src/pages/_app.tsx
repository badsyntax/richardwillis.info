import React, { Fragment } from 'react';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
// import '../styles/globals.css.ts';

import { Meta } from '../features/layout/Meta/Meta';
import { globalStyles } from '../styles/globals.css.stiches';

export interface MyAppProps {
  Component: React.FC | React.ComponentClass;
  pageProps: Record<string, unknown>;
}

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
  globalStyles();
  return (
    <Fragment>
      <Meta />
      <Component {...pageProps} />
    </Fragment>
  );
};

export default MyApp;

// import React, { Fragment } from 'react';
// import { Meta } from '../features/layout/Meta/Meta';

// import '../styles/globals.css.ts';
// import 'prism-themes/themes/prism-vsc-dark-plus.css';
// export interface MyAppProps {
//   Component: React.FC | React.ComponentClass;
//   pageProps: Record<string, unknown>;
// }

// const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
//   return (
//     <Fragment>
//       <Meta />
//       <Component {...pageProps} />
//     </Fragment>
//   );
// };

// export default MyApp;
