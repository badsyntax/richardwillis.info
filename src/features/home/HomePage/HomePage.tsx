import React from 'react';
import Head from 'next/head';
import classNames from 'classnames/bind';

import { Typography } from '../../layout/Typography/Typography';
import { Link, LinkProps } from '../../layout/Link/Link';

import STYLES from './HomePage.module.scss';
const classes = classNames.bind(STYLES);

interface HomeNavLinkProps {
  title: string;
}

const HomeNavLink: React.FC<HomeNavLinkProps & LinkProps> = ({
  title,
  ...props
}) => {
  return (
    <Link {...props} className={classes('nav-item')}>
      {title}
    </Link>
  );
};

export const HomePage: React.FC = () => {
  return (
    <main className={classes('root')}>
      <Head>
        <title>Richard Willis</title>
        <meta
          name="description"
          content="Personal website of Richard Willis, a Software Engineer in the UK with experience of TypeScript, JavaScript, Node.js, Java, Python, C# and many others."
        />
      </Head>
      <Typography as="h1" className={classes('title')}>
        Richard Willis
      </Typography>
      <Typography as="h2" className={classes('description')}>
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
