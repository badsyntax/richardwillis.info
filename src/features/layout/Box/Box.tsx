import { CssComponent } from '@stitches/react/types/styled-component';
import classNames from 'classnames';
import React from 'react';
import { CSS } from '../../../styles/stitches.config';

export type BoxChildClasses = {
  [elementType: string]: string;
};

export type BoxProps<E = HTMLElement> = React.DetailedHTMLProps<
  React.HTMLAttributes<E>,
  E
> & {
  as?: React.ElementType;
  childClasses?: BoxChildClasses;
};

const classNameElementTypes = ['h1', 'h2', 'h3', 'a', 'hr', 'p'];

export function Box<E>({
  as = 'div',
  childClasses,
  children,
  ...rest
}: BoxProps<E>): React.ReactElement {
  const styledChildren = !!childClasses
    ? React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        if (classNameElementTypes.indexOf(child.type as string) === -1) {
          return child;
        }
        return React.cloneElement(child, {
          className: classNames(
            child.props.className,
            childClasses[child.type as string]
          ),
        });
      })
    : children;

  return React.createElement(as, rest, styledChildren);
}
