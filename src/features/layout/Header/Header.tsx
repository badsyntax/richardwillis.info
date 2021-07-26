import React from 'react';
import classNames from 'classnames/bind';
import { Link } from '../Link/Link';
import { Typography } from '../Typography/Typography';
import { Nav } from '../Nav/Nav';

import STYLES from './Header.module.scss';
const classes = classNames.bind(STYLES);

export const Header: React.FC = () => {
  return (
    <header className={classes('root')}>
      <div className={classes('body')}>
        <Link href="/" className={classes('title')}>
          <Typography as="span">Richard Willis</Typography>
        </Link>
        <Nav className={classes('nav')} />
      </div>
    </header>
  );
};
