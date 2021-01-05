import { default as NextLink, LinkProps as NextLinkProps } from 'next/link';
import classNames from 'classnames/bind';
import { useRouter } from 'next/router';

import STYLES from './Link.module.css';
const classes = classNames.bind(STYLES);

export type LinkVariant = 'card-button' | 'normal';

export type LinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  NextLinkProps & {
    activeClassName?: string;
    variant?: LinkVariant;
  };

const hrefInPath = (pathname: string, href: string): boolean => {
  const pathSplit = pathname.split('/');
  return href.split('/').every((part, i) => pathSplit[i] === part);
};

export const Link: React.FunctionComponent<LinkProps> = ({
  href,
  className,
  activeClassName,
  variant = 'normal',
  ...rest
}) => {
  const router = useRouter();
  const isInPage = href.startsWith('#');
  const isExternal = !href.startsWith('/');

  const anchorProps = {
    ...rest,
    ...((isInPage || isExternal) && {
      href,
    }),
    ...(isExternal && {
      rel: 'nofollow',
    }),
  };

  /* eslint-disable jsx-a11y/anchor-has-content */
  const anchor = (
    <a
      {...anchorProps}
      className={classes(
        className,
        hrefInPath(router.asPath, href) && activeClassName,
        variant && `variant-${variant}`
      )}
    />
  );

  return isInPage || isExternal ? (
    anchor
  ) : (
    <NextLink href={href}>{anchor}</NextLink>
  );
};
