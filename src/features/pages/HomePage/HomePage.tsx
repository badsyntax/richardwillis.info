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
        <meta name="description" content="Personal website of Richard Willis" />
      </Head>
      <Typography as="h1" className={classes('title')}>
        Richard Willis
      </Typography>
      <Typography as="h2" className={classes('description')}>
        Software Engineer
      </Typography>
      {/* <br /> */}
      {/* <br /> */}
      {/* <div style={{ color: '#d7ba7d' }}>
        <p>
          Hello world! I'm an experienced full stack developer who enjoys
          working with a range of technologies that include TypeScript, React,
          Node.js, Bash, Docker, Java, Python &amp; C# amongst many others! Read
          more <a href="#">about me</a>, check out some of my projects, have a read of my blog,
          or contact me.
        </p>
        <p>
          I love the concept of Open Source code and I try to contribute and
          share knowledge where I can. I have an active GitHub profile with some
          popular projects. My proudest OSS moment was when Microsoft adopted
          one of my Open Source Projects.
        </p>
      </div> */}
      <nav className={classes('nav-grid')}>
        <HomeNavLink href="/projects" title="Projects" />
        <HomeNavLink href="/blog" title="Blog" />
        <HomeNavLink href="/about" title="About" />
        <HomeNavLink href="/contact" title="Contact" />
      </nav>
    </main>
  );
};
