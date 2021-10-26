import React, { Fragment } from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import { Header } from '../Header/Header';
import * as styles from './PageShell.css';

export interface PageShellProps {
  title: string;
  description: string;
  mainClassName?: string;
}

export const PageShell: React.FC<PageShellProps> = ({
  title,
  children,
  mainClassName,
  description,
}) => {
  return (
    <Fragment>
      <Head>
        <title>Richard Willis - {title}</title>
        <meta name="description" content={description} />
      </Head>
      <div className={styles.root}>
        <Header />
        <main className={classNames(styles.main, mainClassName)}>
          {children}
        </main>
      </div>
    </Fragment>
  );
};
