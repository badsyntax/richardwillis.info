import React from 'react';
import classNames from 'classnames/bind';

import { Link } from '../Link/Link';
import STYLES from './Nav.module.scss';
const classes = classNames.bind(STYLES);

export type NavProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

export const Nav: React.FC<NavProps> = ({ className, ...props }) => {
  const classNames = {
    className: classes('nav-item'),
    activeClassName: classes('active'),
  };
  return (
    <nav className={classes('root', className)} {...props}>
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
