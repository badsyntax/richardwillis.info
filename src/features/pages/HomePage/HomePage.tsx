import React from 'react';
import Head from 'next/head';
import styled from '@emotion/styled';

import { Typography } from '../../layout/Typography/Typography';
import { Link } from '../../layout/Link/Link';

import * as styles from './HomePage.styles';

const Root = styled.main`
  ${styles.root}
`;

const Nav = styled.nav`
  ${styles.navGrid}
`;

const HomeNavLink = styled(Link)`
  ${styles.navItem}
`;

const Title = styled(Typography)`
  ${styles.title}
`;

const Description = styled(Typography)`
  ${styles.description}
`;

export const HomePage: React.FC = () => {
  return (
    <Root>
      <Head>
        <title>Richard Willis</title>
        <meta
          name="description"
          content="Personal website of Richard Willis, a Software Engineer in the UK with experience of TypeScript, JavaScript, Node.js, Java, Python, C# and many others."
        />
      </Head>
      <Title as="h1">Richard Willis</Title>
      <Description as="h2">Software Engineer</Description>
      <Nav>
        <HomeNavLink href="/projects">Projects</HomeNavLink>
        <HomeNavLink href="/blog">Blog</HomeNavLink>
        <HomeNavLink href="/about">About</HomeNavLink>
        <HomeNavLink href="/contact">Contact</HomeNavLink>
      </Nav>
    </Root>
  );
};
