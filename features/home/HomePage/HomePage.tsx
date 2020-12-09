import React from 'react';
import Head from 'next/head';
import { Link } from '../../layout/Link/Link';
import cn from 'classnames/bind';

import STYLES from './HomePage.module.css';
const classes = cn.bind(STYLES);

export const HomePage: React.FunctionComponent = () => {
  return (
    <div className={classes('container')}>
      <Head>
        <title>Richard Willis</title>
      </Head>

      <main className={classes('main')}>
        <h1 className={classes('title')}>Richard Willis</h1>

        <p className={classes('description')}>Software Engineer</p>

        <div className={classes('grid')}>
          <a href="/projects" className={classes('card')}>
            <h3>Projects &rarr;</h3>
          </a>

          <Link href="/blog" className={classes('card')}>
            <h3>Blog &rarr;</h3>
          </Link>

          <a href="/cv" className={classes('card')}>
            <h3>About &rarr;</h3>
          </a>

          <a href="/contact" className={classes('card')}>
            <h3>Contact &rarr;</h3>
          </a>
        </div>
      </main>
    </div>
  );
};
