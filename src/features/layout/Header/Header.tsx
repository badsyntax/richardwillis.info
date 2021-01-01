import React from 'react';
import classNames from 'classnames/bind';
import { Link } from '../Link/Link';
import { Nav } from '../Nav/Nav';
import STYLES from './Header.module.css';
import { MobileNav } from '../MobileNav/MobileNav';
const classes = classNames.bind(STYLES);

export const Header: React.FunctionComponent = () => {
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
