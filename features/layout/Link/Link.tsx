import { default as NextLink, LinkProps as NextLinkProps } from 'next/link';
import classNames from 'classnames/bind';
import { useRouter } from 'next/router';

import STYLES from './Link.module.css';
const classes = classNames.bind(STYLES);

export type LinkVariant = 'button' | 'normal';

export type LinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  NextLinkProps & {
    activeClassName?: string;
    variant?: LinkVariant;
  };

const hrefInPath = (pathname, href): boolean => {
  const pathSplit = pathname.split('/');
  return href.split('/').every((part, i) => pathSplit[i] === part);
};

export const Link: React.FunctionComponent<LinkProps> = ({
  href,
  className,
  activeClassName,
  variant,
  ...props
}) => {
  const router = useRouter();
  /* eslint-disable jsx-a11y/anchor-has-content */
  return (
    <NextLink href={href}>
      <a
        {...props}
        className={classes(
          className,
          hrefInPath(router.asPath, href) && activeClassName,
          variant && `variant-${variant}`
        )}
      />
    </NextLink>
  );
};
