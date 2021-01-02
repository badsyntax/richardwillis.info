import React from 'react';
import Head from 'next/head';
import classNames from 'classnames/bind';

import { Typography } from '../../layout/Typography/Typography';
import { Link, LinkProps } from '../../layout/Link/Link';

import STYLES from './HomePage.module.css';
const classes = classNames.bind(STYLES);

interface HomeNavLinkProps {
  title: string;
}

const HomeNavLink: React.FunctionComponent<HomeNavLinkProps & LinkProps> = ({
  title,
  ...props
}) => {
  return (
    <Link {...props} variant="card-button" className={classes('nav-item')}>
      {title}&nbsp;&rarr;
    </Link>
  );
};

export const HomePage: React.FunctionComponent = () => {
  return (
    <main className={classes('root')}>
      <Head>
        <title>Richard Willis</title>
        <meta name="description" content="Personal website of Richard Willis" />
      </Head>
      <Typography as="h1" className={classes('title')}>
        Richard Willis
      </Typography>
      <Typography as="p" className={classes('description')}>
        Software Engineer
      </Typography>
      <nav className={classes('nav-grid')}>
        <HomeNavLink href="/projects" title="Projects" />
        <HomeNavLink href="/blog" title="Blog" />
        <HomeNavLink href="/about" title="About" />
        <HomeNavLink href="/contact" title="Contact" />
      </nav>
    </main>
  );
};
