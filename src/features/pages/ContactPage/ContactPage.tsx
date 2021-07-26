import React from 'react';
import Head from 'next/head';
import classNames from 'classnames/bind';

import { Header } from '../../layout/Header/Header';

import STYLES from './ContactPage.module.scss';
const classes = classNames.bind(STYLES);

export const ContactPage: React.FC = () => {
  return (
    <main className={classes('root')}>
      <Head>
        <title>Richard Willis - Contact</title>
        <meta name="description" content="Personal website of Richard Willis" />
      </Head>
      <Header />
    </main>
  );
};
