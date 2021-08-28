import React from 'react';
import classNames from 'classnames/bind';
import { Link } from '../Link/Link';
import { Typography } from '../Typography/Typography';
import { MobileNav } from '../MobileNav/MobileNav';

import STYLES from './Header.module.scss';
import { Nav } from '../Nav/Nav';
const classes = classNames.bind(STYLES);

export const Header: React.FC = () => {
  return (
    <header className={classes('root')}>
      <div className={classes('body')}>
        <Link href="/" className={classes('title')}>
          Richard Willis
        </Link>
        <Nav className={classes('nav')} />
      </div>
      <MobileNav />
    </header>
  );
};
