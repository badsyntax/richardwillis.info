import classNames from 'classnames/bind';
import React from 'react';
import { Link } from '../Link/Link';
import STYLES from './Header.module.css';
const classes = classNames.bind(STYLES);

export interface HeaderProps {
  className?: string;
}

export const Header: React.FunctionComponent<HeaderProps> = ({ className }) => {
  return (
    <header className={classes('root', className)}>
      <Link href="/">
        <h1>Richard Willis</h1>
      </Link>
    </header>
  );
};
