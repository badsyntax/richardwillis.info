import React from 'react';
import Head from 'next/head';
import { Link } from '../../layout/Link/Link';
import styles from './HomePage.module.css';

export const HomePage: React.FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Richard Willis</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Richard Willis</h1>

        <p className={styles.description}>Software Engineer</p>

        <div className={styles.grid}>
          <a href="/projects" className={styles.card}>
            <h3>Projects &rarr;</h3>
          </a>

          <Link href="/blog" className={styles.card}>
            <h3>Blog</h3>
          </Link>

          <a href="/cv" className={styles.card}>
            <h3>About &rarr;</h3>
          </a>

          <a href="/contact" className={styles.card}>
            <h3>Contact &rarr;</h3>
          </a>
        </div>
      </main>
    </div>
  );
};
