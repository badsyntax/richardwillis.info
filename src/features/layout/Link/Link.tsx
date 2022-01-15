import styled from '@emotion/styled';
import { default as NextLink, LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import * as styles from './styles';

export type LinkVariant = 'card-button' | 'normal';

const hrefInPath = (pathname: string, href: string): boolean => {
  const pathSplit = pathname.split('/');
  return href.split('/').every((part, i) => pathSplit[i] === part);
};

const Anchor = styled.a`
  ${styles.anchor}
`;

export type LinkProps = React.ComponentProps<typeof Anchor> &
  NextLinkProps & {
    activeClassName?: string;
    variant?: LinkVariant;
  };

export const Link: React.FC<LinkProps> = ({
  href,
  className,
  activeClassName,
  variant = 'normal',
  ...rest
}) => {
  const router = useRouter();
  const isInPage = href.startsWith('#');
  const isExternal = !isInPage && !href.startsWith('/');

  const anchorProps = {
    ...rest,
    ...((isInPage || isExternal) && {
      href,
    }),
    ...(isExternal && {
      rel: 'nofollow',
    }),
    className: classNames(
      className,
      hrefInPath(router.asPath, href) && activeClassName
    ),
  };

  const anchor = <Anchor {...anchorProps} />;

  return isInPage || isExternal ? (
    anchor
  ) : (
    <NextLink href={href} passHref>
      {anchor}
    </NextLink>
  );
};
``;
