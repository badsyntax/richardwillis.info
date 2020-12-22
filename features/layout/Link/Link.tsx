import { default as NextLink, LinkProps as NextLinkProps } from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';

export type LinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  NextLinkProps & {
    activeClassName?: string;
  };

const hrefInPath = (pathname, href): boolean => {
  const pathSplit = pathname.split('/');
  return href.split('/').every((part, i) => pathSplit[i] === part);
};

export const Link: React.FunctionComponent<LinkProps> = ({
  href,
  className,
  activeClassName,
  ...props
}) => {
  const router = useRouter();
  /* eslint-disable jsx-a11y/anchor-has-content */
  return (
    <NextLink href={href}>
      <a
        {...props}
        className={classNames(
          className,
          hrefInPath(router.asPath, href) && activeClassName
        )}
      />
    </NextLink>
  );
};
