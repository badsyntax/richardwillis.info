import React, { Fragment } from 'react';
import Head from 'next/head';
import classNames from 'classnames/bind';
import { Header } from '../Header/Header';

import STYLES from './PageShell.module.scss';
const classes = classNames.bind(STYLES);

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
      <div className={classes('root')}>
        <Header />
        <main className={classes('main', mainClassName)}>{children}</main>
      </div>
    </Fragment>
  );
};
