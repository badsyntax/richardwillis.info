import React from 'react';

export type ElementProps<E = HTMLDivElement> = React.DetailedHTMLProps<
  React.HTMLAttributes<E>,
  E
> & {
  as?: string;
};

export function Element<E>({
  as = 'div',
  children,
  ...rest
}: ElementProps<E>): React.ReactNode {
  return React.createElement(as, rest, children);
}
