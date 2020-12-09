import Head from 'next/head';
import React from 'react';

export const Meta: React.FunctionComponent = () => {
  return (
    <Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
    </Head>
  );
};
