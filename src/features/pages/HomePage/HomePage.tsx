import React from 'react';
import Head from 'next/head';

import { Typography } from '../../layout/Typography/Typography';
import { Link, LinkProps } from '../../layout/Link/Link';
import { styled } from '../../../styles/stitches.config';

import * as styles from './HomePage.css.stitches';

interface HomeNavLinkProps {
  title: string;
}

const HomeNavLink: React.FC<HomeNavLinkProps & LinkProps> = ({
  title,
  ...props
}) => {
  return (
    <Link {...props} className={styles.navItem()}>
      {title}
    </Link>
  );
};

const Text = styled('p', {
  fontFamily: '$system',
  color: '$hiContrast',

  variants: {
    size: {
      1: {
        fontSize: '$1',
      },
      2: {
        fontSize: '$2',
      },
      3: {
        fontSize: '$3',
      },
    },
  },
});

export const HomePage: React.FC = () => {
  return (
    <main className={styles.root()}>
      <Head>
        <title>Richard Willis</title>
        <meta
          name="description"
          content="Personal website of Richard Willis, a Software Engineer in the UK with experience of TypeScript, JavaScript, Node.js, Java, Python, C# and many others."
        />
      </Head>
      <Typography as="h1" className={styles.title()}>
        Richard Willis
      </Typography>
      <Typography as="h2" className={styles.description()}>
        Software Engineer
      </Typography>
      <nav className={styles.navGrid()}>
        <HomeNavLink href="/projects" title="Projects" />
        <HomeNavLink href="/blog" title="Blog" />
        <HomeNavLink href="/about" title="About" />
        <HomeNavLink href="/contact" title="Contact" />
      </nav>
    </main>
  );
};
