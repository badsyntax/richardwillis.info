import React from 'react';
import Head from 'next/head';
import classNames from 'classnames/bind';

import { Header } from '../../layout/Header/Header';

import STYLES from './AboutPage.module.scss';
const classes = classNames.bind(STYLES);

export const AboutPage: React.FC = () => {
  return (
    <main className={classes('root')}>
      <Head>
        <title>Richard Willis</title>
        <meta name="description" content="Personal website of Richard Willis" />
      </Head>
      <Header />
    </main>
  );
};
