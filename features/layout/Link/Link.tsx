import { default as NextLink, LinkProps as NextLinkProps } from 'next/link';

export type LinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  NextLinkProps;

export const Link: React.FunctionComponent<LinkProps> = ({
  href,
  ...props
}) => {
  /* eslint-disable jsx-a11y/anchor-has-content */
  return (
    <NextLink href={href}>
      <a {...props} />
    </NextLink>
  );
};
