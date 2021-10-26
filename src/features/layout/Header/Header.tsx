import React from 'react';
import { Link } from '../Link/Link';
import { MobileNav } from '../MobileNav/MobileNav';
import { Nav } from '../Nav/Nav';
import * as styles from './Header.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.root}>
      <div className={styles.body}>
        <Link href="/" className={styles.title}>
          Richard Willis
        </Link>
        <Nav className={styles.nav} />
      </div>
      <MobileNav />
    </header>
  );
};
