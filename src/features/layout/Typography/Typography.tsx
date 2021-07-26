import React from 'react';
import classNames from 'classnames/bind';
import { Box } from '../Box/Box';

import STYLES from './Typography.module.scss';
const classes = classNames.bind(STYLES);

export type Variant = 'p' | 'h1' | 'h2' | 'h3' | 'prose';

export type TypographyProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  as?: React.ElementType;
  variant?: Variant;
};

export const Typography: React.FC<TypographyProps> = ({
  children,
  className,
  as = 'p',
  variant = as,
  ...rest
}) => {
  return (
    <Box<HTMLElement>
      className={classes('root', `variant-${variant}`, className)}
      as={as}
      {...rest}
    >
      {children}
    </Box>
    // <Project
    //   name="Gradle Tasks"
    //   description="A VS Code extension to list and run Gradle tasks."
    //   tech={['Java', 'TypeScript', 'gRPC', 'Node.js']}
    // />
  );
};
