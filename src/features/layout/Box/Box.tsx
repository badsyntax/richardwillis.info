import React from 'react';

export type BoxProps<E = HTMLElement> = React.DetailedHTMLProps<
  React.HTMLAttributes<E>,
  E
> & {
  as?: React.ElementType;
};

export function Box<E>({
  as = 'div',
  children,
  ...rest
}: BoxProps<E>): React.ReactElement {
  return React.createElement(as, rest, children);
}
