import React from 'react';
import classNames from 'classnames/bind';
import STYLES from './Typography.module.css';
const classes = classNames.bind(STYLES);

import { Box } from '../Box/Box';

export type Variant = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type TypographyProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  as?: React.ElementType;
  variant?: Variant;
};

export const Typography: React.FunctionComponent<TypographyProps> = ({
  children,
  className,
  as = 'p',
  variant = as,
  ...rest
}) => {
  return (
    <Box<HTMLElement>
      className={classes(`variant-${variant}`, className)}
      as={as}
      {...rest}
    >
      {children}
    </Box>
  );
};
