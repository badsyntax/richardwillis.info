import React from 'react';
import classNames from 'classnames';

import { Link } from '../Link/Link';

import * as styles from './Nav.css';

export type NavProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

export const Nav: React.FC<NavProps> = ({ className = '', ...props }) => {
  const classes = {
    className: styles.navItem,
    activeClassName: styles.active,
  };
  return (
    <nav className={classNames(styles.root, className)} {...props}>
      <Link href="/projects" {...classes}>
        Projects
      </Link>
      <Link href="/blog" {...classes}>
        Blog
      </Link>
      <Link href="/about" {...classes}>
        About
      </Link>
      <Link href="/contact" {...classes}>
        Contact
      </Link>
    </nav>
  );
};
