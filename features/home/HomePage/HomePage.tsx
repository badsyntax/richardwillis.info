import React from 'react';
import Head from 'next/head';
import classNames from 'classnames/bind';

import { Typography } from '../../layout/Typography/Typography';
import { Card, CardProps } from '../../layout/Card/Card';
import STYLES from './HomePage.module.css';
const classes = classNames.bind(STYLES);

interface HomeCardProps {
  title: string;
}
const HomeCard: React.FunctionComponent<HomeCardProps & CardProps> = ({
  title,
  ...props
}) => {
  return (
    <Card {...props} className={classes('card')}>
      {title}&nbsp;&rarr;
    </Card>
  );
};

export const HomePage: React.FunctionComponent = () => {
  return (
    <main className={classes('root')}>
      <Head>
        <title>Richard Willis</title>
      </Head>
      <Typography as="h1" className={classes('title')}>
        Richard Willis
      </Typography>
      <Typography as="p" className={classes('description')}>
        Software Engineer
      </Typography>
      <nav className={classes('card-grid')}>
        <HomeCard href="/projects" title="Projects" />
        <HomeCard href="/blog" title="Blog" />
        <HomeCard href="/cv" title="About" />
        <HomeCard href="/contact" title="Contact" />
      </nav>
    </main>
  );
};
