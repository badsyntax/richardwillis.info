import React from 'react';
import classNames from 'classnames/bind';

import { Link } from '../Link/Link';
import STYLES from './Nav.module.css';
const classes = classNames.bind(STYLES);

export interface NavProps {
  className?: string;
}

export const Nav: React.FunctionComponent<NavProps> = ({ className }) => {
  const classNames = {
    className: classes('nav-item'),
    activeClassName: classes('active'),
  };
  return (
    <nav className={classes('root', className)}>
      <Link href="/projects" {...classNames}>
        Projects
      </Link>
      <Link href="/blog" {...classNames}>
        Blog
      </Link>
      <Link href="/about" {...classNames}>
        About
      </Link>
      <Link href="/contact" {...classNames}>
        Contact
      </Link>
    </nav>
  );
};
